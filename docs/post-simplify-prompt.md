# Post-Simplify — Metaprompt for a new Opus 4.7 session

Paste everything below the `────` line verbatim into a fresh Claude Code session
in the same working directory (`/home/xlaptop/Projects/Claude/Websites/ChurchOfDecay`).

────────────────────────────────────────────────────────────────────────────

# Church of Decay — finish Phase 4 (C.1 + verification)

## Where the project is right now

Phase 4 buckets A, B, C.2, C.3, C.4, and C.5 are **done**. The only
remaining Phase 4 item is **C.1** — converting `useLedger`'s 5-state
machine to `useReducer`. Everything else in Phase 4 has shipped.

Build health (as of handoff):

- `npx tsc --noEmit` — clean.
- `npx vite build` — clean. **63 modules**, **241.03 KB** main /
  **40.64 KB** CSS / **11.69 KB** react chunk. Within ±10 KB of the
  extraction-brief target (241.04 KB baseline).
- Dev server: `npx vite --port 5173 --host 127.0.0.1`.

File layout (additions/changes since the prior handoff brief):

```
src/
├─ lib/
│  ├─ dom.ts ← NEW — exports restartAnimation(el, className) helper.
│  │            Used by useLedger.pulseBlot AND useSoulsTicker.
│  ├─ constants, roman, settings.ts (unchanged)
├─ components/
│  ├─ Quill.tsx ← refactored — accepts quillRef as prop, no internal ref,
│  │              no id="quill" attr.
│  ├─ Gate/Whisper.tsx ← refactored — accepts entered prop, bails its
│  │                      4s interval when entered=true (DOM stays mounted
│  │                      so dissolve plays).
│  ├─ Gate/Gate.tsx ← passes entered into <Whisper>.
│  ├─ Overlays/EmbersCanvas.tsx ← inline style block dropped; positioning
│  │                               lives entirely in CSS now.
│  ├─ Ritual/Ledger.tsx ← accepts both stageRef and quillRef as props,
│  │                       forwards quillRef through useLedger opts.
├─ hooks/
│  ├─ useLedger.ts ← uses restartAnimation; quillRef in opts;
│  │                  flashQuillWriting reads from ref, not getElementById.
│  ├─ useSoulsTicker.ts ← uses restartAnimation.
│  ├─ useCreedReveal.ts ← invariant docstring note added.
│  ├─ usePointerPipeline.ts (unchanged — still the only doc.mousemove)
│  └─ ... (other hooks unchanged)
├─ App.tsx ← lifts both ledgerStageRef AND quillRef at the composition root.
└─ index.css ← #embers rule rewritten with explicit edges (line ~1454).
                Otherwise unchanged since migration start.
```

Verified (static-only — see Browser verification note below):

- `getElementById` calls in `src/`: only `main.tsx:6` (`#root` mount)
  and `settings.ts:41` (`#gate` cache target). The legacy `#quill`
  query is gone.
- `addEventListener('mousemove'` in `src/`: only `usePointerPipeline.ts:32`
  (the ref-counted, rAF-coalesced shared listener). Single-listener
  invariant holds at the source level.
- `id="quill"` attribute: zero hits.
- Single `#embers` CSS rule (no competing inline styles on the canvas).

## ⚠ Browser verification status

The prior sessions **did not have a browser-automation tool available**.
The 9-point walkthrough at `http://127.0.0.1:5173/` was driven by the
human user and reported back as "everything is fine," then they confirmed
the bucket-C.2 ember-position change visually after it shipped. Static
audits proved every source-level invariant the brief listed.

**If you have a browser tool in this session** (Playwright, Puppeteer,
DevTools MCP, etc.), drive the original 9-point walkthrough from
`docs/post-extraction-polish-prompt.md` section A as a regression check
before AND after the C.1 refactor. Items most at risk from C.1:

- Item 3 (ledger pages unfold when 50% in viewport) — uses the
  `closed → opening` IO trigger.
- Item 4 (typing inks letters; sign button visible at 2+ chars; quill
  gets `.writing` class) — uses `idle → typing` and the
  `flashQuillWriting` callback. The `.writing` toggle is the bucket-B
  canary; if it stops working, you broke the lifted-quillRef wiring.
- Item 5 (sign flow — **DESTRUCTIVE**, navigates to `GAME_URL` after
  3.4s; set a DevTools breakpoint on `window.location.href` first) —
  uses `* → signed`. Letters get `.wet`, overlay fades in, redirect
  fires.

