# Hero / Skylight Vertical Frame Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the hero section so "Church" appears above the rose window skylight and "Decay" appears below it, creating a vertical frame with the skull stained-glass as centrepiece.

**Architecture:** Pure HTML/CSS edits to `index.html`. The rose stays in its fixed cathedral layer; alignment is achieved by splitting the old single `h1.hero-title` into flex siblings with a transparent gap spacer, and nudging the rose `top` from `8vh` to `14vh`. The vault ceiling SVG's gradient and mask cy values are updated to track the new rose position.

**Tech Stack:** Plain HTML/CSS inside a single `index.html`. No build step. Verify by opening the file in a browser.

---

## File Map

| File | Change |
|------|--------|
| `index.html` lines 468–480 | `.rose` CSS — change `top: 8vh` → `top: 14vh` |
| `index.html` lines 593–598 | `.hero` CSS — drop top padding, add flex column |
| `index.html` lines 610–632 | Remove `.hero-title` / `.hero-title .of` rules; add `.hero-church`, `.hero-decay`, `.hero-of`, `.hero-rose-gap` |
| `index.html` lines 1648–1732 | SVG vault ceiling — update five `cy="252"` → `cy="306"` (gradient + mask + collar + halo) |
| `index.html` lines 2138–2157 | Hero HTML — replace `<h1 class="hero-title">` with flex siblings |
| `index.html` line 2405 | JS `querySelectorAll` — replace `.hero-title` with `.hero-church, .hero-decay` |

---

### Task 1 — Shift the vault ceiling SVG to track the new rose position

The rose moves from `top: 8vh` to `top: 14vh` (+6vh). In the SVG's `viewBox="0 0 1600 2700"` over a `height: 300vh` scene, 6vh = `6/300 * 2700 = 54` SVG units. Every ceiling element centred on the oculus uses `cy="252"`; they all move to `cy="306"`.

**Do NOT change** the `cy="252"` values at lines ~1808–1812 and ~1835 — those are candle-chain decoration circles on the hanging banners, not the oculus.

**File:** `index.html`

- [ ] **Step 1: Update `vaultCeil` radial gradient centre (line 1648)**

  Find:
  ```html
          <radialGradient id="vaultCeil" cx="800" cy="252" r="700" gradientUnits="userSpaceOnUse">
  ```
  Replace with:
  ```html
          <radialGradient id="vaultCeil" cx="800" cy="306" r="700" gradientUnits="userSpaceOnUse">
  ```

- [ ] **Step 2: Update `ribMask` punch-out circle (line 1676)**

  Find:
  ```html
              <circle cx="800" cy="252" r="230" fill="black"/>
  ```
  Replace with:
  ```html
              <circle cx="800" cy="306" r="230" fill="black"/>
  ```

- [ ] **Step 3: Update outer oculus collar circle (line 1728)**

  Find:
  ```html
          <circle cx="800" cy="252" r="230" fill="none" stroke="#6a2020" stroke-width="3.5" opacity="0.9"/>
  ```
  Replace with:
  ```html
          <circle cx="800" cy="306" r="230" fill="none" stroke="#6a2020" stroke-width="3.5" opacity="0.9"/>
  ```

- [ ] **Step 4: Update inner oculus collar circle (line 1729)**

  Find:
  ```html
          <circle cx="800" cy="252" r="190" fill="none" stroke="#4a1616" stroke-width="1.2" opacity="0.5"/>
  ```
  Replace with:
  ```html
          <circle cx="800" cy="306" r="190" fill="none" stroke="#4a1616" stroke-width="1.2" opacity="0.5"/>
  ```

- [ ] **Step 5: Update `bossHalo` warm glow ellipse (line 1732)**

  Find:
  ```html
          <ellipse cx="800" cy="252" rx="260" ry="190" fill="url(#bossHalo)"/>
  ```
  Replace with:
  ```html
          <ellipse cx="800" cy="306" rx="260" ry="190" fill="url(#bossHalo)"/>
  ```

- [ ] **Step 6: Open `index.html` in a browser and verify**

  The vault ceiling should look identical to before. The rib lines should still radiate outward from the oculus and stop cleanly at the stone collar ring. No ribs should cross the skylight opening. The rose window's position will not yet have changed (we haven't touched `.rose` CSS yet) — the ceiling glow will appear slightly lower than the rose. That is expected and will resolve in Task 2.

