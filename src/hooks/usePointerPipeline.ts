import { useEffect } from 'react';

type PointerHandler = (x: number, y: number) => void;

// Module-scope state: a single document-level mousemove listener feeds an
// rAF-coalesced tick that invokes every subscriber in turn. Putting `{x, y}`
// in React state/context would re-render every consumer at 60Hz during any
// cursor motion; keeping the pipeline imperative costs zero React work.
const subscribers = new Set<PointerHandler>();
let mx = 0;
let my = 0;
let pending = false;
let listenerAttached = false;

const tick = (): void => {
  pending = false;
  for (const cb of subscribers) cb(mx, my);
};

const onMove = (e: MouseEvent): void => {
  mx = e.clientX;
  my = e.clientY;
  if (!pending) {
    pending = true;
    requestAnimationFrame(tick);
  }
};

function subscribePointer(cb: PointerHandler): () => void {
  subscribers.add(cb);
  if (!listenerAttached) {
    document.addEventListener('mousemove', onMove, { passive: true });
    listenerAttached = true;
  }
  return () => {
    subscribers.delete(cb);
    if (subscribers.size === 0 && listenerAttached) {
      document.removeEventListener('mousemove', onMove);
      listenerAttached = false;
    }
  };
}

/**
 * Subscribes a handler to the shared rAF-coalesced pointer pipeline. Every
 * subscriber is invoked at most once per frame with the latest clientX/Y.
 *
 * The handler is held in a ref internally so the subscription doesn't churn
 * when the caller's closure identity changes between renders.
 */
export function useSubscribePointer(cb: PointerHandler): void {
  useEffect(() => {
    return subscribePointer(cb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
