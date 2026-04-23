# Component Extraction — Phase 2+3 Metaprompt for a new Opus 4.7 session

Paste everything below the `────` line verbatim into a fresh Claude Code session
in the same working directory (`/home/xlaptop/Projects/Claude/Websites/ChurchOfDecay`).

────────────────────────────────────────────────────────────────────────────

# Church of Decay — finish the React component extraction (Phase 2 + 3)

## Where the project is right now

A gothic single-page site has been migrated from a 2,943-line `index.html` to
**React 19 + Vite 6 + TypeScript (strict) + Tailwind v4**. The `bodyHtml.ts`
monolith was first split into named slices, then the top-level React tree was
scaffolded so each remaining `dangerouslySetInnerHTML` lives inside its real
JSX container (no wrapper-div fracture). **Phase 1 is complete** — Topbar,
Hero, Creed, Portals (with JSX candles), GothicDivider, Litany, Footer are
all real React components. The body slice is down from 774 → 582 lines.

What still uses raw HTML + the mega-hook:

- **Gate** (lines 9–50 of `src/bodyHtml.ts` → `gateInnerHtml`) — the gate
  screen, including watcher image, eye glare, whisper, static canvas, ember
  particles, Enter button.
- **Cathedral SVG** (lines 52–535 → `cathedralSceneInnerHtml`) — ~480 lines
  of `defs`/`filter`/`mask`/`linearGradient`/`xlink:href`. Stays as a raw
  string per the original architectural decision; just relocate it into a
  named export `src/components/Stage/cathedralSvg.ts`.
- **Ritual section** (the inner content of `<main>`'s last raw block → 
  `mainInnerHtml`) — the ledger book, including the entries lists, input,
  rendered ink span container, sign button.
- **Quill** (`<div className="quill" id="quill">` in `App.tsx`) — JSX
  wrapper exists, but the `transform` is set imperatively by the hook on
  every coalesced mousemove tick.
- **Flash overlay** (`<div id="flash" />` in `App.tsx`) — JSX exists, but
  the `.on` class is toggled imperatively.

What's still in `useLegacyEffects` and needs to be redistributed:

- Whisper cycle, eye glare positioning, gate static (rAF noise) intro
- Gate ember particles (22 imperative `<div>` children appended to `#gate`)
- Enter-the-Nave click flow + sessionStorage
- Souls ticker (`#souls` textContent + `.pulsing` restart anim)
- Ledger: fake-name population, state machine (`closed`/`opening`/`idle`/
  `typing`/`signed`), letter-by-letter ink rendering, sign + redirect overlay
- Coalesced mousemove → quill proximity + blood drips (single rAF tick)
- Parallax scene pan (cached layout reads, `translate3d`)
- Ember particle canvas (currently appended to `document.body` — must move
  inside a React-managed overlay container)
- Section reveal observer (`.ritual, .litany`)
- Portal reveal observer (`.portal`)
- Creed line reveal observer (`.creed .line`)

## Current architecture (what you'll be changing)

- `src/App.tsx` — `<SettingsProvider>` → `<AppShell>` (calls
  `useLegacyEffects()`) renders the top-level tree. Gate / cathedral / ritual
  inner-HTML each live inside their real JSX parent. Quill, Flash, and the
  drawer are siblings.
- `src/bodyHtml.ts` — 582 lines, exports `gateInnerHtml`,
  `cathedralSceneInnerHtml`, `mainInnerHtml` (just the ritual section now).
- `src/hooks/useLegacyEffects.ts` — 628 lines; one mega-hook holding every
  remaining behavior. **Must end up empty/deleted.**
- `src/hooks/useSettings.tsx` — context provider with debounced localStorage.
  `useEffect(() => requestAnimationFrame(() => applySettings(settings)))`
  applies on first paint after the JSX commits. Don't break this.
- `src/lib/settings.ts` — `applySettings()` writes CSS vars + palette + filter
  + blur + font. Has a `getTargets()` cache invalidated by
  `document.contains(cache.gate)`. **Load-bearing**: keep `#stage main`,
  `#gate`, `.fog-blob`, and font-target elements in the DOM so the cache
  resolves correctly under StrictMode's double-invoke.
- `src/lib/constants.ts` — `GAME_URL`, `WHISPERS`, `FAKE_NAMES_LEFT/RIGHT`,
  `OLD_INDICES_*`.
