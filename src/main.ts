import './styles.css';
import { metadataForPath } from './metadata';
import { clearDemo, downloadCookbook, loadRecipes, normalizeRecipe, parsePastedRecipe, parseRecipeJson, removeRecipe, resetDemo, searchRecipes, upsertRecipes } from './recipes';
import type { AppMode, Recipe } from './types';

declare const __BUILD_SHA__: string;

const MAX_IMPORT_BYTES = 10 * 1024 * 1024;
const BUILD_SHA = __BUILD_SHA__;

const appRoot = document.querySelector<HTMLDivElement>('#app');
if (!appRoot) throw new Error('Recipe Passport could not start. Reload this page.');
const app: HTMLDivElement = appRoot;

let undoRecipe: Recipe | undefined;
let undoMode: AppMode = 'real';

const escapeHtml = (value: string): string => value.replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
})[character] ?? character);

const safeUrl = (value: string): string => {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
};

const modeFromPath = (): AppMode => location.pathname.startsWith('/demo') ? 'demo' : 'real';

function routePath(path: string, mode = modeFromPath()): string {
  if (mode === 'demo') {
    if (path === '/cookbook') return '/demo';
    return `/demo${path}`;
  }
  return path;
}

function recipePath(id: string, mode: AppMode): string {
  // The route is a real, server-known static document. The locally held ID is
  // data, not part of a wildcard URL that a static host cannot validate.
  if (mode === 'demo' && ['sample-braised-beans', 'sample-lemon-cake', 'sample-noodle-salad'].includes(id)) {
    return `/demo/recipe/${encodeURIComponent(id)}`;
  }
  return `${mode === 'demo' ? '/demo/recipe' : '/recipe'}?id=${encodeURIComponent(id)}`;
}

function navigate(path: string, replace = false): void {
  if (modeFromPath() === 'demo' && !path.startsWith('/demo')) clearDemo();
  const method = replace ? 'replaceState' : 'pushState';
  history[method]({}, '', path);
  render(true);
}

const logo = `
  <svg class="brand-mark" aria-hidden="true" viewBox="0 0 40 48">
    <path d="M6 3h24a5 5 0 0 1 5 5v35H11a5 5 0 0 1-5-5V3Z" fill="currentColor"/>
    <path d="M11 3v40M16 15h14M16 22h11M16 29h13" fill="none" stroke="var(--paper)" stroke-width="2"/>
    <circle cx="27" cy="36" r="4" fill="var(--mustard)"/>
  </svg>`;

function header(mode: AppMode): string {
  return `
    <a class="skip-link" href="#main">Skip to main content</a>
    <header class="site-header">
      <a class="wordmark" href="/" data-link aria-label="Recipe Passport home">${logo}<span>Recipe Passport</span></a>
      <nav aria-label="Main navigation">
        <a href="${routePath('/cookbook', mode)}" data-link>Cookbook</a>
        <a href="${routePath('/add', mode)}" data-link>Add recipe</a>
        <a href="/demo" data-link${mode === 'demo' ? ' aria-current="page"' : ''}>Demo</a>
        <a href="/privacy" data-link>Privacy</a>
      </nav>
    </header>`;
}

function demoBanner(): string {
  return `
    <aside class="demo-banner" aria-label="Demo mode">
      <p><strong>Demo</strong> — sample data, nothing is saved to your cookbook.</p>
      <div>
        <button class="banner-button" type="button" data-action="reset-demo">Reset demo</button>
        <button class="banner-button banner-button-light" type="button" data-action="start-real">Start for real</button>
      </div>
    </aside>`;
}

function footer(): string {
  return `
    <footer class="site-footer">
      <div>
        <a class="footer-brand" href="/" data-link>${logo}<span>Keep recipes. Keep control.</span></a>
        <p>Artwork generated for Recipe Passport. No tracking. No fonts load from other sites.</p>
      </div>
      <nav aria-label="Footer navigation">
        <a href="/privacy" data-link>Privacy</a>
        <a href="/terms" data-link>Terms</a>
        <a href="https://sociobot.in" rel="noreferrer">Built by Param Factory <span class="sr-only">(external site)</span></a>
      </nav>
      <p class="build-id">Recipe Passport build <a href="/build-info.json" data-build-info>${BUILD_SHA}</a> · Original generated artwork</p>
    </footer>`;
}

