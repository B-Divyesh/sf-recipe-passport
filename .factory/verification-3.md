# Independent verification 3 — FAIL

Verified 29 August 2026 for work order `recipe-passport-verify-3` against the
original builder work order and researched brief.

- Candidate and checked-out commit: `f8c211255f9646d2603b8545ccb31058468f32d5`
- Remote `main` at verification time: `f8c211255f9646d2603b8545ccb31058468f32d5`
- Live URL: <https://recipe-passport.sociobot.in>
- Verdict: **FAIL — do not release this candidate.**

The deployment is healthy and exactly matches the candidate, but a normal core
workflow is broken: a person can find a real saved recipe with search and then
cannot open that result. Additional mobile, keyboard, focus, and input-recovery
defects also violate the acceptance contract.

## Release-blocking defect

### High — filtered real cookbook results open a not-found page

Fresh live reproduction:

1. Open `/add`, save `Search click lentil soup`, and return to the cookbook.
2. Search for `lentils`; the UI correctly reports `1 recipe`.
3. The result link correctly contains
   `/recipe?id=7e250419-0cd4-4a9b-8f85-eb75115dcf00`.
4. Click the result.
5. The app navigates to `/recipe` without the query and renders
   `This recipe card slipped away.`

The same defect affects imported recipes and custom demo recipes because they
use query-based recipe routes. Clearing the search before opening a recipe is
only a workaround; search-to-open is part of the brief's smallest useful
product. The cause is the post-filter link binding at `src/main.ts:456`, which
passes only `link.pathname` to navigation and discards `link.search`.

Evidence: [search-result failure](qa/live-search-result-click.png).

## Other defects

### Medium — accepted long recipe titles destroy mobile reflow and metadata

A valid 200-character unbroken title was accepted on the live add form. At
390 px, the saved recipe page expanded to **8,175 CSS px** wide; the `h1` had an
8,157 px scroll width and the document title was **218 characters**. This
violates mobile reflow and the 60-character route-title contract. There is no
input limit or overflow handling on the recipe heading.

Evidence: [long-title mobile viewport](qa/live-long-title-mobile.png).

### Medium — several mobile interaction targets are below 44 × 44 px

Fresh 390 px measurements found the following visible targets below the
contract minimum:

- header Demo link: 40.4 × 44 px (34.7 × 44 px on the static 404);
- landing privacy link: 185.1 × 20 px;
- add-form Cancel link: 54.2 × 24.8 px;
- privacy email: 161.8 × 19 px;
- terms email: 141.7 × 19 px;
- saved-recipe source link: 101 × 19 px;
- footer build link: 319 × 15 px.

The visually hidden file input was excluded because its visible label is a
properly sized control.

### Medium — the focus indicator does not meet 3:1 contrast

All controls use the mustard `#c58b22` outline. Its contrast is only 2.56:1 on
paper `#f4eedf`, 2.20:1 on paper-deep `#e9ddc6`, and 2.85:1 on cream
`#fffaf0`. The required focus-ring contrast is at least 3:1. Keyboard focus is
otherwise clearly positioned and operational.

Evidence: [keyboard focus](qa/live-keyboard-focus.png).

### Medium — Undo becomes an invisible keyboard stop

After deleting a demo recipe and waiting 6.5 seconds, the toast had opacity 0
and `pointer-events: none`, but its Undo button remained in the DOM with
`tabIndex=0`. Keyboard navigation reached the invisible button after 18 Tab
presses. The control should be removed or made unfocusable when the toast
hides; while visible, focus should make the time-limited recovery reachable.

### Medium — the real HTTP 404 skip link does not move focus to main

On a cold visit to `/not-found-keyboard`, the first Tab correctly focuses
`Skip to main content`. Activating it changes the hash to `#main`, but focus
moves to `body`, not `main`, because the static 404 main has no `tabindex`.
The SPA shell does not have this problem.

### Medium — one invalid URL path reports the wrong error

With valid title, ingredients, and steps but source URL `not a URL`, submission
stays on `/add` and focuses `#sourceUrl`, but announces: `Add a title, at least
one ingredient, and at least one step.` An unsupported but syntactically valid
`ftp://` URL gets the correct HTTP/HTTPS message. The common malformed-input
case therefore fails the required plain recovery guidance.

### Low — the 404 headline violates the no-metaphor copy rule

Both 404 implementations use `This recipe card slipped away.` The following
sentence is clear, but the attached plain-words contract explicitly prohibits
metaphorical headings and asks error headings to name the state directly.

## Mandatory first-read gate — PASS

A cold 1440 × 900 visit answers all three questions without scrolling:

- What: `Move your recipes into a private cookbook.`
- For whom: cooks leaving an app or cluttered recipe page.
- First action: `Try it with sample data`, followed by the outcome that it opens
  a ready-made cookbook.

The same content, all three privacy/offline/price facts, and the primary action
are above the fold at 390 × 844. One click enters `/demo`, which immediately
shows three realistic recipes and the persistent `Demo — sample data, nothing
is saved to your cookbook` banner with Reset demo and Start for real.

Evidence: [cold desktop](qa/live-first-read-desktop.png), [mobile home](qa/live-mobile-home.png), and [mobile demo](qa/live-mobile-demo.png).

## Claim gate — all 20 pass after installation

The first literal pre-install invocation could not start because a clean clone
has no `node_modules` (`vitest: not found`). After the required `npm ci`, every
exact command from `.factory/claims.json` was run independently and passed.
This setup failure is not counted as a product claim failure. The registry has
20 declared IDs, 20 unique test tags, and exactly one tag per ID.

