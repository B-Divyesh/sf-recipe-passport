# Adversarial first-read review 3 — FAIL

Reviewed 28 August 2026 against the cold live deployment and checkout commit
`fc8a67cd2c5f540e472381ff860b91da22c2e028`.

**Verdict: FAIL.** The product is clear, tryable, and its registered claim
commands pass. Two public privacy/hosting promise groups remain outside
`.factory/claims.json`; PASS requires no unlisted claim.

## Cold first read

Fresh storage-free Chromium contexts at 390 × 844 and 1440 × 900 loaded `/` at
scroll position zero. Before scrolling:

- **What it does:** moves recipes into a private, searchable cookbook on this device.
- **For whom:** cooks leaving a recipe app or cluttered recipe page.
- **First action:** select **Try it with sample data** to open a ready-made cookbook.

The exact supporting text is “Move your recipes into a private cookbook.”,
“For cooks leaving an app or cluttered recipe page, it keeps a searchable copy
on this device.”, “Try it with sample data”, and “The sample opens a ready-made
cookbook.” All three facts are above both folds. The mandatory first-read
blocker does not apply.

## Findings

### F-3-1 — Medium — no-scraping and no-hosting promises are unlisted

- **Exact quote / location:** landing: “It does not scrape recipe sites or
  publish your recipes.” README: “It does not scrape recipe sites, host recipes,
  or require an account.” Terms: “It does not scrape websites, host a public
  recipe directory, or promise permanent browser storage.”
- **Why:** A visitor can rely on these privacy/ownership statements. `no-account`
  proves only the account portion. `local-only` checks third-party requests in
  one demo flow, not the stated no-scrape/no-host behaviour.
- **Fix:** add separately tagged `no-scraping` and `no-hosting` claim tests that
  intercept real and demo flows and assert no recipe URL is fetched or uploaded;
  or remove the unsupported wording.

### F-3-2 — Medium — no-tracking/analytics promise is broader than its claim and test

- **Exact quote / location:** footer: “No tracking.” README: “There are no
  analytics, third-party scripts, or fonts from other sites.” Privacy: “There
  are no analytics, ads, remote fonts, or third-party scripts.”
- **Why:** `local-only` promises no *third-party* runtime request and permits
  same-origin requests. First-party telemetry would still pass, so “No tracking”
  and “no analytics” are unlisted and under-tested.
- **Fix:** add a `no-tracking` claim that names analytics, ads, and telemetry;
  intercept the whole demo and real-recipe flow and allow only static app assets,
  the service worker, and user-selected local files. Or revise copy to “No
  third-party runtime requests.”

## Copy audit

Counts use whitespace-separated words; hyphenated words and URLs count as one.
The inventory includes sentence-like labels, actions, headings, alternatives,
and footer text. No item is over 22 words and no banned marketing adjective
occurs. Actions name their result; headings make sense out of context. The only
flags are the unlisted claims above.

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Recipe Passport | 2 | Pass |
| Cookbook | 1 | Pass |
| Add recipe | 2 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| A cookbook on this device | 5 | Pass |
| Move your recipes into a private cookbook. | 7 | Pass — job-first h1 |
| For cooks leaving an app or cluttered recipe page, it keeps a searchable copy on this device. | 17 | Pass |
| Try it with sample data | 5 | Pass — result-naming action |
| Import your recipes | 3 | Pass — result-naming action |
| The sample opens a ready-made cookbook. | 6 | Pass |
| Import a Paprika file or paste one full recipe. | 10 | Pass |
| Stays on this device | 4 | Pass — `local-only` |
| Works offline after the first visit | 6 | Pass — `offline-reload` |
| Price: free | 2 | Pass — `free-use` |
| A red recipe folio opens into a miniature paper kitchen archive. | 11 | Pass — alt text |
| Your recipes, packed for the next kitchen. | 7 | Pass |
| The product | 2 | Pass — eyebrow |
| Read the recipe, not the page around it. | 8 | Pass |
| 03 recipes | 2 | Pass |
| B / 01 | 3 | Pass |
| Weeknight · Beans | 3 | Pass |
| Tomato-braised butter beans | 3 | Pass |
| Serves 3 | 2 | Pass |
| 7 ingredients | 2 | Pass |
| Butter beans | 2 | Pass |
| Crushed tomatoes | 2 | Pass |
| Smoked paprika | 2 | Pass |
| 4 steps | 2 | Pass |
| Warm the oil. | 3 | Pass |
| Simmer for 18 minutes. | 4 | Pass |
| Fold in the parsley. | 4 | Pass |
| How it works | 3 | Pass — eyebrow |
| Carry recipes across in three steps. | 6 | Pass |
| Import recipes | 2 | Pass — clear h3 |
| Choose a Paprika JSON file or paste one full recipe. | 10 | Pass |
| Cook | 1 | Pass — clear h3 |
| Search by title or ingredient. | 5 | Pass — `search-cookbook` |
| Open a clean cooking view. | 5 | Pass — recipe-view flow |
| Print or export your cookbook | 5 | Pass — clear h3 |
| Print one recipe or export the whole cookbook as JSON. | 10 | Pass — print/export |
| A tool, not another platform | 5 | Pass — eyebrow |
| Your cookbook does not need an account. | 7 | Pass — `no-account` |
| Recipe Passport processes your files in this browser. | 8 | Pass — `local-only` |
| It does not scrape recipe sites or publish your recipes. | 10 | **F-3-1** |
| Export a complete JSON copy before clearing browser data or changing devices. | 12 | Pass — caution |
| Read the privacy note | 4 | Pass — result-naming link |
| Keep recipes. | 2 | Pass |
| Keep control. | 2 | Pass |
| Artwork generated for Recipe Passport. | 5 | Pass — provenance fact |
| No tracking. | 2 | **F-3-2** |
| No fonts load from other sites. | 6 | **F-3-2** |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass — external name is announced |
| Recipe Passport build `fc8a67cd2c5f540e472381ff860b91da22c2e028` · Original generated artwork | 8 | Pass — build fact |

