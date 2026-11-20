"use client";

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Person } from '@/lib/people';

type Stamp = NonNullable<Person['stamps']>['items'][number];

const ROT = [-8, 6, -4, 9, -10, 5, -6, 8];
const INK = ['#f06278', '#2f8f87', '#c2551f', '#3a5fb0'];

export default function PassportStamps({ items, onAllStamped }: { items: Stamp[]; onAllStamped: () => void }) {
  const [stamped, setStamped] = useState<boolean[]>(() => items.map((s) => !!s.visited));
  const [active, setActive] = useState<number | null>(null);
  const fired = useRef(false);
  const count = stamped.filter(Boolean).length;

  useEffect(() => {
    if (count === items.length && !fired.current) {
      fired.current = true;
      setTimeout(onAllStamped, 500);
    }
  }, [count, items.length, onAllStamped]);

  const stamp = (i: number) => {
    setActive(i);
    if (stamped[i]) return;
    setStamped((s) => {
      const n = [...s];
      n[i] = true;
      return n;
    });
    if (navigator.vibrate) navigator.vibrate(25);
  };

  const shown = active !== null ? items[active] : null;

  return (
    <div>
      {/* passport page */}
      <div className="relative rounded-[18px] bg-paper p-4 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)] sm:p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[18px] opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #14262f 0 1px, transparent 1px 12px), repeating-linear-gradient(-45deg, #14262f 0 1px, transparent 1px 12px)',
          }}
        />
        <div className="relative mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-[#6b7a83]">
          <span>Visas</span>
          <span>
            {count}/{items.length} stamped
          </span>
        </div>
        <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((s, i) => {
            const ink = INK[i % INK.length];
            const on = stamped[i];
            return (
              <button
                key={s.code}
                type="button"
                onClick={() => stamp(i)}
                aria-label={on ? `${s.place}: ${s.note}` : `Stamp ${s.place}`}
                className={cn(
                  'relative flex aspect-square items-center justify-center rounded-xl border-2 border-dashed outline-none transition-colors',
                  on ? 'border-transparent' : 'border-[#14262f]/15 hover:border-[#14262f]/35',
                  active === i && 'bg-[#14262f]/[0.04]'
                )}
              >
                {on ? (
                  <span
                    className="stamp-in flex h-[82%] w-[82%] flex-col items-center justify-center rounded-full border-[3px] text-center mix-blend-multiply"
                    style={{ color: ink, borderColor: ink, ['--rot' as string]: `${ROT[i % ROT.length]}deg` }}
                  >
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-80">
                      {s.visited ? 'Visited' : 'Next'}
                    </span>
                    <span className="font-display text-2xl leading-none sm:text-3xl">{s.code}</span>
                    <span className="mt-0.5 max-w-[90%] truncate text-[9px] font-semibold uppercase tracking-wider">
                      {s.place}
                    </span>
                  </span>
                ) : (
                  <span className="flex flex-col items-center text-[#14262f]/40">
                    <span className="font-display text-xl">{s.code}</span>
                    <span className="mt-1 text-[9px] uppercase tracking-[0.2em]">tap to stamp</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-6 min-h-[3rem] text-center text-cream/75" aria-live="polite">
        {shown ? (
          <>
            <span className="font-display text-2xl italic text-gold">{shown.place}.</span>{' '}
            <span className="text-sm">{shown.note}</span>
          </>
        ) : (
          <span className="text-sm text-cream/45">Tap an empty spot to stamp it.</span>
        )}
      </p>
      {count === items.length && (
        <p className="text-center text-sm text-gold">Passport full. Time to buy a new one.</p>
      )}
    </div>
  );
}
