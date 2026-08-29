# Adversarial first-read review 6 — PASS

Reviewed 29 August 2026 from fresh 390 × 844 and 1440 × 900 browser
contexts and a clean local clone. The live deployment identifies build
`1e5190c20f3e416909b4bc2b85fb546a072ebcd9`. Checkout
`bec413f69b9d6fadecd272ffc23110f6490ad4dc` differs from that build only in
factory verification documentation; product code is identical.

**Verdict: PASS.** There are zero blocking, major, minor, or copy findings.
Every registered claim was tested, and no claim-like sentence is unlisted.

## Cold first read

Before scrolling, in my own words:

- **What it does:** moves Paprika or pasted recipes into a private,
  searchable cookbook in this browser, with print and JSON export.
- **Who it is for:** cooks leaving a recipe app or a cluttered recipe page.
- **What to click first:** **Try it with sample data** to open the ready-made
  cookbook; **Import your recipes** is the adjacent real-data path.

The exact copy that supplied those answers was “Move your recipes into a
private cookbook,” “For cooks leaving an app or cluttered recipe page, it
keeps a searchable copy on this device,” and “Try it with sample data.” At
390 × 844, the action outcome and all three facts ended by 712 CSS px. At
1440 × 900, they ended by 884 CSS px. The page had no horizontal overflow.

## Findings

None.

## Copy audit

Counts use whitespace-separated words; hyphenated terms and URLs count as
one. This includes visible headings, actions, labels, image alternatives, and
screen-reader text. Repeated navigation labels are listed once. README code
blocks are commands, not sentences. No item exceeds 22 words, contains banned
marketing language, uses inconsistent terms, or needs a rewrite.

### Live landing page

| Exact copy | Words | Check |
| --- | ---: | --- |
| Skip to main content | 4 | Pass — keyboard action |
| Recipe Passport | 2 | Pass — wordmark |
| Recipe Passport home | 3 | Pass — accessible link name |
| Main navigation | 2 | Pass — accessible label |
| Cookbook | 1 | Pass — navigation |
| Add recipe | 2 | Pass — result-naming navigation |
| Demo | 1 | Pass — navigation |
| Privacy | 1 | Pass — navigation |
| A cookbook on this device | 5 | Pass — consistent collection term |
| Move your recipes into a private cookbook. | 7 | Pass — job-first `h1` |
| For cooks leaving an app or cluttered recipe page, it keeps a searchable copy on this device. | 17 | Pass — audience and outcome |
| Try it with sample data | 5 | Pass — primary action; `demo-one-click` |
| Import your recipes | 3 | Pass — real action |
| The sample opens a ready-made cookbook. | 6 | Pass — `demo-one-click` |
| Import a Paprika file or paste one full recipe. | 9 | Pass — registered intake claims |
| Product facts | 2 | Pass — accessible list label |
| Stays on this device | 4 | Pass — `local-only` |
| Works offline after the first visit | 6 | Pass — `offline-reload` |
| Price: free | 2 | Pass — `free-use` |
| A red recipe folio opens into a miniature paper kitchen archive. | 11 | Pass — image alternative |
| The product | 2 | Pass — section label |
| Recipe preview | 2 | Pass — descriptive `h2` |
| 03 recipes | 2 | Pass — preview count |
| B / 01 | 3 | Pass — decorative index |
| Weeknight · Beans | 3 | Pass — recipe categories |
| Tomato-braised butter beans | 3 | Pass — recipe title |
| Serves 3 | 2 | Pass — yield |
| 7 ingredients | 2 | Pass — recipe fact |
| Butter beans | 2 | Pass — ingredient |
| Crushed tomatoes | 2 | Pass — ingredient |
| Smoked paprika | 2 | Pass — ingredient |
| 4 steps | 2 | Pass — recipe fact |
| Warm the oil. | 3 | Pass — recipe step |
| Simmer for 18 minutes. | 4 | Pass — recipe step |
| Fold in the parsley. | 4 | Pass — recipe step |
| How it works | 3 | Pass — section label |
| Import, find, and export recipes in three steps. | 8 | Pass — descriptive `h2` |
| 01 | 1 | Pass — step number |
| Import recipes | 2 | Pass — result-naming `h3` |
| Choose a Paprika JSON file or paste one full recipe. | 10 | Pass — concrete instruction |
| 02 | 1 | Pass — step number |
| Find and cook recipes | 4 | Pass — result-naming `h3` |
| Search by title or ingredient. | 5 | Pass — `search-cookbook` |
| Open a clean cooking view. | 5 | Pass — concrete outcome |
| 03 | 1 | Pass — step number |
| Print or export your cookbook | 5 | Pass — result-naming `h3` |
| Print one recipe or export the whole cookbook as JSON. | 10 | Pass — registered print/export claims |
| Privacy and account limits | 4 | Pass — descriptive section label |
| Your cookbook does not need an account. | 7 | Pass — `no-account` |
| Recipe Passport processes your files in this browser. | 8 | Pass — `local-only` |
| It does not scrape recipe sites or publish your recipes. | 10 | Pass — `no-scraping`, `no-hosting` |
| Export a complete JSON copy before clearing browser data or changing devices. | 12 | Pass — export plus storage warning |
| Read the privacy note | 4 | Pass — destination-naming link |
| Private cookbook stored in your browser. | 6 | Pass — descriptive footer line |
| Artwork generated for Recipe Passport. | 5 | Pass — recorded provenance |
| No tracking. | 2 | Pass — `no-tracking` |
| No fonts load from other sites. | 6 | Pass — request assertion |
| Footer navigation | 2 | Pass — accessible label |
| Terms | 1 | Pass — navigation |
| Built by Param Factory | 4 | Pass — named external destination |
| (external site) | 2 | Pass — screen-reader qualification |
| Recipe Passport build [commit] · Original generated artwork | 8 | Pass — identity and provenance |