### README

| Copy | Words | Check |
| --- | ---: | --- |
| Recipe Passport | 2 | Pass — document title |
| Move your recipes into a private offline cookbook. | 8 | Pass |
| Recipe Passport is for people leaving a recipe app or tired of cluttered recipe pages. | 15 | Pass |
| It imports user-provided Paprika JSON and full pasted recipes into a searchable cookbook stored in the browser. | 16 | Pass — import/paste/local-only |
| Paprika imports and manual recipes retain supplied source details. | 9 | Pass — `source-retention` |
| A cook can print one clean recipe or export the whole cookbook as JSON. | 14 | Pass — print/export |
| Live site: https://recipe-passport.sociobot.in | 3 | Pass |
| Try the isolated sample in one click: https://recipe-passport.sociobot.in/?demo=1 | 8 | Pass |
| What it does | 3 | Pass — heading |
| Imports Paprika JSON arrays and Recipe Passport JSON exports without losing saved fields. | 12 | Pass — import/round-trip |
| Fills editable recipe fields from one pasted recipe with a title, Ingredients, and Method section. | 15 | Pass — `paste-recipe` |
| Adds or edits a recipe with ingredients, steps, yield, notes, categories, and source. | 13 | Pass — `recipe-fields` |
| Searches recipes by title, ingredient, category, note, or source. | 9 | Pass — `search-cookbook` |
| Opens a clean recipe view with checkable ingredients. | 8 | Pass — `ingredient-check` |
| Opens the browser print flow for paper or PDF output. | 10 | Pass — `print-recipe` |
| Exports every saved field in the `recipe-passport/v1` JSON format. | 9 | Pass — `json-export` |
| Works offline after the first completed visit. | 7 | Pass — `offline-reload` |
| It does not scrape recipe sites, host recipes, or require an account. | 12 | **F-3-1** (account portion is `no-account`) |
| Privacy and storage | 3 | Pass — heading |
| All processing happens in the browser. | 6 | Pass — `local-only` |
| Real recipes use `localStorage["recipe-passport:v1:recipes"]`. | 4 | Pass — `local-only` |
| Demo recipes use the separate `sessionStorage["demo:recipe-passport:v1:recipes"]` key. | 7 | Pass — `demo-isolation` |
| There are no analytics, third-party scripts, or fonts from other sites. | 11 | **F-3-2** |
| The app sends no recipe data to external APIs while you use it. | 12 | Pass — `local-only` |
| Browser storage is not a permanent backup. | 7 | Pass — caution |
| Export the cookbook before clearing browser data or changing devices. | 10 | Pass — caution |
| See the demo contract, privacy, and terms. | 7 | Pass |
| Develop | 1 | Pass — heading |
| Requirements: Node.js 22 or newer and npm. | 7 | Pass — developer requirement |
| Open http://localhost:5173. | 2 | Pass |
| The demo is at http://localhost:5173/demo. | 5 | Pass |
| Test | 1 | Pass — heading |
| Playwright 1.58.2 is pinned because the factory image provides its browser build. | 12 | Pass — repository fact |
| Run one public claim with its tag: | 7 | Pass |
| The unit tests cover JSON normalization and errors. | 8 | Pass — repository fact |
| The browser suite covers every claim in `.factory/claims.json`, serious accessibility findings, keyboard use, mobile width, routing, empty states, and editing. | 20 | Pass — verified suite |
| Build and deploy | 3 | Pass — heading |
| The exact production command is: | 5 | Pass |
| It creates `dist/` with `dist/index.html` at the root. | 8 | Pass — build verified |
| Each build also writes `dist/build-info.json` and shows the exact Git commit in the footer, so a deployed artifact can be identified. | 21 | Pass — build verified |
| Deploy that directory to Azure Static Web Apps. | 8 | Pass |
| `public/staticwebapp.config.json` sets app routes, security headers, and cache rules. | 9 | Pass — repository fact |
| The repository does not manage DNS, billing, or deployment credentials. | 10 | Pass — repository scope |
| Design and provenance | 3 | Pass — heading |
| The product-specific visual system and where the generated artwork came from live in `.factory/design.md`. | 14 | Pass — documentation fact |
| The hero art was generated for this product with the factory image model and optimized locally to WebP. | 18 | Pass — provenance fact |
| License | 1 | Pass — heading |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

