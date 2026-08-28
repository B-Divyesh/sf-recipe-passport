# Recipe Passport repair handoff

Completed 28 August 2026 for `recipe-passport-repair-1`.

## Release-blocker repairs

- **Durable imports:** Web Storage quota failures now stop the add/import action and show: “This recipe could not be saved because browser storage is full. Export or remove recipes, then try again.” The app neither reports an import success nor routes to the cookbook unless `localStorage` accepted the complete replacement. The documented 10 MB file cap is now enforced before file contents are read.
- **Deploy identity:** production builds emit `/build-info.json` with the exact Git SHA, show that SHA in the footer, and stamp the service-worker cache with it. A verifier can now attribute the HTML/app shell to a specific commit and confirm an update has a new cache name.
- **Claim-contract behavior:** Recipe Passport’s `recipe-passport/v1` export envelope and delete-with-Undo behavior remain covered by their existing public claim tests. The shipped sample no longer exposes a fictitious external source URL, so it cannot create a dead outbound link.
- **History focus:** Back and Forward both re-render with focus on the destination page’s sole `h1`.
- **390 px touch targets:** the home wordmark, footer links, ingredient checkbox/label controls, and ingredient rows are at least 44 × 44 CSS pixels.
- **Caching policy:** `staticwebapp.config.json` explicitly sets `public, max-age=31536000, immutable` for `/assets/*` and `no-cache` for `/sw.js`; a unit regression protects both directives.

## Regression coverage

- Browser regression uploads a syntactically valid **5,600,116-byte** JSON recipe while a realistic `QuotaExceededError` is raised. It asserts the precise storage-full recovery message, no false success, no navigation, and no saved recipe.
- Browser regression rejects a file at 10 MiB + 1 byte before reading it.
- Browser regressions verify the build manifest/footer/service-worker SHA agree, Back then Forward focus, every repaired mobile target size, and no outbound source link for the family-card sample.
- All public claims remain tagged once in `.factory/claims.json`; the suite checks 12 listed claims, including schema export and delete Undo.

## Verification evidence

Run from the repository root:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Completed locally after a clean `npm ci`:

- `npm ci`: pass; 0 vulnerabilities.
- `npm run typecheck`: pass.
- `npm run lint`: pass (the TypeScript static-analysis gate).
- Unit tests: 5 passed.
- Playwright 1.58.2 browser tests: 24 passed on Chromium. This includes desktop and 390 × 844 mobile, keyboard, Back/Forward focus, all public claims, offline reload/update cache identity, privacy/no-third-party requests, import boundaries, print, error/empty states, and direct routes.
- Accessibility: Playwright Axe 4.10.2 reported zero serious or critical violations on `/`, `/demo`, `/demo/recipe/sample-braised-beans`, `/privacy`, `/terms`, and the 404 route. The Playwright Axe integration is the prescribed equivalent to the standalone CLI.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 /tmp/recipe-passport-verify-url`: pass; HTTP 200, 560 ms load, title/lang/one `h1`/`main`/image alts/button labels correct, no browser errors.
- `npm run build`: pass; `dist/index.html` exists. Production output was 9.77 KB gzip JavaScript, 4.77 KB gzip CSS, 88.6 KB desktop hero, and 21.8 KB mobile hero. `/build-info.json` and a commit-stamped `sw.js` were emitted.

The local Vite preview does not apply Azure response headers, so immutable-cache behavior is verified as the committed Azure Static Web Apps configuration and by its unit test. Azure must serve that file as the work order’s static deployment configuration specifies.

## Deploy and live verification

Deploy `dist/` to Azure Static Web Apps from `main`; do not change DNS, infrastructure, or billing. The push for this repair is the deployment trigger supplied by the factory. After the deployment finishes, verify the deployed `/build-info.json` commit equals the pushed repair commit and that `/sw.js` contains `recipe-passport-shell-<that-commit>` before releasing.

## Remaining product limits

- The importer accepts unencrypted JSON, not compressed or encrypted `.paprikarecipes` archives.
- Browser storage does not sync across devices. Export JSON before clearing browser data or changing devices.
- PDF export uses the browser Print → Save as PDF flow.
- Ingredient checks are temporary cooking state and reset on reload.
