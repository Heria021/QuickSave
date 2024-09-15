'use client'
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import React, { useContext } from 'react';
import ShareCard from '../_components/ShareCard';
import { showBar } from '../layout';

type Props = {
  params: {
    share: Id<'Share'>;
  };
};

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

const Page = ({ params: { share } }: Props) => {

  const { value, setValue } = useContext(showBar);


  console.log(share)
  if (!share) {
    return <div>Invalid share ID</div>;
  }

  const publinks = useQuery(api.ShareLinks.getPublicLinks, { id: share });

  return (
    <div className="p-4">
      {!publinks || publinks.length === 0 ? (
        <div className=' flex items-center justify-center w-full h-[80vh]'>
          <p>Empty Collection</p>
        </div>
      ) : (
        <div className={`grid gap-4 grid-cols-1 md:grid-cols-3 ${value ? 'lg:grid-cols-4' : 'lg:grid-cols-5'}`}>
          {publinks.map((link: Link) => (
            <ShareCard
              key={link._id}
              link={link}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Page;