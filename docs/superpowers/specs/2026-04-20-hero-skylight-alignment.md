# Hero / Skylight Vertical Frame — Design Spec

**Date:** 2026-04-20
**Status:** Approved

---

## Problem

The `.hero` section ("Church / of / Decay" title + subtitle) is vertically off-centre relative to the rose window skylight. The title is a single `h1` element with a large `padding-top: 100px` that pushes all text well past the top of the rose, making the text and skylight feel unrelated.

---

## Design Decision

**Vertical Frame layout.** The title is split so "Church" appears in the upper region of the rose window and "Decay" in the lower region, with the rose glow acting as the visual centre of the name. The subtitle stays below as a full inscription ("full inscription" variant — no subtitle moved or hidden).

The rose is `position: absolute; top: 8vh` inside `.cathedral` which is `position: fixed` — it never scrolls. This means the alignment is designed for **scroll position 0**. As the user scrolls, the rose stays fixed and content scrolls normally; the vertical frame effect is a first-impression composition.

---

## Architecture

### Layer breakdown (unchanged)

| Layer | Element | Behaviour |
|-------|---------|-----------|
| Background | `.cathedral` → `.scene` → `<svg class="arches">` | `position: fixed`, contains vault ceiling SVG |
| Skylight | `.cathedral` → `.scene` → `<svg class="rose">` | `position: absolute; top: 8vh` inside fixed cathedral |
| Content | `#stage` → `main` → `.hero` | normal scroll flow, `z-index: 10` |

The rose remains in the cathedral fixed layer. No DOM move. Alignment is achieved by restructuring the hero's CSS layout and splitting the title element.

---

## Changes

### 1. Hero HTML restructure

**Current:**
```html
<section class="hero">
  <div class="eyebrow">Worshippers of the Dead God</div>
  <h1 class="hero-title">
    Church
    <span class="of">— of —</span>
    Decay
  </h1>
  <div class="divider">...</div>
  <p class="hero-subtitle">...</p>
</section>
```

**New:**
```html
<section class="hero">
  <div class="eyebrow">Worshippers of the Dead God</div>
  <div class="hero-church">Church</div>
  <div class="hero-rose-gap"></div>
  <div class="hero-of">— of —</div>
  <div class="hero-decay">Decay</div>
  <div class="divider">...</div>
  <p class="hero-subtitle">...</p>
</section>
```

- `h1.hero-title` is replaced by three siblings: `.hero-church`, `.hero-rose-gap`, `.hero-decay`
- `.hero-of` is promoted out of the old `.of` span into a top-level sibling
- `.divider` and `.hero-subtitle` stay, below "Decay"

### 2. Hero CSS

**Remove** the old `.hero-title` and `.hero-title .of` rules.

**Add/update:**

```css
.hero {
  padding: 0 0 80px;           /* was: 100px 0 80px */
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

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
  /* Transparent spacer — the rose window shows through here */
  height: calc(min(40vmin, 500px) * 0.55);
  width: 100%;
  flex-shrink: 0;
  pointer-events: none;
}
```

### 3. Rose top position adjustment

Change `.rose` from `top: 8vh` to `top: 14vh`. This nudges the rose down so the eyebrow + "Church" text has breathing room above the rose's upper edge before overlapping.

```css
.rose {
  top: 14vh;          /* was: 8vh */
  /* all other properties unchanged */
}
```

### 4. Vault ceiling SVG gradient nudge

The `vaultCeil` radial gradient is centred at `cy="252"` (≈ 9.3% of the 2700-unit-tall scene). Moving the rose from `8vh` to `14vh` shifts its visual centre by ~6vh. In SVG scene units: `6/300 * 2700 ≈ 54 units`. Update the gradient centre from `cy="252"` to `cy="306"` to keep the ceiling warmth tracking the rose.

Also update the `bossHalo` ellipse and the oculus collar circles from `cy="252"` to `cy="306"`.

The `ribMask` circle (`cy="252"`) also needs updating to `cy="306"` so ribs still stop cleanly at the skylight.

---

## Visual result at scroll=0

```
┌────────────────────────────────────────┐
│  topbar (fixed height)                 │
│  ─────────────────────────────────     │
│  Worshippers of the Dead God (eyebrow) │
│                                        │
│           C h u r c h                  │
│        ╔══════════════╗                │
│        ║  [rose glow] ║                │
│        ║  skull skull ║                │
│        ║  [stain.gls] ║                │
│        ╚══════════════╝                │
│            — of —                      │
│           D e c a y                    │
│          ──────✦──────                 │
│  Beneath the Bonelands…                │
└────────────────────────────────────────┘
```

"Church" overlaps the top edge of the rose; "Decay" sits just below the bottom edge. The rose window is fully visible — text wraps around the glow rather than obscuring the stained glass. The `mix-blend-mode: screen` on the rose ensures the glow bleeds visually through the gothic letters.

---

## Constraints & trade-offs

- **Scroll-only alignment**: the vertical frame is a first-impression effect. After scrolling past the hero, the rose stays fixed to the viewport and the frame dissolves — that is expected and intentional.
- **Viewport variance**: the gap height uses `vmin` units matching the rose size, so the frame scales correctly across screen sizes.
- **No subtitle change**: the subtitle stays below "Decay" as approved (full inscription variant).
- **No JS changes**: pure HTML/CSS restructure.

---

## Files changed

| File | Change |
|------|--------|
| `index.html` | Hero HTML restructure; hero CSS update; rose `top` change; SVG `cy` values updated |
