"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import AudioPlayer from '@/components/audio-player';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Music, VolumeX } from 'lucide-react';
import CountdownTimer from '@/components/countdown-timer';

export default function Home() {
    const name = 'Debolina Modak';
    const age = 20;
    const message = "Happy Birthday to the best sister in the world! Wishing you a day as amazing as you are. ❤️";
    const birthday = new Date('2025-11-23T00:00:00');

    const [isBirthdayTime, setIsBirthdayTime] = useState(false);
    const [audioOn, setAudioOn] = useState(false);
    const { width, height } = useWindowSize();

    useEffect(() => {
        const checkBirthday = () => {
            const now = new Date();
            if (now >= birthday) {
                setIsBirthdayTime(true);
                // Auto-start music
                const timer = setTimeout(() => setAudioOn(true), 500);
                return () => clearTimeout(timer);
            }
        };

        checkBirthday();
        const interval = setInterval(checkBirthday, 1000);

        return () => clearInterval(interval);
    }, [birthday]);
    
    const images = {
        bg: PlaceHolderImages.find(p => p.id === 'birthday-background'),
        avatar: PlaceHolderImages.find(p => p.id === 'birthday-person-avatar'),
    };

    const nameInitials = useMemo(() => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }, [name]);

    return (
        <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4">
            {images.bg && (
                <Image
                    src={images.bg.imageUrl}
                    alt={images.bg.description}
                    fill
                    className="object-cover transition-all duration-1000 blur-sm brightness-50"
                    priority
                    data-ai-hint={images.bg.imageHint}
                />
            )}
            
            {isBirthdayTime ? (
                <>
                    {width > 0 && height > 0 && <Confetti width={width} height={height} recycle={true} numberOfPieces={200} />}
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
                                    <p className="text-xl text-primary-foreground/80">{age > 0 ? `Turning ${age}!` : ''}</p>
                                    <p className="pt-4 text-lg leading-relaxed text-primary-foreground/90">
                                        "{message}"
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="absolute bottom-4 right-4 z-30">
                        <Button variant="ghost" size="icon" onClick={() => setAudioOn(prev => !prev)} className="text-primary-foreground hover:bg-white/20 hover:text-white">
                            {audioOn ? <Music className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
                            <span className="sr-only">Toggle Music</span>
                        </Button>
                    </div>
                </>
            ) : (
                <CountdownTimer targetDate={birthday} name={name} age={age}/>
            )}
        </div>
    );
}
