# Component Extraction — Metaprompt for a new Opus 4.7 session

Paste everything below the `────` line verbatim into a fresh Claude Code session
in the same working directory (`/home/xlaptop/Projects/Claude/Websites/ChurchOfDecay`).

────────────────────────────────────────────────────────────────────────────

# Church of Decay — finish the React component extraction

## Where the project is right now

A gothic single-page site has already been migrated from a 2,943-line
`index.html` to **React 19 + Vite 6 + TypeScript (strict) + Tailwind v4**.
Scaffolding, CSS port, settings system, and a new interactive `SettingsDrawer`
are done and working. The one remaining piece of the original plan is the
architectural payoff: carving the body out of a raw-HTML string into real,
typed React components.

### Current architecture (what you'll be changing)

- `src/App.tsx` — `<SettingsProvider>` → `<AppShell>` renders
  `<div dangerouslySetInnerHTML={{ __html: bodyHtml }} />` + `<SettingsDrawer />`.
- `src/bodyHtml.ts` — the **entire body**, 773 lines, exported as one raw
  HTML template literal. Contains the gate screen, the cathedral SVG
  (~400 lines with `defs`/`filter`/`mask`/`linearGradient`), the hero, creed,
  four portals, ledger, litany, and footer.
- `src/hooks/useLegacyEffects.ts` — ~580 lines; one mega-hook that attaches
  **every** runtime behavior (whisper cycle, eye glare, gate static canvas,
  22 DOM ember particles, souls ticker, Enter-the-Nave flow, creed reveal,
  ledger state machine + fake-name population, letter-by-letter ink
  rendering, sign/redirect overlay, coalesced mousemove for quill-proximity +
  blood-drips, parallax scene pan, ember particle canvas, portal candles,
  portal reveal, section reveal) by `querySelector`-ing into the raw HTML.
- `src/hooks/useSettings.tsx` — context provider with debounced localStorage
  (`cod_settings`) + `pagehide` flush. Consumed by `SettingsDrawer`.
- `src/lib/settings.ts` — `applySettings()` writes CSS vars + palette + filter
  + blur + font. Has a **`getTargets()` DOM-target cache** (checks
  `document.contains(cache.gate)` to invalidate) — this cache is load-bearing
  and you must keep it correct as you swap the DOM.
- `src/lib/constants.ts` — `GAME_URL`, `WHISPERS`, `FAKE_NAMES_LEFT/RIGHT`,
  `OLD_INDICES_*`.
- `src/lib/roman.ts` — `toRoman()`.
- `src/index.css` — 1,600 lines: Tailwind `@import` + `@theme` tokens + every
  legacy class/keyframe wrapped in `@layer components`. **Do not rename
  classes.** The CSS is the contract.
- `index.legacy.html` (gitignored, still on disk) — the original pre-migration
  snapshot. Use as the canonical source of truth for markup + JS logic.

### Build health

- `npx tsc --noEmit` — clean.
- `npx vite build` — clean; ~40 KB CSS + ~11 KB react chunk + ~240 KB main.
- Dev server: `npx vite --port 5173 --host 127.0.0.1`.

## Your mission

**Replace `src/bodyHtml.ts` with real React components**, with the JS logic
currently in `useLegacyEffects` redistributed into **hooks colocated with the
component that owns them**. When done, `bodyHtml.ts` and `useLegacyEffects.ts`
should be **deleted**, and the app should look and behave identically.

You are NOT refactoring CSS or changing visual behavior. Parity is the bar.

## Hard constraints (do not violate)

1. **CSS class names are frozen.** The ported bespoke CSS drives every visual.
   Rename a class and you break the scene. If you want a new class for a new
   React-specific concept, add it, don't repurpose existing ones.
2. **The cathedral SVG stays as a raw string rendered via `dangerouslySetInnerHTML`.**
   It's ~400 lines of `defs`/`filter`/`mask`/`linearGradient`/`xlink:href` — hand-
   converting every attribute (`stroke-width`→`strokeWidth`, etc.) is tedious
   and error-prone, and it's static content with no React reactivity needed.
   Extract the cathedral SVG markup into `src/components/Stage/cathedralSvg.ts`
   as a raw string export and keep using `dangerouslySetInnerHTML` for **it
   only**. The rose SVG (~70 lines) and the small icon SVGs (<30 lines each)
   are small enough to convert to JSX by hand.
3. **`applySettings` must keep working at 60Hz during slider drags.** That
   means the `#stage main`, `#gate`, `.fog-blob`, and font-target elements
   have to exist in the DOM with **those exact ids/classes** by the time the
   drawer mounts. Verify the cache invalidation in `src/lib/settings.ts`
   (`document.contains(cache.gate)`) still behaves correctly — it should
   trigger a re-query on first real render.
