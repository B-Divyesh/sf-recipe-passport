# Recipe Passport polish handoff — PASS

Completed 28 August 2026 for work order `recipe-passport-polish-1`.

The cumulative review is closed with no remaining finding of any severity.
Recipe Passport remains a Vite + TypeScript static web app with its original
paper archive and tomato-passport visual identity.

## What changed

- Unknown paths now receive a real HTTP 404 and the styled recipe-card 404 page. Known app routes use explicit Azure Static Web Apps rewrites.
- Demo, Privacy, Terms, and the three sample recipes ship route-specific HTML metadata for crawlers. Runtime navigation updates title, description, canonical, Open Graph, and Twitter metadata.
- The first action uses the one-click `/?demo=1` entry. It opens the isolated `/demo` cookbook with its persistent banner, Reset demo, and Start for real controls.
- The first-screen headline now states the job directly: “Move your recipes into a private cookbook.”
- Three public claims were added and proven: Recipe Passport export/import round trip, supplied source retention, and complete add/edit field retention. Export imports now preserve saved timestamps as well as recipe content.
- The product now includes a production-like static test server, a repeatable `npm run verify:live` check, a verb-first catalog description, updated copy/demo documentation, and finding-level evidence in `.factory/polish-1.md`.

## Exact verification evidence

Clean clone `/tmp/recipe-passport-polish-clean.6fUsTp`:

- `npm ci`: pass, 60 packages, 0 vulnerabilities.
- Every one of the 15 literal `test` commands in `.factory/claims.json`: pass individually.
- `npm test`: 7 unit tests and 29 Playwright Chromium tests passed in 31.7 s.
- `npm run typecheck`: pass.
- `npm run lint`: pass.
- `npm run build`: pass; `dist/index.html` is at the output root.
- Built output: 29.54 KB raw / 10.11 KB gzip JavaScript and 17.93 KB raw / 4.79 KB gzip CSS. Mobile hero is 21.8 KB; desktop hero is 88.6 KB; no font payload is loaded.

Quality checks:

- Axe 4.10.2: zero serious or critical violations on `/`, `/demo`, the sample recipe, `/privacy`, `/terms`, and the static 404.
- Local URL verifier: pass, 539 ms load, no console errors, title/lang/one h1/main/alts/button labels correct.
- Live URL verifier: pass, 597 ms load, no console errors, title/lang/one h1/main/alts/button labels correct.
- Lighthouse 13 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.4 s, CLS 0, TBT 40 ms.
- Browser privacy/offline: only the product origin was requested; real storage stayed empty in demo; a service-worker-controlled offline reload rendered all three sample recipes.
- Mobile: 390 × 844 had no horizontal overflow, kept the required first-screen copy/actions/facts above the fold, and retained 44 px targets.

## Deployment and live checks

Deployed through `/opt/fleet/lib/deploy-static.sh recipe-passport /work/repo/dist`
to <https://recipe-passport.sociobot.in>. The first deployed repair identified
itself as `3fece470c02858344726eedee94e1f19f003f78b`; the final deployment is
verified by matching `/build-info.json` to the pushed `main` tip.

Cold production checks passed:

- `/missing-page` → HTTP 404 and a working Return home link.
- `/demo`, `/privacy`, `/terms`, and `/demo/recipe/sample-braised-beans` → HTTP 200.
- Raw HTML and runtime metadata agree for Demo, Privacy, Terms, and the sample recipe.
- `npm run verify:live` → `LIVE PASS` for first-screen wording, query demo/reset/isolation, offline reload, all three new claim flows, metadata, Axe, privacy, mobile layout, and 404.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run verify:live
```

## Known limits

- Imports are unencrypted JSON, not compressed `.paprikarecipes` archives.
- Browser storage does not sync across devices; JSON export is the backup path.
- PDF output uses the browser Print → Save as PDF flow.
- Ingredient checks are temporary cooking state and reset on reload.

These are stated product boundaries, not unresolved review findings. There are no TODOs or deferred polish items.