- `src/lib/roman.ts` — `toRoman()`.
- `src/components/`:
  - `Settings/SettingsDrawer.tsx` — already React, untouched.
  - `Footer.tsx`, `Litany.tsx`, `Hero.tsx`, `Creed.tsx`, `Topbar.tsx`,
    `Portals.tsx`, `GothicDivider.tsx` — Phase 1 extractions, all pure JSX.
  - `Gate/`, `Overlays/`, `Ritual/`, `Stage/` — empty subdirectories ready
    to receive the Phase 2/3 components.
- `src/index.css` — 1,730 lines, Tailwind `@import` + `@theme` tokens + every
  legacy class/keyframe wrapped in `@layer components`. **Do not rename
  classes.** CSS audit confirms only one `>` combinator in the entire file
  (`.cod-drawer-body label > span` in the already-React drawer); no nth-child
  or first-child selectors against `main`/`#stage`/`.gate-inner`/etc. So
  intermediate wrapper divs from `dangerouslySetInnerHTML` containers are
  safe — they don't break anything.
- `index.legacy.html` (gitignored) — the original pre-migration snapshot.
  Use as the canonical source of truth for markup + JS logic. Body is
  lines 1565–2337; original JS is lines 2340–2939.

### Build health

- `npx tsc --noEmit` — clean.
- `npx vite build` — clean; ~40 KB CSS + ~11 KB react chunk + ~239 KB main.
- Dev server: `npx vite --port 5173 --host 127.0.0.1` (you spin it up).

## Your mission

Finish carving the remaining behavior out of `useLegacyEffects` into hooks
**colocated with the components that own them**. When done,
`src/bodyHtml.ts` and `src/hooks/useLegacyEffects.ts` should be **deleted**,
and the app should look and behave identically.

Parity is the bar. You are not refactoring CSS or changing visual behavior.

## Hard constraints (do not violate)

1. **CSS class names are frozen.** Rename a class and you break the scene.
2. **The cathedral SVG stays as a raw string** (`src/components/Stage/cathedralSvg.ts`)
   rendered via `dangerouslySetInnerHTML` on `.scene`. Only this one place
   may use `dangerouslySetInnerHTML` in the final state. Hand-converting 480
   lines of `defs`/`filter`/`mask`/`linearGradient`/`xlink:href` is tedious
   and error-prone, and the SVG has no React reactivity needed.
3. **`applySettings` must keep working at 60Hz during slider drags.**
   `#stage main`, `#gate`, `.fog-blob`, and font-target elements
   (`.hero-church, .hero-decay, .portal-name, .ritual-side h2, .litany-head h2,
   .gate-title, .cmd-num`) must exist in the DOM when the drawer mounts.
4. **StrictMode idempotency.** Dev mode double-invokes `useEffect`. Any hook
   that imperatively appends DOM must guard against double-append (e.g.,
   `container.replaceChildren()` before filling) or track its spawned nodes
   in a ref and clean them up. The existing code already follows this
   pattern — don't regress it.
5. **Hot-path performance must not regress.** The mousemove pipeline is
   *one* rAF-coalesced handler driving both quill proximity and drip spawning.
   See "Shared mouse pipeline" below — you must preserve this property.
6. **Settings drawer must still work unchanged.** `SettingsProvider` wraps
   the tree; `useSettings` is consumed only by `SettingsDrawer` today.
7. **Do not install new dependencies** unless absolutely required.
8. **Do not touch `index.legacy.html`** — it's the reference snapshot.

## Critical advisor insights from the previous session (read these first)

These are not in the brief above — they're load-bearing decisions that took
the previous session a careful audit + advisor consult to nail down. Do not
re-litigate them; build on them.

### 1. Wrapper-div CSS fracture is NOT a risk in this codebase

`grep -nE ' *> *[.#a-z\\*]|\\+[a-z\\.\\#]| *~ *[.#a-z]' src/index.css` returns
exactly one match — `.cod-drawer-body label > span` inside the already-React
drawer. There are zero `nth-child`, `first-child`, or `last-child` selectors
against `main`, `#stage`, `.gate-inner`, etc. So when you wrap a remaining
inner-HTML slice in a `<div dangerouslySetInnerHTML>` inside a real JSX
parent, the inserted wrapper does not break any selector. Verify this is
still the case after your edits if you add new CSS.

### 2. Lift `entered` state to `AppShell` BEFORE extracting Gate

