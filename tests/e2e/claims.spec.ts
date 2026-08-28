import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
});

test('@claim:paprika-import imports all important Paprika fields', async ({ page }) => {
  await page.goto('/add');
  await page.locator('#json-file').setInputFiles(path.join(process.cwd(), 'tests/fixtures/paprika-recipes.json'));
  await expect(page).toHaveURL(/\/cookbook$/);
  await expect(page.getByText('2 recipes')).toBeVisible();
  await page.getByRole('link', { name: 'Open Olive and lemon pasta' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Olive and lemon pasta');
  await expect(page.getByText('250 g spaghetti')).toBeVisible();
  await expect(page.getByText('Toss the pasta with the oil, olives, and lemon juice.')).toBeVisible();
  await expect(page.getByText('Serves 2')).toBeVisible();
  await expect(page.getByText('Save a cup of pasta water before draining.')).toBeVisible();
  await expect(page.getByText(/Nadia’s Paprika archive/)).toBeVisible();
});

test('does not report success or navigate when a valid 5.6 MB import cannot persist', async ({ page }) => {
  await page.addInitScript(() => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(key: string, value: string): void {
      if (this === localStorage && key === 'recipe-passport:v1:recipes') {
        throw new DOMException('Storage quota exceeded', 'QuotaExceededError');
      }
      originalSetItem.call(this, key, value);
    };
  });
  await page.goto('/add');
  const recipe = JSON.stringify({
    title: 'Large retained recipe',
    ingredients: ['1 durable ingredient'],
    steps: ['Keep this recipe.'],
    notes: '',
  });
  const reportSize = 5_600_116;
  const payload = `${recipe}${' '.repeat(reportSize - Buffer.byteLength(recipe))}`;
  expect(Buffer.byteLength(payload)).toBe(reportSize);
  await page.locator('#json-file').setInputFiles({
    name: 'valid-5-6mb.json',
    mimeType: 'application/json',
    buffer: Buffer.from(payload),
  });
  await expect(page.getByRole('status')).toContainText('browser storage is full');
  await expect(page.getByRole('status')).not.toContainText('Imported');
  await expect(page).toHaveURL(/\/add$/);
  expect(await page.evaluate(() => localStorage.getItem('recipe-passport:v1:recipes'))).toBeNull();
  await page.reload();
  await expect(page.getByRole('status')).toHaveText('');
});

test('rejects a JSON file above the documented 10 MB import limit before reading it', async ({ page }) => {
  await page.goto('/add');
  await page.locator('#json-file').setInputFiles({
    name: 'too-large.json',
    mimeType: 'application/json',
    buffer: Buffer.alloc(10 * 1024 * 1024 + 1, 0),
  });
  await expect(page.getByRole('status')).toContainText('larger than 10 MB');
  await expect(page).toHaveURL(/\/add$/);
});

test('@claim:manual-add saves a pasted structured recipe', async ({ page }) => {
  await page.goto('/add');
  await page.getByLabel(/Recipe title/).fill('Charred corn salad');
  await page.getByLabel('Yield').fill('Serves 4');
  await page.getByLabel(/Ingredients/).fill('4 corn cobs\n1 lime\n20 g coriander');
  await page.getByLabel(/Steps/).fill('Char the corn.\nDress with lime.\nScatter with coriander.');
  await page.getByLabel('Notes').fill('Serve at room temperature.');
  await page.getByRole('button', { name: 'Add recipe' }).click();
  await expect(page).toHaveURL(/\/recipe\//);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Charred corn salad');
  await expect(page.getByText('4 corn cobs')).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('recipe-passport:v1:recipes') ?? '[]'))).toHaveLength(1);
});

test('@claim:search-cookbook searches by ingredient', async ({ page }) => {
  await page.goto('/demo');
  const search = page.getByLabel('Search your cookbook');
  for (const query of ['tahini', 'Baking', 'yogurt', 'Family recipe card', 'Lemon olive oil cake']) {
    await search.fill(query);
    await expect(page.getByText('1 recipe')).toBeVisible();
  }
  await expect(page.getByRole('heading', { name: 'Lemon olive oil cake' })).toBeVisible();
});

