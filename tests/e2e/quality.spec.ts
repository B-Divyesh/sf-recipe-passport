import AxeBuilder from '@axe-core/playwright';
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

test('works with a keyboard at 390 CSS pixels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 390);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.getByRole('link', { name: 'Try it with sample data' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data, nothing is saved to your cookbook.')).toBeVisible();
});

test('back navigation restores the previous route and moves focus', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Open Tomato-braised butter beans' }).click();
  await page.goBack();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
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