This is the first thing to do in Phase 2. Right now
`sessionStorage.getItem('cod_entered') === '1'` plus imperative
`gate.style.display = 'none'` + `stage.classList.add('revealed')` drive the
post-entrance state. Once Gate becomes React, this needs:

```tsx
// AppShell
const [entered, setEntered] = useState<boolean>(
  () => typeof window !== 'undefined' && sessionStorage.getItem('cod_entered') === '1'
);
const onEnter = useCallback(() => {
  sessionStorage.setItem('cod_entered', '1');
  setEntered(true);
}, []);
```

- `<Gate>` keeps mounting (so its dissolve animation can play) and gets
  `entered` + `onEnter` as props. It applies `.dissolved` via className when
  `entered`. **Important:** Gate must still mount on first render for the
  reveal sequence to fire when `entered` flips, so don't conditionally render
  the gate — drive its visual state via class.
- `<Stage>` gets `entered` and applies `.revealed` className.
- `<Flash>` becomes state-driven (`flashing: boolean`); `onEnter` flips
  flashing → true, schedules a 350ms timeout to dissolve gate / reveal
  stage / reset flash on a setTimeout chain.

This decision affects every Phase 2 component because Stage's className is
conditional. Lock it in before touching Gate's subcomponents.

### 3. Pointer pipeline: module-level subscription, NOT React Context

If you put `{x, y}` in Context and update every rAF, every consumer
re-renders at 60Hz. The existing imperative approach is correct for a
reason. Shape:

```ts
// src/hooks/usePointerPipeline.ts
type PointerHandler = (x: number, y: number) => void;
const subscribers = new Set<PointerHandler>();
let mx = 0, my = 0;
let pending = false;
let mountCount = 0;
let detach: (() => void) | null = null;

const tick = () => {
  pending = false;
  for (const cb of subscribers) cb(mx, my);
};
const onMove = (e: MouseEvent) => {
  mx = e.clientX; my = e.clientY;
  if (!pending) { pending = true; requestAnimationFrame(tick); }
};

export function subscribePointer(cb: PointerHandler): () => void {
  subscribers.add(cb);
  if (mountCount++ === 0) {
    document.addEventListener('mousemove', onMove, { passive: true });
    detach = () => document.removeEventListener('mousemove', onMove);
  }
  return () => {
    subscribers.delete(cb);
    if (--mountCount === 0 && detach) { detach(); detach = null; }
  };
}
```

Then `useQuillProximity(ledgerRef, quillRef)` and `useCursorDrips(containerRef)`
each `subscribePointer(cb)` inside their effect. One listener, one rAF tick
per frame, multiple consumers. Zero React renders from pointer movement.

### 4. Portal candles already collapsed to JSX (precedent for elsewhere)

Phase 1 already turned `<div class="portal-candle">` from imperative
`createElement` + `appendChild` into JSX with
`style={{ animationDelay: \`\${i * 0.85}s\` }}`. Apply the same logic
elsewhere: gate ember particles (22 of them, also pure decoration with
randomized inline styles) can be JSX with `useMemo` to compute the random
positions once per mount. Don't preserve `createElement` patterns when JSX
expresses them losslessly.

### 5. `applySettings` first-paint race + StrictMode

`SettingsProvider`'s effect schedules `requestAnimationFrame(() => applySettings(settings))`
on mount. For first-paint to land correctly, `#stage main`, `#gate`,
`.fog-blob`, and font-target elements must be in the DOM when that rAF
fires. They will be (React commits synchronously before yielding). But
StrictMode double-invokes effects: first commit caches targets, dev-mode
unmount removes them, remount creates new ones, the
`document.contains(cache.gate)` check should re-query. Verify by logging
the cache identity after remount during your first verification cycle —
this is exactly the kind of thing that silently half-breaks (old filter
applied to a detached node, drawer slider stops updating the visible
scene). Do not trust "looks fine" without a slider-drag test.

## Suggested order (smallest to biggest risk)

Each step is a diffable unit. After each, run `npx tsc --noEmit`, then
hard-reload the dev server in the browser and confirm visual + behavioral
parity before moving on. Do not batch.

### Phase 2.1 — Lift `entered` state, extract Gate subtree

This is the biggest single step. **Lift state first**, then extract.

1. In `AppShell`, hold `entered` and `flashing` state. Pass to children.
2. `src/components/Gate/Gate.tsx` — gate wrapper. Receives `entered`,
   `flashing`, `onEnter`. Applies `dissolved` className when `entered`,
   stays mounted so the dissolve transition runs.
