# Roof Vault Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a delicate gothic ribbed vault ceiling to the roof scroll section of `index.html`.

**Architecture:** A single `<g id="roof-vault">` SVG group is inserted into the existing `.arches` SVG (viewBox `0 0 1600 2700`), covering y=0–900 (the roof parallax band). It contains 5 sub-layers: stone masonry texture, primary fan ribs, secondary tracery ribs, keystone boss, corner shading, and a bottom fade. Nothing else in the file changes.

**Tech Stack:** Inline SVG (no JS, no CSS changes, no new files)

---

## File Map

| Action | Path | What changes |
|--------|------|--------------|
| Modify | `index.html` | Insert `<g id="roof-vault">` after the `</defs>` block inside `.arches` SVG, before the `<g transform="translate(0, 900)">` line |

---

### Task 1: Locate the insertion point

**Files:**
- Modify: `index.html` — find exact line numbers before touching anything

- [ ] **Step 1: Find the arches SVG opening tag**

Run:
```bash
grep -n 'class="arches"' index.html
```
Expected output — something like:
```
1627:    <svg class="arches" viewBox="0 0 1600 2700" ...>
```
Note the line number (call it LINE_ARCHES).

- [ ] **Step 2: Find the arch group translate line**

Run:
```bash
grep -n 'translate(0, 900)' index.html
```
Expected output — something like:
```
1644:      <g transform="translate(0, 900)"><!-- parallax scene band -->
```
Note the line number (call it LINE_ARCH_GROUP). The new group will be inserted **immediately before** this line.

- [ ] **Step 3: Confirm the defs closing tag sits just before translate**

Run:
```bash
sed -n '$((LINE_ARCH_GROUP - 5)),$((LINE_ARCH_GROUP))p' index.html
```
You should see the end of the `<defs>` block followed by a blank line, then the `<g transform="translate(0, 900)">` line. If there are other groups between defs and the translate group, adjust LINE_ARCH_GROUP accordingly — the new group must go before `<g transform="translate(0, 900)">`.

---

### Task 2: Insert the roof vault SVG group

**Files:**
- Modify: `index.html` at the line just before `<g transform="translate(0, 900)">`

This is a single edit. Insert the entire block below immediately before the `<g transform="translate(0, 900)">` line.

- [ ] **Step 1: Insert the roof vault group**

Find this exact string in `index.html`:
```
      <g transform="translate(0, 900)"><!-- parallax scene band -->
```

