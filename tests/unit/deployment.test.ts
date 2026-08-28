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

  it('limits app rewrites to known routes and preserves an HTTP 404', () => {
    const config = JSON.parse(readFileSync(resolve(process.cwd(), 'public/staticwebapp.config.json'), 'utf8')) as {
      navigationFallback?: unknown;
      routes: Array<{ route: string; rewrite?: string }>;
      responseOverrides: Record<string, { rewrite: string; statusCode: number }>;
    };
    expect(config.navigationFallback).toBeUndefined();
    expect(config.routes).toContainEqual({ route: '/demo', rewrite: '/demo/index.html' });
    expect(config.routes).toContainEqual({ route: '/recipe', rewrite: '/recipe/index.html' });
    expect(config.routes.some((route) => route.route.includes('*recipe'))).toBe(false);
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
    expect(readFileSync(resolve(process.cwd(), 'public/404.html'), 'utf8')).toContain('Return home');
  });

  it('registers exactly one browser test tag for every public claim', () => {
    const claims = JSON.parse(readFileSync(resolve(process.cwd(), '.factory/claims.json'), 'utf8')) as Array<{ id: string }>;
    const sources = [
      readFileSync(resolve(process.cwd(), 'tests/e2e/claims.spec.ts'), 'utf8'),
      readFileSync(resolve(process.cwd(), 'tests/e2e/quality.spec.ts'), 'utf8'),
    ].join('\n');
    for (const claim of claims) {
      const tag = `@claim:${claim.id}`;
      expect(sources.split(tag)).toHaveLength(2);
    }
  });
});