### README

| Exact copy | Words | Check |
| --- | ---: | --- |
| Recipe Passport | 2 | Pass — title |
| Move your recipes into a private offline cookbook. | 8 | Pass — job summary |
| Recipe Passport is for people leaving a recipe app or tired of cluttered recipe pages. | 15 | Pass — audience |
| It imports user-provided Paprika JSON and full pasted recipes into a searchable cookbook stored in the browser. | 17 | Pass — registered claims |
| Paprika imports and manual recipes retain supplied source details. | 9 | Pass — `source-retention` |
| A cook can print one clean recipe or export the whole cookbook as JSON. | 14 | Pass — print/export claims |
| Live site: https://recipe-passport.sociobot.in | 3 | Pass — live link |
| Try the isolated sample in one click: https://recipe-passport.sociobot.in/?demo=1 | 8 | Pass — `demo-one-click` |
| What it does | 3 | Pass — descriptive heading |
| Imports Paprika JSON arrays and Recipe Passport JSON exports without losing saved fields. | 13 | Pass — registered import claims |
| Fills editable recipe fields from one pasted recipe with a title, Ingredients, and Method section. | 15 | Pass — `paste-recipe` |
| Adds or edits a recipe with ingredients, steps, yield, notes, categories, and source. | 13 | Pass — `recipe-fields` |
| Searches recipes by title, ingredient, category, note, or source. | 9 | Pass — `search-cookbook` |
| Opens a clean recipe view with checkable ingredients. | 8 | Pass — `ingredient-check` |
| Opens the browser print flow for paper or PDF output. | 10 | Pass — `print-recipe` |
| Exports every saved field in the recipe-passport/v1 JSON format. | 9 | Pass — `json-export` |
| Works offline after the first completed visit. | 7 | Pass — `offline-reload` |
| It does not scrape recipe sites, host recipes, or require an account. | 12 | Pass — three registered claims |
| Privacy and storage | 3 | Pass — descriptive heading |
| All processing happens in the browser. | 6 | Pass — `local-only` |
| Real recipes use localStorage["recipe-passport:v1:recipes"]. | 4 | Pass — storage detail |
| Demo recipes use the separate sessionStorage["demo:recipe-passport:v1:recipes"] key. | 7 | Pass — `demo-isolation` |
| There are no analytics, third-party scripts, or fonts from other sites. | 11 | Pass — `no-tracking` |
| The app sends no recipe data to external APIs while you use it. | 13 | Pass — privacy claims |
| Browser storage is not a permanent backup. | 7 | Pass — useful limitation |
| Export the cookbook before clearing browser data or changing devices. | 10 | Pass — recovery instruction |
| See the demo contract, privacy, and terms. | 7 | Pass — links resolve |
| Develop | 1 | Pass — documentation heading |
| Requirements: Node.js 22 or newer and npm. | 7 | Pass — setup requirement |
| Open http://localhost:5173. | 2 | Pass — instruction |
| The demo is at http://localhost:5173/demo. | 5 | Pass — instruction |
| Test | 1 | Pass — documentation heading |
| Playwright 1.58.2 is pinned because the factory image provides its browser build. | 12 | Pass — repository fact |
| Run one public claim with its tag: | 7 | Pass — instruction |
| The unit tests cover JSON normalization and errors. | 8 | Pass — verified repository fact |
| The browser suite covers every claim in .factory/claims.json, serious accessibility findings, keyboard use, mobile width, routes, empty states, and editing. | 20 | Pass — full suite verified |
| Build and deploy | 3 | Pass — documentation heading |
| The exact production command is: | 5 | Pass — instruction |
| It creates dist/ with dist/index.html at the root. | 8 | Pass — build verified |
| Each build also writes dist/build-info.json and shows the exact Git commit in the footer, so a deployed artifact can be identified. | 21 | Pass — identity verified |
| Deploy that directory to Azure Static Web Apps. | 8 | Pass — instruction |
| public/staticwebapp.config.json sets app routes, security headers, and cache rules. | 9 | Pass — repository fact |
| The repository does not manage DNS, billing, or deployment credentials. | 10 | Pass — scope limitation |
| Design and provenance | 3 | Pass — documentation heading |
| The product-specific visual system and where the generated artwork came from live in .factory/design.md. | 14 | Pass — documentation fact |
| The hero art was generated for this product with the factory image model and optimized locally to WebP. | 18 | Pass — provenance |
| License | 1 | Pass — heading |
| MIT. | 1 | Pass — license statement |
| See LICENSE. | 2 | Pass — link instruction |

