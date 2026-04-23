import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import { GAME_URL } from '../lib/constants';
import { restartAnimation } from '../lib/dom';

export type LedgerState = 'closed' | 'opening' | 'idle' | 'typing' | 'signed';

type LedgerAction =
  | { type: 'OPEN_START' }
  | { type: 'OPEN_COMPLETE' }
  | { type: 'FOCUS_INPUT' }
  | { type: 'SIGN' };

/**
 * State transitions: closed → opening → idle → typing → signed. Illegal
 * transitions return the current state unchanged — the switch guards replace
 * the functional-update guards that lived at every call site before.
 */
function ledgerReducer(state: LedgerState, action: LedgerAction): LedgerState {
  switch (action.type) {
    case 'OPEN_START':
      return state === 'closed' ? 'opening' : state;
    case 'OPEN_COMPLETE':
      return state === 'opening' ? 'idle' : state;
    case 'FOCUS_INPUT':
      return state === 'idle' ? 'typing' : state;
    case 'SIGN':
      return 'signed';
    default:
      return state;
  }
}

interface UseLedgerOpts {
  stageRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  blotRef: RefObject<HTMLSpanElement | null>;
  signBtnRef: RefObject<HTMLButtonElement | null>;
  quillRef: RefObject<HTMLDivElement | null>;
}

interface UseLedgerReturn {
  state: LedgerState;
  input: string;
  /** Length of input at the PREVIOUS render — used to compute per-letter
   *  ink-stagger delays only for newly-typed letters. */
  prevLen: number;
  onFocus: () => void;
  onInput: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onSign: () => void;
}

/**
 * State machine for the ledger: closed → opening → idle → typing → signed.
 *
 * - `opening` is driven off the right-page `animationend` event so the
 *   spine-unfold CSS animation owns the timing, not a hardcoded setTimeout.
 * - `signed` is terminal: the input goes readonly, letters get the wet class,
 *   and a body-level `.gate-opening` overlay fades in before the 3.4s
 *   window.location redirect. The sign-side-effects (overlay, redirect,
 *   localStorage write, blot pulse, input blur) stay imperative inside
 *   `onSign` — a useEffect keyed on `state === 'signed'` would dev-double-
 *   invoke under StrictMode and duplicate the overlay + localStorage push.
 */
export function useLedger(opts: UseLedgerOpts): UseLedgerReturn {
  const [state, dispatch] = useReducer(ledgerReducer, 'closed');
  const [input, setInput] = useState('');
  const prevLenRef = useRef(0);
  const writeTimerRef = useRef<number | undefined>(undefined);

  // ── Open on scroll-into-view ───────────────────────────────────
  useEffect(() => {
    if (state !== 'closed') return;
    const stage = opts.stageRef.current;
    if (!stage) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            dispatch({ type: 'OPEN_START' });
            io.disconnect();
            const rightPage = stage.querySelector('.ledger-page--right');
            rightPage?.addEventListener(
              'animationend',
              () => dispatch({ type: 'OPEN_COMPLETE' }),
              { once: true },
            );
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(stage);
    // Cleanup only disconnects IO. The `{once: true}` animationend listener
    // must NOT be torn down on state-change cleanup: when OPEN_START dispatches,
    // this effect re-runs (state: closed → opening), and removing the listener
    // here would strand the state machine in `opening` forever. `{once: true}`
    // handles its own removal after firing; the real-unmount leak is bounded
    // by the page navigation that follows signing.
    return () => io.disconnect();
  }, [opts.stageRef, state]);

  // ── Click on stage → focus input (except clicks on sign button) ─
  useEffect(() => {
    const stage = opts.stageRef.current;
    const input = opts.inputRef.current;
    if (!stage || !input) return;
    const onClick = (e: MouseEvent) => {
      if (state !== 'idle' && state !== 'typing') return;
      const target = e.target as Node;
      const btn = opts.signBtnRef.current;
      if (btn && (target === btn || btn.contains(target))) return;
      input.focus();
    };
    stage.addEventListener('click', onClick);
    return () => stage.removeEventListener('click', onClick);
  }, [opts.stageRef, opts.inputRef, opts.signBtnRef, state]);

  // ── Track previous length for per-letter stagger ───────────────
  useEffect(() => {
    prevLenRef.current = input.length;
  }, [input]);

  const pulseBlot = useCallback(() => {
    const blot = opts.blotRef.current;
    if (!blot) return;
    restartAnimation(blot, 'visible');
  }, [opts.blotRef]);

  const flashQuillWriting = useCallback(() => {
    const quill = opts.quillRef.current;
    if (!quill) return;
    quill.classList.add('writing');
    if (writeTimerRef.current !== undefined) clearTimeout(writeTimerRef.current);
    writeTimerRef.current = window.setTimeout(
      () => quill.classList.remove('writing'),
      450,
    );
  }, [opts.quillRef]);

  const onFocus = useCallback(() => {
    dispatch({ type: 'FOCUS_INPUT' });
  }, []);

  const onInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInput(val);
      if (val.length > 0 && Math.random() < 0.4) pulseBlot();
      flashQuillWriting();
    },
    [pulseBlot, flashQuillWriting],
  );

  const onSign = useCallback(() => {
    const inputEl = opts.inputRef.current;
    if (!inputEl) return;
    const name = inputEl.value.trim();
    if (name.length < 2) {
      inputEl.animate(
        [
          { transform: 'translateX(0)' },
          { transform: 'translateX(-8px)' },
          { transform: 'translateX(8px)' },
          { transform: 'translateX(-4px)' },
          { transform: 'translateX(0)' },
        ],
        { duration: 300, easing: 'ease-out' },
      );
      return;
    }
    dispatch({ type: 'SIGN' });
    inputEl.blur();

    try {
      const existing = JSON.parse(localStorage.getItem('cod_ledger') ?? '[]') as string[];
      existing.push(name);
      localStorage.setItem('cod_ledger', JSON.stringify(existing.slice(-100)));
    } catch {
      // localStorage full / blocked — redirect still proceeds.
    }

    pulseBlot();

    const overlay = document.createElement('div');
    overlay.className = 'gate-opening';
    const textDiv = document.createElement('div');
    textDiv.className = 'gate-opening-text';
    textDiv.innerHTML = 'The ledger accepts thee.<br>';
    const nameSpan = document.createElement('span');
    nameSpan.className = 'gate-opening-name';
    nameSpan.textContent = `— ${name} —`;
    textDiv.appendChild(nameSpan);
    overlay.appendChild(textDiv);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));

    window.setTimeout(() => {
      window.location.href = GAME_URL;
    }, 3400);
  }, [opts.inputRef, pulseBlot]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSign();
      }
    },
    [onSign],
  );

  useEffect(() => {
    return () => {
      if (writeTimerRef.current !== undefined) clearTimeout(writeTimerRef.current);
    };
  }, []);

  return {
    state,
    input,
    prevLen: prevLenRef.current,
    onFocus,
    onInput,
    onKeyDown,
    onSign,
  };
}
