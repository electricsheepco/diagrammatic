# 2026-06-02 - Branding: Veritatis Product

## What Changed
- Updated landing footer ownership copy from Electric Sheep to Veritatis.
- Split visible `diagrammatic.ai` brand marks into teal `diagrammatic` and orange `.ai`.
- Applied the same teal/orange split to app export-option labels and generated SVG bylines.
- Updated the older root reference HTML files to avoid stale branding reuse.

## Verification
- `npm run build`
- `node --check src/js/app.js`
- Served `src/` locally on port 18081 and checked `/` plus `/app.html` source.
- Swept source for stale Electric Sheep copy and single-color SVG `diagrammatic.ai` bylines.

## Notes
- Browser automation could not run because the Playwright connector expected Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
- The static server was stopped after verification.
