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
  await page.getByLabel('Search your cookbook').fill('tahini');
  await expect(page.getByText('1 recipe')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Cold sesame noodle salad' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tomato-braised butter beans' })).toHaveCount(0);
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
  expect(data.recipes[0]).toHaveProperty('ingredients');
  expect(data.recipes[0]).toHaveProperty('sourceName');
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

test('@claim:free-use presents no purchase or license gate', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Price: free')).toBeVisible();
  await expect(page.getByRole('link', { name: /buy|purchase|subscribe|license/i })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /buy|purchase|subscribe|license/i })).toHaveCount(0);
});
