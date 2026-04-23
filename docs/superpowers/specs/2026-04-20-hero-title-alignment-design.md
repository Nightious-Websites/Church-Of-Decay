# Hero Title Alignment — Design Spec

## Problem

The hero title is split across three stacked flex children:
- `.hero-church` — "Church" (UnifrakturCook, `clamp(64px, 10vw, 140px)`, `line-height: 0.92`)
- `.hero-of` — "— of —" (Cinzel, `clamp(14px, 1.8vw, 22px)`)
- `.hero-decay` — "Decay" (same as Church)

`line-height: 0.92` creates negative half-leading — the CSS box is 8% smaller than the font size, so ink visually overflows the layout box. Adjusting margin on `.hero-of` always shifts Decay as well (next sibling), making them appear grouped away from Church.

## Solution

Give each blackletter word independent control of its own gap to "— of —":

- `.hero-church { margin-bottom: 0.1em; }` — Church owns the gap below itself
- `.hero-decay { margin-top: -0.16em; }` — Decay owns the gap above itself (negative pulls it up tight)
- `.hero-of { margin: 0; }` — "of" sits neutrally between them

The em units reference the blackletter `clamp(64px, 10vw, 140px)`, so gaps scale proportionally at all viewport widths.

## Letter-spacing

`letter-spacing: 0.25em` (down from 0.6em) with matching `padding-left: 0.25em` on `.hero-of` to keep "— of —" visually centered. The padding-left compensates for the trailing letter-spacing offset on the last character.

## Final CSS

```css
.hero-church { margin-bottom: 0.1em; }
.hero-decay  { margin-top: -0.16em; }
.hero-of {
  letter-spacing: 0.25em;
  padding-left: 0.25em;
  margin: 0;
}
```

## Decisions

- Margins on the blackletter words rather than on `.hero-of` — avoids the grouped-sibling problem
- Negative `margin-top` on Decay rather than zero — Firefox ink bleeds above the CSS box due to `line-height: 0.92`, so a negative value compensates
- em units throughout — scales with font `clamp()` at every viewport width
- Tuned visually in Firefox/Zen (not Chromium) — font metrics differ significantly between engines for UnifrakturCook
