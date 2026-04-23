export type DisplayFont = 'UnifrakturCook' | 'Cinzel' | 'EB Garamond';

export interface Settings {
  bloodHue: number;
  ambientIntensity: number;
  grainOpacity: number;
  heartbeatBpm: number;
  showSigils: boolean;
  fogDensity: number;
  displayFont: DisplayFont;
}

// Ported verbatim from index.legacy.html:15–23.
export const DEFAULTS: Settings = {
  bloodHue: 0,
  ambientIntensity: 0.7,
  grainOpacity: 0.5,
  heartbeatBpm: 72,
  showSigils: true,
  fogDensity: 1,
  displayFont: 'UnifrakturCook',
};

const DISPLAY_FONT_TARGETS =
  '.hero-church, .hero-decay, .portal-name, .ritual-side h2, .litany-head h2, .gate-title, .cmd-num';

// DOM target cache — the body HTML is static after mount, so these queries
// can run exactly once instead of on every slider onChange (up to 60Hz).
interface Targets {
  stageMain: HTMLElement | null;
  gate: HTMLElement | null;
  fogBlobs: NodeListOf<HTMLElement>;
  fontTargets: NodeListOf<HTMLElement>;
}
let cache: Targets | null = null;
function getTargets(): Targets {
  // Invalidate if the cached gate no longer lives in the document (HMR, tests).
  if (cache && cache.gate && document.contains(cache.gate)) return cache;
  cache = {
    stageMain: document.querySelector<HTMLElement>('#stage main'),
    gate: document.getElementById('gate'),
    fogBlobs: document.querySelectorAll<HTMLElement>('.fog-blob'),
    fontTargets: document.querySelectorAll<HTMLElement>(DISPLAY_FONT_TARGETS),
  };
  return cache;
}

export function invalidateSettingsCache(): void { cache = null; }

/**
 * Port of applyState() from index.legacy.html:14–51.
 * Writes CSS vars + palette + filter + per-element blur + inline fonts so the
 * whole atmospheric layer restyles whenever settings change.
 */
export function applySettings(s: Settings, root: HTMLElement = document.documentElement): void {
  root.style.setProperty('--grain-op', String(s.grainOpacity));
  root.style.setProperty('--fog-op', String(s.fogDensity));
  root.style.setProperty('--bpm', String(s.heartbeatBpm));

  // Blood palette rotates on the oklch hue axis (red ≈ 25°).
  const oklchHue = 25 + s.bloodHue;
  root.style.setProperty('--blood', `oklch(0.38 0.20 ${oklchHue})`);
  root.style.setProperty('--blood-bright', `oklch(0.58 0.24 ${oklchHue})`);
  root.style.setProperty('--ember', `oklch(0.72 0.22 ${oklchHue + 15})`);
  root.style.setProperty('--blood-deep', `oklch(0.22 0.14 ${oklchHue})`);

  const t = getTargets();

  // Hue-rotate filter on content only — NOT on #stage itself, since that
  // would spawn a new containing block for .scene's position:fixed children
  // and break the parallax rig (Firefox bug the legacy code documented).
  // Always write the full string (even at hue=0) so we never diverge from
  // legacy behavior by clearing an inline style that another rule might claim.
  const filt = `hue-rotate(${s.bloodHue * 6}deg)`;
  if (t.stageMain) t.stageMain.style.filter = filt;
  if (t.gate) t.gate.style.filter = filt;

  // Fog blur is per-element because blur on the parent would clip at bounds.
  const blur = `blur(${20 + s.fogDensity * 20}px)`;
  t.fogBlobs.forEach((b) => { b.style.filter = blur; });

  // Display font swap — only a handful of elements use the display face.
  const font = `"${s.displayFont}", serif`;
  t.fontTargets.forEach((el) => { el.style.fontFamily = font; });

  root.classList.toggle('no-sigils', !s.showSigils);
}
