# Polish round 2 — review finding closure

Completed 28 August 2026 for `recipe-passport-polish-2`, repairing review
commit `24a14c70f8660ee6e62fcbeb453aa339d589eb89`.

| Finding | Change made | Evidence | Screenshot / live check |
| --- | --- | --- | --- |
| F-2-1 | Replaced unbounded real and demo recipe path rewrites with fixed `/recipe?id=` and `/demo/recipe?id=` routes. Kept only the three shipped sample paths. | `returns HTTP 404 and not-found metadata for unknown recipe URL paths`; `reloads a stored recipe from the real query route` | `polish-artifacts/polish-2-404.png`; after deploy, `/recipe/not-a-real-recipe` and `/demo/recipe/not-a-real-recipe` return 404. |
| F-2-2 | The service worker now precaches its shell and never writes a navigation response into it. | `@claim:offline-reload reloads the demo and a fresh app route after a 404 without a network` | Offline regression is included in `verify:live`. |
| F-2-3 | Reduced the desktop hero’s visual height and moved its copy upward without changing the paper-passport art direction. | `keeps the action outcome and all three facts in the desktop first screen` | `polish-artifacts/polish-2-home-desktop.png`; 1440 × 900 assertion passes. |
| F-2-4 | Demo-isolation test now seeds a byte-for-byte real-cookbook sentinel before editing, exiting, and resetting demo data. | `@claim:demo-isolation discards demo changes before real use` | Verified in the browser claim test. |
| F-2-5 | Export claim reads the source demo cookbook before download and deep-compares every exported field. | `@claim:json-export downloads every demo recipe as JSON` | Verified in the browser claim test. |
| F-2-6 | Search claim pairs each indexed query with its only expected recipe title. | `@claim:search-cookbook searches by ingredient` | Verified in the browser claim test. |
| F-2-7 | Narrowed all public JSON-array wording to Paprika JSON arrays and Recipe Passport exports. | Copy audit and `paprika-import` / `export-import-roundtrip` claims | README and import screen checked in browser. |
| F-2-8 | Rebuilt the static 404 with the same wordmark, four-link header, footer statement, legal links, build id, and screen-reader external label. | `serves a real styled HTTP 404 with a working return path` and Axe | `polish-artifacts/polish-2-404.png`; live 404 check after deploy. |
| F-2-9 | Added `/demo/add` and all three fixed demo recipe URLs to `sitemap.xml`. | Static deployment unit test and built sitemap inspection | Built `dist/sitemap.xml` contains all public routes. |
| F-2-10 | Added local one-paste intake. It parses title, yield, Ingredients, Method, Notes, Source, and Categories into editable fields; no data leaves the browser. | `@claim:paste-recipe fills editable fields from one full pasted recipe`; unit parser test | `polish-artifacts/polish-2-paste.png`; live form check in `verify:live`. |
| F-2-11 | Rewrote the landing eyebrow to “A cookbook on this device.” | `.factory/copy-audit.md` terminology table | Home screenshot above. |
| F-2-12 | Rewrote the step heading to “Print or export your cookbook.” | `.factory/copy-audit.md` | Home screenshot above. |
| F-2-13 | Rewrote artwork, font, API, route, and design documentation language in plain words. | `.factory/copy-audit.md`, README review | Footer and README checked in browser/source. |

## Cumulative earlier findings

The F-1 claims, demo isolation, route metadata, title/canonical behavior,
legal links, focus restoration, mobile targets, quota failure, Undo, immutable
asset caching, and sample-source-link regressions remain covered by the unit
and Playwright suite. F-1-1 is closed fully by F-2-1’s removal of the last two
wildcard soft-404 routes.

## Local evidence before deploy

- `CI=1 npm test`: 8 unit tests and 33 Chromium tests pass.
- `CI=1 npm run lint` and `CI=1 npm run build`: pass; `dist/index.html` is present.
- Built initial JavaScript is 10,974 bytes gzip; CSS is 4,921 bytes gzip.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173`: pass (580 ms,
  title/lang/main/h1/alts/button names, zero console errors).
- Playwright Axe checks pass on landing, demo, sample recipe, Privacy, Terms,
  and 404 with no serious or critical findings.

## Deployed evidence

Azure Static Web Apps final deployment `5d07d323-19b4-4b42-955f-539aa3091552`
published product build `a114361549287d665cbbd18f1e505cef073ecea1`.
`npm run verify:live` and `/opt/fleet/lib/verify-url.sh` both passed against a
cold `https://recipe-passport.sociobot.in`. The live verifier covers every
mapping above, including unknown recipe HTTP 404s, the offline poisoning
sequence, desktop fold, isolated demo data, one-paste intake, route metadata,
Axe, privacy, and legal links.
