// Vercel Routing Middleware.
// Serve the Studio at the root of studio.diagrammatic.in. A vercel.json
// rewrite cannot do this: rewrites run after the filesystem check, so
// src/index.html would answer "/" first.
export const config = { matcher: '/' };

const STUDIO_HOST = 'studio.diagrammatic.in';

export default function middleware(request) {
  const url = new URL(request.url);
  if (url.hostname !== STUDIO_HOST) return;
  return new Response(null, {
    headers: { 'x-middleware-rewrite': new URL('/app.html', url).toString() },
  });
}
