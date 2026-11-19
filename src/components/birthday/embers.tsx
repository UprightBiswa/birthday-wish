// Deterministic "random" so server and client render the same markup (no hydration mismatch).
function seeded(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export default function Embers({ count = 26 }: { count?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }, (_, i) => {
        // fixed precision so server + client produce identical strings
        const size = `${(2 + seeded(i) * 4).toFixed(1)}px`;
        return (
          <span
            key={i}
            className="ember"
            style={{
              left: `${(seeded(i + 100) * 100).toFixed(2)}%`,
              width: size,
              height: size,
              animationDuration: `${(7 + seeded(i + 200) * 9).toFixed(2)}s`,
              animationDelay: `${(-seeded(i + 300) * 14).toFixed(2)}s`,
              ['--drift' as string]: `${((seeded(i + 400) - 0.5) * 120).toFixed(1)}px`,
            }}
          />
        );
      })}
    </div>
  );
}