- [ ] **Step 7: Commit**

  ```bash
  git add index.html
  git commit -m "feat: shift vault ceiling SVG cy from 252→306 to track rose reposition"
  ```

---

### Task 2 — Move the rose window down

**File:** `index.html` line 471 (inside `.rose { … }`)

- [ ] **Step 1: Change `top: 8vh` to `top: 14vh`**

  Find (inside the `.rose` rule block, around line 468–482):
  ```css
    top: 8vh;
  ```
  Replace with:
  ```css
    top: 14vh;
  ```

- [ ] **Step 2: Open in browser and verify**

  The rose window should sit lower on the page now, roughly where the vault ceiling glow is centred. The ceiling rib lines should terminate cleanly at the oculus ring around the rose. If the rose now appears inside the arch band rather than the ceiling area, the `top` value may need slight tuning — try `12vh` or `13vh`.

- [ ] **Step 3: Commit**

  ```bash
  git add index.html
  git commit -m "feat: move rose skylight from top:8vh to top:14vh for vertical frame layout"
  ```

---

### Task 3 — Update `.hero` and title CSS

This task replaces the old `.hero-title` block with the new flex-column hero layout and new element rules. Make all four edits before opening the browser.

**File:** `index.html`

- [ ] **Step 1: Change `.hero` padding and add flex column (line 595)**

  Find (lines 594–598):
  ```css
  .hero {
    padding: 100px 0 80px;
    text-align: center;
    position: relative;
  }
  ```
  Replace with:
  ```css
  .hero {
    padding: 0 0 80px;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  ```

- [ ] **Step 2: Replace `.hero-title` and `.hero-title .of` rules (lines 610–632)**

  Find (lines 610–632 — the entire hero-title block including the `.of` sub-rule):
  ```css
  .hero-title {
    font-family: 'UnifrakturCook', serif;
    font-size: clamp(64px, 10vw, 140px);
    line-height: 0.92;
    color: var(--parchment);
    text-shadow:
      0 0 40px rgba(196,24,24,0.5),
      0 0 80px rgba(122,10,10,0.4),
      0 3px 0 rgba(0,0,0,0.8);
    margin-bottom: 8px;
    letter-spacing: 0.01em;
  }
  .hero-title .of {
    display: block;
    font-size: 0.35em;
    font-family: 'Cinzel', serif;
    font-weight: 400;
    letter-spacing: 0.6em;
    color: rgba(232,220,184,0.6);
    margin: 18px 0;
    text-shadow: none;
    padding-left: 0.6em;
  }
  ```
  Replace with:
  ```css
  .hero-church,
  .hero-decay {
    font-family: 'UnifrakturCook', serif;
    font-size: clamp(64px, 10vw, 140px);
    line-height: 0.92;
    color: var(--parchment);
    text-shadow:
      0 0 40px rgba(196,24,24,0.5),
      0 0 80px rgba(122,10,10,0.4),
      0 3px 0 rgba(0,0,0,0.8);
    letter-spacing: 0.01em;
  }
  .hero-of {
    font-family: 'Cinzel', serif;
    font-size: clamp(14px, 1.8vw, 22px);
    font-weight: 400;
    letter-spacing: 0.6em;
    color: rgba(232,220,184,0.6);
    margin: 14px 0 0;
    padding-left: 0.6em;
  }
  .hero-rose-gap {
    height: calc(min(40vmin, 500px) * 0.55);
    width: 100%;
    flex-shrink: 0;
    pointer-events: none;
  }
  ```

- [ ] **Step 3: Update the JS `querySelectorAll` that applies the display font (line 2405)**

  Find:
  ```js
    document.querySelectorAll('.hero-title, .portal-name, .ritual-side h2, .litany-head h2, .gate-title, .cmd-num')
  ```
  Replace with:
  ```js
    document.querySelectorAll('.hero-church, .hero-decay, .portal-name, .ritual-side h2, .litany-head h2, .gate-title, .cmd-num')
  ```

- [ ] **Step 4: Open in browser and verify CSS is applied**

  The hero section will look broken at this point — the HTML still references the old `h1.hero-title`. That is expected. Verify there are no console errors about missing styles and that the page loads without JS exceptions.

