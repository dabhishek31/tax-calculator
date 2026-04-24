/**
 * Static pre-render script.
 * Runs after both vite build (client) and vite build --ssr (server bundle).
 * Imports the compiled SSR bundle directly — no dev server needed.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
  // Load the compiled SSR bundle directly (no Vite dev server required)
  const { render } = await import('../dist-ssr/entry-server.js');

  const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');

  for (const route of ROUTES) {
    process.stdout.write(`  Pre-rendering ${route} ...`);

    const { appHtml, headTags } = await render(route);

    const html = template
      .replace('<!--app-head-->', headTags)
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
}

run().catch((err) => {
  console.error('\n❌ Pre-render failed:', err);
  process.exit(1);
});
