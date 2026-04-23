# Ceiling Rib Vault — Design Spec

**Date:** 2026-04-20
**Feature:** Gothic rib vault ceiling for the first scroll section

---

## Context

The Church of Decay site has three scroll sections. The first section (SVG `y=0–900` in `.arches` viewBox `0 0 1600 2700`) is currently a near-empty dark gradient with a glow halo around the rose window. It reads as "a skylight in a red void" rather than a church ceiling.

The rose window (`.rose`) is a separate `position: absolute` SVG element, centered, `top: 8vh`, `width/height: min(40vmin, 500px)`. It uses `mix-blend-mode: screen` and `opacity: 0.55`. Its visual centre corresponds to approximately `cx=800, cy=252` in the `.arches` SVG coordinate space — which matches the existing `bossHalo` ellipse and `vaultCeil` radial gradient centre.

The arch section starts at `<g transform="translate(0, 900)">` with 5 pointed gothic arches. The ceiling design must coordinate visually with those arches — same stone palette, same pointed aesthetic.

---

## Design

All changes are **additions inside the existing `<g id="roof-vault">`**. Nothing else in the file changes.

### 1. SVG Mask — Ribs Stop at the Oculus

A `<mask id="ribMask">` hides all rib content inside the skylight ring so ribs terminate cleanly at the oculus edge with no overlap over the rose window:

```svg
<mask id="ribMask">
  <rect width="1600" height="900" fill="white"/>
  <circle cx="800" cy="252" r="230" fill="black"/>
</mask>
```

The black circle matches the oculus collar radius (r=230), punching a clean hole.

### 2. Primary Ribs — 8 bold curves

8 ribs radiating from the boss (`cx=800, cy=252`) to all edges of the ceiling zone. All wrapped in `<g mask="url(#ribMask)">`:

- **Stroke:** `#7a2424`, width `2.5`, opacity `0.92`
- **Curve style:** quadratic bezier (`Q`), control point pulled gently outward from center
- **Directions:** straight up, upper-right, right, lower-right, straight down, lower-left, left, upper-left

Approximate paths (in SVG `0 0 1600 900` ceiling coordinate space):

```svg
<path d="M 800 252 Q 800 110 800 0"/>
<path d="M 800 252 Q 1090 110 1400 0"/>
<path d="M 800 252 Q 1320 252 1600 240"/>
<path d="M 800 252 Q 1090 600 1400 900"/>
<path d="M 800 252 Q 800 620 800 900"/>
<path d="M 800 252 Q 510 600 200 900"/>
<path d="M 800 252 Q 280 252 0 240"/>
<path d="M 800 252 Q 510 110 200 0"/>
```

### 3. Secondary Ribs — 8 thinner curves

8 ribs between each pair of primary ribs, same mask applied:

- **Stroke:** `#4e1818`, width `1.3`, opacity `0.82`
- Placed midway between each adjacent primary rib pair

```svg
<path d="M 800 252 Q 930 90 1100 0"/>
<path d="M 800 252 Q 1240 140 1600 80"/>
<path d="M 800 252 Q 1360 430 1600 560"/>
<path d="M 800 252 Q 1060 760 1240 900"/>
<path d="M 800 252 Q 680 760 560 900"/>
<path d="M 800 252 Q 240 430 0 560"/>
<path d="M 800 252 Q 160 140 0 80"/>
<path d="M 800 252 Q 670 90 500 0"/>
```

### 4. Oculus Collar — 2 clean rings

Two concentric circles centered on the boss. No tick marks, no voussoir lines.

```svg
<!-- Outer ring -->
<circle cx="800" cy="252" r="230" fill="none" stroke="#6a2020" stroke-width="3.5" opacity="0.9"/>
<!-- Inner ring -->
<circle cx="800" cy="252" r="190" fill="none" stroke="#4a1616" stroke-width="1.2" opacity="0.5"/>
```

### 5. Existing Elements — Unchanged

These stay exactly as-is:
- `<rect fill="url(#vaultCeil)"/>` — radial gradient dark stone surface
- `<ellipse cx="800" cy="252" fill="url(#bossHalo)"/>` — warm glow halo
- `<rect y="760" fill="url(#vaultFade)"/>` — bottom fade into arch section

The ribs and collar are added **after** the stone surface rect but **before** the glow halo and bottom fade, so the halo renders on top of the rib intersection and warms it.

---

## Element Order Inside `#roof-vault`

The `ribMask` definition is added **inside the existing `<defs>` block** already present in `#roof-vault`.

```
1. <defs> (existing gradients + new ribMask added inside)
2. <rect fill="url(#vaultCeil)"/>       ← existing stone surface
3. <g mask="url(#ribMask)">             ← NEW: primary ribs
4. <g mask="url(#ribMask)">             ← NEW: secondary ribs
5. <circle r="230" oculus outer ring>   ← NEW: collar
6. <circle r="190" oculus inner ring>   ← NEW: collar
7. <ellipse fill="url(#bossHalo)"/>     ← existing glow (renders over ribs)
8. <rect fill="url(#vaultFade)"/>       ← existing bottom fade
```

---

## Coordination with Arch Section

The ribs use the same dark stone palette as the arches (`#stoneG` gradient: `#2a1210` → `#050101`). The lower-directed ribs (down, lower-left, lower-right) point toward the arch tops, making the ceiling feel structurally connected to the nave below.

---

## Out of Scope

- Rose window SVG (`.rose`): no changes
- Arch group (`<g transform="translate(0, 900)">`): no changes
- CSS, parallax scroll logic, other sections: no changes
