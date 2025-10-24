'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a custom confetti animation based on a name and age.
 *
 * The flow takes a name and age as input and returns a data URI representing the confetti animation.
 * @file
 * - generateConfettiAnimation - A function that generates a confetti animation.
 * - GenerateConfettiAnimationInput - The input type for the generateConfettiAnimation function.
 * - GenerateConfettiAnimationOutput - The return type for the generateConfettiAnimation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateConfettiAnimationInputSchema = z.object({
  name: z.string().describe('The name of the birthday celebrant.'),
  age: z.number().describe('The age of the birthday celebrant.'),
});

export type GenerateConfettiAnimationInput = z.infer<
  typeof GenerateConfettiAnimationInputSchema
>;

const GenerateConfettiAnimationOutputSchema = z.object({
  animationDataUri: z
    .string()
    .describe(
      'A data URI representing the confetti animation.  It must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});

export type GenerateConfettiAnimationOutput = z.infer<
  typeof GenerateConfettiAnimationOutputSchema
>;

export async function generateConfettiAnimation(
  input: GenerateConfettiAnimationInput
): Promise<GenerateConfettiAnimationOutput> {
  return generateConfettiAnimationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConfettiAnimationPrompt',
  input: {schema: GenerateConfettiAnimationInputSchema},
  output: {schema: GenerateConfettiAnimationOutputSchema},
  prompt: `Create a confetti animation data URI for {{name}}, who is turning {{age}} years old.  The animation should be encoded as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. The animation should be visually appealing and celebratory, suitable for inclusion on a birthday wish screen.  The animation should include confetti with the primary color Festive purple (#A06CD5), background color Light lavender (#E6E0ED), and accent color Bright magenta (#D56CA0).

  Ensure the output is a valid data URI.
  `,
});

const generateConfettiAnimationFlow = ai.defineFlow(
  {
    name: 'generateConfettiAnimationFlow',
    inputSchema: GenerateConfettiAnimationInputSchema,
    outputSchema: GenerateConfettiAnimationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
