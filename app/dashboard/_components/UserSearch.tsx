'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Form, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useConvex, useQuery } from 'convex/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, User, UsersRound } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useMutationState } from '@/hooks/useMutationState';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';

const searchSchema = z.object({
  searchTerm: z.string().min(1, "Search term is required"),
});

type SearchFormValues = z.infer<typeof searchSchema>;

interface User {
  _id: Id<"users">;
  _creationTime: number;
  username: string;
  imageUrl: string;
  clerkId: string;
  email: string;
}

export function UserSearch() {
  const { mutate: createShare, pending } = useMutationState(api.ShareCollection.createShare);
  const { mutate: createMember } = useMutationState(api.ShareCollection.createMember);
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchTerm: "",
    },
  });

  const { control, watch } = form;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [userStatus, setUserStatus] = useState<{ [key: string]: boolean }>({});
  const searchTerm = watch('searchTerm');
  const convex = useConvex();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchTerm) {
        setUsers([]);
        return;
      }

      setLoading(true);

      try {
        const result = await convex.query(api.userSearch.userSearch, { searchString: searchTerm });
        setUsers(result ?? []);
        console.log(result);

        // Fetch user email status
        const userStatuses = await Promise.all(
          result.map(async (user: User) => {
            const contentStatus = await convex.query(api.contentUpdate.getContent, { email: user.email });
            return { [user.email]: contentStatus?.content || false };
          })
        );

        setUserStatus(Object.assign({}, ...userStatuses));
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchTerm, convex]);

  const handleShare = async (r_email: string) => {
    try {
      await createShare({ r_email });
      toast.success("Collection shared successfully");
    } catch (error: any) {
      console.log(error);
      toast.error(error instanceof ConvexError ? error.data : "Unexpected error occurred");
    }
  };

  const handleMember = async (s_email: string) => {
    try {
      await createMember({ s_email });
      toast.success("Collection shared successfully");
    } catch (error: any) {
      console.log(error);
      toast.error(error instanceof ConvexError ? error.data : "Unexpected error occurred");
    }
  };

  return (
    <>
      <Form {...form}>
        <form className="grid gap-4 py-4" onSubmit={(e) => e.preventDefault()} >
          <FormItem>
            <FormLabel>Search Username or email</FormLabel>
            <FormControl>
              <Controller
                name="searchTerm"
                control={control}
                render={({ field }) => (
                  <Input
                    id="searchTerm"
                    placeholder="username or email"
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
              />
            </FormControl>
          </FormItem>
        </form>
      </Form>
      {loading && (
        <div className="flex items-center space-x-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-32" />
        </div>
      )}
      <div className="">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="flex items-center justify-between truncate mb-2">
              <div key={user._id} className="flex items-center gap-4 truncate">
                <Avatar className='w-10 h-10 overflow-hidden rounded-full'>
                  <AvatarImage src={user.imageUrl} className='h-full w-full object-cover' />
                  <AvatarFallback>
                    <User size={24} />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col truncate">
                  <h4>{user.username}</h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="">
                {
                  userStatus[user.email] ?
                    <div className="flex justify-center items-center gap-2">
                      <Button onClick={() => handleMember(user.email)} className='h-8 w-8' variant={'outline'}>
                        <div className="flex items-center justify-center">
                          <UsersRound size={18} />
                        </div>
                      </Button>
                      <Button onClick={() => handleShare(user.email)} className='h-8 w-8' variant={'outline'}>
                        <div className="flex items-center justify-center">
                          <Plus size={18} />
                        </div>
                      </Button>
                    </div>
                    :
                    <Button onClick={() => handleShare(user.email)} className='h-8 w-8' variant={'outline'}>
                      <div className="flex items-center justify-center">
                        <Plus size={18} />
                      </div>
                    </Button>
                }
              </div>
            </div>
          ))
        ) : (
          !loading && <p className='text-center'>No results found</p>
        )}
      </div>
    </>
  );
}