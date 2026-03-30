# Diagrammatic — Polish & Integrate Design Spec
**Date:** 2026-03-30
**Scope:** Phase 1 (Landing) + Phase 2 (App Polish) — full polish and integration into split architecture

---

## Overview

Take two reference HTML files (`diagrammatic-landing.html`, `diagrammatic-app.html`) and integrate them into a clean, maintainable file structure. Upgrade both to Stripe/Linear visual quality. Preserve all existing SVG generation, export logic, and tab structure. Add missing features: pricing section, framework presets, scroll animations.

---

## Architecture

### File Structure

```
diagrammatic/
├── src/
│   ├── index.html            ← App (Frameworks | Tables | Matrix)
│   ├── landing.html          ← Marketing page
│   ├── styles/
│   │   ├── base.css          ← Design tokens, reset, typography (shared by both pages)
│   │   ├── landing.css       ← Landing-only styles + animation classes
│   │   └── app.css           ← App chrome, sidebar, canvas, tab layout
│   └── js/
│       ├── app.js            ← All state, SVG generation, export logic, preset loader
│       └── animations.js     ← IntersectionObserver scroll reveals (landing only)
├── vercel.json               ← Routing config
└── public/
    └── (favicon, og-image placeholders)
```

### vercel.json Routing

```json
{
  "rewrites": [
    { "source": "/", "destination": "/src/landing.html" },
    { "source": "/app", "destination": "/src/index.html" }
  ]
}
```

### Token Strategy (`base.css`)

All colours, spacing steps, border radii, and shadows as CSS custom properties. `landing.css` and `app.css` consume tokens only — no raw hex values. This makes dark mode, brand kit, and theming changes to a single file.

```css
:root {
  /* Primary palette */
  --teal: #156082;
  --teal-mid: #1B7A9F;
  --teal-soft: #5BA3B8;
  --teal-light: #EBF4F7;

  /* Neutrals */
  --text: #1A1A2E;
  --text-muted: #4A5568;
  --bg: #FAFBFC;
  --white: #FFFFFF;
  --border: #E2E8F0;

  /* Accents (diagram use) */
  --coral: #E07A5F;
  --amber: #D4A03D;
  --sage: #4A9E6B;

  /* Spacing scale (8px grid) */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 40px;
  --space-6: 48px;
  --space-8: 64px;
  --space-10: 80px;

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 100px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.10);
  --shadow-hover: 0 12px 40px rgba(0,0,0,0.12);

  /* Typography */
  --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --text-xs: 11px;
  --text-sm: 13px;
  --text-base: 16px;
  --text-lg: 20px;
  --text-xl: 24px;
  --text-hero: clamp(2.5rem, 5vw, 3.5rem);
}
```

---

## Landing Page (`src/landing.html` + `landing.css` + `animations.js`)

### Sections (top to bottom)

#### 1. Header
- `position: fixed`, `top: 0`, `width: 100%`, `z-index: 100`
- Height reserved: `padding-top: 73px` on `<body>` to prevent layout shift
- Logo left: `diagrammatic` (dark) + `.ai` (teal), 700 weight
- Nav right: `Frameworks | Pricing | Try It →`
- Scroll behaviour: JS adds `.scrolled` class at 50px → `backdrop-filter: blur(12px)` + `background: rgba(250,251,252,0.9)` + `border-bottom: 1px solid var(--border)` appear

#### 2. Hero
- Max-width: 800px, centered, `padding: 6rem 2rem 4rem`
- Headline: `var(--text-hero)`, weight 700, `letter-spacing: -0.03em`, `line-height: 1.1`
- `"Instantly."` in `var(--teal)`
- Subhead: 1.25rem, `var(--text-muted)`, max-width 600px
- Email form: `[input] [Get Early Access →]` inline, wraps on mobile
  - Formspree action: `https://formspree.io/f/YOUR_FORM_ID`
  - Input: `flex: 1`, min-width `220px`
  - Button: teal bg, white text, `hover: translateY(-1px) + shadow`
- Fine print: "Free while in beta. No credit card required."
- **Load animation:** Headline words stagger (0 / 100 / 200ms), subhead 300ms, form 400ms — all `opacity: 0 → 1` + `translateY(20px) → 0`, `600ms ease`

