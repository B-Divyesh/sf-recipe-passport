# Polish round 5 — cumulative finding closure

Completed 29 August 2026 for `recipe-passport-polish-5`. Product repair commit
`8e9a87f55537191d1cf0f7803b99b70d9a16705b` was verified from a fresh GitHub
clone and published by Azure Static Web Apps deployment
`7006b04d-b5a5-478a-9dc4-e44a4b0bf52c`. Every finding in reviews 1–5 is
closed; review 4 had no findings.

| Finding | Change made or retained | Test evidence | Screenshot and cold live check |
| --- | --- | --- | --- |
| F-1-1 — unknown URLs returned 200 | Retained fixed route rewrites, static `404.html`, and the HTTP 404 response override. | `serves a real styled HTTP 404 with a working return path` | [404](polish-artifacts/polish-5-404-live.png); `/missing-polish-5-live` returned 404 with Return home. |
| F-1-2 — route share metadata was inaccurate | Retained static and runtime title, description, canonical, Open Graph, and Twitter metadata per route. | `serves and maintains route-accurate share metadata` | [demo](polish-artifacts/polish-5-demo-mobile-live.png); raw and runtime `/demo`, `/privacy`, `/terms`, and sample-recipe metadata passed live. |
| F-1-3 — export/import was unregistered | Retained the full Recipe Passport export/re-import claim and field comparison. | `@claim:export-import-roundtrip preserves every recipe and saved field` | [demo](polish-artifacts/polish-5-demo-mobile-live.png); live verifier exported and re-imported all three samples. |
| F-1-4 — source retention was unregistered | Retained manual and Paprika source-name and safe-URL coverage. | `@claim:source-retention keeps supplied manual and Paprika provenance` | `/add` and the resulting live recipe passed source checks. |
| F-1-5 — field-complete editing was unregistered | Retained add, edit, reload, and comparison of every documented field. | `@claim:recipe-fields adds and edits every documented recipe field` | Live verifier retained yield, categories, ingredients, steps, notes, source name, and URL. |
| F-2-1 — unknown recipe IDs were soft 404s | Retained server-known query recipe routes and only the three fixed sample paths. | `returns HTTP 404 and not-found metadata for unknown recipe URL paths`; `reloads a stored recipe from the real query route` | [404](polish-artifacts/polish-5-404-live.png); both unknown recipe path forms returned 404 live. |
| F-2-2 — a 404 could poison offline navigation | Retained the immutable precached shell; arbitrary navigation responses are never written to it. | `@claim:offline-reload reloads the demo and a fresh app route after a 404 without a network` | Live verifier passed 404 → offline `/add` → offline `/demo`. |
| F-2-3 — desktop omitted required first-screen facts | Retained the compact hero layout; removing the caption adds more visual space without changing the art. | `keeps the action outcome and all three facts in the desktop first screen` | [desktop home](polish-artifacts/polish-5-home-desktop.png); every required item remained above 900 px live. |
| F-2-4 — isolation test could miss real-data deletion | Both demo tests seed a real-cookbook sentinel and require byte-for-byte preservation. | `@claim:demo-isolation discards demo changes before real use`; `@claim:demo-one-click opens a populated isolated demo in one click` | [live demo](polish-artifacts/polish-5-demo-mobile-live.png); reset and exit preserved real storage. |
| F-2-5 — export test omitted saved values | Retained deep comparison of every downloaded recipe against demo storage. | `@claim:json-export downloads every demo recipe as JSON` | Live export/re-import comparison passed. |
| F-2-6 — search test did not identify results | Retained expected-title assertions for title, ingredient, category, note, and source searches. | `@claim:search-cookbook searches by ingredient` | `/demo` returned the named single result for each query. |
| F-2-7 — generic JSON-array wording was unlisted | Public wording remains limited to Paprika arrays and Recipe Passport exports. | `@claim:paprika-import`; `@claim:export-import-roundtrip preserves every recipe and saved field` | `/add` and README copy match the tested formats. |
| F-2-8 — the static 404 shell was inconsistent | Retained the shared-style header, navigation, legal links, external label, build ID, and updated descriptive footer. | `serves a real styled HTTP 404 with a working return path` plus Axe | [404](polish-artifacts/polish-5-404-live.png); live 404 has matching chrome and legal links. |
| F-2-9 — sitemap omitted public routes | Retained all ten fixed crawlable routes. | Unit test `lists every crawlable static route in the sitemap` | Every sitemap route returned 200 in the live verifier. |
| F-2-10 — paste required field-by-field entry | Retained local one-paste parsing into editable recipe fields. | `@claim:paste-recipe fills editable fields from one full pasted recipe` | Live `/add` filled the title and ingredients from one paste. |
| F-2-11 — archive/cookbook terminology conflicted | Retained “A cookbook on this device” and the single `cookbook` collection term. | `.factory/copy-audit.md` terminology table | [mobile home](polish-artifacts/polish-5-home-mobile-live.png). |
| F-2-12 — export step lacked a named result | Retained “Print or export your cookbook.” | `uses plain, descriptive landing headings and footer copy` | [desktop home](polish-artifacts/polish-5-home-desktop.png). |
| F-2-13 — public copy used production jargon | Retained the earlier plain artwork, font, route, and source wording. | `.factory/copy-audit.md`; `uses plain, descriptive landing headings and footer copy` | Footer checked on live `/`, `/demo`, and 404. |
| F-3-1 — no-scraping/no-hosting promises were unlisted | Retained separate claims that observe both real and demo save flows. | `@claim:no-scraping never requests recipes from source sites`; `@claim:no-hosting never uploads or hosts recipe data` | Live verifier observed no source fetch, request body, or non-GET request. |
| F-3-2 — no-tracking promise was unlisted | Retained the analytics/ads/telemetry claim over demo and real import flows. | `@claim:no-tracking makes only static app requests during demo and real flows` | Live verifier observed only same-origin static GET requests. |
| F-5-1 — hero caption was a travel metaphor | Removed the caption and its unused responsive CSS. | `uses plain, descriptive landing headings and footer copy` asserts the old sentence is absent. | [mobile home](polish-artifacts/polish-5-home-mobile-live.png); caption absent live. |
| F-5-2 — preview heading was a slogan | Replaced it with “Recipe preview.” | `uses plain, descriptive landing headings and footer copy` | [desktop home](polish-artifacts/polish-5-home-desktop.png); heading present live. |
| F-5-3 — how-it-works heading used a metaphor | Replaced it with “Import, find, and export recipes in three steps.” | `uses plain, descriptive landing headings and footer copy` | [mobile home](polish-artifacts/polish-5-home-mobile-live.png); heading present live. |
| F-5-4 — “Cook” lacked standalone meaning | Replaced it with “Find and cook recipes.” | `uses plain, descriptive landing headings and footer copy` | [desktop home](polish-artifacts/polish-5-home-desktop.png); heading present live. |
| F-5-5 — privacy eyebrow was a generic slogan | Replaced it with “Privacy and account limits.” | `uses plain, descriptive landing headings and footer copy` | [mobile home](polish-artifacts/polish-5-home-mobile-live.png); label present live. |
| F-5-6 — footer line did not describe the product | Replaced it in the app and static 404 with “Private cookbook stored in your browser.” | `uses plain, descriptive landing headings and footer copy`; `serves a real styled HTTP 404 with a working return path` | [404](polish-artifacts/polish-5-404-live.png); line present on every cold live route checked. |
| F-5-7 — one-click populated-demo promise was unregistered | Added `demo-one-click` to `.factory/claims.json` and a fresh-context test covering `/?demo=1`, `/demo`, banner, controls, named samples, reset, exit, and real-data preservation. | `@claim:demo-one-click opens a populated isolated demo in one click`; tag-registration unit test | [live demo](polish-artifacts/polish-5-demo-mobile-live.png); one click opened the populated sandbox and Reset restored all three recipes. |

