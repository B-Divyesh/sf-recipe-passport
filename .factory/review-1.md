# Adversarial first-read review 1 — FAIL

Reviewed 28 August 2026 against live https://recipe-passport.sociobot.in and repository commit 76d373bb50ff2910fb9c43d2e6035b6f8ec849b3.

**Verdict: FAIL.** The core first-read, demo, privacy sandbox, claim commands, and visual product experience pass. Five findings remain: a missing HTTP 404, route-inaccurate share metadata, and three unregistered README claims. A PASS requires zero findings.

## Cold first read

Fresh browser contexts at 390 × 844 and 1440 × 900 began at scroll position zero. Before scrolling, a visitor can state:

- **What it does:** Move recipes into a saved, searchable cookbook.
- **For whom:** Cooks leaving a recipe app or ad-heavy pages.
- **First action:** Select **Try it with sample data** to open a ready-made cookbook.

Evidence visible on both first screens: “Move your recipes into a quiet cookbook.”, “For cooks leaving an app or ad-heavy pages, Recipe Passport keeps a searchable copy on this device.”, and “The sample opens a ready-made cookbook.” The three privacy/offline/price facts were also visible at 390 px. This requirement passes; no first-read blocker was found.

## Findings

### F-1-1 — BLOCKING — Unknown URLs return success instead of a real 404

- **Location / evidence:** https://recipe-passport.sociobot.in/missing-page returns HTTP **200**. The client then renders “This recipe card slipped away.” The committed public/staticwebapp.config.json contains only a navigation fallback and no responseOverrides 404 rule or 404.html.
- **Why this fails:** A browser user gets a designed not-found screen, but a bookmark checker, crawler, or client without JavaScript is told that a page exists. This is not a real 404 route and does not satisfy the static-site routing contract.
- **Concrete fix:** Ship a styled 404.html and configure Azure Static Web Apps responseOverrides to rewrite 404 to /404.html. Restrict the SPA fallback to known application routes so an unknown path keeps HTTP 404. Add a deployed-route test that asserts an unknown URL is status 404 and displays the return-home action.

### F-1-2 — Medium — Open Graph and Twitter data describe the landing page on every route

- **Location / evidence:** On live /demo, /privacy, /terms, /demo/recipe/sample-braised-beans, and /missing-page, browser title, description, and canonical are route-specific. Open Graph title remains “Recipe Passport — Keep recipes offline”, Open Graph URL remains https://recipe-passport.sociobot.in/, and Twitter title remains the landing title. setMetadata() in src/main.ts changes only title, description, and canonical.
- **Why this fails:** Sharing a demo, policy, recipe, or missing URL falsely previews the home page. Bots that do not execute the SPA also receive the home document metadata for every deep link.
- **Concrete fix:** Generate route-specific static documents (preferred for social crawlers), or update og:title, og:description, og:url, twitter:title, twitter:description, and twitter:image on every client route as an interim measure. Add route metadata checks for /demo, /privacy, /terms, a recipe, and 404.

### F-1-3 — Medium — README promises import of Recipe Passport exports without a registered claim

- **Location / quote:** README, **What it does**: “Imports Paprika JSON, JSON arrays, and Recipe Passport JSON exports.”
- **Why this fails:** claims.json has paprika-import, but no claim or tagged test for re-importing the product's own recipe-passport/v1 export envelope. json-export only verifies download output. A visitor may rely on export/import portability that the claim register does not prove.
- **Concrete fix:** Add an export-import-roundtrip claim and a clean-browser test: export realistic demo data, import that file into a new real cookbook, then assert every recipe and retained field. Alternatively remove “and Recipe Passport JSON exports” until that test exists.

### F-1-4 — Medium — README's source-retention promise is not registered for manual recipes

- **Location / quote:** README introduction: “Every recipe keeps its source.”
- **Why this fails:** paprika-import proves source retention for the Paprika fixture only. manual-add does not enter or assert sourceName or sourceUrl. The unqualified “Every recipe” promise therefore has no matching claims entry and no proof for a pasted recipe.
- **Concrete fix:** Add a source-retention claim with Paprika and manual-entry coverage, including source name and safe URL, or rewrite this as “Paprika imports keep their supplied source.”

### F-1-5 — Medium — README claims field-complete editing without a matching claim

- **Location / quote:** README, **What it does**: “Adds or edits a recipe with ingredients, steps, yield, notes, categories, and source.”
- **Why this fails:** manual-add asserts title, yield, ingredients, steps, and notes, but not categories or source. recipe-management edits only the title. No claim records the complete field list or verifies editing those fields.
- **Concrete fix:** Add recipe-fields to claims.json and test a manual add plus edit of all six named fields, then reload and assert them. Or narrow the sentence to the fields currently covered by claims.

## Copy audit