#### 3. How It Works
- Max-width: 1000px, 3 equal cards
- Each card: numbered circle (teal bg), heading, body text
- Card `hover: translateY(-4px) + var(--shadow-hover)`, `transition: 200ms ease`
- Scroll reveal

#### 4. Framework Library
- White background section
- Heading + subhead centred
- 15 framework pills in auto-fill grid (`minmax(160px, 1fr)`)
- Pill `hover: background var(--teal-light), color var(--teal)`
- Scroll reveal

#### 5. Who It's For
- Centred, 6 audience pills
- Pills: white bg, `var(--border)` border, `var(--radius-pill)`
- Scroll reveal

#### 6. Pricing
- 3-column card grid, centred heading
- **Card 1 — Founding Member:** `"Limited Time"` badge (amber), price slot shows "Founding Member" label, same features as Free. Badge/copy swappable to standard Free tier with one text edit.
- **Card 2 — Pro ($12/mo):** `border: 2px solid var(--teal)`, `"Most Popular"` badge (teal), primary CTA button
- **Card 3 — Team ($29/mo):** standard border, secondary CTA
- Feature list: checkmark icon (`✓`) per item
- Tier features:
  - Founding Member: 5 exports/month, Watermark, PNG only
  - Pro: Unlimited exports, No watermark, PNG + SVG + PPTX (copy only — PPTX not built yet), Brand kit
  - Team: Everything in Pro, Shared templates, API access, Priority support
- Scroll reveal

#### 7. Final CTA
- Full-width teal background, white text
- "Ready to ship better diagrams?"
- Subhead + same email form (dark button variant)

#### 8. Footer
- `"© 2026 Diagrammatic. An Electric Sheep product."` — left
- `Contact` link (`mailto:hello@diagrammatic.ai`) — right
- `font-size: var(--text-sm)`, `var(--text-muted)`

### Scroll Animations (`animations.js`)

```js
// Single IntersectionObserver, threshold: 0.1
// Adds .visible to .reveal elements
// CSS: opacity 0→1, translateY(20px)→0, 600ms ease
// Staggered children: --delay CSS var set inline (0ms, 100ms, 200ms...)
```

Header scroll class toggle also in `animations.js`.

---

## App (`src/index.html` + `app.css` + `app.js`)

### Chrome

**Header** (56px tall):
- White bg, `border-bottom: 1px solid var(--border)`
- Logo left (icon + wordmark)
- Actions right: `[Copy SVG]` secondary + `[Download PNG]` primary

**Tab bar** (directly below header):
- White bg, `border-bottom: 1px solid var(--border)`
- `Frameworks | Tables | Matrix Chart`
- Active: teal underline (2px), teal text
- Hover: teal text

### Main Layout

`display: flex`, `height: calc(100vh - 56px - 41px)` (subtract header + tab bar heights)

**Sidebar (320px):**
- White bg, `border-right: 1px solid var(--border)`, `overflow-y: auto`
- Section headers: `var(--text-xs)`, weight 600, uppercase, `letter-spacing: 1px`, teal
- Collapsible: toggle arrow rotates 90°, `max-height` transition `200ms ease`
- **Top section: Framework Preset dropdown** — `<select>` with placeholder option + 6 named presets. Selecting triggers `loadPreset(id)`.
- Form inputs: `8px 10px` padding, `var(--radius-sm)`, `1px solid var(--border)`, focus ring teal
- Color swatches: 28px circles, active = white ring + dark outer border
- Box items: `var(--teal-light)` bg, `var(--radius-md)`

**Canvas area (flex: 1):**
- Toolbar strip: dimensions info left, Reset button right
- Preview background: `#E8ECEF` with dot grid (CSS `radial-gradient`, 20px repeat, 1px dots, 15% opacity)
- SVG preview: white card, `var(--shadow-lg)`, `border-radius: 4px`

### Framework Presets (`app.js`)

