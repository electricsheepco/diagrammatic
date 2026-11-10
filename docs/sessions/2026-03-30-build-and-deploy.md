# 2026-03-30 - Build & Deploy

## Session Summary
Executed the full polish-and-integrate plan across 9 tasks using subagent-driven development. Built the complete split architecture (landing + app) from two reference HTML files, then deployed to Vercel — resolving routing issues caused by Vercel's default `index.html` behaviour.

## What Got Done
- [x] base.css — design tokens (palette, spacing, radii, shadows, typography)
- [x] app.js — all SVG generators, 6 framework presets, export logic, toast notifications
- [x] app.css — app chrome: header, tabs, sidebar, canvas, dot-grid, toast
- [x] index.html (app) — 3-tab UI wired to app.js
- [x] landing.css — marketing page styles, pricing cards, scroll animations
- [x] animations.js — IntersectionObserver reveals + header blur on scroll
- [x] landing.html — 8-section marketing page with Founding Member / Pro / Team pricing
- [x] Cleanup — removed stub styles.css, verified no raw hex leaks
- [x] Deployed to Vercel at https://diagrammatic-5n9hdd7yz-essco.vercel.app

## TODO (Next Session)
- [ ] Replace `YOUR_FORM_ID` in `src/index.html` (Formspree email capture)
- [ ] Add custom domain `diagrammatic.ai` in Vercel project settings
- [ ] Phase 3: PPTX export, user accounts, dark mode, brand kit

## Key Files
- `src/index.html` — landing page (renamed from landing.html for Vercel routing)
- `src/app.html` — app (renamed from index.html for Vercel routing)
- `src/js/app.js` — all logic, 6 framework presets (BCG, SWOT, Value Chain, Three Horizons, Ansoff, Prioritization)
- `vercel.json` — `outputDirectory: src`, single rewrite `/app` → `/app.html`
- `package.json` — no-op build script required for Vercel to respect outputDirectory

## Links
- Production: https://diagrammatic-5n9hdd7yz-essco.vercel.app
- App: https://diagrammatic-5n9hdd7yz-essco.vercel.app/app
- Vercel project: https://vercel.com/essco/diagrammatic
- GitHub: https://github.com/electricsheepco/diagrammatic

## Tags
#diagrammatic #build #deploy #vercel
