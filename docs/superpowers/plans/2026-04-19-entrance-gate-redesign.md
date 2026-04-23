# Entrance Gate Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the SVG placeholder sigil on the `#gate` entrance screen with the Merken group logo and a gothic arch backdrop, revealed through a staggered ritual sequence with embers and a scan-line intro.

**Architecture:** All changes live in a single file (`index.html`). CSS changes add new keyframes and classes while updating animation properties on existing gate classes. The HTML gate block gets the arch SVG, scan div, and logo img injected. JS gets updated whisper phrases and an ember injection loop.

**Tech Stack:** Vanilla HTML/CSS/JS. No build step, no dependencies. Open in browser to verify.

---

## File Map

| File | Action | What changes |
|------|--------|-------------|
| `index.html` | Modify | CSS gate block (lines 77–210), gate HTML (lines 1448–1491), JS whisper block (lines 2134–2155) |
| `merken.png` | Create | Copy logo asset from `~/Downloads/merken.png` to project root |

---

### Task 1: Copy the logo asset

**Files:**
- Create: `merken.png` (project root)

- [ ] **Step 1: Copy the file**

```bash
cp ~/Downloads/merken.png /home/xlaptop/Projects/Claude/Websites/ChurchOfDecay/merken.png
```

- [ ] **Step 2: Verify it exists and has content**

```bash
ls -lh /home/xlaptop/Projects/Claude/Websites/ChurchOfDecay/merken.png
```

Expected: file listed, size around 900 KB.

- [ ] **Step 3: Commit**

```bash
cd /home/xlaptop/Projects/Claude/Websites/ChurchOfDecay
git add merken.png
git commit -m "feat: add Merken group logo asset"
```

---

### Task 2: Add new CSS keyframes

All edits are in `index.html`. Insert the following block of new keyframes **immediately after the closing `}` of `.gate-close:hover` (after line 209, before the `/* ────────── MAIN STAGE ────────── */` comment).**

**Files:**
- Modify: `index.html:209`

- [ ] **Step 1: Open the file and locate the insertion point**

Find this exact text near line 209:
```css
.gate-close:hover {
  color: rgba(232,220,184,0.85);
  border-color: rgba(196,24,24,0.7);
}
```

- [ ] **Step 2: Insert the new keyframes block immediately after that closing `}`**

```css

/* ── Gate redesign: keyframes ── */
@keyframes archReveal {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes logoDescend {
  0%   { opacity: 0; transform: translateY(-50px) scale(0.9); }
  60%  { opacity: 1; transform: translateY(6px) scale(1.02); }
  80%  { transform: translateY(-2px) scale(0.99); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes logoGlow {
  0%, 100% { filter: drop-shadow(0 0 16px rgba(196,24,20,0.35)); }
  50%       { filter: drop-shadow(0 0 40px rgba(255,56,20,0.65)); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes btnPulse {
  0%, 100% { box-shadow: 0 0 10px rgba(196,24,24,0.2); }
  50%       { box-shadow: 0 0 28px rgba(255,56,20,0.5); }
}
@keyframes scanDown {
  0%   { top: 0;    opacity: 0.9; }
  100% { top: 100vh; opacity: 0; }
}
@keyframes emberFloat {
  0%   { transform: translateY(0) translateX(0); opacity: 0; }
  8%   { opacity: 0.85; }
  85%  { opacity: 0.3; }
  100% { transform: translateY(-280px) translateX(var(--dx)); opacity: 0; }
}

/* ── Gate redesign: new classes ── */
.arch-wrap {
  position: absolute;
  width: min(520px, 92vw);
  height: min(640px, 88vh);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  animation: archReveal 1.8s ease 0.3s forwards;
}
.gate-scan {
  position: fixed; left: 0; right: 0; top: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(255,56,20,0.6) 50%, transparent 100%);
  z-index: 200;
  pointer-events: none;
  animation: scanDown 1.6s ease 0.2s forwards;
  opacity: 0;
}
.logo-wrap {
  width: min(260px, 58vw);
  height: min(260px, 58vw);
  margin-bottom: 28px;
  opacity: 0;
  transform: translateY(-50px);
  animation: logoDescend 1.4s cubic-bezier(0.2, 0.8, 0.3, 1) 0.6s forwards;
}
.logo-img {
  width: 100%; height: 100%;
  object-fit: contain;
  mix-blend-mode: screen;
  animation: logoGlow 3.5s ease-in-out 2.2s infinite;
}
.gate-latin {
  font-family: 'EB Garamond', serif;
  font-style: italic;
  font-size: clamp(12px, 1.6vw, 15px);
  color: rgba(232,220,184,0.38);
  letter-spacing: 0.25em;
  margin-bottom: 18px;
  opacity: 0;
  animation: fadeUp 0.8s ease 3.1s forwards;
}
.ember {
  position: fixed;
  border-radius: 50%;
  background: #ff3814;
  pointer-events: none;
  z-index: 50;
  opacity: 0;
  animation: emberFloat linear infinite;
}
```

