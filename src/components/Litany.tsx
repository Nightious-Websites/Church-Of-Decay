import { useRef } from 'react';
import { useSectionReveal } from '../hooks/useSectionReveal';

interface Commandment {
  num: string;
  title: string;
  text: string;
}

const COMMANDMENTS: readonly Commandment[] = [
  { num: 'I', title: 'De Carne', text: 'All flesh is borrowed. Return it with interest — with song, with suffering, with salt.' },
  { num: 'II', title: 'De Silentio', text: 'Speak only in the chapel, and only in whispers. The god hears best what is barely said.' },
  { num: 'III', title: 'De Vigilia', text: 'Keep a candle burning through the dark hours. A flame that fails is a vow unkept.' },
  { num: 'IV', title: 'De Sanguine', text: 'The red floor receives all. Do not wipe it clean; it is not stain, it is memory.' },
  { num: 'V', title: 'De Ossibus', text: 'Honour the bone above the flesh — for bone remembers shape long after the body forgets.' },
  { num: 'VI', title: 'De Somno', text: 'When Merken stirs in his sleep, kneel. When he breathes, chant. When he dreams of you, do not flinch.' },
];

export function Litany() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);
  return (
    <section className="litany" ref={sectionRef}>
      <div className="litany-head">
        <div className="eyebrow">Five Observances</div>
        <h2>The Litany of Rot</h2>
      </div>
      <div className="commandments">
        {COMMANDMENTS.map((c) => (
          <div className="cmd" key={c.num}>
            <div className="cmd-num">{c.num}</div>
            <div className="cmd-text">
              <b>{c.title}</b>
              {c.text}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
