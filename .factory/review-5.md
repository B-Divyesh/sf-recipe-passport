# Adversarial first-read review 5 — FAIL

Reviewed 29 August 2026 against live
<https://recipe-passport.sociobot.in> and clean-clone commit
`4a008d007646a32f191a7e75f0dfd7f6321f68e4`. Live `/build-info.json` identifies
`cca03e91608ece178b5befc6c2bd3c21d5470426`, an ancestor whose only difference
from the reviewed checkout is the prior review/handoff documentation; product
code and static assets are unchanged.

**Verdict: FAIL.** The product is clear, functional, private in the observed
flow, and visually specific. Six minor plain-language defects and one
unlisted public demo promise remain. The required standard is zero findings,
so this cannot be a PASS.

## Cold first read

Fresh browser contexts, with no prior cookies, storage, or service worker,
opened the live home page at 390 × 844 and 1440 × 900. Before scrolling, the
following answers were unambiguous at both widths:

- **What it does:** moves recipes into a private cookbook stored on this
  device.
- **For whom:** cooks leaving a recipe app or a cluttered recipe page.
- **First action:** select **Try it with sample data**; the adjacent text says
  that it opens a ready-made cookbook.

The exact supporting copy was “Move your recipes into a private cookbook.”,
“For cooks leaving an app or cluttered recipe page, it keeps a searchable copy
on this device.”, and “The sample opens a ready-made cookbook.” The primary
action, its outcome, and all three privacy/offline/price facts were visible
without scrolling. This does not trigger the first-read blocker.

## Findings

### F-5-1 — Minor — hero caption is a travel metaphor, not useful product copy

- **Location / quote:** landing hero artwork caption: “Your recipes, packed
  for the next kitchen.”
- **Why:** It says neither what the product does nor what the visitor can do.
  “Packed” is a travel metaphor, so the caption would work nearly unchanged on
  an unrelated product.
- **Concrete fix:** Remove the caption. The adjacent headline, facts, and
  descriptive image alternative already communicate the useful information.

### F-5-2 — Minor — recipe-preview heading is a slogan instead of a section name

- **Location / quote:** landing `h2`: “Read the recipe, not the page around
  it.”
- **Why:** A screen-reader heading list gives no indication that the following
  content is a sample recipe preview. The contrast with a page is rhetorical,
  not a named section.
- **Concrete fix:** Replace it with **“Recipe preview”**.

### F-5-3 — Minor — how-it-works heading relies on an unexplained metaphor

- **Location / quote:** landing `h2`: “Carry recipes across in three steps.”
- **Why:** “Carry … across” does not name the three tasks. A first-time visitor
  must read the cards to learn whether this means importing, cooking, sharing,
  or something else.
- **Concrete fix:** Replace it with **“Import, find, and export recipes in
  three steps.”**

### F-5-4 — Minor — the heading “Cook” has no standalone meaning

- **Location / quote:** second How it works `h3`: “Cook”.
- **Why:** In a heading list, the one-word label does not say that this step is
  about searching for and opening a saved recipe. It is not a result-naming
  action.
- **Concrete fix:** Replace it with **“Find and cook recipes”**.

### F-5-5 — Minor — privacy section eyebrow is a generic slogan

- **Location / quote:** landing eyebrow: “A tool, not another platform”.
- **Why:** This does not name the following account/privacy limits and gives a
  visitor no usable information. It is product-positioning language rather
  than a section label.
- **Concrete fix:** Replace it with **“Privacy and account limits”**.

### F-5-6 — Minor — footer one-liner does not describe the product

- **Location / quote:** footer wordmark: “Keep recipes. Keep control.”
- **Why:** The required footer one-liner should tell a visitor what this
  product is. This two-part slogan is not informative and relies on an
  abstract “control”.
- **Concrete fix:** Replace it with **“Private cookbook stored in your
  browser.”**

### F-5-7 — Minor — one-click populated-demo promise has no claim entry

- **Location / quote:** landing action note: “The sample opens a ready-made
  cookbook.” README: “Try the isolated sample in one click”.
- **Why:** These are public promises a visitor can rely on. `demo-isolation`
  proves storage separation and discard-on-exit; it does not register the
  one-click entry or assert that the destination already contains realistic
  sample recipes and the persistent banner. The demo works in this review, but
  the claim register does not represent this promise.
- **Concrete fix:** Add a `demo-one-click` entry to `.factory/claims.json` and
  a tagged fresh-context test that follows `/?demo=1`, asserts `/demo`, the
  demo banner, Reset demo, Start for real, and the three named sample recipes.
  Alternatively remove both promises, which would make the mandatory demo less
  discoverable and is not recommended.

## Copy audit