Counts use whitespace-separated words; contractions and hyphenated words count as one. This includes sentence-like landing text plus headings and controls, so the required button and out-of-context-heading checks are explicit. No item is over 22 words. No banned marketing adjective or jargon was found. “The product” is an eyebrow attached to the following heading, not an independent announced heading.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Recipe Passport | 2 | Pass — wordmark |
| Cookbook | 1 | Pass — nav label |
| Add recipe | 2 | Pass — nav label |
| Demo | 1 | Pass — nav label |
| Privacy | 1 | Pass — nav label |
| A local recipe archive | 4 | Pass |
| Move your recipes into a quiet cookbook. | 7 | Pass |
| For cooks leaving an app or ad-heavy pages, Recipe Passport keeps a searchable copy on this device. | 16 | Pass |
| Try it with sample data | 6 | Pass — required demo action |
| Import your recipes | 3 | Pass — result-naming verb |
| The sample opens a ready-made cookbook. | 6 | Pass |
| Import accepts Paprika JSON or a pasted recipe. | 8 | Pass |
| Stays on this device | 4 | Pass — local-only |
| Works offline after the first visit | 6 | Pass — offline-reload |
| Price: free | 2 | Pass — free-use |
| A red recipe folio opens into a miniature paper kitchen archive. | 10 | Pass — image alt |
| Your recipes, packed for the next kitchen. | 7 | Pass |
| The product | 2 | Pass — eyebrow |
| Read the recipe, not the page around it. | 8 | Pass |
| 03 recipes | 2 | Pass — sample label |
| Weeknight · Beans | 2 | Pass — sample label |
| Tomato-braised butter beans | 3 | Pass — sample title |
| Serves 3 | 2 | Pass — sample fact |
| 7 ingredients | 2 | Pass — sample fact |
| Butter beans | 2 | Pass — sample ingredient |
| Crushed tomatoes | 2 | Pass — sample ingredient |
| Smoked paprika | 2 | Pass — sample ingredient |
| 4 steps | 2 | Pass — sample fact |
| Warm the oil. | 3 | Pass — sample step |
| Simmer for 18 minutes. | 4 | Pass — sample step |
| Fold in the parsley. | 4 | Pass — sample step |
| How it works | 3 | Pass — context-independent heading |
| Carry recipes across in three steps. | 6 | Pass |
| Import | 1 | Pass — step heading |
| Choose a Paprika JSON file or paste your recipe. | 9 | Pass |
| Cook | 1 | Pass — step heading |
| Search by title or ingredient. | 6 | Pass — search-cookbook |
| Open a clean cooking view. | 6 | Pass — descriptive UI copy |
| Take it with you | 4 | Pass — step heading |
| Print one recipe or export the whole cookbook as JSON. | 10 | Pass — print/export claims |
| A tool, not another platform | 5 | Pass — eyebrow |
| Your cookbook does not need an account. | 7 | Pass — no-account |
| Recipe Passport processes your files in this browser. | 8 | Pass — local-only |
| It does not scrape recipe sites or publish your recipes. | 10 | Pass — local-only flow/source inspection |
| Export a complete JSON copy before clearing browser data or changing devices. | 12 | Pass — json-export |
| Read the privacy note | 4 | Pass — result-naming link |
| Keep recipes. | 2 | Pass |
| Keep control. | 2 | Pass |
| Generated editorial imagery. | 3 | Pass |
| No tracking or remote fonts. | 5 | Pass — source/network inspection |
| Privacy | 1 | Pass — footer label |
| Terms | 1 | Pass — footer label |
| Built by Param Factory | 4 | Pass — external link identified |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Recipe Passport | 2 | Pass — document title |
| Move your recipes into a private offline cookbook. | 8 | Pass |
| Recipe Passport is for people leaving a recipe app or tired of ad-heavy recipe pages. | 15 | Pass |
| It imports user-provided Paprika JSON and pasted recipes into a searchable cookbook stored in the browser. | 14 | Pass — import/manual-add/search claims |
| Every recipe keeps its source. | 6 | **F-1-4** |
| A cook can print one clean recipe or export the whole cookbook as JSON. | 14 | Pass — print/export claims |
| Live site: https://recipe-passport.sociobot.in | 2 | Pass — link label |
| Try the isolated sample: https://recipe-passport.sociobot.in/demo | 4 | Pass — demo entry |
| What it does | 3 | Pass — heading |
| Imports Paprika JSON, JSON arrays, and Recipe Passport JSON exports. | 10 | **F-1-3** |
| Adds or edits a recipe with ingredients, steps, yield, notes, categories, and source. | 13 | **F-1-5** |
| Searches recipes by title, ingredient, category, note, or source. | 9 | Pass — search-cookbook |
| Opens a clean recipe view with checkable ingredients. | 8 | Pass — ingredient-check |
| Opens the browser print flow for paper or PDF output. | 10 | Pass — print-recipe |
| Exports every saved field in the recipe-passport/v1 JSON format. | 8 | Pass — json-export |
| Works offline after the first completed visit. | 7 | Pass — offline-reload |
| It does not scrape recipe sites, host recipes, or require an account. | 12 | Pass — no-account/local-only evidence |
| Privacy and storage | 3 | Pass — heading |
| All processing happens in the browser. | 6 | Pass — local-only |
| Real recipes use localStorage recipe-passport:v1:recipes. | 4 | Pass — browser verified |
| Demo recipes use the separate sessionStorage demo:recipe-passport:v1:recipes key. | 7 | Pass — demo-isolation |
| There are no analytics, third-party scripts, remote fonts, or runtime API calls. | 12 | Pass — source/network inspection |
| Browser storage is not a permanent backup. | 7 | Pass — limitation |
| Export the cookbook before clearing browser data or changing devices. | 10 | Pass — clear limitation |
| See the demo contract, privacy, and terms. | 7 | Pass — links resolve |
| Develop | 1 | Pass — heading |
| Requirements: Node.js 22 or newer and npm. | 7 | Pass — setup requirement |
| Open http://localhost:5173. | 1 | Pass — instruction |
| The demo is at http://localhost:5173/demo. | 5 | Pass — instruction |
| Test | 1 | Pass — heading |
| Playwright 1.58.2 is pinned because the factory image provides its browser build. | 11 | Pass — repository fact |
| Run one public claim with its tag: | 7 | Pass — instruction |
| The unit tests cover JSON normalization and errors. | 8 | Pass — repository fact |
| The browser suite covers every claim in .factory/claims.json, serious accessibility findings, keyboard use, mobile width, routing, empty states, and editing. | 19 | Pass — full suite run |
| Build and deploy | 3 | Pass — heading |
| The exact production command is: | 5 | Pass — instruction |
| It creates dist/ with dist/index.html at the root. | 8 | Pass — build verified |
| Each build also writes dist/build-info.json and shows the exact Git commit in the footer, so a deployed artifact can be identified. | 21 | Pass — build verified |
| Deploy that directory to Azure Static Web Apps. | 8 | Pass — instruction |
| public/staticwebapp.config.json supplies SPA routing, security headers, and cache rules. | 5 | Pass — except F-1-1 |
| The repository does not manage DNS, billing, or deployment credentials. | 10 | Pass — repository scope |
| Design and provenance | 3 | Pass — heading |
| The product-specific visual system and generated-asset provenance live in .factory/design.md. | 9 | Pass — documentation fact |
| The hero art was generated for this product with the factory image model and optimized locally to WebP. | 17 | Pass — provenance documented |
| License | 1 | Pass — heading |
| MIT. | 1 | Pass — license statement |

