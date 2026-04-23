import { useEffect, useRef, type ReactNode } from 'react';

interface PortalEntry {
  num: string;
  href: string;
  name: string;
  latin: string;
  desc: string;
  enterLabel: string;
  icon: ReactNode;
}

const PORTAL_ICON_PROPS = {
  className: 'portal-icon',
  viewBox: '0 0 100 100',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.5',
} as const;

const ENTRIES: readonly PortalEntry[] = [
  {
    num: 'I',
    href: 'https://www.roblox.com/games/5053514572/The-Bonelands',
    name: 'The Bonelands',
    latin: '· Terra Ossium ·',
    desc: 'Descend into the sanctum. Take the robe. Kneel before the skull of the dead god.',
    enterLabel: 'Enter the Game',
    icon: (
      <svg {...PORTAL_ICON_PROPS}>
        <path d="M20 90 L20 40 Q50 10 80 40 L80 90 Z" />
        <path d="M28 90 L28 44 Q50 20 72 44 L72 90" strokeWidth="1" />
        <line x1="50" y1="22" x2="50" y2="90" />
        <circle cx="50" cy="55" r="3" fill="currentColor" />
        <path d="M10 88 q3 -10 0 -16 q6 4 4 16 Z" fill="currentColor" opacity="0.7" />
        <path d="M86 88 q3 -10 0 -16 q6 4 4 16 Z" fill="currentColor" opacity="0.7" />
      </svg>
    ),
  },
  {
    num: 'II',
    href: 'https://churchdecay.fandom.com/wiki/Church_of_Decay_Wiki',
    name: 'The Codex',
    latin: '· Liber Putredinis ·',
    desc: 'All that is known, half-known, and whispered. The rites, the ranks, the long genealogy of rot.',
    enterLabel: 'Open the Wiki',
    icon: (
      <svg {...PORTAL_ICON_PROPS}>
        <path d="M20 22 L50 28 L80 22 L80 82 L50 88 L20 82 Z" />
        <line x1="50" y1="28" x2="50" y2="88" />
        <path
          d="M28 38 L44 41 M28 48 L44 51 M28 58 L44 61 M28 68 L44 71 M56 41 L72 38 M56 51 L72 48 M56 61 L72 58 M56 71 L72 68"
          strokeWidth="0.8"
        />
        <circle cx="50" cy="58" r="6" fill="currentColor" opacity="0.4" />
        <polygon points="50,52 54,60 50,68 46,60" fill="currentColor" />
      </svg>
    ),
  },
  {
    num: 'III',
    href: 'https://discord.gg/cDkQXxaP2A',
    name: 'The Chalice',
    latin: '· Communio ·',
    desc: 'Speak with the congregation. Share the cup. Trade prophecies in the hours before mass.',
    enterLabel: 'Join Discord',
    icon: (
      <svg {...PORTAL_ICON_PROPS}>
        <path d="M30 20 L70 20 L66 45 Q50 62 34 45 Z" />
        <line x1="50" y1="62" x2="50" y2="78" />
        <path d="M36 78 L64 78 L60 86 L40 86 Z" />
        <path d="M34 24 L66 24 L64 38 Q50 50 36 38 Z" fill="currentColor" opacity="0.5" />
        <circle cx="44" cy="30" r="1.5" fill="currentColor" />
        <circle cx="56" cy="34" r="1" fill="currentColor" />
        <path d="M50 62 Q50 68 48 72 Q50 74 52 72 Q50 68 50 62" fill="currentColor" />
      </svg>
    ),
  },
  {
    num: 'IV',
    href: 'https://www.roblox.com/communities/5917063/Church-of-Decay#!/about',
    name: 'The Congregation',
    latin: '· Fratres in Putre ·',
    desc: 'The official Roblox assembly. Rise in rank. Wear the robes of your order — white or black.',
    enterLabel: 'Join Community',
    icon: (
      <svg {...PORTAL_ICON_PROPS}>
        <path d="M25 14 L75 14 L75 74 L50 88 L25 74 Z" />
        <path d="M30 20 L70 20 L70 70 L50 82 L30 70 Z" strokeWidth="0.8" />
        <ellipse cx="50" cy="48" rx="10" ry="13" fill="currentColor" opacity="0.3" />
        <path
          d="M42 40 q-6 -6 -10 -14 M58 40 q6 -6 10 -14 M38 42 q-8 -2 -14 -8 M62 42 q8 -2 14 -8"
        />
        <circle cx="46" cy="46" r="1.8" fill="currentColor" />
        <circle cx="54" cy="46" r="1.8" fill="currentColor" />
        <path d="M46 56 L50 62 L54 56" strokeWidth="1" />
      </svg>
    ),
  },
];

/**
 * The four gates. When the section scrolls into view, each portal gets its
 * `.revealed` class added on a 150ms stagger (same timing the legacy hook
 * used) — the observer lives here now rather than in the old mega-hook. The
 * candle is JSX with an inline `animationDelay` so each candle's flicker
 * phase is offset by 0.85s and the four gates breathe out-of-sync.
 */
export function Portals() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const host = sectionRef.current;
    if (!host) return;
    const portals = Array.from(host.querySelectorAll<HTMLElement>('.portal'));
    if (!portals.length) return;
    const timeouts: number[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            portals.forEach((p, i) => {
              timeouts.push(window.setTimeout(() => p.classList.add('revealed'), i * 150));
            });
            io.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(host);
    return () => {
      io.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="gates" ref={sectionRef}>
      {ENTRIES.map((p, i) => (
        <a
          key={p.num}
          className="portal"
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="portal-roman">{p.num}</div>
          {p.icon}
          <div className="portal-name">{p.name}</div>
          <div className="portal-latin">{p.latin}</div>
          <div className="portal-desc">{p.desc}</div>
          <div className="portal-enter">{p.enterLabel}</div>
          <div className="portal-candle" style={{ animationDelay: `${i * 0.85}s` }} />
        </a>
      ))}
    </section>
  );
}