Terminology is consistent: the collection is a **cookbook**, one item is a
**recipe**, structured-file intake is **import**, full-text intake is **paste
one full recipe**, downloading data is **export**, the isolated sample is the
**demo**, cooking instructions are **steps**, and attribution is the
**source**.

## Demo and sandbox

One click on **Try it with sample data** changed `/?demo=1` to `/demo`. The
first demo screen showed Tomato-braised butter beans, Lemon olive oil cake,
and Cold sesame noodle salad. Its persistent banner said “Demo — sample data,
nothing is saved to your cookbook” and exposed **Reset demo** and **Start for
real**.

The review seeded real storage with `REAL-SENTINEL`, edited a sample title,
reset the demo, and exited. Reset restored all three samples. Exit opened
`/add`, removed demo session storage, and preserved the real sentinel
byte-for-byte. The observed flow made only four same-origin GET requests and
produced no console error. The independent offline claim also passed after an
intentional 404 navigation.

## Claims gate

Fresh clone: `/tmp/recipe-passport-review6.2SiYBn/repo`. `npm ci` reported
zero vulnerabilities. Every literal command from `.factory/claims.json` ran
independently and passed:

| Claim ID | Result | Claim ID | Result |
| --- | --- | --- | --- |
| `paprika-import` | Pass | `manual-add` | Pass |
| `paste-recipe` | Pass | `search-cookbook` | Pass |
| `json-export` | Pass | `print-recipe` | Pass |
| `offline-reload` | Pass | `local-only` | Pass |
| `demo-one-click` | Pass | `demo-isolation` | Pass |
| `free-use` | Pass | `recipe-management` | Pass |
| `ingredient-check` | Pass | `no-account` | Pass |
| `no-scraping` | Pass | `no-hosting` | Pass |
| `no-tracking` | Pass | `export-import-roundtrip` | Pass |
| `source-retention` | Pass | `recipe-fields` | Pass |

The landing-page and README claims map to those entries in the copy audit.
No live claim-like sentence lacks an entry, and no claim remains untested.

## Earlier finding verification

Each earlier review finding was checked against the live deployment and
current source/tests, not accepted from its polish status.

