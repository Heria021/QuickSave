// components/LinkCard.tsx
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { CopyPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import AnalyzeDialog from './Analyze';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { toast } from 'sonner';

interface Link {
    _id: Id<"links">;
    url: string;
    imageUrl?: string | null;
    pageurl?: string;
    siteName?: string;
    title?: string;
    note?: string;
    privacy: boolean;
}

interface LinkCardProps {
    link: Link;
}

const ShareCard = ({ link }: LinkCardProps) => {
    const [loading, setLoading] = useState(false);
    const createRequest = useMutation(api.linkSaver.create);

    const handleAddCard = async () => {
        setLoading(true);
        try {
            const completeData = {
                url: link.url,
                note: link.note || '',
                pageurl: link.pageurl || link.url,
                imageUrl: link.imageUrl || "http://www.gspireproductions.com/images/photo-yellow-light.png",
                title: link.title || 'Title',
                siteName: link.siteName || link.url,
                privacy: link.privacy,
            };
            
            await createRequest(completeData);
            toast.success("Link added successfully");
        } catch (error: any) {
            console.error(error);
            toast.error(error?.data || "Unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-4 border rounded shadow hover:shadow-lg">
            <div className="h-full flex flex-col justify-between">
                <div className="">
                    <div className="mb-2 h-48 overflow-hidden rounded-md">
                        <img
                            src={link.imageUrl || "http://www.gspireproductions.com/images/photo-yellow-light.png"}
                            alt="Article preview"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div>
                        <Link href={link.url}>
                            <div className="font-bold text-xs hover:underline cursor-pointer line-clamp-1">{link.title}</div>
                        </Link>
                        <div className="text-xs text-gray-500">{link.siteName}</div>
                        {link.note && <p className="mt-2 text-sm text-gray-600">{link.note}</p>}
                    </div>
                </div>

                <div className="flex items-center justify-between my-2">
                    <div className="flex items-center justify-start gap-3">
                        <Button
                            size={'icon'}
                            className="h-7 w-7"
                            onClick={handleAddCard}
                            disabled={loading}
                        >
                            <CopyPlus size={17} />
                        </Button>

                        <AnalyzeDialog url={link.url} />
                    </div>

                    <div>
                        <Badge className={`${!link.privacy ? 'bg-red-600' : 'bg-green-700'} `}>
                            {link.privacy ? 'Pub' : 'Pvt'}
                        </Badge>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ShareCard;