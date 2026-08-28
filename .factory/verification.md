# Independent verification — FAIL

Verified on 28 August 2026 for work order `recipe-passport-verify-1`.

- Requested candidate: `b240f21ceed1e946e754366687c2b9bc66c16c91`
- Live URL: <https://recipe-passport.sociobot.in>
- Supplied checkout and remote `main`: `ad5417ffec4b0994c639bbab32f216aebf503950`
- Verdict: **FAIL — do not release this candidate**

## Release blockers

### High — the requested candidate is unavailable and the deployment cannot be identified as it

`git fetch origin b240f21ceed1e946e754366687c2b9bc66c16c91` returned `upload-pack: not our ref`. A full fetch, tags, `git ls-remote`, `git cat-file`, and the GitHub commits API all confirmed that the object is absent. Remote `main` remains at `ad5417f`.

The live footer reports only `Version 1.0 · Original generated artwork`; neither HTML, JavaScript, CSS, source map, service worker, nor response headers includes a commit identity. The live files differ from a clean build of `ad5417f`, so the deployment is neither reproducible from the supplied repository nor attributable to `b240f21`.

Live fingerprints:

| File | SHA-256 |
| --- | --- |
| HTML | `6e31e213c1dc96f5c87d3ecc3f9986c7f2535019fd53a2a98ba351c2860b81de` |
| `/assets/index-Lo-krpPe.js` | `5d8565129accce7c7fe7bb1fd6bd849009cb142e7a4a649882210fb58afa2eef` |
| `/assets/index-B0PdtsgZ.css` | `eb5cd5fbb03d5e991cbded4e27253969b41400a29cbf744ec6e12df7e3ae61e3` |
| `/sw.js` | `4d5c3f407877effc9c4f29ebfbdb87591849df1a3402c267fe8c2cb5891eeba3` |

### High — a valid import below the stated size limit reports success but is lost

On a fresh live `/cookbook`, importing a valid 5,600,116-byte JSON recipe produced `1 recipe imported.` and displayed the recipe. This is below the product's explicit 10 MB rejection threshold. Storage quota was exceeded, however: `localStorage["recipe-passport:recipes:v1"]` remained empty, and the recipe disappeared after reload.

The deployed source map confirms that `persist()` catches the quota error, but both add and import flows immediately overwrite its failure message with a success message. This is silent data loss in the core preservation job.

### High — deployed behavior does not satisfy the repository claim contract

The available `.factory/claims.json` requires a `recipe-passport/v1` export envelope and delete with Undo. The live deployment instead exports `{ format: "recipe-passport", version: 1, ... }` and offers only a confirmation dialog before permanent deletion. The repository's tested `/demo/recipe/sample-braised-beans` route also renders the live 404 page.

Therefore the local claim results cannot establish the deployed behavior, and the deployed behavior would fail at least `@claim:json-export` and `@claim:recipe-management` as written.

## Other defects

### Medium — history navigation loses focus

In-app navigation moves focus to the new `h1`. Browser Back and Forward do not: after `/` → `/demo` → Back or Forward, `document.activeElement` is `body`. This fails the route-focus requirement for screen-reader and keyboard users.

### Medium — multiple mobile targets are smaller than 44 × 44 CSS pixels

At 390 px, the home logo is 40 × 48, ingredient checkbox controls are 22 × 22 with labels about 25 px tall, ingredient rows are 42 px tall, and footer links are about 22 px tall. Axe does not flag target size, but the supplied accessibility contract requires 44 × 44.

### Medium — hashed assets are not given immutable caching

Every tested resource, including hashed JavaScript and CSS, returns `Cache-Control: public, must-revalidate, max-age=30`. The service worker also gets this header rather than `no-cache`. This contradicts the required long-lived immutable policy for hashed assets and the repository's static web configuration.

### Low — sample provenance link is dead

The sample “Pear and cardamom cake” exposes a source link to `https://example.com/family-pear-cake`; it returns HTTP 404. All other crawled product and factory links returned 200.

## Mandatory first-read test

**Pass.** A cold visit at both 1440 × 900 and 390 × 844 answers all three questions without scrolling:

- What: “Move recipes into your own cookbook.”
- For whom: “For cooks leaving an app or a cluttered page who want recipes they can keep.”
- First action: “Try it with sample data,” followed by “Loads three recipes in a separate demo cookbook.”

One click opens `/demo` with three realistic recipes and the persistent “Demo — sample data, nothing is saved to your cookbook” banner, plus Reset demo and Start for real.

## Claims gate

The first literal invocation before dependency installation stopped at `vitest: not found`. After the required clean `npm ci`, every command in the available `.factory/claims.json` passed individually:

| Claim | Result on available `ad5417f` checkout |
| --- | --- |
| `paprika-import` | Pass |
| `manual-add` | Pass |
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

These are baseline results only. They are not candidate results because `b240f21` is unavailable, and they are not deployment results because the live artifact differs.

## Functional and boundary results on the live site

- Paprika import: pass. Both shipped records imported; 2/2 retained title, ingredients, steps, yield, notes, and source (100%).
- Manual add/edit: pass, including HTML-like title text being escaped rather than executed.
- Search: pass for title, ingredient, note, category, and source; no-result state and clearing recover correctly.
- Export: all three demo recipes and their fields are present, but the envelope is incompatible with the repository claim.
- Print/PDF: pass; the control invokes the browser print flow.
- Ingredient checks: pass; checks clear on reload without changing stored recipe data.
- Malformed JSON: pass; a visible recovery message explains what to do.
- File above 10 MB: pass; it is rejected with a clear size message.
- 5.6 MB valid JSON: fail with false success and data loss, as documented above.
- Demo namespace/reset/Start for real: pass. Demo data uses `demo:recipe-passport:recipes:v1`, remains separate from the real key, resets, and is deleted when leaving demo mode.
- Delete cancellation: pass; the confirmation names the recipe. Undo is absent.

## Accessibility, responsive behavior, and errors

- Axe 4.10.2: zero serious or critical findings on `/`, `/demo`, `/cookbook`, `/privacy`, `/terms`, `/missing-page`, and the open add/edit dialog.
- Semantic smoke test: each route has `lang="en"`, a route-specific title, one `h1`, one `main`, and valid image alt handling.
- Console/page errors: none across the tested routes and full live flow.
- Keyboard: skip link is first, visible when focused, and has a 3 px focus outline. Dialog opening focuses the title; Escape closes and restores focus.
- 390 px: no horizontal overflow. The demo remains usable, but target-size failures remain.
- 200% root text size: no horizontal page overflow.
- Reduced motion: no computed animation or transition longer than 20 ms.
- Worker `/opt/fleet/lib/verify-url.sh`: pass; load 760 ms, no console errors, title/lang/main/h1/alts/button labels all present.

## Privacy, network, policies, and PWA

- No third-party requests occurred during the complete demo/add/edit/import/export flow.
- No analytics, remote fonts, runtime APIs, or sign-in controls were observed.
- CSP restricts scripts, styles, images, connections, objects, base URLs, forms, and framing. HSTS, `nosniff`, referrer policy, and permissions policy are present.
- This is a static product with no server-side API endpoint, so API rate-limit and Entra checks are not applicable.
- HTTP redirects to HTTPS.
- Service worker registers and controls the page. Cache `recipe-passport-v3` contains the shell and current hashed JS/CSS. An explicit registration update check completed.
- Offline reload of `/demo` passes with three recipes and no console/page errors.

## Performance

Live transfer sizes:

- JavaScript: 24,325 bytes raw; 8,489 bytes compressed.
- CSS: 16,861 bytes raw; 4,659 bytes compressed.
- Mobile hero: 35,528 bytes WebP.
- Desktop hero: 87,840 bytes WebP.
- Runtime fonts: none.

All asset budgets pass. Three Lighthouse 13 mobile runs scored 88, 93, and 99 Performance (median 93), with Accessibility 100, Best Practices 100, SEO 100, LCP 1.2–1.3 s, CLS 0, and 50 KiB total transfer. TBT varied from 130–490 ms; one run fell below the required 90 performance score, but the median passed.

## Available checkout gates

On the only fetchable commit, `ad5417f`:

- `npm ci`: pass; 0 vulnerabilities.
- `npm test`: pass; 4 unit and 20 Playwright tests.
- `npx tsc --noEmit`: pass.
- Lint: no lint script exists.
- `npm run build`: pass; `dist/` produced.
- Local build: 9.50 KB JS gzip, 4.75 KB CSS gzip, 21.8 KB mobile hero, 88.6 KB desktop hero.

## Evidence and reproduction

Screenshots and the prescribed URL-verifier output are in `.factory/verification-artifacts/`.

Key reproduction steps:

```sh
git fetch origin b240f21ceed1e946e754366687c2b9bc66c16c91
# fails: upload-pack: not our ref

npm ci
npm test
npm run build

VERIFY_NODE_MODULES=/work/repo/node_modules \
  /opt/fleet/lib/verify-url.sh https://recipe-passport.sociobot.in \
  .factory/verification-artifacts/verify-url
```

Release only after the exact candidate is pushed, the deployment exposes a matching build SHA, every claim test passes against that candidate and deployment, and the storage false-success defect is fixed.
