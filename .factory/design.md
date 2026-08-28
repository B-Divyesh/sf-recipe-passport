# Recipe Passport visual thesis

## Direction

**Surreal editorial scenery: the kitchen archive.** Recipes cross a threshold from a noisy screen into a quiet, physical-feeling archive. The hero shows an impossible tomato-red passport opening into a miniature night kitchen. Paper recipe slips move through the scene like luggage tags. The image is explanatory atmosphere, not a product screenshot. The working interface then becomes calmer and flatter, like an archivist's table.

This suits the product because portability is emotional as well as technical. The visual language says “your recipes travel with you” without turning the headline into a metaphor.

## Tokens

- `--paper: #f4eedf` — warm archive paper; main light background.
- `--paper-deep: #e9ddc6` — section changes and field surfaces.
- `--ink: #172321` — near-black green; primary text (contrast 13.6:1 on paper).
- `--ink-muted: #4f5c57` — supporting text (contrast 6.1:1 on paper).
- `--tomato: #b92e27` — passport cover and primary action.
- `--tomato-dark: #7f1f1a` — hover and dark accents.
- `--cream: #fffaf0` — high surface and text on tomato.
- `--herb: #245d43` — success, active tags, and focus reinforcement.
- `--mustard: #c58b22` — warnings and small editorial marks.
- `--danger: #9d2924` — destructive states, paired with words and icons.
- Dark treatment: `--night: #13211e`, `--night-surface: #1d302b`, `--night-text: #f7f0df`. It appears in the footer, demo banner, and image framing rather than as a user toggle. The thesis is intentionally a single-mode, paper-first reading surface because printed continuity is part of the job.

## Type

- Display: Georgia, `Iowan Old Style`, serif. Its sloped, bookish forms make recipe titles feel kept rather than streamed.
- Body and controls: `Avenir Next`, Avenir, `Segoe UI`, system sans-serif. It keeps dense ingredients and controls legible.
- No remote or bundled font files. The paired system stacks avoid a font request and keep first paint immediate.
- Scale: 14 / 16 / 20 / 28 / clamp(40–72) px. Body is 17px with 1.55 leading. Reading measure is 66 characters.

## Spacing and shape

- 8px base rhythm: 8, 16, 24, 32, 48, 72, 96.
- Content width: 1200px; reading width: 720px.
- Controls have compact 10px corners like clipped passport pages. Recipe cards use an asymmetric 4px 22px 4px 4px radius, suggesting a turned page.
- Rules, stamps, and small mono-like labels create hierarchy before boxes do. Cards are reserved for independent recipes.
- Mobile at 390px stacks the hero, actions, filters, and recipe reading columns. Decorative scenery crops behind the passport; no task control disappears.

## Interaction grammar

- Primary actions are filled tomato-red “stamps.” Secondary actions are ink outlines. Text links remain underlined.
- Imported recipes enter as new paper slips. Search results update in place and announce their count.
- A recipe opens from its card into a two-column page: ingredients on the left, numbered method on the right.
- Destructive actions name the recipe, require confirmation, and expose a short undo action.
- Demo mode is a dark green ribbon, always visible, with Reset demo and Start for real.

## Motion

- Signature motion: the hero passport lifts 8px while three paper tabs separate by 6–14px over 600ms. It runs once on first paint, never loops.
- UI changes use 160–220ms opacity and transform transitions. Recipe cards rise from their source position.
- With `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed; changes are instant or use opacity only.

## Asset plan and prompt sheet

### Hero and social art

- Subject: an open tomato-red passport whose paper landscape becomes a miniature kitchen archive; recipe slips, herbs, a wooden spoon, pantry jars, no people.
- World: dreamlike editorial tabletop, impossible scale, ownership and travel without literal airplanes or globes.
- Materials: matte gouache, cut paper, linen, old cream card stock, soft grain.
- Light: low warm window light against deep herb-green shadows.
- Lens/composition: landscape 3:2, object weighted right with calm negative space on the left; layered depth; clear silhouette at thumbnail size.
- Palette words: tomato lacquer, cream paper, herb shadow, mustard glint, black-green ink.
- Negative list: no text, letters, watermark, logo, brand packaging, people, hands, screens, glossy 3D, gradients, stock-photo look, generic app interface.
- Intended outputs: 1536×1024 source; responsive WebP hero crops at 640 and 1280; 1200×630 social crop.

Final production prompt:

> Use case: stylized-concept. Asset type: editorial landing hero for a private offline recipe archive. A surreal tabletop still life: an open tomato-red passport becomes a miniature quiet kitchen archive, with cream recipe slips rising like orderly page tabs, a wooden spoon crossing the fold, small unlabeled pantry jars and herb sprigs. Matte gouache and layered cut-paper construction, tactile linen and card grain, warm side light, deep herb-green shadows, mustard glints. Landscape composition, main object on the right, generous calm paper-toned negative space at left, strong readable silhouette, sophisticated food-magazine editorial art. No text, letters, numbers, watermark, logos, brands, people, hands, screens, airplane, globe, glossy 3D, gradients, or stock-photo look.

### Authored marks

- The wordmark icon is a hand-authored SVG passport with one recipe-line motif.
- Search, print, file, and download icons are inline authored SVG paths or plain text labels.

## Provenance

- Hero/source asset: generated specifically for Recipe Passport with the factory Azure image deployment through `/opt/fleet/lib/gen-image.sh`; creation date 2026-08-28; prompt above. Original generated asset, no third-party source material.
- Wordmark and UI marks: authored in this repository, 2026-08-28, MIT with the product.
- Generated imagery is disclosed in the site footer.

## Performance treatment

- Hero WebP is capped below 300 KB at its largest served size and has fixed dimensions.
- The 640px hero is the mobile source. The social image is never loaded by the page.
- The page uses no runtime image library; animation is CSS-only.
