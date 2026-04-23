import { useEffect, useRef, useState } from 'react';

/**
 * Brief CRT-static intro on the gate canvas — 325ms of rAF-driven per-pixel
 * noise, then a 375ms fade-out via `opacity: 0`, then unmount. The canvas is
 * removed from the tree after the fade so it can't be queried by stale
 * selectors later.
 */
export function GateStatic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 320;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const duration = 325;
    let start: number | null = null;
    let raf = 0;
    let fadeTimer: number | undefined;

    const drawNoise = (ts: number) => {
      if (start === null) start = ts;
      if (ts - start >= duration) {
        setFading(true);
        fadeTimer = window.setTimeout(() => setMounted(false), 375);
        return;
      }
      const img = ctx.createImageData(320, 180);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = v;
        d[i + 1] = (v * 0.09) | 0;
        d[i + 2] = (v * 0.07) | 0;
        d[i + 3] = Math.random() > 0.22 ? 255 : 15;
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(drawNoise);
    };
    raf = requestAnimationFrame(drawNoise);
    return () => {
      cancelAnimationFrame(raf);
      if (fadeTimer !== undefined) clearTimeout(fadeTimer);
    };
  }, []);

  if (!mounted) return null;
  return (
    <canvas
      ref={canvasRef}
      className="gate-static"
      style={fading ? { opacity: 0 } : undefined}
    />
  );
}