3. Children (each gets its own colocated hook):
   - `Gate/GateStatic.tsx` — canvas + `useGateStatic` (rAF noise, 325ms
     duration, then fade out).
   - `Gate/GateEmbers.tsx` — 22 ember `<div>`s as JSX. Compute the random
     `cssText` values once via `useMemo`. No imperative `appendChild`.
   - `Gate/EyeGlare.tsx` — `useEyeGlare(watcherRef, glareRef)` positions
     glare based on watcher image rect. Listen to `load` + `resize`.
   - `Gate/Whisper.tsx` — `useWhisperCycle()` cycles WHISPERS strings on
     a 4s interval with 650ms fade.
   - `Gate/GateEnter.tsx` — the Enter + Skip buttons. `onClick` calls
     `props.onEnter`. **Delete the inline `onclick="enterNave()"`** —
     it's a leftover from the legacy HTML and React can't bind to it.
4. `src/components/Overlays/Flash.tsx` — `<div id="flash" className={flashing ? 'on' : ''} />`.
   The 350ms / 500ms timeline lives in `AppShell.onEnter`:
   ```tsx
   const onEnter = useCallback(() => {
     sessionStorage.setItem('cod_entered', '1');
     setFlashing(true);
     setTimeout(() => {
       setEntered(true);
       setTimeout(() => setFlashing(false), 500);
     }, 350);
   }, []);
   ```
5. Move the **creed reveal** into a `useCreedReveal()` hook colocated with
   `Creed.tsx`. Trigger it when `entered` becomes true (or on mount if
   `entered` is initially true). Use the existing IntersectionObserver
   pattern from `useLegacyEffects.initCreedReveal` — but pass the host ref
   and observe internally instead of querying by class.

### Phase 2.2 — Souls ticker into `useSoulsTicker` colocated with Topbar

Topbar markup is already extracted. Move the souls-ticker `setInterval` +
`restartAnim('pulsing')` block from `useLegacyEffects` into
`src/hooks/useSoulsTicker.ts` (or inline inside `Topbar.tsx`). Replace
`document.getElementById('souls')` with a `useRef<HTMLElement>` attached to
the JSX `<b>` element. State the initial value via `useState` so React
controls textContent and you don't need imperative manipulation.

### Phase 2.3 — Ledger (most logic-dense)

1. `src/components/Ritual/Ledger.tsx` — extract the markup from
   `mainInnerHtml`. The markup has many ids you need to keep aware of:
   `#ledgerStage`, `#ledgerInput`, `#ledgerRendered`, `#ledgerInkBlot`,
   `#ledgerSignBtn`, `#ledgerSignNumber`, `#ledgerEntriesLeft`,
   `#ledgerEntriesRight`. Replace `document.getElementById` lookups with
   refs.
2. `src/hooks/useLedger.ts` — the state machine. State: `closed | opening
   | idle | typing | signed`. Returns `{ state, transitionTo, input,
   onFocus, onInput, onKeyDown, onSign }`. Fake-name population is a
   `useEffect(() => { populate(); }, [])` that uses `replaceChildren` on
   the lists' refs (or, cleaner, render the lists from JSX maps over the
   constants).
3. **Letter-by-letter ink** is pure JSX:
   ```tsx
   {input.split('').map((ch, i) => (
     <span key={i} className={`letter ${state === 'signed' ? 'wet' : ''}`}
       style={{ animationDelay: `${i * 0.04}s` }}>{ch}</span>
   ))}
   ```
   This replaces the imperative `createElement('span')` + diff-vs-renderedLen
   logic in the legacy code. React's reconciler handles the "added new
   letter" case — you don't need a `renderedLen` counter.
4. Sign-and-redirect overlay (the `gate-opening` div appended to body) —
   stays imperative. Dynamic body-level appendChild with `window.location.href`
   redirect doesn't benefit from JSX. Document why it's imperative.
5. Quill proximity + writing class — driven by ledger state and the pointer
   pipeline (Phase 2.4). Don't tangle the two: Ledger's `useLedger` cares
   about input state; the quill cares about cursor position + ledger rect.

### Phase 2.4 — Quill + module-level pointer pipeline

1. `src/hooks/usePointerPipeline.ts` — module-level subscriber pattern from
   advisor insight #3. Mount once.
