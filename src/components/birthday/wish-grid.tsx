"use client";

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export default function WishGrid({ items, onAllOpen }: { items: string[]; onAllOpen: () => void }) {
  const [open, setOpen] = useState<boolean[]>(() => items.map(() => false));
  const fired = useRef(false);
  const count = open.filter(Boolean).length;

  useEffect(() => {
    if (count === items.length && !fired.current) {
      fired.current = true;
      setTimeout(onAllOpen, 500);
    }
  }, [count, items.length, onAllOpen]);

  const flip = (i: number) => {
    setOpen((o) => {
      if (o[i]) return o;
      const n = [...o];
      n[i] = true;
      return n;
    });
    if (navigator.vibrate) navigator.vibrate(12);
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5 sm:gap-3">
        {items.map((wish, i) => (
          <button
            key={i}
            type="button"
            onClick={() => flip(i)}
            aria-label={open[i] ? wish : `Open wish ${i + 1}`}
            className={cn('flip aspect-[3/4] text-left outline-none', open[i] && 'is-open')}
          >
            <span className="flip-inner block">
              <span className="flip-face flex flex-col justify-between rounded-xl border border-gold/25 bg-coal p-2.5 transition-colors hover:border-gold/60">
                <span className="text-[10px] uppercase tracking-[0.2em] text-cream/40">no.</span>
                <span className="font-display text-4xl leading-none text-gold sm:text-5xl">{i + 1}</span>
              </span>
              <span className="flip-face flip-back flex items-center rounded-xl bg-paper p-2.5 text-[11px] font-medium leading-snug text-[#3d2e22] sm:text-[13px]">
                {wish}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-cream/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold to-ember transition-[width] duration-500"
            style={{ width: `${(count / items.length) * 100}%` }}
          />
        </div>
        <span className="w-14 text-right text-sm tabular-nums text-cream/60">
          {count}/{items.length}
        </span>
      </div>
      <p className="mt-3 h-5 text-sm text-gold" aria-live="polite">
        {count === items.length && `All ${items.length} are yours. Every single one.`}
      </p>
    </div>
  );
}
