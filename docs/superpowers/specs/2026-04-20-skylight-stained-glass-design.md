---
title: Skylight — Stained Glass Mural Redesign
date: 2026-04-20
status: implemented
---

## Summary

Redesign the `.rose` skylight SVG from a plain radial-gradient circle into an irregular stained glass mural, with the horned skull icon as a solid black central medallion held together by lead came borders.

## Visual Design

- **Glass shards**: ~30 hand-crafted irregular polygons filling the circle, each with a distinct warm tone (deep maroon at the outer ring, escalating through crimson and red-orange toward the center)
- **Lead came borders**: dark stroke (`#030000`, 4.5px) on all polygon edges; two concentric dark rings (r=68, r=132) define the skull medallion boundary and mid-ring
- **Skull medallion**: solid black with internal detail lines visible as subtle carved structure
- **Color palette**: deep maroon (#500808) → crimson (#8c0c0c) → red-orange (#c83010) → vivid orange-red (#e04018) radiating inward

## Implementation (in `.rose` SVG, `index.html`)

### Assets
- `skull-horns.png` — original outline mask (white silhouette, black detail holes)
- `skull-filled.png` — morphologically closed version (`magick skull-horns.png -morphology Close Disk:12`), solid white silhouette with no internal holes

### SVG Layer Order (bottom → top)
1. **Base circle** — `fill="#060000"` dark background
2. **Glass shard polygons** — `<g clip-path="url(#roseClip)" stroke="#030000" stroke-width="4.5">` containing ~30 `<polygon>` elements
3. **Lead came rings** — two `<circle fill="none" stroke="#020000">` at r=68 and r=132
4. **Skull backing** — `<circle fill="#000000" mask="url(#roseFilledMask)">` — covers glass shards exactly within skull silhouette
5. **Skull detail layer** — `<circle fill="#2a0404" mask="url(#roseMask)">` — dark crimson body; transparent at detail holes reveals pure black from layer 4, creating visible internal structure
6. **Outer border ring** — `<circle fill="none" stroke="#180202" stroke-width="5">`

### Two-mask technique
The skull uses two SVG masks in sequence:
- `roseFilledMask` (skull-filled.png): hides glass shards within skull boundary → solid black backing
- `roseMask` (skull-horns.png): applies dark crimson (#2a0404) to skull body; detail lines are transparent → reveal black backing, showing carved structure

### CSS (unchanged)
`.rose` retains its existing `opacity: 0.55`, `mix-blend-mode: screen`, `filter: blur(1px)`, and `rosePulse` animation.

## Decisions

- **Lead came style**: A3 Dense Cathedral — 12 symmetric spokes was replaced with irregular polygon shards (more authentic stained glass, less iron-rebar appearance)
- **Skull treatment**: Dark Void (solid black) with detail structure visible — not white glow, not outline
- **Internal details**: preserved via two-mask approach; `skull-filled.png` eliminates color leaking through eye sockets/face lines while `skull-horns.png` restores structural visibility as dark crimson vs pure black contrast
