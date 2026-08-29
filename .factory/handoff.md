# Recipe Passport repair handoff

Completed 29 August 2026 for work order `recipe-passport-repair-2` against
verification report commit `71ea5b7019f5a7f8a39a39e3aafcc88bc7e53317` and
candidate `f8c211255f9646d2603b8545ccb31058468f32d5`.

## Result

**PASS — every release-blocking finding is repaired and covered.** The product
remains a Vite + TypeScript static PWA deployed from `dist/` to Azure Static
Web Apps. The researched scope, local-only storage, one-click isolated demo,
and previously passing behavior are unchanged.

## Repairs

- Filtered real, imported, and custom-demo recipe links now retain the `?id=`
  query. The exact add → search `lentils` → open flow has a browser regression.
- New recipe titles are limited to 120 characters. Existing/imported long
  titles remain intact, wrap within 390 px, and produce document titles no
  longer than 60 characters and descriptions no longer than 155 characters.
- Every verifier-named mobile link target is at least 44 × 44 CSS px, including
  header Demo links, policy/contact links, Cancel, source, and build links.
- Focus rings now use herb green on paper and light ink on dark surfaces. Each
  tested adjacent contrast ratio is at least 3:1.
- Delete now focuses the visible Undo action. At six seconds, the action is
  removed from the DOM and the hidden toast is marked `aria-hidden="true"`.
- The static HTTP 404 main landmark is programmatically focusable, so its skip
  link moves focus to `main`.
- A malformed source URL now announces the HTTP/HTTPS recovery instruction and
  focuses the Source URL field.
- Both 404 implementations now use the direct heading “Page not found.”

## Exact reproduction and regression evidence

The untouched candidate was built after `npm ci`. Saving “Search click lentil
soup”, filtering for `lentils`, and clicking its result produced this evidence:

```json
{
  "filteredHref": "/recipe?id=<uuid>",
  "afterClickUrl": "http://127.0.0.1:4173/recipe",
  "heading": "This recipe card slipped away."
}
```

Evidence: `repair-artifacts/before-search-result-failure.png`.

After the repair, the same flow remained on `/recipe?id=<uuid>`, rendered
“Search click lentil soup”, and had a 390 px document width. Evidence:
`repair-artifacts/after-filtered-recipe-mobile.png`.

Focused tests cover each report item in `tests/e2e/quality.spec.ts`; metadata
limits also have unit coverage in `tests/unit/metadata.test.ts`, and static 404
markup has a deployment-policy assertion.

## Verification

Run from a clean checkout:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Observed results:

- `npm ci`: 60 packages installed/audited; 0 vulnerabilities.
- `npm test`: 11 Vitest tests and 44 Chromium tests passed. The browser suite
  contains exactly one test for each of the 20 `.factory/claims.json` tags.
- Typecheck and lint: pass.
- Production build: pass with `dist/index.html` at its root.
- Built JS: 33,705 bytes raw / 11.32 kB gzip. CSS: 18,674 bytes raw /
  4.92 kB gzip. Mobile hero: 21,760 bytes. No font files.
- Playwright Axe: zero serious/critical issues on home, demo, recipe, privacy,
  terms, and the real HTTP 404.
- Keyboard: skip links, route focus, browser history focus, Undo focus/expiry,
  and all form recovery paths pass.
- Responsive: production pages inspected at 1440 px and 390 px. The 200-letter
  title fixture has no horizontal overflow at 390 px.
- Privacy: `local-only`, `no-scraping`, `no-hosting`, and `no-tracking` request
  tests pass; observed product traffic is same-origin GET-only with no bodies.
- Offline/update: the service-worker claim reloads the demo and a fresh app
  route offline after an intentional 404. The cache name matches the build SHA.
- Response policy: known routes return 200, unknown routes return the styled
  HTTP 404, hashed assets are immutable, `sw.js` revalidates, and CSP, nosniff,
  and referrer headers are present.
- Local URL verifier: 554 ms load, zero console errors, `lang=en`, one `h1`, one
  `main`, all image alternatives, and all button names present. Evidence is in
  `repair-artifacts/verify-local/`.
- Lighthouse 13 mobile: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 1.2 s, LCP 1.7 s, TBT 10 ms, CLS 0, total 132 KiB. Evidence:
  `repair-artifacts/lighthouse-local.json`.
- Package/consumer and backend rate/concurrency/auth checks are not applicable:
  this is a static browser product with no published package, API, or sign-in.
- Runtime AI checks are not applicable; the product has no model integration.

## Deployment

The committed production build is deployed to Azure Static Web App
`sf-recipe-passport` in resource group `sociobot` using its production
deployment token and `swa deploy dist --env production`. The custom domain is
<https://recipe-passport.sociobot.in>.

Post-deploy verification checks that `/build-info.json` equals the deployed
repository `HEAD`, `npm run verify:live` passes, the prescribed URL verifier has
no errors, the exact filtered-recipe flow passes live, and security/cache/404
responses match `public/staticwebapp.config.json`.

## Known gaps and next steps

No release-blocking gaps remain. Browser storage is still not a permanent
backup by design; the existing export guidance and JSON round-trip remain the
recovery path.