Counts use whitespace-separated words; hyphenated terms and URLs count as one.
This inventory includes visible headings, controls, alternatives, and
screen-reader labels so headings and action names are checked as well as
sentences. No item exceeds 22 words. The flags above are the only metaphor,
slogan, or out-of-context-heading failures. Technical strings in the README's
development instructions are retained as useful developer instructions.

### Landing page

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
| A cookbook on this device | 5 | Pass — collection term is consistent |
| Move your recipes into a private cookbook. | 7 | Pass — job-first `h1` |
| For cooks leaving an app or cluttered recipe page, it keeps a searchable copy on this device. | 17 | Pass — audience and outcome |
| Try it with sample data | 5 | Pass — result-naming primary action |
| Import your recipes | 3 | Pass — result-naming real action |
| The sample opens a ready-made cookbook. | 6 | F-5-7 — unlisted public promise |
| Import a Paprika file or paste one full recipe. | 10 | Pass — `paprika-import`, `paste-recipe` |
| Product facts | 2 | Pass — accessible list label |
| Stays on this device | 4 | Pass — `local-only` |
| Works offline after the first visit | 6 | Pass — `offline-reload` |
| Price: free | 2 | Pass — `free-use` |
| A red recipe folio opens into a miniature paper kitchen archive. | 11 | Pass — descriptive image alternative |
| Your recipes, packed for the next kitchen. | 7 | F-5-1 |
| The product | 2 | Pass — eyebrow introduces preview |
| Read the recipe, not the page around it. | 8 | F-5-2 |
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
| How it works | 3 | Pass — clear section label |
| Carry recipes across in three steps. | 6 | F-5-3 |
| 01 | 1 | Pass — step number |
| Import recipes | 2 | Pass — result-naming step |
| Choose a Paprika JSON file or paste one full recipe. | 10 | Pass — concrete instruction |
| 02 | 1 | Pass — step number |
| Cook | 1 | F-5-4 |
| Search by title or ingredient. | 5 | Pass — `search-cookbook` |
| Open a clean cooking view. | 5 | Pass — recipe view describes the result |
| 03 | 1 | Pass — step number |
| Print or export your cookbook | 5 | Pass — result-naming step |
| Print one recipe or export the whole cookbook as JSON. | 10 | Pass — `print-recipe`, `json-export` |
| A tool, not another platform | 5 | F-5-5 |
| Your cookbook does not need an account. | 7 | Pass — `no-account` |
| Recipe Passport processes your files in this browser. | 8 | Pass — `local-only` |
| It does not scrape recipe sites or publish your recipes. | 10 | Pass — `no-scraping`, `no-hosting` |
| Export a complete JSON copy before clearing browser data or changing devices. | 12 | Pass — export instruction and storage limitation |
| Read the privacy note | 4 | Pass — destination-naming link |
| Keep recipes. Keep control. | 4 | F-5-6 |
| Artwork generated for Recipe Passport. | 5 | Pass — provenance |
| No tracking. | 2 | Pass — `no-tracking` |
| No fonts load from other sites. | 6 | Pass — same-origin request assertion in `no-tracking` |
| Footer navigation | 2 | Pass — accessible label |
| Terms | 1 | Pass — navigation |
| Built by Param Factory | 4 | Pass — named external destination |
| (external site) | 2 | Pass — screen-reader qualification |
| Recipe Passport build 4a008d007646a32f191a7e75f0dfd7f6321f68e4 · Original generated artwork | 8 | Pass — build identity and provenance |

### README

