import { sampleRecipes } from './sample';
import type { AppMode, CookbookExport, Recipe } from './types';

const REAL_KEY = 'recipe-passport:v1:recipes';
const DEMO_KEY = 'demo:recipe-passport:v1:recipes';

/** Raised when the browser cannot durably store a cookbook change. */
export class RecipeStorageError extends Error {
  constructor() {
    super('This recipe could not be saved because browser storage is full. Export or remove recipes, then try again.');
    this.name = 'RecipeStorageError';
  }
}

const lines = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(String).map((line) => line.trim()).filter(Boolean);
  }
  if (typeof value !== 'string') return [];
  return value.split(/\r?\n/).map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim()).filter(Boolean);
};

const text = (value: unknown): string => typeof value === 'string' ? value.trim() : '';

const makeId = (): string => typeof crypto.randomUUID === 'function'
  ? crypto.randomUUID()
  : `recipe-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const asObject = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};

export function normalizeRecipe(value: unknown, importedFrom = 'JSON import'): Recipe {
  const item = asObject(value);
  const title = text(item.title) || text(item.name);
  const ingredients = lines(item.ingredients);
  const steps = lines(item.steps ?? item.directions ?? item.instructions);
  if (!title) throw new Error('One recipe has no title. Add a title in the source file, then import it again.');
  if (!ingredients.length) throw new Error(`“${title}” has no ingredients. Add ingredients, then import it again.`);
  if (!steps.length) throw new Error(`“${title}” has no steps. Add directions, then import it again.`);

  const now = new Date().toISOString();
  const sourceUrl = text(item.sourceUrl) || text(item.source_url);
  const sourceName = text(item.sourceName) || text(item.source) || importedFrom;
  const categoryValue = item.categories ?? item.category;
  const categories = Array.isArray(categoryValue)
    ? categoryValue.map(String).map((category) => category.trim()).filter(Boolean)
    : text(categoryValue).split(',').map((category) => category.trim()).filter(Boolean);

  return {
    id: text(item.id) || text(item.uid) || makeId(),
    title,
    ingredients,
    steps,
    yield: text(item.yield) || text(item.servings),
    notes: text(item.notes),
    sourceName,
    sourceUrl,
    categories,
    createdAt: text(item.createdAt) || now,
    updatedAt: now,
  };
}

export function parseRecipeJson(raw: string, importedFrom = 'Paprika JSON import'): Recipe[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('This file is not valid JSON. Choose an unencrypted Paprika JSON export.');
  }

  const root = asObject(parsed);
  const candidates = Array.isArray(parsed) ? parsed : Array.isArray(root.recipes) ? root.recipes : [parsed];
  if (!candidates.length) throw new Error('This file has no recipes. Choose a JSON export that contains recipes.');
  return candidates.map((candidate) => normalizeRecipe(candidate, importedFrom));
}

function storage(mode: AppMode): Storage {
  return mode === 'demo' ? sessionStorage : localStorage;
}

function key(mode: AppMode): string {
  return mode === 'demo' ? DEMO_KEY : REAL_KEY;
}

export function loadRecipes(mode: AppMode): Recipe[] {
  const store = storage(mode);
  const stored = store.getItem(key(mode));
  if (!stored && mode === 'demo') {
    const seeded = structuredClone(sampleRecipes);
    saveRecipes(mode, seeded);
    return seeded;
  }
  if (!stored) return [];
  try {
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.map((recipe) => normalizeRecipe(recipe)) : [];
  } catch {
    return [];
  }
}

export function saveRecipes(mode: AppMode, recipes: Recipe[]): void {
  try {
    // Web Storage writes are atomic. Do not continue to a success state if the
    // browser rejects this replacement because of its per-origin quota.
    storage(mode).setItem(key(mode), JSON.stringify(recipes));
  } catch (error) {
    if (error instanceof DOMException && (
      error.name === 'QuotaExceededError'
      || error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      || error.code === DOMException.QUOTA_EXCEEDED_ERR
    )) {
      throw new RecipeStorageError();
    }
    throw error;
  }
}

export function resetDemo(): Recipe[] {
  sessionStorage.removeItem(DEMO_KEY);
  return loadRecipes('demo');
}

export function clearDemo(): void {
  sessionStorage.removeItem(DEMO_KEY);
}

export function upsertRecipes(mode: AppMode, incoming: Recipe[]): Recipe[] {
  const current = loadRecipes(mode);
  const byId = new Map(current.map((recipe) => [recipe.id, recipe]));
  for (const recipe of incoming) byId.set(recipe.id, recipe);
  const recipes = [...byId.values()];
  saveRecipes(mode, recipes);
  return recipes;
}

export function removeRecipe(mode: AppMode, id: string): Recipe | undefined {
  const recipes = loadRecipes(mode);
  const removed = recipes.find((recipe) => recipe.id === id);
  if (removed) saveRecipes(mode, recipes.filter((recipe) => recipe.id !== id));
  return removed;
}

export function searchRecipes(recipes: Recipe[], query: string): Recipe[] {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return recipes;
  return recipes.filter((recipe) => [
    recipe.title,
    recipe.yield,
    recipe.notes,
    recipe.sourceName,
    ...recipe.ingredients,
    ...recipe.categories,
  ].some((part) => part.toLocaleLowerCase().includes(needle)));
}

export function cookbookExport(recipes: Recipe[]): CookbookExport {
  return { schema: 'recipe-passport/v1', exportedAt: new Date().toISOString(), recipes };
}

export function downloadCookbook(recipes: Recipe[]): void {
  const payload = JSON.stringify(cookbookExport(recipes), null, 2);
  const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `recipe-passport-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