function shell(content: string, mode: AppMode): string {
  return `${header(mode)}${mode === 'demo' ? demoBanner() : ''}<main id="main" tabindex="-1">${content}</main>${footer()}<div class="route-announcer sr-only" aria-live="polite"></div><div class="toast" aria-live="polite"></div>`;
}

function setMetadata(title: string, description: string, path: string): void {
  const canonical = `https://recipe-passport.sociobot.in${path === '/' ? '/' : path}`;
  const image = 'https://recipe-passport.sociobot.in/assets/social-card.webp';
  const values: Array<[string, string, string]> = [
    ['meta[name="description"]', 'content', description],
    ['meta[property="og:title"]', 'content', title],
    ['meta[property="og:description"]', 'content', description],
    ['meta[property="og:url"]', 'content', canonical],
    ['meta[property="og:image"]', 'content', image],
    ['meta[name="twitter:title"]', 'content', title],
    ['meta[name="twitter:description"]', 'content', description],
    ['meta[name="twitter:image"]', 'content', image],
    ['link[rel="canonical"]', 'href', canonical],
  ];
  document.title = title;
  values.forEach(([selector, attribute, value]) => document.querySelector<HTMLElement>(selector)?.setAttribute(attribute, value));
}

function landing(): string {
  return `
    <section class="hero" aria-labelledby="landing-title">
      <div class="hero-copy">
        <p class="eyebrow">A cookbook on this device</p>
        <h1 id="landing-title">Move your recipes into a private cookbook.</h1>
        <p class="lede">For cooks leaving an app or cluttered recipe page, it keeps a searchable copy on this device.</p>
        <div class="hero-actions">
          <a class="button primary" href="/?demo=1" data-link>Try it with sample data</a>
          <a class="button secondary" href="/add" data-link>Import your recipes</a>
        </div>
        <p class="action-note">The sample opens a ready-made cookbook. Import a Paprika file or paste one full recipe.</p>
        <ul class="plain-facts" aria-label="Product facts">
          <li><span aria-hidden="true">●</span> Stays on this device</li>
          <li><span aria-hidden="true">●</span> Works offline after the first visit</li>
          <li><span aria-hidden="true">●</span> Price: free</li>
        </ul>
      </div>
      <div class="hero-art">
        <picture>
          <source media="(max-width: 700px)" srcset="/assets/hero-640.webp" />
          <img src="/assets/hero-1280.webp" width="1280" height="853" fetchpriority="high" decoding="async" alt="A red recipe folio opens into a miniature paper kitchen archive." />
        </picture>
        <span class="paper-tab tab-one" aria-hidden="true"></span>
        <span class="paper-tab tab-two" aria-hidden="true"></span>
        <span class="paper-tab tab-three" aria-hidden="true"></span>
        <p class="art-caption">Your recipes, packed for the next kitchen.</p>
      </div>
    </section>
    <section class="preview-section" aria-labelledby="preview-title">
      <div class="section-heading">
        <p class="eyebrow">The product</p>
        <h2 id="preview-title">Read the recipe, not the page around it.</h2>
      </div>
      <div class="recipe-preview">
        <div class="preview-index" aria-hidden="true"><span>03 recipes</span><span>B / 01</span></div>
        <article class="preview-card">
          <p class="recipe-kicker">Weeknight · Beans</p>
          <h3>Tomato-braised butter beans</h3>
          <p>Serves 3</p>
          <div class="preview-columns">
            <div><strong>7 ingredients</strong><span>Butter beans</span><span>Crushed tomatoes</span><span>Smoked paprika</span></div>
            <div><strong>4 steps</strong><span>Warm the oil.</span><span>Simmer for 18 minutes.</span><span>Fold in the parsley.</span></div>
          </div>
        </article>
      </div>
    </section>
    <section class="how-section" aria-labelledby="how-title">
      <div class="section-heading narrow">
        <p class="eyebrow">How it works</p>
        <h2 id="how-title">Carry recipes across in three steps.</h2>
      </div>
      <ol class="steps-list">
        <li><span>01</span><div><h3>Import recipes</h3><p>Choose a Paprika JSON file or paste one full recipe.</p></div></li>
        <li><span>02</span><div><h3>Cook</h3><p>Search by title or ingredient. Open a clean cooking view.</p></div></li>
        <li><span>03</span><div><h3>Print or export your cookbook</h3><p>Print one recipe or export the whole cookbook as JSON.</p></div></li>
      </ol>
    </section>
    <section class="limits-section" aria-labelledby="limits-title">
      <div>
        <p class="eyebrow">A tool, not another platform</p>
        <h2 id="limits-title">Your cookbook does not need an account.</h2>
      </div>
      <div class="limits-copy">
        <p>Recipe Passport processes your files in this browser. It does not scrape recipe sites or publish your recipes.</p>
        <p>Export a complete JSON copy before clearing browser data or changing devices.</p>
        <a href="/privacy" data-link>Read the privacy note</a>
      </div>
    </section>`;
}

function recipeCard(recipe: Recipe, mode: AppMode): string {
  const categories = recipe.categories.slice(0, 2).map(escapeHtml).join(' · ');
  return `
    <article class="recipe-card">
      <a class="card-link" href="${recipePath(recipe.id, mode)}" data-link aria-label="Open ${escapeHtml(recipe.title)}">
        <p class="recipe-kicker">${categories || 'Saved recipe'}</p>
        <h2>${escapeHtml(recipe.title)}</h2>
        <p>${escapeHtml(recipe.yield || `${recipe.ingredients.length} ingredients`)}</p>
        <dl><div><dt>Ingredients</dt><dd>${recipe.ingredients.length}</dd></div><div><dt>Steps</dt><dd>${recipe.steps.length}</dd></div></dl>
        <span class="open-label">Open recipe <span aria-hidden="true">→</span></span>
      </a>
    </article>`;
}

function cookbook(mode: AppMode): string {
  const recipes = loadRecipes(mode);
  const demoIntro = mode === 'demo' ? '<p class="page-intro">Three sample recipes show search, reading, printing, and export.</p>' : '<p class="page-intro">Search titles, ingredients, categories, notes, and sources.</p>';
  return `
    <section class="page cookbook-page" aria-labelledby="cookbook-title">
      <div class="page-heading split-heading">
        <div><p class="eyebrow">${mode === 'demo' ? 'Sample cookbook' : 'Your cookbook'}</p><h1 id="cookbook-title">Find a recipe you already own.</h1>${demoIntro}</div>
        <div class="toolbar">
          <a class="button secondary" href="${routePath('/add', mode)}" data-link>Add recipes</a>
          <button class="button primary" type="button" data-action="export"${recipes.length ? '' : ' disabled'}>Export cookbook</button>
        </div>
      </div>
      ${recipes.length ? `
        <div class="search-wrap">
          <label for="recipe-search">Search your cookbook</label>
          <div class="search-field"><span aria-hidden="true">⌕</span><input id="recipe-search" type="search" autocomplete="off" placeholder="Try “lemon” or “beans”" /></div>
          <p id="search-count" class="search-count" aria-live="polite">${recipes.length} ${recipes.length === 1 ? 'recipe' : 'recipes'}</p>
        </div>
        <div class="recipe-grid" id="recipe-grid">${recipes.map((recipe) => recipeCard(recipe, mode)).join('')}</div>
        <div class="no-results" id="no-results" hidden><h2>No recipes match that search.</h2><p>Check the spelling or search for one ingredient.</p></div>
      ` : `
        <div class="empty-state">
          <div class="empty-folio" aria-hidden="true">＋</div>
          <h2>Your recipes will appear here.</h2>
          <p>Import a Paprika JSON file or paste your first full recipe.</p>
          <a class="button primary" href="${routePath('/add', mode)}" data-link>Add your first recipe</a>
        </div>`}
    </section>`;
}

