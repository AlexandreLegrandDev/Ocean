# THE ABYSSAL DESCENT
## Immersive Ocean Depth Journey - Technical Specification & Design Document

---

## 1. CONCEPT & VISION

**The Abyssal Descent** is a cinematic, single-page vertical scrolling experience that transforms the user into a deep-sea diver descending through Earth's oceanic zones—from sunlit shallows to crushing hadopelagic trenches. The journey is meditative yet awe-inspiring, blending scientific accuracy with artistic atmosphere. As users scroll, they physically "dive," watching light fade, pressure intensify, and alien creatures emerge from the darkness.

**Emotional Arc:** Wonder → Mystery → Isolation → Transcendence

---

## 2. VISUAL ART DIRECTION

### 2.1 Color System

#### Primary Depth Gradient
The core visual metaphor: light to absolute darkness

```
Body Background Gradient (0m → 10,000m):
- 0m - 200m (Epipelagic):     #00aeef → #0088cc  (Sunlight Zone - vibrant cyan)
- 200m - 1000m (Mesopelagic): #0088cc → #1a3a5c  (Twilight Zone - deep blue)
- 1000m - 4000m (Bathypelagic): #1a3a5c → #0d1b2a (Midnight Zone - navy black)
- 4000m - 6000m (Abyssopelagic): #0d1b2a → #050a10 (Abyssal Zone - near black)
- 6000m - 10,000m (Hadopelagic): #050a10 → #00050a (Hadal Zone - pitch black)
```

#### Zone-Specific Palettes

**Epipelagic Zone (0-200m) - The Sunlight Zone**
| Role | Hex | Usage |
|------|-----|-------|
| Primary | `#00aeef` | Background gradient top |
| Secondary | `#7dd3fc` | Light rays, caustics |
| Accent | `#fbbf24` | Sunlight highlights, surface shimmer |
| Text Light | `#ffffff` | Primary text on dark |
| Text Dark | `#0c4a6e` | Secondary text |

**Mesopelagic Zone (200-1000m) - The Twilight Zone**
| Role | Hex | Usage |
|------|-----|-------|
| Primary | `#0369a1` | Background gradient |
| Secondary | `#0c4a6e` | Bioluminescence hints |
| Accent | `#22d3ee` | Creature glow effects |
| Text Light | `#e0f2fe` | Primary text |
| Text Dark | `#083344` | Depth indicator numbers |

**Bathypelagic Zone (1000-4000m) - The Midnight Zone**
| Role | Hex | Usage |
|------|-----|-------|
| Primary | `#0c4a6e` | Background gradient |
| Secondary | `#164e63` | Subtle depth layers |
| Accent | `#14b8a6` | Bioluminescent particles |
| Text Light | `#a5f3fc` | Creature names |
| Text Dark | `#155e75` | Data readouts |

**Abyssopelagic Zone (4000-6000m) - The Abyssal Plain**
| Role | Hex | Usage |
|------|-----|-------|
| Primary | `#083344` | Background gradient |
| Secondary | `#042f2e` | Soft sediment layers |
| Accent | `#06b6d4` | Rare bioluminescence |
| Text Light | `#99f6e4` | Species labels |
| Text Dark | `#134e4a` | Technical data |

**Hadopelagic Zone (6000-10,000m) - The Hadal Trenches**
| Role | Hex | Usage |
|------|-----|-------|
| Primary | `#042f2e` | Background gradient |
| Secondary | `#020617` | Ultimate darkness |
| Accent | `#0891b2` | Pressure warning glows |
| Text Light | `#ccfbf1` | Survival data |
| Text Dark | `#042f2e` | Depth counters |

### 2.2 Typography System

#### Font Families
```
UI Typography: 'Inter', system-ui, -apple-system, sans-serif
- Weight 300: Light navigation labels
- Weight 400: Body text, descriptions
- Weight 600: Zone titles, section headers
- Weight 700: Hero text, callouts

Data Typography: 'JetBrains Mono', 'Fira Code', monospace
- Weight 400: Depth readouts, coordinates
- Weight 500: Species measurements
- Weight 600: Warning indicators
```

#### Type Scale (Modular Scale: 1.25 ratio)
```
--text-xs:    0.64rem   / 10.24px  - Micro labels, timestamps
--text-sm:    0.8rem    / 12.8px   - Captions, metadata
--text-base:  1rem      / 16px     - Body text, descriptions
--text-lg:    1.25rem   / 20px     - Lead paragraphs
--text-xl:    1.563rem  / 25px     - Section subtitles
--text-2xl:   1.953rem  / 31.25px  - Zone names
--text-3xl:   2.441rem  / 39px     - Hero subtitles
--text-4xl:   3.052rem  / 48.8px   - Hero titles
--text-5xl:   3.815rem  / 61px     - Display numbers (depth)
--text-6xl:   4.768rem  / 76.3px   - Hero display
```

