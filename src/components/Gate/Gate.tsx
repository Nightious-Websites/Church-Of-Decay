import { EyeGlare } from './EyeGlare';
import { GateEmbers } from './GateEmbers';
import { GateStatic } from './GateStatic';
import { Sigils } from './Sigils';
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

      <Sigils />

      <div className="gate-inner">
        <div className="gate-invocation">
          <Whisper entered={entered} />
          <div className="gate-title">Church of Decay</div>
        </div>

        <div className="gate-relic" aria-hidden="true">
          <img
            className="relic-img"
            src="/assets/merken.png"
            alt=""
            width="1000"
            height="991"
            decoding="async"
          />
        </div>

        <div className="gate-rite">
          <button className="gate-button" type="button" onClick={onEnter}>
            Enter the Nave
          </button>
          <div className="gate-warning">mind the red floor · turn back if unwilling</div>
        </div>
      </div>

      <GateEmbers />
    </div>
  );
}
