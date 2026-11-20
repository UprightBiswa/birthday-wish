"use client";

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Confetti from 'react-confetti';
import { ArrowDown, Play, Volume2, VolumeX } from 'lucide-react';
import { useWindowSize } from '@/hooks/use-window-size';
import { cn } from '@/lib/utils';
import type { Person } from '@/lib/people';
import BirthdayTune from './birthday-tune';
import Embers from './embers';
import Reveal from './reveal';
import PhotoStack from './photo-stack';
import CandleGame from './candle-game';
import WishGrid from './wish-grid';
import CountdownScreen from './countdown-screen';
import BoardingPass from './boarding-pass';
import PassportStamps from './passport-stamps';

const COUNTDOWN_WINDOW_DAYS = 45;

type Phase = 'loading' | 'countdown' | 'party';

/** Local midnight of this year's birthday. */
function birthdayStart(p: Person, now: Date) {
  return new Date(now.getFullYear(), p.birthday.month - 1, p.birthday.day, 0, 0, 0);
}

function SectionHead({ eyebrow, title, text, center }: { eyebrow: string; title: [string, string]; text: string; center?: boolean }) {
  return (
    <>
      <p className="text-[11px] uppercase tracking-[0.35em] text-gold/80">{eyebrow}</p>
      <h3 className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl">
        {title[0]} <span className="italic text-gold">{title[1]}</span>
      </h3>
      <p className={cn('mt-5 max-w-sm text-cream/60', center && 'mx-auto')}>{text}</p>
    </>
  );
}