| Exact copy | Words | Check |
| --- | ---: | --- |
| Recipe Passport | 2 | Pass — title |
| Move your recipes into a private offline cookbook. | 8 | Pass — job summary |
| Recipe Passport is for people leaving a recipe app or tired of cluttered recipe pages. | 15 | Pass — audience |
| It imports user-provided Paprika JSON and full pasted recipes into a searchable cookbook stored in the browser. | 17 | Pass — registered import, paste, search, and storage claims |
| Paprika imports and manual recipes retain supplied source details. | 9 | Pass — `source-retention` |
| A cook can print one clean recipe or export the whole cookbook as JSON. | 14 | Pass — `print-recipe`, `json-export` |
| Live site: https://recipe-passport.sociobot.in | 3 | Pass — link |
| Try the isolated sample in one click: https://recipe-passport.sociobot.in/?demo=1 | 8 | F-5-7 |
| What it does | 3 | Pass — clear heading |
| Imports Paprika JSON arrays and Recipe Passport JSON exports without losing saved fields. | 13 | Pass — `paprika-import`, `export-import-roundtrip` |
| Fills editable recipe fields from one pasted recipe with a title, Ingredients, and Method section. | 15 | Pass — `paste-recipe` |
| Adds or edits a recipe with ingredients, steps, yield, notes, categories, and source. | 13 | Pass — `recipe-fields` |
| Searches recipes by title, ingredient, category, note, or source. | 9 | Pass — `search-cookbook` |
| Opens a clean recipe view with checkable ingredients. | 8 | Pass — `ingredient-check` |
| Opens the browser print flow for paper or PDF output. | 10 | Pass — `print-recipe` |
| Exports every saved field in the `recipe-passport/v1` JSON format. | 9 | Pass — `json-export` |
| Works offline after the first completed visit. | 7 | Pass — `offline-reload` |
| It does not scrape recipe sites, host recipes, or require an account. | 12 | Pass — `no-scraping`, `no-hosting`, `no-account` |
| Privacy and storage | 3 | Pass — clear heading |
| All processing happens in the browser. | 6 | Pass — `local-only` |
| Real recipes use `localStorage["recipe-passport:v1:recipes"]`. | 3 | Pass — exact storage detail supports verification |
| Demo recipes use the separate `sessionStorage["demo:recipe-passport:v1:recipes"]` key. | 6 | Pass — `demo-isolation` |
| There are no analytics, third-party scripts, or fonts from other sites. | 11 | Pass — `no-tracking` |
| The app sends no recipe data to external APIs while you use it. | 13 | Pass — `local-only`, `no-hosting` |
| Browser storage is not a permanent backup. | 7 | Pass — useful limitation |
| Export the cookbook before clearing browser data or changing devices. | 10 | Pass — recovery instruction |
| See the demo contract, privacy, and terms. | 7 | Pass — resolved links |
| Develop | 1 | Pass — documentation heading |
| Requirements: Node.js 22 or newer and npm. | 7 | Pass — setup requirement |
| Open `http://localhost:5173`. | 1 | Pass — developer instruction |
| The demo is at `http://localhost:5173/demo`. | 5 | Pass — developer instruction |
| Test | 1 | Pass — documentation heading |
| Playwright 1.58.2 is pinned because the factory image provides its browser build. | 12 | Pass — developer setup fact |
| Run one public claim with its tag: | 7 | Pass — developer instruction |
| The unit tests cover JSON normalization and errors. | 8 | Pass — verified repository fact |
| The browser suite covers every claim in `.factory/claims.json`, serious accessibility findings, keyboard use, mobile width, routes, empty states, and editing. | 20 | Pass — verified full-suite description |
| Build and deploy | 3 | Pass — documentation heading |
| The exact production command is: | 5 | Pass — developer instruction |
| It creates `dist/` with `dist/index.html` at the root. | 7 | Pass — clean build verified |
| Each build also writes `dist/build-info.json` and shows the exact Git commit in the footer, so a deployed artifact can be identified. | 21 | Pass — build and live identity verified |
| Deploy that directory to Azure Static Web Apps. | 8 | Pass — developer instruction |
| `public/staticwebapp.config.json` sets app routes, security headers, and cache rules. | 6 | Pass — repository fact |
| The repository does not manage DNS, billing, or deployment credentials. | 10 | Pass — scope limit |
| Design and provenance | 3 | Pass — documentation heading |
| The product-specific visual system and where the generated artwork came from live in `.factory/design.md`. | 14 | Pass — documentation fact |
| The hero art was generated for this product with the factory image model and optimized locally to WebP. | 18 | Pass — recorded provenance |
| License | 1 | Pass — documentation heading |
| MIT. | 1 | Pass — license statement |

Terminology otherwise remains consistent: the collection is a **cookbook**,
one item is a **recipe**, file intake is **import**, full-text intake is
**paste one full recipe**, downloading is **export**, the isolated sample is
the **demo**, cooking instructions are **steps**, and attribution is the
**source**.

## Demo, sandbox, and claims

The demo itself meets the functional requirement. In a fresh 390 px browser,
one click on **Try it with sample data** opened `/demo` with the visible
heading “Find a recipe you already own.” and three realistic sample recipes.
The persistent ribbon said “Demo — sample data, nothing is saved to your
cookbook.” and supplied **Reset demo** and **Start for real**. Reset restored
the original three recipes. Start for real opened `/add` and left both the
demo session key and real local-storage key empty in this clean context.

The full observed demo flow made four same-origin GET requests, no non-GET
request, and no console or page error. With the service worker controlling a
fresh `/demo` visit, setting the browser offline and reloading still rendered
Tomato-braised butter beans without an error. The separate `demo-isolation`,
`local-only`, `offline-reload`, `no-scraping`, `no-hosting`, and
`no-tracking` tests exercise the corresponding sandbox/privacy behaviour.

