import { Plane } from 'lucide-react';
import type { Person } from '@/lib/people';

type Pass = NonNullable<Person['boardingPass']>;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] uppercase tracking-[0.25em] text-[#6b7a83]">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-[#14262f]">{value}</p>
    </div>
  );
}

// deterministic fake barcode
const BARS = Array.from({ length: 42 }, (_, i) => 1 + ((i * 7919) % 5 === 0 ? 3 : (i * 31) % 3));

export default function BoardingPass({ pass }: { pass: Pass }) {
  return (
    <div className="mx-auto w-full max-w-[560px] -rotate-[1.2deg] overflow-hidden rounded-[22px] bg-paper text-[#14262f] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)] sm:flex">
      {/* main */}
      <div className="flex-1 p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-ember">Boarding pass</p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#6b7a83]">Birthday Airways</p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-5xl leading-none">{pass.from.code}</p>
            <p className="mt-1 text-xs text-[#6b7a83]">{pass.from.city}</p>
          </div>
          <div className="relative flex flex-1 items-center">
            <span className="h-px flex-1 border-t border-dashed border-[#14262f]/30" />
            <span className="plane-fly mx-2 text-ember">
              <Plane className="h-5 w-5 rotate-45 fill-current" />
            </span>
            <span className="h-px flex-1 border-t border-dashed border-[#14262f]/30" />
          </div>
          <div className="text-right">
            <p className="font-display text-5xl leading-none">{pass.to.code}</p>
            <p className="mt-1 text-xs text-[#6b7a83]">{pass.to.city}</p>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-3 gap-4">
          <Field label="Passenger" value={pass.passenger} />
          <Field label="Flight" value={pass.flight} />
          <Field label="Gate" value={pass.gate} />
          <Field label="Seat" value={pass.seat} />
          <Field label="Boards" value={pass.boards} />
          <Field label="Class" value="First" />
        </div>
        <p className="mt-6 font-hand text-xl text-sign">{pass.note}</p>
      </div>

      {/* stub */}
      <div className="relative flex items-center justify-between gap-4 border-t border-dashed border-[#14262f]/20 bg-gold/25 px-6 py-4 sm:w-36 sm:flex-col sm:justify-center sm:border-l sm:border-t-0 sm:py-6">
        <div aria-hidden className="flex h-10 items-stretch gap-[2px]">
          {BARS.slice(0, 22).map((w, i) => (
            <span key={i} className="block bg-[#14262f]" style={{ width: w }} />
          ))}
        </div>
        <div className="text-right sm:text-center">
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#6b7a83]">Seat</p>
          <p className="font-display text-3xl leading-none">1A</p>
        </div>
      </div>
    </div>
  );
}
