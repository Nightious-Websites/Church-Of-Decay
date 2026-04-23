# Ledger Rework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the "Sign the Ledger of the Faithful" section so the book opens with a spine-unfold animation on scroll, a blood-red blinking cursor signals "write here", and a bone quill replaces the mouse cursor on proximity.

**Architecture:** Single file (`index.html`) contains all CSS, HTML, and JS. Changes are isolated to the ledger CSS block (~lines 729–1089), the ledger HTML section (~lines 1909–1989), and the ledger JS block (~lines 2170–2376). A five-state machine (`closed → opening → idle → typing → signed`) drives all visual and interactive behavior via CSS classes on `#ledgerStage`.

**Tech Stack:** Vanilla HTML/CSS/JS, no build tools. Serve with `python3 -m http.server 8080` from the project root and open `http://localhost:8080` to test.

---

## File Map

| File | What changes |
|---|---|
| `index.html` lines 730–738 | `.ledger-stage` CSS — remove hardcoded `cursor: none` |
| `index.html` lines 753–770 | `.ledger-book` CSS — add `transform-style: preserve-3d` |
| `index.html` lines 795–820 | `.ledger-page` CSS — add `backface-visibility`, `transform-origin` per side |
| `index.html` lines 976–1035 | `.quill` + `.ledger-sign-btn` CSS — quill becomes `position:fixed`, button becomes flow |
| `index.html` after line 1035 | New CSS blocks — closed state, unfold keyframes, cursor blink, proximity |
| `index.html` lines 1915–1989 | Ledger HTML — add `is-closed` class, add cursor span, move button and quill |
| `index.html` lines 2224–2271 | JS — remove old quill functions and listeners |
| `index.html` after line 2222 | JS — add state machine, IO, animationend, proximity, typing wiring |

---

## Task 1: HTML — Restructure ledger elements

**Files:**
- Modify: `index.html` (ledger HTML block, ~lines 1909–1989 and near `</body>`)

- [ ] **Step 1: Add `is-closed` to `#ledgerStage` and insert cursor span**

Find the opening div of the ledger stage and sign slot (around line 1915 and 1933). Change:

```html
<div class="ledger-stage" id="ledgerStage" aria-label="The Ledger">
```
to:
```html
<div class="ledger-stage is-closed" id="ledgerStage" aria-label="The Ledger">
```

Find the sign slot div (around line 1933):
```html
<div class="ledger-sign-slot">
  <input id="ledgerInput" class="ledger-input" type="text" maxlength="28"
         placeholder="inscribe thy name…" autocomplete="off" spellcheck="false"/>
  <span class="ledger-rendered" id="ledgerRendered"></span>
  <span class="ledger-ink-blot" id="ledgerInkBlot"></span>
</div>
```
Change to:
```html
<div class="ledger-sign-slot">
  <span class="ledger-cursor" id="ledgerCursor"></span>
  <input id="ledgerInput" class="ledger-input" type="text" maxlength="28"
         placeholder="inscribe thy name…" autocomplete="off" spellcheck="false"/>
  <span class="ledger-rendered" id="ledgerRendered"></span>
  <span class="ledger-ink-blot" id="ledgerInkBlot"></span>
</div>
```

- [ ] **Step 2: Move sign button outside `.ledger-stage`**

The `<button class="ledger-sign-btn" ...>` is currently the last child inside `#ledgerStage` (around line 1941). Cut it and paste it immediately after the closing `</div>` of `#ledgerStage`, still inside `<section class="ritual">`:

```html
      </div><!-- end ledger-stage -->

      <button class="ledger-sign-btn" id="ledgerSignBtn" type="button" aria-label="Sign the ledger">
        <span>✦ Sign in Rust ✦</span>
      </button>

    </section>
```

- [ ] **Step 3: Move quill div to be a direct child of `<body>`**

The `<div class="quill" id="quill" ...>` is currently inside `#ledgerStage` (around line 1948). Cut the entire quill div (through its closing `</div>`) and paste it just before `</body>` (after the `<div id="flash"></div>` element, around line 2035):

```html
<div id="flash"></div>

<div class="quill" id="quill" aria-hidden="true">
  <!-- SVG stays unchanged for now — replaced in Task 6 -->
  ...existing SVG content...
</div>

</body>
```

