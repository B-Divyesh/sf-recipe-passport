# Independent verification 2 — PASS

Verified 28 August 2026 against the acceptance contract for work order
`recipe-passport-verify-2`.

- Candidate and checked-out commit: `4c67a47953813f36af3d47d669193f914e55054b`
- Remote `main`: `4c67a47953813f36af3d47d669193f914e55054b`
- Live URL: <https://recipe-passport.sociobot.in>
- Verdict: **PASS — release candidate and live deployment match and satisfy the verified contract.**

This replaces neither the history nor the evidence of the prior failed
verification (`.factory/verification.md`); the prior deployment identity and
storage defects are fixed in this candidate.

## Mandatory first read

Cold desktop and 390 px visits passed. The first screen says it moves recipes
into a quiet cookbook, names cooks leaving an app or ad-heavy pages as the
audience, and makes **Try it with sample data** the visible first action. The
adjacent copy explains that it opens a ready-made cookbook. One click opens
`/demo` with three realistic recipes and the persistent “Demo — sample data,
nothing is saved to your cookbook” banner, Reset demo, and Start for real.

## Claim gate — all pass

After a clean `npm ci` (60 packages, 0 vulnerabilities), each literal command
in `.factory/claims.json` was invoked separately from the shipped demo entry
point. Every command passed its unit suite and its tagged Playwright check.

| Claim ID | Result |
| --- | --- |
| `paprika-import` | Pass |
| `manual-add` | Pass |
| `search-cookbook` | Pass |
| `json-export` | Pass |
| `print-recipe` | Pass |
| `offline-reload` | Pass |
| `local-only` | Pass |
| `demo-isolation` | Pass |
| `free-use` | Pass |
| `recipe-management` | Pass |
| `ingredient-check` | Pass |
| `no-account` | Pass |

`npm test` then passed in full: 5 Vitest tests and 24 Chromium Playwright
tests. `test-results/.last-run.json` records `status: passed` with no failed
tests. `npm run typecheck`, `npm run lint`, and the exact build command
`npm run build` also passed. The production build emits `dist/`, including
`build-info.json`, the service worker, and the Static Web Apps configuration.

## Live deployment identity

The live `/build-info.json` is:

```json
{"product":"recipe-passport","commit":"4c67a47953813f36af3d47d669193f914e55054b"}
```

The live service worker cache is
`recipe-passport-shell-4c67a47953813f36af3d47d669193f914e55054b`. A fresh
production build has byte-identical deployed entry assets:

| Asset | SHA-256 |
| --- | --- |
| `index-1wVgpUfN.js` (local and live) | `58ecf668006847a907d33780a3a15f975003b1d1e618733d273a8fa022383c82` |
| `index-z2f1Fat4.css` (local and live) | `48dfee24c47f69288e1248bd25da0b5be031614e26de0d8a0a990c3f8e5f913b` |

## End-to-end product checks

- Imported the supplied Paprika fixture. Both recipes were available; the
  inspected recipe retained title, ingredient, method, yield, notes, and
  source provenance (the import-retention target is exceeded).
- Manual entry saves a structured recipe. Required-field recovery announces
  “Add a title, at least one ingredient, and at least one step,” focuses the
  first invalid field, and an invalid source URL has its own clear recovery
  message. HTML-like recipe text was rendered as text, not executed.
- Malformed JSON gets a useful recovery message. A 10 MiB + 1 byte file is
  rejected before reading. The browser quota failure regression is covered in
  the full browser suite with a valid 5,600,116-byte fixture and now remains
  on the import page with the explicit storage-full message rather than
  claiming success.
- Demo search found each sample by ingredient, category, note, source, and
  title; a no-result search has a recovery state. JSON export downloaded
  `recipe-passport/v1` with all three recipes and every field. Print invoked
  `window.print` under interception. Edit, named confirmation, delete, and
  Undo restored the edited recipe. Ingredient checks reset on reload without
  changing the saved recipe.
- Demo data was confirmed in
  `sessionStorage["demo:recipe-passport:v1:recipes"]`; real storage remained
  empty. After adding demo content, Start for real went to `/add` with both
  storage namespaces empty.
- All discovered internal product links/assets and the only external footer
  link returned 200; mail links are explicit `mailto:` links.

## Accessibility, responsive use, and errors

- Axe 4.10.2 found **zero serious or critical** violations on `/`, `/demo`,
  `/demo/recipe/sample-braised-beans`, `/privacy`, `/terms`, and the styled
  not-found route. Each had `lang="en"`, one `main`, exactly one `h1`, a
  route-specific title, and no console/page errors.
- The prescribed `/opt/fleet/lib/verify-url.sh` passed live: HTTP 200, 624 ms
  load, title/lang/main/one h1/image-alts/button-labels all present, no errors.
- At 390 x 844 there is no horizontal overflow (`scrollWidth: 390`). Tab first
  focuses the skip link with a visible mustard `3px` outline. Keyboard Enter
  opens the sample demo. Measured controls meet the 44 px minimum: home
  122 x 44, footer Privacy 58 x 44, Terms 47 x 44, ingredient checkbox 44 x
  44, and ingredient row 354 x 52 CSS px.
- The reduced-motion stylesheet limits animation and transition duration to
  `.01ms`; there is no looping or flashing motion. Browser history focus and
  dialog focus behavior are covered by the full Playwright suite.

## Privacy, policies, PWA, and performance

- A fresh complete demo flow made requests only to
  `https://recipe-passport.sociobot.in`; source inspection found no runtime
  third-party endpoint, analytics, remote font, or API call. No account or
  sign-in controls exist. This is a static client-only product, so there is no
  server-side API to burst-test for rate limiting and no Entra check applies.
- The live CSP is self-only for script/style/connect/font; it also has HSTS,
  `nosniff`, strict-origin referrer policy, a restrictive permissions policy,
  and `frame-ancestors 'none'`. Hashed JS/CSS use `public, max-age=31536000,
  immutable`; `/sw.js` uses `no-cache`.
- Service-worker registration controls the page. An explicit `registration.update()` completed; the commit-named cache is
  present. After the first live demo visit, an offline reload showed Tomato-
  braised butter beans with no console/page error.
- Built gzip budgets: JS 9,766 bytes and CSS 4,786 bytes (both well below the
  200 KB/50 KB limits); mobile and desktop hero images are 21,760 and 88,624
  bytes; no font files load. A fresh 390 px browser performance observation
  reported 124 ms LCP and no layout-shift entries. A standalone Lighthouse
  attempt was made but the container's supplied Chromium crashed its tab;
  this is an environment limitation, not a product console or page failure.

## Defects by severity

No release-blocking, high, medium, or low product defects found.

## Reproduction

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build

VERIFY_NODE_MODULES=/work/repo/node_modules \
  /opt/fleet/lib/verify-url.sh https://recipe-passport.sociobot.in /tmp/recipe-passport-verify-url
```
