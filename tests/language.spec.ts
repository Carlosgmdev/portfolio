import { test, expect } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

for (const [languages, expected] of [
  [['es-MX', 'en-US'], 'es'],
  [['en-GB', 'es-ES'], 'en'],
  [['fr-FR', 'es-ES', 'en-US'], 'es'],
  [['fr-FR', 'de-DE'], 'en'],
] as const) {
  test(`initial language: ${languages.join(', ')}`, async ({ page }) => {
    await page.addInitScript((values) => {
      Object.defineProperty(navigator, 'languages', { get: () => values });
    }, languages);
    await page.goto('/?source=portfolio#contact');
    await expect(page.locator('html')).toHaveAttribute('lang', expected);
    await expect(page).toHaveURL(
      expected === 'es'
        ? /\/es\/\?source=portfolio#contact$/
        : /\/\?source=portfolio#contact$/,
    );
  });
}

test('manual language wins over browser preferences on later direct visits', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'languages', { get: () => ['es-MX'] });
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(
    await page.evaluate(() => localStorage.getItem('portfolio-language')),
  ).toBe('en');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('link', { name: 'ES', exact: true }).click();
  await page.goto('about:blank');
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

test('explicit localized links and internal English navigation retain their language', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'languages', { get: () => ['es-MX'] });
  });
  await page.goto('/es/work/driveka/');
  await page.evaluate(() => localStorage.setItem('portfolio-language', 'en'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await page.goto('/work/driveka/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.evaluate(() => localStorage.removeItem('portfolio-language'));
  await page.getByRole('link', { name: /cm — Carlos Martínez — Home/ }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('manual language works with all storage blocked', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'languages', { get: () => ['es-MX'] });
    for (const key of ['localStorage', 'sessionStorage']) {
      Object.defineProperty(window, key, {
        get: () => {
          throw new Error('Blocked');
        },
      });
    }
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('navigator.language is used when the ordered language list is empty', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'languages', { get: () => [] });
    Object.defineProperty(navigator, 'language', { get: () => 'es-ES' });
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});
