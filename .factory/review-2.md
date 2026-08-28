# Adversarial first-read review 2 — FAIL

Reviewed 28 August 2026 against live <https://recipe-passport.sociobot.in>
and repository commit `aef13759872af439b8b8708b2b12d6679ba514d6`.

**Verdict: FAIL.** Two blocking defects remain. A not-found navigation can
replace the cached app shell and break an offline route, and unknown recipe
IDs are still served as successful pages with incorrect raw metadata. Eleven
additional findings cover the desktop first screen, claim-test strength,
site structure, copy, and the paste-recipe job. PASS requires zero findings
and no untested part of a claim.

## Cold first read

Fresh browser contexts opened the live home page at 390 × 844 and 1440 × 900,
at scroll position zero, with no prior storage.

Before scrolling, my first-time interpretation was:

- **What it does:** moves recipes into a private, searchable cookbook on this
  device.
- **For whom:** cooks leaving a recipe app or a cluttered recipe page.
- **What to click first:** **Try it with sample data** to see the product.

The exact visible text supporting those answers was “Move your recipes into a
private cookbook.”, “For cooks leaving an app or cluttered recipe page, it
keeps a searchable copy on this device.”, and “Try it with sample data”. All
three answers are available without scrolling at both widths, so the explicit
first-read clarity blocker does not fire.

At 390 px, the action explanation and all three facts also fit above the 844 px
fold. At 1440 × 900, the action explanation starts at y=894 and the facts start
at y=961; they are not available in the first screen. That separate structure
failure is F-2-3.

## Findings

### F-2-1 — BLOCKING — unknown recipe IDs are successful soft 404s (reopens F-1-1)

- **Exact location/evidence:** live
  `/demo/recipe/not-a-real-recipe` and `/recipe/not-a-real-recipe` both return
  HTTP 200. JavaScript later renders “This recipe card slipped away.” The raw
  demo response says `<title>Demo — Recipe Passport</title>` with canonical
  `/demo`; the raw real response says `<title>Recipe Passport — Keep recipes
  offline</title>` with canonical `/`. `public/staticwebapp.config.json`
  rewrites both `/demo/recipe/*` and `/recipe/*` to successful app documents.
- **Why this fails:** a crawler, link checker, or client without JavaScript is
  told that a nonexistent recipe exists and receives metadata for another
  page. The earlier unknown-URL defect is only fixed outside the two wildcard
  recipe namespaces, so F-1-1 is half-fixed rather than closed. Broken routing
  is blocking under this review contract.
- **Concrete fix:** choose a route design whose server-known path is real and
  whose client-only ID is data, or add a server/edge lookup that returns the
  styled 404 with status 404 for unknown IDs. At minimum, add deployed tests
  for unknown `/recipe/<id>` and `/demo/recipe/<id>` URLs that assert HTTP 404
  plus not-found metadata before JavaScript. Keep tests proving that valid
  stored deep links still reload.

### F-2-2 — BLOCKING — visiting a 404 can break the offline claim

- **Exact location/evidence:** `public/sw.js`, navigation fetch handler. Every
  fetched navigation response, including a 404, is written to `/index.html`.
  Live reproduction: open `/demo`, wait for service-worker control, open
  `/missing-offline-poison-3`, wait for the cache write, and inspect
  `/index.html`; it has status 404 and title “Not found — Recipe Passport”. Go
  offline and open the previously unvisited `/add`; the response is HTTP 404
  and the page is “This recipe card slipped away.” instead of the add screen.
- **Why this fails:** the landing page and README promise “Works offline after
  the first visit.” A routine bad link can replace the offline app shell with a
  document that has no app script. The registered `offline-reload` command
  passes because it only reloads `/demo` immediately after visiting `/demo`.
- **Concrete fix:** never overwrite the immutable app-shell cache from an
  arbitrary navigation, or cache only a successful response known to contain
  the app module. Add a claim regression: establish service-worker control,
  visit an HTTP 404, wait for cache completion, block the network, and open a
  fresh app route such as `/add`; assert the add screen and a non-error status.

### F-2-3 — Medium — the desktop first screen omits the action outcome and facts

- **Exact quote/location:** home at 1440 × 900. “The sample opens a ready-made
  cookbook.” begins below the fold at y=894–937. “Stays on this device”, “Works
  offline after the first visit”, and “Price: free” begin at y=961, y=992, and
  y=1022.
