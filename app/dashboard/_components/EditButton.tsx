// src/components/EditButton.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EditIcon } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Switch } from '@/components/ui/switch';

interface EditButtonProps {
    link?: {
        _id: Id<"links">; url: string; note?: string; privacy?: boolean
    };
    onClose: () => void;
}

const linkSchema = z.object({
    url: z.string().url("Invalid URL").nonempty("URL is required"),
    note: z.string().optional(),
    privacy: z.boolean()
});

const EditButton: React.FunctionComponent<EditButtonProps> = ({ link, onClose }) => {
    const [editingLink, setEditingLink] = useState(link || null);
    const updateLink = useMutation(api.linkSaver.update);

    const form = useForm<z.infer<typeof linkSchema>>({
        resolver: zodResolver(linkSchema),
        defaultValues: {
            url: link?.url || "",
            note: link?.note || "",
            privacy: link?.privacy 
        },
    });

    const { handleSubmit, formState: { errors }, reset, setValue } = form;

    const onSubmit = async (values: z.infer<typeof linkSchema>) => {
        try {
            if (editingLink) {
                await updateLink({ id: editingLink._id, url: values.url, note: values.note ?? '', privacy: values.privacy });
                toast.success("Link updated successfully");
            } else {
                toast.success("Link added successfully");
            }
            onClose();
        } catch (error: any) {
            console.log(error);
            toast.error(error instanceof ConvexError ? error.data : "Unexpected error occurred");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={'icon'} className="h-7 w-7">
                    <EditIcon size={17} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editingLink ? "Edit URL Link" : "Add URL Link"}</DialogTitle>
                    <DialogDescription>
                        {editingLink ? "Edit the link details below and click save when you're done." : "Add a new link by filling out the form below and click save when you're done."}
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
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditButton;