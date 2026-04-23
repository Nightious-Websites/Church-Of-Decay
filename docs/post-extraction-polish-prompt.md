# Post-Extraction Polish — Metaprompt for a new Opus 4.7 session

Paste everything below the `────` line verbatim into a fresh Claude Code session
in the same working directory (`/home/xlaptop/Projects/Claude/Websites/ChurchOfDecay`).

────────────────────────────────────────────────────────────────────────────

# Church of Decay — post-extraction verification + polish

## Where the project is right now

The React migration is **code-complete**. A 2,943-line `index.html` was
carved into React 19 + Vite 6 + TypeScript (strict) + Tailwind v4. Every
Phase 2 and Phase 3 target shipped: Gate subtree, souls ticker, Ledger
(with state-machine hook), Quill + module-level pointer pipeline, Cathedral
SVG relocated, Stage parallax, EmbersCanvas overlay. The legacy
`src/bodyHtml.ts` and `src/hooks/useLegacyEffects.ts` are **deleted**.

Build health (as of handoff):

- `npx tsc --noEmit` — clean.
- `npx vite build` — clean. 62 modules, **241.04 KB** main / **40.61 KB** CSS /
  **11.69 KB** react chunk. Within the ±10 KB target from the extraction brief.
- Dev server: `npx vite --port 5173 --host 127.0.0.1`.

File layout (every file is real React / colocated hook — no inner-HTML
slices remain except the cathedral SVG, which is deliberate):

```
src/
├─ App.tsx — composition root, owns entered/flashing/ledgerStageRef
├─ components/
│  ├─ Gate/{Gate,GateStatic,GateEmbers,EyeGlare,Whisper}.tsx
│  ├─ Overlays/{Flash,CursorDrips,EmbersCanvas}.tsx
│  ├─ Ritual/Ledger.tsx
│  ├─ Stage/{Stage,Cathedral,cathedralSvg.ts}
│  ├─ Settings/SettingsDrawer.tsx
│  ├─ Creed, Footer, GothicDivider, Hero, Litany, Portals, Quill, Topbar.tsx
├─ hooks/
│  ├─ useCreedReveal, useCursorDrips, useLedger, useParallaxScene,
│  │  usePointerPipeline, useQuillProximity, useSectionReveal,
│  │  useSettings, useSoulsTicker.ts
├─ lib/{constants, roman, settings}.ts
└─ index.css — 1,730 lines, unchanged since migration start.
```

Verified in the previous session: typecheck + build clean, dev server HMR
clean, one mousemove listener on document (guaranteed by `usePointerPipeline`'s
ref-counted subscribe). **The browser walkthrough was NOT performed** — that
is the first item of your mission.

## Your mission (Phase 4)

Three buckets, strictly in this order:

### A. Browser verification (mandatory before anything else)

The extraction brief's Definition of Done includes a 9-point walkthrough
that cannot be skipped. Open http://127.0.0.1:5173/ and drive each:

1. **Gate screen loads:** whisper cycles every 4s; eye glare tracks the
   skull; static canvas fades out ~700ms after mount; ember particles
   drift inside the gate layer.
2. **Click "Enter the Nave":** red flash fades in (350ms) → gate dissolves
   (1.8s opacity transition) + stage fades in (2s with 0.5s delay) → flash
   clears at 850ms total.
3. **Scroll:** cathedral pans (parallax); creed lines light sequentially;
   portals fade in with 150ms stagger; ledger pages unfold (spine animation)
   when 50% in viewport.
4. **Type in ledger:** letters ink in via `.letter` → `inkAppear` animation;
   sign button appears at 2+ chars via `.visible`; random ink blot flickers
   on ~40% of keystrokes; quill gets `.writing` class during typing.
5. **Sign flow (⚠ destructive):** letters go wet (`.letter.wet` runs
   `inkWet` with `i * 0.03s` stagger); `.gate-opening` overlay fades in;
   **close the tab within 3.4s or `window.location.href` navigates to
   `GAME_URL`.** Use Chrome's "Pause on exceptions" breakpoint if you need
   to inspect the overlay longer.
6. **Session-skip path:** open an incognito window with
   `sessionStorage.cod_entered = '1'` already set, then load the page. Gate
   must render **invisible on first paint** — no visible flash-of-gate
   before dissolving. If you see a 1.8s fade-from-visible, `entered` isn't
   being read synchronously from `sessionStorage` on first render. Check
   `App.tsx` — the `useState` initializer should be a function, not an
   eagerly-evaluated call.
7. **Clear sessionStorage + reload:** gate re-appears.
8. **Settings drawer (bottom-right ✦ — only visible post-entry because
   `body:has(#stage.revealed) .cod-drawer-toggle` at index.css:1590):**
   drag each of the 6 controls. **Blood hue slider must update the scene
   live during the drag.** This is the StrictMode + `applySettings` cache
   canary; if hue doesn't move the scene, `getTargets()` in
   `src/lib/settings.ts` cached stale DOM nodes from the first-invoke
   mount. Verify by logging `cache.gate === document.getElementById('gate')`
   inside `applySettings` — should always be true.
9. **DevTools console:** run `getEventListeners(document).mousemove?.length`
   — must be exactly `1` (the pipeline's shared listener).

Document anything that fails with enough detail (reproduction steps, exact
symptom) that you can diagnose it without another walkthrough.

### B. Dead-code / ID cleanup

The extraction left a handful of vestigial `id` attributes on elements
that no longer need them — ids the legacy hook used with
`document.getElementById` but React now reaches via refs. Grep to confirm
each id is truly unreferenced in `src/index.css` and `src/lib/settings.ts`
before deleting:

```
grep -nE '#gate\b|#stage\b|#flash\b|#embers\b|#souls\b|#quill\b|#year\b|#whisper\b|#gateStatic\b|#enterBtn\b|#ledger' src/index.css src/lib/settings.ts
```

**Ids that MUST stay** (CSS-referenced):

- `#gate` — `#gate.dissolved` at index.css:92
- `#stage` — `#stage.revealed` at index.css:349, `body:has(#stage.revealed)` at :1590
- `#flash` — `#flash.on` at :1434
- `#embers` — positioning rule at :1454
- `#souls` — `#souls.pulsing` at :1563

**Ids the previous session already dropped** (verify still dropped):
`#whisper`, `#gateStatic`, `#enterBtn`, every `#ledger*`.

**Id that's a loose end:** `#quill` is still queried by `document.getElementById('quill')`
inside `src/hooks/useLedger.ts` (see `flashQuillWriting`). This is the only
remaining cross-component DOM query in the codebase. Clean path:

1. Create a shared `quillRef` (probably in `App.tsx`, alongside `ledgerStageRef`).
2. Pass it as a prop to both `<Quill>` and `<Ledger>`.
3. `useLedger` takes `quillRef` in its opts and uses `quillRef.current.classList`
   instead of `document.getElementById`.
4. Remove `id="quill"` — the class-based CSS selectors (`.quill`, `.quill.writing`)
   don't need it.

### C. Architectural refinements

Each of these is optional — pick what pays back. Sequence them smallest to
biggest risk, and verify each in the browser before committing.

1. **`useReducer` for `useLedger`** (`src/hooks/useLedger.ts`). The
   5-state machine (`closed | opening | idle | typing | signed`) is driven
   by multiple `useState` calls plus refs. A reducer makes the transitions
   explicit and removes the `setState((cur) => (cur === 'idle' ? 'typing' : cur))`
   functional-update guards. Requires redesigning the action surface
   (`OPEN_START`, `OPEN_COMPLETE`, `FOCUS_INPUT`, `SIGN`, etc.).

2. **EmbersCanvas CSS cleanup** (`src/components/Overlays/EmbersCanvas.tsx`
   + `src/index.css:1454`). Current state: CSS rule has `inset: 0` /
   `z-index: 8`; component inlines `bottom:0; left:0; width:100%; height:320px;
   z-index:50`. Browser resolves the conflict as "top-anchored 320px strip"
   (when `top` / `bottom` / `height` are all set, `top` wins). This was
   preserved verbatim for parity. **Decide:** is the top-anchored strip the
   intended look? If no, fix the CSS rule to
   `position: fixed; bottom: 0; left: 0; right: 0; height: 320px; z-index: 50; mix-blend-mode: screen;`
   and drop the inline styles from the component. If yes, replace `inset: 0`
   in the CSS with the explicit edges so the rule documents the actual
   intent, and drop the inline overrides.

3. **Gate sub-component mounting post-entry** (low priority). After
   `.dissolved`, `Whisper`'s 4s interval keeps running, `EyeGlare`'s resize
   listener stays registered, `GateEmbers` DOM stays in the tree. The gate
   is `visibility: hidden` so none of it paints, but the work is wasted.
   If trimming: guard the Gate's children with `{!entered && ...}` so they
   unmount after entry. Caveat: this prevents the dissolve animation from
   playing its full 1.8s (children disappear instantly on `entered` flip).
   Tradeoff worth weighing; safest to leave as-is.

4. **Run `/simplify` on the new components.** The skill reviews changed
   code for reuse, quality, and efficiency. Likely catches: duplicated
   `classList.remove → void offsetWidth → classList.add` restart-animation
   pattern (used in `useSoulsTicker`, `useLedger.pulseBlot`); small
   over-conservative cleanup arrays where a single timer ref would do
   (`Whisper`'s `fadeTimers`).

5. **`useCreedReveal` edge case.** The hook currently treats `entered`
   going false as "disconnect observer" — but in the app, `entered` never
   flips back. The code is correct but documents a scenario that can't
   happen. Either add a comment acknowledging the invariant, or simplify
   the effect to bail early if the observer has already fired.

### D. Feature work (do NOT start in this session — reference only)

Existing specs under `docs/superpowers/specs/` describe separate feature
initiatives. Each was drafted pre-React-migration and references
`index.html`; they need a structural update before implementation. They
are out of scope for this session — do not touch them unless the user
explicitly asks. Listed here so future sessions know they exist:

- `2026-04-19-ledger-rework-design.md`
- `2026-04-19-entrance-gate-redesign.md`
- `2026-04-19-roof-vault-design.md`
- `2026-04-20-ceiling-rib-vault-design.md`
- `2026-04-20-hero-skylight-alignment.md`
- `2026-04-20-hero-title-alignment-design.md`
- `2026-04-20-skylight-stained-glass-design.md`

## Hard constraints (do not violate)

1. **CSS class names are frozen.** The migration preserved every legacy
   class; a rename here silently breaks the scene.
2. **Parity over novelty.** If a slider-drag works before your edit and
   not after, back out immediately — `applySettings`'s DOM cache is load-
   bearing and has a StrictMode interaction that passes casual checks.
3. **`applySettings` must keep working at 60Hz during slider drags.**
   `#stage main`, `#gate`, `.fog-blob`, font-target elements
   (`.hero-church, .hero-decay, .portal-name, .ritual-side h2,
   .litany-head h2, .gate-title, .cmd-num`) must exist in the DOM when
   the drawer mounts.
4. **StrictMode idempotency.** Dev double-invokes effects. Any effect that
   imperatively mutates DOM must be cleanup-complete so the second invoke
   lands in the same state as the first.
5. **Only ONE mousemove listener on document.** `usePointerPipeline`
   enforces this via ref-counted subscribe. If you add a new direct
   `document.addEventListener('mousemove', ...)` call anywhere, the audit
   fails.
6. **Do not install new dependencies.**
7. **Do not restore `bodyHtml.ts` or `useLegacyEffects.ts`** — both are
   deleted and should stay deleted.

## Critical insights from the previous session (read these first)

These are not derivable from the code; they took advisor consults to nail
down and are easy to re-litigate wrong.

1. **Session-skip does not need a separate display path.** `.dissolved`
   is pure CSS transition (`opacity 1.8s ease, visibility 1.8s`), not a
   keyframe animation. CSS transitions don't fire on initial style. So
   rendering `<Gate entered={true}>` on first paint lands at the end
   state instantly — no flash of visible gate. No need for
   `display: none`.

2. **Pointer pipeline is module-level by design, not Context.** Context
   would re-render every consumer at 60Hz during any cursor motion.
   `src/hooks/usePointerPipeline.ts` uses a module-scope `Set` of
   subscribers + rAF-coalesced tick + ref-counted listener
   attach/detach. Don't "improve" this into a context provider.

3. **Wrapper-div CSS fracture is not a risk here.** The entire codebase
   has exactly one `>` combinator in a drawer selector and zero
   nth-child/first-child against `main`/`#stage`/`.gate-inner`. You can
   freely wrap or restructure without breaking CSS sibling/descendant
   rules. Re-verify with:
   ```
   grep -nE ' *> *[.#a-z\*]|\+[a-z\.\#]| *~ *[.#a-z]' src/index.css
   ```

4. **Letter-by-letter ink stagger uses `prevLen` ref, not position.**
   In `src/components/Ritual/Ledger.tsx`, each letter's `animationDelay`
   is `Math.max(0, i - prevLen) * 0.04s` so only newly-added letters get
   staggered. Using absolute `i * 0.04s` would give the 5th letter a
   200ms delay when typed — feels laggy. `prevLen` is updated inside
   a `useEffect(() => { prevLenRef.current = input.length; }, [input])`
   so during the render that adds a letter, `prevLen` still holds the
   value from the prior render.

5. **EmbersCanvas CSS conflict is intentional parity.** See item C.2.

6. **The ledger's sign-and-redirect overlay stays imperative.** A
   body-level `appendChild` + 3.4s timeout + `window.location.href`
   navigation doesn't benefit from JSX; nothing reacts to it, the page
   navigates away regardless. Leave it in `useLedger.onSign` as-is.

## Suggested order (smallest to biggest risk)

After each step: `npx tsc --noEmit` clean, hard-reload the browser,
confirm no regressions. Do not batch.

1. **Browser walkthrough (bucket A).** Report failures here first before
   writing any code. If any of items 1–9 fail, stop and diagnose.
2. **`#quill` dead-id cleanup (bucket B).** Smallest refactor, clearest
   win. One new ref threaded through two components.
3. **EmbersCanvas CSS decision (bucket C.2).** Pick one resolution; one-
   file change.
4. **`/simplify` skill run (bucket C.4).** Let the skill surface dupes.
5. **`useReducer` for `useLedger` (bucket C.1).** Largest refactor;
   parity risk is non-trivial because the state machine is load-bearing
   for quill proximity (the `is-signed` class check) and letter wetness.
6. **Any feature-work touches only if the user explicitly scopes them**
   — otherwise leave the `docs/superpowers/specs/` files alone.

## Definition of done

1. All 9 browser-walkthrough items pass.
2. `getEventListeners(document).mousemove.length === 1`.
3. `grep -rn "getElementById" src/` returns only the already-commented
   pre-existing queries in Settings code, or zero hits if `#quill`
   cleanup landed.
4. `npx tsc --noEmit` clean, `npx vite build` clean, bundle within ±10 KB
   of 241 KB main.
5. `git diff --stat` shows only intended files touched — no surprise
   edits to `index.css`, `vite.config.ts`, or other infra.

## How to start

1. Read `src/App.tsx` (composition root, state lifts), `src/hooks/useLedger.ts`
   (the densest remaining hook — target of the biggest refactor),
   `src/hooks/usePointerPipeline.ts` (the performance-critical module),
   and `src/lib/settings.ts` (the cache canary).
2. Start the dev server in the background:
   `npx vite --port 5173 --host 127.0.0.1` (via Bash `run_in_background: true`).
3. **Before writing any code**, call the `advisor` tool to sanity-check your
   cleanup plan. Previous sessions have found advisor's first-call feedback
   load-bearing — the pointer-pipeline shape, the `.dissolved` CSS analysis,
   and the wrapper-div audit all came from advisor consults.
4. Do bucket A first. Everything else is conditional on the walkthrough
   passing.

## Rules of engagement

- Only commit if the user explicitly asks.
- Do not run destructive git commands (`reset --hard`, `push --force`,
  `checkout .`).
- If a browser walkthrough item fails and the root cause isn't obvious,
  stop and ask the user rather than guessing.
- Report progress tersely — one sentence per bucket completion.
- Do not touch files under `docs/superpowers/` — those are pre-migration
  specs tracked as future work.

────────────────────────────────────────────────────────────────────────────
