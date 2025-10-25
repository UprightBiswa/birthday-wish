"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { PartyPopper } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';

export default function Home() {
    const router = useRouter();
    const [name, setName] = useState('Rupali Das');
    const [age, setAge] = useState('30');
    const [message, setMessage] = useState("Many many happy returns of the day! Wishing you all the best on your special day. 🎉");
    const [bgImage, setBgImage] = React.useState<ImagePlaceholder | undefined>(undefined);

    React.useEffect(() => {
        setBgImage(PlaceHolderImages.find(p => p.id === 'birthday-background'));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams({
            name,
            age,
            message,
        });
        router.push(`/wish?${params.toString()}`);
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4">
            {bgImage && (
                <Image
                    src={bgImage.imageUrl}
                    alt={bgImage.description}
                    fill
                    className="object-cover blur-md brightness-50"
                    priority
                    data-ai-hint={bgImage.imageHint}
                />
            )}
            <Card className="w-full max-w-md z-10 bg-card/80 backdrop-blur-sm animate-in fade-in zoom-in-90 duration-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-3xl">
                        <PartyPopper className="h-8 w-8 text-primary" />
                        Birthday Wish Creator
                    </CardTitle>
                    <CardDescription>
                        Create a personalized birthday celebration page.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Jane Doe"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="e.g., 30"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Personalized Message</Label>
                            <Textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="e.g., Wishing you a day filled with joy and laughter!"
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" size="lg">
                            Create Magical Wish
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