- **Why this fails:** the required first-screen shape puts the primary action,
  what happens next, and the three facts together. The oversized desktop
  headline and hero push the proof below the first screen.
- **Concrete fix:** reduce the desktop headline/hero height or place the short
  outcome and facts beside the actions. Add a 1440 × 900 fold assertion for
  the explanation and all three facts, alongside the existing 390 px test.

### F-2-4 — Medium — demo isolation test cannot detect deletion of existing real data

- **Exact location:** `tests/e2e/claims.spec.ts`,
  `@claim:demo-isolation`. It starts with cleared storage and finishes by
  asserting `{ demo: null, real: null }`.
- **Why this fails:** an implementation that incorrectly clears a user's real
  cookbook would still pass because the real key starts empty. The claim says
  demo changes use separate storage; the review instruction specifically asks
  whether real data is untouched.
- **Concrete fix:** seed `localStorage["recipe-passport:v1:recipes"]` with a
  realistic sentinel cookbook, change and reset the demo, select Start for
  real, and assert the real value is byte-for-byte unchanged. The live code
  passed that stronger manual check in this review.

### F-2-5 — Medium — complete-export claim test does not verify exported values

- **Exact location:** `tests/e2e/claims.spec.ts`, `@claim:json-export`. The test
  checks schema, array length, and the field names on only `recipes[0]`.
- **Why this fails:** the test passes if recipe values are blank, changed, or
  assigned to the wrong records. `@claim:export-import-roundtrip` compares the
  re-imported file with the same downloaded file, so it does not independently
  prove that the export matches the source cookbook.
- **Concrete fix:** read the demo recipes from session storage before export
  and deep-compare every downloaded recipe and field with that source array.

### F-2-6 — Medium — search claim test does not identify the matching recipe

- **Exact location:** `tests/e2e/claims.spec.ts`, `@claim:search-cookbook`.
  For `tahini`, `Baking`, `yogurt`, and `Family recipe card`, the loop asserts
  only “1 recipe”. It checks the expected title only after the last query.
- **Why this fails:** returning any one card for the first four searches would
  satisfy the test. The registered sandbox says to assert the matching sample
  recipe for each indexed field.
- **Concrete fix:** pair each query with its expected recipe title and assert
  that title is the only visible result on every iteration.

### F-2-7 — Medium — README makes an unlisted generic JSON-array claim

- **Exact quote/location:** README, What it does: “Imports Paprika JSON, JSON
  arrays, and Recipe Passport JSON exports without losing saved fields.”
- **Why this fails:** `paprika-import` covers a Paprika array and
  `export-import-roundtrip` covers the product envelope. No claim entry defines
  or tests arbitrary “JSON arrays”, so the sentence promises a broader import
  format than the register proves.
- **Concrete fix:** write “Imports Paprika JSON arrays and Recipe Passport JSON
  exports without losing saved fields.” If generic arrays are intended, add a
  separately defined schema, claim, fixture, and tagged test.

### F-2-8 — Medium — the static 404 does not use the consistent site header and footer

- **Exact location:** live `/missing-review-2` and `public/404.html`. The header
  has a text “RP” mark and no Cookbook, Add recipe, Demo, or Privacy navigation.
  The footer omits “Keep recipes. Keep control.” The footer's “(external site)”
  text is inside a `hidden` span, so the Sociobot link's accessible name does
  not identify it as external.
- **Why this fails:** the site-structure contract requires a consistent header
  and footer on every route and requires external links to say so. The 404 is
  styled, but it is a parallel skeleton.
- **Concrete fix:** generate the static 404 from the shared shell, including
  the same wordmark, navigation, one-line description, footer links, build ID,
  and screen-reader-visible external-site label. Keep the HTTP 404 status.

### F-2-9 — Medium — the sitemap omits real routes

- **Exact location:** `public/sitemap.xml` lists `/`, `/demo`, `/cookbook`,
  `/add`, `/privacy`, and `/terms`. It omits `/demo/add` and the three shipped,
  pre-rendered sample-recipe routes.
- **Why this fails:** those URLs return 200, have route-specific metadata, and
  are part of the public demo. The site-structure contract requires every real
  route in the sitemap.
- **Concrete fix:** add `/demo/add` and the three sample recipe URLs, or
  document and implement an intentional `noindex` policy for non-landing app
  states and make sitemap generation enforce that policy.

