import AxeBuilder from '@axe-core/playwright';
import { execFileSync } from 'node:child_process';
import { expect, test } from '@playwright/test';

for (const route of ['/', '/demo', '/demo/recipe/sample-braised-beans', '/privacy', '/terms', '/missing-page']) {
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
  await expect(page.getByRole('status')).toContainText('not valid JSON');
  await expect(page.getByRole('status')).toContainText('Choose an unencrypted Paprika JSON export');
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
