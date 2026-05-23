# Live Resume — 3D Website Research

## Reference Site Analysis

---

## 1. igloo.inc (PRIMARY REFERENCE — Awwwards Site of the Year 2024)

### Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | **Svelte** (thin shell — only loader + mount point) |
| 3D Engine | **Three.js** (r165+, code-split into `App3D` bundle) |
| Animation | **GSAP** + custom RAF loops + CSS keyframe injection |
| Build | **Vite** (modulepreload, dynamic imports) |
| 3D Authoring | **Houdini** (VDB volumes, procedural geometry) + **Blender** |
| Spatial Queries | **three-mesh-bvh** (BVH acceleration for raycasting) |
| Font | **IBM Plex Mono** (loaded as JSON for 3D text geometry) |
| Text Rendering | **MSDF** (signed distance field) via web workers |
| Textures | **KTX2/Basis** (GPU-compressed, WASM transcoder) |
| 3D Models | **Draco** (WASM decoder, `.drc` files) |
| HDR | **EXR** (via web workers) |

### Architecture — The Key Insight
**The entire UI is rendered inside WebGL.** The DOM has only 44 elements — just the Svelte shell. Text, navigation, links, everything visual lives inside the Three.js canvas. This is what makes it feel so seamless.

- Canvas created programmatically by JS (not in HTML)
- Three.js instance scoped inside module (no window globals)
- `body overflow: hidden` — no DOM scrolling at all
- `touch-action: none` — all input goes to 3D scene
- Scroll input → normalized progress value → camera/scene transforms

### 3D Assets Loaded (Draco compressed)
```
mountain.drc, ground.drc, igloo_cage.drc, igloo_outline.drc,
igloo.drc, patch.drc, intro_particles.drc, blurrytext.drc,
background_shapes.drc, shattered_ring2.drc, floor.drc,
blurrytext_cylinder.drc, smoke_trail.drc, shattered_ring_smoke.drc,
ceilingsmoke.drc, overpass_logo.drc, pudgy.drc, abstractlogo.drc
```

### Textures (KTX2/Basis compressed)
```
scroll-datatexture, frost-datatexture, logo-datatexture,
IBMPlexMono-Medium-datatexture, sound-datatexture, close-datatexture,
arrow-datatexture, wind_noise, perlin-datatexture, triangles_tiling,
dot_pattern, clouds_noise, peachesbody_64, bokeh, igloo_scene,
cube_scene, visit-datatexture
```

### Key Techniques
1. **SDF Text Rendering** — Glyphs stored as distance fields in texture atlas. Shader samples for crisp text at any scale. "Scramble" effect = animating UV offset to different glyphs (zero DOM cost)
2. **Procedural Ice Crystals** — Custom algorithm simulating crystal growth inside containers. Authored in Houdini, each one unique
3. **VDB-to-Browser Pipeline** — Custom exporter converts Houdini VDB volumes to compressed browser format "smaller than a typical website image"
4. **Interactive Particle System** (footer) — Particles coalesce into different 3D shapes on hover. Color shifts by velocity. Driven by compressed volume data
5. **Post-Processing** — Chromatic aberration, frost dissolves, tech displacement via WebGLRenderTarget multi-pass
6. **ASCII Art Loader** — CSS keyframe intro while heavy 3D module loads async

### Loading Strategy
1. **Stage 1**: Tiny Svelte loader (~14KB) shows ASCII intro animation
2. **Stage 2**: Heavy App3D bundle loads async via dynamic import
3. Shaders compile during intro sequence
4. Vite modulepreload for intelligent chunking

### Mobile
- Awwwards responsive score: 8.40/10
- Three.js renderer adapts via devicePixelRatio + canvas resize
- Same WebGL pipeline for mobile and desktop
- Touch events via custom scroll system

---

## 2. messenger.abeto.co (Built by SAME STUDIO as igloo.inc — Abeto)

### Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | **Svelte** (thin shell — loader only) |
| 3D Engine | **Three.js** (r180) with fully custom shaders |
| Optimization | **three-mesh-bvh** (collision detection on spherical terrain) |
| Animation | **GSAP** for UI timing |
| Build | **Vite** |
| 3D Authoring | **Houdini + Blender** |
| Textures | **Substance** |
| Text Rendering | **C++ → WebAssembly** glyph geometry (custom, not MSDF) |
| Multiplayer | **WebSocket** on Node.js |

### Architecture
This is actually a **full multiplayer 3D game** running in the browser, not a traditional website. The Svelte layer is identical to igloo.inc — just a thin bootstrap shell.

