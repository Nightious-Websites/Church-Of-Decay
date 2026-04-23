# Ceiling Rib Vault Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a gothic rib vault ceiling to the first scroll section of index.html — 16 ribs radiating from the rose window oculus outward to the walls, masked so they stop cleanly at the skylight edge.

**Architecture:** Purely additive SVG inside the existing `<g id="roof-vault">` group in `index.html`. A `<mask>` punches a hole at the oculus so no rib lines cross the rose window. Two oculus collar circles frame the skylight. Zero changes to CSS, JS, or any other element.

**Tech Stack:** Plain SVG inside existing HTML. No build step. Open in browser to verify.

---

## File Map

| File | Change |
|------|--------|
| `index.html` | Add `ribMask` to `<defs>` at line ~1664; add rib groups + collar circles between line 1667 and line 1669 |

---

### Task 1: Add the rib mask to `<defs>`

**File:** `index.html` — modify lines 1646–1664 (the `<defs>` block inside `<g id="roof-vault">`)

- [ ] **Step 1: Add `ribMask` inside the existing `<defs>` block**

  Open `index.html`. Find line 1664 (`        </defs>`). Insert the following **before** that closing tag:

  ```html
          <!-- Mask: ribs are hidden inside the oculus so they stop cleanly at the skylight ring -->
          <mask id="ribMask">
            <rect x="0" y="0" width="1600" height="900" fill="white"/>
            <circle cx="800" cy="252" r="230" fill="black"/>
          </mask>
  ```

  The result at that location should be:

  ```html
          <!-- Mask: ribs are hidden inside the oculus so they stop cleanly at the skylight ring -->
          <mask id="ribMask">
            <rect x="0" y="0" width="1600" height="900" fill="white"/>
            <circle cx="800" cy="252" r="230" fill="black"/>
          </mask>
        </defs>
  ```

- [ ] **Step 2: Verify the mask is parseable — open the page in a browser**

  Open `index.html` in a browser (e.g. `! open index.html` or use a local server). The page should load without errors. The ceiling section should look identical to before — the mask does nothing yet.

- [ ] **Step 3: Commit**

  ```bash
  git add index.html
  git commit -m "feat: add ribMask def to roof-vault — oculus cutout for rib vault"
  ```

---

### Task 2: Add the 8 primary ribs

**File:** `index.html` — insert after line 1667 (the stone surface `<rect>`)

- [ ] **Step 1: Insert the primary rib group after the stone surface rect**

  Find line 1667:
  ```html
          <rect x="0" y="0" width="1600" height="900" fill="url(#vaultCeil)"/>
  ```

  Insert the following **immediately after** it:

  ```html

          <!-- ── Rib vault: 8 primary ribs, masked to stop at oculus ── -->
          <g mask="url(#ribMask)" stroke="#7a2424" stroke-width="2.5" fill="none" opacity="0.92">
            <!-- Straight up -->
            <path d="M 800 252 Q 800 110 800 0"/>
            <!-- Upper-right -->
            <path d="M 800 252 Q 1090 110 1400 0"/>
            <!-- Right -->
            <path d="M 800 252 Q 1320 252 1600 240"/>
            <!-- Lower-right -->
            <path d="M 800 252 Q 1090 600 1400 900"/>
            <!-- Straight down -->
            <path d="M 800 252 Q 800 620 800 900"/>
            <!-- Lower-left -->
            <path d="M 800 252 Q 510 600 200 900"/>
            <!-- Left -->
            <path d="M 800 252 Q 280 252 0 240"/>
            <!-- Upper-left -->
            <path d="M 800 252 Q 510 110 200 0"/>
          </g>
  ```

- [ ] **Step 2: Open the page in a browser and verify**

  Scroll to the top (ceiling section). You should see 8 dark-red curves radiating outward from around the rose window. They must **not** cross the skylight — the area under the rose window should be clear. If any ribs cross the window, the `ribMask` circle radius (230) may need to be adjusted upward.

- [ ] **Step 3: Commit**

  ```bash
  git add index.html
  git commit -m "feat: add 8 primary ribs to roof vault ceiling"
  ```

---

### Task 3: Add the 8 secondary ribs

**File:** `index.html` — insert after the primary rib group added in Task 2