From a fresh shallow GitHub clone at
`/tmp/recipe-passport-review5.Hfo0DE/repo`, `npm ci` completed with zero
vulnerabilities. `npm run build` produced `dist/`; `npm test` passed 9 Vitest
tests and 36 Chromium tests. Every literal claim command in
`.factory/claims.json` was then run independently and passed:

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

## Earlier finding verification

Every earlier review, polish record, verification report, and handoff was
read. Each earlier finding was checked in current code and on the live site.

| Earlier finding | Current result |
| --- | --- |
| F-1-1 — unknown URLs returned 200 | Fixed: unknown general and recipe paths return the styled HTTP 404; static config has no wildcard recipe rewrite. |
| F-1-2 — share metadata was identical | Fixed: live raw and runtime metadata are route-specific for demo, policies, and samples. |
| F-1-3 — export/import was unregistered | Fixed: `export-import-roundtrip` is registered and passes. |
| F-1-4 — manual source retention was unregistered | Fixed: `source-retention` covers manual and Paprika source details. |
| F-1-5 — field-complete editing was unregistered | Fixed: `recipe-fields` adds, edits, reloads, and checks every documented field. |
| F-2-1 — unknown recipe IDs were soft 404s | Fixed: unknown path IDs return 404; stored recipes use real query routes. |
| F-2-2 — a 404 poisoned the offline shell | Fixed: the worker precaches its shell and does not cache arbitrary navigations. |
| F-2-3 — desktop omitted action outcome/facts | Fixed: all required first-screen content is visible at 1440 × 900. |
| F-2-4 — isolation could delete real data | Fixed: the registered test preserves a seeded real sentinel. |
| F-2-5 — export test omitted saved values | Fixed: export deep-compares every demo recipe and field. |
| F-2-6 — search test did not identify results | Fixed: title, ingredient, category, note, and source each assert the expected recipe. |
| F-2-7 — generic JSON claim was unlisted | Fixed: public wording and two registered import claims are specific. |
| F-2-8 — static 404 shell was inconsistent | Fixed: the 404 has the matching header, footer, legal links, and style. |
| F-2-9 — sitemap omitted public routes | Fixed: the ten fixed public routes, including demo samples, are listed. |
| F-2-10 — paste required field-by-field work | Fixed: one-paste intake fills editable fields locally. |
| F-2-11 — archive/cookbook terminology conflicted | Fixed: the collection is consistently named a cookbook. |
| F-2-12 — export step lacked a named result | Fixed: the third step names printing/exporting the cookbook. |
| F-2-13 — public copy used production jargon | Fixed for the recorded jargon; F-5-1 through F-5-6 are newly identified slogan/heading defects. |
| F-3-1 — no-scraping/no-hosting promises were unlisted | Fixed: separate registered tests pass. |
| F-3-2 — no-tracking promise was unlisted | Fixed: the same-origin request test passes. |
| Verification 1 — identity, quota, Undo, history focus, target sizes, cache, and source link defects | Fixed: current build identity, tests, live navigation, and headers confirm the repairs. |

No earlier finding is unfixed, half-fixed, or regressed. F-5-1 through F-5-7
are new findings from rerunning the entire review against the current attached
plain-words and claims requirements.

## Structure, accessibility, and product fit

- Live route checks for `/`, `/demo`, `/cookbook`, `/add`, `/demo/add`, all
  three sample recipes, `/privacy`, `/terms`, and `/404` passed. Unknown
  general and recipe paths returned HTTP 404. Every crawled internal route and
  asset returned 200; the factory link returned 200; contact links are explicit
  `mailto:` links.
- Route titles follow the required product/what-it-does or route/product
  pattern. Checked pages have a short description, canonical, Open Graph and
  Twitter data, favicon, touch icon, `lang="en"`, one `main`, and one `h1`.
  The sitemap, robots file, security headers, and designed 404 are present.
- Live browser checks found no console/page errors, no 390 px horizontal
  overflow, and no dead link. The passing suite covers keyboard operation,
  focus after navigation/back/forward, empty/error states, route focus,
  reduced motion, and serious/critical Axe findings.
- The tomato folio, paper archive palette, clipped paper shapes, editorial
  kitchen artwork, and serif/sans pairing visibly implement `.factory/design.md`.
  This is not a generic SaaS template.

The brief does not imply an AI feature: local import, search, printing, and
export are the stated job. Adding an optional key, network call, or AI label
would not improve this local-first use case. Import/export already supplies
the expected portability; no embedded provider key or AI endpoint was found.

## What would make this perfect

Apply the six concrete plain-language rewrites/removals, register and test the
one-click populated-demo promise, then rerun the clean-clone claim commands
and this first-read review. With no remaining findings, the product can pass.
