# Adversarial first-read review 4 — PASS

Reviewed 28 August 2026 against the cold live deployment at
<https://recipe-passport.sociobot.in> and repository commit
`cca03e91608ece178b5befc6c2bd3c21d5470426`.

**Verdict: PASS.** This review found zero blocking, medium, or minor findings.
The product is clear before scrolling, the one-click demo is realistic and
isolated, all 19 registered claim commands pass from a clean clone, no public
claim is unlisted, all earlier findings remain fixed, and the complete site
structure check passes.

## Cold first read

Fresh, storage-free Chromium contexts opened `/` at 390 × 844 and 1440 × 900.
Both began at scroll position zero. Before scrolling, my interpretation was:

- **What it does:** moves recipes into a private, searchable cookbook stored
  on this device.
- **For whom:** cooks leaving a recipe app or a cluttered recipe page.
- **What to click first:** **Try it with sample data** to open a ready-made
  cookbook.

The exact supporting copy was “Move your recipes into a private cookbook.”,
“For cooks leaving an app or cluttered recipe page, it keeps a searchable copy
on this device.”, “Try it with sample data”, and “The sample opens a ready-made
cookbook.” The three facts “Stays on this device”, “Works offline after the
first visit”, and “Price: free” were also visible before scrolling. Their last
line ended at 712 CSS px on mobile and 883 CSS px on desktop. No first-read
blocker applies.

## Copy audit

Counts use whitespace-separated words; hyphenated words and URLs count as one.
The inventory includes headings, actions, labels, alternatives, and screen-
reader text so the heading and result-naming checks are explicit. Repeated
identical navigation labels are listed once. Code-block commands are not
sentences. No item exceeds 22 words, no banned marketing word appears, terms
are consistent, all real actions name their result, and every heading makes
sense in its rendered context.

### Live landing page

| Exact copy | Words | Check |
| --- | ---: | --- |
| Skip to main content | 4 | Pass — keyboard action |
| Recipe Passport | 2 | Pass — wordmark |
| Recipe Passport home | 3 | Pass — accessible link name |
| Main navigation | 2 | Pass — accessible label |
| Cookbook | 1 | Pass — navigation |
| Add recipe | 2 | Pass — navigation |
| Demo | 1 | Pass — navigation |
| Privacy | 1 | Pass — header and footer navigation |
| A cookbook on this device | 5 | Pass — one collection term |
| Move your recipes into a private cookbook. | 7 | Pass — job-first h1 |
| For cooks leaving an app or cluttered recipe page, it keeps a searchable copy on this device. | 17 | Pass — audience and outcome |
| Try it with sample data | 5 | Pass — result-naming primary action |
| Import your recipes | 3 | Pass — result-naming real action |
| The sample opens a ready-made cookbook. | 6 | Pass — action outcome |
| Import a Paprika file or paste one full recipe. | 9 | Pass — real path outcome |
| Product facts | 2 | Pass — accessible list name |
| Stays on this device | 4 | Pass — `local-only` |
| Works offline after the first visit | 6 | Pass — `offline-reload` |
| Price: free | 2 | Pass — `free-use` |
| A red recipe folio opens into a miniature paper kitchen archive. | 11 | Pass — image alternative |
| Your recipes, packed for the next kitchen. | 7 | Pass — art caption |
| The product | 2 | Pass — eyebrow, not a heading |
| Read the recipe, not the page around it. | 8 | Pass — clear h2 |
| 03 recipes | 2 | Pass — preview label |
| B / 01 | 3 | Pass — decorative preview index |
| Weeknight · Beans | 3 | Pass — sample categories |
| Tomato-braised butter beans | 3 | Pass — sample title |
| Serves 3 | 2 | Pass — sample yield |
| 7 ingredients | 2 | Pass — sample fact |
| Butter beans | 2 | Pass — sample ingredient |
| Crushed tomatoes | 2 | Pass — sample ingredient |
| Smoked paprika | 2 | Pass — sample ingredient |
| 4 steps | 2 | Pass — sample fact |
| Warm the oil. | 3 | Pass — sample step |
| Simmer for 18 minutes. | 4 | Pass — sample step |
| Fold in the parsley. | 4 | Pass — sample step |
| How it works | 3 | Pass — eyebrow |
| Carry recipes across in three steps. | 6 | Pass — clear h2 |
| 01 | 1 | Pass — step number |
| Import recipes | 2 | Pass — result-naming h3 |
| Choose a Paprika JSON file or paste one full recipe. | 10 | Pass — plain instruction |
| 02 | 1 | Pass — step number |
| Cook | 1 | Pass — established task h3 |
| Search by title or ingredient. | 5 | Pass — `search-cookbook` |
| Open a clean cooking view. | 5 | Pass — concrete outcome |
| 03 | 1 | Pass — step number |
| Print or export your cookbook | 5 | Pass — result-naming h3 |
| Print one recipe or export the whole cookbook as JSON. | 10 | Pass — registered claims |
| A tool, not another platform | 5 | Pass — eyebrow |
| Your cookbook does not need an account. | 7 | Pass — `no-account` |
| Recipe Passport processes your files in this browser. | 8 | Pass — `local-only` |
| It does not scrape recipe sites or publish your recipes. | 10 | Pass — `no-scraping`, `no-hosting` |
| Export a complete JSON copy before clearing browser data or changing devices. | 12 | Pass — action plus storage caution |
| Read the privacy note | 4 | Pass — result-naming link |
| Keep recipes. | 2 | Pass — footer line |
| Keep control. | 2 | Pass — footer line |
| Artwork generated for Recipe Passport. | 5 | Pass — provenance |
| No tracking. | 2 | Pass — `no-tracking` |
| No fonts load from other sites. | 6 | Pass — `no-tracking` |
| Footer navigation | 2 | Pass — accessible label |
| Terms | 1 | Pass — navigation |
| Built by Param Factory | 4 | Pass — named external destination |
| (external site) | 2 | Pass — screen-reader qualification |
| Recipe Passport build cca03e91608ece178b5befc6c2bd3c21d5470426 · Original generated artwork | 8 | Pass — deployment identity and provenance |

### README

| Exact copy | Words | Check |
| --- | ---: | --- |
| Recipe Passport | 2 | Pass — title |
| Move your recipes into a private offline cookbook. | 8 | Pass — job summary |
| Recipe Passport is for people leaving a recipe app or tired of cluttered recipe pages. | 15 | Pass — audience |
| It imports user-provided Paprika JSON and full pasted recipes into a searchable cookbook stored in the browser. | 17 | Pass — registered import, paste, search, and storage claims |
| Paprika imports and manual recipes retain supplied source details. | 9 | Pass — `source-retention` |
| A cook can print one clean recipe or export the whole cookbook as JSON. | 14 | Pass — print and export claims |
| Live site: https://recipe-passport.sociobot.in | 3 | Pass — live link |
| Try the isolated sample in one click: https://recipe-passport.sociobot.in/?demo=1 | 8 | Pass — demo link |
| What it does | 3 | Pass — clear heading |
| Imports Paprika JSON arrays and Recipe Passport JSON exports without losing saved fields. | 13 | Pass — `paprika-import`, `export-import-roundtrip` |
| Fills editable recipe fields from one pasted recipe with a title, Ingredients, and Method section. | 15 | Pass — `paste-recipe` |
| Adds or edits a recipe with ingredients, steps, yield, notes, categories, and source. | 13 | Pass — `recipe-fields` |
| Searches recipes by title, ingredient, category, note, or source. | 9 | Pass — `search-cookbook` |
| Opens a clean recipe view with checkable ingredients. | 8 | Pass — `ingredient-check` and live recipe view |
| Opens the browser print flow for paper or PDF output. | 10 | Pass — `print-recipe` |
| Exports every saved field in the recipe-passport/v1 JSON format. | 9 | Pass — `json-export` |
| Works offline after the first completed visit. | 7 | Pass — `offline-reload` |
| It does not scrape recipe sites, host recipes, or require an account. | 12 | Pass — three registered claims |
| Privacy and storage | 3 | Pass — clear heading |
| All processing happens in the browser. | 6 | Pass — `local-only` |
| Real recipes use localStorage["recipe-passport:v1:recipes"]. | 4 | Pass — exact documented key |
| Demo recipes use the separate sessionStorage["demo:recipe-passport:v1:recipes"] key. | 7 | Pass — `demo-isolation` |
| There are no analytics, third-party scripts, or fonts from other sites. | 11 | Pass — `no-tracking` |
| The app sends no recipe data to external APIs while you use it. | 13 | Pass — `local-only`, `no-hosting` |
| Browser storage is not a permanent backup. | 7 | Pass — honest limitation |
| Export the cookbook before clearing browser data or changing devices. | 10 | Pass — recovery instruction |
| See the demo contract, privacy, and terms. | 7 | Pass — links resolve |
| Develop | 1 | Pass — documentation heading |
| Requirements: Node.js 22 or newer and npm. | 7 | Pass — development requirement |
| Open http://localhost:5173. | 2 | Pass — instruction |
| The demo is at http://localhost:5173/demo. | 5 | Pass — instruction |
| Test | 1 | Pass — documentation heading |
| Playwright 1.58.2 is pinned because the factory image provides its browser build. | 12 | Pass — repository fact |
| Run one public claim with its tag: | 7 | Pass — instruction |
| The unit tests cover JSON normalization and errors. | 8 | Pass — verified repository fact |
| The browser suite covers every claim in .factory/claims.json, serious accessibility findings, keyboard use, mobile width, routes, empty states, and editing. | 20 | Pass — verified by the complete suite |
| Build and deploy | 3 | Pass — documentation heading |
| The exact production command is: | 5 | Pass — instruction |
| It creates dist/ with dist/index.html at the root. | 8 | Pass — build verified |
| Each build also writes dist/build-info.json and shows the exact Git commit in the footer, so a deployed artifact can be identified. | 21 | Pass — build and live identity verified |
| Deploy that directory to Azure Static Web Apps. | 8 | Pass — instruction |
| public/staticwebapp.config.json sets app routes, security headers, and cache rules. | 9 | Pass — repository fact |
| The repository does not manage DNS, billing, or deployment credentials. | 10 | Pass — scope limitation |
| Design and provenance | 3 | Pass — documentation heading |
| The product-specific visual system and where the generated artwork came from live in .factory/design.md. | 14 | Pass — documentation fact |
| The hero art was generated for this product with the factory image model and optimized locally to WebP. | 18 | Pass — documented provenance |
| License | 1 | Pass — heading |
| MIT. | 1 | Pass — license statement |
| See LICENSE. | 2 | Pass — link instruction |

Terminology remains consistent: the collection is a **cookbook**, one item is
a **recipe**, file intake is **import**, full-text intake is **paste one full
recipe**, downloading all data is **export**, the isolated sample is the
**demo**, cooking instructions are **steps**, and attribution is the **source**.

## Demo and sandbox

The live one-click demo passes every required behavior:

- Selecting **Try it with sample data** at `/?demo=1` opens `/demo` in one
  click. Its first screen already shows search, export, and three complete
  recipes: Tomato-braised butter beans, Lemon olive oil cake, and Cold sesame
  noodle salad.
- The persistent banner reads “Demo — sample data, nothing is saved to your
  cookbook.” It provides **Reset demo** and **Start for real**.
- A `lemon` search reduced the cookbook to one recipe. **Reset demo** cleared
  the search and restored the original three recipes.
- Before entering demo, I placed a serialized `review4-real` sentinel in
  `localStorage["recipe-passport:v1:recipes"]`. It remained byte-for-byte
  unchanged through demo entry and reset. **Start for real** deleted
  `sessionStorage["demo:recipe-passport:v1:recipes"]`, preserved the sentinel,
  removed the banner, and opened `/add`.
- The complete observed live flow made requests only to
  `https://recipe-passport.sociobot.in`, with no non-GET request and no console
  or page error. The live verifier also passed the service-worker-controlled
  offline reload and the 404-then-fresh-offline-route regression.

The documented namespaces and behavior in `.factory/demo.md` match the live
implementation and the registered `demo-isolation`, `local-only`,
`offline-reload`, `no-scraping`, `no-hosting`, and `no-tracking` tests.

## Claims gate

A fresh GitHub clone at `/tmp/tmp.IedxnRIEHQ/repo` checked out
`cca03e91608ece178b5befc6c2bd3c21d5470426`. `npm ci` completed with zero
vulnerabilities. I ran every literal command in `.factory/claims.json`
separately; all 19 passed.

| Claim ID | Result |
| --- | --- |
| `paprika-import` | Pass |
| `manual-add` | Pass |
| `paste-recipe` | Pass |
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
| `no-scraping` | Pass |
| `no-hosting` | Pass |
| `no-tracking` | Pass |
| `export-import-roundtrip` | Pass |
| `source-retention` | Pass |
| `recipe-fields` | Pass |

I then reread the live landing, demo, Privacy, and Terms pages, all route
metadata, and the README. Every claim-like sentence maps to one or more entries
above, an observable limitation, or a directly checked repository/build fact.
There is no unlisted claim and no untested registered claim.

The full clean-clone suite passed 9 Vitest unit tests and 36 Chromium tests.
`npm run lint` and `npm run build` passed. The build produced `dist/index.html`;
the entry JavaScript is 10.99 KB gzip and CSS is 4.91 KB gzip.

## Earlier finding verification

Every earlier review, polish report, verification report, and handoff was read.
Each earlier finding was checked in both the current live site and current code.

| Earlier finding | Current evidence | Status |
| --- | --- | --- |
| F-1-1 — unknown URLs returned 200 | `/missing-review-4` and both unknown recipe path forms return styled HTTP 404s; the config has a 404 response override and no wildcard recipe rewrite. | Fixed |
| F-1-2 — share metadata was identical | Raw HTML and runtime DOM agree on route-specific title, description, canonical, Open Graph, and Twitter data for Demo, Privacy, Terms, and sample recipes. | Fixed |
| F-1-3 — export/import was unregistered | `export-import-roundtrip` is registered and its complete saved-field comparison passes. | Fixed |
| F-1-4 — manual source retention was unregistered | `source-retention` checks manual and Paprika source names and safe URLs; it passes. | Fixed |
| F-1-5 — complete field editing was unregistered | `recipe-fields` adds, edits, reloads, and checks every named field; it passes. | Fixed |
| F-2-1 — unknown recipe IDs were soft 404s | Unknown path IDs return HTTP 404; browser-saved recipes use the server-known `/recipe?id=` route, whose reload test passes. | Fixed |
| F-2-2 — a 404 poisoned the offline shell | The worker never writes navigation responses into the shell; `offline-reload` passes the 404 then fresh offline `/add` sequence. | Fixed |
| F-2-3 — desktop omitted the action outcome and facts | All required content ends above 900 CSS px; the explicit desktop-fold test passes. | Fixed |
| F-2-4 — isolation test could miss real-data deletion | The test and this live review seed a non-empty real sentinel and require byte-for-byte preservation. | Fixed |
| F-2-5 — export test did not verify values | `json-export` deep-compares every exported demo recipe and field with the source storage value. | Fixed |
| F-2-6 — search test did not identify each result | Each title, ingredient, category, note, and source query asserts its one expected recipe. | Fixed |
| F-2-7 — generic JSON-array promise was unlisted | Public copy now says “Paprika JSON arrays” and “Recipe Passport JSON exports”, matching the two registered claims. | Fixed |
| F-2-8 — 404 shell was inconsistent | The static 404 uses the same wordmark, four-link header, footer statement, legal links, external label, and product styling. | Fixed |
| F-2-9 — sitemap omitted public demo routes | The sitemap lists all ten crawlable fixed routes, including `/demo/add` and all three sample recipes; its regression test passes. | Fixed |
| F-2-10 — “paste one recipe” required field-by-field entry | `/add` has a one-paste input that fills editable title, yield, ingredients, method, and notes locally; `paste-recipe` passes. | Fixed |
| F-2-11 — “archive” conflicted with “cookbook” | The first screen now says “A cookbook on this device”; the terminology audit uses “cookbook” consistently. | Fixed |
| F-2-12 — “Take it with you” did not name a result | The heading is “Print or export your cookbook.” | Fixed |
| F-2-13 — public copy used production jargon | Landing and README use the recorded plain rewrites for artwork, fonts, app routes, and provenance. | Fixed |
| F-3-1 — no-scraping/no-hosting promises were unlisted | Separate `no-scraping` and `no-hosting` claims reject source-site fetches and any recipe upload in demo and real flows. | Fixed |
| F-3-2 — no-tracking promise was unlisted | `no-tracking` permits only same-origin static GETs through both demo and real import flows; it passes. | Fixed |
| Verification 1 — candidate/deploy identity was missing | Live `/build-info.json`, footer, checkout, and service-worker cache name all identify `cca03e9…`. | Fixed |
| Verification 1 — storage quota produced false success | The 5,600,116-byte quota regression keeps the user on import, reports storage full, and persists nothing; it passes. | Fixed |
| Verification 1 — live behavior differed from claims | Live identity matches the reviewed commit; schema, sample routes, and delete with Undo match the passing suite. | Fixed |
| Verification 1 — Back/Forward lost focus | Fresh live Back and Forward checks focus the destination h1. | Fixed |
| Verification 1 — mobile targets were below 44 px | The 390 px keyboard/target test passes for wordmark, legal links, ingredient checkbox, and ingredient row. | Fixed |
| Verification 1 — asset cache headers were wrong | Hashed assets use one-year immutable caching and `/sw.js` uses `no-cache`; the unit test passes. | Fixed |
| Verification 1 — sample source link was dead | “Family recipe card” is retained as source text without a dead outbound URL; its regression test passes. | Fixed |

