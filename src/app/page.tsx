"use client";

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import Confetti from 'react-confetti';
import { ArrowDown, Play, Volume2, VolumeX } from 'lucide-react';
import { useWindowSize } from '@/hooks/use-window-size';
import { cn } from '@/lib/utils';
import BirthdayTune from '@/components/suman/birthday-tune';
import Embers from '@/components/suman/embers';
import Reveal from '@/components/suman/reveal';
import PhotoStack, { type Photo } from '@/components/suman/photo-stack';
import CandleGame from '@/components/suman/candle-game';

const NAME = 'Suman';
const BASE = '/suman';

const HERO = `${BASE}/instappa-post-DFLPnQJTO9v-1.jpg`;
const REEL = `${BASE}/instappa-reel-DSsDAn3DK5d.mp4`;

const PHOTOS: Photo[] = [
  { src: HERO, caption: 'campfire chef', position: '55% 40%' },
  { src: `${BASE}/instappa-post-DKKL623TNDR-1.jpg`, caption: 'waterfall mode: on', position: '50% 35%' },
  { src: `${BASE}/instappa-post-DfkS_hlmQkB-1.jpg`, caption: 'all dressed up', position: '50% 25%' },
];

const CONFETTI_COLORS = ['#f2c46d', '#ff7a2f', '#f6ecdc', '#e9a3a3', '#ffd28a'];

