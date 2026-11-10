# 2026-07-28 Website Specification Pass

## What changed

- Added static-site metadata coverage across landing, studio, hero generator, privacy, and 404 pages.
- Added `robots.txt`, `sitemap.xml`, web manifest, favicon, touch icons, Open Graph image, `llms.txt`, `llms-full.txt`, and `.well-known/security.txt`.
- Added Vercel security, cache, and discovery headers.
- Added privacy and 404 pages.
- Improved accessibility with skip links, landmarks, labels, tab ARIA state, visible focus, reduced-motion handling, and 44px touch targets.
- Preserved the Veritatis branding and the teal `diagrammatic` plus orange `.ai` brand treatment.

## Verification

- `npm run build`
- `node --check src/js/app.js`
- `node --check src/js/animations.js`
- Source scan for stale Formspree placeholders, Electric Sheep copy, disabled outlines, and old single-color SVG byline output.
- Local browser checks for metadata, labels, skip links, single H1 structure, stale copy, tab ARIA state, and touch targets.
- Production deployment: `https://diagrammatic-red.vercel.app`
- Production route checks: `/`, `/app`, `/hero`, `/privacy`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/.well-known/security.txt`.
- Production header checks confirmed CSP, HSTS, `x-content-type-options`, frame denial, referrer policy, permissions policy, and discovery `Link` headers.

## Decisions

- Early-access forms use `mailto:` links until there is a real capture endpoint.
- CSP permits inline styles/scripts for the current static pages and Google Fonts for the Hero Generator.
- Extensionless routes are validated in production through Vercel rewrites; the plain local static server validates the equivalent `.html` files.

## Next steps

- Replace the temporary `mailto:` early-access flow when a real capture endpoint is available.
- Run Lighthouse/axe before a major public launch.
