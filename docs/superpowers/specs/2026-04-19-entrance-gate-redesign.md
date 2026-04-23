# Entrance Gate Redesign — Church of Decay
**Date:** 2026-04-19
**Status:** Approved

## Summary

Replace the current SVG placeholder sigil on the `#gate` entrance screen with the official Merken group logo (`merken.png`), and elevate the entire gate experience into a dramatic ritual sequence with a gothic arch backdrop, staggered element reveals, floating ember particles, and a scan-line intro.

---

## Design Decisions

### Logo Treatment
- Use the original `merken.png` (no image editing required)
- Apply `mix-blend-mode: screen` — dark pixels in the image become transparent, the skull/chains/ornaments float freely against the dark page
- Logo animates in by descending from above with a settling bounce (`translateY(-50px) → overshoot → rest`)
- After landing, a slow looping glow pulse via `drop-shadow` filter animation

### Gothic Arch Backdrop
- Inline SVG arch drawn in the gate background layer, centered and sized responsively (`min(520px, 92vw)`)
- Three concentric arch curves (outer, inner, decorative ring) in graduated blood-red opacity
- Horizontal band strokes on the pillars, column capitals at the base, trefoil ornament at the apex keystone
- Arch fades in first (0.3s delay, 1.8s fade) before logo descends — establishes the space

### Reveal Sequence (staggered animation delays)
| Step | Element | Delay |
|------|---------|-------|
| 0 | Scan line sweeps top → bottom | 0.2s |
| 1 | Arch fades in | 0.3s |
| 2 | Logo descends from above | 0.6s |
| 3 | Whisper text fades up | 2.0s |
| 4 | "Church of Decay" title | 2.5s |
| 5 | Latin subtitle `· Ecclesia Putredinis ·` | 3.1s |
| 6 | Prompt "the faithful gather below" | 3.6s |
| 7 | "Enter the Nave" button | 4.2s |
| 8 | Warning footer text | 5.0s |

### Whisper Text
- Cycles through 6 phrases every 4 seconds with a 0.6s fade-out/in cross-transition
- Phrases: "the veil is thin tonight", "all flesh returns to the earth", "come, faithful, come", "the dead walk among us", "give yourself to the rot", "kneel before the skull of the dead god"

### Ember Particles
- 22 absolutely-positioned `div.ember` elements injected by JS on load
- Random left position (15–85%), random bottom offset, random size (1–3.5px), random `--dx` drift variable
- Staggered `animation-delay` so they don't all fire at once
- `animation-duration` 3–6s, loop infinitely

### Supporting Atmosphere
- Film grain overlay retained from current gate (`body::after` approach)
- Radial vignette retained
- Background: `radial-gradient(ellipse 90% 80% at 50% 40%, #160202, #0a0101, #000)` — slightly warmer centre than current pure black
- Skip button retained top-right corner

### Button
- Existing clip-path octagon style retained
- Appears last in the sequence (4.2s delay)
- Gains looping `btnPulse` glow animation after initial reveal (starts at 5.5s)
- Hover: brightens, letter-spacing expands, red glow intensifies

---

## What Changes in `index.html`

### CSS Changes
1. Remove `.gate-sigil` and its `sigilPulse` keyframe — replaced by `.logo-wrap` / `.logo-img`
2. Add `.arch-wrap` styles (positioned absolute, responsive sizing)
3. Add `.logo-wrap` / `.logo-img` styles (descent animation, glow pulse, screen blend)
4. Add `.gate-latin` style (italic, spaced, low opacity)
5. Update `.gate-whisper` → `.whisper` — adjust fade-up entry animation
6. Update `.gate-title` — add `fadeUp` animation with 2.5s delay
7. Add `.scan` keyframe + element style
8. Add `.ember` keyframe

### HTML Changes (inside `#gate > .gate-inner`)
1. Replace `<div class="gate-sigil">…SVG…</div>` with:
   ```html
   <div class="logo-wrap">
     <img class="logo-img" src="merken.png" alt="Merken — Church of Decay">
   </div>
   ```
2. Add arch SVG as a sibling `<div class="arch-wrap">…SVG…</div>` outside `.gate-inner`
3. Add `<div class="gate-latin">· Ecclesia Putredinis ·</div>` between title and prompt
4. Add `<div class="scan"></div>` as first child of `#gate`

### JS Changes
1. Remove old whisper cycling code tied to `#whisper` (replace with updated version matching new timing)
2. Add ember injection loop (22 particles)
3. Existing `enterNave()` / `sessionStorage` skip logic unchanged

---

## Assets
- `merken.png` — group logo, already in project root (copy from `/home/xlaptop/Downloads/merken.png`)
- No new dependencies; all fonts already loaded

---

## Out of Scope
- Sound/audio
- Mobile-specific layout changes beyond the existing responsive sizing
- Any changes to the main stage (`#stage`) or post-gate content
