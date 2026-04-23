# Roof Vault Enhancement — Design Spec

**Date:** 2026-04-19  
**Feature:** Gothic ribbed vault ceiling for the roof scroll section

---

## Context

The Church of Decay site is a single-page parallax experience. A fixed `.cathedral` div contains a `.scene` element (`300vh` tall) that pans upward as the user scrolls — top = roof, middle = arches, bottom = underground.

The roof section corresponds to **SVG y=0–900** within the `.arches` SVG (`viewBox="0 0 1600 2700"`). This area is currently empty — it shows only the body's dark gradient and the fixed rose window (`position: absolute; top: 8vh` inside `.cathedral`). The arch group that draws the pointed arches starts at `<g transform="translate(0, 900)">`.

---

## Design

**Style:** Delicate Gothic tracery — thin fine ribs, subtle low-opacity stone blocks, soft red glow at keystone. Not heavy or oppressive.

### 1. Stone Masonry Texture

- Horizontal course lines every ~90px from y=0 to y=900, stroke `#2a1010`, width `0.6`, opacity `0.18`
- Vertical joint lines offset per row (alternating at ~80px, ~160px intervals) to simulate real masonry bonding
- Contained within a `<g id="roof-stone">` group so it's easy to adjust

### 2. Fan Ribs

- **Boss position:** x=800, y=120 — aligns visually behind the rose window center
- **9 primary ribs**, stroke `#4a1a1a`, width `2.5`, opacity `0.85`, curving from boss to:
  - Left wall (x=0) at various y depths: y=260, y=500, y=750, y=900
  - Right wall (x=1600) mirrored
  - Straight down center to y=900
- **4 secondary ribs** (thinner: width `1.2`, opacity `0.6`) between the primary ribs for tracery depth
- All ribs use quadratic bezier curves (`Q`) with control points pulling slightly outward from center

### 3. Keystone Boss

- Dark filled circle: cx=800, cy=120, r=16, fill `#1a0808`, stroke `#7a2020` width `2`
- Inner ring: r=10, stroke `#c41818` width `1`, opacity `0.8`
- Soft radial glow ellipse: rx=140, ry=100, fill radialGradient from `#c41818` at 25% opacity to transparent — blends with the existing rose window's ember halo above it

### 4. Corner/Edge Shading

- Single `<rect width="1600" height="900">` filled with a CSS radial gradient centered at (800, 0), going from transparent at center to `rgba(0,0,0,0.35)` at edges — gives depth impression of ceiling receding
- Applied last in the group so it sits on top of stone texture but under nothing

### 5. Bottom Transition Fade

- `<linearGradient>` from transparent at y=750 to `rgba(20,5,5,0.7)` at y=900
- Applied as a `<rect x="0" y="750" width="1600" height="150">` 
- Softens the hard cut between roof zone and the arch group below

---

## Implementation

**One change only:** add a `<g id="roof-vault">` group before the existing `<g transform="translate(0, 900)">` inside the `.arches` SVG. All 5 elements above live inside that group. Nothing else changes.

**File:** `index.html`  
**Location:** Inside `<svg class="arches" ...>`, after the closing `</defs>` tag, before the `<g transform="translate(0, 900)">` line (currently line 1644).

---

## Out of Scope

- Rose window SVG: no changes
- Arch group: no changes
- Parallax scroll logic: no changes
- CSS: no changes
- Any other section (arches, underground): no changes
