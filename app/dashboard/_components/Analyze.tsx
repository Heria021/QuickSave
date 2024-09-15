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
import { LoaderPinwheelIcon, Slack } from 'lucide-react';
import { fetchDiffbotAnalyze } from '@/lib/fetchDiffbotAnalyze';

interface DiffbotDialogProps {
    url: string;
}

const AnalyzeDialog = ({ url }: DiffbotDialogProps) => {
    const [data, setData] = useState<any | null>(null);  
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

const renderKeyValuePairs = (obj: any) => {
    return Object.entries(obj).map(([key, value], index) => {
        if (typeof value === 'object' && !Array.isArray(value)) {
            return (
                <div key={index} className="mb-4 p-2 bg-gray-50 rounded-md">
                    <strong className="text-gray-700">{key}:</strong>
                    <div className="ml-4">{renderKeyValuePairs(value)}</div>
                </div>
            );
        } 

        else if (Array.isArray(value)) {
            return (
                <div key={index} className="mb-4 p-2 bg-gray-50 rounded-md">
                    <strong className="text-gray-700">{key}:</strong>
                    <div className="ml-4">
                        {value.map((item, idx) => (
                            <div key={idx} className="ml-4">
                                {typeof item === 'object' ? renderKeyValuePairs(item) : item}
                            </div>
                        ))}
                    </div>
                </div>
            );
        } 

        else if (typeof value === 'string' && value.match(/\.(jpeg|jpg|gif|png)$/)) {
            return (
                <div key={index} className="mb-4 p-2 bg-gray-50 rounded-md">
                    <strong className="text-gray-700">{key}:</strong>
                    <div className="ml-4">
                        <img src={value} alt={key} className="max-w-full h-auto rounded-md shadow-sm" />
                    </div>
                </div>
            );
        } 

        else {
            return (
                <div key={index} className="mb-2">
                    <strong className="text-gray-700">{key}:</strong> <span className="ml-2">{String(value)}</span>
                </div>
            );
        }
    });
};

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger asChild>
                <Button size="icon" className="h-7 w-7" onClick={() => setIsOpen(true)}>
                    <Slack size={17} />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-4 overflow-scroll max-h-[80vh] ">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{data?.title || 'Analyze'}</DialogTitle>
                    <DialogDescription>
                        <p className="line-clamp-2">
                            {data?.objects?.[0]?.description || 'Detailed analysis of the provided URL.'}
                        </p>
                    </DialogDescription>
                </DialogHeader>
                {loading && <div><LoaderPinwheelIcon className=' animate-spin '/></div>}
                {error && <div>{error}</div>}
                {!loading && !error && data && (
                    <div className="mt-4">
                        {renderKeyValuePairs(data)}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AnalyzeDialog;