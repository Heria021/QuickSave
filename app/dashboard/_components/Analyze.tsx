'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slack } from 'lucide-react';
import { fetchDiffbotAnalyze } from '@/lib/fetchDiffbotAnalyze';
import { DiffbotResponse } from '@/types/DiffbotData';

interface DiffbotDialogProps {
    url: string;
}

const AnalyzeDialog = ({ url }: DiffbotDialogProps) => {
    const [data, setData] = useState<DiffbotResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchDiffbotAnalyze(url);
            setData(result);
        } catch (error) {
            console.error('Error fetching Diffbot data:', error);
            setError('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && url) {
            fetchData();
        }
    }, [isOpen, url]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="icon" className="h-7 w-7" onClick={() => setIsOpen(true)}>
                    <Slack size={17} />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-4">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{data?.title || 'Analyze'}</DialogTitle>
                    <DialogDescription>
                        <p className='line-clamp-2'>{data?.objects?.[0]?.text || 'Detailed analysis of the provided URL.'}</p>
                    </DialogDescription>
                </DialogHeader>
                {loading && <div>Loading...</div>}
                {error && <div>{error}</div>}
                {!loading && !error && data && (
                    <div className="flex gap-4">
                        <div className="flex-1 p-4 border-r border-gray-200">
                            {data.objects?.[0]?.images?.[0]?.url && (
                                <img 
                                    src={data.objects[0].images[0].url} 
                                    alt={data.title || 'Image'} 
                                    className="w-full h-auto" 
                                />
                            )}
                            {data.objects?.[0]?.naturalHeight && (
                                <p className="mt-2"><strong>Height:</strong> {data.objects[0].naturalHeight}px</p>
                            )}
                            {data.objects?.[0]?.naturalWidth && (
                                <p><strong>Width:</strong> {data.objects[0].naturalWidth}px</p>
                            )}
                            {data.objects?.[0]?.duration && (
                                <p><strong>Duration:</strong> {data.objects[0].duration}</p>
                            )}
                        </div>
                        <div className="flex-1 p-4">
                            {data.objects?.[0]?.author && (
                                <p><strong>Author:</strong> {data.objects[0].author}</p>
                            )}
                            {data.objects?.[0]?.pageUrl && (
                                <p><strong>Page URL:</strong> <a href={data.objects[0].pageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{data.objects[0].pageUrl}</a></p>
                            )}
                            {data.objects?.[0]?.text && (
                                <p><strong>Description:</strong> {data.objects[0].text}</p>
                            )}
                            {data.objects?.[0]?.viewCount && (
                                <p><strong>View Count:</strong> {data.objects[0].viewCount}</p>
                            )}
                            {data.objects?.[0]?.socialMedia?.twitter && (
                                <p><strong>Twitter:</strong> <a href={data.objects[0].socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{data.objects[0].socialMedia.twitter}</a></p>
                            )}
                            {data.objects?.[0]?.socialMedia?.facebook && (
                                <p><strong>Facebook:</strong> <a href={data.objects[0].socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{data.objects[0].socialMedia.facebook}</a></p>
                            )}
                            {data.objects?.[0]?.socialMedia?.linkedin && (
                                <p><strong>LinkedIn:</strong> <a href={data.objects[0].socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{data.objects[0].socialMedia.linkedin}</a></p>
                            )}
                            {data.objects?.[0]?.video?.[0]?.url && (
                                <a href={data.objects[0].video[0].url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Watch Video</a>
                            )}
                            {data.objects?.[0]?.relatedArticles?.map((article: { url: string | undefined; title: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }, index: React.Key | null | undefined) => (
                                <p key={index}><strong>Related Article:</strong> <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{article.title}</a></p>
                            ))}
                            {data.objects?.[0]?.reviews?.map((review: { reviewer: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; rating: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; text: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; date: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }, index: React.Key | null | undefined) => (
                                <div key={index} className="mt-2">
                                    <p><strong>Review by:</strong> {review.reviewer}</p>
                                    <p><strong>Rating:</strong> {review.rating}</p>
                                    <p><strong>Review:</strong> {review.text}</p>
                                    <p><strong>Date:</strong> {review.date}</p>
                                </div>
                            ))}
                            {data.objects?.[0]?.citation?.map((cite: { url: string | undefined; title: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; date: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }, index: React.Key | null | undefined) => (
                                <div key={index} className="mt-2">
                                    <p><strong>Citation:</strong> <a href={cite.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{cite.title}</a></p>
                                    <p><strong>Date:</strong> {cite.date}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AnalyzeDialog;