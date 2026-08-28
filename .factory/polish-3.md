# Polish round 3 — cumulative finding closure

Completed 28 August 2026 for `recipe-passport-polish-3`. The deployed build is
`d25f32370e79ef009745390222cef1d5d6c162df` (confirmed from live
`/build-info.json`); Azure Static Web Apps deployment
`2943b8d0-e368-446b-81f9-129141aef496` is serving it. Every finding in all
three reviews is closed. Earlier repairs were retained and tested again; this
round adds the missing privacy claims and a sitemap regression test.

| Finding | Change made | Test evidence | Screenshot | Cold live URL check |
| --- | --- | --- | --- | --- |
| F-1-1 | Kept the static, styled 404 and Azure response override; unknown paths are not rewritten as successful pages. | `serves a real styled HTTP 404 with a working return path` | [404](polish-artifacts/polish-3-404-live.png) | `/missing-page` → HTTP 404 with Return home. |
| F-1-2 | Kept route-specific static and runtime title, description, canonical, Open Graph, and Twitter metadata. | `serves and maintains route-accurate share metadata` | [demo](polish-artifacts/polish-3-demo-live.png) | Verifier checked `/demo`, `/privacy`, `/terms`, and a sample recipe. |
| F-1-3 | Kept `export-import-roundtrip` and its complete field comparison. | `@claim:export-import-roundtrip preserves every recipe and saved field` | [demo](polish-artifacts/polish-3-demo-live.png) | Live verifier exported then re-imported `/demo`. |
| F-1-4 | Kept provenance retention for manual and Paprika recipes. | `@claim:source-retention keeps supplied manual and Paprika provenance` | [demo](polish-artifacts/polish-3-demo-live.png) | Live verifier checked a safe source name and URL after import. |
| F-1-5 | Kept full add, edit, reload coverage for ingredients, steps, yield, notes, categories, and source. | `@claim:recipe-fields adds and edits every documented recipe field` | [demo](polish-artifacts/polish-3-demo-live.png) | Live verifier checked every edited field. |
| F-2-1 | Kept fixed known recipe routes and query routes so unknown recipe paths remain real 404s. | `returns HTTP 404 and not-found metadata for unknown recipe URL paths` | [404](polish-artifacts/polish-3-404-live.png) | `/recipe/not-a-real-recipe` → HTTP 404. |
| F-2-2 | Kept the precached shell that never caches a navigation 404. | `@claim:offline-reload reloads the demo and a fresh app route after a 404 without a network` | [demo](polish-artifacts/polish-3-demo-live.png) | Live verifier passed the poisoned-404 offline sequence. |
| F-2-3 | Kept the compact hero placement that includes the outcome and all three facts above the fold. | `keeps the action outcome and all three facts in the desktop first screen` | [mobile home](polish-artifacts/polish-3-home-mobile-live.png) | `/` passed cold 390 px and 1440 px fold checks. |
| F-2-4 | Kept separate demo session storage and discard-on-exit behaviour. | `@claim:demo-isolation discards demo changes before real use` | [demo](polish-artifacts/polish-3-demo-live.png) | `/demo` reset preserved a real-storage sentinel. |
| F-2-5 | Kept export comparison against the full source cookbook rather than a schema-only check. | `@claim:json-export downloads every demo recipe as JSON` | [demo](polish-artifacts/polish-3-demo-live.png) | Live verifier deep-compared the `/demo` export. |
| F-2-6 | Kept one-result search assertions for title, ingredient, category, note, and source. | `@claim:search-cookbook searches by ingredient` | [demo](polish-artifacts/polish-3-demo-live.png) | `/demo` search remained usable in the final verifier. |
| F-2-7 | Kept public JSON wording limited to Paprika arrays and Recipe Passport exports. | `@claim:paprika-import`; `@claim:export-import-roundtrip` | [mobile home](polish-artifacts/polish-3-home-mobile-live.png) | `/add` import flow passed in the live verifier. |
| F-2-8 | Kept the product-styled static 404 header, footer, legal links, build id, and return action. | `serves a real styled HTTP 404 with a working return path` plus Axe | [404](polish-artifacts/polish-3-404-live.png) | `/missing-page` passed the live 404 and return-link check. |
| F-2-9 | Added a regression test for every crawlable static route in `sitemap.xml`. | `lists every crawlable static route in the sitemap` | [demo](polish-artifacts/polish-3-demo-live.png) | Sitemap routes and `/demo` returned 200; unknown routes returned 404. |
| F-2-10 | Kept local one-paste parsing into editable fields. | `@claim:paste-recipe fills editable fields from one full pasted recipe` | [mobile home](polish-artifacts/polish-3-home-mobile-live.png) | Live verifier filled title and ingredients at `/add`. |
| F-2-11 | Kept `cookbook` as the sole collection term on the first screen. | `.factory/copy-audit.md` | [mobile home](polish-artifacts/polish-3-home-mobile-live.png) | `/` cold read matched the terminology audit. |
| F-2-12 | Kept the result-naming “Print or export your cookbook” heading. | `.factory/copy-audit.md` | [mobile home](polish-artifacts/polish-3-home-mobile-live.png) | `/` passed the cold first-screen check. |
| F-2-13 | Kept plain wording for provenance and technical documentation. | `.factory/copy-audit.md` | [demo footer](polish-artifacts/polish-3-demo-live.png) | `/demo` footer shows plain artwork provenance. |
| F-3-1 | Added separately registered `no-scraping` and `no-hosting` claims. Tests save source-marked recipes in demo and real modes, reject source-site fetches, and reject recipe uploads. | `@claim:no-scraping never requests recipes from source sites`; `@claim:no-hosting never uploads or hosts recipe data` | [demo](polish-artifacts/polish-3-demo-live.png) | Live verifier observed no source URL fetch and only static GET requests. |
| F-3-2 | Added the registered `no-tracking` claim. It runs the query demo and a real local-file import while allowing only static app traffic. | `@claim:no-tracking makes only static app requests during demo and real flows` | [demo](polish-artifacts/polish-3-demo-live.png) | Live verifier observed no analytics, ads, or telemetry requests. |

## Final evidence

- Final remote clean clone: `/tmp/recipe-passport-polish3-final.dXaPnu/repo` at
  `d25f32370e79ef009745390222cef1d5d6c162df`.
- `npm ci` completed with zero vulnerabilities. All 19 literal claim commands
  from `.factory/claims.json` passed independently.
- Final full suite: 9 Vitest unit tests and 36 Chromium tests passed; `npm run
  lint` and `npm run build` passed. The built entry is `dist/index.html`; gzip
  sizes are 10.99 KB JS and 4.91 KB CSS.
- `/opt/fleet/lib/verify-url.sh` passed cold against production with 865 ms
  load time, no console errors, one `h1`, `lang="en"`, one main landmark, and
  no missing image alt or unnamed buttons. Its output is in
  `polish-artifacts/polish-3-live-check/`.
- `npm run verify:live` passed cold against production, covering first screen,
  query demo/reset/isolation, offline reload, all privacy-network assertions,
  metadata, Axe, responsive layout, legal routes, and HTTP 404s.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.1 s, CLS 0, TBT 10 ms. Raw report:
  `polish-artifacts/polish-3-lighthouse.json`.

There are no known gaps or deferred findings.