#### Line Height & Spacing
```
Headings:     line-height: 1.1  / letter-spacing: -0.02em
Body:         line-height: 1.6  / letter-spacing: 0
Data/Code:    line-height: 1.4  / letter-spacing: 0.05em
```

### 2.3 Atmospheric Effects

#### Surface Light Rays (CSS-Only Caustics)
```scss
// Animated light rays using CSS pseudo-elements
.light-rays {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    width: 300%;
    height: 200%;
    background: repeating-linear-gradient(
      120deg,
      transparent 0%,
      rgba(125, 211, 252, 0.1) 5%,
      transparent 10%
    );
    animation: caustic-wave 15s ease-in-out infinite;
  }

  &::after {
    animation-delay: -7.5s;
    opacity: 0.5;
  }
}

@keyframes caustic-wave {
  0%, 100% { transform: translateX(-30%) rotate(15deg); }
  50% { transform: translateX(0%) rotate(15deg); }
}
```

#### Marine Snow Particles
```scss
// Falling particles for deep zones
.marine-snow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;

  .particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    animation: marine-fall linear infinite;

    // Vary particle sizes and speeds
    &:nth-child(1) { left: 10%; animation-duration: 20s; animation-delay: 0s; }
    &:nth-child(2) { left: 25%; animation-duration: 25s; animation-delay: -5s; width: 3px; }
    &:nth-child(3) { left: 40%; animation-duration: 18s; animation-delay: -10s; }
    // ... more particles
  }
}

@keyframes marine-fall {
  0% { transform: translateY(-10vh) translateX(0); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translateY(110vh) translateX(20px); opacity: 0; }
}
```

---

## 3. SCSS ARCHITECTURE

### 3.1 Variable System

```scss
// ============================================
// CORE VARIABLES
// ============================================

// Depth Zones (in meters)
$depth-epipelagic:      0;
$depth-mesopelagic:     200;
$depth-bathypelagic:    1000;
$depth-abyssopelagic:   4000;
$depth-hadal:           6000;
$depth-max:             10000;

// Zone Colors
$zone-colors: (
  'epipelagic': (
    primary: #00aeef,
    secondary: #7dd3fc,
    accent: #fbbf24,
    dark: #0c4a6e,
    light: #ffffff
  ),
  'mesopelagic': (
    primary: #0369a1,
    secondary: #0c4a6e,
    accent: #22d3ee,
    dark: #083344,
    light: #e0f2fe
  ),
  'bathypelagic': (
    primary: #0c4a6e,
    secondary: #164e63,
    accent: #14b8a6,
    dark: #155e75,
    light: #a5f3fc
  ),
  'abyssopelagic': (
    primary: #083344,
    secondary: #042f2e,
    accent: #06b6d4,
    dark: #134e4a,
    light: #99f6e4
  ),
  'hadal': (
    primary: #042f2e,
    secondary: #020617,
    accent: #0891b2,
    dark: #042f2e,
    light: #ccfbf1
  )
);

// Typography
$font-ui: 'Inter', system-ui, -apple-system, sans-serif;
$font-data: 'JetBrains Mono', 'Fira Code', monospace;

// Spacing Scale
$space-unit: 0.25rem;
$space-scale: (
  0: 0,
  1: $space-unit * 1,    // 4px
  2: $space-unit * 2,    // 8px
  3: $space-unit * 3,    // 12px
  4: $space-unit * 4,    // 16px
  5: $space-unit * 5,    // 20px
  6: $space-unit * 6,    // 24px
  8: $space-unit * 8,    // 32px
  10: $space-unit * 10,  // 40px
  12: $space-unit * 12, // 48px
  16: $space-unit * 16, // 64px
  20: $space-unit * 20, // 80px
  24: $space-unit * 24, // 96px
  32: $space-unit * 32  // 128px
);

// Breakpoints
$breakpoints: (
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
  '2xl': 1536px
);

// Z-Index Scale
$z-layers: (
  'base': 0,
  'content': 10,
  'floating': 100,
  'depth-indicator': 500,
  'particles': 100,
  'modal': 1000
);

// Animation Durations
$duration-fast: 150ms;
$duration-normal: 300ms;
$duration-slow: 500ms;
$duration-slower: 800ms;
$duration-slowest: 1200ms;

// Easing Curves
$ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
$ease-in-out-circ: cubic-bezier(0.85, 0, 0.15, 1);
$ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### 3.2 Mixin Library

```scss
// ============================================
// CORE MIXINS
// ============================================