```js
const PRESETS = {
  bcg: {
    tab: 'frameworks',
    state: {
      layout: '4box',
      title: 'BCG Matrix',
      subtitle: '',
      boxes: [
        { title: 'Stars', subtitle: 'High growth, high share', color: 'teal' },
        { title: 'Question Marks', subtitle: 'High growth, low share', color: 'amber' },
        { title: 'Cash Cows', subtitle: 'Low growth, high share', color: 'softTeal' },
        { title: 'Dogs', subtitle: 'Low growth, low share', color: 'slate' }
      ]
    }
  },
  swot: {
    tab: 'frameworks',
    state: {
      layout: '4box',
      title: 'SWOT Analysis',
      subtitle: '',
      boxes: [
        { title: 'Strengths', subtitle: 'Internal positives', color: 'sage' },
        { title: 'Weaknesses', subtitle: 'Internal negatives', color: 'coral' },
        { title: 'Opportunities', subtitle: 'External positives', color: 'teal' },
        { title: 'Threats', subtitle: 'External negatives', color: 'amber' }
      ]
    }
  },
  valuechain: {
    tab: 'frameworks',
    state: {
      layout: '5box',
      title: 'Value Chain Analysis',
      subtitle: '',
      boxes: [
        { title: 'Inbound Logistics', subtitle: '', color: 'teal' },
        { title: 'Operations', subtitle: '', color: 'midTeal' },
        { title: 'Outbound Logistics', subtitle: '', color: 'softTeal' },
        { title: 'Marketing & Sales', subtitle: '', color: 'teal' },
        { title: 'Service', subtitle: '', color: 'midTeal' }
      ]
    }
  },
  threehorizons: {
    tab: 'frameworks',
    state: {
      layout: 'timeline',
      title: 'Three Horizons',
      subtitle: '',
      boxes: [
        { title: 'H1: Core Business', subtitle: 'Defend & extend', color: 'teal' },
        { title: 'H2: Emerging', subtitle: 'Build & scale', color: 'midTeal' },
        { title: 'H3: Future Options', subtitle: 'Explore & seed', color: 'softTeal' }
      ]
    }
  },
  ansoff: {
    tab: 'frameworks',
    state: {
      layout: '4box',
      title: 'Ansoff Matrix',
      subtitle: '',
      boxes: [
        { title: 'Market Penetration', subtitle: 'Existing product, existing market', color: 'teal' },
        { title: 'Product Development', subtitle: 'New product, existing market', color: 'midTeal' },
        { title: 'Market Development', subtitle: 'Existing product, new market', color: 'softTeal' },
        { title: 'Diversification', subtitle: 'New product, new market', color: 'amber' }
      ]
    }
  },
  prioritization: {
    tab: 'matrix',
    matrixState: {
      title: 'Prioritization Matrix',
      xLabel: 'Effort',
      yLabel: 'Impact',
      points: [
        { label: 'Quick Wins', x: 20, y: 80, size: 40, color: 'sage' },
        { label: 'Major Projects', x: 80, y: 80, size: 40, color: 'teal' },
        { label: 'Fill-Ins', x: 20, y: 20, size: 30, color: 'softTeal' },
        { label: 'Thankless Tasks', x: 80, y: 20, size: 30, color: 'coral' }
      ]
    }
  }
};
```

**`loadPreset(id)`:** Sets the relevant state object, switches tab if needed, re-renders sidebar controls and canvas preview. Does NOT reset the dropdown when the user edits — keep it simple, no tracking of "dirty" state.

### Preserved from Reference
- All SVG generation functions (`generateSVG`, `generateTableSVG`, `generateMatrixSVG`)
- `renderLayout` and all layout renderers
- PNG download logic (`downloadPNG` via canvas)
- SVG copy logic (`copySVG`)
- `escapeHtml` / `escapeXml` utilities
- All event binding patterns

---

## What Is NOT in Scope (Phase 3)
- PPTX export (stubs exist in pricing copy but not implemented)
- User accounts / auth
- Dark mode
- Brand kit upload
- API / embeds

---

## Constraints & Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| PPTX export | Stub only (pricing mentions it, not built) | Requires server-side or complex JS lib |
| Mobile for app | Desktop-only (landing is responsive) | Tool UX requires 320px sidebar + canvas |
| Email capture | Formspree (`YOUR_FORM_ID` placeholder) | Zero backend, easy swap |
| JS modules | Plain scripts, no bundler | Static Vercel deploy, no build step |
| CSS approach | Custom properties only, no Tailwind | Token strategy, theming-ready |