2. `src/hooks/useQuillProximity.ts` — subscribes, reads cached ledger rect
   (invalidate on scroll/resize), updates the quill's transform. Caches the
   rect in a ref to avoid layout thrash.
3. `src/hooks/useCursorDrips.ts` — subscribes, throttled + probabilistic +
   capped (max 12 active). Pre-allocates a small pool of drip elements in
   a React-managed container instead of `document.body.appendChild`.
4. `src/components/Quill.tsx` — the existing `<div className="quill" id="quill">`
   becomes a component, owns its ref, calls `useQuillProximity`.
5. `src/components/Overlays/CursorDrips.tsx` — owns a `<div className="drip-layer">`
   container ref, calls `useCursorDrips`.
6. **Remove the imperative mousemove handler from `useLegacyEffects`** in
   the same step. Verify only **one** `mousemove` listener is registered on
   `document` after this phase.

### Phase 3.1 — Cathedral SVG to its own raw-string module

1. Extract the 480-line SVG from `cathedralSceneInnerHtml` into
   `src/components/Stage/cathedralSvg.ts` as a raw string export.
2. `src/components/Stage/Cathedral.tsx` renders `<svg className="arches">`
   wrapper with `dangerouslySetInnerHTML` for the inner content (or the
   entire `<svg>` via innerHTML on a wrapper div if simpler — try both,
   pick the one that works without React warnings about SVG namespacing).
3. After this, `cathedralSceneInnerHtml` should be empty/deletable, and
   `bodyHtml.ts` exports only `gateInnerHtml` (still consumed by Gate via
   per-subcomponent JSX in Phase 2.1) and possibly `mainInnerHtml` (still
   consumed by Ledger). After Phase 2.3 those are also gone, so
   `bodyHtml.ts` can be deleted at the end.

### Phase 3.2 — Stage with `useParallaxScene` hook

1. `src/components/Stage/Stage.tsx` — `<div id="stage">` wrapper. Owns
   `useParallaxScene()` hook with cached `maxScroll` / `panDistance`
   layout reads, `translate3d`, and resize-based recompute. Recompute
   on `entered` change too (since dissolving the gate may shift layout).
2. `src/components/Stage/Fog.tsx` — `<div className="fog">` (currently
   inline in `App.tsx`). Tiny static component for symmetry with Cathedral.
3. The empty `.fog-layer` (still in `App.tsx`) can stay as a `<div className="fog-layer" style={{display:'none'}} />`
   inline, OR be removed entirely if you confirm nothing references it.
   `applySettings` queries `.fog-blob` (which doesn't exist in current
   markup), so removing the empty `.fog-layer` is safe.

### Phase 3.3 — EmbersCanvas + CursorDrips overlays (React-managed)

1. `src/components/Overlays/EmbersCanvas.tsx` — `<canvas>` with `useRef`,
   imperative draw loop in `useEffect`. Mount inside an overlay container
   in the React tree, not `document.body.appendChild`. Use `position:
   fixed; bottom: 0` style on the wrapper. Add `useEffect` for
   `visibilitychange` to pause/resume the rAF loop.
2. `src/components/Overlays/CursorDrips.tsx` (already touched in Phase 2.4)
   — finalize: pre-allocated pool of `MAX_DRIPS` (12) drip elements,
   each with a state slot (active/inactive); the hook activates a slot
   instead of `appendChild`/`remove`. This avoids GC churn during heavy
   pointer movement.

### Phase Final — Delete legacy files, verify parity

1. `git rm src/bodyHtml.ts src/hooks/useLegacyEffects.ts`. Both should now
   be unreferenced.
2. `App.tsx` should compose: `<SettingsProvider><AppShell>…</AppShell></SettingsProvider>`
   where `AppShell` renders `<Gate>`, `<Stage>` (with `<Cathedral/>`,
   `<Fog/>`, `<main>` content), `<Footer/>`, `<Flash/>`, `<Quill/>`,
   `<CursorDrips/>`, `<EmbersCanvas/>`, `<SettingsDrawer/>`.
3. `npx tsc --noEmit` clean. `npx vite build` clean (similar bundle
   sizes — main JS should still be ~240 KB ± 10 KB).
