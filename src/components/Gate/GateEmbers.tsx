import { useMemo, type CSSProperties } from 'react';

interface Ember {
  left: number;
  bottom: number;
  size: number;
  dx: number;
  duration: number;
  delay: number;
}

const EMBER_COUNT = 22;

/**
 * 22 drifting embers whose positions, sizes, sway amounts, and animation
 * offsets are randomized once per mount (useMemo). The legacy version called
 * `document.createElement` + `appendChild` in a loop with the `--dx` CSS
 * custom property set via `cssText`; JSX + inline style expresses the same
 * effect without spawn/cleanup machinery — the CSS keyframes in index.css
 * do all the actual animation work.
 */
export function GateEmbers() {
  const embers = useMemo<Ember[]>(
    () =>
      Array.from({ length: EMBER_COUNT }, () => ({
        left: 15 + Math.random() * 70,
        bottom: Math.random() * 35,
        size: 1 + Math.random() * 2.5,
        dx: (Math.random() - 0.5) * 80,
        duration: 3 + Math.random() * 3,
        delay: 0.5 + Math.random() * 5,
      })),
    [],
  );

  return (
    <>
      {embers.map((e, i) => (
        <div
          key={i}
          className="ember"
          style={
            {
              left: `${e.left}%`,
              bottom: `${e.bottom}%`,
              width: `${e.size}px`,
              height: `${e.size}px`,
              animationDuration: `${e.duration}s`,
              animationDelay: `${e.delay}s`,
              '--dx': `${e.dx}px`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}