function recipeForm(mode: AppMode): string {
  const params = new URLSearchParams(location.search);
  const editId = params.get('edit');
  const existing = editId ? loadRecipes(mode).find((recipe) => recipe.id === editId) : undefined;
  const v = (key: keyof Recipe): string => existing ? escapeHtml(String(existing[key])) : '';
  const list = (key: 'ingredients' | 'steps' | 'categories'): string => existing ? escapeHtml(existing[key].join(key === 'categories' ? ', ' : '\n')) : '';
  return `
    <section class="page add-page" aria-labelledby="add-title">
      <div class="page-heading narrow">
        <p class="eyebrow">Bring your own recipes</p>
        <h1 id="add-title">${existing ? 'Edit this recipe.' : 'Add recipes to your cookbook.'}</h1>
        <p class="page-intro">${existing ? 'Changes stay in this browser.' : 'Import a JSON export or paste one full recipe below.'}</p>
      </div>
      ${existing ? '' : `
        <section class="import-panel" aria-labelledby="import-title">
          <div><p class="section-number">01</p><h2 id="import-title">Import Paprika JSON</h2><p>Choose an unencrypted Paprika JSON export or a previous Recipe Passport export.</p></div>
          <div class="file-picker">
            <label class="button primary" for="json-file">Choose JSON file</label>
            <input id="json-file" type="file" accept="application/json,.json" />
            <p id="file-name">No file chosen</p>
          </div>
          <p class="form-status" id="import-status" role="status"></p>
        </section>`}
      <section class="manual-panel" aria-labelledby="manual-title">
        <div class="manual-heading"><p class="section-number">${existing ? 'Recipe' : '02'}</p><h2 id="manual-title">${existing ? 'Recipe details' : 'Paste a full recipe'}</h2></div>
        ${existing ? '' : `<div class="paste-panel"><label for="full-recipe">Paste full recipe text</label><textarea id="full-recipe" rows="10" placeholder="Lemon olive oil cake\nServes 8\n\nIngredients\n200 g flour\n\nMethod\nWhisk the batter.\nBake until golden."></textarea><p>Recipe Passport fills the editable fields from a title, Ingredients, and Method section. Nothing is sent anywhere.</p><button class="button secondary" type="button" data-action="parse-paste">Fill recipe fields from paste</button><p class="form-status" id="paste-status" role="status"></p></div>`}
        <form id="recipe-form" novalidate data-edit-id="${existing ? escapeHtml(existing.id) : ''}">
          <div class="field full"><label for="title">Recipe title <span>required</span></label><input id="title" name="title" required value="${v('title')}" autocomplete="off" /></div>
          <div class="field"><label for="yield">Yield</label><input id="yield" name="yield" value="${v('yield')}" placeholder="Serves 4" /></div>
          <div class="field"><label for="categories">Categories</label><input id="categories" name="categories" value="${list('categories')}" placeholder="Dinner, vegetarian" /></div>
          <div class="field"><label for="ingredients">Ingredients <span>required · one per line</span></label><textarea id="ingredients" name="ingredients" required rows="10">${list('ingredients')}</textarea></div>
          <div class="field"><label for="steps">Steps <span>required · one per line</span></label><textarea id="steps" name="steps" required rows="10">${list('steps')}</textarea></div>
          <div class="field"><label for="notes">Notes</label><textarea id="notes" name="notes" rows="5">${v('notes')}</textarea></div>
          <div class="field"><label for="sourceName">Source name</label><input id="sourceName" name="sourceName" value="${v('sourceName')}" placeholder="Family notebook" /></div>
          <div class="field full"><label for="sourceUrl">Source URL</label><input id="sourceUrl" name="sourceUrl" type="url" value="${v('sourceUrl')}" placeholder="https://example.com/recipe" /></div>
          <p class="form-error full" id="form-error" role="alert"></p>
          <div class="form-actions full"><button class="button primary" type="submit">${existing ? 'Save recipe' : 'Add recipe'}</button><a href="${routePath('/cookbook', mode)}" data-link>Cancel</a></div>
        </form>
      </section>
    </section>`;
}