- [ ] **Step 4: Verify structure in browser**

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`. The ledger section should look the same as before (quill still renders at top-left of page, sign button is below the book). No functionality yet — just confirming structure is sound.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "refactor: restructure ledger HTML — cursor span, button below stage, quill to body"
```

---

## Task 2: CSS — Closed book state and 3D transform setup

**Files:**
- Modify: `index.html` (CSS block, `.ledger-stage`, `.ledger-book`, `.ledger-page` rules)

- [ ] **Step 1: Remove hardcoded `cursor: none` from `.ledger-stage` and add the signed cursor rule**

Find (around line 730):
```css
.ledger-stage {
  position: relative;
  aspect-ratio: 1.1;
  width: 100%;
  max-width: 620px;
  margin: 0 auto;
  cursor: none; /* hide cursor over ledger; quill takes its place */
}
.ledger-stage.is-signed { cursor: default; }
```
Replace with:
```css
.ledger-stage {
  position: relative;
  aspect-ratio: 1.1;
  width: 100%;
  max-width: 620px;
  margin: 0 auto;
}
```

- [ ] **Step 2: Add `transform-style: preserve-3d` to `.ledger-book`**

Find (around line 753):
```css
.ledger-book {
  position: absolute;
  inset: 6% 4%;
  display: grid;
  grid-template-columns: 1fr 1fr;
```
Add `transform-style: preserve-3d;` after `display: grid;`:
```css
.ledger-book {
  position: absolute;
  inset: 6% 4%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  transform-style: preserve-3d;
```

- [ ] **Step 3: Add `backface-visibility` and `transform-origin` to page rules**

Find (around line 795):
```css
.ledger-page {
  position: relative;
  padding: 22px 22px 26px;
```
Add `backface-visibility: hidden;` to the rule:
```css
.ledger-page {
  position: relative;
  padding: 22px 22px 26px;
  backface-visibility: hidden;
```

Find (around line 807):
```css
.ledger-page--left { padding-right: 18px; }
.ledger-page--right { padding-left: 18px; display: flex; flex-direction: column; }
```
Replace with:
```css
.ledger-page--left  { padding-right: 18px; transform-origin: right center; }
.ledger-page--right { padding-left: 18px; display: flex; flex-direction: column; transform-origin: left center; }
```

- [ ] **Step 4: Add closed-state transforms as a new CSS block**

Insert the following block immediately after the `.ledger-page--right` rule:

```css
/* ── Ledger: closed-state page folds ── */
.ledger-stage.is-closed .ledger-page--left  { transform: rotateY(82deg); }
.ledger-stage.is-closed .ledger-page--right { transform: rotateY(-82deg); }
```

- [ ] **Step 5: Verify in browser**

Reload `http://localhost:8080`. Scroll to the ledger section. The book should appear nearly closed — both pages folded inward so only the spine area is visible. If pages look wrong, check that `transform-style: preserve-3d` is on `.ledger-book`.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: CSS closed book state — 3D page transforms, preserve-3d on book container"
```

---

## Task 3: CSS — Spine unfold animation

**Files:**
- Modify: `index.html` (CSS block, after closed-state rules)

- [ ] **Step 1: Add the unfold keyframes and animation rules**

Insert the following block immediately after the closed-state rules added in Task 2:

```css
/* ── Ledger: spine unfold animation ── */
@keyframes unfoldLeft {
  from { transform: rotateY(82deg); }
  to   { transform: rotateY(0deg); }
}
@keyframes unfoldRight {
  from { transform: rotateY(-82deg); }
  to   { transform: rotateY(0deg); }
}

