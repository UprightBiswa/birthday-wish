"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.number().min(1, 'Age must be at least 1'),
  birthday: z.string().min(1, 'Birthday date is required'),
  message: z.string().min(1, 'Message is required'),
  image: z.any().refine((file) => file?.length > 0, 'Image is required'),
  songUrl: z.string().min(1, 'Please select a song'),
  theme: z.string().min(1, 'Please select a theme'),
});

type FormData = z.infer<typeof formSchema>;

const songs = [
  { value: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', label: 'Happy Birthday Tune 1' },
  { value: 'https://example.com/song2.mp3', label: 'Happy Birthday Tune 2' },
];

const themes = [
  { value: 'dark-purple', label: 'Festive Purple', color: 'bg-purple-900 text-white' },
  { value: 'light-blue', label: 'Ocean Blue', color: 'bg-blue-200 text-blue-900' },
];

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wishLink, setWishLink] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const selectedTheme = watch('theme');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `images/${Date.now()}_${data.image[0].name}`);
      await uploadBytes(imageRef, data.image[0]);
      const imageUrl = await getDownloadURL(imageRef);

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'wishes'), {
        name: data.name,
        age: data.age,
        message: data.message,
        imageUrl,
        songUrl: data.songUrl,
        theme: data.theme,
        birthday: new Date(data.birthday),
      });

      // Generate link
      const link = `${window.location.origin}/wish/${docRef.id}`;
      setWishLink(link);
    } catch (error) {
      console.error('Error saving wish:', error);
      alert('Failed to create wish. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (wishLink) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Wish Created Successfully!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Share this link with your friend:</p>
            <Input value={wishLink} readOnly className="mt-2" />
            <Button onClick={() => navigator.clipboard.writeText(wishLink)} className="mt-4 w-full">
              Copy Link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create a Birthday Wish</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Recipient's Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="age">Recipient's Age</Label>
              <Input id="age" type="number" {...register('age', { valueAsNumber: true })} />
              {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
            </div>

            <div>
              <Label htmlFor="birthday">Birthday Date</Label>
              <Input id="birthday" type="date" {...register('birthday')} />
              {errors.birthday && <p className="text-red-500 text-sm">{errors.birthday.message}</p>}
            </div>

            <div>
              <Label htmlFor="message">Personalized Message</Label>
              <Textarea id="message" {...register('message')} />
              {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
            </div>

            <div>
              <Label htmlFor="image">Image Upload</Label>
              <Input id="image" type="file" accept="image/*" {...register('image')} />
              {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
            </div>

            <div>
              <Label>Song Selection</Label>
              <Select onValueChange={(value) => setValue('songUrl', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a song" />
                </SelectTrigger>
                <SelectContent>
                  {songs.map((song) => (
                    <SelectItem key={song.value} value={song.value}>
                      {song.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.songUrl && <p className="text-red-500 text-sm">{errors.songUrl.message}</p>}
            </div>

            <div>
              <Label>Theme</Label>
              <RadioGroup onValueChange={(value) => setValue('theme', value)}>
                {themes.map((theme) => (
                  <div key={theme.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={theme.value} id={theme.value} />
                    <Label htmlFor={theme.value}>{theme.label}</Label>
                    <div className={`w-4 h-4 rounded ${theme.color}`}></div>
                  </div>
                ))}
              </RadioGroup>
              {errors.theme && <p className="text-red-500 text-sm">{errors.theme.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Create Wish'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
