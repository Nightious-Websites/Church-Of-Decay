/**
 * The cathedral backdrop SVG — rib vault, ceiling oculus, back arches,
 * banners, caged lanterns, wall torches, floor, stick-figure walkers, rose
 * window. Kept as a raw HTML string and rendered via `dangerouslySetInnerHTML`
 * on `.scene`; hand-converting ~480 lines of defs/filter/mask/gradient/use
 * markup to JSX is tedious and error-prone, and the SVG has zero React
 * reactivity — nothing needs to re-render any of it.
 */

export const cathedralSvgInnerHtml = `
    <!-- Architectural backdrop: pointed arches & pillars -->
    <svg class="arches" viewBox="0 0 1600 2700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="stoneG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stop-color="#2a1210" stop-opacity="0.9"/>
          <stop offset="50%" stop-color="#140606" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="#050101" stop-opacity="1"/>
        </linearGradient>
        <radialGradient id="archGlow" cx="50%" cy="80%" r="50%">
          <stop offset="0%" stop-color="#c41818" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#c41818" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="pillarG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stop-color="#1a0808"/>
          <stop offset="100%" stop-color="#050101"/>
        </linearGradient>
      </defs>

      <!-- ═══ Roof vault — gothic vaulted ceiling (y=0–900) ═══ -->
      <g id="roof-vault">
        <defs>
          <!-- Ceiling stone gradient — warmer/lighter near the skylight -->
          <radialGradient id="vaultCeil" cx="800" cy="558" r="700" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stop-color="#240909"/>
            <stop offset="45%"  stop-color="#110404"/>
            <stop offset="100%" stop-color="#070101"/>
          </radialGradient>

          <!-- Glow halo around skylight opening -->
          <radialGradient id="bossHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stop-color="#c41818" stop-opacity="0.30"/>
            <stop offset="100%" stop-color="#c41818" stop-opacity="0"/>
          </radialGradient>
          <!-- Bottom fade into arch section -->
          <linearGradient id="vaultFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#070101" stop-opacity="0"/>
            <stop offset="53%"  stop-color="#070101" stop-opacity="0.92"/>
            <stop offset="100%" stop-color="#070101" stop-opacity="0.06"/>
          </linearGradient>
          <!-- Glow filter: blurred copy beneath crisp line = light halo -->
          <filter id="ribGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <!-- Mask: ribs are hidden inside the oculus so they stop cleanly at the skylight ring -->
          <mask id="ribMask">
            <rect x="0" y="0" width="1600" height="900" fill="white"/>
            <circle cx="800" cy="558" r="230" fill="black"/>
          </mask>
        </defs>

        <!-- Dark stone ceiling surface -->
        <rect x="0" y="0" width="1600" height="900" fill="url(#vaultCeil)"/>

        <!-- ── Rib vault: 8 primary ribs, masked to stop at oculus ── -->
        <g mask="url(#ribMask)" filter="url(#ribGlow)" stroke="#7a2424" stroke-width="1.6" fill="none" opacity="0.38">
          <animate attributeName="opacity" values="0.38;0.56;0.38" dur="8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
          <animate attributeName="stroke-width" values="1.6;2.1;1.6" dur="8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
          <!-- Straight up -->
          <path d="M 800 558 Q 800 110 800 0"/>
          <!-- Upper-right -->
          <path d="M 800 558 Q 1090 110 1400 0"/>
          <!-- Right -->
          <path d="M 800 558 Q 1320 252 1600 240"/>
          <!-- Lower-right -->
          <path d="M 800 558 Q 1090 600 1400 900"/>
          <!-- Straight down -->
          <path d="M 800 558 Q 800 620 800 900"/>
          <!-- Lower-left -->
          <path d="M 800 558 Q 510 600 200 900"/>
          <!-- Left -->
          <path d="M 800 558 Q 280 252 0 240"/>
          <!-- Upper-left -->
          <path d="M 800 558 Q 510 110 200 0"/>
        </g>

        <!-- ── Rib vault: 8 secondary (tierceron) ribs ── -->
        <g mask="url(#ribMask)" filter="url(#ribGlow)" stroke="#4e1818" stroke-width="1.0" fill="none" opacity="0.35">
          <animate attributeName="opacity" values="0.35;0.52;0.35" dur="11s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
          <animate attributeName="stroke-width" values="1.0;1.5;1.0" dur="11s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
          <!-- Between up and upper-right -->
          <path d="M 800 558 Q 930 90 1100 0"/>
          <!-- Between upper-right and right -->
          <path d="M 800 558 Q 1240 140 1600 80"/>
          <!-- Between right and lower-right -->
          <path d="M 800 558 Q 1360 430 1600 560"/>
          <!-- Between lower-right and down -->
          <path d="M 800 558 Q 1060 760 1240 900"/>
          <!-- Between down and lower-left -->
          <path d="M 800 558 Q 540 760 360 900"/>
          <!-- Between lower-left and left -->
          <path d="M 800 558 Q 240 430 0 560"/>
          <!-- Between left and upper-left -->
          <path d="M 800 558 Q 160 140 0 80"/>
          <!-- Between upper-left and up -->
          <path d="M 800 558 Q 670 90 500 0"/>
        </g>

        <!-- ── Oculus collar — stone ring framing the skylight ── -->
        <circle cx="800" cy="558" r="230" fill="none" stroke="#6a2020" stroke-width="3.5" opacity="0.9"/>
        <circle cx="800" cy="558" r="190" fill="none" stroke="#4a1616" stroke-width="1.2" opacity="0.5"/>

<!-- Warm glow halo around the skylight opening -->
        <ellipse cx="800" cy="558" rx="260" ry="190" fill="url(#bossHalo)"/>

        <!-- Bottom transition — fade into the arch section below -->
        <rect x="0" y="566" width="1600" height="584" fill="url(#vaultFade)"/>

      </g><!-- end #roof-vault -->

      <g transform="translate(0, 900)"><!-- parallax scene band -->
      <!-- Ceiling seam blend — rises from arch top to meet the ceiling fade -->
      <defs>
        <linearGradient id="ceilBlend" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#070101" stop-opacity="0.88"/>
          <stop offset="100%" stop-color="#070101" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1600" height="280" fill="url(#ceilBlend)"/>
      <!-- Back arches — symmetric around vertical center x=800 -->
      <!-- Center arch 700-900, mid pair 400-600 / 1000-1200, outer pair 100-300 / 1300-1500 -->
      <g opacity="0.78" filter="blur(0.8px)">
        <path d="M 100 900 L 100 400 Q 200 250 300 400 L 300 900 Z" fill="url(#stoneG)"/>
        <path d="M 400 900 L 400 380 Q 500 230 600 380 L 600 900 Z" fill="url(#stoneG)"/>
        <path d="M 700 900 L 700 360 Q 800 200 900 360 L 900 900 Z" fill="url(#stoneG)"/>
        <path d="M 1000 900 L 1000 380 Q 1100 230 1200 380 L 1200 900 Z" fill="url(#stoneG)"/>
        <path d="M 1300 900 L 1300 400 Q 1400 250 1500 400 L 1500 900 Z" fill="url(#stoneG)"/>
      </g>

      <!-- Side pillars removed — arches alone define the backdrop -->

      <!-- Hanging banners — design matched to reference image -->
      <defs>
        <linearGradient id="emberFrame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stop-color="#ffb347"/>
          <stop offset="50%" stop-color="#ff6a1e"/>
          <stop offset="100%" stop-color="#c44418"/>
        </linearGradient>
        <linearGradient id="emblemG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stop-color="#ffc070"/>
          <stop offset="60%" stop-color="#e06030"/>
          <stop offset="100%" stop-color="#8a2a10"/>
        </linearGradient>
        <linearGradient id="bannerClothG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stop-color="#4a0808"/>
          <stop offset="50%" stop-color="#6a1010"/>
          <stop offset="100%" stop-color="#3a0505"/>
        </linearGradient>
        <symbol id="codBanner" viewBox="0 0 100 260">
          <!-- Cloth -->
          <path d="M 0 0 L 100 0 L 100 220 L 50 260 L 0 220 Z" fill="url(#bannerClothG)"/>
          <!-- Ember frame (double inset, thin bright line) -->
          <path d="M 6 8 L 94 8 L 94 218 L 50 253 L 6 218 Z"
                fill="none" stroke="url(#emberFrame)" stroke-width="2.5"
                style="filter: drop-shadow(0 0 4px rgba(255,110,40,0.9));"/>
          <path d="M 10 12 L 90 12 L 90 216 L 50 248 L 10 216 Z"
                fill="none" stroke="#ffb870" stroke-width="0.6" opacity="0.65"/>
          <!-- Emblem: actual artwork, cropped from reference -->
          <image href="/assets/emblem.png" x="10" y="30" width="80" height="95" preserveAspectRatio="xMidYMid meet"/>
        </symbol>
      </defs>

      <!-- Banners hang centered on the 2nd-from-outer arches (x=500 and x=1100), symmetric around page center x=800.
           Rope length increased 0.5x — chain now runs 0 → 270, banner top at y=270. -->
      <!-- Left chain + banner — centered on x=500 -->
      <g style="transform-origin: 500px 0; animation: bannerSway 8s ease-in-out infinite;">
        <path d="M 500 0 L 500 270" stroke="#1a0e06" stroke-width="2"/>
        <g fill="none" stroke="#2a1810" stroke-width="1">
          <circle cx="500" cy="12"  r="2.5"/>
          <circle cx="500" cy="28"  r="2.5"/>
          <circle cx="500" cy="44"  r="2.5"/>
          <circle cx="500" cy="60"  r="2.5"/>
          <circle cx="500" cy="76"  r="2.5"/>
          <circle cx="500" cy="92"  r="2.5"/>
          <circle cx="500" cy="108" r="2.5"/>
          <circle cx="500" cy="124" r="2.5"/>
          <circle cx="500" cy="140" r="2.5"/>
          <circle cx="500" cy="156" r="2.5"/>
          <circle cx="500" cy="172" r="2.5"/>
          <circle cx="500" cy="188" r="2.5"/>
          <circle cx="500" cy="204" r="2.5"/>
          <circle cx="500" cy="220" r="2.5"/>
          <circle cx="500" cy="236" r="2.5"/>
          <circle cx="500" cy="252" r="2.5"/>
        </g>
        <use href="#codBanner" x="450" y="270" width="100" height="260"/>
      </g>
      <!-- Right chain + banner — centered on x=1100 (mirror) -->
      <g style="transform-origin: 1100px 0; animation: bannerSway 9s ease-in-out infinite reverse;">
        <path d="M 1100 0 L 1100 270" stroke="#1a0e06" stroke-width="2"/>
        <g fill="none" stroke="#2a1810" stroke-width="1">
          <circle cx="1100" cy="12"  r="2.5"/>
          <circle cx="1100" cy="28"  r="2.5"/>
          <circle cx="1100" cy="44"  r="2.5"/>
          <circle cx="1100" cy="60"  r="2.5"/>
          <circle cx="1100" cy="76"  r="2.5"/>
          <circle cx="1100" cy="92"  r="2.5"/>
          <circle cx="1100" cy="108" r="2.5"/>
          <circle cx="1100" cy="124" r="2.5"/>
          <circle cx="1100" cy="140" r="2.5"/>
          <circle cx="1100" cy="156" r="2.5"/>
          <circle cx="1100" cy="172" r="2.5"/>
          <circle cx="1100" cy="188" r="2.5"/>
          <circle cx="1100" cy="204" r="2.5"/>
          <circle cx="1100" cy="220" r="2.5"/>
          <circle cx="1100" cy="236" r="2.5"/>
          <circle cx="1100" cy="252" r="2.5"/>
        </g>
        <use href="#codBanner" x="1050" y="270" width="100" height="260"/>
      </g>

      <!-- ═══ Caged hanging lanterns — symmetric around x=800 ═══
           Left at x=350, right at x=1250 (each 450 from center). -->
      <defs>
        <symbol id="cagedLantern" viewBox="0 0 80 140" overflow="visible">
          <!-- Top hook/cap -->
          <path d="M 36 0 L 44 0 L 46 6 L 34 6 Z" fill="#2a1810" stroke="#5a3414" stroke-width="0.8"/>
          <!-- Small ring attach -->
          <circle cx="40" cy="10" r="3" fill="none" stroke="#3a2414" stroke-width="1"/>
          <!-- Outer iron cage (rectangular) -->
          <rect x="18" y="16" width="44" height="64" rx="3" fill="#0a0604" stroke="#3a2414" stroke-width="1.5"/>
          <!-- Vertical cage bars -->
          <line x1="28" y1="16" x2="28" y2="80" stroke="#3a2414" stroke-width="1.2"/>
          <line x1="40" y1="16" x2="40" y2="80" stroke="#3a2414" stroke-width="1.2"/>
          <line x1="52" y1="16" x2="52" y2="80" stroke="#3a2414" stroke-width="1.2"/>
          <!-- Horizontal cage ring -->
          <line x1="18" y1="48" x2="62" y2="48" stroke="#3a2414" stroke-width="1"/>
          <!-- Cage top cap plate -->
          <rect x="14" y="14" width="52" height="5" fill="#1a0e06" stroke="#3a2414" stroke-width="0.8"/>
          <!-- Cage bottom plate -->
          <rect x="14" y="78" width="52" height="5" fill="#1a0e06" stroke="#3a2414" stroke-width="0.8"/>
          <!-- Bottom spike -->
          <path d="M 34 83 L 46 83 L 40 96 Z" fill="#1a0e06" stroke="#3a2414" stroke-width="0.8"/>
          <!-- Inner ember glow (behind bars) -->
          <ellipse cx="40" cy="48" rx="16" ry="24" fill="#ff6020" opacity="0.5" filter="blur(6px)"/>
          <ellipse cx="40" cy="48" rx="8" ry="16" fill="#ffb347" opacity="0.85" filter="blur(2px)"/>
          <ellipse cx="40" cy="50" rx="3" ry="8" fill="#fff1d0"/>
          <!-- Outer halo -->
          <circle cx="40" cy="48" r="36" fill="#ff8030" opacity="0.25" filter="blur(14px)"/>
        </symbol>
      </defs>

      <!-- Left caged lantern — x=620, chain from roof -->
      <g style="transform-origin: 620px 0; animation: bannerSway 7s ease-in-out infinite;">
        <path d="M 620 0 L 620 225" stroke="#1a0e06" stroke-width="1.8"/>
        <g fill="none" stroke="#2a1810" stroke-width="1">
          <circle cx="620" cy="10"  r="2.2"/>
          <circle cx="620" cy="24"  r="2.2"/>
          <circle cx="620" cy="38"  r="2.2"/>
          <circle cx="620" cy="52"  r="2.2"/>
          <circle cx="620" cy="66"  r="2.2"/>
          <circle cx="620" cy="80"  r="2.2"/>
          <circle cx="620" cy="94"  r="2.2"/>
          <circle cx="620" cy="108" r="2.2"/>
          <circle cx="620" cy="122" r="2.2"/>
          <circle cx="620" cy="136" r="2.2"/>
          <circle cx="620" cy="150" r="2.2"/>
          <circle cx="620" cy="164" r="2.2"/>
          <circle cx="620" cy="178" r="2.2"/>
          <circle cx="620" cy="192" r="2.2"/>
          <circle cx="620" cy="206" r="2.2"/>
          <circle cx="620" cy="220" r="2.2"/>
        </g>
        <use href="#cagedLantern" x="595" y="225" width="50" height="88"/>
      </g>

      <!-- Right caged lantern — x=980 (mirror) -->
      <g style="transform-origin: 980px 0; animation: bannerSway 7.5s ease-in-out infinite reverse;">
        <path d="M 980 0 L 980 225" stroke="#1a0e06" stroke-width="1.8"/>
        <g fill="none" stroke="#2a1810" stroke-width="1">
          <circle cx="980" cy="10"  r="2.2"/>
          <circle cx="980" cy="24"  r="2.2"/>
          <circle cx="980" cy="38"  r="2.2"/>
          <circle cx="980" cy="52"  r="2.2"/>
          <circle cx="980" cy="66"  r="2.2"/>
          <circle cx="980" cy="80"  r="2.2"/>
          <circle cx="980" cy="94"  r="2.2"/>
          <circle cx="980" cy="108" r="2.2"/>
          <circle cx="980" cy="122" r="2.2"/>
          <circle cx="980" cy="136" r="2.2"/>
          <circle cx="980" cy="150" r="2.2"/>
          <circle cx="980" cy="164" r="2.2"/>
          <circle cx="980" cy="178" r="2.2"/>
          <circle cx="980" cy="192" r="2.2"/>
          <circle cx="980" cy="206" r="2.2"/>
          <circle cx="980" cy="220" r="2.2"/>
        </g>
        <use href="#cagedLantern" x="955" y="225" width="50" height="88"/>
      </g>

      <defs>
        <!-- Wall torch — simple: thin metal pole from wall, wood torch, flame -->
        <symbol id="wallTorch" viewBox="0 0 50 70">
          <!-- Thin iron pole jutting out from wall (left edge) — shorter handle -->
          <rect x="0" y="44" width="10" height="2" fill="#3a2010"/>
          <!-- Wooden torch stick, angled up slightly -->
          <rect x="8" y="34" width="3" height="16" fill="#4a2a14" stroke="#2a1408" stroke-width="0.4"/>
          <!-- Wood grain hint -->
          <line x1="9" y1="36" x2="9" y2="48" stroke="#2a1408" stroke-width="0.3" opacity="0.6"/>
          <!-- Flame -->
          <g style="transform-origin: 9.5px 32px; animation: bannerSway 1.6s ease-in-out infinite;">
            <circle cx="9.5" cy="30" r="16" fill="#ff6020" opacity="0.35" filter="blur(6px)"/>
            <circle cx="9.5" cy="30" r="9" fill="#ffa040" opacity="0.5" filter="blur(2.5px)"/>
            <ellipse cx="9.5" cy="28" rx="4" ry="8" fill="#ff8030" filter="blur(0.6px)"/>
            <ellipse cx="9.5" cy="27" rx="2.4" ry="5.5" fill="#ffb347"/>
            <ellipse cx="9.5" cy="26" rx="1.2" ry="3.5" fill="#fff1d0"/>
          </g>
        </symbol>
      </defs>

      <!-- ═══ Wall torches — 3 per side, symmetric around x=800 ═══
           Torch symbol viewBox 100x140 with mounting plate on its LEFT side and flame bundle to the upper-right.
           Left-side torches: placed naturally.
           Right-side torches: mirrored horizontally via scale(-1 1). -->
      <g id="wall-torches" aria-hidden="true">
        <!-- 2 torches per edge, randomized heights (varying distance between them) -->
        <g transform="translate(100 0)">
          <use href="#wallTorch" x="0" y="426" width="50" height="70"/>
          <use href="#wallTorch" x="0" y="670" width="50" height="70"/>
        </g>
        <g transform="translate(300 0) scale(-1 1)">
          <use href="#wallTorch" x="0" y="408" width="50" height="70"/>
          <use href="#wallTorch" x="0" y="594" width="50" height="70"/>
        </g>
        <g transform="translate(400 0)">
          <use href="#wallTorch" x="0" y="551" width="50" height="70"/>
          <use href="#wallTorch" x="0" y="703" width="50" height="70"/>
        </g>
        <g transform="translate(600 0) scale(-1 1)">
          <use href="#wallTorch" x="0" y="526" width="50" height="70"/>
          <use href="#wallTorch" x="0" y="772" width="50" height="70"/>
        </g>
        <g transform="translate(700 0)">
          <use href="#wallTorch" x="0" y="559" width="50" height="70"/>
          <use href="#wallTorch" x="0" y="733" width="50" height="70"/>
        </g>
        <g transform="translate(900 0) scale(-1 1)">
          <use href="#wallTorch" x="0" y="440" width="50" height="70"/>
          <use href="#wallTorch" x="0" y="563" width="50" height="70"/>
        </g>
        <g transform="translate(1000 0)">
          <use href="#wallTorch" x="0" y="456" width="50" height="70"/>
          <use href="#wallTorch" x="0" y="753" width="50" height="70"/>
        </g>
        <g transform="translate(1200 0) scale(-1 1)">
          <use href="#wallTorch" x="0" y="409" width="50" height="70"/>
          <use href="#wallTorch" x="0" y="576" width="50" height="70"/>
        </g>
        <g transform="translate(1300 0)">
          <use href="#wallTorch" x="0" y="550" width="50" height="70"/>
          <use href="#wallTorch" x="0" y="735" width="50" height="70"/>
        </g>
        <g transform="translate(1500 0) scale(-1 1)">
          <use href="#wallTorch" x="0" y="401" width="50" height="70"/>
          <use href="#wallTorch" x="0" y="696" width="50" height="70"/>
        </g>
      </g>

      </g><!-- end translate(0,900) -->

      <!-- ═══ Church floor — below arch band ═══ -->
      <g id="church-floor" aria-hidden="true">
        <rect x="0" y="1820" width="1600" height="70" fill="url(#stoneG)" opacity="0.95"/>
        <rect x="0" y="1888" width="1600" height="12" fill="#050101"/>
      </g>

      <!-- ═══ Stick figure walkers symbol ═══ -->
      <defs>
        <symbol id="stickFigure" viewBox="0 0 20 40">
          <circle cx="10" cy="4" r="3.5" fill="none" stroke="#c9b98e" stroke-width="1.2"/>
          <line x1="10" y1="7.5" x2="10" y2="24" stroke="#c9b98e" stroke-width="1.2"/>
          <line x1="10" y1="13" x2="3"  y2="18" stroke="#c9b98e" stroke-width="1.2"/>
          <line x1="10" y1="13" x2="17" y2="18" stroke="#c9b98e" stroke-width="1.2"/>
          <line x1="10" y1="24" x2="4"  y2="34" stroke="#c9b98e" stroke-width="1.2"/>
          <line x1="10" y1="24" x2="16" y2="34" stroke="#c9b98e" stroke-width="1.2"/>
        </symbol>
      </defs>

      <!-- ═══ Monster text — bottom of scene ═══ -->
      <defs>
        <filter id="monsterGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="18" result="blur"/>
          <feFlood flood-color="#7a0a0a" flood-opacity="0.7" result="color"/>
          <feComposite in="color" in2="blur" operator="in" result="glow"/>
          <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <text
        x="800" y="2260"
        text-anchor="middle"
        font-family="UnifrakturCook, serif"
        font-size="260"
        fill="#5a0808"
        opacity="0.9"
        filter="url(#monsterGlow)"
        aria-hidden="true">Merken</text>

    </svg>

    <!-- Rose window — horned skull skylight, stained glass mural -->
    <svg class="rose" viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <clipPath id="roseClip">
          <circle cx="200" cy="200" r="196"/>
        </clipPath>
        <!-- solid silhouette — covers glass behind skull -->
        <mask id="roseFilledMask">
          <image href="/assets/skull-filled.png" x="10" y="5" width="380" height="390"
            preserveAspectRatio="xMidYMid meet"/>
        </mask>
        <!-- original with detail holes — reveals structure on top -->
        <mask id="roseMask">
          <image href="/assets/skull-horns.png" x="10" y="5" width="380" height="390"
            preserveAspectRatio="xMidYMid meet"/>
        </mask>
      </defs>

      <!-- Base fill -->
      <circle cx="200" cy="200" r="200" fill="#060000"/>

      <!-- Stained glass shards — irregular panes, each a distinct warm tone -->
      <g clip-path="url(#roseClip)" stroke="#030000" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round">
        <!-- Outer ring -->
        <polygon points="200,4 104,28 72,88 95,112 140,96 175,72 200,60"              fill="#6a0a0a"/>
        <polygon points="200,4 200,60 225,72 260,96 305,112 328,88 296,28"            fill="#5c0808"/>
        <polygon points="296,28 328,88 368,110 380,160 340,148 305,112"               fill="#7a1010"/>
        <polygon points="396,200 380,160 340,148 318,188 338,220 380,240"             fill="#8c0c0c"/>
        <polygon points="396,200 380,240 370,298 328,308 310,272 338,220"             fill="#741010"/>
        <polygon points="370,298 296,372 260,344 278,306 310,272 328,308"             fill="#601010"/>
        <polygon points="296,372 200,396 200,358 230,328 260,344"                     fill="#500808"/>
        <polygon points="200,396 104,372 140,344 170,328 200,358"                     fill="#5a0a0a"/>
        <polygon points="104,372 30,298 72,282 90,306 122,328 140,344"                fill="#6e0e0e"/>
        <polygon points="30,298 4,200 60,180 82,212 72,252 72,282"                    fill="#7e1212"/>
        <polygon points="4,200 30,102 72,122 60,180"                                  fill="#901414"/>
        <polygon points="30,102 104,28 140,96 95,112 72,122"                          fill="#a01818"/>
        <!-- Mid ring -->
        <polygon points="175,72 200,60 225,72 240,110 220,138 200,130 180,138 160,110" fill="#c83010"/>
        <polygon points="140,96 175,72 160,110 132,128 108,116 95,112"                fill="#b82a0a"/>
        <polygon points="260,96 305,112 292,116 268,128 240,110 225,72"               fill="#c02818"/>
        <polygon points="60,180 72,122 95,112 108,116 118,148 100,180 82,212"         fill="#a82010"/>
        <polygon points="340,148 318,188 300,180 282,148 292,116 305,112 340,148"     fill="#b42010"/>
        <polygon points="82,212 100,180 118,148 138,168 128,210 108,240 72,252"       fill="#941818"/>
        <polygon points="318,188 338,220 328,252 292,242 272,210 282,148 300,180"     fill="#9c1c1c"/>
        <polygon points="72,252 108,240 128,266 108,296 90,306 72,282"                fill="#841414"/>
        <polygon points="292,242 328,252 310,272 278,306 272,282 272,266"             fill="#8c1818"/>
        <polygon points="128,266 160,278 200,282 240,278 272,266 272,282 240,310 200,318 160,310 128,282" fill="#701010"/>
        <!-- Inner shards (around skull medallion) — most vivid -->
        <polygon points="180,138 200,130 220,138 228,158 200,165 172,158"             fill="#e04018"/>
        <polygon points="228,158 240,180 232,208 218,220 200,225 190,200 200,165"     fill="#d03810"/>
        <polygon points="172,158 200,165 190,200 180,222 162,210 160,180"             fill="#d83c12"/>
        <polygon points="180,222 200,225 218,220 228,242 200,255 172,242"             fill="#c03010"/>
        <polygon points="160,180 162,210 140,220 128,210 138,168"                     fill="#cc3818"/>
        <polygon points="240,180 262,168 272,210 260,218 232,208"                     fill="#c42e14"/>
        <polygon points="132,128 160,110 172,158 160,180 138,168 118,148"             fill="#d43a10"/>
        <polygon points="268,128 282,148 262,168 240,180 228,158 240,110"             fill="#cc3010"/>
      </g>

      <!-- Lead came rings -->
      <circle cx="200" cy="200" r="68"  fill="none" stroke="#020000" stroke-width="5"   clip-path="url(#roseClip)"/>
      <circle cx="200" cy="200" r="132" fill="none" stroke="#020000" stroke-width="4.5" clip-path="url(#roseClip)"/>

      <!-- Layer 1: black backing over exact skull silhouette — hides glass shards behind skull -->
      <circle cx="200" cy="200" r="200" fill="#000000" mask="url(#roseFilledMask)" clip-path="url(#roseClip)"/>
      <!-- Layer 2: dark crimson over skull body only — detail holes are transparent, revealing black from Layer 1 -->
      <circle cx="200" cy="200" r="200" fill="#2a0404" mask="url(#roseMask)" clip-path="url(#roseClip)"/>

      <!-- Outer border ring -->
      <circle cx="200" cy="200" r="196" fill="none" stroke="#180202" stroke-width="5"/>
    </svg>

    <!-- Congregation walking at floor level -->
    <div class="walkers" aria-hidden="true">
      <div class="walker w1"><svg viewBox="0 0 20 40" xmlns="http://www.w3.org/2000/svg"><use href="#stickFigure"/></svg></div>
      <div class="walker w2"><svg viewBox="0 0 20 40" xmlns="http://www.w3.org/2000/svg"><use href="#stickFigure"/></svg></div>
      <div class="walker w3"><svg viewBox="0 0 20 40" xmlns="http://www.w3.org/2000/svg"><use href="#stickFigure"/></svg></div>
      <div class="walker w4"><svg viewBox="0 0 20 40" xmlns="http://www.w3.org/2000/svg"><use href="#stickFigure"/></svg></div>
      <div class="walker w5"><svg viewBox="0 0 20 40" xmlns="http://www.w3.org/2000/svg"><use href="#stickFigure"/></svg></div>
    </div>

`;
