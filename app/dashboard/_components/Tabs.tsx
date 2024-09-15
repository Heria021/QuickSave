import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useConvex } from "convex/react";
import { Minus, User } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Permissions from "./Permissions";
import { showBar } from "../layout";

interface Share {
  _id: Id<"Share">;
  _creationTime: number;
  s_email: string;
  r_email: string;
}

interface UserWithShareId {
  _id: string;
  _creationTime: number;
  username: string;
  email: string;
  imageUrl: string;
  shareId: Id<"Share">;
}

interface UserWithAddedId {
  _id: string;
  _creationTime: number;
  username: string;
  email: string;
  imageUrl: string;
  addedId: Id<"Share">;
}

export function TabSection() {
  const allShares = useQuery(api.ShareCollection.getShares) || [];
  const allAdded = useQuery(api.ShareCollection.getAdded) || [];

  const removeLink = useMutation(api.ShareCollection.removeShare);
  const convex = useConvex();

  const [users, setUsers] = useState<UserWithShareId[]>([]);
  const [addedUsers, setAddedUsers] = useState<UserWithAddedId[]>([]);
  const [shareLoading, setShareLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(true);
  
  const { value, setValue } = useContext(showBar);

  const handleDelete = async (id: Id<"Share">) => {
    try {
      await removeLink({ id });
    } catch (error) {
      console.error('Error removing link:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userPromises = allShares.map(async (share: Share) => {
          try {
            const user = await convex.query(api.utils.getUserByEmail, { email: share.r_email });
            if (user) {
              return { ...user, shareId: share._id };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching user by email ${share.r_email}:`, error);
            return null;
          }
        });

        const userData = await Promise.all(userPromises);
        setUsers(userData.filter(user => user !== null) as UserWithShareId[]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setShareLoading(false);
      }
    };

    fetchUsers();
  }, [allShares, convex]);

  useEffect(() => {
    const fetchAddedUsers = async () => {
      try {
        const addedUserPromises = allAdded.map(async (added: Share) => {
          try {
            const user = await convex.query(api.utils.getUserByEmail, { email: added.s_email });
            if (user) {
              return { ...user, addedId: added._id };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching user by email ${added.r_email}:`, error);
            return null;
          }
        });

        const addedUserData = await Promise.all(addedUserPromises);
        setAddedUsers(addedUserData.filter(user => user !== null) as UserWithAddedId[]);
      } catch (error) {
        console.error("Error fetching added user data:", error);
      } finally {
        setAddLoading(false);
      }
    };

    fetchAddedUsers();
  }, [allAdded, convex]);

  if (shareLoading || addLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Tabs defaultValue="add-section" className="w-full px-4 h-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="add-section">Added</TabsTrigger>
        <TabsTrigger value="share-section">Shared</TabsTrigger>
      </TabsList>

      {/* Shared Section */}
      <TabsContent value="share-section" className="h-full">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Share Overview</CardTitle>
            <CardDescription>
              A summary of people who can view and access your public collections.
            </CardDescription>
          </CardHeader>
          <hr className=" mx-2 mb-4" />
          <CardContent className="space-y-2 flex-grow">
            {users.length === 0
              ?
              <div className="w-full h-full flex items-center justify-center flex-col gap-2 ">
                <Permissions/>
                <p>Share With Friends</p>
              </div>
              :
              <>
                {users.map((user) => (
                  <div key={user._id} className="border border-border rounded-md p-2 shadow-sm flex items-center justify-between truncate">
                    <div className="flex items-center gap-4 truncate">
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
                    <div>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button onClick={() => handleDelete(user.shareId)} className='h-7 w-6' variant={'outline'}>
                            <div className="flex items-center justify-center">
                              <Minus size={15} />
                            </div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-red-600">Remove</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </>
            }
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Added Section */}
      <TabsContent value="add-section" className="h-full">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Add Overview</CardTitle>
            <CardDescription>
              A summary of people who have been added to your collections.
            </CardDescription>
          </CardHeader>
          <hr className=" mx-2 mb-4" />
          <CardContent className="space-y-2 flex-grow">
            {addedUsers.length === 0
              ?
              <div className="w-full h-full flex items-center justify-center gap-2">
                <p>Empty</p>
              </div>
              :
              <>
                {addedUsers.map((user) => (
                  <Link href={`/dashboard/${user.addedId}`} key={user._id} onClick={()=>{window.innerWidth <= 640 && setValue(false)}}>
                    <div className="border border-border rounded-md p-2 mb-2 shadow-sm flex items-center justify-between truncate cursor-pointer">
                      <div className="flex items-center gap-4 truncate">
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
                      <div>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button onClick={() => handleDelete(user.addedId)} className='h-7 w-6' variant={'outline'}>
                              <div className="flex items-center justify-center">
                                <Minus size={15} />
                              </div>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="text-red-600">Remove</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </Link>
                ))}
              </>
            }

          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}