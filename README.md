# Recipe Passport

Move your recipes into a private offline cookbook.

Recipe Passport is for people leaving a recipe app or tired of ad-heavy recipe pages. It imports user-provided Paprika JSON and pasted recipes into a searchable cookbook stored in the browser. Every recipe keeps its source. A cook can print one clean recipe or export the whole cookbook as JSON.

Live site: <https://recipe-passport.sociobot.in>

Try the isolated sample: <https://recipe-passport.sociobot.in/demo>

## What it does

- Imports Paprika JSON, JSON arrays, and Recipe Passport JSON exports.
- Adds or edits a recipe with ingredients, steps, yield, notes, categories, and source.
- Searches recipes by title, ingredient, category, note, or source.
- Opens a clean recipe view with checkable ingredients.
- Opens the browser print flow for paper or PDF output.
- Exports every saved field in the `recipe-passport/v1` JSON format.
- Works offline after the first completed visit.

It does not scrape recipe sites, host recipes, or require an account.

## Privacy and storage

All processing happens in the browser. Real recipes use `localStorage["recipe-passport:v1:recipes"]`. Demo recipes use the separate `sessionStorage["demo:recipe-passport:v1:recipes"]` key. There are no analytics, third-party scripts, remote fonts, or runtime API calls.

Browser storage is not a permanent backup. Export the cookbook before clearing browser data or changing devices. See [the demo contract](.factory/demo.md), [privacy](https://recipe-passport.sociobot.in/privacy), and [terms](https://recipe-passport.sociobot.in/terms).

## Develop

Requirements: Node.js 22 or newer and npm.

```sh
npm install
npm run dev
```

Open `http://localhost:5173`. The demo is at `http://localhost:5173/demo`.

## Test

Playwright 1.58.2 is pinned because the factory image provides its browser build.

```sh
npm test
```

Run one public claim with its tag:

```sh
npm test -- --grep @claim:offline-reload
```

The unit tests cover JSON normalization and errors. The browser suite covers every claim in [`.factory/claims.json`](.factory/claims.json), serious accessibility findings, keyboard use, mobile width, routing, empty states, and editing.

## Build and deploy

The exact production command is:

```sh
npm run build
```

It creates `dist/` with `dist/index.html` at the root. Deploy that directory to Azure Static Web Apps. `public/staticwebapp.config.json` supplies SPA routing, security headers, and cache rules. The repository does not manage DNS, billing, or deployment credentials.

## Design and provenance

The product-specific visual system and generated-asset provenance live in [`.factory/design.md`](.factory/design.md). The hero art was generated for this product with the factory image model and optimized locally to WebP.

## License

MIT. See [LICENSE](LICENSE).
