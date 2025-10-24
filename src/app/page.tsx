"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CakeSlice, Gift } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),
  age: z.coerce.number().int().positive("Please enter a valid age."),
  message: z.string().min(10, "Message should be at least 10 characters."),
});

export default function Home() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Rupali Das",
      age: 30,
      message: "Many many happy returns of the day! Wishing you all the best on your special day. 🎉",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams({
      name: values.name,
      age: values.age.toString(),
      message: values.message,
    });
    router.push(`/wish?${params.toString()}`);
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-0 left-0 -z-0 h-full w-full bg-gradient-to-br from-primary/20 via-transparent to-accent/20"></div>
      <Card className="z-10 w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <div className="mb-2 flex items-center justify-center gap-4">
            <Gift className="h-8 w-8 text-accent" />
            <CardTitle className="font-headline text-3xl">Birthday Wish Creator</CardTitle>
            <CakeSlice className="h-8 w-8 text-accent" />
          </div>
          <CardDescription>
            Create a personalized birthday wish with a special touch.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Celebrant's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Rupali Das" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age they are turning</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="E.g., 30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personalized Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your warm wishes..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter className="p-0 pt-6">
                <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
                   {form.formState.isSubmitting ? "Creating..." : "Create Magical Wish"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
