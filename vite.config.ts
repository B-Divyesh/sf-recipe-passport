import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

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
      const serviceWorker = resolve(options.dir ?? 'dist', 'sw.js');
      writeFileSync(serviceWorker, readFileSync(serviceWorker, 'utf8').replace('__BUILD_SHA__', buildSha));
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