## Demo, sandbox, and claims

The demo requirement passes on the live site:

- One click on **Try it with sample data** opens /demo.
- Its first screen is an in-use cookbook with Tomato-braised butter beans, Lemon olive oil cake, and Cold sesame noodle salad.
- The persistent banner reads “Demo — sample data, nothing is saved to your cookbook.” It includes **Reset demo** and **Start for real**.
- After searching then selecting Reset demo, the live demo restored three cards, cleared the search, retained three demo session recipes, and left real localStorage empty.
- A full live demo flow made requests only to https://recipe-passport.sociobot.in. With its service worker ready, an offline reload of /demo rendered all three cards with no console errors.

From a fresh shallow clone at /tmp/recipe-passport-review-clean.gnYlZL (commit 76d373b), npm ci completed with zero vulnerabilities. Every literal command named by .factory/claims.json completed successfully, and npm test passed the full 5-unit / 24-browser suite. This also exercises storage separation, same-origin privacy behavior, and offline reload. npm run build completed and produced dist/index.html.

| Claim ID | Result |
| --- | --- |
| paprika-import | Pass |
| manual-add | Pass |
| search-cookbook | Pass |
| json-export | Pass |
| print-recipe | Pass |
| offline-reload | Pass |
| local-only | Pass |
| demo-isolation | Pass |
| free-use | Pass |
| recipe-management | Pass |
| ingredient-check | Pass |
| no-account | Pass |

## History, structure, and product fit

There are no earlier .factory/review-*.md or .factory/polish-*.md files. I read both historical verification records and the handoff. The earlier storage-loss, deployment-identity, missing Undo, history-focus, small-target, cache-policy, and dead-source-link findings are confirmed fixed in live code: the quota error remains an error, /build-info.json identifies 4c67a47, Undo exists, Back/Forward focus the new h1, controls meet the stated mobile targets, cache headers are immutable for hashed assets / no-cache for the worker, and sample source has no dead outbound URL.

Structure checks otherwise pass: each checked client route has one h1, a route-specific title, description, canonical, lang, favicon, designed visual 404 state, focus restoration, header/footer, Privacy and Terms links, robots, sitemap, no dead discovered links, CSP, and no console errors. The visual identity is distinct: paper archive colors, folio shapes, editorial art, and the red/green kitchen-archive treatment are visibly product-specific, not a generic SaaS hero. Asset provenance and motion policy match .factory/design.md.

The brief does not imply an AI step: local import, search, print, and export are the complete stated job. Adding AI would introduce a privacy and key decision without improving the required task. Import/export portability is already present; F-1-3 requires the stated round trip to be tested.

## What would make this perfect

Serve an actual HTTP 404, make share metadata faithfully describe each URL, and either test/register or narrow every README promise called out above. Then repeat the clean-clone claim commands and the live browser checks before changing this verdict to PASS.