export default function BirthdayPage({ person: p }: { person: Person }) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [opened, setOpened] = useState(false);
  const [gateGone, setGateGone] = useState(false);
  const [music, setMusic] = useState(false);
  const [burst, setBurst] = useState(0);
  const [confettiOn, setConfettiOn] = useState(false);
  const { width, height } = useWindowSize();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [target, setTarget] = useState<Date | null>(null);

  // decide countdown vs party on the client (uses the viewer's local time)
  useEffect(() => {
    const now = new Date();
    const start = birthdayStart(p, now);
    const preview = new URLSearchParams(window.location.search).has('preview');
    const daysAway = (+start - +now) / 86_400_000;
    if (!preview && daysAway > 0 && daysAway <= COUNTDOWN_WINDOW_DAYS) {
      setTarget(start);
      setPhase('countdown');
    } else {
      setPhase('party');
    }
  }, [p]);

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

  const countdownDone = useCallback(() => setPhase('party'), []);

  useEffect(() => {
    document.body.style.overflow = phase === 'party' && !gateGone ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase, gateGone]);

  const marquee = useMemo(() => p.marquee.flatMap((w) => [w, '✦']), [p.marquee]);

  if (phase === 'loading') {
    return <main className={cn(`theme-${p.theme}`, 'min-h-[100svh] bg-night')} />;
  }

  if (phase === 'countdown' && target) {
    return (
      <div className={`theme-${p.theme}`}>
        <CountdownScreen target={target} shortName={p.shortName} hero={p.hero} onDone={countdownDone} />
      </div>
    );
  }

  return (
    <main className={cn(`theme-${p.theme}`, 'grain relative min-h-screen bg-night text-cream selection:bg-ember/40')}>
      <BirthdayTune playing={music} />

      {confettiOn && width > 0 && (
        <Confetti
          key={burst}
          width={width}
          height={height}
          numberOfPieces={260}
          recycle={false}
          gravity={0.22}
          colors={p.confetti}
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
          <div className="glow-breathe absolute h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgb(var(--c-ember)/0.35),transparent)]" />
          <p className="relative text-[11px] uppercase tracking-[0.35em] text-cream/50">Something for</p>
          <h1 className="relative mt-3 font-display text-6xl italic text-cream sm:text-7xl">{p.name}</h1>
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
          src={p.hero.src}
          alt={p.hero.alt}
          fill
          priority
          sizes="100vw"
          className={cn(
            'object-cover transition-transform [transition-duration:2400ms] ease-out [object-position:var(--pos)] md:[object-position:var(--pos-md)]',
            opened ? 'scale-100' : 'scale-110'
          )}
          style={{ ['--pos' as string]: p.hero.position, ['--pos-md' as string]: p.hero.positionDesktop ?? p.hero.position }}
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
            {p.eyebrow}
          </p>
          <h2 className="font-display leading-[0.88] text-cream">
            <span className="block text-[13vw] italic sm:text-7xl md:text-8xl">
              {opened &&
                p.heroLine.split('').map((ch, i) => (
                  <span key={i} className="letter-in" style={{ animationDelay: `${600 + i * 35}ms` }}>
                    {ch === ' ' ? ' ' : ch}
                  </span>
                ))}
            </span>
            <span
              className={cn(
                'block tracking-tight',
                p.name.length > 7 ? 'text-[19vw] sm:text-[8rem] md:text-[10.5rem]' : 'text-[26vw] sm:text-[10rem] md:text-[13rem]'
              )}
            >
              {opened &&
                p.name.split('').map((ch, i) => (
                  <span
                    key={i}
                    className="letter-in bg-gradient-to-b from-glow via-gold to-ember bg-clip-text text-transparent"
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
          {[0, 1].map((k) => (
            <div key={k} className="flex gap-10" aria-hidden={k === 1}>
              {marquee.map((w, i) => (
                <span key={i} className={w === '✦' ? 'text-gold/60' : ''}>
                  {w}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- BOARDING PASS ---------- */}
      {p.boardingPass && (
        <section className="relative overflow-hidden px-5 pt-24 sm:pt-32">
          <div className="mx-auto max-w-xl">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.35em] text-gold/80">Your ticket</p>
            </Reveal>
            <Reveal delay={120} className="mt-6">
              <BoardingPass pass={p.boardingPass} />
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------- LETTER ---------- */}
      <section id="letter" className="relative px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-xl">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold/80">A few words</p>
          </Reveal>
          <Reveal delay={100}>
            <div className="relative mt-6 rotate-[-0.6deg] rounded-[4px] bg-paper px-7 py-10 text-[#2b1f16] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] sm:px-12 sm:py-14">
              <div className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[2deg] bg-gold/50" />
              <p className="font-display text-4xl italic">{p.letter.greeting}</p>
              <div className="mt-6 space-y-5 text-[15.5px] leading-relaxed text-[#3d2e22]">
                {p.letter.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <p className="mt-8 text-right font-hand text-3xl text-sign">{p.letter.signoff}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- PHOTOS ---------- */}
      {p.photos && (
        <section className="relative overflow-hidden px-5 py-24 sm:py-32">
          <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--c-gold)/0.10),transparent)]" />
          <div className="relative mx-auto max-w-5xl md:grid md:grid-cols-2 md:items-center md:gap-16">
            <Reveal className="mb-14 md:mb-0">
              <SectionHead eyebrow={p.photos.eyebrow} title={p.photos.title} text={p.photos.text} />
            </Reveal>
            <Reveal delay={150}>
              <PhotoStack photos={p.photos.items} />
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------- PASSPORT GAME ---------- */}
      {p.stamps && (
        <section className="relative px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl">
            <Reveal className="mb-12">
              <SectionHead eyebrow={p.stamps.eyebrow} title={p.stamps.title} text={p.stamps.text} />
            </Reveal>
            <Reveal delay={150}>
              <PassportStamps items={p.stamps.items} onAllStamped={celebrate} />
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------- WISHES GAME ---------- */}
      {p.wishes && (
        <section className="relative px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl">
            <Reveal className="mb-12">
              <SectionHead eyebrow={p.wishes.eyebrow} title={p.wishes.title} text={p.wishes.text} />
            </Reveal>
            <Reveal delay={150}>
              <WishGrid items={p.wishes.items} onAllOpen={celebrate} />
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------- REEL ---------- */}
      {p.video && (
        <section className="relative px-5 py-24 sm:py-32">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-14 md:flex-row-reverse md:justify-between">
            <Reveal className="text-center md:text-left">
              <SectionHead eyebrow={p.video.eyebrow} title={p.video.title} text={p.video.text} center />
            </Reveal>

            <Reveal delay={150}>
              <div className="relative w-[min(72vw,300px)] rounded-[2.2rem] border border-cream/10 bg-coal p-2 shadow-[0_40px_80px_-30px_rgb(var(--c-ember)/0.35)]">
                <div className="relative aspect-[9/16] overflow-hidden rounded-[1.8rem] bg-black">
                  <video
                    ref={videoRef}
                    src={p.video.src}
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
                      onClick={() => videoRef.current?.play()}
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
      )}

      {/* ---------- CANDLE GAME ---------- */}
      <section className="relative overflow-hidden px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-xl text-center">
          <Reveal>
            <SectionHead
              eyebrow="Your turn"
              title={['Make a wish,', 'then blow.']}
              text="Close your eyes, think of it, don't tell anyone. Then put these out."
              center
            />
          </Reveal>
          <Reveal delay={150}>
            <CandleGame
              count={p.cake.candles}
              colors={p.cake.candleColors}
              topper={p.cake.topper}
              onAllOut={celebrate}
            />
          </Reveal>
        </div>
      </section>

      {/* ---------- OUTRO ---------- */}
      <section className="relative overflow-hidden px-5 pb-28 pt-20 text-center">
        <Embers count={12} />
        <Reveal>
          <p className="font-display text-[15vw] italic leading-none text-cream sm:text-8xl">
            {p.outro[0]} <span className="text-gold">{p.outro[1]}</span>.
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
        <p className="mt-20 text-xs text-cream/30">made with love, just for {p.shortName}</p>
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