test('@claim:json-export downloads every demo recipe as JSON', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export cookbook' }).click();
  const download = await downloadPromise;
  const file = await download.path();
  expect(file).toBeTruthy();
  const data = JSON.parse(await readFile(file!, 'utf8'));
  expect(data.schema).toBe('recipe-passport/v1');
  expect(data.recipes).toHaveLength(3);
  expect(Object.keys(data.recipes[0]).sort()).toEqual([
    'categories', 'createdAt', 'id', 'ingredients', 'notes', 'sourceName', 'sourceUrl', 'steps', 'title', 'updatedAt', 'yield',
  ]);
});

test('@claim:print-recipe opens the browser print flow', async ({ page }) => {
  await page.addInitScript(() => { window.print = () => document.body.setAttribute('data-printed', 'yes'); });
  await page.goto('/demo/recipe/sample-braised-beans');
  await page.getByRole('button', { name: 'Print recipe' }).click();
  await expect(page.locator('body')).toHaveAttribute('data-printed', 'yes');
});

test('@claim:offline-reload reloads the demo without a network', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Find a recipe you already own.' })).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Tomato-braised butter beans' })).toBeVisible();
  await context.setOffline(false);
});

test('@claim:local-only makes no third-party request and keeps real storage empty', async ({ page }) => {
  const origins = new Set<string>();
  page.on('request', (request) => origins.add(new URL(request.url()).origin));
  await page.goto('/demo');
  await page.getByLabel('Search your cookbook').fill('lemon');
  await page.getByRole('link', { name: 'Open Lemon olive oil cake' }).click();
  expect([...origins]).toEqual(['http://127.0.0.1:4173']);
  expect(await page.evaluate(() => localStorage.getItem('recipe-passport:v1:recipes'))).toBeNull();
  expect(await page.evaluate(() => sessionStorage.getItem('demo:recipe-passport:v1:recipes'))).not.toBeNull();
  expect(await page.locator('script[src^="http"]').count()).toBe(0);
  expect(await page.locator('link[rel="stylesheet"][href^="http"]').count()).toBe(0);
});

test('@claim:demo-isolation discards demo changes before real use', async ({ page }) => {
  await page.goto('/demo/add');
  await page.getByLabel(/Recipe title/).fill('Temporary demo soup');
  await page.getByLabel(/Ingredients/).fill('1 onion');
  await page.getByLabel(/Steps/).fill('Cook the onion.');
  await page.getByRole('button', { name: 'Add recipe' }).click();
  await expect(page.getByRole('heading', { name: 'Temporary demo soup' })).toBeVisible();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/add$/);
  const values = await page.evaluate(() => ({
    demo: sessionStorage.getItem('demo:recipe-passport:v1:recipes'),
    real: localStorage.getItem('recipe-passport:v1:recipes'),
  }));
  expect(values).toEqual({ demo: null, real: null });
});

test('@claim:free-use @claim:no-account presents no price or account gate', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Price: free')).toBeVisible();
  await expect(page.getByRole('link', { name: /buy|purchase|subscribe|license/i })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /buy|purchase|subscribe|license/i })).toHaveCount(0);
  await page.getByRole('link', { name: 'Import your recipes' }).click();
  await expect(page).toHaveURL(/\/add$/);
  await expect(page.getByText(/sign in|create account/i)).toHaveCount(0);
});

test('@claim:ingredient-check keeps cooking checks temporary', async ({ page }) => {
  await page.goto('/demo/recipe/sample-braised-beans');
  const ingredient = page.getByLabel('2 tablespoons olive oil');
  await ingredient.check();
  await expect(ingredient).toBeChecked();
  await page.reload();
  await expect(page.getByLabel('2 tablespoons olive oil')).not.toBeChecked();
  const saved = await page.evaluate(() => JSON.parse(sessionStorage.getItem('demo:recipe-passport:v1:recipes') ?? '[]'));
  expect(saved.find((recipe: { id: string }) => recipe.id === 'sample-braised-beans').ingredients[0]).toBe('2 tablespoons olive oil');
});

