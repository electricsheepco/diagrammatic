# Diagrammatic Decisions

## 2026-07-28 - Website Specification Pass Scope

The Website Specification checklist is broad, so this pass applies the items relevant to the current static public site: metadata, discovery files, security headers, accessibility basics, and cache policy. Items requiring accounts, APIs, feeds, multilingual content, service workers, or operational monitoring are deferred until those product surfaces exist.


## 2026-11-11 - Studio on studio.diagrammatic.in

The Studio is served at the root of `studio.diagrammatic.in`. The canonical marketing domain is `www.diagrammatic.in`. `diagrammatic.ai` stays on the project as a second domain.

- `middleware.js` rewrites `/` to `/app.html` on the studio host only. A `vercel.json` rewrite cannot do this, because Vercel checks the filesystem before rewrites, and `index.html` answers `/` first.
- `vercel.json` redirects `/app` on the marketing hosts to `https://studio.diagrammatic.in/` with a 308. Preview deployments do not match these hosts, so `/app` still works on previews.
- Links between the two hosts are absolute. On a preview deployment, the Studio links go to production.
