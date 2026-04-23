const PENTAGRAM = (
  <svg viewBox="0 0 60 60">
    <circle cx="30" cy="30" r="26" />
    <path d="M 30 7 L 44 49.5 L 6.5 23 L 53.5 23 L 16 49.5 Z" />
  </svg>
);

const HEXAGRAM = (
  <svg viewBox="0 0 60 60">
    <path d="M 30 6 L 8.5 43 L 51.5 43 Z" />
    <path d="M 30 54 L 8.5 17 L 51.5 17 Z" />
  </svg>
);

const EYE_TRIANGLE = (
  <svg viewBox="0 0 60 60">
    <path d="M 30 8 L 54 50 L 6 50 Z" />
    <ellipse cx="30" cy="38" rx="11" ry="5" />
    <circle cx="30" cy="38" r="2.5" fill="currentColor" stroke="none" />
  </svg>
);

const INVERTED_CROSS = (
  <svg viewBox="0 0 60 60">
    <path d="M 30 6 L 30 54" strokeWidth="2.2" />
    <path d="M 18 42 L 42 42" strokeWidth="2.2" />
  </svg>
);

const ANKH = (
  <svg viewBox="0 0 60 60">
    <circle cx="30" cy="22" r="11" />
    <path d="M 30 33 L 30 54" strokeWidth="2" />
    <path d="M 20 42 L 40 42" strokeWidth="2" />
  </svg>
);

const OUROBOROS = (
  <svg viewBox="0 0 60 60">
    <circle cx="30" cy="30" r="22" strokeDasharray="115 10" />
    <path d="M 30 6 L 26 12 L 34 12 Z" fill="currentColor" stroke="none" />
  </svg>
);

const RAIL_SIGILS = [
  { sigil: OUROBOROS,      x: -260, y: -140 },
  { sigil: ANKH,           x: -260, y:    0 },
  { sigil: INVERTED_CROSS, x: -260, y:  140 },
  { sigil: PENTAGRAM,      x:  260, y: -140 },
  { sigil: HEXAGRAM,       x:  260, y:    0 },
  { sigil: EYE_TRIANGLE,   x:  260, y:  140 },
];

export function Sigils() {
  return (
    <div className="sigils" aria-hidden="true">
      {RAIL_SIGILS.map((s, i) => (
        <div
          key={i}
          className="sigil"
          style={{
            top: `calc(50% + ${s.y}px)`,
            left: `calc(50% + ${s.x}px)`,
            animationDelay: `${0.8 + i * 0.12}s`,
          }}
        >
          {s.sigil}
        </div>
      ))}
    </div>
  );
}
