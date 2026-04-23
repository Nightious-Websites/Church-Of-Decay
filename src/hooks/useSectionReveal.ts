import { useEffect, type RefObject } from 'react';

/**
 * Adds the `.section-revealed` class to the ref'd element when it scrolls
 * into view (threshold 0.1). One-shot — observer disconnects after the
 * first intersection so the class sticks.
 */
export function useSectionReveal(
  ref: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-revealed');
            io.disconnect();
          }
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}