| Claim | Result | Claim | Result |
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

The search claim checks that filtering finds matches by title, ingredient,
category, note, and source. It does not click a dynamically rebuilt real result,
which is why the release blocker above escaped the declared claim suite. No
material landing-page or README claim was found without a registry entry.

## Clean local gates

- `npm ci`: pass; 60 packages installed, 0 vulnerabilities.
- `npm test`: pass; 9 Vitest tests and 37 Chromium Playwright tests.
- `npm run typecheck`: pass.
- `npm run lint`: pass (the repository intentionally aliases this to
  `tsc --noEmit`).
- `npm run build`: pass; `dist/` produced with candidate build identity.
- Exact build: JavaScript 32,649 bytes raw / 10,936 bytes gzip; CSS 18,274
  bytes raw / 4,851 bytes gzip; mobile hero 21,760 bytes; desktop hero 88,624
  bytes; no font files.

The automated suite also passes malformed JSON recovery, 10 MiB + 1 byte
rejection, simulated storage-quota failure without false success, route
metadata, history focus, HTTP 404s, and the declared functional flows.

## Deployment identity and HTTP behavior

Live `/build-info.json` reports the exact candidate SHA. The following local
production-build and live hashes are byte-identical:

| Resource | SHA-256 |
| --- | --- |
| `index.html` | `f0eb138d66c2677a51893366d3527d954b6330e61c9211aa1e238fc17d6c1ab3` |
| `assets/index-DKkdsRUP.js` | `d54666f69557f26ac11acfb7bc38ed6ea2334a73bc1cb1118e3f9afecfeb8c15` |
| `assets/index-CEPF7BcP.css` | `9ffdedc07089074ccb0d5aa86c9222dc5351eebc3a9c017165b980d878164435` |
| `sw.js` | `69cfab21fc345a61d693ccf0009ecb97edbc5fced1566558e18be18318b93952` |

HTTP redirects to HTTPS. Intended product links and the Param Factory link
return 200; mail links are explicit `mailto:` links. Unknown general and recipe
paths return a styled HTTP 404. HTML uses 30-second revalidation, hashed JS/CSS
use `public, max-age=31536000, immutable`, and `sw.js` uses `no-cache`.

Security headers include a self-only CSP for scripts, styles, connections, and
fonts; `frame-ancestors 'none'`; HSTS; `nosniff`; strict-origin referrer policy;
and a restrictive permissions policy.

## Functional, privacy, PWA, and performance evidence

- Paprika fixture import retained the required fields for 2/2 recipes. Manual
  add/edit, one-paste parsing, checkable ingredients, JSON round-trip, delete
  confirmation/undo, and clean print output otherwise work. A generated A4 PDF
  was 30,329 bytes and excluded the header, footer, demo banner, and actions.
- A fresh complete demo-to-real flow made 13 requests, all same-origin GETs.
  There were no request bodies, non-GET requests, third-party origins, source
  URL fetches, analytics, ads, telemetry, or remote fonts. Demo data used
  session storage; leaving demo removed it; the real recipe stayed in local
  storage.
- The live CSP and response headers match those privacy promises. Source scan
  found no runtime API, authentication, analytics, or model gateway.
- This is a static client-only product with no product API or unlock endpoint,
  so server rate-limit, concurrency, health, persistence-boundary, and Entra
  checks are not applicable. No sign-in exists.
- Service-worker `registration.update()` completed. The active/controller URL
  is `/sw.js`; the only app cache is
  `recipe-passport-shell-f8c211255f9646d2603b8545ccb31058468f32d5`.
  Offline reload retained all three demo recipes, and a saved real recipe also
  reloaded offline at its query URL without console/page errors.
- Fresh Lighthouse 13 mobile: Performance 96, Accessibility 100, Best
  Practices 100, SEO 100; FCP 1.0 s, LCP 1.2 s, TBT 240 ms, CLS 0, total 93 KiB.
  Evidence: [Lighthouse JSON](qa/lighthouse-live.json).

## Accessibility and responsive checks that pass

- Axe 4.10.2 reported zero serious/critical findings on home, demo, sample
  recipe, add, privacy, terms, a stored real recipe, and the real 404.
- Every checked route has `lang=en`, one `h1`, one `main`, accurate route title,
  and no horizontal overflow at 390 px for representative content.
- Normal-route keyboard use starts with the visible skip link; Enter moves
  focus to the main heading. Keyboard activation of the primary demo action
  opens `/demo` and focuses its heading. Browser back/forward focus tests pass.
- Reduced motion limits all measured animation/transition duration to 0.01 ms.
- A 720 px layout, representing a 1440 px desktop at 200% zoom, retained all
  first-screen content without horizontal overflow.
- The prescribed URL helper passed after its required output directory was
  created: load 672 ms, zero errors, title/lang/main/one h1/alts/button names all
  present. Evidence: [URL verifier](qa/verify-url/verify.json).

## Reproduction

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run verify:live

mkdir -p .factory/qa/verify-url
VERIFY_NODE_MODULES=/work/repo/node_modules \
  /opt/fleet/lib/verify-url.sh https://recipe-passport.sociobot.in \
  .factory/qa/verify-url
```

Release only after the filtered-result route preserves its query string and
the remaining accessibility, reflow, and recovery defects are fixed and
covered by regression tests.
