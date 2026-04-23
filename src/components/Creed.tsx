import { useRef } from 'react';
import { useCreedReveal } from '../hooks/useCreedReveal';

/**
 * The creed paragraph. Each `.line` span is lit in sequence once the user
 * has entered the nave AND the section scrolls into view — the reveal hook
 * gates on both signals. Before entry the lines render in the
 * opacity-0 stage layer; the staged fade-in only plays for users who
 * actually cross the gate.
 */
export function Creed({ entered }: { entered: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  useCreedReveal(sectionRef, entered);

  return (
    <section className="creed" ref={sectionRef}>
      <p>
        <span className="drop">M</span>
        <span className="line">erken is not dead, only dreaming.</span>
        <br />
        <span className="line">We are the worms in his marrow,</span>
        <br />
        <span className="line">the candles in his ribs,</span>
        <br />
        <span className="line">the song in his hollow throat.</span>
        <br />
        <span className="line">When he wakes — we shall be his teeth.</span>
      </p>
    </section>
  );
}
