import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';
import path from 'node:path';

const base = process.env.VERIFY_URL || 'https://recipe-passport.sociobot.in';
const expectedOrigin = new URL(base).origin;
const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  const origins = new Set();
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', (request) => origins.add(new URL(request.url()).origin));

  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  const firstScreen = [
    page.getByRole('heading', { level: 1 }),
    page.getByText('For cooks leaving an app or cluttered recipe page, it keeps a searchable copy on this device.'),
    page.getByRole('link', { name: 'Try it with sample data' }),
    page.getByText('Works offline after the first visit'),
    page.getByText('Price: free'),
  ];
  for (const item of firstScreen) {
    const box = await item.boundingBox();
    if (!box || box.y + box.height > 844) throw new Error('A required first-screen item is below the mobile fold.');
  }
  if (await page.evaluate(() => document.body.scrollWidth) !== 390) throw new Error('The mobile page overflows horizontally.');

  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktop = await desktopContext.newPage();
  await desktop.goto(`${base}/`, { waitUntil: 'networkidle' });
  for (const text of ['The sample opens a ready-made cookbook.', 'Stays on this device', 'Works offline after the first visit', 'Price: free']) {
    const box = await desktop.getByText(text).boundingBox();
    if (!box || box.y + box.height > 900) throw new Error(`Desktop first-screen item is below the fold: ${text}`);
  }
  await desktopContext.close();

  const demoLink = page.getByRole('link', { name: 'Try it with sample data' });
  if (await demoLink.getAttribute('href') !== '/?demo=1') throw new Error('The first action is not the query demo entry.');
  await demoLink.click();
  await page.waitForURL(`${base}/demo`);
  await page.getByText('Demo — sample data, nothing is saved to your cookbook.').waitFor();
  await page.getByLabel('Search your cookbook').fill('tahini');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  if (await page.getByLabel('Search your cookbook').inputValue() !== '') throw new Error('Reset demo did not clear search.');
  if (await page.getByText('3 recipes').count() !== 1) throw new Error('Reset demo did not restore three recipes.');
  const isolation = await page.evaluate(() => ({
    real: localStorage.getItem('recipe-passport:v1:recipes'),
    demo: sessionStorage.getItem('demo:recipe-passport:v1:recipes'),
  }));
  if (isolation.real !== null || isolation.demo === null) throw new Error('Demo storage is not isolated.');

  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  const poisoned = await page.goto(`${base}/missing-offline-shell`);
  if (poisoned?.status() !== 404) throw new Error('The offline regression setup did not receive an HTTP 404.');
  // The intentional bad-link response is a browser console network error, not
  // an app-script error. Clear it before checking the subsequent offline app.
  errors.length = 0;
  await context.setOffline(true);
  await page.goto(`${base}/add`);
  await page.getByRole('heading', { name: 'Add recipes to your cookbook.' }).waitFor();
  await page.goto(`${base}/demo`);
  await page.reload();
  await page.getByRole('heading', { name: 'Tomato-braised butter beans' }).waitFor();
  await context.setOffline(false);

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export cookbook' }).click();
  const download = await downloadPromise;
  const exportPath = await download.path();
  if (!exportPath) throw new Error('Demo export did not create a file.');
  const exported = JSON.parse(await (await import('node:fs/promises')).readFile(exportPath, 'utf8'));
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.locator('#json-file').setInputFiles(exportPath);
  await page.waitForURL(`${base}/cookbook`);
  const imported = await page.evaluate(() => JSON.parse(localStorage.getItem('recipe-passport:v1:recipes') || '[]'));
  if (JSON.stringify(imported) !== JSON.stringify(exported.recipes)) throw new Error('Recipe Passport export/import changed a saved field.');

  await page.goto(`${base}/add`);
  await page.getByLabel('Paste full recipe text').fill(`Quick tomato soup\nServes 2\n\nIngredients\n2 tomatoes\n1 onion\n\nMethod\nCook the onion.\nBlend the soup.`);
  await page.getByRole('button', { name: 'Fill recipe fields from paste' }).click();
  if (await page.getByLabel(/Recipe title/).inputValue() !== 'Quick tomato soup') throw new Error('One-paste intake did not fill the title.');
  if (await page.getByLabel(/Ingredients/).inputValue() !== '2 tomatoes\n1 onion') throw new Error('One-paste intake did not fill ingredients.');

  await page.evaluate(() => localStorage.clear());
  await page.goto(`${base}/add`);
  await page.getByLabel(/Recipe title/).fill('Live lentil bowl');
  await page.getByLabel('Yield').fill('Serves 2');
  await page.getByLabel('Categories').fill('Lunch, Lentils');
  await page.getByLabel(/Ingredients/).fill('100 g lentils\n1 carrot');
  await page.getByLabel(/Steps/).fill('Cook the lentils.\nFold in the carrot.');
  await page.getByLabel('Notes').fill('Pack while cool.');
  await page.getByLabel('Source name').fill('Live kitchen notebook');
  await page.getByLabel('Source URL').fill('https://example.com/live-lentils');
  await page.getByRole('button', { name: 'Add recipe' }).click();
  await page.getByRole('link', { name: 'Edit recipe' }).click();
  await page.getByLabel('Yield').fill('Serves 3');
  await page.getByLabel('Categories').fill('Dinner, Pulses');
  await page.getByLabel(/Ingredients/).fill('150 g green lentils\n2 carrots');
  await page.getByLabel(/Steps/).fill('Simmer the lentils.\nRoast and fold in the carrots.');
  await page.getByLabel('Notes').fill('Finish with lemon.');
  await page.getByLabel('Source name').fill('Green kitchen notebook');
  await page.getByLabel('Source URL').fill('https://example.com/warm-lentils');
  await page.getByRole('button', { name: 'Save recipe' }).click();
  await page.reload();
  const edited = await page.evaluate(() => JSON.parse(localStorage.getItem('recipe-passport:v1:recipes') || '[]')[0]);
  const expectedFields = {
    yield: 'Serves 3', categories: ['Dinner', 'Pulses'], ingredients: ['150 g green lentils', '2 carrots'],
    steps: ['Simmer the lentils.', 'Roast and fold in the carrots.'], notes: 'Finish with lemon.',
    sourceName: 'Green kitchen notebook', sourceUrl: 'https://example.com/warm-lentils',
  };
  for (const [key, value] of Object.entries(expectedFields)) {
    if (JSON.stringify(edited[key]) !== JSON.stringify(value)) throw new Error(`Edited field was not retained: ${key}`);
  }

  await page.evaluate(() => localStorage.clear());
  await page.goto(`${base}/add`);
  await page.locator('#json-file').setInputFiles(path.resolve('tests/fixtures/paprika-recipes.json'));
  await page.waitForURL(`${base}/cookbook`);
  await page.getByRole('link', { name: 'Open Olive and lemon pasta' }).click();
  if (await page.getByText(/Nadia’s Paprika archive/).count() !== 1) throw new Error('Paprika source name was not retained.');
  if (await page.getByRole('link', { name: /Open source/ }).getAttribute('href') !== 'https://example.com/olive-pasta') throw new Error('Paprika source URL was not retained.');

  for (const [route, title] of [
    ['/demo', 'Demo — Recipe Passport'],
    ['/privacy', 'Privacy — Recipe Passport'],
    ['/terms', 'Terms — Recipe Passport'],
    ['/demo/recipe/sample-braised-beans', 'Tomato-braised butter beans — Recipe Passport'],
  ]) {
    const response = await page.goto(`${base}${route}`);
    if (!response?.ok()) throw new Error(`${route} did not return 200.`);
    if (await page.title() !== title) throw new Error(`${route} title is inaccurate.`);
    const canonical = `${base}${route}`;
    for (const [selector, attribute] of [
      ['link[rel="canonical"]', 'href'], ['meta[property="og:url"]', 'content'],
    ]) {
      if (await page.locator(selector).getAttribute(attribute) !== canonical) throw new Error(`${route} canonical/share URL is inaccurate.`);
    }
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
      if (await page.locator(selector).getAttribute('content') !== title) throw new Error(`${route} share title is inaccurate.`);
    }
    const results = await new AxeBuilder({ page }).analyze();
    if (results.violations.some((violation) => ['serious', 'critical'].includes(violation.impact || ''))) throw new Error(`${route} has a serious accessibility violation.`);
  }

  if (errors.length) throw new Error(`Console errors: ${errors.join(' | ')}`);
  if ([...origins].some((origin) => origin !== expectedOrigin)) throw new Error(`Third-party request observed: ${[...origins].join(', ')}`);
  await context.close();

  const notFoundContext = await browser.newContext();
  const notFoundPage = await notFoundContext.newPage();
  for (const route of ['/missing-page', '/recipe/not-a-real-recipe', '/demo/recipe/not-a-real-recipe']) {
    const notFoundResponse = await notFoundPage.goto(`${base}${route}`);
    if (notFoundResponse?.status() !== 404) throw new Error(`Unknown live URL did not return HTTP 404: ${route}`);
    if (await notFoundPage.title() !== 'Not found — Recipe Passport') throw new Error(`Unknown route has wrong 404 metadata: ${route}`);
  }
  await notFoundPage.goto(`${base}/missing-page`);
  await notFoundPage.getByRole('link', { name: 'Return home' }).click();
  if (new URL(notFoundPage.url()).pathname !== '/') throw new Error('The live 404 return link failed.');
  await notFoundContext.close();

  process.stdout.write('LIVE PASS: first screen, query demo/reset/isolation, offline, claims, metadata, Axe, privacy, mobile, and HTTP 404\n');
} finally {
  await browser.close();
}