4. **StrictMode idempotency.** Dev mode double-invokes `useEffect`. Any hook
   that imperatively appends DOM must either guard against double-append
   (e.g., `container.replaceChildren()` before filling) or track its spawned
   nodes in a ref and clean them up in the return fn. The existing code
   already follows this pattern — don't regress it.
5. **Hot-path performance must not regress.** The existing `useLegacyEffects`
   already coalesces quill-proximity + blood-drips into one rAF-throttled
   mousemove, caches the ledger rect, and caches parallax layout reads. Keep
   those optimizations when you redistribute the logic — don't let
   per-component hooks each register their own `mousemove` listener.
6. **Settings drawer must still work unchanged.** The `SettingsProvider`
   wraps the tree; `useSettings` is consumed only by `SettingsDrawer` today.
   Don't break that wiring.
7. **Do not install new dependencies** unless absolutely required.
8. **Do not touch `index.legacy.html`** — it's the reference snapshot.

## Suggested order (smallest to biggest risk)

Each step is a diffable unit. After each, run `npx tsc --noEmit` and reload
the dev server in the browser; confirm visual + behavioral parity before
moving on. Do not batch.

### Phase 1 — the skeleton

Extract purely-structural components that wrap JSX with **no behavior**.
These just replace swaths of the HTML string.

1. `src/components/Footer.tsx` — the footer block. Simplest first.
2. `src/components/Litany.tsx` — Litany of Rot section, static content.
3. `src/components/Hero.tsx` — hero title + creed container (creed reveal
   behavior stays in a hook for now — see Phase 3).
4. `src/components/Portals.tsx` + `src/components/Portal.tsx` —
   extract the four portal cards. Accept props for `name`, `href`,
   `description`, `iconSvg` (or inline per-portal icon JSX). Candle spawn
   and reveal observer stay in a hook for now.

At this point `bodyHtml.ts` is shrinking. `useLegacyEffects` still runs the
whole behavior layer.

### Phase 2 — interactive subtrees

5. `src/components/Gate/Gate.tsx` — gate screen wrapper. Split its children:
   - `GateStatic.tsx` — canvas + the `drawNoise` rAF effect.
   - `GateEmbers.tsx` — the 22 DOM ember children (hook: `useGateEmbers`).
   - `EyeGlare.tsx` — the glare positioner (hook: `useEyeGlare`).
   - `Whisper.tsx` — the cycling whisper line (hook: `useWhisperCycle`).
   - `GateEnter.tsx` — the button + session flag + flash + handoff to
     `onEnter` callback (so the parent can drive state).
   The Enter button's click handler (which today calls `enterNave()` in
   `useLegacyEffects`) should bubble up via a prop callback; parent
   component owns the "entered" state and applies `.revealed` on `#stage`.
