import { EyeGlare } from './EyeGlare';
import { GateEmbers } from './GateEmbers';
import { GateStatic } from './GateStatic';
import { Whisper } from './Whisper';

interface Props {
  entered: boolean;
  onEnter: () => void;
}

/**
 * The gate screen. Stays mounted even after entry so its CSS
 * `opacity 1.8s / visibility 1.8s` transition can play when `.dissolved`
 * flips on. On session-skip the component first-renders with `.dissolved`
 * already applied — CSS transitions don't fire on initial style, so the
 * end state lands instantly with no visible fade-from-visible.
 */
export function Gate({ entered, onEnter }: Props) {
  return (
    <div id="gate" className={entered ? 'dissolved' : ''}>
      <GateStatic />
      <div className="gate-vignette" />
      <EyeGlare />
      <button
        className="gate-close"
        title="Skip entrance"
        type="button"
        onClick={onEnter}
      >
        × skip
      </button>

      <div className="arch-wrap" aria-hidden="true">
        <svg
          viewBox="0 0 520 640"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <path d="M30 640 L30 260 Q260 10 490 260 L490 640" stroke="#7a0a0a" strokeWidth="1.4" opacity="0.7" />
          <path d="M54 640 L54 272 Q260 44 466 272 L466 640" stroke="#3a0505" strokeWidth="0.9" opacity="0.6" />
          <path d="M80 640 L80 286 Q260 80 440 286 L440 640" stroke="#2a0404" strokeWidth="0.6" opacity="0.5" />
          <line x1="30" y1="400" x2="54" y2="400" stroke="#5a0808" strokeWidth="0.8" opacity="0.6" />
          <line x1="466" y1="400" x2="490" y2="400" stroke="#5a0808" strokeWidth="0.8" opacity="0.6" />
          <line x1="30" y1="500" x2="54" y2="500" stroke="#5a0808" strokeWidth="0.8" opacity="0.5" />
          <line x1="466" y1="500" x2="490" y2="500" stroke="#5a0808" strokeWidth="0.8" opacity="0.5" />
          <path d="M242 28 L260 8 L278 28 L270 36 L260 28 L250 36 Z" stroke="#5a0808" strokeWidth="0.8" fill="none" opacity="0.6" />
          <rect x="22" y="580" width="16" height="60" stroke="#3a0505" strokeWidth="0.8" fill="none" opacity="0.4" />
          <rect x="482" y="580" width="16" height="60" stroke="#3a0505" strokeWidth="0.8" fill="none" opacity="0.4" />
          <path d="M18 580 L22 570 L38 570 L42 580" stroke="#3a0505" strokeWidth="0.8" fill="none" opacity="0.5" />
          <path d="M478 580 L482 570 L498 570 L502 580" stroke="#3a0505" strokeWidth="0.8" fill="none" opacity="0.5" />
          <circle cx="260" cy="52" r="6" stroke="#5a0808" strokeWidth="0.7" fill="none" opacity="0.5" />
          <circle cx="248" cy="64" r="5" stroke="#3a0505" strokeWidth="0.6" fill="none" opacity="0.4" />
          <circle cx="272" cy="64" r="5" stroke="#3a0505" strokeWidth="0.6" fill="none" opacity="0.4" />
        </svg>
      </div>

      <div className="gate-inner">
        <div className="logo-wrap">
          <img className="logo-img" src="/assets/merken.png" alt="Merken — Church of Decay" />
        </div>
        <Whisper entered={entered} />
        <h1 className="gate-title">Church of Decay</h1>
        <div className="gate-latin">· Ecclesia Putredinis ·</div>
        <div className="gate-prompt">the faithful gather below</div>
        <button className="gate-button" type="button" onClick={onEnter}>
          Enter the Nave
        </button>
        <div className="gate-warning">mind the red floor · turn back if unwilling</div>
      </div>

      <GateEmbers />
    </div>
  );
}