### F-2-10 — Medium — “paste one recipe” is a field-by-field form, not a one-paste path

- **Exact quote/location:** landing, “Import accepts Paprika JSON or a pasted
  recipe.” README, “It imports user-provided Paprika JSON and pasted recipes”.
  Add page heading, “Paste one recipe”. The page actually requires separate
  title, ingredients, and steps fields; there is no single full-recipe input.
- **Why this fails:** a person arriving with recipe text reasonably expects to
  paste it once. The brief explicitly says “paste a recipe”; the current flow
  makes the user separate and re-paste every part.
- **Concrete fix:** add one “Paste full recipe text” input that locally parses
  common title/Ingredients/Method sections into an editable preview. Keep the
  existing fields as the non-AI fallback. Optional cleanup may use the
  Sociobot gateway only after explicit consent, show exactly what is sent,
  support undo, and use a recorded fixture claim test; never embed a provider
  key. Until then, change the copy to “Fill in a recipe”.

### F-2-11 — Low — landing copy uses two words for the same collection

- **Exact quote/location:** landing eyebrow “A local recipe archive” beside
  the headline “Move your recipes into a private cookbook.”
- **Why this fails:** the documented terminology table says the collection is
  always a “cookbook”. “Archive” introduces another term before the job is
  established.
- **Concrete rewrite:** “A cookbook on this device”.

### F-2-12 — Low — one step heading does not name its result

- **Exact quote/location:** landing h3, “Take it with you”.
- **Why this fails:** in a screen-reader heading list, “it” has no referent and
  the heading does not name the print/export result.
- **Concrete rewrite:** “Print or export your cookbook”.

### F-2-13 — Low — public-facing copy uses unexplained production jargon

- **Exact quotes/locations:** landing footer, “Generated editorial imagery.”
  and “No tracking or remote fonts.” README, “runtime API calls”, “SPA
  routing”, and “generated-asset provenance”.
- **Why this fails:** “editorial imagery”, “remote fonts”, “runtime”, “SPA”,
  and “provenance” require product or web-development context. The same facts
  can be stated directly.
- **Concrete rewrites:** “Artwork generated for Recipe Passport.”; “No
  tracking. No fonts load from other sites.”; “The app sends no recipe data to
  external APIs while you use it.”; “sets app routes, security headers, and
  caching rules”; and “records where the generated artwork came from.”

## Copy audit

Counts use whitespace-separated words; hyphenated terms and URLs count as one
word. Sentence-like interface labels, headings, actions, image alternatives,
and footer text are included so button and out-of-context-heading checks are
explicit. No item exceeds 22 words. No banned marketing word appears. All
actions name a result. `Flag` references the findings above.

### Live landing page

