import { useEffect, useRef } from 'react';

const STRIP_H = 320;
const COUNT = 20;
const FRAME_MS = 1000 / 24;

class Particle {
  x = 0; y = 0; vx = 0; vy = 0;
  size = 1; life = 0; maxLife = 1;
  drift = 0; driftSpeed = 0;
}

/**
 * A strip of drifting embers along the bottom edge. The canvas was pre-React
 * appended to `document.body`; it now mounts as a React-managed sibling of
 * the stage so teardown is tied to component unmount.
 *
 * Frame rate is capped at ~24fps (FRAME_MS) — embers drift slowly and the
 * extra frames are imperceptible, so we save CPU for the rest of the scene.
 * The rAF loop is paused when the tab is hidden so backgrounded sessions
 * aren't burning battery.
 */
export function EmbersCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = STRIP_H;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const resetParticle = (p: Particle) => {
      p.x = Math.random() * canvas.width;
      p.y = STRIP_H + 8;
      p.vy = -(0.35 + Math.random() * 0.55);
      p.vx = (Math.random() - 0.5) * 0.25;
      p.size = 1 + Math.random() * 1.8;
      p.life = 0;
      p.maxLife = 0.6 + Math.random() * 0.4;
      p.drift = Math.random() * Math.PI * 2;
      p.driftSpeed = 0.015 + Math.random() * 0.02;
    };
    const makeParticle = (): Particle => {
      const p = new Particle();
      resetParticle(p);
      p.life = Math.random();
      return p;
    };
    const particles: Particle[] = Array.from({ length: COUNT }, makeParticle);

    let raf = 0;
    let lastDraw = 0;
    const draw = (ts: number) => {
      raf = requestAnimationFrame(draw);
      if (ts - lastDraw < FRAME_MS) return;
      lastDraw = ts;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.life += 0.004;
        p.drift += p.driftSpeed;
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.drift) * 0.35;
        if (p.life > p.maxLife || p.y < -10) {
          resetParticle(p);
          continue;
        }
        const t = p.life / p.maxLife;
        const alpha = t < 0.2 ? t / 0.2 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
        const hue = 22 - t * 14;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - t * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 100%, 62%, ${alpha * 0.55})`;
        ctx.fill();
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} id="embers" aria-hidden="true" />;
}
