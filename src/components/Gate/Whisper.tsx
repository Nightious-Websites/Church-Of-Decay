import { useEffect, useRef, useState } from 'react';
import { WHISPERS } from '../../lib/constants';

interface Props {
  /** When true, stops the cycling interval. The DOM stays mounted so the
   *  Gate's 1.8s dissolve transition can fade the whisper out with the
   *  rest of the gate; we just don't waste CPU swapping text behind the fade. */
  entered: boolean;
}

/**
 * Cycles the gate whisper on a 4s interval with a 650ms cross-fade through
 * opacity 0. The `.gate-whisper` class in index.css handles the opacity
 * transition; this component just flips the inline opacity value and swaps
 * textContent at the midpoint.
 */
export function Whisper({ entered }: Props) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const fadeTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (entered) return;
    const interval = window.setInterval(() => {
      setVisible(false);
      fadeTimerRef.current = window.setTimeout(() => {
        fadeTimerRef.current = undefined;
        setIdx((i) => (i + 1) % WHISPERS.length);
        setVisible(true);
      }, 650);
    }, 4000);
    return () => {
      clearInterval(interval);
      if (fadeTimerRef.current !== undefined) clearTimeout(fadeTimerRef.current);
    };
  }, [entered]);

  return (
    <div className="gate-whisper" style={{ opacity: visible ? 1 : 0 }}>
      {WHISPERS[idx]}
    </div>
  );
}
