import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Manrope, Caveat } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
});

const body = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
});

const hand = Caveat({
  subsets: ['latin'],
  variable: '--font-hand',
});

export const metadata: Metadata = {
  title: 'Happy Birthday, Suman',
  description: 'A little something, made just for you.',
};

export const viewport: Viewport = {
  themeColor: '#0e0a07',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${display.variable} ${body.variable} ${hand.variable}`}>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