- [ ] **Step 3: Open `index.html` in a browser and verify no CSS parse errors**

Open browser devtools Console — no red errors should appear. The gate should still display (sigil still present at this stage).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add gate redesign keyframes and new CSS classes"
```

---

### Task 3: Update existing gate CSS for staggered reveal

**Files:**
- Modify: `index.html:78–188`

All edits below are replacements of existing CSS rule blocks inside `index.html`.

- [ ] **Step 1: Replace the `#gate` background**

Find:
```css
#gate {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: opacity 1.8s ease, visibility 1.8s;
}
```

Replace with:
```css
#gate {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: radial-gradient(ellipse 90% 80% at 50% 40%, #160202 0%, #0a0101 50%, #000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: opacity 1.8s ease, visibility 1.8s;
}
```

- [ ] **Step 2: Remove `.gate-sigil` and its `breathe` keyframe**

Find and delete this entire block (lines ~105–115):
```css
.gate-sigil {
  width: 260px; height: 260px;
  margin: 0 auto 40px;
  position: relative;
  animation: breathe 4s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 20px rgba(196,24,24,0.5)); }
  50% { transform: scale(1.04); filter: drop-shadow(0 0 40px rgba(255,56,20,0.8)); }
}
```

- [ ] **Step 3: Add entry animation to `.gate-whisper`**

Find:
```css
.gate-whisper {
  font-family: 'EB Garamond', serif;
  font-style: italic;
  font-size: 15px;
  letter-spacing: 0.15em;
  color: rgba(232,220,184,0.45);
  margin-bottom: 18px;
  text-transform: lowercase;
  min-height: 22px;
}
```

Replace with:
```css
.gate-whisper {
  font-family: 'EB Garamond', serif;
  font-style: italic;
  font-size: 15px;
  letter-spacing: 0.15em;
  color: rgba(232,220,184,0.45);
  margin-bottom: 14px;
  text-transform: lowercase;
  min-height: 22px;
  opacity: 0;
  animation: fadeUp 0.8s ease 2.0s forwards;
  transition: opacity 0.6s;
}
```

- [ ] **Step 4: Add entry animation to `.gate-title`**

Find:
```css
.gate-title {
  font-family: 'UnifrakturCook', serif;
  font-size: 54px;
  color: var(--parchment);
  text-shadow: 0 0 30px rgba(196,24,24,0.6), 0 2px 0 rgba(0,0,0,0.8);
  letter-spacing: 0.02em;
  line-height: 1;
  margin-bottom: 28px;
}
```

Replace with:
```css
.gate-title {
  font-family: 'UnifrakturCook', serif;
  font-size: clamp(38px, 7vw, 54px);
  color: var(--parchment);
  text-shadow: 0 0 40px rgba(196,24,24,0.5), 0 0 80px rgba(122,10,10,0.3);
  letter-spacing: 0.02em;
  line-height: 1;
  margin-bottom: 10px;
  opacity: 0;
  animation: fadeUp 0.9s ease 2.5s forwards;
}
```

- [ ] **Step 5: Add entry animation to `.gate-prompt`**

Find:
```css
.gate-prompt {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  letter-spacing: 0.6em;
  color: rgba(232,220,184,0.6);
  text-transform: uppercase;
  margin-bottom: 36px;
}
```

Replace with:
```css
.gate-prompt {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  letter-spacing: 0.55em;
  color: rgba(232,220,184,0.5);
  text-transform: uppercase;
  margin-bottom: 36px;
  opacity: 0;
  animation: fadeUp 0.8s ease 3.6s forwards;
}
```

- [ ] **Step 6: Add entry + pulse animation to `.gate-button`**

Find:
```css
.gate-button {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 18px 38px;
  background: linear-gradient(180deg, #2a0606 0%, #5a0a0a 50%, #2a0606 100%);
  border: 1px solid var(--blood);
  color: var(--parchment);
  font-family: 'Cinzel', serif;
  font-size: 13px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
  transition: all 0.4s ease;
  clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px);
}
```

