import { Suspense } from 'react';
import WishPageContent from '@/components/wish-page-content';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 text-center">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
                <Skeleton className="h-10 w-[150px]" />
            </div>
        </div>
    )
}


export default function WishPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <WishPageContent />
        </Suspense>
    );
}