.ledger-stage.is-opening .ledger-page--left {
  animation: unfoldLeft 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
.ledger-stage.is-opening .ledger-page--right {
  animation: unfoldRight 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.08s forwards;
}

/* After opening, pages stay at 0deg (animation fill keeps them there) */
.ledger-stage.is-idle .ledger-page--left,
.ledger-stage.is-idle .ledger-page--right,
.ledger-stage.is-typing .ledger-page--left,
.ledger-stage.is-typing .ledger-page--right,
.ledger-stage.is-signed .ledger-page--left,
.ledger-stage.is-signed .ledger-page--right {
  transform: rotateY(0deg);
}
```

- [ ] **Step 2: Test the animation manually**

To preview without scrolling logic, temporarily add `is-opening` to the stage div in HTML, reload, and verify the spine unfold plays. Remove `is-opening` after confirming (keep `is-closed`).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: CSS spine unfold animation — unfoldLeft/Right keyframes with 0.08s stagger"
```

---

## Task 4: CSS — Blinking cursor and state visibility

**Files:**
- Modify: `index.html` (CSS block, after unfold rules)

- [ ] **Step 1: Add `.ledger-cursor` styles and state visibility rules**

Insert the following block after the unfold animation rules:

```css
/* ── Ledger: blinking cursor on signing line ── */
.ledger-cursor {
  display: inline-block;
  width: 1.5px;
  height: 16px;
  background: #c41818;
  box-shadow: 0 0 6px rgba(196, 24, 24, 0.8);
  vertical-align: middle;
  margin-right: 2px;
  flex-shrink: 0;
  opacity: 0;
  animation: none;
}

.ledger-stage.is-idle .ledger-cursor {
  opacity: 1;
  animation: ledgerCursorBlink 1.1s step-end infinite;
}

@keyframes ledgerCursorBlink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

/* Cursor hidden once typing starts or after signing */
.ledger-stage.is-typing .ledger-cursor,
.ledger-stage.is-signed .ledger-cursor {
  opacity: 0;
  animation: none;
}
```

- [ ] **Step 2: Also add proximity and `near-ledger` cursor rule**

Insert immediately after:

```css
/* ── Proximity cursor swap ── */
body.near-ledger { cursor: none; }
```

- [ ] **Step 3: Verify cursor blink in browser**

Temporarily add `is-idle` to `#ledgerStage` in HTML, reload. The blinking blood-red cursor should appear at the start of the signing line. Remove `is-idle` after confirming (restore `is-closed`).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: CSS blinking cursor on signing line, near-ledger proximity class"
```

---

## Task 5: CSS — Sign button as flow element

**Files:**
- Modify: `index.html` (`.ledger-sign-btn` CSS block, ~lines 1006–1035)

- [ ] **Step 1: Replace the sign button's absolute positioning with flow positioning**

Find the existing `.ledger-sign-btn` block (around line 1006):
```css
.ledger-sign-btn {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translate(-50%, 20px);
  padding: 10px 28px;
  background: linear-gradient(180deg, rgba(120, 14, 8, 0.9), rgba(60, 6, 4, 0.95));
  border: 1px solid rgba(196, 24, 24, 0.7);
  color: #f0e0c0;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s ease, transform 0.35s ease, background 0.3s, box-shadow 0.3s;
  box-shadow: 0 6px 20px rgba(0,0,0,0.5), inset 0 0 20px rgba(196, 24, 24, 0.25);
  z-index: 11;
}
.ledger-sign-btn.visible {
  opacity: 1;
  pointer-events: auto;
  transform: translate(-50%, 0);
}
```
Replace with:
```css
.ledger-sign-btn {
  display: block;
  margin: 24px auto 0;
  transform: translateY(10px);
  padding: 10px 28px;
  background: linear-gradient(180deg, rgba(120, 14, 8, 0.9), rgba(60, 6, 4, 0.95));
  border: 1px solid rgba(196, 24, 24, 0.7);
  color: #f0e0c0;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s ease, transform 0.35s ease, background 0.3s, box-shadow 0.3s;
  box-shadow: 0 6px 20px rgba(0,0,0,0.5), inset 0 0 20px rgba(196, 24, 24, 0.25);
}
.ledger-sign-btn.visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
.ledger-sign-btn:hover {
  background: linear-gradient(180deg, rgba(180, 30, 16, 0.95), rgba(90, 12, 6, 1));
  box-shadow: 0 6px 30px rgba(196, 24, 24, 0.6), inset 0 0 30px rgba(255, 60, 20, 0.35);
}
```

- [ ] **Step 2: Verify in browser**

Temporarily add `visible` class to `#ledgerSignBtn` in HTML, reload. The button should appear below the book, centered, and float up slightly. Remove `visible` after confirming.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: CSS sign button as flow element below ledger stage"
```

---

## Task 6: Bone quill SVG and CSS

**Files:**
- Modify: `index.html` (`.quill` CSS and the quill `<div>` HTML)

- [ ] **Step 1: Update `.quill` CSS to `position: fixed` and appropriate z-index**

Find (around line 976):
```css
.quill {
  position: absolute;
  top: 0;
  left: 0;
  width: 90px;
  height: 180px;
  pointer-events: none;
  transform-origin: 28% 98%;
  transform: translate(-9999px, -9999px) rotate(-18deg);
  z-index: 10;
  filter: drop-shadow(3px 6px 6px rgba(0,0,0,0.6));
  transition: filter 0.4s ease;
}
```
Replace with:
```css
.quill {
  position: fixed;
  top: 0;
  left: 0;
  width: 90px;
  height: 180px;
  pointer-events: none;
  transform-origin: 28% 98%;
  transform: translate(-9999px, -9999px) rotate(-18deg);
  z-index: 200;
  filter: drop-shadow(3px 6px 6px rgba(0,0,0,0.6));
  transition: filter 0.4s ease;
}
```

- [ ] **Step 2: Replace the quill SVG content with the bone quill design**

Find the `<div class="quill" id="quill" ...>` element (now near `</body>`). Replace its entire SVG content:

```html
<div class="quill" id="quill" aria-hidden="true">
  <svg viewBox="0 0 120 240" width="110" height="220">
    <defs>
      <linearGradient id="boneShaftG" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stop-color="#a89060"/>
        <stop offset="30%"  stop-color="#d4c5a0"/>
        <stop offset="70%"  stop-color="#e0d4b0"/>
        <stop offset="100%" stop-color="#a89060"/>
      </linearGradient>
      <linearGradient id="boneNibG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#c8b88a"/>
        <stop offset="100%" stop-color="#1a0606"/>
      </linearGradient>
    </defs>
    <!-- Upper epiphysis knob -->
    <ellipse cx="62" cy="22" rx="18" ry="13" fill="#c8b88a" stroke="#7a6040" stroke-width="1.2"/>
    <ellipse cx="62" cy="22" rx="10" ry="7"  fill="none"   stroke="#9a8060" stroke-width="0.6" opacity="0.4"/>
    <!-- Main bone shaft -->
    <path d="M70 32 L68 192 L56 192 L54 32 Z" fill="url(#boneShaftG)" stroke="#8a7050" stroke-width="0.8"/>
    <!-- Marrow seam -->
    <line x1="62" y1="36" x2="62" y2="190" stroke="#9a8865" stroke-width="0.7" opacity="0.3" stroke-dasharray="5 9"/>
    <!-- Cross-grain texture -->
    <g stroke="#9a8060" stroke-width="0.5" opacity="0.35" fill="none">
      <path d="M56 70  Q62 68  68 70"/>
      <path d="M56 100 Q62 98  68 100"/>
      <path d="M56 130 Q62 128 68 130"/>
      <path d="M56 160 Q62 158 68 160"/>
    </g>
    <!-- Bone sheen highlight -->
    <path d="M58 36 L57 190" stroke="rgba(255,250,230,0.3)" stroke-width="3.5" stroke-linecap="round"/>
    <!-- Nib taper — bone carved to a writing point -->
    <path d="M68 192 Q65 210 48 226 Q55 216 56 202 L56 192 Z" fill="#c0a878" stroke="#7a6040" stroke-width="0.8"/>
    <path d="M56 192 Q53 207 40 222 Q47 215 56 203 Z"         fill="#9a8458" opacity="0.5"/>
    <!-- Blood-darkened nib tip -->
    <path d="M44 222 Q33 230 24 236 Q34 226 46 220 Z" fill="url(#boneNibG)" stroke="#0a0202" stroke-width="0.6"/>
    <!-- Ink drop at nib (24,234) — matches nibOffsetX=18, nibOffsetY=175 in JS -->
    <circle cx="24" cy="234" r="2.8" fill="#6a0a0a" class="quill-drop"/>
  </svg>
</div>
```

- [ ] **Step 3: Verify bone quill renders**

Temporarily add `style="transform: translate(200px,200px) rotate(-18deg)"` inline to the quill div, reload. The bone quill should be visible in the center of the page. Remove the inline style after confirming.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: bone quill SVG redesign, quill fixed-positioned as body child"
```

---

## Task 7: JS — Remove old quill code

**Files:**
- Modify: `index.html` (JS block, ~lines 2224–2271)

- [ ] **Step 1: Remove the old quill variables, functions, and ledger-stage listeners**

Find and delete the entire block from `// ── Quill follows cursor inside ledger stage` through the closing brace of the `if (ledgerStage)` block (approximately lines 2224–2271). The block to remove is:

```js
// ── Quill follows cursor inside ledger stage ─────────────────
let quillVisible = false;
function moveQuill(clientX, clientY) {
  const rect = ledgerStage.getBoundingClientRect();
  // position relative to stage
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  // nib of the quill SVG is at (24, 234) of a 120x240 viewBox, rendered 90x180
  // scale: x = 24/120 * 90 = 18, y = 234/240 * 180 = 175.5
  const nibOffsetX = 18;
  const nibOffsetY = 175;
  quillEl.style.transform = `translate(${x - nibOffsetX}px, ${y - nibOffsetY}px) rotate(-20deg)`;
}
function showQuill(clientX, clientY) {
  if (!quillVisible) {
    quillVisible = true;
    quillEl.style.opacity = '1';
  }
  moveQuill(clientX, clientY);
}
function hideQuill() {
  quillVisible = false;
  quillEl.style.transform = 'translate(-9999px, -9999px) rotate(-20deg)';
}

if (ledgerStage) {
  ledgerStage.addEventListener('mousemove', (e) => {
    if (ledgerStage.classList.contains('is-signed')) return;
    showQuill(e.clientX, e.clientY);
  });
  ledgerStage.addEventListener('mouseleave', hideQuill);
  // Clicking anywhere on the ledger stage focuses the input
  ledgerStage.addEventListener('click', (e) => {
    if (ledgerStage.classList.contains('is-signed')) return;
    if (e.target !== ledgerSignBtn && !ledgerSignBtn.contains(e.target)) {
      ledgerInput.focus();
    }
  });
  // Autofocus when the ledger scrolls into view
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting && !ledgerStage.classList.contains('is-signed')) {
        setTimeout(() => ledgerInput.focus({ preventScroll: true }), 300);
      }
    });
  }, { threshold: 0.6 });
  obs.observe(ledgerStage);
}
```

- [ ] **Step 2: Verify page still loads without console errors**

Reload `http://localhost:8080`. Open DevTools console. No JS errors should appear. The ledger section should still render (book closed, button below).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "refactor: remove old quill functions and ledger-stage mousemove/IO listeners"
```

---

## Task 8: JS — State machine, IntersectionObserver, animationend

**Files:**
- Modify: `index.html` (JS block, insert after line 2222 `buildLedgerEntries();`)

- [ ] **Step 1: Insert the state machine and new IntersectionObserver**

Immediately after `buildLedgerEntries();` (around line 2222), insert:

```js
// ── Ledger state machine ──────────────────────────────────────
let ledgerState = 'closed';
const STATE_CLASSES = ['is-closed', 'is-opening', 'is-idle', 'is-typing', 'is-signed'];

function transitionTo(state) {
  ledgerState = state;
  STATE_CLASSES.forEach(c => ledgerStage.classList.remove(c));
  ledgerStage.classList.add('is-' + state);
}

// ── Open book when scrolled into view (fires once) ───────────
if (ledgerStage) {
  const openObserver = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting && ledgerState === 'closed') {
        transitionTo('opening');
        openObserver.disconnect();
        // Transition to idle when the right page finishes animating
        const rightPage = ledgerStage.querySelector('.ledger-page--right');
        rightPage.addEventListener('animationend', () => {
          if (ledgerState === 'opening') transitionTo('idle');
        }, { once: true });
      }
    });
  }, { threshold: 0.5 });
  openObserver.observe(ledgerStage);

  // Click anywhere on the book while idle/typing focuses the input
  ledgerStage.addEventListener('click', (e) => {
    if (ledgerState === 'idle' || ledgerState === 'typing') {
      if (e.target !== ledgerSignBtn && !ledgerSignBtn.contains(e.target)) {
        ledgerInput.focus();
      }
    }
  });
}
```

- [ ] **Step 2: Verify open animation fires on scroll**

Reload `http://localhost:8080`. Scroll down to the ledger section. The book should start closed and unfold when ~50% of the stage enters the viewport. After ~1.5s the book should be fully open with the blinking cursor visible on the signing line.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: ledger state machine, IntersectionObserver triggers spine unfold"
```

---

## Task 9: JS — Proximity detection for bone quill

**Files:**
- Modify: `index.html` (JS block, after state machine code from Task 8)

- [ ] **Step 1: Insert proximity detection**

Immediately after the ledger state machine block, insert:

```js
// ── Bone quill proximity cursor swap ─────────────────────────
const NIB_OFFSET_X = 18;  // px from left of rendered quill to nib tip
const NIB_OFFSET_Y = 175; // px from top of rendered quill to nib tip