Replace it with:
```xml
      <!-- ═══ Roof vault — delicate gothic tracery (y=0–900) ═══ -->
      <g id="roof-vault">

        <!-- 1. Stone masonry texture — horizontal courses with offset joints -->
        <g id="roof-stone" stroke="#2a1010" stroke-width="0.6" fill="none" opacity="0.18">
          <!-- Horizontal course lines -->
          <line x1="0" y1="90"  x2="1600" y2="90"/>
          <line x1="0" y1="180" x2="1600" y2="180"/>
          <line x1="0" y1="270" x2="1600" y2="270"/>
          <line x1="0" y1="360" x2="1600" y2="360"/>
          <line x1="0" y1="450" x2="1600" y2="450"/>
          <line x1="0" y1="540" x2="1600" y2="540"/>
          <line x1="0" y1="630" x2="1600" y2="630"/>
          <line x1="0" y1="720" x2="1600" y2="720"/>
          <line x1="0" y1="810" x2="1600" y2="810"/>
          <!-- Vertical joints — row 1 (y=0–90), offset A -->
          <line x1="80"  y1="0"   x2="80"  y2="90"/>
          <line x1="240" y1="0"   x2="240" y2="90"/>
          <line x1="400" y1="0"   x2="400" y2="90"/>
          <line x1="560" y1="0"   x2="560" y2="90"/>
          <line x1="720" y1="0"   x2="720" y2="90"/>
          <line x1="880" y1="0"   x2="880" y2="90"/>
          <line x1="1040" y1="0"  x2="1040" y2="90"/>
          <line x1="1200" y1="0"  x2="1200" y2="90"/>
          <line x1="1360" y1="0"  x2="1360" y2="90"/>
          <line x1="1520" y1="0"  x2="1520" y2="90"/>
          <!-- Vertical joints — row 2 (y=90–180), offset B -->
          <line x1="160" y1="90"  x2="160" y2="180"/>
          <line x1="320" y1="90"  x2="320" y2="180"/>
          <line x1="480" y1="90"  x2="480" y2="180"/>
          <line x1="640" y1="90"  x2="640" y2="180"/>
          <line x1="800" y1="90"  x2="800" y2="180"/>
          <line x1="960" y1="90"  x2="960" y2="180"/>
          <line x1="1120" y1="90" x2="1120" y2="180"/>
          <line x1="1280" y1="90" x2="1280" y2="180"/>
          <line x1="1440" y1="90" x2="1440" y2="180"/>
          <!-- Vertical joints — row 3 (y=180–270), offset A -->
          <line x1="80"  y1="180" x2="80"  y2="270"/>
          <line x1="240" y1="180" x2="240" y2="270"/>
          <line x1="400" y1="180" x2="400" y2="270"/>
          <line x1="560" y1="180" x2="560" y2="270"/>
          <line x1="720" y1="180" x2="720" y2="270"/>
          <line x1="880" y1="180" x2="880" y2="270"/>
          <line x1="1040" y1="180" x2="1040" y2="270"/>
          <line x1="1200" y1="180" x2="1200" y2="270"/>
          <line x1="1360" y1="180" x2="1360" y2="270"/>
          <line x1="1520" y1="180" x2="1520" y2="270"/>
          <!-- Vertical joints — row 4 (y=270–360), offset B -->
          <line x1="160" y1="270" x2="160" y2="360"/>
          <line x1="320" y1="270" x2="320" y2="360"/>
          <line x1="480" y1="270" x2="480" y2="360"/>
          <line x1="640" y1="270" x2="640" y2="360"/>
          <line x1="800" y1="270" x2="800" y2="360"/>
          <line x1="960" y1="270" x2="960" y2="360"/>
          <line x1="1120" y1="270" x2="1120" y2="360"/>
          <line x1="1280" y1="270" x2="1280" y2="360"/>
          <line x1="1440" y1="270" x2="1440" y2="360"/>
          <!-- Vertical joints — rows 5–9, alternating A/B -->
          <line x1="80"  y1="360" x2="80"  y2="450"/> <line x1="240" y1="360" x2="240" y2="450"/> <line x1="400" y1="360" x2="400" y2="450"/> <line x1="560" y1="360" x2="560" y2="450"/> <line x1="720" y1="360" x2="720" y2="450"/> <line x1="880" y1="360" x2="880" y2="450"/> <line x1="1040" y1="360" x2="1040" y2="450"/> <line x1="1200" y1="360" x2="1200" y2="450"/> <line x1="1360" y1="360" x2="1360" y2="450"/> <line x1="1520" y1="360" x2="1520" y2="450"/>
          <line x1="160" y1="450" x2="160" y2="540"/> <line x1="320" y1="450" x2="320" y2="540"/> <line x1="480" y1="450" x2="480" y2="540"/> <line x1="640" y1="450" x2="640" y2="540"/> <line x1="800" y1="450" x2="800" y2="540"/> <line x1="960" y1="450" x2="960" y2="540"/> <line x1="1120" y1="450" x2="1120" y2="540"/> <line x1="1280" y1="450" x2="1280" y2="540"/> <line x1="1440" y1="450" x2="1440" y2="540"/>
          <line x1="80"  y1="540" x2="80"  y2="630"/> <line x1="240" y1="540" x2="240" y2="630"/> <line x1="400" y1="540" x2="400" y2="630"/> <line x1="560" y1="540" x2="560" y2="630"/> <line x1="720" y1="540" x2="720" y2="630"/> <line x1="880" y1="540" x2="880" y2="630"/> <line x1="1040" y1="540" x2="1040" y2="630"/> <line x1="1200" y1="540" x2="1200" y2="630"/> <line x1="1360" y1="540" x2="1360" y2="630"/> <line x1="1520" y1="540" x2="1520" y2="630"/>
          <line x1="160" y1="630" x2="160" y2="720"/> <line x1="320" y1="630" x2="320" y2="720"/> <line x1="480" y1="630" x2="480" y2="720"/> <line x1="640" y1="630" x2="640" y2="720"/> <line x1="800" y1="630" x2="800" y2="720"/> <line x1="960" y1="630" x2="960" y2="720"/> <line x1="1120" y1="630" x2="1120" y2="720"/> <line x1="1280" y1="630" x2="1280" y2="720"/> <line x1="1440" y1="630" x2="1440" y2="720"/>
          <line x1="80"  y1="720" x2="80"  y2="810"/> <line x1="240" y1="720" x2="240" y2="810"/> <line x1="400" y1="720" x2="400" y2="810"/> <line x1="560" y1="720" x2="560" y2="810"/> <line x1="720" y1="720" x2="720" y2="810"/> <line x1="880" y1="720" x2="880" y2="810"/> <line x1="1040" y1="720" x2="1040" y2="810"/> <line x1="1200" y1="720" x2="1200" y2="810"/> <line x1="1360" y1="720" x2="1360" y2="810"/> <line x1="1520" y1="720" x2="1520" y2="810"/>
          <line x1="160" y1="810" x2="160" y2="900"/> <line x1="320" y1="810" x2="320" y2="900"/> <line x1="480" y1="810" x2="480" y2="900"/> <line x1="640" y1="810" x2="640" y2="900"/> <line x1="800" y1="810" x2="800" y2="900"/> <line x1="960" y1="810" x2="960" y2="900"/> <line x1="1120" y1="810" x2="1120" y2="900"/> <line x1="1280" y1="810" x2="1280" y2="900"/> <line x1="1440" y1="810" x2="1440" y2="900"/>
        </g>

        <!-- 2. Primary fan ribs — 9 ribs from boss at (800, 120) -->
        <g id="roof-ribs-primary" stroke="#4a1a1a" stroke-width="2.5" fill="none" opacity="0.85">
          <!-- Center rib straight down -->
          <path d="M 800 120 L 800 900"/>
          <!-- Left ribs -->
          <path d="M 800 120 Q 500 200 0 260"/>
          <path d="M 800 120 Q 350 350 0 500"/>
          <path d="M 800 120 Q 280 520 0 700"/>
          <path d="M 800 120 Q 250 650 0 900"/>
          <!-- Right ribs (mirrored) -->
          <path d="M 800 120 Q 1100 200 1600 260"/>
          <path d="M 800 120 Q 1250 350 1600 500"/>
          <path d="M 800 120 Q 1320 520 1600 700"/>
          <path d="M 800 120 Q 1350 650 1600 900"/>
        </g>

        <!-- 3. Secondary tracery ribs — 4 thinner ribs for depth -->
        <g id="roof-ribs-secondary" stroke="#2a1010" stroke-width="1.2" fill="none" opacity="0.6">
          <path d="M 800 120 Q 190 590 0 810"/>
          <path d="M 800 120 Q 1410 590 1600 810"/>
          <path d="M 800 120 Q 530 680 200 900"/>
          <path d="M 800 120 Q 1070 680 1400 900"/>
        </g>

        <!-- 4. Keystone boss at rib convergence point -->
        <defs>
          <radialGradient id="bossGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stop-color="#c41818" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#c41818" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <!-- Glow halo — sits behind boss circle -->
        <ellipse cx="800" cy="120" rx="140" ry="100" fill="url(#bossGlow)"/>
        <!-- Boss ring -->
        <circle cx="800" cy="120" r="16" fill="#1a0808" stroke="#7a2020" stroke-width="2"/>
        <circle cx="800" cy="120" r="10" fill="none" stroke="#c41818" stroke-width="1" opacity="0.8"/>

        <!-- 5a. Corner/edge depth shading -->
        <defs>
          <radialGradient id="roofCornerShade" cx="50%" cy="0%" r="100%">
            <stop offset="0%"   stop-color="#000" stop-opacity="0"/>
            <stop offset="100%" stop-color="#000" stop-opacity="0.35"/>
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="1600" height="900" fill="url(#roofCornerShade)"/>

        <!-- 5b. Bottom transition fade into arch band -->
        <defs>
          <linearGradient id="roofBottomFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#140505" stop-opacity="0"/>
            <stop offset="100%" stop-color="#140505" stop-opacity="0.7"/>
          </linearGradient>
        </defs>
        <rect x="0" y="750" width="1600" height="150" fill="url(#roofBottomFade)"/>

      </g><!-- end #roof-vault -->

      <g transform="translate(0, 900)"><!-- parallax scene band -->
```