export default function SumanBirthday() {
  const [opened, setOpened] = useState(false);
  const [gateGone, setGateGone] = useState(false);
  const [music, setMusic] = useState(false);
  const [burst, setBurst] = useState(0);
  const [confettiOn, setConfettiOn] = useState(false);
  const { width, height } = useWindowSize();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const celebrate = useCallback(() => {
    setBurst((b) => b + 1);
    setConfettiOn(true);
  }, []);

  const open = () => {
    setOpened(true);
    setMusic(true);
    celebrate();
    setTimeout(() => setGateGone(true), 900);
  };

  // lock scroll while the gate is up
  useEffect(() => {
    document.body.style.overflow = gateGone ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [gateGone]);

  const playReel = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play();
  };

  return (
    <main className="grain relative min-h-screen bg-night text-cream selection:bg-ember/40">
      <BirthdayTune playing={music} />

      {confettiOn && width > 0 && (
        <Confetti
          key={burst}
          width={width}
          height={height}
          numberOfPieces={260}
          recycle={false}
          gravity={0.22}
          colors={CONFETTI_COLORS}
          onConfettiComplete={() => setConfettiOn(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 70, pointerEvents: 'none' }}
        />
      )}

      {/* ---------- GATE ---------- */}
      {!gateGone && (
        <div
          className={cn(
            'fixed inset-0 z-50 flex flex-col items-center justify-center bg-night px-6 text-center transition-all [transition-duration:900ms] [transition-timing-function:cubic-bezier(.7,0,.2,1)]',
            opened && 'pointer-events-none scale-110 opacity-0'
          )}
        >
          <Embers count={14} />
          <div className="glow-breathe absolute h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(255,122,47,0.35),transparent)]" />
          <p className="relative text-[11px] uppercase tracking-[0.35em] text-cream/50">Something for</p>
          <h1 className="relative mt-3 font-display text-6xl italic text-cream sm:text-7xl">{NAME}</h1>
          <button
            type="button"
            onClick={open}
            className="pulse-ring relative mt-12 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold tracking-wide text-night transition-transform hover:scale-[1.03] active:scale-95"
          >
            Open it
          </button>
          <p className="relative mt-6 text-xs text-cream/35">sound on, please</p>
        </div>
      )}

      {/* ---------- HERO ---------- */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <Image
          src={HERO}
          alt={`${NAME} by the campfire`}
          fill
          priority
          sizes="100vw"
          className={cn(
            'object-cover transition-transform [transition-duration:2400ms] ease-out',
            opened ? 'scale-100' : 'scale-110'
          )}
          style={{ objectPosition: '58% 30%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-night/60 to-transparent md:from-night/80" />
        <Embers />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-20 sm:pb-24 md:px-10">
          <p
            className={cn(
              'mb-4 text-[11px] uppercase tracking-[0.35em] text-gold/90 transition-all delay-500 duration-1000',
              opened ? 'opacity-100' : 'translate-y-3 opacity-0'
            )}
          >
            Today is all yours
          </p>
          <h2 className="font-display leading-[0.88] text-cream">
            <span className="block text-[13vw] italic sm:text-7xl md:text-8xl">
              {opened &&
                'Happy birthday,'.split('').map((ch, i) => (
                  <span key={i} className="letter-in" style={{ animationDelay: `${600 + i * 35}ms` }}>
                    {ch === ' ' ? ' ' : ch}
                  </span>
                ))}
            </span>
            <span className="block text-[26vw] tracking-tight sm:text-[10rem] md:text-[13rem]">
              {opened &&
                NAME.split('').map((ch, i) => (
                  <span
                    key={i}
                    className="letter-in bg-gradient-to-b from-[#ffe2a8] via-gold to-ember bg-clip-text text-transparent"
                    style={{ animationDelay: `${1200 + i * 90}ms` }}
                  >
                    {ch}
                  </span>
                ))}
            </span>
          </h2>
          <a
            href="#letter"
            className={cn(
              'mt-8 inline-flex items-center gap-2 text-sm text-cream/70 transition-all [transition-delay:2000ms] duration-1000 hover:text-cream',
              opened ? 'opacity-100' : 'opacity-0'
            )}
          >
            <ArrowDown className="h-4 w-4 animate-bounce" /> scroll, there&apos;s more
          </a>
        </div>
      </section>

      {/* ---------- MARQUEE ---------- */}
      <div className="overflow-hidden border-y border-cream/10 py-4">
        <div className="marquee flex w-max gap-10 whitespace-nowrap font-display text-2xl italic text-cream/40">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-10">
              {['happy birthday', '✦', 'suman', '✦', 'another lap around the sun', '✦', 'eat the cake', '✦', 'make a wish', '✦'].map(
                (w, i) => (
                  <span key={i} className={w === '✦' ? 'text-gold/60' : ''}>
                    {w}
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- LETTER ---------- */}
      <section id="letter" className="relative px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-xl">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold/80">A few words</p>
          </Reveal>
          <Reveal delay={100}>
            <div className="relative mt-6 rotate-[-0.6deg] rounded-[4px] bg-paper px-7 py-10 text-[#2b1f16] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] sm:px-12 sm:py-14">
              <div className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[2deg] bg-gold/50" />
              <p className="font-display text-4xl italic">{NAME},</p>
              <div className="mt-6 space-y-5 text-[15.5px] leading-relaxed text-[#3d2e22]">
                <p>
                  Another year around the sun, and somehow you&apos;re still the calmest one at the campfire, the
                  guy quietly turning the skewer while everyone else is busy talking.
                </p>
                <p>
                  Thank you for the trips, the waterfalls, the late nights, and for showing up every single time it
                  mattered. You have a way of making ordinary days feel like something worth remembering.
                </p>
                <p>
                  I hope this year is kind to you. More mountains, more good food, more people who love you the way
                  you deserve. And whatever you wish for when you blow out those candles, I hope it finds you fast.
                </p>
                <p>Happy birthday. Eat too much cake.</p>
              </div>
              <p className="mt-8 text-right font-hand text-3xl text-[#8a4a22]">with love, always</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- PHOTOS ---------- */}
      <section className="relative overflow-hidden px-5 py-24 sm:py-32">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(242,196,109,0.10),transparent)]" />
        <div className="relative mx-auto max-w-5xl md:grid md:grid-cols-2 md:items-center md:gap-16">
          <Reveal className="mb-14 md:mb-0">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold/80">Evidence</p>
            <h3 className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl">
              Proof you&apos;ve been <span className="italic text-gold">living it up</span>.
            </h3>
            <p className="mt-5 max-w-sm text-cream/60">
              Campfires, waterfalls, nights out. Here&apos;s to a year with even more of these.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <PhotoStack photos={PHOTOS} />
          </Reveal>
        </div>
      </section>

      {/* ---------- REEL ---------- */}
      <section className="relative px-5 py-24 sm:py-32">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-14 md:flex-row-reverse md:justify-between">
          <Reveal className="text-center md:text-left">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold/80">Now playing</p>
            <h3 className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl">
              Main character <br className="hidden sm:block" />
              <span className="italic text-gold">energy.</span>
            </h3>
            <p className="mx-auto mt-5 max-w-sm text-cream/60 md:mx-0">Press play. The birthday song will wait.</p>
          </Reveal>

          <Reveal delay={150}>
            <div className="relative w-[min(72vw,300px)] rounded-[2.2rem] border border-cream/10 bg-coal p-2 shadow-[0_40px_80px_-30px_rgba(255,122,47,0.35)]">
              <div className="relative aspect-[9/16] overflow-hidden rounded-[1.8rem] bg-black">
                <video
                  ref={videoRef}
                  src={REEL}
                  playsInline
                  controls={videoPlaying}
                  preload="metadata"
                  className="h-full w-full object-cover"
                  onPlay={() => {
                    setVideoPlaying(true);
                    setMusic(false);
                  }}
                  onPause={() => setVideoPlaying(false)}
                  onEnded={() => setVideoPlaying(false)}
                />
                {!videoPlaying && (
                  <button
                    type="button"
                    onClick={playReel}
                    aria-label="Play video"
                    className="group absolute inset-0 flex items-center justify-center bg-night/30 transition-colors hover:bg-night/10"
                  >
                    <span className="pulse-ring flex h-16 w-16 items-center justify-center rounded-full bg-gold text-night transition-transform group-hover:scale-105 group-active:scale-95">
                      <Play className="ml-1 h-6 w-6 fill-current" />
                    </span>
                  </button>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- GAME ---------- */}
      <section className="relative overflow-hidden px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-xl text-center">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold/80">Your turn</p>
            <h3 className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl">
              Make a wish, <span className="italic text-gold">then blow.</span>
            </h3>
            <p className="mx-auto mt-5 max-w-sm text-cream/60">
              Close your eyes, think of it, don&apos;t tell anyone. Then put these out.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <CandleGame onAllOut={celebrate} />
          </Reveal>
        </div>
      </section>

      {/* ---------- OUTRO ---------- */}
      <section className="relative overflow-hidden px-5 pb-28 pt-20 text-center">
        <Embers count={12} />
        <Reveal>
          <p className="font-display text-[15vw] italic leading-none text-cream sm:text-8xl">
            Here&apos;s to <span className="text-gold">you</span>.
          </p>
        </Reveal>
        <Reveal delay={150}>
          <button
            type="button"
            onClick={celebrate}
            className="mt-12 rounded-full border border-gold/40 px-7 py-3 text-sm text-gold transition-colors hover:bg-gold hover:text-night active:scale-95"
          >
            One more round of confetti
          </button>
        </Reveal>
        <p className="mt-20 text-xs text-cream/30">made with love, just for {NAME}</p>
      </section>

      {/* ---------- MUSIC TOGGLE ---------- */}
      {gateGone && (
        <button
          type="button"
          onClick={() => setMusic((m) => !m)}
          aria-label={music ? 'Mute music' : 'Play music'}
          className="fixed bottom-5 right-5 z-40 flex h-12 items-center gap-2 rounded-full border border-cream/15 bg-night/70 px-4 text-cream/80 backdrop-blur-md transition-colors hover:text-cream"
        >
          {music ? (
            <>
              <span className="flex h-4 items-end gap-[3px]">
                {[0, 0.2, 0.4, 0.1].map((d, i) => (
                  <span key={i} className="bar block h-4 w-[3px] rounded-full bg-gold" style={{ animationDelay: `${d}s` }} />
                ))}
              </span>
              <Volume2 className="h-4 w-4" />
            </>
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </button>
      )}
    </main>
  );
}