- [ ] **Step 5: Commit**

  ```bash
  git add index.html
  git commit -m "feat: replace hero-title CSS with hero-church/hero-decay/hero-of/hero-rose-gap"
  ```

---

### Task 4 — Restructure the hero HTML

**File:** `index.html` lines 2138–2157

- [ ] **Step 1: Replace the `h1.hero-title` with flex siblings**

  Find (lines 2138–2157, the entire hero section):
  ```html
      <section class="hero">
        <div class="eyebrow">Worshippers of the Dead God</div>
        <h1 class="hero-title">
          Church
          <span class="of">— of —</span>
          Decay
        </h1>

        <div class="divider">
          <span></span>
          <svg class="divider-glyph" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"/>
          </svg>
          <span></span>
        </div>

        <p class="hero-subtitle">
          Beneath the Bonelands, where the antlered god lies sleeping and the stones weep rust — the faithful keep the long vigil. All decay is holy. All rot is prayer.
        </p>
      </section>
  ```
  Replace with:
  ```html
      <section class="hero">
        <div class="eyebrow">Worshippers of the Dead God</div>
        <div class="hero-church">Church</div>
        <div class="hero-rose-gap"></div>
        <div class="hero-of">— of —</div>
        <div class="hero-decay">Decay</div>

        <div class="divider">
          <span></span>
          <svg class="divider-glyph" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"/>
          </svg>
          <span></span>
        </div>

        <p class="hero-subtitle">
          Beneath the Bonelands, where the antlered god lies sleeping and the stones weep rust — the faithful keep the long vigil. All decay is holy. All rot is prayer.
        </p>
      </section>
  ```

- [ ] **Step 2: Open in browser and verify the vertical frame**

  At scroll position 0, check all of the following:

  - "Worshippers of the Dead God" eyebrow appears near the top of the content area
  - "Church" in large gothic letters sits above or at the top edge of the rose window
  - The rose window skull / stained glass is fully visible, unobstructed — centred horizontally between "Church" and "— of —"
  - "— of —" in small Cinzel appears just below the rose
  - "Decay" in large gothic letters sits below "— of —"
  - The blood divider line and subtitle appear below "Decay"
  - The rose glow (`mix-blend-mode: screen`) bleeds through the gothic letterforms, creating a backlit cathedral effect

  **If "Church" overlaps too far into the rose** (covering too much of the stained glass), increase `.hero-rose-gap` height multiplier from `0.55` to `0.65` and re-check.

  **If there is too much empty space between "Church" and the rose** (rose appears to float lower than expected), decrease the multiplier from `0.55` to `0.45`.

  **If the rose appears below "Decay"** (too low), change `.rose { top: 14vh }` back toward `12vh` in small steps.

- [ ] **Step 3: Commit**

  ```bash
  git add index.html
  git commit -m "feat: restructure hero to vertical frame — Church / rose / Decay layout"
  ```

---

### Task 5 — Final visual QA

- [ ] **Step 1: Verify on a wide viewport (≥ 1200px)**

  Open `index.html`. Resize browser to full width. Confirm:
  - Title text size is at the `clamp` max (~140px) — gothic letters are large and dramatic
  - Rose window is fully visible between "Church" and "Decay"
  - Subtitle text is readable below "Decay"
  - No layout overflow or horizontal scroll

- [ ] **Step 2: Verify on a narrow viewport (≤ 700px)**

  Resize browser to 480px wide. Confirm:
  - Title text clamps down to ~64px — still legible
  - `.hero-rose-gap` scales with `vmin` so the rose still fits between text
  - No text overlapping the stained-glass portion of the rose

- [ ] **Step 3: Scroll down — verify the rose stays fixed**

  Scroll past the hero. The rose window should remain fixed to the viewport (it is in `.cathedral` which is `position: fixed`). The "Church / Decay" frame effect dissolves naturally as the hero scrolls away. This is expected behaviour.

- [ ] **Step 4: Final commit if any tuning was made**

  ```bash
  git add index.html
  git commit -m "fix: tune hero-rose-gap multiplier / rose top after visual QA"
  ```

  Skip this commit if no tuning was needed.
