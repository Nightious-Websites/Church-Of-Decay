import { useRef, type RefObject } from 'react';
import { useSubscribePointer } from './usePointerPipeline';

const DRIP_COOLDOWN_MS = 180;
const DRIP_SPAWN_PROB = 0.2;
const DRIP_LIFETIME_MS = 2600;
const MAX_DRIPS = 12;

/**
 * Spawns short-lived `.drip` divs that fall from the cursor. Gated three
 * ways: cooldown, probability, and a hard cap on concurrent drips. Drips
 * live in the passed container ref (a `.drip-layer` sibling of the stage
 * managed by React) rather than `document.body.appendChild` so they're torn
 * down with their host component rather than surviving across HMR.
 */
export function useCursorDrips(
  containerRef: RefObject<HTMLDivElement | null>,
): void {
  const lastTsRef = useRef(0);
  const activeRef = useRef(0);

  useSubscribePointer((x, y) => {
    const container = containerRef.current;
    if (!container) return;
    const now = performance.now();
    if (
      now - lastTsRef.current < DRIP_COOLDOWN_MS ||
      Math.random() >= DRIP_SPAWN_PROB ||
      activeRef.current >= MAX_DRIPS
    ) {
      return;
    }
    lastTsRef.current = now;
    activeRef.current++;

    const d = document.createElement('div');
    d.className = 'drip';
    d.style.left = x + (Math.random() - 0.5) * 8 + 'px';
    d.style.top = y + 'px';
    container.appendChild(d);
    window.setTimeout(() => {
      d.remove();
      activeRef.current--;
    }, DRIP_LIFETIME_MS);
  });
}
