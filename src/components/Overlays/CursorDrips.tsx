import { useRef } from 'react';
import { useCursorDrips } from '../../hooks/useCursorDrips';

/**
 * Container for the short-lived `.drip` elements the pointer pipeline
 * spawns. Mounted as a fixed-position overlay so drips position relative
 * to the viewport and don't get clipped by the parallaxed scene.
 */
export function CursorDrips() {
  const containerRef = useRef<HTMLDivElement>(null);
  useCursorDrips(containerRef);
  return (
    <div
      ref={containerRef}
      className="drip-layer"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9998,
      }}
    />
  );
}
