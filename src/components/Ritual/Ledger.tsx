import { useMemo, useRef, type RefObject } from 'react';
import {
  FAKE_NAMES_LEFT,
  FAKE_NAMES_RIGHT,
  OLD_INDICES_LEFT,
  OLD_INDICES_RIGHT,
} from '../../lib/constants';
import { toRoman } from '../../lib/roman';
import { useLedger, type LedgerState } from '../../hooks/useLedger';
import { useSectionReveal } from '../../hooks/useSectionReveal';

const STATE_CLASSES: Record<LedgerState, string> = {
  closed: 'is-closed',
  opening: 'is-opening',
  idle: 'is-idle',
  typing: 'is-typing',
  signed: 'is-signed',
};

interface Props {
  stageRef: RefObject<HTMLDivElement | null>;
  quillRef: RefObject<HTMLDivElement | null>;
}

/**
 * The rite-of-inscription ledger section. The state machine lives in
 * `useLedger`; this component owns the refs and renders the markup.
 *
 * Letter-by-letter ink rendering is pure JSX: `input.split('')` mapped into
 * `.letter` spans, with the animation-delay computed off `prevLen` so that
 * only newly-typed letters pick up a stagger (existing spans just re-render
 * with new classNames and don't remount). When `state === 'signed'` the
 * wet-ink animation runs with its own `i * 0.03s` stagger.
 */
export function Ledger({ stageRef, quillRef }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const blotRef = useRef<HTMLSpanElement>(null);
  const signBtnRef = useRef<HTMLButtonElement>(null);

  useSectionReveal(sectionRef);

  const { state, input, prevLen, onFocus, onInput, onKeyDown, onSign } =
    useLedger({ stageRef, inputRef, blotRef, signBtnRef, quillRef });

  const nextNum = useMemo(
    () => toRoman(FAKE_NAMES_LEFT.length + FAKE_NAMES_RIGHT.length + 1) + '.',
    [],
  );

  const signVisible = input.trim().length >= 2;
  const signed = state === 'signed';

  return (
    <section className="ritual" ref={sectionRef}>
      <div className="ritual-eyebrow">Rite of the Inscription</div>
      <h2 className="ritual-title">
        Sign the Ledger
        <br />
        of the Faithful.
      </h2>
      <p className="ritual-sub">
        Every soul that descends is written in the book. Take up the quill. Let your name bleed into the vellum — and the gate shall open.
      </p>

      <div
        ref={stageRef}
        className={`ledger-stage ${STATE_CLASSES[state]}`}
        aria-label="The Ledger"
      >
        <div className="ledger-glow" />
        <div className="ledger-book">
          <div className="ledger-spine" />
          <div className="ledger-page ledger-page--left">
            <div className="ledger-page-head">Anno Putredinis · MMXXVI</div>
            <ol className="ledger-entries">
              {FAKE_NAMES_LEFT.map((n, i) => (
                <li key={i} className={OLD_INDICES_LEFT.includes(i) ? 'old' : undefined}>
                  {n}
                </li>
              ))}
            </ol>
          </div>
          <div className="ledger-page ledger-page--right">
            <div className="ledger-page-head">Those who descend</div>
            <ol className="ledger-entries">
              {FAKE_NAMES_RIGHT.map((n, i) => (
                <li key={i} className={OLD_INDICES_RIGHT.includes(i) ? 'old' : undefined}>
                  {n}
                </li>
              ))}
            </ol>

            <div className="ledger-sign-row">
              <span className="ledger-sign-number">{nextNum}</span>
              <div className="ledger-sign-slot">
                <span className="ledger-cursor" />
                <input
                  ref={inputRef}
                  className="ledger-input"
                  type="text"
                  maxLength={28}
                  placeholder="inscribe thy name…"
                  autoComplete="off"
                  spellCheck={false}
                  value={input}
                  onFocus={onFocus}
                  onChange={onInput}
                  onKeyDown={onKeyDown}
                  readOnly={signed}
                />
                <span className="ledger-rendered">
                  {Array.from(input).map((ch, i) => {
                    const delay = signed
                      ? i * 0.03
                      : Math.max(0, i - prevLen) * 0.04;
                    return (
                      <span
                        key={i}
                        className={signed ? 'letter wet' : 'letter'}
                        style={{ animationDelay: `${delay}s` }}
                      >
                        {ch}
                      </span>
                    );
                  })}
                </span>
                <span ref={blotRef} className="ledger-ink-blot" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        ref={signBtnRef}
        className={signVisible ? 'ledger-sign-btn visible' : 'ledger-sign-btn'}
        type="button"
        aria-label="Sign the ledger"
        onClick={onSign}
      >
        <span>✦ Sign in Rust ✦</span>
      </button>
    </section>
  );
}