Replace with:
```css
.gate-button {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 18px 44px;
  background: linear-gradient(180deg, #1a0404 0%, #420808 50%, #1a0404 100%);
  border: 1px solid rgba(196,24,24,0.55);
  color: var(--parchment);
  font-family: 'Cinzel', serif;
  font-size: 13px;
  letter-spacing: 0.45em;
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
  transition: all 0.4s ease;
  clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px);
  opacity: 0;
  animation: fadeUp 1s ease 4.2s forwards, btnPulse 2.8s ease-in-out 5.5s infinite;
}
```

- [ ] **Step 7: Add entry animation to `.gate-warning`**

Find:
```css
.gate-warning {
  margin-top: 50px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(232,220,184,0.3);
  letter-spacing: 0.3em;
  text-transform: uppercase;
}
```

Replace with:
```css
.gate-warning {
  margin-top: 32px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(232,220,184,0.2);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  opacity: 0;
  animation: fadeUp 0.8s ease 5.0s forwards;
}
```

- [ ] **Step 8: Verify in browser — reload and confirm nothing is visible yet on the gate (all `opacity: 0` before delays fire)**

- [ ] **Step 9: Commit**

```bash
git add index.html
git commit -m "feat: add staggered reveal animations to gate elements"
```

---

### Task 4: Update gate HTML

**Files:**
- Modify: `index.html:1448–1491`

- [ ] **Step 1: Locate the gate HTML block**

Find this exact opening line:
```html
<!-- ═══════════ GATE ═══════════ -->
<div id="gate">
```

- [ ] **Step 2: Replace the entire gate HTML block**

Find the whole block from `<!-- ═══════════ GATE ═══════════ -->` through the closing `</div>` at line 1491, and replace it with:

```html
<!-- ═══════════ GATE ═══════════ -->
<div id="gate">
  <div class="gate-scan"></div>
  <div class="gate-vignette"></div>
  <button class="gate-close" onclick="enterNave()" title="Skip entrance">× skip</button>

  <!-- Gothic arch backdrop -->
  <div class="arch-wrap" aria-hidden="true">
    <svg viewBox="0 0 520 640" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <path d="M30 640 L30 260 Q260 10 490 260 L490 640" stroke="#7a0a0a" stroke-width="1.4" opacity="0.7"/>
      <path d="M54 640 L54 272 Q260 44 466 272 L466 640" stroke="#3a0505" stroke-width="0.9" opacity="0.6"/>
      <path d="M80 640 L80 286 Q260 80 440 286 L440 640" stroke="#2a0404" stroke-width="0.6" opacity="0.5"/>
      <line x1="30" y1="400" x2="54" y2="400" stroke="#5a0808" stroke-width="0.8" opacity="0.6"/>
      <line x1="466" y1="400" x2="490" y2="400" stroke="#5a0808" stroke-width="0.8" opacity="0.6"/>
      <line x1="30" y1="500" x2="54" y2="500" stroke="#5a0808" stroke-width="0.8" opacity="0.5"/>
      <line x1="466" y1="500" x2="490" y2="500" stroke="#5a0808" stroke-width="0.8" opacity="0.5"/>
      <path d="M242 28 L260 8 L278 28 L270 36 L260 28 L250 36 Z" stroke="#5a0808" stroke-width="0.8" fill="none" opacity="0.6"/>
      <rect x="22" y="580" width="16" height="60" stroke="#3a0505" stroke-width="0.8" fill="none" opacity="0.4"/>
      <rect x="482" y="580" width="16" height="60" stroke="#3a0505" stroke-width="0.8" fill="none" opacity="0.4"/>
      <path d="M18 580 L22 570 L38 570 L42 580" stroke="#3a0505" stroke-width="0.8" fill="none" opacity="0.5"/>
      <path d="M478 580 L482 570 L498 570 L502 580" stroke="#3a0505" stroke-width="0.8" fill="none" opacity="0.5"/>
      <circle cx="260" cy="52" r="6" stroke="#5a0808" stroke-width="0.7" fill="none" opacity="0.5"/>
      <circle cx="248" cy="64" r="5" stroke="#3a0505" stroke-width="0.6" fill="none" opacity="0.4"/>
      <circle cx="272" cy="64" r="5" stroke="#3a0505" stroke-width="0.6" fill="none" opacity="0.4"/>
    </svg>
  </div>

  <div class="gate-inner">
    <div class="logo-wrap">
      <img class="logo-img" src="merken.png" alt="Merken — Church of Decay">
    </div>
    <div class="gate-whisper" id="whisper">the veil is thin tonight</div>
    <h1 class="gate-title">Church of Decay</h1>
    <div class="gate-latin">· Ecclesia Putredinis ·</div>
    <div class="gate-prompt">the faithful gather below</div>
    <button class="gate-button" id="enterBtn">Enter the Nave</button>
    <div class="gate-warning">mind the red floor · turn back if unwilling</div>
  </div>
</div>
```

