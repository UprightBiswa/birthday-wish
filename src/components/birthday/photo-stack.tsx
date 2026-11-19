"use client";

import Image from 'next/image';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

import type { Photo } from '@/lib/people';

const TILTS = [-4, 3, -2, 5];

export default function PhotoStack({ photos }: { photos: Photo[] }) {
  const [order, setOrder] = useState(() => photos.map((_, i) => i));
  const [drag, setDrag] = useState(0);
  const [leaving, setLeaving] = useState<0 | 1 | -1>(0);
  const start = useRef<number | null>(null);

  const next = (dir: 1 | -1) => {
    if (leaving) return;
    setLeaving(dir);
    setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setLeaving(0);
      setDrag(0);
    }, 380);
  };

  const onDown = (e: React.PointerEvent) => {
    start.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (start.current === null) return;
    setDrag(e.clientX - start.current);
  };
  const onUp = () => {
    if (start.current === null) return;
    start.current = null;
    if (Math.abs(drag) > 70) next(drag > 0 ? 1 : -1);
    else if (Math.abs(drag) < 6) next(1); // a tap also flips
    else setDrag(0);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative aspect-[4/5] w-[min(78vw,340px)]">
        {order
          .slice()
          .reverse()
          .map((idx) => {
            const depth = order.indexOf(idx);
            const isTop = depth === 0;
            const p = photos[idx];
            const tilt = TILTS[idx % TILTS.length];
            let transform = `translate(${depth * 6}px, ${depth * 10}px) rotate(${tilt * (depth ? 1 : 0.4)}deg) scale(${1 - depth * 0.04})`;
            if (isTop && leaving) transform = `translate(${leaving * 130}%, -6%) rotate(${leaving * 22}deg)`;
            else if (isTop && drag) transform = `translate(${drag}px, 0) rotate(${drag / 18}deg)`;

            return (
              <figure
                key={idx}
                onPointerDown={isTop ? onDown : undefined}
                onPointerMove={isTop ? onMove : undefined}
                onPointerUp={isTop ? onUp : undefined}
                onPointerCancel={isTop ? onUp : undefined}
                className={cn(
                  'absolute inset-0 rounded-[6px] bg-paper p-3 pb-14 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.75)] touch-pan-y',
                  isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none',
                  start.current === null && 'transition-transform [transition-duration:380ms] [transition-timing-function:cubic-bezier(.2,.7,.2,1)]'
                )}
                style={{ transform, zIndex: photos.length - depth }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[3px] bg-coal">
                  <Image
                    src={p.src}
                    alt={p.caption}
                    fill
                    sizes="(max-width: 640px) 78vw, 340px"
                    className="object-cover"
                    style={{ objectPosition: p.position ?? 'center' }}
                    draggable={false}
                    priority={idx === 0}
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-3 text-center font-hand text-2xl text-[#3a2a1e]">
                  {p.caption}
                </figcaption>
              </figure>
            );
          })}
      </div>

      {photos.length > 1 && (
      <>
      <div className="mt-10 flex items-center gap-2">
        {photos.map((_, i) => (
          <span
            key={i}
            className={cn('h-1.5 rounded-full transition-all duration-300', order[0] === i ? 'w-6 bg-gold' : 'w-1.5 bg-cream/25')}
          />
        ))}
      </div>
      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-cream/40">Swipe or tap</p>
      </>
      )}
    </div>
  );
}
