"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import AudioPlayer from '@/components/audio-player';
import ConfettiDisplay from '@/components/confetti-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PartyPopper, Music, MusicOff } from 'lucide-react';

export default function WishPageContent() {
    const searchParams = useSearchParams();
    const name = searchParams.get('name') || 'Guest';
    const age = parseInt(searchParams.get('age') || '0', 10);
    const message = searchParams.get('message') || 'Have a great day!';

    const [celebrationStarted, setCelebrationStarted] = useState(false);
    const [audioOn, setAudioOn] = useState(true);
    const [images, setImages] = useState<{ bg: ImagePlaceholder | undefined; avatar: ImagePlaceholder | undefined }>({ bg: undefined, avatar: undefined });

    useEffect(() => {
        setImages({
            bg: PlaceHolderImages.find(p => p.id === 'birthday-background'),
            avatar: PlaceHolderImages.find(p => p.id === 'birthday-person-avatar'),
        });
    }, []);

    const nameInitials = useMemo(() => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }, [name]);


    const handleStart = async () => {
        setCelebrationStarted(true);
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {images.bg && (
                <Image
                    src={images.bg.imageUrl}
                    alt={images.bg.description}
                    fill
                    className={`object-cover transition-all duration-1000 ${celebrationStarted ? 'blur-sm brightness-50' : 'blur-md brightness-50'}`}
                    priority
                    data-ai-hint={images.bg.imageHint}
                />
            )}
            
            {!celebrationStarted && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 p-4 text-center">
                    <h1 className="animate-pulse font-headline text-4xl font-bold text-primary-foreground">A special wish is waiting...</h1>
                    <Button onClick={handleStart} size="lg">
                        <PartyPopper className="mr-2 h-5 w-5" />
                        Start the Celebration
                    </Button>
                </div>
            )}
            
            {celebrationStarted && (
                <>
                    <ConfettiDisplay name={name} age={age} />
                    <AudioPlayer isPlaying={audioOn} />

                    <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
                        <Card className="w-full max-w-md animate-in fade-in zoom-in-90 duration-1000 bg-card/80 backdrop-blur-sm">
                            <CardContent className="flex flex-col items-center p-8 text-center">
                                <Avatar className="mb-6 h-32 w-32 border-4 border-accent animate-in fade-in zoom-in-75 delay-200 duration-500">
                                    {images.avatar && (
                                        <AvatarImage src={images.avatar.imageUrl} alt={name} data-ai-hint={images.avatar.imageHint} />
                                    )}
                                    <AvatarFallback className="bg-primary/20 text-4xl">{nameInitials}</AvatarFallback>
                                </Avatar>

                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-10 delay-400 duration-700">
                                    <h2 className="font-headline text-5xl font-bold text-primary-foreground drop-shadow-lg">Happy Birthday!</h2>
                                    <p className="text-3xl font-semibold text-accent drop-shadow-md">{name}</p>
                                    <p className="text-xl text-primary-foreground/80">{age} Years of Awesome!</p>
                                    <p className="pt-4 text-lg leading-relaxed text-primary-foreground/90">
                                        "{message}"
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="absolute bottom-4 right-4 z-30">
                        <Button variant="ghost" size="icon" onClick={() => setAudioOn(prev => !prev)} className="text-primary-foreground hover:bg-white/20 hover:text-white">
                            {audioOn ? <Music className="h-6 w-6" /> : <MusicOff className="h-6 w-6" />}
                            <span className="sr-only">Toggle Music</span>
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
