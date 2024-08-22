import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'

const LinkCardSkeleton = () => {
  return (
    <div className="p-4 border rounded shadow hover:shadow-lg">
      <div className="mb-2 h-48 overflow-hidden rounded-md">
        <Skeleton className="w-full h-full" />
      </div>
      <div>
        <Skeleton className="h-4 w-1/2 mb-1" />
        <Skeleton className="h-3 w-1/3 mb-2" />
        <Skeleton className="h-3 w-3/4 mt-2" />
      </div>
      <div className="flex items-center justify-start gap-2 px-1 my-2">
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>
    </div>
  );
}

export default LinkCardSkeleton;