**If you don't have a browser tool**, do the same source-level static
audits the prior session relied on, and ask the user to drive the
walkthrough after C.1 lands.

## Your mission (Phase 4 — C.1 only)

Convert `useLedger` from `useState` + functional-update guards to
`useReducer`. The state machine is:

```
closed → opening → idle → typing → signed (terminal)
```

Triggers (current code):

| From → To | Trigger | Where it lives now |
|---|---|---|
| closed → opening | IntersectionObserver on stage at threshold 0.5 | `useLedger.ts` (open-on-scroll effect) |
| opening → idle | `animationend` on `.ledger-page--right` | same effect, `{once: true}` listener |
| idle → typing | input focus | `onFocus` callback |
| typing → signed (or idle → signed) | `onSign` with valid name (length ≥ 2) | `onSign` callback |

External observers of `state`:

1. `Ledger.tsx`'s `STATE_CLASSES` map — writes `is-closed` /
   `is-opening` / `is-idle` / `is-typing` / `is-signed` class to the
   ledger stage. **The `.is-signed` class is read by `useQuillProximity`
   (`src/hooks/useQuillProximity.ts:43`) to hide the quill** — this is
   the load-bearing cross-component signal.
2. Letter wetness — `Ledger.tsx:115` keys the per-letter `animationDelay`
   off whether `state === 'signed'`.
3. `Ledger.tsx:53` — `signed = state === 'signed'`, used to apply the
   `wet` class and toggle `readOnly` on the input.

### The real design question: where do the side effects live?

`onSign` does FOUR things today:

1. State transition (`setState('signed')`).
2. Side effect: `inputEl.blur()`.
3. Side effect: localStorage write of the signed name.
4. Side effect: `pulseBlot()` (DOM class restart).
5. Side effect: imperative `document.body.appendChild(overlay)` + 3.4s
   `setTimeout` → `window.location.href = GAME_URL`.

A naive reducer migration would push side effects 2-5 into a
`useEffect(() => { if (state === 'signed') { ... } }, [state])`. **Don't
do that for #5** (the overlay + redirect). The original brief's
insight #6 is explicit: *"The ledger's sign-and-redirect overlay stays
imperative. A body-level `appendChild` + 3.4s timeout +
`window.location.href` navigation doesn't benefit from JSX; nothing
reacts to it, the page navigates away regardless."*

The right shape is probably:

- Reducer owns ONLY the state transitions.
- The dispatch (`SIGN`) happens inside `onSign`, which then runs the
  side effects inline (overlay creation, redirect setTimeout) just like
  today.
- `pulseBlot` and the localStorage write also stay in `onSign`.

This trades reducer-purity for keeping the existing imperative
side-effect orchestration intact. The win from `useReducer` is the
explicit action surface and the elimination of
`setState((cur) => (cur === 'idle' ? 'typing' : cur))` guards — not a
total rewrite of how side effects fire.

### Suggested action surface

```ts
type LedgerAction =
  | { type: 'OPEN_START' }       // IO fires, closed → opening
  | { type: 'OPEN_COMPLETE' }    // animationend on right page, opening → idle
  | { type: 'FOCUS_INPUT' }      // input focus, idle → typing (no-op otherwise)
  | { type: 'SIGN' };            // sign button clicked with valid name, * → signed
```

Inside the reducer, illegal transitions return current state unchanged
(no need for the `setState(cur => cur === 'idle' ? 'typing' : cur)`
pattern — it's just a switch/case guard).

## Hard constraints (do not violate)

These carry over from the original extraction brief; re-read them:

1. **CSS class names are frozen.** `is-closed`, `is-opening`, `is-idle`,
   `is-typing`, `is-signed` — exact strings, no renames. The
   `STATE_CLASSES` map at `Ledger.tsx:12` is the single source of truth
   for the state→class mapping; if you change the action surface, that
   map still has to produce the same five class names.
2. **Parity over novelty.** The 9-point walkthrough must continue to
   pass after the refactor. Every animation timing, every DOM mutation,
   every setTimeout duration is preserved.
3. **`applySettings` keeps working at 60Hz during slider drags.** Don't
   touch `src/lib/settings.ts` during this refactor.
4. **StrictMode idempotency.** The reducer effect that wires the IO and
   the animationend listener will dev-double-invoke. Make sure the
   cleanup fully tears down both subscriptions so the second mount
   lands in the same state.
5. **Only ONE mousemove listener on document.** Don't add new direct
   `document.addEventListener('mousemove', ...)` calls. The
   `usePointerPipeline` shared subscriber is the only path.
6. **Do not install new dependencies.**
7. **Do not restore `bodyHtml.ts` or `useLegacyEffects.ts`** — both
   deleted, stay deleted.
8. **The `flashQuillWriting` add-class-with-setTimeout pattern stays
   inline.** It's single-use in the codebase (other class-toggle
   patterns are reflow-restart, not timer-based). Don't extract it
   into a "helper" — that's premature abstraction. The `restartAnimation`
   helper at `src/lib/dom.ts` exists for the *reflow-restart* idiom only.