| Earlier finding | Round-6 evidence | Status |
| --- | --- | --- |
| F-1-1 — unknown URLs returned 200 | General and recipe-shaped unknown paths return the styled HTTP 404; config has no wildcard recipe rewrite. | Fixed |
| F-1-2 — route share metadata was identical | Raw/runtime tests pass; live route titles, descriptions, canonicals, OG, and Twitter data match. | Fixed |
| F-1-3 — export/import was unregistered | `export-import-roundtrip` is registered and its full comparison passes. | Fixed |
| F-1-4 — manual source retention was unregistered | `source-retention` covers manual and Paprika source details. | Fixed |
| F-1-5 — complete field editing was unregistered | `recipe-fields` checks every documented field after reload. | Fixed |
| F-2-1 — unknown recipe IDs were soft 404s | Unknown recipe path IDs return 404; browser-held recipes use tested query routes. | Fixed |
| F-2-2 — a 404 poisoned the offline shell | `offline-reload` passes the poisoned-404 sequence. | Fixed |
| F-2-3 — desktop omitted action outcome/facts | All required content ends above 900 CSS px. | Fixed |
| F-2-4 — isolation could miss real-data deletion | Test and review preserve seeded real data byte-for-byte. | Fixed |
| F-2-5 — export test did not verify values | Export deep-compares every demo recipe and field. | Fixed |
| F-2-6 — search test did not identify results | Each indexed-field query asserts its named recipe. | Fixed |
| F-2-7 — generic JSON wording was unlisted | Public wording names only the two tested formats. | Fixed |
| F-2-8 — 404 shell was inconsistent | Live 404 has shared header, footer, legal links, identity, and style. | Fixed |
| F-2-9 — sitemap omitted routes | All ten fixed routes are listed, tested, and live. | Fixed |
| F-2-10 — paste required field-by-field entry | One-paste intake fills editable fields locally. | Fixed |
| F-2-11 — archive/cookbook terms conflicted | The collection is consistently a cookbook. | Fixed |
| F-2-12 — export step lacked a result | Heading is “Print or export your cookbook.” | Fixed |
| F-2-13 — public copy used production jargon | Current landing and README audit has no unexplained jargon. | Fixed |
| F-3-1 — no-scraping/no-hosting were unlisted | Separate registered request-log tests pass in demo and real flows. | Fixed |
| F-3-2 — no-tracking was unlisted | Registered test permits only same-origin static GETs. | Fixed |
| F-5-1 — hero caption was metaphorical | The caption is absent from live DOM and source. | Fixed |
| F-5-2 — preview heading was a slogan | Live `h2` is “Recipe preview.” | Fixed |
| F-5-3 — how-it-works heading was metaphorical | Live `h2` names import, find, and export. | Fixed |
| F-5-4 — “Cook” lacked standalone meaning | Live `h3` is “Find and cook recipes.” | Fixed |
| F-5-5 — privacy label was generic | Live label is “Privacy and account limits.” | Fixed |
| F-5-6 — footer did not describe the product | App and 404 say “Private cookbook stored in your browser.” | Fixed |
| F-5-7 — demo promise was unregistered | `demo-one-click` is registered and passes independently. | Fixed |

The defects recorded outside numbered reviews also remain closed: storage
quota failure does not report success, deployed identity is visible, filtered
results retain IDs, long titles reflow, mobile targets reach 44 px, focus
contrast passes 3:1, expired Undo leaves tab order, the 404 skip link focuses
main, malformed URLs focus their field, hashed assets are immutable, and
sample provenance has no dead link. The full suite covers each case.

## Structure, accessibility, and visual identity

- All fixed routes and sample recipes return 200. Every crawled internal and
  external link returned 2xx. Unknown general and recipe paths return 404.
- Each reviewed route has `lang="en"`, one `h1`, one `main`, route-specific
  title/description/canonical/OG/Twitter data, favicon, and consistent site
  chrome. The styled 404 has direct copy and **Return home**.
- Back/forward restore routes, focus the new `h1`, and update the polite
  announcement. Keyboard, reduced-motion, touch-target, error, empty-state,
  and Playwright Axe checks pass. The factory URL verifier found no console
  errors, missing alt text, or unnamed buttons.
- Warm archive paper, tomato-red passport controls, herb-green details,
  bookish type, asymmetric page shapes, and original folio/kitchen art create
  a distinct identity rather than a generic SaaS template.
- `npm test` passed 11 unit and 44 Chromium tests. Typecheck and lint passed.
  `npm run build` produced `dist/index.html`; JavaScript is 11.32 KB gzip and
  CSS is 4.92 KB gzip.

## Missed leverage

No finding. The brief's intake, paste, search, print, owned export,
provenance, privacy, and no-account loop is present and tested. JSON
export/import supplies transfer. Cloud sync would change the local-only
contract, and deterministic local parsing already handles pasted recipes, so
an AI gateway step is not an obviously valuable missing part of this job.

## What would make this perfect

Nothing remains to change under the brief, supplied skills, or adversarial
checklist. Keep the 20 claim commands, complete browser suite, cold live
verifier, link crawl, and deployment-identity check as release gates.