| Exact copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Recipe Passport | 2 | Pass |
| Cookbook | 1 | Pass |
| Add recipe | 2 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| A local recipe archive | 4 | **F-2-11** |
| Move your recipes into a private cookbook. | 7 | Pass |
| For cooks leaving an app or cluttered recipe page, it keeps a searchable copy on this device. | 17 | Pass |
| Try it with sample data | 5 | Pass — result-naming demo action |
| Import your recipes | 3 | Pass — result-naming action |
| The sample opens a ready-made cookbook. | 6 | Pass; desktop placement is F-2-3 |
| Import accepts Paprika JSON or a pasted recipe. | 8 | **F-2-10** |
| Stays on this device | 4 | Pass; mapped to `local-only` |
| Works offline after the first visit | 6 | **F-2-2** |
| Price: free | 2 | Pass; mapped to `free-use` |
| A red recipe folio opens into a miniature paper kitchen archive. | 11 | Pass — image alternative |
| Your recipes, packed for the next kitchen. | 7 | Pass |
| The product | 2 | Pass — non-heading eyebrow |
| Read the recipe, not the page around it. | 8 | Pass |
| 03 recipes | 2 | Pass — preview label |
| B / 01 | 3 | Pass — visual index |
| Weeknight · Beans | 3 | Pass — sample category |
| Tomato-braised butter beans | 3 | Pass — sample title |
| Serves 3 | 2 | Pass |
| 7 ingredients | 2 | Pass |
| Butter beans | 2 | Pass |
| Crushed tomatoes | 2 | Pass |
| Smoked paprika | 2 | Pass |
| 4 steps | 2 | Pass |
| Warm the oil. | 3 | Pass |
| Simmer for 18 minutes. | 4 | Pass |
| Fold in the parsley. | 4 | Pass |
| How it works | 3 | Pass |
| Carry recipes across in three steps. | 6 | Pass |
| Import | 1 | Pass |
| Choose a Paprika JSON file or paste your recipe. | 9 | **F-2-10** |
| Cook | 1 | Pass |
| Search by title or ingredient. | 5 | Pass; mapped to `search-cookbook` |
| Open a clean cooking view. | 5 | Pass |
| Take it with you | 4 | **F-2-12** |
| Print one recipe or export the whole cookbook as JSON. | 10 | Pass; mapped to `print-recipe` and `json-export` |
| A tool, not another platform | 5 | Pass — non-heading eyebrow |
| Your cookbook does not need an account. | 7 | Pass; mapped to `no-account` |
| Recipe Passport processes your files in this browser. | 8 | Pass; mapped to `local-only` |
| It does not scrape recipe sites or publish your recipes. | 10 | Pass; confirmed by network/source inspection |
| Export a complete JSON copy before clearing browser data or changing devices. | 12 | **F-2-5** |
| Read the privacy note | 4 | Pass — result-naming link |
| Keep recipes. | 2 | Pass |
| Keep control. | 2 | Pass |
| Generated editorial imagery. | 3 | **F-2-13** |
| No tracking or remote fonts. | 5 | **F-2-13**; behavior maps to `local-only` |
| Privacy | 1 | Pass |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass; the SPA identifies it as external |
| Recipe Passport build aef13759872af439b8b8708b2b12d6679ba514d6 · Original generated artwork | 8 | Pass — live build identity |

### README

| Exact copy | Words | Result |
| --- | ---: | --- |
| Recipe Passport | 2 | Pass — document title |
| Move your recipes into a private offline cookbook. | 8 | Pass |
| Recipe Passport is for people leaving a recipe app or tired of cluttered recipe pages. | 15 | Pass |
| It imports user-provided Paprika JSON and pasted recipes into a searchable cookbook stored in the browser. | 16 | **F-2-10** |
| Paprika imports and manual recipes retain supplied source details. | 9 | Pass; mapped to `source-retention` |
| A cook can print one clean recipe or export the whole cookbook as JSON. | 14 | Pass; mapped to `print-recipe` and `json-export` |
| Live site: https://recipe-passport.sociobot.in | 3 | Pass |
| Try the isolated sample in one click: https://recipe-passport.sociobot.in/?demo=1 | 8 | Pass |
| What it does | 3 | Pass — heading |
| Imports Paprika JSON, JSON arrays, and Recipe Passport JSON exports without losing saved fields. | 14 | **F-2-7** |
| Adds or edits a recipe with ingredients, steps, yield, notes, categories, and source. | 13 | Pass; mapped to `recipe-fields` |
| Searches recipes by title, ingredient, category, note, or source. | 9 | **F-2-6** |
| Opens a clean recipe view with checkable ingredients. | 8 | Pass; mapped to `ingredient-check` |
| Opens the browser print flow for paper or PDF output. | 10 | Pass; mapped to `print-recipe` |
| Exports every saved field in the recipe-passport/v1 JSON format. | 9 | **F-2-5** |
| Works offline after the first completed visit. | 7 | **F-2-2** |
| It does not scrape recipe sites, host recipes, or require an account. | 12 | Pass; mapped to `local-only` and `no-account` |
| Privacy and storage | 3 | Pass — heading |
| All processing happens in the browser. | 6 | Pass; mapped to `local-only` |
| Real recipes use localStorage["recipe-passport:v1:recipes"]. | 4 | Pass — exact storage key |
| Demo recipes use the separate sessionStorage["demo:recipe-passport:v1:recipes"] key. | 7 | **F-2-4** |
| There are no analytics, third-party scripts, remote fonts, or runtime API calls. | 12 | **F-2-13**; behavior maps to `local-only` |
| Browser storage is not a permanent backup. | 7 | Pass — limitation |
| Export the cookbook before clearing browser data or changing devices. | 10 | Pass |
| See the demo contract, privacy, and terms. | 7 | Pass |
| Develop | 1 | Pass — heading |
| Requirements: Node.js 22 or newer and npm. | 7 | Pass — developer requirement |
| Open http://localhost:5173. | 2 | Pass |
| The demo is at http://localhost:5173/demo. | 5 | Pass |
| Test | 1 | Pass — heading |
| Playwright 1.58.2 is pinned because the factory image provides its browser build. | 12 | Pass — repository fact |
| Run one public claim with its tag: | 7 | Pass |
| The unit tests cover JSON normalization and errors. | 8 | Pass — repository fact |
| The browser suite covers every claim in .factory/claims.json, serious accessibility findings, keyboard use, mobile width, routing, empty states, and editing. | 20 | **F-2-1, F-2-4, F-2-5, F-2-6** — suite coverage is incomplete |
| Build and deploy | 3 | Pass — heading |
| The exact production command is: | 5 | Pass |
| It creates dist/ with dist/index.html at the root. | 8 | Pass — build verified |
| Each build also writes dist/build-info.json and shows the exact Git commit in the footer, so a deployed artifact can be identified. | 21 | Pass — build identity verified |
| Deploy that directory to Azure Static Web Apps. | 8 | Pass |
| public/staticwebapp.config.json supplies SPA routing, security headers, and cache rules. | 9 | **F-2-13** |
| The repository does not manage DNS, billing, or deployment credentials. | 10 | Pass — repository scope |
| Design and provenance | 3 | Pass — heading |
| The product-specific visual system and generated-asset provenance live in .factory/design.md. | 10 | **F-2-13** |
| The hero art was generated for this product with the factory image model and optimized locally to WebP. | 18 | Pass — documented provenance |
| License | 1 | Pass — heading |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