- [ ] **Step 3: Open in browser and verify visual structure**

Reload the page. You should see:
- Scan line sweep from top to bottom (first ~1.5s)
- Gothic arch lines fading in
- Merken logo descending from above the arch
- Title, Latin subtitle, prompt, and button appearing one by one
- Warning text appearing last

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: replace gate sigil with Merken logo, add arch SVG and scan line"
```

---

### Task 5: Update gate JavaScript

**Files:**
- Modify: `index.html:2134–2155`

- [ ] **Step 1: Locate the whisper JS block**

Find this exact line:
```js
// ── Whisper cycling on gate
const whispers = [
```

- [ ] **Step 2: Replace the entire whisper block (lines 2134–2155)**

Find everything from `// ── Whisper cycling on gate` through `}, 4200);` and replace with:

```js
// ── Whisper cycling on gate
const whispers = [
  'the veil is thin tonight',
  'all flesh returns to the earth',
  'come, faithful, come',
  'the dead walk among us',
  'give yourself to the rot',
  'kneel before the skull of the dead god',
  'something beneath the stones is breathing',
  'do not count the candles',
  'he remembers your name',
  'the red floor is still wet'
];
let wi = 0;
const whisperEl = document.getElementById('whisper');
setInterval(() => {
  if (!whisperEl) return;
  whisperEl.style.opacity = '0';
  setTimeout(() => {
    wi = (wi + 1) % whispers.length;
    whisperEl.textContent = whispers[wi];
    whisperEl.style.opacity = '1';
  }, 650);
}, 4000);

// ── Ember particles on gate
(function spawnEmbers() {
  const gateEl = document.getElementById('gate');
  if (!gateEl) return;
  for (let i = 0; i < 22; i++) {
    const e = document.createElement('div');
    e.className = 'ember';
    const size = 1 + Math.random() * 2.5;
    e.style.cssText = [
      `left:${15 + Math.random() * 70}%`,
      `bottom:${Math.random() * 35}%`,
      `width:${size}px`,
      `height:${size}px`,
      `--dx:${(Math.random() - 0.5) * 80}px`,
      `animation-duration:${3 + Math.random() * 3}s`,
      `animation-delay:${0.5 + Math.random() * 5}s`
    ].join(';');
    gateEl.appendChild(e);
  }
})();
```

- [ ] **Step 3: Verify in browser**

Reload. After ~5s of the sequence completing:
- Whisper text should be cycling every 4s with a fade transition
- Small orange ember particles should be drifting upward across the gate
- The existing `enterNave()` button click should still dissolve the gate and reveal the main stage

- [ ] **Step 4: Verify skip still works**

Click "× skip" — gate should dissolve, main stage should appear. Reload and click "Enter the Nave" — same result.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: update gate whisper phrases and add ember particle injection"
```

---

## Final Verification Checklist

Open `index.html` in browser, clear `sessionStorage` if needed (`sessionStorage.clear()` in devtools), then hard reload:

- [ ] Scan line sweeps top → bottom in first ~1.5s
- [ ] Gothic arch lines fade in from black
- [ ] Merken logo descends from above with a settling bounce
- [ ] Logo glows faintly (not clipping against a square background — screen blend dissolves the dark bg)
- [ ] Whisper text appears after logo lands
- [ ] "Church of Decay" title fades up
- [ ] "· Ecclesia Putredinis ·" appears next
- [ ] "the faithful gather below" prompt appears
- [ ] "Enter the Nave" button appears last, then starts pulsing
- [ ] Warning text appears at the bottom
- [ ] Ember particles drift upward throughout
- [ ] Whisper text cycles every ~4s
- [ ] Clicking "Enter the Nave" dissolves gate and reveals main stage
- [ ] Clicking "× skip" also dissolves gate correctly
- [ ] Reloading within the same session skips the gate (sessionStorage check intact)
- [ ] No console errors
