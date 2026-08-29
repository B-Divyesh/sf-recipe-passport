# Recipe Passport polish 5 handoff

Completed 29 August 2026 for `recipe-passport-polish-5`.

## Result

All seven findings from review 5 and every earlier review/verification finding
are closed. The product remains a static Vite + TypeScript site with its
tomato-red paper-passport visual system. The one-click demo is now a registered
claim, and all slogan/metaphor copy identified by the review is gone.

Product repair commit `8e9a87f55537191d1cf0f7803b99b70d9a16705b`
was pushed to `origin/main` and deployed to
<https://recipe-passport.sociobot.in> as Azure deployment
`7006b04d-b5a5-478a-9dc4-e44a4b0bf52c`. The complete finding map is
[polish-5.md](polish-5.md).

## What changed

- Removed the hero travel caption and replaced four vague headings plus the
  footer slogan with the exact descriptive copy required by review 5.
- Added `demo-one-click` to `.factory/claims.json`. Its fresh-context browser
  test proves the `/?demo=1` link, `/demo` destination, persistent banner,
  Reset demo, Start for real, three named recipes, reset behavior, discarded
  demo storage, and byte-for-byte preservation of seeded real data.
- Updated the static 404 footer, live verification script, copy audit, demo
  contract, and catalog description. The catalog line is verb-first and 87
  characters.
- Preserved all earlier route metadata, real 404, focus restoration, legal
  links, offline shell, import/export, privacy, storage, accessibility, and
  mobile fixes.

## Exact verification evidence

- Fresh GitHub clone:
  `/tmp/recipe-passport-polish5-clean.XTZtcY/repo` at
  `8e9a87f55537191d1cf0f7803b99b70d9a16705b`.
- `npm ci`: pass, 60 packages, zero vulnerabilities.
- Every one of the 20 literal commands in `.factory/claims.json`: pass
  independently.
- `npm test`: pass — 9 Vitest tests and 37 Chromium tests.
- `npm run typecheck`, `npm run lint`, `npm run build`: pass.
- Build output: `dist/index.html`; 10.96 KB gzip JavaScript and 4.84 KB gzip
  CSS, below the 200 KB and 50 KB budgets.
- Local `/opt/fleet/lib/verify-url.sh`: pass in 557 ms with no console errors.
- Cold live `npm run verify:live`: pass for first screen, one-click demo,
  isolation/reset, offline reload, all privacy assertions, complete field
  round trip, metadata, Axe, mobile layout, legal pages, and HTTP 404s.
- Cold live `/opt/fleet/lib/verify-url.sh`: pass in 693 ms with no console
  errors, one h1, one main, `lang=en`, complete alt text, and named buttons.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.06 s, CLS 0, TBT 15 ms.
- Live `/build-info.json` matched the repair commit. Unknown general and
  recipe paths returned HTTP 404; all intended routes returned 200.

Evidence files:

- [mobile home](polish-artifacts/polish-5-home-mobile-live.png)
- [mobile demo](polish-artifacts/polish-5-demo-mobile-live.png)
- [styled 404](polish-artifacts/polish-5-404-live.png)
- [live URL verifier](polish-artifacts/polish-5-live-check/verify.json)
- [live Lighthouse report](polish-artifacts/polish-5-lighthouse-live.json)

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run verify:live
```

For each entry in `.factory/claims.json`, also run its literal `test` command
from a fresh clone. Deploy only `dist/` with the work-order static deployment
script.

## Known gaps and next steps

None. No finding or minor item is deferred. Future changes should retain the
20 claim tags, query demo isolation, route-level raw metadata, HTTP 404 status,
and commit-identified service-worker cache.
