# 2026-06-02 - Hero Generator Feature

## What Changed
- Added `src/hero.html` as a standalone Diagrammatic Hero Generator feature from `diagrammatic-hero-generators.zip`.
- Added Vercel routing for `/hero`.
- Linked the Hero Generator from the landing page navigation and the main app header.
- Preserved the supplied generator controls: style, canvas size, palette, content, typography, wordmark, shuffle, copy SVG, and download PNG.
- Enforced the current brand rule inside generated hero wordmarks: teal `diagrammatic` and orange `.ai`.

## Verification
- `node -e` syntax check against the inline hero page script.
- `node --check src/js/app.js`
- `npm run build`
- Local static server check for `src/hero.html`.
- Production deploy to Vercel.
- Live checks:
  - `https://diagrammatic-red.vercel.app/hero` returns `200`.
  - Landing page contains `/hero`.
  - App page contains the Hero Generator link.

## Deployment
- Production deployment: `https://diagrammatic-q8bacrhlt-essco.vercel.app`
- Aliased to: `https://diagrammatic-red.vercel.app`

## Notes
- The ZIP also contains `arc1-assets.zip` and `hero-atom-styles.png`; the generator page itself does not require those assets to run.
- Browser screenshot automation remains blocked because the Playwright connector expects Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
