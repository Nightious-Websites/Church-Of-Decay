import { useEffect, useRef } from 'react';

/**
 * The watcher portrait (merken skull) plus a pair of offset glare nodes
 * whose absolute page position is re-computed from the image rect on `load`
 * and on every `resize`. The glare is a sibling — not a descendant — of the
 * watcher wrapper because its CSS blur + mix-blend-mode needs to stack above
 * the gate-inner layer rather than inside the watcher's own stacking context.
 */
export function EyeGlare() {
  const imgRef = useRef<HTMLImageElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    const glare = glareRef.current;
    if (!img || !glare) return;
    const place = () => {
      const r = img.getBoundingClientRect();
      glare.style.left = r.left + 0.495 * r.width + 'px';
      glare.style.top = r.top + 0.51 * r.height + 'px';
    };
    if (img.complete) place();
    else img.addEventListener('load', place);
    window.addEventListener('resize', place, { passive: true });
    return () => {
      img.removeEventListener('load', place);
      window.removeEventListener('resize', place);
    };
  }, []);

  return (
    <>
      <div className="gate-watcher" aria-hidden="true">
        <img
          ref={imgRef}
          className="gate-watcher-img"
          src="/assets/merken.webp"
          alt=""
          width="700"
          height="694"
          decoding="async"
        />
      </div>
      <div ref={glareRef} className="eye-glare" aria-hidden="true" />
    </>
  );
}