## Demo and sandbox

The core demo path passes on the live deployment:

- One click on **Try it with sample data** opens `/demo` with three complete
  recipes already visible.
- The persistent banner says “Demo — sample data, nothing is saved to your
  cookbook.” and provides **Reset demo** and **Start for real**.
- Editing a sample and selecting Reset restored the original three samples.
- A pre-existing real recipe was seeded before demo entry. Demo edit, Reset,
  and Start for real left its serialized local-storage value byte-for-byte
  unchanged; the demo session key was removed on exit.
- A complete live flow made requests only to the product origin.
- Ordinary offline reload of `/demo` passes. The poisoned-shell sequence in
  F-2-2 fails.

## Claims

A fresh clone at `/tmp/recipe-passport-review2-clean.exhVO9` ran `npm ci` with
zero vulnerabilities. Every literal command in `.factory/claims.json` was run
separately. All commands returned zero; no registered command itself failed.

| Claim ID | Registered command | Result |
| --- | --- | --- |
| `paprika-import` | `npm test -- --grep @claim:paprika-import` | Pass |
| `manual-add` | `npm test -- --grep @claim:manual-add` | Pass |
| `search-cookbook` | `npm test -- --grep @claim:search-cookbook` | Pass, but under-asserted: F-2-6 |
| `json-export` | `npm test -- --grep @claim:json-export` | Pass, but under-asserted: F-2-5 |
| `print-recipe` | `npm test -- --grep @claim:print-recipe` | Pass |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | Pass, but broader live exercise fails: F-2-2 |
| `local-only` | `npm test -- --grep @claim:local-only` | Pass |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | Pass, but under-asserted: F-2-4 |
| `free-use` | `npm test -- --grep @claim:free-use` | Pass |
| `recipe-management` | `npm test -- --grep @claim:recipe-management` | Pass |
| `ingredient-check` | `npm test -- --grep @claim:ingredient-check` | Pass |
| `no-account` | `npm test -- --grep @claim:no-account` | Pass |
| `export-import-roundtrip` | `npm test -- --grep @claim:export-import-roundtrip` | Pass |
| `source-retention` | `npm test -- --grep @claim:source-retention` | Pass |
| `recipe-fields` | `npm test -- --grep @claim:recipe-fields` | Pass |

The only unlisted product claim found is the generic “JSON arrays” import
statement in F-2-7. Repository/build statements were checked as repository
facts rather than treated as customer-facing product claims.

## History verification

Every prior review and polish report, both verification reports, and the prior
handoff were read. The live build identity equals the checked-out commit.

