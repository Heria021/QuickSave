'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { boolean, z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { CirclePlus, Plus } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { ConvexError } from 'convex/values';
import { toast } from 'sonner';
import { useMutationState } from '@/hooks/useMutationState';
import { fetchDiffbotData } from '@/lib/fetchDiffbotData';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface Case {
  useCase: boolean;
}

const linkSchema = z.object({
  url: z.string().url("Invalid URL").nonempty("URL is required"),
  note: z.string().optional(),
  privacy: z.boolean().default(false),
});

type LinkFormValues = z.infer<typeof linkSchema>;

export default function AddLink({ useCase }: Case) {

  const { mutate: createRequest, pending } = useMutationState(api.linkSaver.create);

  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      url: "",
      note: "",
    }
  });

  const { handleSubmit, formState: { errors } } = form;

  const onSubmit = async (values: LinkFormValues) => {
    try {
      const data = await fetchDiffbotData(values.url);
      console.log('Fetched Data:', data);

      if (data) {
        const completeData = {
          url: values.url,
          note: values.note || '',
          pageurl: data.pageUrl || values.url,
          imageUrl: data.objects[0]?.images?.[0]?.url || "http://www.gspireproductions.com/images/photo-yellow-light.png",
          title: data.objects[0]?.title || 'Title',
          siteName: data.objects[0]?.siteName || values.url,
          privacy: values.privacy,
        };

        await createRequest(completeData)
          .then(() => {
            form.reset();
            toast.success("Link added successfully");
          })
          .catch((error: { data: any }) => {
            console.log(error);
            toast.error(error instanceof ConvexError ? error.data : "Unexpected error occurred");
          });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch data from Diffbot");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {useCase ?
          <Button variant="outline" size={'icon'} className="rounded-full p-2">
            <div className="flex items-center justify-center gap-2">
              <Plus size={20} strokeWidth={1.5} />
            </div>
          </Button>
          :
          <Button variant="ghost" className="border-border border hover:border-black py-9 px-11 cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <CirclePlus strokeWidth={1.2} size={26} />
              <h1 className="text-gray-700 text-sm font-normal">Add Link</h1>
            </div>
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add URL Link</DialogTitle>
          <DialogDescription>
            Add a new link by filling out the form below and click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      id="url"
                      placeholder="https://example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {errors.url && <p className="text-red-500">{errors.url.message}</p>}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Input
                      id="note"
                      placeholder="This link is about..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {errors.note && <p className="text-red-500">{errors.note.message}</p>}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="privacy"
              render={({ field }) => (
                <FormItem className="flex items-center gap-4"> 
                  <FormControl className="flex items-center">
                    <Switch
                      id="privacy"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel
                    className={`flex items-center ${!field.value ? 'text-red-600' : 'text-green-700'}`}
                    style={{ margin: 0 }} 
                  >
                    {field.value ? 'Public' : 'Private'}
                  </FormLabel>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={pending}>Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}