function recipePage(recipe: Recipe, mode: AppMode): string {
  const url = safeUrl(recipe.sourceUrl);
  const source = recipe.sourceName || url ? `
    <div class="provenance"><p class="eyebrow">Source kept</p><p>${escapeHtml(recipe.sourceName || 'Original source')}${url ? ` · <a href="${escapeHtml(url)}" rel="noreferrer">Open source <span class="sr-only">(external site)</span></a>` : ''}</p></div>` : '';
  return `
    <article class="page recipe-page" aria-labelledby="recipe-title">
      <a class="back-link" href="${routePath('/cookbook', mode)}" data-link><span aria-hidden="true">←</span> Back to cookbook</a>
      <header class="recipe-header">
        <div><p class="recipe-kicker">${escapeHtml(recipe.categories.join(' · ') || 'Saved recipe')}</p><h1 id="recipe-title">${escapeHtml(recipe.title)}</h1><p class="recipe-yield">${escapeHtml(recipe.yield || `${recipe.ingredients.length} ingredients`)}</p></div>
        <div class="recipe-actions">
          <button class="button primary" type="button" data-action="print">Print recipe</button>
          <a class="button secondary" href="${routePath(`/add?edit=${encodeURIComponent(recipe.id)}`, mode)}" data-link>Edit recipe</a>
          <button class="text-button danger" type="button" data-action="delete" data-id="${escapeHtml(recipe.id)}">Delete recipe</button>
        </div>
      </header>
      ${source}
      <div class="recipe-body">
        <section aria-labelledby="ingredients-title"><p class="section-number">01</p><h2 id="ingredients-title">Ingredients</h2><ul class="ingredient-list">${recipe.ingredients.map((ingredient, index) => `<li><input type="checkbox" id="ingredient-${index}" /><label for="ingredient-${index}">${escapeHtml(ingredient)}</label></li>`).join('')}</ul></section>
        <section aria-labelledby="steps-title"><p class="section-number">02</p><h2 id="steps-title">Method</h2><ol class="method-list">${recipe.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol></section>
      </div>
      ${recipe.notes ? `<section class="notes" aria-labelledby="notes-title"><p class="section-number">03</p><h2 id="notes-title">Notes</h2><p>${escapeHtml(recipe.notes)}</p></section>` : ''}
    </article>`;
}

function policyPage(kind: 'privacy' | 'terms'): string {
  if (kind === 'privacy') return `
    <article class="page prose-page" aria-labelledby="privacy-title">
      <p class="eyebrow">Plain privacy note</p><h1 id="privacy-title">Your recipes stay in your browser.</h1><p class="updated">Last updated 28 August 2026</p>
      <h2>What Recipe Passport stores</h2><p>Your recipes and their source details are stored in browser storage on this device. Demo recipes use a separate session storage key.</p>
      <h2>What leaves this device</h2><p>The app does not send recipe content to us. It loads only files served from this website. There are no analytics, ads, remote fonts, or third-party scripts.</p>
      <h2>Your choices</h2><p>Export your cookbook as JSON before you clear browser data. Delete each recipe from its recipe page. Leaving demo mode discards demo changes.</p>
      <h2>Contact</h2><p>Questions can be sent to <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p>
    </article>`;
  return `
    <article class="page prose-page" aria-labelledby="terms-title">
      <p class="eyebrow">Terms</p><h1 id="terms-title">Use Recipe Passport for recipes you may keep.</h1><p class="updated">Last updated 28 August 2026</p>
      <h2>Your content</h2><p>You keep ownership of every recipe you add. Only import content you have the right to use.</p>
      <h2>What the tool provides</h2><p>Recipe Passport is a free local utility. It does not scrape websites, host a public recipe directory, or promise permanent browser storage.</p>
      <h2>Cooking and availability</h2><p>Check ingredients, allergens, temperatures, and food safety yourself. The software is provided without a warranty.</p>
      <h2>Contact</h2><p>Questions can be sent to <a href="mailto:hello@sociobot.in">hello@sociobot.in</a>.</p>
    </article>`;
}

function notFound(): string {
  return `
    <section class="page not-found" aria-labelledby="not-found-title">
      <div><p class="eyebrow">Page 404</p><h1 id="not-found-title">This recipe card slipped away.</h1><p>The address does not match a page in Recipe Passport.</p><a class="button primary" href="/" data-link>Return home</a></div>
      <div class="lost-card" aria-hidden="true"><span>404</span><i></i><i></i><i></i></div>
    </section>`;
}

