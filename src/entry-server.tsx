import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';

export function render(url: string) {
  const helmetContext: Record<string, unknown> = {};

  const appHtml = renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>
  );

  const { helmet } = helmetContext as { helmet: Record<string, { toString(): string }> };

  const headTags = helmet
    ? [
        helmet.title?.toString(),
        helmet.meta?.toString(),
        helmet.link?.toString(),
        helmet.script?.toString(),
      ]
        .filter((s) => s && s.trim())
        .join('\n    ')
    : '';

  return { appHtml, headTags };
}
