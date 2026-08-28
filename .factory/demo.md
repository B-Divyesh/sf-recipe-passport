# Demo sandbox

## Entry point

- One-click entry: `https://recipe-passport.sociobot.in/?demo=1`
- Persistent demo route: `https://recipe-passport.sociobot.in/demo`
- Local: `http://localhost:5173/demo`
- The query entry redirects to `/demo` before the sample cookbook is used.

The first click from the landing page is **Try it with sample data**. Its `/?demo=1` link opens the populated cookbook without an account or setup.

## Sample data

The demo contains three complete, deliberately varied recipes:

1. Tomato-braised butter beans — a weeknight recipe with seven ingredients.
2. Lemon olive oil cake — a baking recipe with metric amounts.
3. Cold sesame noodle salad — a lunch recipe searchable by “tahini”.

Each recipe has a yield, ingredients, method, notes, categories, and source provenance. The demo supports search, ingredient checking, edit, delete with undo, print, JSON export, and adding or importing recipes.

## Isolation and reset

- Demo storage key: `sessionStorage["demo:recipe-passport:v1:recipes"]`.
- Real storage key: `localStorage["recipe-passport:v1:recipes"]`.
- Demo mode never reads or writes the real key.
- **Reset demo** replaces demo changes with the original three recipes.
- **Start for real** deletes the demo key and opens the real add-recipe screen.
- Navigating from demo mode to a non-demo route also deletes the demo key.

The sample data and app shell are available to the service worker, so the offline claim can be checked entirely inside this sandbox. Every build gives that cache a commit-specific version, so an update fetches a new shell rather than reusing a prior release.
