import { useRef } from 'react';
import { useSoulsTicker } from '../hooks/useSoulsTicker';

/**
 * Static topbar chrome. The congregation count is driven imperatively by
 * `useSoulsTicker` via a ref — it fires every 2.4s and writes directly to
 * the DOM node to avoid re-rendering the whole topbar on each tick. The
 * `#souls` id is load-bearing because `#souls.pulsing` in index.css keys
 * the one-shot pulse animation off the id selector.
 */
export function Topbar() {
  const soulsRef = useRef<HTMLElement>(null);
  useSoulsTicker(soulsRef);
  return (
    <header className="topbar">
      <div className="mark">
        <svg
          className="mark-sigil"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ color: 'var(--blood-bright)' }}
        >
          <path
            d="M12 1 L14 6 L20 6 L15 10 L17 16 L12 13 L7 16 L9 10 L4 6 L10 6 Z"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
          />
          <circle cx="12" cy="11" r="2" fill="currentColor" />
        </svg>
        <span>Ordo Merkenii</span>
      </div>
      <div className="anno">
        <span>
          Anno Putredinis · <b>MMXXVI</b>
        </span>
        <span>
          Congregation · <b id="souls" ref={soulsRef}>—</b>
        </span>
      </div>
    </header>
  );
}