4. **Browser walkthrough (must pass all):**
   - Gate appears with whisper cycling, eye glare, static intro
   - Click "Enter the Nave" → flash → gate dissolves → stage reveals
   - Scroll: cathedral parallax pans, creed lines light sequentially,
     portals reveal with staggered candles, ledger opens on scroll
   - Type a name in the ledger: letters ink in, sign button appears at
     2+ chars
   - Sign → wet flood → gate-opening overlay → would-redirect (cancel
     before it actually leaves)
   - Hard reload: session-skip works (gate stays hidden)
   - Clear sessionStorage → reload → gate re-appears
   - Settings drawer (✦) toggles all 6 controls; sliders update at 60Hz
     with no console errors
5. **DevTools check:** only ONE `mousemove` listener registered on
   `document`. Run `getEventListeners(document)` in Chrome DevTools console
   and verify.

## Specific gotchas (from the previous session's experience)

- **React 19 void-element requirement:** JSX requires self-closing on
  voids (`<img />`, `<input />`, `<br />`). Mechanical `class`→`className`,
  `for`→`htmlFor`, `stroke-width`→`strokeWidth`, `xlink:href`→`xlinkHref`.
- **No-whitespace adjacency in JSX:** `<b>{title}</b>{text}` produces
  `<b>title</b>text` with no space. Adding a literal space (`<b>{title}</b> {text}`)
  visibly diverges. Match the legacy markup character-precisely.
- **IDs are load-bearing for now and may stay so:** `applySettings` queries
  `#stage main`, `#gate`. The legacy hook queries `#whisper`, `#gateStatic`,
  `#souls`, `#ledgerStage`, `#ledgerInput`, `#ledgerRendered`, `#ledgerInkBlot`,
  `#ledgerSignBtn`, `#ledgerSignNumber`, `#quill`, `#enterBtn`, `#flash`,
  `#ledgerEntriesLeft`, `#ledgerEntriesRight`. As you replace each query
  with a ref, **don't remove the id from the JSX** until you've grepped
  both `src/index.css` and `src/lib/settings.ts` to confirm no external
  reference remains. Many of these ids are not in CSS at all and can be
  removed once their `getElementById` callsite is gone.
- **Tailwind v4 is css-first.** Bespoke gothic styling comes from existing
  classes; new component chrome can use Tailwind utilities, but atmospheric
  visuals must not.
- **Don't add a router or global state library.** Single page, single
  `entered` boolean, single `flashing` boolean.
- **Per-component `useEffect` listeners must not multiply.** If you add
  `mousemove`, `scroll`, or `resize` listeners per-component, you'll silently
  regress hot-path performance. Audit at the end with DevTools.

## Definition of done

1. `src/bodyHtml.ts` is **deleted**.
2. `src/hooks/useLegacyEffects.ts` is **deleted**.
3. Only **one** `mousemove` listener on `document`.
4. `npx tsc --noEmit` clean, `npx vite build` clean.
5. Browser walkthrough above passes end-to-end with no visual or behavioral
   regressions.
6. `git diff --stat` shows file moves/creations/deletions only — no
   surprise changes to `index.css`, `vite.config.ts`, or other infra files.

## How to start

1. Read `src/App.tsx`, `src/bodyHtml.ts` (skim — 582 lines), and
   `src/hooks/useLegacyEffects.ts` (read fully — 628 lines) to load context.
2. Read `src/lib/settings.ts` and `src/hooks/useSettings.tsx` to understand
   the cache invariants.
3. Skim `src/components/Topbar.tsx` and `src/components/Portals.tsx` for
   the established Phase 1 patterns (data-driven JSX, JSX candles).
4. Start the dev server in the background (`npx vite --port 5173 --host 127.0.0.1`).
5. **Call the advisor tool BEFORE writing code** — sanity-check your Phase
   2.1 state-lift design and your pointer-pipeline interface. The advisor
   already nailed the wrapper-div risk + pointer pipeline pattern in the
   previous session; lean on it for the remaining architectural calls.
6. Do Phase 2.1 first, verifying in the browser after each subcomponent.
   The Gate subtree is the riskiest single step — get it right before
   anything else.
7. Only delete `bodyHtml.ts` and `useLegacyEffects.ts` in the final commit,
   after every behavior has been relocated and verified.

## Rules of engagement

- Only commit if the user explicitly asks.
- Do not run destructive git commands (`reset --hard`, `push --force`,
  `checkout .`).
- If you hit a genuine architectural fork, stop and ask the user rather
  than guessing.
- Report progress tersely: one sentence per phase completion.

────────────────────────────────────────────────────────────────────────────