// Floating Animation
@mixin floating-animation($duration: 3s, $translate: 10px) {
  animation: float $duration ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-#{$translate}); }
  }
}

// Pulse Glow
@mixin pulse-glow($color: #00aeef, $duration: 2s) {
  animation: pulse-glow $duration ease-in-out infinite;

  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 0 0 5px $color,
                  0 0 10px $color,
                  0 0 15px rgba($color, 0.3);
    }
    50% {
      box-shadow: 0 0 10px $color,
                  0 0 20px $color,
                  0 0 30px rgba($color, 0.5),
                  0 0 40px rgba($color, 0.3);
    }
  }
}

// Depth-Based Background
@mixin depth-background($start-color, $end-color, $depth-start, $depth-end) {
  background: linear-gradient(
    to bottom,
    $start-color 0%,
    $end-color 100%
  );
  transition: background $duration-slow $ease-out-expo;
}

// Responsive Grid
@mixin responsive-grid($columns: 12, $gap: 1.5rem) {
  display: grid;
  grid-template-columns: repeat($columns, 1fr);
  gap: $gap;

  @media (max-width: map-get($breakpoints, 'md')) {
    grid-template-columns: repeat(6, 1fr);
    gap: $gap * 0.75;
  }

  @media (max-width: map-get($breakpoints, 'sm')) {
    grid-template-columns: 1fr;
    gap: $gap * 0.5;
  }
}

