# Ledger Rework Design
Date: 2026-04-19

## Overview

Full rewrite of the "Sign the Ledger of the Faithful" section in `index.html`. The current implementation is static and gives no indication that the user can write in the book. The rework introduces a state machine, a spine-unfold opening animation, a blinking cursor affordance, and a proximity-triggered bone quill cursor.

---

## State Machine

The ledger transitions through five states. All visual and interactive behavior is driven by which state is active.

```
closed → opening → idle → typing → signed
```

| State | Trigger | Description |
|---|---|---|
| `closed` | Page load (default) | Book is folded shut — pages rotated inward. Normal browser cursor shown. |
| `opening` | IntersectionObserver fires (≥50% viewport) | Spine unfold animation plays (~1.4s). Fires once; observer disconnects after. |
| `idle` | Opening animation ends | Book fully open. Blinking cursor on signing line. Bone quill activates on proximity. |
| `typing` | User focuses input / begins typing | Cursor blink hidden. Ink letters render. Sign button appears at ≥2 chars. |
| `signed` | Button click or Enter key | Book dims. Fullscreen overlay displays. Redirects to game after 3.4s. |

State is tracked in a single `ledgerState` variable. A `transitionTo(state)` function applies the corresponding CSS class to `ledgerStage` and handles side effects (observer disconnect, autofocus, quill activation).

---

## Visual Design

### Closed Book
Both pages begin folded inward:
- Left page: `rotateY(80deg)` around its right edge (hinge at spine)
- Right page: `rotateY(-80deg)` around its left edge (hinge at spine)
- From the viewer's perspective: a closed spine with visible parchment edges

The book retains the existing `perspective(1400px) rotateX(4deg)` on `.ledger-book`.

### Spine Unfold Animation
On transition to `opening`:
- Left page rotates from `80deg → 0deg`
- Right page rotates from `-80deg → 0deg`
- Duration: 1.4s, `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Left page leads by ~0.08s stagger (as if a hand opens left-to-right)
- After animation resolves: `transitionTo('idle')`

### Blinking Cursor
A `<span class="ledger-cursor">` is inserted at the start of the signing line slot.
- Color: `#c41818` (blood-red)
- Size: 1.5px × 16px
- Animation: `step-end` blink at 1.1s interval
- Visible only in `idle` state
- Hidden on entry to `typing` state

### Bone Quill (Redesign)
The existing feathered quill SVG is replaced with a bone quill:
- Elongated bone shaft tapering to a carved nib tip
- Rounded epiphysis knobs at the top
- A subtle marrow crack line running lengthwise
- Dark blood-stained nib tip (matching `--blood-deep`)
- Same bounding box (~90×180px rendered), same `rotate(-18deg)` at rest
- Same `transform-origin: 28% 98%` for nib-point anchoring

### Proximity Cursor Swap
A global `mousemove` listener on `document` computes the distance from the cursor to the nearest edge of `ledgerStage.getBoundingClientRect()`.

- **Within 120px:** `body` receives class `near-ledger` → `cursor: none`. Bone quill element repositions to cursor coordinates via `transform: translate()`.
- **Outside 120px:** `near-ledger` class removed. Quill translates to `(-9999px, -9999px)`. Native cursor restored.

The quill element remains outside `.ledger-stage` (direct child of `<body>`) so its positioning is always viewport-relative. The proximity swap is active in all states except `signed` — the quill continues to appear when the user mouses back over the book while typing.

### Sign Button
Moved from `position: absolute` inside `.ledger-stage` to a standard flow element **below** the book, outside `.ledger-stage`. Appears (opacity + transform) when `typing` state has ≥2 characters. This prevents it from floating over the book pages.

---

## Code Changes

### CSS — Remove
- `cursor: none` hardcoded on `.ledger-stage` (replaced by `body.near-ledger { cursor: none }`)
- `.ledger-sign-btn` absolute positioning inside stage

### CSS — Add
- `.ledger-page--left.folded { transform: rotateY(80deg); transform-origin: right center; }`
- `.ledger-page--right.folded { transform: rotateY(-80deg); transform-origin: left center; }`
- `.ledger-cursor` blinking cursor styles
- `body.near-ledger { cursor: none; }`
- Updated `.ledger-sign-btn` as a flow element below the book

### JS — Remove
- `quillVisible` flag
- `moveQuill()`, `showQuill()`, `hideQuill()` functions
- `mousemove` / `mouseleave` listeners on `ledgerStage`
- Autofocus-on-intersection logic (replaced by state machine)

### JS — Add
- `ledgerState` variable (initial: `'closed'`)
- `transitionTo(state)` function
- Global `mousemove` proximity listener
- `animationend` listener on the **right page** (finishes last due to stagger) to trigger `idle` transition
- Quill element repositioned as child of `<body>`

### JS — Keep (unchanged)
- `buildLedgerEntries()`, `appendNames()`, `toRoman()`
- Ink letter rendering: `inkAppear`, `inkWet` animations, `.letter` span logic
- `signLedger()` core: overlay text ("The ledger accepts thee. — [name] —"), redirect to `GAME_URL`
- `bookClose` animation on `.is-signed`
- `.gate-opening` fullscreen overlay

---

## Out of Scope
- The overlay text ("The ledger accepts thee.") — kept as-is
- `GAME_URL` redirect timing (3.4s) — kept as-is
- Fake names in ledger entries — kept as-is
- Any section of `index.html` outside the ledger section and its JS/CSS