## Demo and sandbox

`/?demo=1` redirected in one click to `/demo`, whose first screen already
showed three complete recipes (Tomato-braised butter beans, Lemon olive oil
cake, and Cold sesame noodle salad), search, and export. The persistent banner
read “Demo — sample data, nothing is saved to your cookbook.” and supplied
**Reset demo** and **Start for real**.

I seeded real local storage with `real-sentinel` before demo entry. Reset
restored the original three sample cards; the real serialized value remained
byte-for-byte unchanged. The live flow made requests only to the product
origin. The registered offline test visited a 404, went offline, opened fresh
`/add`, and reloaded demo successfully. Demo isolation is not a finding.

## Claims gate

A fresh clone at `/tmp/recipe-passport-review3.KS9cwb/repo` passed `npm ci`
(zero vulnerabilities). Every literal command in `.factory/claims.json` was
run separately and passed: `paprika-import`, `manual-add`, `paste-recipe`,
`search-cookbook`, `json-export`, `print-recipe`, `offline-reload`,
`local-only`, `demo-isolation`, `free-use`, `recipe-management`,
`ingredient-check`, `no-account`, `export-import-roundtrip`,
`source-retention`, and `recipe-fields`.

The same clone passed `npm test` (8 unit and 33 Chromium tests) and `npm run
build`. No registered claim command failed. F-3-1 and F-3-2 are unlisted
public-claim defects, not failed commands.

## History, structure, and product fit

Every earlier review, polish report, and handoff was read. Live
`/build-info.json` equals this checkout. F-1-1/F-2-1 are fixed: missing pages
and unknown recipe paths return HTTP 404 with not-found metadata. F-1-2 has
route-specific raw/runtime title, description, canonical, OG, and Twitter data.
F-1-3 through F-1-5 have registered passing tests. F-2-2 through F-2-13 are
fixed: the offline 404 sequence passes; desktop facts fit; isolation/export/
search assertions are strong; the README wording, static 404, sitemap,
one-paste intake, terminology, headings, and plain language are corrected.

Live home, demo, add, privacy, terms, shipped recipe, and 404 confirm
`lang="en"`, one main and h1, metadata, favicon/touch icon, consistent
header/footer with Privacy and Terms, designed 404, and no console errors.
Known sitemap routes and the external factory link return 200; intended missing
paths return 404. Passing tests cover back/forward focus, keyboard, mobile,
reduced motion, and serious/critical Axe issues.

The tomato passport, paper archive art, clipped controls, palette, and type
pairing implement `.factory/design.md` and are distinct from a generic SaaS
template. No AI or sync feature is missing: sync conflicts with the local-first
brief and the local one-paste parser already handles the implied import step
without provider keys.

## What would make this perfect

Add sandbox-tested claims for F-3-1 and F-3-2, or remove/narrow those public
promises. No other finding remains.
