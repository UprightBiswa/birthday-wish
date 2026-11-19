"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, MicOff, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const CANDLES = 7;
const CANDLE_COLORS = ['#f2c46d', '#ff7a2f', '#f6ecdc', '#e9a3a3', '#f2c46d', '#ff7a2f', '#f6ecdc'];

type Props = { onAllOut: () => void };

export default function CandleGame({ onAllOut }: Props) {
  const [lit, setLit] = useState<boolean[]>(() => Array(CANDLES).fill(true));
  const [puffs, setPuffs] = useState<number[]>([]);
  const [micOn, setMicOn] = useState(false);
  const [micError, setMicError] = useState('');
  const doneRef = useRef(false);
  const micCleanup = useRef<(() => void) | null>(null);

  const remaining = lit.filter(Boolean).length;

  const blow = useCallback((i: number) => {
    setLit((prev) => {
      if (!prev[i]) return prev;
      const next = [...prev];
      next[i] = false;
      return next;
    });
    setPuffs((p) => [...p, i]);
    if (navigator.vibrate) navigator.vibrate(18);
  }, []);

  const blowRandom = useCallback(() => {
    setLit((prev) => {
      const on = prev.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
      if (!on.length) return prev;
      const pick = on[Math.floor(Math.random() * on.length)];
      const next = [...prev];
      next[pick] = false;
      setPuffs((p) => [...p, pick]);
      return next;
    });
  }, []);

  useEffect(() => {
    if (remaining === 0 && !doneRef.current) {
      doneRef.current = true;
      micCleanup.current?.();
      setMicOn(false);
      setTimeout(onAllOut, 350);
    }
  }, [remaining, onAllOut]);

  useEffect(() => () => micCleanup.current?.(), []);

  const toggleMic = async () => {
    if (micOn) {
      micCleanup.current?.();
      setMicOn(false);
      return;
    }
    setMicError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const data = new Uint8Array(analyser.fftSize);
      let raf = 0;
      let loudFrames = 0;
      let cooldown = 0;

      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (const v of data) sum += ((v - 128) / 128) ** 2;
        const rms = Math.sqrt(sum / data.length);
        if (cooldown > 0) cooldown--;
        loudFrames = rms > 0.18 ? loudFrames + 1 : 0;
        if (loudFrames > 4 && cooldown === 0) {
          blowRandom();
          cooldown = 12;
        }
        raf = requestAnimationFrame(tick);
      };
      tick();

      micCleanup.current = () => {
        cancelAnimationFrame(raf);
        stream.getTracks().forEach((t) => t.stop());
        ctx.close();
        micCleanup.current = null;
      };
      setMicOn(true);
    } catch {
      setMicError("Couldn't get the mic. Just tap the flames instead.");
    }
  };

  const relight = () => {
    doneRef.current = false;
    setPuffs([]);
    setLit(Array(CANDLES).fill(true));
  };

  return (
    <div className="flex flex-col items-center">
      {/* cake */}
      <div className="relative mt-16 select-none" style={{ width: 'min(84vw, 340px)' }}>
        {/* warm glow behind */}
        <div
          className={cn(
            'absolute -inset-10 -top-24 rounded-full bg-[radial-gradient(closest-side,rgba(255,150,60,0.35),transparent)] transition-opacity duration-700',
            remaining === 0 ? 'opacity-0' : 'opacity-100'
          )}
        />

        {/* candles */}
        <div className="relative z-10 flex items-end justify-center gap-[5%] px-[10%]">
          {lit.map((on, i) => (
            <button
              key={i}
              type="button"
              aria-label={on ? `Blow out candle ${i + 1}` : `Candle ${i + 1} is out`}
              onClick={() => blow(i)}
              className="relative flex h-24 w-8 items-end justify-center outline-none"
            >
              <span
                className="relative block w-[10px] rounded-t-[3px]"
                style={{
                  height: 44 + (i % 2) * 8,
                  background: `repeating-linear-gradient(135deg, ${CANDLE_COLORS[i]} 0 6px, rgba(255,255,255,0.75) 6px 10px)`,
                }}
              >
                <span className="absolute -top-[6px] left-1/2 h-[7px] w-[2px] -translate-x-1/2 bg-[#3a2a1e]" />
                <span className={cn('flame -mb-[4px]', !on && 'out')} style={{ bottom: 'calc(100% + 4px)' }} />
                {puffs.includes(i) && !on && <span className="smoke" style={{ bottom: 'calc(100% + 8px)' }} />}
              </span>
            </button>
          ))}
        </div>

        {/* cake body */}
        <div className="relative z-0 -mt-1">
          <div className="relative h-14 rounded-t-[18px] bg-[#f6ecdc]">
            {/* drips */}
            <div className="absolute inset-x-0 top-full flex justify-around px-3">
              {[22, 34, 18, 40, 26, 30, 20].map((h, k) => (
                <span key={k} className="w-4 rounded-b-full bg-[#f6ecdc]" style={{ height: h }} />
              ))}
            </div>
          </div>
          <div className="h-24 bg-gradient-to-b from-[#6b3b22] to-[#4a2616]" />
          <div className="h-2 bg-[#f2c46d]/80" />
          <div className="h-16 rounded-b-[10px] bg-gradient-to-b from-[#5a2f1b] to-[#3b1f12]" />
          <div className="mx-[-8%] h-3 rounded-full bg-[#2a1d14] shadow-[0_18px_40px_-10px_rgba(0,0,0,0.8)]" />
        </div>
      </div>

      {/* status */}
      <p className="mt-8 h-6 text-sm tracking-wide text-cream/70" aria-live="polite">
        {remaining === CANDLES && 'Tap each flame to blow it out'}
        {remaining > 0 && remaining < CANDLES && `${remaining} to go. Keep blowing!`}
        {remaining === 0 && 'Wish locked in. No take-backs.'}
      </p>

      <div className="mt-5 flex items-center gap-3">
        {remaining > 0 ? (
          <button
            type="button"
            onClick={toggleMic}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors',
              micOn
                ? 'border-ember bg-ember/15 text-ember'
                : 'border-cream/20 text-cream/80 hover:border-cream/40 hover:text-cream'
            )}
          >
            {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            {micOn ? 'Listening... blow!' : 'Or actually blow (mic)'}
          </button>
        ) : (
          <button
            type="button"
            onClick={relight}
            className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-4 py-2 text-sm text-cream/80 transition-colors hover:border-cream/40 hover:text-cream"
          >
            <RotateCcw className="h-4 w-4" /> Light them again
          </button>
        )}
      </div>
      {micError && <p className="mt-3 text-xs text-ember/90">{micError}</p>}
    </div>
  );
}
