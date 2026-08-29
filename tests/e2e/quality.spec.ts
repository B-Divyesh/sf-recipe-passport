import AxeBuilder from '@axe-core/playwright';
import { execFileSync } from 'node:child_process';
import { expect, test } from '@playwright/test';

for (const route of ['/', '/demo', '/demo/recipe/sample-braised-beans', '/privacy', '/terms']) {
  test(`has a sound document and no serious accessibility issues on ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page).toHaveTitle(/Recipe Passport/);
    expect(errors).toEqual([]);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  });
}

test('serves a real styled HTTP 404 with a working return path', async ({ page }) => {
  const response = await page.goto('/missing-page');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Not found — Recipe Passport');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This recipe card slipped away.');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.getByText('Private cookbook stored in your browser.')).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  await page.getByRole('link', { name: 'Return home' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Move your recipes into a private cookbook.');
});

test('uses plain, descriptive landing headings and footer copy', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 2, name: 'Recipe preview' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Import, find, and export recipes in three steps.' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 3, name: 'Find and cook recipes' })).toBeVisible();
  await expect(page.getByText('Privacy and account limits')).toBeVisible();
  await expect(page.getByText('Private cookbook stored in your browser.')).toBeVisible();
  for (const removed of [
    'Your recipes, packed for the next kitchen.',
    'Read the recipe, not the page around it.',
    'Carry recipes across in three steps.',
    'A tool, not another platform',
    'Keep recipes. Keep control.',
  ]) {
    await expect(page.getByText(removed, { exact: true })).toHaveCount(0);
  }
});

test('returns HTTP 404 and not-found metadata for unknown recipe URL paths', async ({ page }) => {
  for (const route of ['/recipe/not-a-real-recipe', '/demo/recipe/not-a-real-recipe']) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle('Not found — Recipe Passport');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://recipe-passport.sociobot.in/404');
  }
});

test('reloads a stored recipe from the real query route', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('recipe-passport:v1:recipes', JSON.stringify([{
    id: 'saved-route-test', title: 'Stored route soup', yield: 'Serves 2', categories: [], ingredients: ['1 onion'], steps: ['Cook it.'], notes: '', sourceName: '', sourceUrl: '', createdAt: '2026-08-28T00:00:00.000Z', updatedAt: '2026-08-28T00:00:00.000Z',
  }])));
  const response = await page.goto('/recipe?id=saved-route-test');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Stored route soup');
});

test('serves and maintains route-accurate share metadata', async ({ page }) => {
  const routes = [
    ['/demo', 'Demo — Recipe Passport'],
    ['/privacy', 'Privacy — Recipe Passport'],
    ['/terms', 'Terms — Recipe Passport'],
    ['/demo/recipe/sample-braised-beans', 'Tomato-braised butter beans — Recipe Passport'],
  ] as const;
  for (const [route, title] of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(title);
    const canonical = `https://recipe-passport.sociobot.in${route}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', await page.locator('meta[name="description"]').getAttribute('content') ?? '');
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', await page.locator('meta[name="description"]').getAttribute('content') ?? '');
    const raw = await (await page.request.get(route)).text();
    expect(raw).toContain(`<title>${title}</title>`);
    expect(raw).toContain(`property="og:url" content="${canonical}"`);
  }
});

test('@claim:demo-one-click opens a populated isolated demo in one click', async ({ page }) => {
  const realSentinel = JSON.stringify([{ id: 'real-demo-claim', title: 'Keep this real recipe' }]);
  await page.goto('/');
  await page.evaluate((value) => localStorage.setItem('recipe-passport:v1:recipes', value), realSentinel);
  const action = page.getByRole('link', { name: 'Try it with sample data' });
  await expect(action).toHaveAttribute('href', '/?demo=1');
  await action.click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data, nothing is saved to your cookbook.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start for real' })).toBeVisible();
  for (const title of ['Tomato-braised butter beans', 'Lemon olive oil cake', 'Cold sesame noodle salad']) {
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  }
  await page.getByLabel('Search your cookbook').fill('tahini');
  await expect(page.getByText('1 recipe')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('3 recipes')).toBeVisible();
  await expect(page.getByLabel('Search your cookbook')).toHaveValue('');
  expect(await page.evaluate(() => localStorage.getItem('recipe-passport:v1:recipes'))).toBe(realSentinel);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/add$/);
  await expect(page.getByText('Demo — sample data, nothing is saved to your cookbook.')).toHaveCount(0);
  expect(await page.evaluate(() => sessionStorage.getItem('demo:recipe-passport:v1:recipes'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('recipe-passport:v1:recipes'))).toBe(realSentinel);
});