test('@claim:export-import-roundtrip preserves every recipe and saved field', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export cookbook' }).click();
  const download = await downloadPromise;
  const file = await download.path();
  expect(file).toBeTruthy();
  const exported = JSON.parse(await readFile(file!, 'utf8'));

  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/add$/);
  await page.locator('#json-file').setInputFiles(file!);
  await expect(page).toHaveURL(/\/cookbook$/);
  const imported = await page.evaluate(() => JSON.parse(localStorage.getItem('recipe-passport:v1:recipes') ?? '[]'));
  expect(imported).toEqual(exported.recipes);
  await expect(page.getByText('3 recipes')).toBeVisible();
});

test('@claim:source-retention keeps supplied manual and Paprika provenance', async ({ page }) => {
  await page.goto('/add');
  await page.getByLabel(/Recipe title/).fill('Source test soup');
  await page.getByLabel(/Ingredients/).fill('1 leek');
  await page.getByLabel(/Steps/).fill('Simmer the leek.');
  await page.getByLabel('Source name').fill('Ari’s kitchen card');
  await page.getByLabel('Source URL').fill('https://example.com/ari-soup');
  await page.getByRole('button', { name: 'Add recipe' }).click();
  await expect(page.getByText(/Ari’s kitchen card/)).toBeVisible();
  await expect(page.getByRole('link', { name: /Open source/ })).toHaveAttribute('href', 'https://example.com/ari-soup');

  await page.evaluate(() => localStorage.clear());
  await page.goto('/add');
  await page.locator('#json-file').setInputFiles(path.join(process.cwd(), 'tests/fixtures/paprika-recipes.json'));
  await expect(page).toHaveURL(/\/cookbook$/);
  await page.getByRole('link', { name: 'Open Olive and lemon pasta' }).click();
  await expect(page.getByText(/Nadia’s Paprika archive/)).toBeVisible();
  await expect(page.getByRole('link', { name: /Open source/ })).toHaveAttribute('href', 'https://example.com/olive-pasta');
});

test('@claim:recipe-fields adds and edits every documented recipe field', async ({ page }) => {
  await page.goto('/add');
  await page.getByLabel(/Recipe title/).fill('First lentil bowl');
  await page.getByLabel('Yield').fill('Serves 2');
  await page.getByLabel('Categories').fill('Lunch, Lentils');
  await page.getByLabel(/Ingredients/).fill('100 g lentils\n1 carrot');
  await page.getByLabel(/Steps/).fill('Cook the lentils.\nFold in the carrot.');
  await page.getByLabel('Notes').fill('Pack while cool.');
  await page.getByLabel('Source name').fill('Blue kitchen notebook');
  await page.getByLabel('Source URL').fill('https://example.com/first-lentils');
  await page.getByRole('button', { name: 'Add recipe' }).click();
  await page.getByRole('link', { name: 'Edit recipe' }).click();

  await page.getByLabel(/Recipe title/).fill('Warm lentil bowl');
  await page.getByLabel('Yield').fill('Serves 3');
  await page.getByLabel('Categories').fill('Dinner, Pulses');
  await page.getByLabel(/Ingredients/).fill('150 g green lentils\n2 carrots');
  await page.getByLabel(/Steps/).fill('Simmer the green lentils.\nRoast and fold in the carrots.');
  await page.getByLabel('Notes').fill('Finish with lemon.');
  await page.getByLabel('Source name').fill('Green kitchen notebook');
  await page.getByLabel('Source URL').fill('https://example.com/warm-lentils');
  await page.getByRole('button', { name: 'Save recipe' }).click();
  await page.reload();

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Warm lentil bowl');
  for (const text of ['Serves 3', 'Dinner · Pulses', '150 g green lentils', '2 carrots', 'Simmer the green lentils.', 'Roast and fold in the carrots.', 'Finish with lemon.', 'Green kitchen notebook']) {
    await expect(page.getByText(text, { exact: false })).toBeVisible();
  }
  await expect(page.getByRole('link', { name: /Open source/ })).toHaveAttribute('href', 'https://example.com/warm-lentils');
});