- [ ] **Step 1: Insert the secondary rib group immediately after the primary rib `</g>`**

  Find the closing `</g>` of the primary rib group just added. Insert the following immediately after it:

  ```html

          <!-- ── Rib vault: 8 secondary (tierceron) ribs ── -->
          <g mask="url(#ribMask)" stroke="#4e1818" stroke-width="1.3" fill="none" opacity="0.82">
            <!-- Between up and upper-right -->
            <path d="M 800 252 Q 930 90 1100 0"/>
            <!-- Between upper-right and right -->
            <path d="M 800 252 Q 1240 140 1600 80"/>
            <!-- Between right and lower-right -->
            <path d="M 800 252 Q 1360 430 1600 560"/>
            <!-- Between lower-right and down -->
            <path d="M 800 252 Q 1060 760 1240 900"/>
            <!-- Between down and lower-left -->
            <path d="M 800 252 Q 540 760 360 900"/>
            <!-- Between lower-left and left -->
            <path d="M 800 252 Q 240 430 0 560"/>
            <!-- Between left and upper-left -->
            <path d="M 800 252 Q 160 140 0 80"/>
            <!-- Between upper-left and up -->
            <path d="M 800 252 Q 670 90 500 0"/>
          </g>
  ```

- [ ] **Step 2: Open the page in a browser and verify**

  The ceiling should now show 16 total ribs — 8 bolder, 8 thinner — all radiating cleanly from the oculus. None should cross the rose window. The pattern should feel like a gothic fan vault.

- [ ] **Step 3: Commit**

  ```bash
  git add index.html
  git commit -m "feat: add 8 secondary tierceron ribs to roof vault ceiling"
  ```

---

### Task 4: Add the oculus collar rings

**File:** `index.html` — insert after the secondary rib `</g>`, before the `bossHalo` ellipse

- [ ] **Step 1: Insert the two collar circles**

  Find the `bossHalo` ellipse (currently around line 1670, will have shifted down by now):
  ```html
  <!-- Warm glow halo around the skylight opening -->
          <ellipse cx="800" cy="252" rx="260" ry="190" fill="url(#bossHalo)"/>
  ```

  Insert the following **immediately before** that comment+ellipse:

  ```html
          <!-- ── Oculus collar — stone ring framing the skylight ── -->
          <circle cx="800" cy="252" r="230" fill="none" stroke="#6a2020" stroke-width="3.5" opacity="0.9"/>
          <circle cx="800" cy="252" r="190" fill="none" stroke="#4a1616" stroke-width="1.2" opacity="0.5"/>

  ```

- [ ] **Step 2: Open the page in a browser and verify the full ceiling**

  Check all of the following:
  - Two concentric rings cleanly frame the rose window
  - 16 ribs terminate at the outer ring edge — no rib lines inside the ring
  - The `bossHalo` red glow still renders on top, warming the centre
  - The bottom of the ceiling fades smoothly into the arch section below
  - No floating lines, no stray geometry

  If the `ribMask` circle (r=230) doesn't perfectly align with the outer collar (r=230) — i.e. tiny rib stubs are visible inside the collar — increase the mask radius by 5–10 units until the ribs are fully hidden inside the collar boundary.

- [ ] **Step 3: Commit**

  ```bash
  git add index.html
  git commit -m "feat: add oculus collar rings to roof vault ceiling"
  ```

---

### Task 5: Final visual QA

- [ ] **Step 1: Open page at scroll position 0 (ceiling view)**

  Verify the complete ceiling:
  - Skull rose window is clearly visible, unobstructed
  - 16 ribs radiate from the collar outward to all walls/corners
  - Collar rings are clean — no tick marks, no stray short lines
  - Red glow halo from `bossHalo` warms the centre of the ribs
  - Corner vignette darkening still visible (from `vaultCeil` gradient)
  - Bottom of ceiling fades into arch section smoothly

- [ ] **Step 2: Scroll down to arch section — check visual continuity**

  The lower-directed ribs (down, lower-left, lower-right) should feel like they point toward the arch tops. The ceiling and arch section should read as one interior space.

- [ ] **Step 3: Final commit if any minor tweaks were made**

  ```bash
  git add index.html
  git commit -m "fix: adjust ceiling rib vault opacity/positioning after QA"
  ```

  (Skip this commit if no tweaks were needed.)
