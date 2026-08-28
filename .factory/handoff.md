# Recipe Passport review 2 handoff — FAIL

Completed 28 August 2026 for work order `recipe-passport-review-2` against
commit `aef13759872af439b8b8708b2b12d6679ba514d6` and the matching live build.

## What was done

- Wrote the full adversarial review in `.factory/review-2.md`.
- Tested cold first reads at 390 × 844 and 1440 × 900.
- Audited every landing-page and README sentence/label with word counts.
- Ran every registered claim command separately from fresh clone
  `/tmp/recipe-passport-review2-clean.exhVO9`.
- Exercised demo reset, pre-existing real-data isolation, Start for real,
  same-origin privacy, service-worker offline behavior, deep links, browser
  history focus, metadata, 404s, links, mobile layout, and accessibility on the
  live deployment.
- Read and rechecked every prior review, polish, verification, and handoff
  finding against live behavior and source.
- Made no product-code changes.

## Verification

```sh
npm ci
npm test
npm run build
npm run verify:live

mkdir -p /tmp/recipe-passport-review2-verify-url
VERIFY_NODE_MODULES=/work/repo/node_modules \
  /opt/fleet/lib/verify-url.sh https://recipe-passport.sociobot.in \
  /tmp/recipe-passport-review2-verify-url
```

Results: 7 unit and 29 Chromium tests pass; all 15 claim commands pass
individually; build succeeds; the standard live verifier and URL verifier pass;
live Axe checks report no serious or critical finding. JavaScript is 10,104
bytes gzip and CSS is 4,810 bytes gzip.

## What remains

The verdict is **FAIL** with 13 findings. Two are blocking:

1. Unknown recipe IDs return HTTP 200 with unrelated raw metadata, reopening
   the substance of F-1-1.
2. A fetched 404 replaces the service worker's cached `/index.html`; a fresh
   app route can then render the static 404 while offline, disproving the broad
   offline claim.

The remaining findings cover the desktop fold, incomplete claim assertions,
an unlisted JSON-array promise, 404 shell consistency, sitemap omissions, the
missing one-paste recipe path, and plain-word terminology. Exact evidence and
required fixes are in `.factory/review-2.md`.