test('keeps the action outcome and all three facts in the desktop first screen', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  for (const item of [
    page.getByText('The sample opens a ready-made cookbook.'),
    page.getByText('Stays on this device'),
    page.getByText('Works offline after the first visit'),
    page.getByText('Price: free'),
  ]) {
    const box = await item.boundingBox();
    expect(box).not.toBeNull();
    expect((box?.y ?? 900) + (box?.height ?? 1)).toBeLessThanOrEqual(900);
  }
});

test('works with a keyboard and keeps every required touch target at 390 CSS pixels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 390);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.getByRole('link', { name: 'Try it with sample data' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data, nothing is saved to your cookbook.')).toBeVisible();

  for (const target of [
    page.getByRole('link', { name: 'Recipe Passport home' }),
    page.getByRole('link', { name: 'Privacy' }).last(),
    page.getByRole('link', { name: 'Terms' }),
  ]) {
    const box = await target.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }

  await page.goto('/demo/recipe/sample-braised-beans');
  const ingredient = await page.getByLabel('2 tablespoons olive oil').boundingBox();
  expect(ingredient?.width).toBeGreaterThanOrEqual(44);
  expect(ingredient?.height).toBeGreaterThanOrEqual(44);
  const ingredientRow = await page.locator('.ingredient-list li').first().boundingBox();
  expect(ingredientRow?.height).toBeGreaterThanOrEqual(44);
});

test('back and forward navigation restore the route and move focus', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Open Tomato-braised butter beans' }).click();
  await page.goBack();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.goForward();
  await expect(page).toHaveURL(/\/demo\/recipe\/sample-braised-beans$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});

test('build identity is visible and matches the generated service worker cache', async ({ page }) => {
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  await page.goto('/');
  await expect(page.getByRole('link', { name: commit })).toHaveAttribute('href', '/build-info.json');
  const identity = await (await page.request.get('/build-info.json')).json();
  expect(identity).toEqual({ product: 'recipe-passport', commit });
  const serviceWorker = await (await page.request.get('/sw.js')).text();
  expect(serviceWorker).toContain(`recipe-passport-shell-${commit}`);
});

test('sample provenance does not expose a dead external link', async ({ page }) => {
  await page.goto('/demo/recipe/sample-lemon-cake');
  await expect(page.getByText('Family recipe card')).toBeVisible();
  await expect(page.getByRole('link', { name: /Open source/i })).toHaveCount(0);
});

test('shows useful empty and import error states', async ({ page }) => {
  await page.goto('/cookbook');
  await expect(page.getByRole('heading', { name: 'Your recipes will appear here.' })).toBeVisible();
  await page.getByRole('link', { name: 'Add your first recipe' }).click();
  await page.locator('#json-file').setInputFiles({
    name: 'broken.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{not valid'),
  });
  await expect(page.locator('#import-status')).toContainText('not valid JSON');
  await expect(page.locator('#import-status')).toContainText('Choose an unencrypted Paprika JSON export');
});

test('@claim:recipe-management edits, deletes, and restores a recipe', async ({ page }) => {
  await page.goto('/demo/recipe/sample-braised-beans');
  await page.getByRole('link', { name: 'Edit recipe' }).click();
  await page.getByLabel(/Recipe title/).fill('Tomato-braised giant beans');
  await page.getByRole('button', { name: 'Save recipe' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tomato-braised giant beans');
  page.on('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete recipe' }).click();
  await expect(page.getByText('2 recipes')).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByRole('heading', { name: 'Tomato-braised giant beans' })).toBeVisible();
});
