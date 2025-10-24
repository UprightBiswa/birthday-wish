"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { generateConfettiAnimation } from '@/ai/flows/generate-confetti-animation';
import { useToast } from '@/hooks/use-toast';

type ConfettiDisplayProps = {
    name: string;
    age: number;
};

export default function ConfettiDisplay({ name, age }: ConfettiDisplayProps) {
    const [animationDataUri, setAnimationDataUri] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        let isMounted = true;
        async function fetchAnimation() {
            try {
                setIsLoading(true);
                const result = await generateConfettiAnimation({ name, age });
                if (isMounted && result.animationDataUri) {
                    setAnimationDataUri(result.animationDataUri);
                }
            } catch (error) {
                console.error("Failed to generate confetti animation:", error);
                if (isMounted) {
                    toast({
                        title: 'Animation Error',
                        description: 'Could not generate the custom confetti.',
                        variant: 'destructive',
                    });
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchAnimation();

        return () => {
            isMounted = false;
        };
    }, [name, age, toast]);

    if (isLoading) {
        return (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10">
                <p className="text-white animate-pulse">Generating Celebration...</p>
            </div>
        );
    }
    
    if (animationDataUri) {
        return (
            <Image
                src={animationDataUri}
                alt="Confetti animation"
                fill
                className="pointer-events-none z-20 object-cover"
            />
        );
    }

    return null;
}