function render(shouldFocus = false): void {
  if (new URLSearchParams(location.search).get('demo') === '1') {
    navigate('/demo', true);
    return;
  }
  const path = location.pathname.replace(/\/$/, '') || '/';
  const mode = modeFromPath();
  let content: string;
  let recipeTitle: string | undefined;

  if (path === '/') {
    content = landing();
  } else if (path === '/cookbook' || path === '/demo') {
    content = cookbook(mode);
  } else if (path === '/add' || path === '/demo/add') {
    content = recipeForm(mode);
  } else if (path === '/privacy') {
    content = policyPage('privacy');
  } else if (path === '/terms') {
    content = policyPage('terms');
  } else {
    const staticDemoRecipe = path.match(/^\/demo\/recipe\/([^/]+)$/);
    const queryRecipeRoute = path === '/recipe' || path === '/demo/recipe';
    if (staticDemoRecipe || queryRecipeRoute) {
      const recipeMode: AppMode = staticDemoRecipe || path === '/demo/recipe' ? 'demo' : 'real';
      const recipeId = staticDemoRecipe ? decodeURIComponent(staticDemoRecipe[1]) : new URLSearchParams(location.search).get('id') ?? '';
      const recipe = loadRecipes(recipeMode).find((item) => item.id === recipeId);
      if (recipe) {
        content = recipePage(recipe, recipeMode); recipeTitle = recipe.title;
      } else {
        content = notFound();
      }
    } else {
      content = notFound();
    }
  }

  app.innerHTML = shell(content, mode);
  const metadata = metadataForPath(path, recipeTitle, recipeTitle && new URLSearchParams(location.search).get('id') ? `${path}${location.search}` : undefined);
  setMetadata(metadata.title, metadata.description, metadata.canonicalPath);
  bindEvents();
  if (shouldFocus) {
    requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLHeadingElement>('main h1');
      heading?.setAttribute('tabindex', '-1');
      heading?.focus({ preventScroll: false });
      const announcer = document.querySelector<HTMLElement>('.route-announcer');
      if (announcer && heading) announcer.textContent = heading.textContent;
    });
  }
}

function showToast(message: string, withUndo = false): void {
  const toast = document.querySelector<HTMLElement>('.toast');
  if (!toast) return;
  toast.innerHTML = `${escapeHtml(message)}${withUndo ? ' <button type="button" data-action="undo-delete">Undo</button>' : ''}`;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 6000);
  bindActionButtons(toast);
}

