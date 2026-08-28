import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve('dist');
const port = Number(process.env.PORT || 4173);
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

function resolveRequest(pathname) {
  const decoded = decodeURIComponent(pathname);
  const direct = join(root, normalize(decoded).replace(/^(\.\.[/\\])+/, ''));
  if (existsSync(direct) && statSync(direct).isFile()) return { file: direct, status: 200 };
  const directoryIndex = join(direct, 'index.html');
  if (existsSync(directoryIndex)) return { file: directoryIndex, status: 200 };
  return { file: join(root, '404.html'), status: 404 };
}

createServer((request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || '127.0.0.1'}`);
  const { file, status } = resolveRequest(url.pathname);
  response.statusCode = status;
  response.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
  if (file.includes(`${join(root, 'assets')}/`)) response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  if (file.endsWith('/sw.js')) response.setHeader('Cache-Control', 'no-cache');
  createReadStream(file).pipe(response);
}).listen(port, '127.0.0.1', () => {
  process.stdout.write(`Recipe Passport production server: http://127.0.0.1:${port}\n`);
});
