import { useForm, FormProvider, Controller } from "react-hook-form";
import { useMutation, useQuery } from "convex/react";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { api } from "@/convex/_generated/api";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

const Preference = () => {
    const {user} = useUser();
    const contentStatus = useQuery(api.contentUpdate.getContent, {email: user?.emailAddresses[0].emailAddress || ''})

    console.log(contentStatus);

    const methods = useForm({ defaultValues: { privacy: contentStatus?.content } });
    const { control, setValue } = methods;

    useEffect(() => {
        if (contentStatus) {
            setValue("privacy", contentStatus.content);
        }
    }, [contentStatus, setValue]);

    const updateContent = useMutation(api.contentUpdate.contentUpdate);

    const handleSwitchChange = async (checked: boolean) => {
        setValue("privacy", checked);
        try {
            await updateContent({ content: checked });
        } catch (error) {
            console.error("Failed to update privacy setting:", error);
        }
    };

    return (
        <FormProvider {...methods}>
            <form>
                <div>
                    <Controller
                        name="privacy"
                        control={control}
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                                <div className="font-medium text-[13px]">Password</div>
                                <div className="flex gap-4">
                                    <FormControl className="flex items-center">
                                        <Switch
                                            id="privacy"
                                            checked={field.value}
                                            onCheckedChange={handleSwitchChange}
                                        />
                                    </FormControl>
                                    <FormLabel
                                        className={`flex items-center text-xs ${!field.value ? 'text-red-600' : 'text-green-700'}`}
                                        style={{ margin: 0 }}
                                    >
                                        {field.value ? 'Public' : 'Private'}
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </FormProvider>
    );
};

export default Preference;