# Diagrammatic

Diagrammatic is a static web app for creating consulting-grade diagrams, tables, matrix charts, and branded hero images.

## Routes

- `/` - product overview, framework library, pricing, and early-access contact.
- `/app` - Diagrammatic Studio for framework diagrams, tables, and matrix charts.
- `/hero` - Hero Generator for branded article and social-card visuals.
- `/privacy` - static-site privacy summary.

## Development

This project is currently plain HTML, CSS, and JavaScript served from `src/`.

```bash
npm run build
python3 -m http.server 18081 --directory src
```

The production Vercel project uses `src` as `outputDirectory`; routes such as `/app`, `/hero`, and `/privacy` are mapped in `vercel.json`.

## Deployment

Production is deployed with the linked Vercel project:

```bash
vercel --prod --yes
```

Current public alias: `https://diagrammatic-red.vercel.app/`.

## Brand

- `diagrammatic` is teal.
- `.ai` is orange.
- Ownership line: `A Veritatis Product`.
