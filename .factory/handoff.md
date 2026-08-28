# Recipe Passport polish 2 handoff

Completed 28 August 2026 for work order `recipe-passport-polish-2`.
Product repair commit: `59beb37a1988dca21a2f5916dd8628c4d738d800`.

## Delivered

- Closed every F-2-1 through F-2-13 finding in `.factory/review-2.md`; the
  finding-by-finding map is in `.factory/polish-2.md`.
- Replaced wildcard recipe rewrites with fixed static query routes, so unknown
  recipe path URLs return a true styled 404 with not-found metadata.
- Made the service-worker shell immutable after install; an HTTP 404 can no
  longer replace the shell used for offline app routes.
- Added a local, one-paste recipe intake that fills editable fields from title,
  Ingredients, and Method sections. It makes no network request.
- Strengthened the demo-isolation, JSON export, search, offline, route, desktop
  fold, sitemap, 404-shell, and accessibility checks.
- Updated public and developer copy, catalog description, README, demo contract,
  404 shell, and claim register. The visual paper archive/passport identity is
  preserved.

## Exact local evidence

Fresh clone: `/tmp/recipe-passport-polish2-clean` from repair commit
`59beb37a1988dca21a2f5916dd8628c4d738d800`.

- `npm ci`: pass, zero vulnerabilities.
- Every one of the 16 literal claim commands in `.factory/claims.json` passed
  separately from that clone: paprika-import, manual-add, paste-recipe,
  search-cookbook, json-export, print-recipe, offline-reload, local-only,
  demo-isolation, free-use, recipe-management, ingredient-check, no-account,
  export-import-roundtrip, source-retention, and recipe-fields.
- `CI=1 npm test`: pass — 8 unit tests and 33 Chromium tests.
- `CI=1 npm run lint` and `CI=1 npm run build`: pass. `dist/index.html` is at
  the required root.
- Build payload: JavaScript 10,974 bytes gzip; CSS 4,921 bytes gzip.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173
  /tmp/recipe-passport-verify-local`: pass; 580 ms load, correct title/lang,
  one main and h1, all images have alternatives, labelled buttons, no errors.
- Playwright Axe integration: no serious or critical violations on home, demo,
  sample recipe, Privacy, Terms, or 404. The standalone Axe CLI could not find
  a Chrome binary in this container; the project’s pinned Playwright Chromium
  Axe checks are the recorded accessibility evidence.

## Run and deploy

```sh
npm ci
npm test
npm run build
```

Deploy `dist/` as an Azure Static Web Apps artifact. The repository has no
checked-in deployment workflow; pushing `main` is the work-order deployment
trigger. After the trigger completes, run:

```sh
npm run verify:live
```

## Deployment and cold live evidence

- Deployed through `/opt/fleet/lib/deploy-static.sh recipe-passport
  /work/repo/dist` twice: product repair deployment
  `11109893-9595-4474-a932-d14a3f2d77bf`, then final evidence deployment
  `5d07d323-19b4-4b42-955f-539aa3091552`.
- The final deployed product build ID is
  `a114361549287d665cbbd18f1e505cef073ecea1`.
- `npm run verify:live`: pass. It cold-checks the 390 px and 1440 px first
  screens, query demo/banner/reset, real-data isolation, same-origin privacy,
  the poisoned-shell offline sequence, all exercised recipe flows, one-paste
  intake, route metadata, Axe, and all three HTTP 404 forms.
- `/opt/fleet/lib/verify-url.sh https://recipe-passport.sociobot.in
  /tmp/recipe-passport-verify-live`: pass; 574 ms load, no console errors,
  correct title/lang/main/h1/alts/button names.
- Manual HTTP check: `/recipe/not-a-real-recipe` returns 404; its raw 404
  document has the designed header, footer, canonical, and Return home link.

## Remaining work

None. The live product was rechecked cold after deployment and every review
finding, including the earlier cumulative findings, is covered by passing
evidence.
