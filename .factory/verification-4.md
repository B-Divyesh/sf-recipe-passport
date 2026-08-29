# Independent verification 4 — Recipe Passport

**Result: PASS**

Verified 29 August 2026 from a clean checkout at commit
`1e5190c20f3e416909b4bc2b85fb546a072ebcd9` against
<https://recipe-passport.sociobot.in>. The live
`/build-info.json` returned the same product and commit, so the deployment
matches the candidate.

## First-read gate

Cold-loaded the live landing page in a fresh Chromium profile at desktop size.
It states, in plain words, that it moves recipes into a private cookbook; it
names cooks leaving an app or cluttered recipe pages as the audience; and its
first action is **Try it with sample data**. The adjacent explanation says the
sample opens a ready-made cookbook. The first-screen demo gate therefore
passes.

Initial cold-load traffic was four same-origin GET requests only: `/`, the
hashed JS and CSS, and `hero-1280.webp`. There were no console or page errors.

## Required claim gate

`npm ci` completed from the clean candidate (60 packages, zero audit
vulnerabilities). I then ran every exact `test` command declared in
`.factory/claims.json`, separately, using its demo-based Playwright entry
point. Every command passed (each also ran the 11 unit tests).

| Claim id | Result |
| --- | --- |
| paprika-import | PASS |
| manual-add | PASS |
| paste-recipe | PASS |
| search-cookbook | PASS |
| json-export | PASS |
| print-recipe | PASS |
| offline-reload | PASS |
| local-only | PASS |
| demo-one-click | PASS |
| demo-isolation | PASS |
| free-use | PASS |
| recipe-management | PASS |
| ingredient-check | PASS |
| no-account | PASS |
| no-scraping | PASS |
| no-hosting | PASS |
| no-tracking | PASS |
| export-import-roundtrip | PASS |
| source-retention | PASS |
| recipe-fields | PASS |

## Local quality gates

- `npm test`: PASS — 11 Vitest tests and 44 Chromium tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS; `dist/` created.
- Built initial JS is 33,705 bytes raw / 11.33 kB gzip; CSS is 18,674 bytes
  raw / 4.92 kB gzip. This is within the 200 kB JS and 50 kB CSS budgets.

The full browser suite covers normal flows, a 5.6 MB persistence failure,
the documented 10 MB import boundary, malformed JSON, field edits, delete
with undo, responsive 390 px behavior, keyboard/history focus, metadata,
routes, and static 404 behavior.

## Independent live evidence

- `npm run verify:live`: PASS. It exercised the query demo entry, reset and
  storage isolation, offline routes/reload, JSON round trip, one-paste intake,
  field editing, Paprika provenance, metadata, HTTP 404, privacy request
  checks, mobile layout, and Axe.
- Manual live recovery check: malformed JSON showed “This file is not valid
  JSON. Choose an unencrypted Paprika JSON export.” A malformed source URL
  stayed on `/add`, announced the HTTP/HTTPS instruction, and focused the
  Source URL field. Correcting it saved “Verifier lentil soup” and retained
  `https://example.com/lentils` as its source.
- A fresh 390 × 844 reduced-motion context had no horizontal overflow,
  honored `prefers-reduced-motion`, exposed the skip link first, moved focus
  to the page heading after activation, had zero console errors, and had zero
  Axe serious/critical findings. Desktop (1440 × 900) and mobile visual
  checks both matched the documented kitchen-archive design.
- The live demo installed `sw.js` and cache
  `recipe-passport-shell-1e5190c20f3e416909b4bc2b85fb546a072ebcd9`; with the
  context offline, `/demo` reloaded with HTTP 200 and rendered the sample
  recipe. `sw.js` is served with `Cache-Control: no-cache`, supporting update
  checks; hashed assets are immutable.
- Full live demo request recording found same-origin GET-only product traffic,
  with no request body and no third-party origin. It did not fetch recipe
  source URLs. This confirms the local-only/no-scraping/no-hosting/no-tracking
  promises observed in the claims tests.
- Response headers on `/`, assets, `sw.js`, and a missing route include CSP
  with `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and the declared
  Permissions Policy. Unknown paths returned the styled HTTP 404 with status
  404. All same-origin links discovered across landing, demo, add, cookbook,
  policy, terms, and sample recipe pages returned 200.

## Scope notes and defects

No release-blocking defects found. No medium, low, or informational defects
were recorded.

This is a static local-first browser application. It has no server-side API,
account flow, package/CLI public API, payment flow, or AI endpoint; therefore
API rate-limit/429, sign-in tenant, backend concurrency/persistence, and
consumer-package checks are not applicable. Browser storage is not permanent
backup, and the product clearly directs users to export before clearing data
or changing devices.