| Earlier item | Live and code verification | Status |
| --- | --- | --- |
| F-1-1 — unknown URLs returned 200 | `/missing-page` is a styled HTTP 404, but both unknown recipe wildcard paths return 200. | **Reopened as F-2-1** |
| F-1-2 — route share metadata was identical | Home, Demo, Privacy, Terms, and all three shipped samples have matching raw/runtime title, description, canonical, OG, and Twitter data. | Fixed for real routes |
| F-1-3 — export import unregistered | `export-import-roundtrip` exists and its clean-clone command passes. | Fixed |
| F-1-4 — manual source retention unregistered | `source-retention` covers manual and Paprika source name and safe URL; command and live flow pass. | Fixed |
| F-1-5 — field-complete editing unregistered | `recipe-fields` adds, edits, reloads, and checks every named field; command and live flow pass. | Fixed |
| Verification 1 — candidate/deploy identity missing | Live `/build-info.json` and footer equal `aef1375…`; hashed assets match this deployment. | Fixed |
| Verification 1 — 5.6 MB quota false success | Regression test keeps the import page and reports storage full; full suite passes. | Fixed |
| Verification 1 — deployed claim contract mismatch | Live export schema and delete-with-Undo match the current register. | Fixed |
| Verification 1 — Back/Forward loses focus | Fresh live Back and Forward checks focus the destination h1 after route render. | Fixed |
| Verification 1 — mobile targets below 44 px | Existing 390 px measurements pass; keyboard and Axe checks pass. | Fixed |
| Verification 1 — cache headers incorrect | Hashed JS/CSS are immutable for one year; `/sw.js` is `no-cache`. | Fixed |
| Verification 1 — dead sample source link | The shipped lemon-cake sample has source text and no dead outbound link. | Fixed |

The polish report introduced no separate deferred finding. Its claim that all
prior findings were closed is contradicted only by the wildcard form of
F-1-1 documented above.

## Structure, accessibility, and visual identity

The following checks pass on `/`, `/demo`, `/cookbook`, `/add`, `/privacy`,
`/terms`, and a shipped sample recipe unless a finding says otherwise:

- route-specific title, description, canonical, Open Graph, and Twitter data;
- `lang="en"`, one `main`, one h1 that names the page, ordered headings;
- favicon, 180 × 180 touch icon, and 1200 × 630 social image;
- keyboard operation, visible focus, 390 px layout, Back/Forward focus, and
  reduced-motion handling;
- zero serious or critical Axe findings and no page-script console errors;
- Privacy and Terms links, working deep links, and a crawl with no dead
  discovered product link (the deliberate 404 is excluded);
- a distinct paper archive/tomato passport identity matching
  `.factory/design.md`, not a generic SaaS template.

The static 404 shell and sitemap exceptions are F-2-8 and F-2-9. The unknown
recipe route status/metadata exception is F-2-1.

## Missed leverage

The brief does not imply sync, and adding sync would conflict with the current
local-only job. Import from a web URL is also excluded by the no-scraping
constraint. The obvious missing step is the one-paste recipe intake described
in F-2-10. It should begin with a local parser; an optional Sociobot-assisted
cleanup can help with irregular text only if it follows the gateway, consent,
cost, undo, privacy, fallback, and fixture-test requirements.

## Verification summary

- All 15 literal claim commands from a fresh clone: pass.
- Full checkout suite: 7 unit and 29 Chromium tests pass.
- `npm run build`: pass; `dist/` produced.
- Built payload: 10,104 bytes gzip JavaScript and 4,810 bytes gzip CSS.
- `npm run verify:live`: reports `LIVE PASS`, but does not cover F-2-1 or the
  poisoned-shell sequence in F-2-2.
- `/opt/fleet/lib/verify-url.sh`: pass; 627 ms load, no browser console errors,
  title/lang/main/h1/alts/button labels present.
- Live Axe integration: zero serious or critical findings across the crawled
  routes and 404.
- Live link crawl: all intended internal links and the external factory link
  returned 200; contact links are explicit `mailto:` links.

## What would make this perfect

Close both blockers first: make unknown recipe IDs honest at the HTTP/raw-HTML
layer and prevent any 404 from replacing the offline app shell. Then strengthen
the three under-asserted claim tests, restore the complete desktop first-screen
shape, use the shared skeleton on 404, complete the sitemap, narrow the generic
JSON-array promise, add a genuine one-paste intake or rename it, and apply the
listed plain-word rewrites. Re-run every clean-clone claim command plus the two
new adversarial route/offline sequences. At that point, repeat this entire
checklist from a fresh context; do not change the verdict until it yields zero
findings.