// Glass Morphism
@mixin glass-effect($blur: 10px, $opacity: 0.1) {
  background: rgba(255, 255, 255, $opacity);
  backdrop-filter: blur($blur);
  -webkit-backdrop-filter: blur($blur);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

// Performance Optimization
@mixin performance-optimized {
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
}

// Depth Pressure Text
@mixin pressure-text {
  font-family: $font-data;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;

  &::before {
    content: '';
    display: inline-block;
    width: 0.5em;
    height: 0.5em;
    margin-right: 0.5em;
    background: currentColor;
    border-radius: 50%;
    animation: pressure-pulse 1.5s ease-in-out infinite;
  }
}

// Truncate Text
@mixin truncate($lines: 1) {
  @if $lines == 1 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

### 3.3 Zone Transition System

```scss
// ============================================
// ZONE TRANSITION ENGINE
// ============================================

$current-depth: 0;

@function get-zone-color($depth, $property: 'primary') {
  @if $depth < 200 {
    @return map-get(map-get($zone-colors, 'epipelagic'), $property);
  } @else if $depth < 1000 {
    @return map-get(map-get($zone-colors, 'mesopelagic'), $property);
  } @else if $depth < 4000 {
    @return map-get(map-get($zone-colors, 'bathypelagic'), $property);
  } @else if $depth < 6000 {
    @return map-get(map-get($zone-colors, 'abyssopelagic'), $property);
  } @else {
    @return map-get(map-get($zone-colors, 'hadal'), $property);
  }
}

@mixin zone-transition($property: 'all') {
  transition: $property $duration-slow $ease-out-expo;
}

// Depth-aware component styles
.depth-component {
  color: get-zone-color($current-depth, 'light');
  background: get-zone-color($current-depth, 'primary');
  border-color: get-zone-color($current-depth, 'secondary');

  &:hover {
    background: get-zone-color($current-depth, 'secondary');
  }
}
```

---

## 4. LAYOUT & STRUCTURE

### 4.1 Page Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ FIXED ELEMENTS                                               │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────┐                               ┌───────────────┐ │
│ │  LOGO   │                               │ DEPTH RULER   │ │
│ └─────────┘                               │ 10,000m       │ │
│                                           │ 9,000m        │ │
│ ┌─────────────────────────────────────┐   │ ...           │ │
│ │         BIOLUMINESCENT LINE         │   │ 100m          │ │
│ └─────────────────────────────────────┘   │ 0m            │ │
│                                           └───────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ SCROLLABLE CONTENT (5 zones × ~200vh each)                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ═══════════════════════════════════════════════════════    │
│  SECTION: EPIPELAGIC ZONE                                   │
│  "The Sunlight Zone"                                        │
│  ═══════════════════════════════════════════════════════    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                     │     │
│  │  SPECIES CARD (appears on scroll)                   │     │
│  │  ┌───────┐  Common Name                            │     │
│  │  │ IMG   │  Scientific Name                        │     │
│  │  │       │  Depth Range                             │     │
│  │  └───────┘  Description                             │     │
│  │                                                     │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                              │
│  ... (continues through all zones)                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Section Specifications

#### Zone Sections
| Zone | Height | Depth Range | Primary Content |
|------|--------|-------------|-----------------|
| Epipelagic | 250vh | 0-200m | Introduction, surface effects, tropical fish |
| Mesopelagic | 200vh | 200-1000m | Lanternfish, squids, transition to darkness |
| Bathypelagic | 250vh | 1000-4000m | Giant squid, vampire squid, bioluminescence |
| Abyssopelagic | 200vh | 4000-6000m | Anglerfish, sea pigs, soft-bodied creatures |
| Hadal | 250vh | 6000-10000m | Snailfish, amphipods, extremophiles |

---

## 5. UX & INTERACTION DESIGN

### 5.1 Hero Sequence (GSAP-Powered)

```
Timeline:
0.0s - Page Load
       └── Black screen, subtle "INITIALIZING DIVE SYSTEMS" text

0.5s - Logo fade in (opacity 0→1, y: 20→0)
       └── Depth: 0m appears in corner

1.5s - Surface water effect begins
       └── Light rays animate in from top
       └── "ABYSSAL DESCENT" title slides up (y: 100→0)

2.5s - Submersible icon drops from top
       └── Bouncy landing animation
       └── "SCROLL TO DIVE" prompt pulses

3.5s - Scroll hint arrow bounces
       └── Waiting for user scroll input

User scrolls → Hero sequence completes
       └── Title fades out (y: 0→-50, opacity 1→0)
       └── Journey begins
```

### 5.2 Depth Indicator System

**Visual Design:**
- Fixed vertical ruler on right side (20% from right edge)
- Width: 60px
- Background: Semi-transparent dark with glass effect
- Current depth: Large glowing number in center
- Tick marks: Every 100m with labels at 1000m intervals
- Active zone indicator: Colored bar showing current zone
- Pressure reading: Below depth number in data font

**Behavior:**
- Updates in real-time as user scrolls
- Smooth number transition (counting animation)
- Zone color changes based on current depth
- Subtle pulse when entering new zone

**Code Structure:**
```javascript
const depthIndicator = {
  element: document.querySelector('.depth-ruler'),
  currentDepth: 0,
  targetDepth: 0,

  update(scrollY) {
    // Convert scroll position to depth (0-10000m)
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    this.targetDepth = Math.round((scrollY / maxScroll) * 10000);

    // Animate depth number
    gsap.to(this, {
      currentDepth: this.targetDepth,
      duration: 0.3,
      ease: 'power2.out',
      onUpdate: () => this.renderDepth()
    });

    // Update zone indicator
    this.updateZoneIndicator();
  },

  renderDepth() {
    this.element.querySelector('.depth-number').textContent =
      this.formatDepth(this.currentDepth);
  }
};
```

### 5.3 Species Discovery Animation

**Parallax Stagger Pattern:**
```
Trigger: When section enters 30% of viewport

Animation Sequence:
1. Background creatures (z-index: 1): Fade in + slight parallax
   └── Duration: 800ms, Delay: 0ms

2. Mid-ground elements (z-index: 5): Slide from sides
   └── Left side: x: -100 → 0, opacity: 0 → 1
   └── Right side: x: 100 → 0, opacity: 0 → 1
   └── Duration: 600ms, Delay: 200ms

3. Species card (z-index: 10): Scale + fade entrance
   └── Scale: 0.8 → 1, opacity: 0 → 1
   └── Duration: 500ms, Delay: 400ms

4. Information text (z-index: 10): Staggered reveal
   └── Each line: y: 20 → 0, opacity: 0 → 1
   └── Duration: 400ms, Stagger: 100ms per element
```

**GSAP ScrollTrigger Configuration:**
```javascript
gsap.registerPlugin(ScrollTrigger);

// Species card animation
gsap.from('.species-card', {
  scrollTrigger: {
    trigger: '.species-section',
    start: 'top 70%',
    end: 'top 30%',
    scrub: 1,
    toggleActions: 'play none none reverse'
  },
  x: 100,
  opacity: 0,
  scale: 0.9,
  duration: 0.8,
  ease: 'power2.out'
});

// Parallax creature layers
gsap.utils.toArray('.creature-layer').forEach((layer, i) => {
  gsap.to(layer, {
    scrollTrigger: {
      trigger: '.species-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    },
    y: (i + 1) * -50, // Each layer moves at different speed
    ease: 'none'
  });
});
```

### 5.4 Scroll-Triggered Zone Transitions

**Background Color Morphing:**
```javascript
// As user scrolls, background gradient shifts through zone colors
ScrollTrigger.create({
  trigger: '.zone-section',
  start: 'top center',
  end: 'bottom center',
  onEnter: () => transitionToZone('mesopelagic'),
  onEnterBack: () => transitionToZone('epipelagic'),
  onLeave: () => startMarineSnow(),
  onLeaveBack: () => stopMarineSnow()
});

function transitionToZone(zoneName) {
  gsap.to('body', {
    background: `var(--zone-${zoneName}-gradient)`,
    duration: 1,
    ease: 'power2.inOut'
  });

  // Update depth indicator color
  gsap.to('.depth-number', {
    color: `var(--zone-${zoneName}-light)`,
    duration: 0.5
  });
}
```

---

## 6. COMPONENT INVENTORY

### 6.1 Navigation Header
| State | Background | Logo | Depth Display |
|-------|------------|------|---------------|
| Default | transparent | white | hidden |
| Scrolled | rgba(0,0,0,0.5) | white | visible |
| Zone Change | zone-colored | zone-colored | zone-colored |

### 6.2 Depth Ruler
| State | Opacity | Glow | Content |
|-------|---------|------|---------|
| Surface | 0.3 | subtle | 0m |
| Diving | 1.0 | active | dynamic |
| Deep | 1.0 | intense | 10000m |

### 6.3 Species Card
| State | Transform | Opacity | Shadow |
|-------|-----------|---------|--------|
| Hidden | scale(0.9) translateX(100px) | 0 | none |
| Revealed | scale(1) translateX(0) | 1 | large glow |
| Hover | scale(1.02) | 1 | enhanced glow |
| Active | scale(0.98) | 1 | pressed |

### 6.4 Zone Title
| State | Transform | Letter Spacing | Animation |
|-------|-----------|----------------|-----------|
| Pre-scroll | translateY(100px) | 0.3em | slide-up |
| Visible | translateY(0) | 0.1em | settle |
| Deep zone | translateY(0) | 0.1em | subtle pulse |

### 6.5 Dive Prompt
| State | Opacity | Scale | Animation |
|-------|---------|-------|-----------|
| Waiting | 1.0 | 1.0 | bounce |
| Scrolling | 0.0 | 0.8 | fade-out |
| Complete | hidden | - | - |

---

## 7. TECHNICAL SPECIFICATIONS

### 7.1 Performance Requirements
| Metric | Target | Implementation |
|--------|--------|----------------|
| FPS | 60fps | will-change, transform-only animations |
| First Paint | <1.5s | Critical CSS, lazy load images |
| Scroll Response | <16ms | requestAnimationFrame, GSAP |
| Bundle Size | <150KB | Vanilla JS, no frameworks |

### 7.2 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 7.3 Accessibility
- Reduced motion support via `prefers-reduced-motion`
- High contrast mode compatibility
- Keyboard navigation for depth indicator
- Screen reader announcements for zone changes

---

## 8. SPECIES DATABASE

### Epipelagic Zone (0-200m)
1. **Clownfish** - Amphiprioninae
2. **Blue Tang** - Paracanthurus hepatus
3. **Hammerhead Shark** - Sphyrnidae
4. **Sea Turtle** - Cheloniidae
5. **Manta Ray** - Mobula

### Mesopelagic Zone (200-1000m)
1. **Lanternfish** - Myctophidae
2. **Glass Squid** - Cranchiidae
3. **Hatchetfish** - Sternoptychidae
4. **Dragonfish** - Stomiidae
5. **Viperfish** - Chauliodus

### Bathypelagic Zone (1000-4000m)
1. **Giant Squid** - Architeuthis dux
2. **Vampire Squid** - Vampyroteuthis infernalis
3. **Anglerfish** - Lophiiformes
4. **Black Dragonfish** - Idiacanthus fasciola
5. **Dumbo Octopus** - Grimpoteuthis

### Abyssopelagic Zone (4000-6000m)
1. **Blobfish** - Psychrolutes marcidus
2. **Sea Pig** - Scotoplanes
3. **Cookiecutter Shark** - Isistius brasiliensis
4. **Deep Sea Jellyfish** - Narcomedusae
5. **Barrel Eye Fish** - Macropinna microstoma

### Hadal Zone (6000-10000m)
1. **Mariana Snailfish** - Pseudoliparis swirei
2. **Hadal Amphipod** - Hirondellea gigas
3. **Xenophyophore** - Syringammina fragilissima
4. **Holothurian** - sea cucumber
5. **Unknown Extremophiles** - unclassified

---

## 9. VISUAL MOCKUP - SECTION BY SECTION

### Section 1: Hero / Surface Entry
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                      ☀️ SURFACE LIGHT                            │
│                    ╱            ╲                                │
│                  ╱                ╲                              │
│                ╱    CAUSTIC       ╲                             │
│              ╱      WAVES           ╲                            │
│            ╱                        ╲                           │
│          ╱                            ╲                         │
│        ╱                                ╲                       │
│                                                                  │
│                    ┌─────────────────┐                          │
│                    │  🛱 SUBMERSIBLE  │                          │
│                    │    ═══════       │                          │
│                    └─────────────────┘                          │
│                                                                  │
│                   THE ABYSSAL DESCENT                           │
│                   ─────────────────                             │
│                   Scroll to Begin Your Dive                      │
│                       ↓ ↓ ↓                                      │
│                                                                  │
│  0m  ┌─────────┐                                   ┌───────────┐ │
│      │ DIVE    │                                   │  DEPTH    │ │
│      │ SYSTEMS │                                   │  0m       │ │
│      │ ONLINE  │                                   │           │ │
│      └─────────┘                                   │  ════     │ │
│                                                     │    ═      │ │
│                                                     │    ═      │ │
│                                                     │  ════     │ │
│                                                     └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Section 2: Epipelagic Zone
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  EPIPELAGIC ZONE                                                │
│  ═══════════════                                                │
│  "The Sunlight Zone"                                            │
│                                                                  │
│  Depth: 0-200 meters                                            │
│  Temperature: 20°C to 26°C                                       │
│  Pressure: 1-20 atm                                             │
│                                                                  │
│  ┌───────────────┐    ┌──────────────────────────────────┐    │
│  │               │    │                                  │    │
│  │   🐠🐠🐠      │    │  SPECIES SPOTTED                  │    │
│  │  Clownfish    │    │  ────────────────                │    │
│  │               │    │  • Schools of tropical fish      │    │
│  │               │    │  • Coral reef formations         │    │
│  │               │    │  • Sunlight penetrates fully     │    │
│  │               │    │                                  │    │
│  └───────────────┘    │  DEPTH DATA                      │    │
│                       │  Current: 47m                     │    │
│                       │  Visibility: 30m                 │    │
│                       └──────────────────────────────────┘    │
│                                                                  │
│  200m ┌─────────┐                                              │
│       │ TRANSITION│                                             │
│       │  ZONE     │                                             │
│       └─────────┘                                              │
│                                                     ┌───────────┐ │
│                                                     │  DEPTH    │ │
│                                                     │  200m     │ │
│                                                     │           │ │
│                                                     │  ═══      │ │
│                                                     └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Section 3: Mesopelagic Zone
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░ TWILIGHT ZONE ░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                                  │
│  MESOPELAGIC ZONE                                               │
│  ───────────────                                               │
│  Depth: 200-1,000 meters                                        │
│  Temperature: 4°C to 12°C                                       │
│  Light: Dim blue twilight                                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     ◯ ◯ ◯ ◯ ◯                            │   │
│  │                    ◯        ◯                             │   │
│  │        ✨        ◯  LANTERNFISH  ◯        ✨              │   │
│  │       ✨  ✨    ◯    Myctophidae   ◯    ✨  ✨            │   │
│  │              ◯        ◯ ◯ ◯        ◯                   │   │
│  │                     ◯ ◯ ◯ ◯ ◯                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  "Bioluminescent signals flash in the darkness..."              │
│                                                                  │
│  ┌────────────────┐  ┌────────────────────────────────────┐     │
│  │ BIOLUMINESCENCE│  │ SPECIES DATA                        │     │
│  │ ████████░░ 65% │  │ Lanternfish                         │     │
│  │                │  │ • Size: 5-15cm                      │     │
│  │ Species: 650+  │  │ • Diet: Zooplankton                 │     │
│  │                │  │ • Special: Light organs            │     │
│  └────────────────┘  └────────────────────────────────────┘     │
│                                                                  │
│                                                     ┌───────────┐ │
│                                                     │  DEPTH    │ │
│                                                     │  650m     │ │
│                                                     │           │ │
│                                                     │  ═══      │ │
│                                                     │    ═      │ │
│                                                     │  ═══      │ │
│                                                     └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Section 4: Bathypelagic Zone
```
┌─────────────────────────────────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ MIDNIGHT ZONE ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  ████████████████████████████████████████████████████████████  │
│                                                                  │
│                    ✨                    ✨                     │
│         ✨                                    ✨                │
│              ░░░░░░░░░░░░░░░░░░░░░░░                         │
│           ░░                    ░░░░░                         │
│          ░░   🦑 GIANT SQUID     ░░░░                         │
│          ░░   Architeuthis       ░░░░                         │
│          ░░   ══════════════    ░░░░                         │
│           ░░░░░░░░░░░░░░░░░░░░░░░░░                         │
│                                                                  │
│  BATHYPELAGIC ZONE                                              │
│  ─────────────────                                              │
│  Depth: 1,000-4,000 meters                                     │
│  Temperature: 2°C to 4°C                                       │
│  Pressure: 100-400 atm                                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    ┌─────────────────┐                  │   │
│  │                    │  🦑 GIANT SQUID │                  │   │
│  │                    │  Architeuthis   │                  │   │
│  │                    │                 │                  │   │
│  │                    │  Length: 13m    │                  │   │
│  │                    │  Eyes: 27cm     │                  │   │
│  │                    │  Depth: 900m    │                  │   │
│  │                    └─────────────────┘                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  "The giant squid's dinner-plate eyes                           │
│   scan the absolute darkness..."                                │
│                                                     ┌───────────┐ │
│                                                     │  DEPTH    │ │
│                                                     │  2,400m   │ │
│                                                     │           │ │
│                                                     │  ═══      │ │
│                                                     │    ═      │ │
│                                                     │  ═══      │ │
│                                                     └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Section 5: Abyssopelagic Zone
```
┌─────────────────────────────────────────────────────────────────┐
│  ████████████████████████████████████████████████████████████  │
│  ████████████████████████████████████████████████████████████  │
│  ████                    ABYSSAL PLAIN                    ███  │
│  ████████████████████████████████████████████████████████████  │
│                                                                  │
│                                                                  │
│                       ·  ·  ·  ·  ·  ·                          │
│                     ·              ·                             │
│              ·  ·       🌊 SEA PIG      ·  ·                     │
│                    Scotoplanes          ·                       │
│               ·    ·      ·      ·      ·                        │
│                     ·  ·  ·  ·  ·                              │
│                                                                  │
│  ABYSSOPELAGIC ZONE                                             │
│  ──────────────────                                             │
│  Depth: 4,000-6,000 meters                                      │
│  Temperature: 0°C to 2°C                                       │
│  Pressure: 400-600 atm                                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │     ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○              │   │
│  │    ○                                              ○      │   │
│  │   ○         DEEP SEA CREATURES                          │   │
│  │   ○         ─────────────────                           │   │
│  │   ○         • Sea pigs (detritivores)                   │   │
│  │   ○         • Anglerfish (lures prey)                   │   │
│  │   ○         • Soft-bodied organisms                      │   │
│  │    ○                                              ○      │   │
│  │     ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○              │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  "The seafloor stretches endlessly,                             │
│   dotted with slow-moving sea pigs..."                         │
│                                                     ┌───────────┐ │
│                                                     │  DEPTH    │ │
│                                                     │  5,200m   │ │
│                                                     │           │ │
│                                                     │  ═══      │ │
│                                                     │    ═      │ │
│                                                     │  ═══      │ │
│                                                     └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Section 6: Hadal Zone
```
┌─────────────────────────────────────────────────────────────────┐
│  ████████████████████████████████████████████████████████████  │
│  ████████████████████████████████████████████████████████████  │
│  ████████              HADAL TRENCHES              ████████  │
│  ████████████████████████████████████████████████████████████  │
│                                                                  │
│                    ⚠️ PRESSURE WARNING ⚠️                       │
│                    ⚠️ 600+ ATMOSPHERES ⚠️                       │
│                                                                  │
│                                                                  │
│                                                                  │
│                           ░░░░░░░░░░                            │
│                         ░░░░░░░░░░░░░░░                          │
│                        ░░░░░   🐟 SNAILFISH   ░░░               │
│                        ░░░░     Pseudoliparis ░░░               │
│                         ░░░░░░░░░░░░░░░░                        │
│                           ░░░░░░░░░░                            │
│                                                                  │
│  HADAL ZONE                                                     │
│  ─────────                                                     │
│  Depth: 6,000-10,994 meters (Mariana Trench)                    │
│  Temperature: -1°C to 2°C                                       │
│  Pressure: 600-1,100 atm                                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │   │
│  │  ▓                                              ▓        │   │
│  │  ▓    MARIANA SNAILFISH                        ▓        │   │
│  │  ▓    ─────────────────                       ▓        │   │
│  │  ▓    Discovered: 2017                        ▓        │   │
│  │  ▓    Depth: 8,178 meters                     ▓        │   │
│  │  ▓    Status: Living at record depth         ▓        │   │
│  │  ▓                                              ▓        │   │
│  │  ▓    ⚠️ EXTREME CONDITIONS                    ▓        │   │
│  │  ▓    Temperature: 1°C                        ▓        │   │
│  │  ▓    Pressure: 800+ atmospheres              ▓        │   │
│  │  ▓                                              ▓        │   │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  "Life persists in the most extreme conditions..."              │
│                                                     ┌───────────┐ │
│                                                     │  DEPTH    │ │
│                                                     │  8,178m   │ │
│                                                     │           │ │
│                                                     │  ═══      │ │
│                                                     │    ═      │ │
│                                                     │  ═══      │ │
│                                                     └───────────┘ │
│                                                                  │
│  ═══════════════════════════════════════════════════════════   │
│  DESCENT COMPLETE                                              │
│  Total Distance: 10,994 meters                                  │
│  Congratulations, you reached the deepest point on Earth.      │
│  ═══════════════════════════════════════════════════════════   │
│                                                     ┌───────────┐ │
│                                                     │  DEPTH    │ │
│                                                     │  10,994m  │ │
│                                                     │           │ │
│                                                     │  MARIANA  │ │
│                                                     │  TRENCH   │ │
│                                                     └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. ANIMATION SPECIFICATIONS

### 10.1 Scroll Timeline
```
Total Scroll Distance: 10,000px = 10,000m

Zone Breakdown:
┌──────────────┬────────────┬────────────┬────────────┐
│ Zone         │ Start (m)  │ End (m)    │ Scroll %   │
├──────────────┼────────────┼────────────┼────────────┤
│ Epipelagic   │ 0          │ 200        │ 0-2%       │
│ Mesopelagic  │ 200        │ 1,000      │ 2-10%      │
│ Bathypelagic │ 1,000      │ 4,000      │ 10-40%     │
│ Abyssopelagic│ 4,000      │ 6,000      │ 40-60%     │
│ Hadal        │ 6,000      │ 10,000     │ 60-100%    │
└──────────────┴────────────┴────────────┴────────────┘
```

### 10.2 Animation Timing Chart
```
┌─────────────────────────────────────────────────────────────────┐
│ SCROLL POSITION     │ ANIMATION TRIGGER          │ DURATION   │
├─────────────────────┼────────────────────────────┼────────────┤
│ 0%                  │ Hero sequence complete     │ -          │
│ 5%                  │ First species appear       │ 600ms      │
│ 15%                 │ Light rays fade out        │ 800ms      │
│ 20%                 │ Marine snow begins         │ 500ms      │
│ 30%                 │ Mid-zone creatures         │ 400ms      │
│ 50%                 │ Bioluminescence peak       │ 600ms      │
│ 75%                 │ Pressure warnings appear   │ 300ms      │
│ 95%                 │ Descent complete overlay   │ 1000ms     │
└─────────────────────┴────────────────────────────┴────────────┘
```

---

## 11. FILE STRUCTURE

```
abyssal-descent/
├── index.html              # Main HTML5 structure
├── scss/
│   ├── main.scss            # Main SCSS entry point
│   ├── _variables.scss      # Variable definitions
│   ├── _mixins.scss         # Mixin library
│   ├── _animations.scss     # Keyframe animations
│   ├── _components.scss     # UI components
│   └── _zones.scss          # Zone-specific styles
├── js/
│   ├── main.js              # Main JavaScript entry
│   ├── gsap-timeline.js     # GSAP animations
│   ├── scroll-manager.js    # Scroll handling
│   └── depth-calculator.js  # Depth math utilities
├── assets/
│   ├── images/              # Species images
│   ├── fonts/               # Local fonts (if needed)
│   └── icons/               # SVG icons
└── dist/                    # Production build
```

---

*Document Version: 1.0*
*Last Updated: March 2026*
*Author: Senior Creative Developer & UI/UX Designer*
