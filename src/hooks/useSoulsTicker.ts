import { useEffect, type RefObject } from 'react';
import { restartAnimation } from '../lib/dom';

const BASE_SOULS = 6631;
const TICK_MS = 2400;

/**
 * Writes a slowly-climbing congregation count into the ref'd element on a
 * 2400ms interval, with a brief `.pulsing` class restart on each change. The
 * imperative `textContent` write avoids forcing a React re-render of the
 * topbar every 2.4s for what amounts to a single text node.
 */
export function useSoulsTicker(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let souls = BASE_SOULS + Math.floor(Math.random() * 40);
    el.textContent = souls.toLocaleString();

    const id = window.setInterval(() => {
      const prev = souls;
      if (Math.random() < 0.35) souls += Math.random() < 0.5 ? 1 : 0;
      if (Math.random() < 0.05) souls -= 1;
      if (souls !== prev) {
        el.textContent = souls.toLocaleString();
        restartAnimation(el, 'pulsing');
        el.addEventListener(
          'animationend',
          () => el.classList.remove('pulsing'),
          { once: true },
        );
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [ref]);
}
