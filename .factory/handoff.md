# Recipe Passport verification 3 handoff

Completed 29 August 2026 for work order `recipe-passport-verify-3`.

## Result

**FAIL — do not release candidate
`f8c211255f9646d2603b8545ccb31058468f32d5`.**

The tested live deployment at <https://recipe-passport.sociobot.in> matches the
candidate byte-for-byte for HTML, JavaScript, CSS, and the service worker. The
build, all 20 claims, complete automated suite, privacy checks, offline behavior,
headers, and performance pass. The candidate still fails the real job because
a filtered saved-recipe result opens `/recipe` without its `?id` and shows the
not-found screen.

Full evidence and reproduction steps are in
[verification-3.md](verification-3.md).

## Defects by severity

- **High:** filtered real/custom recipe results discard the ID query when
  clicked and cannot be opened. Reproduced live after a normal add → search →
  open flow.
- **Medium:** a 200-character unbroken title creates an 8,175 px-wide mobile
  page and a 218-character document title.
- **Medium:** multiple visible mobile targets are below 44 × 44 px.
- **Medium:** the mustard focus outline is below 3:1 contrast on the product's
  light surfaces.
- **Medium:** the Undo button remains keyboard-focusable after its toast becomes
  invisible.
- **Medium:** the static HTTP 404 skip link changes the hash but leaves focus on
  `body` instead of `main`.
- **Medium:** malformed source URLs announce the unrelated required recipe-field
  error.
- **Low:** the 404 headline is metaphorical despite the plain-words contract.

## Verification summary

- Cold first read and one-click isolated demo: pass.
- Every literal `.factory/claims.json` command after `npm ci`: pass (20/20).
- `npm test`: pass (9 unit, 37 Chromium browser tests).
- `npm run typecheck`, `npm run lint`, `npm run build`: pass.
- Live full-flow verifier and prescribed URL verifier: pass.
- Deployment identity: exact candidate SHA and byte-identical entry artifacts.
- Axe serious/critical: zero on all checked representative routes.
- Privacy request log: 13 same-origin GETs, no bodies or third-party traffic.
- Service-worker update and offline demo/real recipe reload: pass.
- Lighthouse mobile: 96 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.2 s; CLS 0; 93 KiB total.
- Built budgets: JS 10,936 bytes gzip, CSS 4,851 bytes gzip, hero images 21,760
  and 88,624 bytes, no fonts.
- Server API rate limiting, backend concurrency, and sign-in/Entra: not
  applicable; the product is static and exposes no server endpoint or sign-in.

## Changes made

No product code was modified. This verification added only independent QA
evidence, `.factory/verification-3.md`, and this handoff.

## Next steps

Fix the high-severity search navigation defect first and add a regression test
that searches then opens a real query-based recipe. Then address all medium and
low findings, rerun every claim command and full gate, redeploy, and verify the
new build identity from a clean context.
