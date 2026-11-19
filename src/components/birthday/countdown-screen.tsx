"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Embers from './embers';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
  };
}

type Props = {
  target: Date;
  shortName: string;
  hero: { src: string; alt: string; position: string };
  onDone: () => void;
};

export default function CountdownScreen({ target, shortName, hero, onDone }: Props) {
  const [left, setLeft] = useState(() => +target - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      const ms = +target - Date.now();
      setLeft(ms);
      if (ms <= 0) {
        clearInterval(id);
        onDone();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [target, onDone]);

  const t = split(left);
  const units: [string, number][] = [
    ['days', t.days],
    ['hours', t.hours],
    ['mins', t.mins],
    ['secs', t.secs],
  ];

  return (
    <main className="grain relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-night px-6 text-center text-cream">
      <Image
        src={hero.src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-110 object-cover opacity-30 blur-2xl"
        style={{ objectPosition: hero.position }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-night/40 via-night/70 to-night" />
      <Embers count={18} />

      <div className="relative z-10 flex flex-col items-center">
        <p className="letter-in text-[11px] uppercase tracking-[0.35em] text-gold/90" style={{ animationDelay: '100ms' }}>
          Not yet, {shortName}
        </p>
        <h1
          className="letter-in mt-5 max-w-md font-display text-5xl leading-[0.95] sm:text-6xl"
          style={{ animationDelay: '250ms' }}
        >
          Something&apos;s waiting <span className="italic text-gold">for you.</span>
        </h1>

        <div className="letter-in mt-12" style={{ animationDelay: '450ms' }}>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {units.map(([label, v]) => (
              <div
                key={label}
                className="flex w-[20vw] max-w-[110px] flex-col items-center rounded-2xl border border-cream/10 bg-coal/60 py-4 backdrop-blur-sm"
              >
                <span className="font-display text-4xl tabular-nums leading-none text-cream sm:text-6xl">
                  {String(v).padStart(2, '0')}
                </span>
                <span className="mt-2 text-[10px] uppercase tracking-[0.2em] text-cream/45">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="letter-in mt-10 text-sm text-cream/60" style={{ animationDelay: '650ms' }}>
          Opens at midnight, {target.getDate()} {MONTHS[target.getMonth()]}.
        </p>
        <p className="letter-in mt-1 text-xs text-cream/35" style={{ animationDelay: '750ms' }}>
          Keep this link. It unlocks by itself.
        </p>
      </div>
    </main>
  );
}