## Critical insights from prior sessions (read these first)

These are not derivable from the code; they took advisor consults and
walkthroughs to nail down.

### Carried over from `docs/post-extraction-polish-prompt.md`

1. **Session-skip works via CSS-transition initial-state semantics.**
   Rendering `<Gate entered={true}>` on first paint lands at the
   `.dissolved` end-state instantly because CSS transitions don't fire
   on initial style. No `display: none` or first-paint suppression
   needed.
2. **Pointer pipeline is module-level by design, not Context.** Module
   `Set` of subscribers + rAF coalescing + ref-counted listener. Don't
   "improve" this into a context provider — context would re-render
   every consumer at 60Hz.
3. **Wrapper-div CSS fracture is not a risk.** One `>` combinator in
   the entire CSS file (`.cod-drawer-body label > span` at index.css
   ~1664), zero nth-child against `main`/`#stage`/`.gate-inner`. You
   can freely wrap or restructure JSX without breaking CSS sibling/
   descendant rules. Re-verify with:
   ```
   grep -nE ' *> *[.#a-z\*]|\+[a-z\.\#]| *~ *[.#a-z]' src/index.css
   ```
4. **Letter-by-letter ink stagger uses `prevLen` ref, not absolute
   position.** Each letter's `animationDelay` is
   `Math.max(0, i - prevLen) * 0.04s` so only newly-typed letters get
   staggered. Absolute `i * 0.04s` would feel laggy. `prevLen` is
   updated in a `useEffect` so it holds the prior render's value
   during the render that adds a letter. **C.1 must preserve this
   `prevLen` semantics** — it's not state-machine state, it's a render-
   timing trick.
5. **The ledger's sign-and-redirect overlay stays imperative.** Don't
   migrate the body-level `appendChild` + 3.4s setTimeout + window.
   location.href into JSX or a useEffect that watches `state`.
   Nothing reacts to the overlay; the page navigates away regardless.

### New from the post-extraction polish session

6. **`#quill` is gone — there is no DOM ID for the quill element.**
   `useLedger.flashQuillWriting` reads from `opts.quillRef.current`,
   which `App.tsx` lifts and passes to both `<Quill>` and `<Ledger>`.
   If you add a third consumer of the quill DOM, prefer prop-drilling
   the same ref over re-introducing an ID.
7. **`restartAnimation(el, className)` lives at `src/lib/dom.ts`.** Used
   by `useLedger.pulseBlot` (`src/hooks/useLedger.ts`) and
   `useSoulsTicker` (`src/hooks/useSoulsTicker.ts`). The `void
   el.offsetWidth` trick forces a synchronous layout flush so the
   browser can't coalesce remove+add. Don't try to skip the reflow line.
8. **`flashQuillWriting` is intentionally NOT extracted.** Its
   add-class + setTimeout(remove-class) pattern is single-use
   project-wide. Keep it inline in `useLedger`.
9. **`<Whisper>` accepts an `entered` prop and bails its 4s interval
   when entered=true.** The DOM stays mounted so the gate's
   `opacity 1.8s` dissolve transition still affects it. If you
   restructure Gate's children, preserve this pattern — bail JS work,
   don't unmount the DOM.
10. **The `#embers` canvas is bottom-anchored** via a single CSS rule
    at `src/index.css` (line ~1454). The component (`EmbersCanvas.tsx`)
    has no inline style block. Don't reintroduce inline positioning
    styles — it caused over-constraint resolution surprises in the
    legacy code.
