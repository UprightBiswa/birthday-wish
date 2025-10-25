import { Suspense } from 'react';
import WishPageContent from '@/components/wish-page-content';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-4 text-center p-4">
                 <h1 className="animate-pulse font-headline text-4xl font-bold text-primary-foreground">A special wish is being created...</h1>
                 <p className="text-primary-foreground/80">Please wait while we add the magic!</p>
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