function distToRect(x, y, r) {
  const dx = Math.max(r.left - x, 0, x - r.right);
  const dy = Math.max(r.top  - y, 0, y - r.bottom);
  return Math.sqrt(dx * dx + dy * dy);
}

document.addEventListener('mousemove', (e) => {
  if (!ledgerStage || ledgerState === 'signed') {
    document.body.classList.remove('near-ledger');
    quillEl.style.transform = 'translate(-9999px, -9999px) rotate(-18deg)';
    return;
  }
  const rect = ledgerStage.getBoundingClientRect();
  const dist = distToRect(e.clientX, e.clientY, rect);

  if (dist < 120) {
    document.body.classList.add('near-ledger');
    quillEl.style.transform =
      `translate(${e.clientX - NIB_OFFSET_X}px, ${e.clientY - NIB_OFFSET_Y}px) rotate(-18deg)`;
  } else {
    document.body.classList.remove('near-ledger');
    quillEl.style.transform = 'translate(-9999px, -9999px) rotate(-18deg)';
  }
});
```

- [ ] **Step 2: Verify proximity swap in browser**

Reload. Move the cursor toward the ledger book from outside. At approximately 120px from the book edge the cursor should disappear and the bone quill should appear following your mouse. Moving away should restore the native cursor.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: proximity-based bone quill cursor swap within 120px of ledger"
```

