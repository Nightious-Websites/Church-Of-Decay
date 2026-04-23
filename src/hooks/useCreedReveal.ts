import { useEffect, type RefObject } from 'react';

/**
 * Stagger-lights `.line` spans inside the creed host once the section scrolls
 * into view — but only after the user has `entered` the nave. Without the
 * `entered` gate the IO would fire on mount (creed is near the top of the
 * viewport), the stagger would play inside the still-opacity-0 stage, and by
 * the time the user clicked Enter the lines would already be lit — losing
 * the staged reveal that is the whole point.
 *
 * Invariant: `entered` only flips false → true, never back.
 */
export function useCreedReveal(
  hostRef: RefObject<HTMLElement | null>,
  entered: boolean,
): void {
  useEffect(() => {
    if (!entered) return;
    const host = hostRef.current;
    if (!host) return;
    const lines = host.querySelectorAll<HTMLElement>('.line');
    if (!lines.length) return;

    const timeouts: number[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            lines.forEach((l, i) => {
              timeouts.push(window.setTimeout(() => l.classList.add('lit'), i * 500));
            });
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(host);
    return () => {
      io.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, [hostRef, entered]);
}
