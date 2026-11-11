# 2026-11-11 - Homepage Redesign Port and Studio Domain

## What changed

- Committed the June and July work that was deployed but not in git (`95ea4ac`, `6ef4ef7`, `5177708`, `a73d18a`).
- Tested two redesign files from the Dia browser agent: a homepage and a Studio. Both are reference files only. They are not in the repository.
- Ported the homepage redesign layout onto `src/index.html` and `src/styles/landing.css` (`5a60d7c`):
  - The layout, serif headings, product-window mock, ruled steps and bordered framework grid come from the redesign.
  - The palette stays teal and orange. RP chose this option. The wordmark stays teal `diagrammatic` and orange `.ai`.
  - The page copy stays the live copy. The framework category labels (Portfolio, Growth, and others) are new. RP approved them.
  - The head metadata, skip link, `<main>` landmark, labelled `mailto:` forms and `animations.js` reveals are kept.
  - `base.css` has new `--font-serif`, `--font-mono` and `--border-soft` tokens. The fonts are system stacks, so there is no new font request and no CSP change.
- Fixed the privacy page inline links, which broke onto their own line (`f42bf4e`).
- Moved the Studio to `studio.diagrammatic.in` and the canonical marketing domain to `www.diagrammatic.in` (`5810d02`). Refer to `docs/decisions.md`.

## Verification

- `node --check src/js/animations.js` and `npm run build` passed. The build script only prints a message.
- A browser probe on the local homepage found one H1, one header, `<main>`, no `#` links, no broken anchors and labels on all inputs.
- A 375px check in an iframe harness found no horizontal scroll. Headless Chrome has a minimum window width, so a plain 375px headless screenshot is cropped and is not valid evidence.
- Production checks after the deploy:
  - `https://www.diagrammatic.in/`, `/hero` and `/privacy` return 200.
  - `www.diagrammatic.in/app` and `www.diagrammatic.ai/app` return 308 to `https://studio.diagrammatic.in/`.
  - The CSP and discovery `Link` headers are unchanged.

## Blocker

- `studio.diagrammatic.in` has no DNS record. Namecheap returns NXDOMAIN for it.
- Until the record exists, the "Try It" button and all Studio links on the site go to an address that does not resolve.
- RP must add this record in Namecheap Advanced DNS for `diagrammatic.in`: type `A`, host `studio`, value `76.76.21.21`.
- The domain is already attached to the Vercel project.

## Findings from the Dia Studio redesign

Fix these items if the Studio port reuses its code:

1. The "Auto saved" label is false. The file has no storage code.
2. The Matrix and 2x2 layouts show only 4 boxes. Extra boxes are hidden with no warning.
3. "Add box" has no upper limit, and you can delete every box.
4. The Tables and Matrix Chart views are disabled.
5. The diagrams use system fonts, so a PNG export on another computer can use different fonts.

## Next steps

1. Confirm that RP added the DNS record. Then check that `https://studio.diagrammatic.in/` serves the Studio and that `js/app.js` and `styles/app.css` load.
2. Port the Studio redesign look onto `src/app.html` and `src/styles/app.css`. Keep the Frameworks, Tables and Matrix Chart tabs working on the current `src/js/app.js`. The Dia reference file is at `~/Library/Application Support/Dia/User Data/Default/AgentServer/contexts/609263AD-FCB9-4E0C-A72B-91B826C55854/work/artifacts/diagrammatic_studio/index.html`.
3. Decide whether to add the size shortcuts and per-box colour swatches from the redesign. Add them only if each is a small change on top of the current `app.js` state.
