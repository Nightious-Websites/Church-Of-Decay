import { useEffect, type RefObject } from 'react';

/**
 * Pans the scene element upward as the page scrolls so the cathedral
 * backdrop drifts behind the foreground content. Layout values are cached
 * and re-read only on resize; reading `scrollHeight`/`offsetHeight` on every
 * scroll frame forces synchronous layout and tanks framerate on large pages.
 */
export function useParallaxScene(
  sceneRef: RefObject<HTMLDivElement | null>,
): void {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const sceneEl = sceneRef.current;
    if (!sceneEl) return;

    let maxScroll = 0;
    let panDistance = 0;
    const recompute = () => {
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      panDistance = sceneEl.offsetHeight - window.innerHeight;
    };
    recompute();

    let ticking = false;
    const updateScene = () => {
      ticking = false;
      if (maxScroll <= 0) return;
      const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      sceneEl.style.transform = `translate3d(0, ${-progress * panDistance}px, 0)`;
    };
    const schedule = () => {
      if (!ticking) {
        requestAnimationFrame(updateScene);
        ticking = true;
      }
    };
    const onResize = () => {
      recompute();
      schedule();
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    updateScene();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
    };
  }, [sceneRef]);
}
