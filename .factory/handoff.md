# Recipe Passport independent verification handoff — FAIL

Independent verification completed 28 August 2026 for work order `recipe-passport-verify-1`.

**Verdict: FAIL — do not release candidate `b240f21ceed1e946e754366687c2b9bc66c16c91`.**

The requested commit cannot be fetched from the configured GitHub remote; remote `main` is still `ad5417ffec4b0994c639bbab32f216aebf503950`. The live artifact differs from that checkout and exposes no commit identity, so it cannot be confirmed as the candidate. The live app also falsely reports success for a valid 5.6 MB import that exceeds browser storage quota and disappears on reload. Its export shape and permanent-delete behavior contradict the available claim tests.

Additional findings: browser Back/Forward loses route focus, several mobile targets are below 44 × 44 CSS pixels, hashed assets receive only 30-second caching, and one sample source link is dead. The cold first-read and one-click demo pass. Normal Paprika import retains 100% of required fields. Offline reload, privacy/network checks, axe, reduced motion, console health, production-size budgets, and the available base checkout's 24 tests pass.

Full evidence, severities, fingerprints, commands, and metrics: [`.factory/verification.md`](verification.md). No product code was modified during verification.

---

# Original builder handoff

Completed 28 August 2026 for work order `recipe-passport-build-1`.

## What was built

- A Vite and TypeScript static web app with no runtime framework or external service.
- Paprika JSON import for one recipe, arrays, and Recipe Passport exports.
- Manual add and edit forms for title, yield, categories, ingredients, steps, notes, source name, and source URL.
- A local searchable cookbook with empty and no-result states.
- Recipe pages with checkable ingredients, provenance, edit, delete with undo, and a print/PDF stylesheet.
- Complete `recipe-passport/v1` JSON export.
- An isolated `/demo` with three complete sample recipes, reset, and an explicit Start for real path.
- Separate storage: real data in local storage and demo data in session storage under a `demo:` key.
- Offline app shell through a versioned service worker.
- Routes for home, demo, cookbook, add, recipe detail, privacy, terms, and a styled 404.
- Full metadata, social card, favicon, manifest, robots, sitemap, CSP, security headers, and SWA fallback rules.
- A product-specific surreal editorial design system and generated hero art with prompt provenance.

## Verification

Run from the repository root:

```sh
npm ci
npm test
npm run build
```

Final production results:

- Unit tests: 4 passed.
- Playwright browser tests: 20 passed on Chromium 1.58.2.
- Public claims: 12 listed in `.factory/claims.json`; each has one tagged browser test.
- Paprika fixture: 100% retention for title, ingredients, steps, yield, and notes.
- Axe: no serious or critical issues on home, demo, recipe, privacy, terms, or 404 routes.
- Keyboard/mobile: passed at 390 × 844 CSS pixels, with no horizontal overflow.
- Route focus, browser back, empty state, error state, edit, delete, and undo passed.
- Worker `verify-url.sh`: correct title, language, h1, main, alt text, and button labels; no console errors.
- `npm audit`: 0 known vulnerabilities.
- Production bundle: 9.50 KB JavaScript gzip and 4.75 KB CSS gzip.
- Largest hero: 88 KB WebP; mobile hero: 22 KB WebP.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100.
- Lighthouse: LCP 1.7 s, FCP 1.1 s, TBT 0 ms, CLS 0, total transfer 92 KB.

Lighthouse used the production preview, Lighthouse 13.0.1, and the factory Chromium binary. Evidence was stored outside the repository in `/tmp/recipe-verify` and `/tmp/recipe-lighthouse.json`.

## Build and deploy

The exact build command is `npm run build`. Output lands in `dist/`, with `dist/index.html` at its root. Deploy `dist/` as an Azure Static Web App. The included `staticwebapp.config.json` handles history fallback, cache policy, and security headers.

## Known gaps

- The importer accepts unencrypted JSON. It does not unpack compressed or encrypted `.paprikarecipes` archives.
- Browser storage does not sync between devices. Users should export JSON before clearing storage or moving devices.
- PDF output uses the browser’s Print → Save as PDF flow. The app does not bundle a PDF engine.
- Ingredient checks are temporary cooking state and reset on reload.

These limits match the local, static, no-account scope. A future desktop importer could add archive unpacking if format maintenance justifies it.