## Earlier independent-verification defects

| Earlier defect | Current evidence |
| --- | --- |
| Deployment identity was missing | `build identity is visible and matches the generated service worker cache`; live `/build-info.json` matched `8e9a87f…`. |
| Storage quota produced false success | `does not report success or navigate when a valid 5.6 MB import cannot persist`. |
| Deployed behavior differed from claims | All 20 literal claim commands passed from the remote clean clone, then `npm run verify:live` passed. |
| Back/Forward lost focus | `back and forward navigation restore the route and move focus`. |
| Mobile controls were below 44 px | `works with a keyboard and keeps every required touch target at 390 CSS pixels`. |
| Asset caching was incorrect | Unit test `sets immutable caching for hashed assets and revalidates the service worker`. |
| Sample source link was dead | `sample provenance does not expose a dead external link`. |

## Verification

- Fresh remote clone: `/tmp/recipe-passport-polish5-clean.XTZtcY/repo` at
  `8e9a87f55537191d1cf0f7803b99b70d9a16705b`; `npm ci` reported zero
  vulnerabilities. All 20 literal claim commands passed independently.
- Full clean-clone suite: 9 Vitest tests and 37 Chromium tests passed;
  typecheck, lint, and build passed; `dist/index.html` exists. Gzip sizes are
  10.96 KB JavaScript and 4.84 KB CSS.
- Local URL verifier: 557 ms, no console errors, one h1, one main, `lang=en`,
  complete alt text, and named buttons. Evidence is in
  `polish-artifacts/polish-5-local-check/`.
- Cold live `npm run verify:live`: pass for round-5 copy, both first-screen
  widths, one-click demo/reset/isolation, offline-after-404, import/export,
  privacy requests, metadata, Axe, legal routes, focus, and HTTP 404s.
- Cold live URL verifier: 693 ms with no errors. Evidence is in
  `polish-artifacts/polish-5-live-check/`.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.06 s, CLS 0, TBT 15 ms. Raw report:
  `polish-artifacts/polish-5-lighthouse-live.json`.

No finding, known gap, or deferred minor item remains.
