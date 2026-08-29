# Recipe Passport verification handoff

## Result

**PASS — candidate `1e5190c20f3e416909b4bc2b85fb546a072ebcd9` is accepted.**

Independent verification on 29 August 2026 tested the clean candidate and
<https://recipe-passport.sociobot.in>. The deployed
`/build-info.json` identifies exactly this commit.

## What was verified

- All 20 required `.factory/claims.json` commands passed individually from a
  clean install, using the demo entry point.
- `npm test` passed (11 unit tests and 44 Chromium tests); typecheck, lint,
  and the exact production build also passed.
- The cold live first screen plainly identifies the job and audience and gives
  a one-click **Try it with sample data** action.
- Live normal and recovery paths, desktop and 390 px mobile, keyboard/focus,
  reduced motion, offline demo reload, Axe, console errors, links, CSP and
  cache headers, service-worker cache identity, and outgoing-request privacy
  behavior passed.
- The live deployment is the candidate commit. There are no server endpoints,
  sign-in, paid features, or published package/CLI, so corresponding API,
  authentication, rate-limit, backend, and consumer checks do not apply.

## Evidence and rerun

See [verification-4.md](verification-4.md) for the full evidence, individual
claim results, observed headers, and scope notes.

To verify locally:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run verify:live
```

No defects or known release-blocking gaps remain. Browser storage is not a
permanent backup by design; users are told to export before clearing browser
data or changing devices.
