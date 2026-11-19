import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Birthday wishes',
  robots: { index: false, follow: false },
};

// Deliberately lists nobody: each person gets their own private link (/suman, /debolina, ...).
export default function Home() {
  return (
    <main className="theme-ember grain flex min-h-[100svh] flex-col items-center justify-center bg-night px-6 text-center text-cream">
      <p className="text-[11px] uppercase tracking-[0.35em] text-gold/80">Birthday wishes</p>
      <h1 className="mt-4 max-w-md font-display text-5xl leading-[0.95] sm:text-6xl">
        Nothing to see <span className="italic text-gold">here.</span>
      </h1>
      <p className="mt-5 max-w-xs text-cream/55">If someone sent you a link, open that one. It was made just for you.</p>
    </main>
  );
}