6. `src/components/Topbar.tsx` — with `useSoulsTicker` hook.
7. `src/components/Ritual/Ledger.tsx` — the ledger book. This is the most
   logic-dense piece. Move the ledger state machine into a `useLedger`
   hook returning `{ state, input, rendered, onFocus, onInput, onKeyDown,
   onSign, signedName }`. The fake-name population happens once on mount.
   Letter-by-letter ink rendering can be pure JSX: map `input.value.split('')`
   to `<span className="letter">`. The `.wet` flood on sign is a class toggle.
   The gate-opening overlay + redirect stay imperative (dynamic DOM + window
   navigation don't benefit from JSX).
8. `src/components/Ritual/Quill.tsx` — the `<img>` cursor + `useQuillProximity`
   hook. **Important:** this hook must NOT register its own mousemove
   listener — it should read from a shared `usePointer()` context or ref
   that's updated by a single upstream mousemove listener. See "Shared
   mouse pipeline" below.

### Phase 3 — atmosphere + overlays

9. `src/components/Stage/Cathedral.tsx` — renders the raw-string
   `cathedralSvg` via `dangerouslySetInnerHTML`. Extract the SVG string to
   `src/components/Stage/cathedralSvg.ts`.
10. `src/components/Stage/Fog.tsx` — static fog-blob divs.
11. `src/components/Stage/Stage.tsx` — the `#stage` wrapper. Owns the
    `useParallaxScene` hook (cached layout reads, `translate3d`, resize
    recompute).
12. `src/components/Overlays/EmbersCanvas.tsx` — imperative canvas setup
    via `useRef`. The canvas element is React-managed (not imperatively
    appended to `document.body`). Mount it inside an overlay container with
    `position: fixed; bottom: 0`.
13. `src/components/Overlays/CursorDrips.tsx` — still imperative, uses the
    shared pointer pipeline. Pre-allocates a small pool of drip elements
    in a React-managed container instead of `appendChild`/`remove` on body.
14. `src/components/Overlays/Flash.tsx` — the full-screen flash used by
    Enter-the-Nave. Could be a styled div with a class toggle driven by
    parent state instead of imperative DOM.

### Shared mouse pipeline (critical)

Currently `useLegacyEffects` has **one** rAF-coalesced mousemove handler
that drives both quill proximity and drip spawning. Don't let each new
component register its own. Pattern:

- `src/hooks/usePointerPipeline.ts` — registers **one** passive `mousemove`
  on `document`, stores latest `x/y` in a ref updated each rAF, and fans
  out to subscribed callbacks. Mounted once by `AppShell` (or by
  `SettingsProvider`).
- `useQuillProximity(ledgerRef, quillRef)` — subscribes, reads cached rect.
- `useCursorDrips(containerRef)` — subscribes, does the throttle + spawn.

This preserves the optimization properly: one listener, one rAF tick per
frame, multiple consumers.

## Specific gotchas

- **React 19 void-element requirement:** JSX requires self-closing on
  voids (`<img />`, `<input />`, `<link />`, `<br />`). Mechanical class→
  className, for→htmlFor. The raw HTML already has `<img src=... alt="">`
  (non-self-closing); fix those when you move them into JSX.
- **Inline `onclick="enterNave()"`** exists on `.gate-close` (the skip
  button). In `useLegacyEffects` we strip it at runtime with
  `removeAttribute('onclick')`. Once this moves into JSX, just delete the
  inline handler — React won't understand it anyway.
- **IDs are load-bearing.** `applySettings` queries `#stage main`, `#gate`.
  The mega-hook queries `#whisper`, `#gateStatic`, `#souls`, `#ledgerStage`,
  `#ledgerInput`, `#ledgerRendered`, `#ledgerInkBlot`, `#ledgerSignBtn`,
  `#ledgerSignNumber`, `#quill`, `#enterBtn`, `#flash`, `#ledgerEntriesLeft`,
  `#ledgerEntriesRight`. Keep these ids on the JSX elements — they're also
  referenced by CSS rules in some cases. You can replace the internal
  `document.getElementById` calls with refs once the component owns the
  element, but **don't remove the id from the DOM** until you've grepped
  both `src/index.css` and `src/lib/settings.ts` to confirm no external
  reference remains.
- **Tailwind v4 is css-first.** New utility classes are fine (`flex`,
  `items-center`, etc.) but the bespoke gothic styling must come from the
  existing classes. A new component's chrome can use Tailwind utilities;
  its visual atmosphere should not.
- **Legacy source is at `index.legacy.html`** — read it for exact markup
  and behavior. Lines 1565–2337 are the body, 2340–2939 are the original
  JS. `useLegacyEffects.ts` has the ported behavior already; use it for
  TypeScript-sound snippets of each subsystem.
- **Don't add a router or global state library.** This is still a single
  page with a single "entered" boolean.

## Definition of done

1. `src/bodyHtml.ts` is **deleted**.
2. `src/hooks/useLegacyEffects.ts` is **deleted**. Every behavior it owned
   lives in a hook colocated with the component that renders the affected
   DOM.
3. `App.tsx` renders a real React tree: `<SettingsProvider><AppShell>…</AppShell></SettingsProvider>`
   where `AppShell` composes `<Gate>`, `<Stage>`, `<Overlays>`,
   `<SettingsDrawer>` (and the stage content trees: `<Topbar>`, `<Hero>`,
   `<Creed>`, `<Portals>`, `<Ledger>`, `<Litany>`, `<Footer>`).
4. No component uses `dangerouslySetInnerHTML` except `<Cathedral>` for the
   400-line SVG.
5. Only **one** `mousemove` listener is registered on `document`.
6. `npx tsc --noEmit` clean, `npx vite build` clean.
7. Walkthrough in the browser confirms parity: gate → Enter → flash → scroll
   → parallax → creed reveal → portals reveal with candles → ledger opens on
   scroll → type a name (letters ink in) → sign → overlay → redirect.
   Drawer toggle (✦) appears after entering and all controls are live.
   Reload preserves session skip; clearing sessionStorage re-shows the gate.
8. `git diff --stat` shows file moves/creations only — no surprise deletions.

## How to start

1. Read `src/App.tsx`, `src/bodyHtml.ts` (skim — it's 773 lines), and
   `src/hooks/useLegacyEffects.ts` (read fully) to load context.
2. Start the dev server in the background (`npx vite --port 5173 --host 127.0.0.1`).
3. Call the advisor tool **before** writing code to sanity-check your
   extraction order and the shared-pointer-pipeline design.
4. Do Phase 1 components first, one at a time, verifying in the browser
   after each. Commit (if the user wants you to) per phase, not per file.
5. Only delete `bodyHtml.ts` and `useLegacyEffects.ts` in the final commit,
   after every behavior has been relocated.

## Rules of engagement

- Only commit if the user explicitly asks.
- Do not run destructive git commands (reset --hard, push --force, checkout .).
- If you hit a genuine architectural fork, stop and ask the user rather than
  guessing — this is a large refactor and small early decisions compound.
- Report progress tersely: one sentence per phase completion is enough.

────────────────────────────────────────────────────────────────────────────