function bindActionButtons(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-action]').forEach((element) => {
    element.addEventListener('click', () => {
      const action = element.dataset.action;
      if (action === 'reset-demo') {
        resetDemo(); render(); showToast('Demo reset to three sample recipes.');
      } else if (action === 'start-real') {
        clearDemo(); navigate('/add');
      } else if (action === 'export') {
        downloadCookbook(loadRecipes(modeFromPath())); showToast('Cookbook JSON downloaded.');
      } else if (action === 'parse-paste') {
        const pasted = document.querySelector<HTMLTextAreaElement>('#full-recipe');
        const status = document.querySelector<HTMLElement>('#paste-status');
        try {
          const recipe = parsePastedRecipe(pasted?.value ?? '');
          const set = (id: string, value: string) => {
            const field = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`);
            if (field) field.value = value;
          };
          set('title', recipe.title); set('yield', recipe.yield); set('ingredients', recipe.ingredients.join('\n'));
          set('steps', recipe.steps.join('\n')); set('notes', recipe.notes); set('sourceName', recipe.sourceName); set('categories', recipe.categories.join(', '));
          if (status) { status.className = 'form-status success'; status.textContent = 'Recipe fields filled. Review them, then add your recipe.'; }
          document.querySelector<HTMLInputElement>('#title')?.focus();
        } catch (error) {
          if (status) { status.className = 'form-status error'; status.textContent = error instanceof Error ? error.message : 'This paste could not be read. Fill the fields below.'; }
        }
      } else if (action === 'print') {
        window.print();
      } else if (action === 'delete') {
        const id = element.dataset.id ?? '';
        const mode = modeFromPath();
        const recipe = loadRecipes(mode).find((item) => item.id === id);
        if (recipe && window.confirm(`Delete “${recipe.title}”? You can undo this next.`)) {
          undoRecipe = removeRecipe(mode, id); undoMode = mode; navigate(routePath('/cookbook', mode)); showToast(`Deleted “${recipe.title}”.`, true);
        }
      } else if (action === 'undo-delete' && undoRecipe) {
        upsertRecipes(undoMode, [undoRecipe]); const title = undoRecipe.title; undoRecipe = undefined; render(); showToast(`Restored “${title}”.`);
      }
    });
  });
}

function bindEvents(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[data-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target) return;
      event.preventDefault();
      navigate(link.pathname + link.search);
    });
  });
  bindActionButtons();

  const search = document.querySelector<HTMLInputElement>('#recipe-search');
  search?.addEventListener('input', () => {
    const recipes = searchRecipes(loadRecipes(modeFromPath()), search.value);
    const grid = document.querySelector<HTMLElement>('#recipe-grid');
    const count = document.querySelector<HTMLElement>('#search-count');
    const empty = document.querySelector<HTMLElement>('#no-results');
    if (grid) grid.innerHTML = recipes.map((recipe) => recipeCard(recipe, modeFromPath())).join('');
    if (count) count.textContent = `${recipes.length} ${recipes.length === 1 ? 'recipe' : 'recipes'}`;
    if (empty) empty.hidden = recipes.length > 0;
    grid?.querySelectorAll<HTMLAnchorElement>('a[data-link]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); navigate(link.pathname); }));
  });

  const file = document.querySelector<HTMLInputElement>('#json-file');
  file?.addEventListener('change', async () => {
    const status = document.querySelector<HTMLElement>('#import-status');
    const filename = document.querySelector<HTMLElement>('#file-name');
    const selected = file.files?.[0];
    if (!selected || !status) return;
    if (filename) filename.textContent = selected.name;
    status.className = 'form-status loading'; status.textContent = `Reading ${selected.name}…`;
    try {
      if (selected.size > MAX_IMPORT_BYTES) {
        throw new Error('This file is larger than 10 MB. Choose a smaller JSON export.');
      }
      const recipes = parseRecipeJson(await selected.text(), `Imported from ${selected.name}`);
      upsertRecipes(modeFromPath(), recipes);
      status.className = 'form-status success'; status.textContent = `Imported ${recipes.length} ${recipes.length === 1 ? 'recipe' : 'recipes'}.`;
      window.setTimeout(() => navigate(routePath('/cookbook')), 500);
    } catch (error) {
      status.className = 'form-status error'; status.textContent = error instanceof Error ? error.message : 'This file could not be imported. Choose another JSON file.';
    }
  });

  const form = document.querySelector<HTMLFormElement>('#recipe-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const error = document.querySelector<HTMLElement>('#form-error');
    const raw = Object.fromEntries(data.entries());
    const existing = form.dataset.editId ? loadRecipes(modeFromPath()).find((recipe) => recipe.id === form.dataset.editId) : undefined;
    try {
      if (!form.checkValidity()) throw new Error('Add a title, at least one ingredient, and at least one step.');
      if (raw.sourceUrl && !safeUrl(String(raw.sourceUrl))) throw new Error('The source URL needs to start with http:// or https://.');
      const recipe = normalizeRecipe({
        ...existing,
        id: existing?.id,
        title: raw.title,
        yield: raw.yield,
        categories: raw.categories,
        ingredients: raw.ingredients,
        steps: raw.steps,
        notes: raw.notes,
        sourceName: raw.sourceName,
        sourceUrl: raw.sourceUrl,
        createdAt: existing?.createdAt,
        updatedAt: new Date().toISOString(),
      }, 'Manual entry');
      upsertRecipes(modeFromPath(), [recipe]);
      navigate(recipePath(recipe.id, modeFromPath()));
      showToast(existing ? 'Recipe saved.' : 'Recipe added.');
    } catch (caught) {
      if (error) error.textContent = caught instanceof Error ? caught.message : 'This recipe could not be saved. Check the fields and try again.';
      form.querySelector<HTMLElement>(':invalid')?.focus();
    }
  });
}

window.addEventListener('popstate', () => render(true));
window.addEventListener('online', () => showToast('You are back online.'));
window.addEventListener('offline', () => showToast('You are offline. Your saved cookbook is ready.'));

render();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}
