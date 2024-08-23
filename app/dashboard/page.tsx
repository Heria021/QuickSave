'use client';
import React, { useContext } from 'react';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import Link from 'next/link';
import { Id } from '@/convex/_generated/dataModel';
import LinkCard from './_components/LinkCard';
import AddLink from './_components/AddButton';
import { showBar } from './layout';

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

const LinksPage = () => {
    const links = useQuery(api.linkSaver.get) || [];
    const { value, setValue } = useContext(showBar);

    return (
        <div className="p-4">
            {links.length === 0 ? (
                <div className={"w-full h-[80vh] flex items-center justify-center"}>
                    <AddLink useCase={false} />
                </div>
            ) : (
                <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${value ? 'lg:grid-cols-4' : 'lg:grid-cols-5'}`}>
                    {links.map((link: Link) => (
                        <LinkCard
                            key={link._id}
                            link={link}
                        />
                    ))}
                </div>
            )}
        </div>

    );
};

export default LinksPage;