- [ ] **Step 2: Open the page in a browser and scroll to the top**

```bash
# If you have a local server running:
# Just open index.html directly in browser — it's a static file, no server needed
```

Verify at scroll position 0 (top of page, after closing the gate):
- You see faint stone block mortar lines across the background
- Thin curved ribs fan outward from the center-top of the screen toward the edges
- A small dark circle with a red ring is visible near the top center (behind/below the rose window)
- The corners feel slightly darker than the center
- Scrolling slightly down, the ceiling fades into the arch band — no hard line

- [ ] **Step 3: Verify no visual regressions on other sections**

Scroll to middle (arch section): arches, banners, lanterns should be unchanged.  
Scroll to bottom (underground section): "Merken" text should be unchanged.  
Confirm the rose window still glows at the top — it's a separate element and should be unaffected.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add delicate gothic ribbed vault to roof section"
```

---

## Self-Review Notes

**Spec coverage:**
- ✅ Stone masonry blocks (offset horizontal courses) — Task 2, layer 1
- ✅ 9 primary fan ribs from boss at (800, 120) — Task 2, layer 2
- ✅ 4 secondary tracery ribs — Task 2, layer 3
- ✅ Keystone boss with glow ellipse — Task 2, layer 4
- ✅ Corner/edge depth shading — Task 2, layer 5a
- ✅ Bottom transition fade y=750–900 — Task 2, layer 5b
- ✅ Rose window / arches / JS untouched — single-group insertion only

**Placeholder scan:** None found — all code is fully written out.

**Type consistency:** Pure SVG, no functions or types to cross-check.
