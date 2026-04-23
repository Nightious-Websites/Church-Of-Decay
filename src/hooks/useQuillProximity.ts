import { useEffect, useRef, type RefObject } from 'react';
import { useSubscribePointer } from './usePointerPipeline';

const NIB_OFFSET_X = 22;
const NIB_OFFSET_Y = 88;
const PROXIMITY = 120;
const HIDDEN_TRANSFORM = 'translate(-9999px, -9999px) rotate(0deg)';

/**
 * Moves the quill to follow the cursor when it's within PROXIMITY pixels of
 * the ledger stage's bounding box. The ledger rect is cached and only
 * invalidated on scroll/resize — `getBoundingClientRect` forces synchronous
 * layout, so calling it on every frame would thrash.
 *
 * When the ledger is in its `signed` state the quill hides regardless of
 * proximity; we look at the class on the stage element rather than wiring a
 * state prop through so the quill doesn't re-mount/re-subscribe on every
 * ledger state change.
 */
export function useQuillProximity(
  quillRef: RefObject<HTMLDivElement | null>,
  ledgerStageRef: RefObject<HTMLDivElement | null>,
): void {
  const rectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const invalidate = () => {
      rectRef.current = null;
    };
    window.addEventListener('scroll', invalidate, { passive: true });
    window.addEventListener('resize', invalidate, { passive: true });
    return () => {
      window.removeEventListener('scroll', invalidate);
      window.removeEventListener('resize', invalidate);
    };
  }, []);

  useSubscribePointer((x, y) => {
    const quill = quillRef.current;
    const stage = ledgerStageRef.current;
    if (!quill || !stage) return;

    if (stage.classList.contains('is-signed')) {
      document.body.classList.remove('near-ledger');
      quill.style.transform = HIDDEN_TRANSFORM;
      return;
    }

    if (!rectRef.current) rectRef.current = stage.getBoundingClientRect();
    const r = rectRef.current;
    const dx = Math.max(r.left - x, 0, x - r.right);
    const dy = Math.max(r.top - y, 0, y - r.bottom);
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < PROXIMITY) {
      document.body.classList.add('near-ledger');
      quill.style.transform = `translate(${x - NIB_OFFSET_X}px, ${y - NIB_OFFSET_Y}px) rotate(0deg)`;
    } else {
      document.body.classList.remove('near-ledger');
      quill.style.transform = HIDDEN_TRANSFORM;
    }
  });
}