No earlier item is unfixed, half-fixed, or regressed.

## Structure, accessibility, and visual identity

- Live and raw route checks pass for `/`, `/demo`, `/cookbook`, `/add`,
  `/demo/add`, `/privacy`, `/terms`, all three fixed sample recipes, and the
  designed 404. Titles follow the route pattern and are below 60 characters.
  Each page has `lang="en"`, one main, one meaningful h1, a short description,
  canonical URL, matching Open Graph/Twitter data, favicon, and 180 px touch
  icon. The social image is a real 1200 × 630 product asset.
- The sitemap lists every fixed public route. A crawl of every discovered
  product link, edit query, build-info link, and the external Sociobot link
  returned 200. The two contact links are explicit `mailto:` links.
- Deep links and reloads work. In-app navigation and browser Back/Forward move
  focus to the destination h1. The header/footer skeleton is consistent and
  includes Privacy and Terms. Unknown general and recipe paths return HTTP 404
  with the designed return-home page.
- The full Playwright Axe integration found no serious or critical issue on
  the landing, demo, sample recipe, Privacy, Terms, or 404 pages. Keyboard,
  390 px overflow and target size, empty/error states, and route focus are
  covered by the passing suite; reduced motion is enforced in the inspected
  stylesheet.
  `/opt/fleet/lib/verify-url.sh` passed the cold live URL in 1,643 ms with no
  console errors, one h1, `lang="en"`, one main, complete alt text, and named
  buttons.
- The visual identity is recognizably product-specific: tomato passport
  folios, clipped paper corners, tactile kitchen-archive artwork, cream paper,
  herb-green sections, mustard marks, and bookish type implement
  `.factory/design.md`. It is not a centered gradient hero or generic
  three-card SaaS template. The authored/generated asset provenance is stated.

## Missed leverage

No obvious brief-implied feature is missing. Paprika import, one-paste intake,
source retention, full JSON export/re-import, search, printing, and local
editing cover the stated job. Sync would conflict with the current local-only,
no-account contract. An AI step would be decorative here: the local parser
already performs the implied extraction without sending recipe text or asking
for a key. No provider key or AI endpoint is embedded.

## What would make this perfect

Nothing remains to change from this review. Preserve the one-click sandbox,
claim-per-promise discipline, route metadata/404 tests, and live build identity
on future releases; a regression in any of them should reopen the relevant
historical finding.
