# Hero Title Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make "— of —" appear visually centered between "Church" and "Decay" in the hero section, with tight overall spacing.

**Architecture:** Three independent margin values — `margin-bottom` on `.hero-church` controls the gap above "— of —", `margin-top` on `.hero-decay` controls the gap below it. These are independent so adjusting one never shifts the other. Letter-spacing on `.hero-of` controls dash proximity.

**Tech Stack:** Plain CSS inside `index.html` (single-file site). No build step.

---

### Task 1: Apply hero title spacing

**Files:**
- Modify: `index.html` (CSS block for `.hero-church`, `.hero-decay`, `.hero-of` — search for `.hero-church {`)

- [ ] **Step 1: Locate the existing CSS**

Search for `.hero-church {` in `index.html`. The relevant lines look like:

```css
.hero-church { margin-bottom: <some value>; }
.hero-decay  { margin-top: <some value>; }
.hero-of {
  ...
  letter-spacing: <some value>;
  padding-left: <some value>;
  ...
}
```

- [ ] **Step 2: Apply the approved values**

Replace those lines with:

```css
.hero-church { margin-bottom: 0.1em; }
.hero-decay  { margin-top: -0.16em; }
```

And inside `.hero-of`:

```css
  letter-spacing: 0.25em;
  padding-left: 0.25em;
```

- [ ] **Step 3: Verify in browser**

Open the page in Firefox (or Firefox-based browser like Zen). Bypass the entrance gate. Confirm:
- "— of —" appears visually equidistant between "Church" and "Decay"
- The dashes sit close to the word "of"
- The title is compact vertically — no excessive gap

Note: Chromium renders UnifrakturCook with different font metrics. **Always verify in Firefox** — the tuning was done against Firefox rendering.

- [ ] **Step 4: Verify responsive scaling**

Resize the browser window from ~400px wide to 1400px wide. Confirm:
- "— of —" stays centered at all sizes
- Gaps grow proportionally with the headline (they will, because all values are `em`-based relative to the `clamp()` font-size)

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "fix: center hero '— of —' between Church and Decay

Independent margins on .hero-church / .hero-decay decouple the two
gaps so tuning one doesn't shift the other. Negative margin-top on
Decay compensates for UnifrakturCook ink bleed above CSS box at
line-height: 0.92. All values are em-based so they scale with the
clamp() headline font-size."
```
