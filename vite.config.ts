import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { staticRouteMetadata } from './src/metadata';

const buildSha = (() => {
  if (process.env.BUILD_SHA) return process.env.BUILD_SHA;
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
})();

function buildIdentity(): Plugin {
  return {
    name: 'recipe-passport-build-identity',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'build-info.json',
        source: `${JSON.stringify({ product: 'recipe-passport', commit: buildSha }, null, 2)}\n`,
      });
    },
    writeBundle(options) {
      const output = options.dir ?? 'dist';
      const serviceWorker = resolve(output, 'sw.js');
      writeFileSync(serviceWorker, readFileSync(serviceWorker, 'utf8').replace('__BUILD_SHA__', buildSha));
      const notFound = resolve(output, '404.html');
      writeFileSync(notFound, readFileSync(notFound, 'utf8').replaceAll('__BUILD_SHA__', buildSha));
    },
    closeBundle() {
      const output = resolve('dist');
      const shell = readFileSync(resolve(output, 'index.html'), 'utf8');
      const absolute = (path: string) => `https://recipe-passport.sociobot.in${path === '/' ? '/' : path}`;
      const replaceMeta = (html: string, selector: string, attribute: 'name' | 'property', value: string) => {
        const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return html.replace(new RegExp(`(<meta ${attribute}="${escaped}" content=")[^"]*("\\s*/?>)`), `$1${value}$2`);
      };
      for (const [route, metadata] of Object.entries(staticRouteMetadata)) {
        if (route === '/' || route === '/404') continue;
        let html = shell
          .replace(/<title>[^<]*<\/title>/, `<title>${metadata.title}</title>`)
          .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${absolute(metadata.canonicalPath)}" />`);
        html = replaceMeta(html, 'description', 'name', metadata.description);
        html = replaceMeta(html, 'og:title', 'property', metadata.title);
        html = replaceMeta(html, 'og:description', 'property', metadata.description);
        html = replaceMeta(html, 'og:url', 'property', absolute(metadata.canonicalPath));
        html = replaceMeta(html, 'twitter:title', 'name', metadata.title);
        html = replaceMeta(html, 'twitter:description', 'name', metadata.description);
        const directory = resolve(output, `.${route}`);
        mkdirSync(directory, { recursive: true });
        writeFileSync(resolve(directory, 'index.html'), html);
      }
    },
  };
}

export default defineConfig({
  define: {
    __BUILD_SHA__: JSON.stringify(buildSha),
  },
  plugins: [buildIdentity()],
  build: {
    target: 'es2022',
    sourcemap: true,
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
