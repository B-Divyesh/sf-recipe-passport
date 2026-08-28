# Polish round 1 — cumulative finding closure

Completed 28 August 2026 for `recipe-passport-polish-1`. Every finding in
`.factory/review-1.md` is closed. There are no earlier review or polish reports.

| Finding | Change made | Automated evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| F-1-1 — unknown URLs returned 200 | Removed the catch-all navigation fallback. Added a product-styled static `404.html`, an Azure `responseOverrides` 404 rule, and rewrites only for known app routes. | `serves a real styled HTTP 404 with a working return path`; unit test `limits app rewrites to known routes and preserves an HTTP 404` | [404 desktop](polish-artifacts/404-desktop.png) | `/missing-page` returned HTTP 404 with “This recipe card slipped away” and a working Return home link. `/demo`, `/privacy`, `/terms`, and the sample recipe remained HTTP 200. |
| F-1-2 — share metadata was identical on every route | Added a shared route metadata registry, runtime updates for title/description/canonical/Open Graph/Twitter fields, and build-time HTML documents for every fixed route and sample recipe. | `serves and maintains route-accurate share metadata` checks browser DOM and raw pre-JavaScript HTML | [demo mobile](polish-artifacts/demo-mobile-390.png) | Raw `/demo` HTML returned “Demo — Recipe Passport”; raw sample-recipe HTML returned its recipe title. Both returned matching Open Graph, Twitter, and canonical URLs. Privacy and Terms passed the same live script. |
| F-1-3 — Recipe Passport export import was unregistered | Added claim `export-import-roundtrip`. Import normalization now preserves both recipe timestamps, so the exported `recipe-passport/v1` envelope re-imports without changing any saved field. | `@claim:export-import-roundtrip preserves every recipe and saved field`; unit test `accepts Recipe Passport exports` compares the whole recipe | [round-trip cookbook](polish-artifacts/roundtrip-cookbook-desktop.png) | Production demo export was imported into an empty real cookbook; all three recipes and every saved field matched byte-for-byte after JSON parsing. |
| F-1-4 — manual source retention was unregistered | Added claim `source-retention` with both manual-entry and Paprika coverage. The test checks the visible source name and sanitized HTTP(S) link in each path. README now says exactly what is retained. | `@claim:source-retention keeps supplied manual and Paprika provenance` | [source retention](polish-artifacts/source-retention-desktop.png) | Production retained “Green kitchen notebook” and its safe URL after reload, then retained “Nadia’s Paprika archive” and its supplied URL after fixture import. |
| F-1-5 — complete add/edit field support was unregistered | Added claim `recipe-fields` and a full add→edit→reload test for ingredients, steps, yield, notes, categories, source name, and source URL. | `@claim:recipe-fields adds and edits every documented recipe field` | [all recipe fields](polish-artifacts/recipe-fields-desktop.png) | Production add/edit/reload retained the changed yield, categories, ingredient list, method, notes, source name, and safe source URL. |

## Required cross-cutting acceptance

- First screen: headline is now “Move your recipes into a private cookbook.” The audience sentence is concrete and 16 words. The tracked [390 px landing screenshot](polish-artifacts/home-mobile-390.png) shows the action, explanation, and all three facts above the fold.
- Demo: the first action links to `/?demo=1`, which enters `/demo`. Production showed the persistent sandbox banner, three seeded recipes, Reset demo, and Start for real. Reset restored all three samples and cleared search while real local storage remained empty.
- Claims: `.factory/claims.json` contains 15 claims. Unit test `registers exactly one browser test tag for every public claim` prevents missing or duplicate tags. Every literal claim command passed separately from a clean clone.
- Structure: every fixed route gets pre-rendered metadata; History API navigation still restores focus to the destination `h1`; Privacy and Terms remain in every footer; the 404 preserves the paper-passport identity.
- Mobile/accessibility: 390 px has no horizontal overflow, required controls remain at least 44 px, reduced motion is unchanged, and Axe found no serious or critical issue on home, demo, sample recipe, Privacy, Terms, or 404.
- Historical repairs: storage-quota failure, the 10 MiB boundary, build/cache identity, delete Undo, Back/Forward focus, mobile target size, immutable asset caching, and dead sample-link regressions all remain in the passing suite.

## Verification summary

- Fresh clone: all 15 commands in `.factory/claims.json` passed individually.
- Full clean-clone suite: 7 unit tests and 29 Chromium tests passed.
- `npm run typecheck`, `npm run lint`, and `npm run build`: pass.
- Build: 10.11 KB gzip JS, 4.79 KB gzip CSS, `dist/index.html` present.
- `/opt/fleet/lib/verify-url.sh`: local and live pass; live load 597 ms, no console errors, correct title/lang/main/h1/alts/button names.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.4 s, CLS 0, TBT 40 ms.
- `npm run verify:live`: pass for cold first screen, query demo/reset/isolation, offline reload, the three added claims, route metadata, Axe, same-origin privacy, 390 px layout, and HTTP 404.

No review finding remains open.
