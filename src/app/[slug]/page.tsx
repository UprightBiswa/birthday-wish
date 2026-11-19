import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import BirthdayPage from '@/components/birthday/birthday-page';
import { PEOPLE, getPerson } from '@/lib/people';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PEOPLE.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPerson((await params).slug);
  if (!p) return {};
  const title = `Happy Birthday, ${p.name}`;
  const description = `Something made just for you, ${p.shortName}. Open it with the sound on.`;
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description, type: 'website', images: [{ url: p.ogImage, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: [p.ogImage] },
  };
}

export async function generateViewport({ params }: Props): Promise<Viewport> {
  const p = getPerson((await params).slug);
  return { themeColor: p?.themeColor ?? '#0e0a07' };
}

export default async function Page({ params }: Props) {
  const p = getPerson((await params).slug);
  if (!p) notFound();
  return <BirthdayPage person={p} />;
}