---

## Task 10: JS — Typing state, quill writing animation, and signLedger update

**Files:**
- Modify: `index.html` (existing `ledgerInput` event handler and `signLedger` function)

- [ ] **Step 1: Wire `idle → typing` transition on focus**

Find the existing `ledgerInput?.addEventListener('input', ...)` block (around line 2275). Just before it, insert:

```js
ledgerInput?.addEventListener('focus', () => {
  if (ledgerState === 'idle') transitionTo('typing');
});
```

- [ ] **Step 2: Update `signLedger` to set signed state**

Find the `signLedger` function (around line 2324). Find the line `ledgerStage.classList.add('is-signed');` and replace it with a call to `transitionTo`:

```js
// OLD:
ledgerStage.classList.add('is-signed');
// NEW:
transitionTo('signed');
```

Also find `ledgerInput.readOnly = true;` and the `ledgerInput.blur()` call — these remain unchanged.

- [ ] **Step 3: Verify full flow in browser**

Reload. Run through the full sequence:
1. Scroll to ledger — book unfolds from closed ✓
2. Hover near book — bone quill cursor appears ✓
3. Click the signing line — input focuses, cursor blink hides, quill has `.writing` class when typing ✓
4. Type a name (≥2 chars) — "Sign in Rust" button appears below book ✓
5. Click button or press Enter — book dims, fullscreen "The ledger accepts thee." overlay appears with name ✓
6. After 3.4s — redirects to `GAME_URL` ✓

