/**
 * Static pre-render script.
 * Runs after `vite build` to inject server-rendered HTML into each route's index.html.
 * Uses Vite's SSR module loading to execute React components in Node.js.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const ROUTES = [
  '/',
  '/hra-calculator',
  '/new-vs-old-regime',
  '/income-tax-slabs',
  '/about',
  '/privacy-policy',
];

async function run() {
  // Start Vite in SSR mode to load TypeScript/JSX modules in Node.js
  const vite = await createServer({
    root: ROOT,
    server: { middlewareMode: true },
    appType: 'custom',
    // Silence dev-server output during prerender
    customLogger: {
      info: () => {},
      warn: (msg) => console.warn('[vite]', msg),
      error: (msg) => console.error('[vite]', msg),
      clearScreen: () => {},
      hasErrorLogged: () => false,
      hasWarned: false,
      warnOnce: () => {},
    },
  });

  try {
    const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');

    // Use the built dist/index.html as the HTML shell (has hashed asset paths)
    const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');

    for (const route of ROUTES) {
      process.stdout.write(`  Pre-rendering ${route} ...`);

      const { appHtml, headTags } = await render(route);

      const html = template
        // Inject per-page head tags (title, meta, canonical, OG, Twitter, breadcrumb schema)
        .replace('<!--app-head-->', headTags)
        // Inject server-rendered body HTML
        .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

      const outPath =
        route === '/'
          ? path.join(DIST, 'index.html')
          : path.join(DIST, route.slice(1), 'index.html');

      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html, 'utf-8');

      process.stdout.write(' ✅\n');
    }

    console.log(`\n✅ Pre-render complete. ${ROUTES.length} routes written to dist/`);
  } finally {
    await vite.close();
  }
}

run().catch((err) => {
  console.error('\n❌ Pre-render failed:', err);
  process.exit(1);
});