11. **`useCreedReveal` has an invariant docstring note** stating
    `entered` only ever flips false → true. The cleanup-on-dep-change
    branch is correct hook hygiene but unreachable in this app. If
    `entered` ever becomes a multi-flip state, revisit the hook.

## Suggested order for C.1

After each step: `npx tsc --noEmit` clean, hard-reload the browser,
confirm no regressions. Do not batch.

1. **Read the current state** — `src/hooks/useLedger.ts` in full,
   `src/components/Ritual/Ledger.tsx` (uses `state` to render),
   `src/hooks/useQuillProximity.ts:43` (reads `is-signed` class).
2. **Call advisor** with your action-surface design and side-effect
   ownership plan BEFORE writing the reducer. The "where do side
   effects live" question is genuinely a design call and prior
   sessions have found advisor's first-call feedback load-bearing.
3. **Implement the reducer.** Keep `prevLen` as a ref (it's not
   reducer state). Keep the `writeTimerRef` for `flashQuillWriting`
   timer cleanup.
4. **Verify the typecheck + build.** Bundle should stay within
   ±10 KB of 241.03 KB main.
5. **Static audit:**
   ```
   grep -rn "getElementById" src/   # only main.tsx + settings.ts
   grep -n 'addEventListener.*mousemove' src/   # only usePointerPipeline.ts:32
   ```
6. **Browser walkthrough** (or hand the user a focused regression
   checklist if you don't have a browser tool):
   - Scroll to ledger → spine unfolds (closed → opening → idle works).
   - Click the ledger area → input focuses (idle → typing works).
   - Type letters → ink appears, only newly-typed letters stagger
     (`prevLen` semantics preserved).
   - Quill gets `.writing` class on each keystroke (bucket-B
     verification still passes).
   - Sign button visible at ≥ 2 chars.
   - With a DevTools breakpoint on `window.location.href`: click
     sign → letters go wet, overlay fades in, redirect would fire.
   - With ledger in `signed` state: pointer near ledger → quill
     hides (`.is-signed` class on stage being read by
     useQuillProximity).

## Definition of done

1. `useLedger` uses `useReducer` with a typed action surface.
2. `npx tsc --noEmit` clean.
3. `npx vite build` clean, bundle within ±10 KB of 241.03 KB main /
   40.64 KB CSS.
4. `grep -rn "getElementById" src/` returns only `main.tsx` and
   `settings.ts`.
5. Single `addEventListener('mousemove'` in `usePointerPipeline.ts:32`.
6. The 9-point walkthrough still passes (or, if no browser tool, the
   source-level audits + the user's confirmation).
7. `git diff --stat` shows expected files only — no surprise edits to
   `index.css`, `vite.config.ts`, or other infra.

## Out of scope (do NOT start in this session unless user asks)

Existing specs under `docs/superpowers/specs/` describe separate feature
initiatives that pre-date the React migration. Each references the old
`index.html` and needs structural updating before implementation. Listed
here so future sessions know they exist:

- `2026-04-19-ledger-rework-design.md`
- `2026-04-19-entrance-gate-redesign.md`
- `2026-04-19-roof-vault-design.md`
- `2026-04-20-ceiling-rib-vault-design.md`
- `2026-04-20-hero-skylight-alignment.md`
- `2026-04-20-hero-title-alignment-design.md`
- `2026-04-20-skylight-stained-glass-design.md`

## How to start

1. Read `src/hooks/useLedger.ts`, `src/components/Ritual/Ledger.tsx`,
   `src/hooks/useQuillProximity.ts`, and `src/lib/dom.ts`.
2. Start the dev server in the background:
   `npx vite --port 5173 --host 127.0.0.1` (via Bash `run_in_background: true`).
3. **Before writing the reducer**, call the `advisor` tool with your
   action surface and your "where do side effects live" decision.
4. Implement, typecheck, audit, then verify.

## Rules of engagement

- Only commit if the user explicitly asks.
- Do not run destructive git commands (`reset --hard`, `push --force`,
  `checkout .`).
- If browser walkthrough fails and the root cause isn't obvious, stop
  and ask the user rather than guessing.
- Report progress tersely — one sentence per step completion.
- Do not touch files under `docs/superpowers/`.
- Do not run `/simplify` again on this branch — the prior session
  already did, and the resulting helper extraction (`restartAnimation`)
  + comment trims are reflected in the current code. Running it again
  would re-scan the same code with no new findings.

────────────────────────────────────────────────────────────────────────────