If the redirect is disruptive during testing, temporarily comment out `window.location.href = GAME_URL;` in `signLedger`.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: idle→typing state on focus, signLedger uses transitionTo('signed')"
```

---

## Self-Review Checklist

- [x] **Spine unfold on scroll** → Task 3 (CSS keyframes) + Task 8 (IO trigger)
- [x] **Blinking cursor in idle state** → Task 4 (CSS) + Task 8 (state machine shows idle)
- [x] **Bone quill follows cursor on proximity** → Task 6 (SVG) + Task 9 (mousemove)
- [x] **Normal cursor when outside proximity** → Task 4 (`body.near-ledger`) + Task 9 (class toggle)
- [x] **Quill as body child (viewport-relative)** → Task 1 (HTML move) + Task 6 (`position: fixed`)
- [x] **Sign button below book, not floating over pages** → Task 1 (HTML move) + Task 5 (CSS flow)
- [x] **Old quill code fully removed** → Task 7
- [x] **`transitionTo('signed')` called in signLedger** → Task 10
- [x] **`buildLedgerEntries`, `toRoman`, ink letter rendering untouched** → JS kept
- [x] **`.gate-opening` overlay + redirect unchanged** → not touched
- [x] **Right page `animationend` used (not left)** → Task 8, explicit querySelector