### Key Techniques
1. **Spherical World ("Unwrapped Cube")** — World modeled as 6 flat cube faces, folded into sphere at runtime. Mario Galaxy-style tiny planet
2. **Cel-Shading / Toon Rendering** — Fully custom ShaderMaterial (not MeshToonMaterial). Jet Set Radio-inspired hand-drawn look
3. **16x16 Color Atlas** — Single tiny texture contains EVERY color in the game. One pixel change shifts the entire world's mood. Brilliant for unified art direction
4. **Custom Outline System** — Pixel-level outline control per object type. Creates "imperfect hand-drawn" aesthetic
5. **Water/Beach Shader** — Dynamic shoreline ripples, depth gradients, wet clothing that gradually dries
6. **Custom 4-Tier LOD System** — Preserves visual shape during transitions. Cel-shading masks LOD pop-in
7. **WebAssembly Text** — C++ compiled to WASM generates glyph geometry. GPU renders text as 3D geometry = "incredibly sharp even at weird angles"
8. **3D Emoji Communication** — No text chat. Emojis render as 3D objects in the world

### Performance
- Initial load: **5.7 MB** for a full 3D multiplayer game
- Total asset cap: **17.5 MB**
- Aggressive memory management for Safari iOS (~1-1.5 GB limit)
- "Drip-feed" character loading: queues model updates to prevent frame drops
- Every asset tracked and freed when no longer visible

### Mobile
- Single-finger touch controls
- Same WebGL pipeline (no separate mobile version)
- Extreme memory optimization for iOS Safari

---

## 3. itsoffbrand.com (OFF+BRAND Creative Studio — Awwwards SOTY 2025 for Lando Norris)

### Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | **Webflow** (Enterprise Partner — they built webflow.com itself) |
| Animation Engine | **GSAP 3.13** (Club license) + ScrollTrigger + MorphSVG + DrawSVG + Flip + CustomEase |
| Smooth Scroll | **Lenis** (custom `Scroll` subclass) |
| Page Transitions | **@unseenco/taxi** (AJAX-powered, like Barba.js) |
| Text Splitting | **SplitType** |
| Touch Slider | **Swiper 11.2.10** |
| 3D Element | **Custom WebGL orb** (Three.js r156, bundled in `offbrand-orb.iife.js`, 458KB) |
| Video | **14 autoplay looping MP4s** from CDN |
| Build | Single 843KB JS bundle includes GSAP + all plugins + Taxi + Lenis + SplitType + Swiper + custom code |

### Architecture
A **traditional Webflow site heavily enhanced with custom JS** — GSAP-driven animations, Lenis smooth scroll, AJAX page transitions, and a single WebGL orb component.

### The Orb — 3-Pass GPU Simulation (Not Just a Shader)
The orb is a **wave equation simulation** using framebuffer objects (FBOs):

**Pass 1 — Interaction (256x256 FBO):**
Captures mouse interaction + adds procedural simplex noise. Mouse hover pushes surface out, mouseDown pushes in. An autonomous `setInterval` every 200ms places random pulse points — this makes the orb "breathe" even without interaction.

**Pass 2 — Wave Simulation (128x128 FBO):**
Classic wave equation: averages 4 neighbors, applies velocity with 0.995 damping. Stored in R (height) and G (velocity) channels. The slow damping creates liquid, organic ripple propagation.

**Pass 3 — Rendering:**
- Vertex shader: displaces sphere vertices along normals using simulation heightmap
- Fragment shader: **rotating matcap textures** + Lambert diffusion + Phong specular (shininess=8) + overlay blending
- **Two matcap textures** crossfade for dark/light mode transitions (easeInOutQuad, 0.3s)
- Normal reconstruction from heightmap via tangent/bitangent cross product
- Geometry: half-sphere, 100 segments
- Camera: perspective FOV 60, z=2.4

### Per-Page Orb Choreography
Each page has unique orb positioning via `orbChange(xPos, yPos, scale, ...)`. On the home page, GSAP ScrollTrigger drives the orb along a choreographed path as you scroll.

Decorative outline rings around the orb are CSS elements (not WebGL) animated via GSAP — rotation speed scales with scroll velocity.

### Page Transition System
**@unseenco/taxi** intercepts links → slide-in wipe block (GSAP 0.5s) → SVG path animation → scroll to top → reconfigure all animations → slide-out wipe → reinit Webflow forms + Turnstile widgets.

### Text Animation System
SplitType splits text into chars/words/lines → characters animate from `y: "-101%"` with `power4.inOut` easing and random stagger (`each: 0.03, from: "random"`).

### Mobile
- `matchMedia("(max-width: 991px)")` for tablet/mobile detection
- Orb: `position: absolute` (not fixed), grows to `150vw` (not `80vh`)
- **Disabled on mobile:** orb scroll path, hero parallax, logo reveal, grid animation, SVG morphs, showreel tooltip
- Text animations simplified to `autoAlpha` + `y` transforms

### Takeaway
This demonstrates how to build an **award-winning hybrid** — Webflow for layout + GSAP for animation + one custom WebGL element for the hero. The orb is a contained, reusable component with a sophisticated simulation under the hood. Video does the heavy lifting for portfolio richness.

---

## 4. web.meetcleo.com (Cleo — Awwwards Honorable Mention, built by OddCommon)

### Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | **Next.js 16.2.6** (App Router + Turbopack + React 19) |
| 3D | **Three.js r181** (custom, NOT Spline — by Robert Borghesi) |
| Animation | **Framer Motion** (`window.MotionIsMounted`) + custom CSS keyframes |
| Styling | **SCSS Modules** (31 component modules, hashed class names) |
| Typography | **PP Neue Montreal** (Pangram Pangram) at weight 300/400/450 + **Simplon Mono** |
| Hosting | **Vercel** with Turbopack |
| Error Monitoring | **Sentry** |

### The 3D Phone Hero
- Single `<canvas>` at 3840x1710 (2x retina)
- CSS `position: sticky` pins the canvas while scrolling through 2138px section (2.5x scroll multiplier)
- Scroll drives camera transitions: clouds parting → sunlit landscape → 3D iPhone model
- App UI composited onto the phone screen
- No GSAP, no Lenis — uses native scroll position via `requestAnimationFrame` or Framer Motion `useScroll`

### Animation System (Surprisingly Simple)
- **Framer Motion** for scroll-triggered reveals (28 elements with inline transforms)
- **8 custom CSS keyframe animations:** spin, fade-in reveal, blur-to-sharp reveal, gradient text sweep, word-by-word fade, word-by-word deblur, loading spinner, pulse
- **`reveal-module`** (15 instances) — IntersectionObserver-triggered fade+blur-in
- **`split-text-word-module`** (5 instances) — Word-by-word animation

### Color System — Radically Restrained
Only warm browns and creams. Photography does ALL the heavy lifting for color.
- Deep brown: `#291210` (darkest text)
- Brown: `#47201C` (primary text, borders)
- Warm taupe: `#AC9B98` (muted elements)
- Cream: `#F8F6F2` (section backgrounds)
- Warm beige: `#F3E9E3` (alternate section bg)
- Extensive `rgba()` opacity layers for depth

### Typography — Editorial, Not Corporate
**PP Neue Montreal at weight 300** for headings = elegant, editorial feel. Not the typical bold heading approach. Weight 450 for buttons/nav/labels.

### Glassmorphism Nav
Fixed header: `backdrop-filter: blur(6px)`, pill-shaped container, `border-radius: 28px`, background: `rgba(41, 18, 16, 0.1)`.

### Page Flow (17 sections)
phone → header → highlight → immersive → header → highlight → features (x2) → reviews (33 cards, horizontal carousel) → highlight → skew (tilted image grid) → header → side ("How Cleo Works", 14 steps) → content → faq → qr → footnotes

### Takeaway
The personality comes from **content, not code**. Sassy copy, warm photography, light-weight typography, and restrained color. The 3D is ONE strategic moment (phone hero), not a full-page takeover. The animation stack is deliberately simple — Framer Motion + CSS keyframes. Proves that **editorial design + one premium 3D element** can win awards.

---

## Comparative Analysis

### Approach Spectrum
```
Full WebGL UI ←————————————————————→ Traditional + 3D accent
  igloo.inc      abeto messenger      offbrand.com      cleo.com
  (everything    (game in             (Webflow +        (React +
   in canvas)     browser)             WebGL orb)        1 canvas)
```

### For Live Resume: Recommended Approach

Given your goals (interactive 3D resume, mobile-first, two modes), the sweet spot is between **igloo.inc** and **offbrand**:

1. **Full-page 3D scene** (like igloo) but with **HTML overlay panels** for content readability and accessibility
2. **Svelte or Next.js thin shell** with **Three.js (R3F)** for the 3D layer
3. **Mode switching** changes the 3D scene atmosphere + content panels simultaneously
4. **Custom scroll handler** maps scroll to 3D camera/scene progress
5. **Mobile-first**: touch controls, performance budgets, device-adaptive quality

### Key Techniques to Adopt
| From | Technique | Why |
|------|-----------|-----|
| igloo.inc | Svelte/Next thin shell + full WebGL scene | Seamless immersive feel |
| igloo.inc | Code-split 3D bundle + loader animation | Fast perceived load |
| igloo.inc | SDF text in 3D | Crisp text at any angle/scale |
| igloo.inc | Post-processing (bloom, chromatic aberration) | Polish |
| igloo.inc | KTX2/Draco compression | Small assets |
| abeto | 16x16 color atlas for mode switching | Change entire mood with one texture swap |
| abeto | Cel-shading / custom outlines | Distinctive non-generic look |
| abeto | Custom LOD system | Mobile performance |
| offbrand | Contained WebGL element + videos | If we go hybrid approach |
| offbrand | Noise-driven displacement for organic shapes | Living, breathing elements |
| cleo | Section-based content architecture | Structured information delivery |

### Mobile-First Priorities
1. **Performance budget**: Target <5MB initial load (igloo approach)
2. **Touch controls**: Custom touch handler, no DOM scroll
3. **Adaptive quality**: Reduce resolution/effects on mobile
4. **Memory management**: Track and free assets (critical for iOS Safari)
5. **Single-finger interaction**: Tap/swipe to navigate
