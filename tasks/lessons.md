# Diagrammatic Lessons

- Keep product-specific branding exact: `diagrammatic` is teal and `.ai` is orange wherever the wordmark is rendered.
- Treat bundled generators as separate product surfaces unless the user explicitly asks to merge them into the main studio.

- Headless Chrome has a minimum window width. To test a 375px layout, load the page in a 375px iframe inside a wider headless window.
- Vercel checks the filesystem before `vercel.json` rewrites. To serve a different page at `/` for one host, use Routing Middleware.
