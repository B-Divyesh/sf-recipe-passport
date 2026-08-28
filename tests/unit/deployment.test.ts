import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('static deployment policy', () => {
  it('sets immutable caching for hashed assets and revalidates the service worker', () => {
    const config = JSON.parse(readFileSync(resolve(process.cwd(), 'public/staticwebapp.config.json'), 'utf8')) as {
      routes: Array<{ route: string; headers: Record<string, string> }>;
    };
    const assets = config.routes.find((route) => route.route === '/assets/*');
    const serviceWorker = config.routes.find((route) => route.route === '/sw.js');
    expect(assets?.headers['Cache-Control']).toBe('public, max-age=31536000, immutable');
    expect(serviceWorker?.headers['Cache-Control']).toBe('no-cache');
  });
});
