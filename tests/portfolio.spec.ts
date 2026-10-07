import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const routes = [
  '/',
  '/es/',
  '/work/zenit/',
  '/work/driveka/',
  '/work/visitapp/',
  '/es/work/zenit/',
  '/es/work/driveka/',
  '/es/work/visitapp/',
];
for (const theme of ['light', 'dark'] as const) {
  for (const route of routes) {
    test(`${theme}: route, links and accessibility ${route}`, async ({
      page,
      request,
    }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(route);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute(
        'lang',
        route.startsWith('/es') ? 'es' : 'en',
      );
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      for (const href of await page
        .locator('a[href^="/"]')
        .evaluateAll((links) => [
          ...new Set(links.map((link) => link.getAttribute('href')!)),
        ]))
        expect((await request.get(href.split('#')[0])).ok(), href).toBeTruthy();
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(
        results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
      ).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}
for (const width of [390, 768, 1440]) {
  test(`responsive pages: ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBeTruthy();
      await expect(page.locator('main h1')).toBeVisible();
      if (width === 390 && (route === '/' || route === '/es/')) {
        const result = await new AxeBuilder({ page })
          .withRules(['color-contrast', 'label-content-name-mismatch'])
          .analyze();
        expect(
          result.violations.map((v) => ({
            id: v.id,
            targets: v.nodes.map((n) => n.target),
          })),
        ).toEqual([]);
      }
    }
  });
}
test('theme follows the system until a manual preference is stored', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(
    await page.evaluate(() => localStorage.getItem('portfolio-theme')),
  ).toBe('light');
  await page.emulateMedia({ colorScheme: 'light' });
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('link', { name: 'ES', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Cambiar al tema oscuro' }).click();
  await page.locator('.project-name-link').first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page).toHaveURL(/\/es\/work\/zenit\//);
});
test('stored theme is applied before the body is parsed', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('portfolio-theme', 'dark');
    const records: string[] = [];
    new MutationObserver(() => {
      if (document.body)
        records.push(document.documentElement.dataset.theme || 'missing');
    }).observe(document, { childList: true, subtree: true });
    (window as Window & { themeRecords?: string[] }).themeRecords = records;
  });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const records = await page.evaluate(
    () => (window as Window & { themeRecords?: string[] }).themeRecords,
  );
  expect(records?.length).toBeGreaterThan(0);
  expect(records?.every((theme) => theme === 'dark')).toBeTruthy();
});
test('theme remains usable when storage is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Blocked', 'SecurityError');
      },
    });
  });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
test('language switch preserves current case', async ({ page }) => {
  await page.goto('/work/driveka/');
  await page.getByRole('link', { name: 'ES', exact: true }).click();
  await expect(page).toHaveURL(/\/es\/work\/driveka\//);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL(/\/work\/driveka\//);
});
test('mobile menu and theme work with keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const theme = page.getByRole('button', { name: 'Switch to dark theme' });
  await theme.focus();
  await theme.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const menu = page.getByRole('button', { name: 'Toggle navigation' });
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
  await menu.press('Enter');
  await page
    .locator('#navigation')
    .getByRole('link', { name: 'Work', exact: true })
    .click();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#work$/);
});
test('CV downloads are real PDFs in the selected language', async ({
  page,
  request,
}) => {
  for (const [route, lang] of [
    ['/', 'en'],
    ['/es/', 'es'],
  ]) {
    await page.goto(route);
    const href = await page.locator('a[download]').first().getAttribute('href');
    expect(href).toBe(`/cv/carlos-martinez-${lang}.pdf`);
    const response = await request.get(href!);
    expect(response.headers()['content-type']).toContain('application/pdf');
    expect((await response.body()).subarray(0, 4).toString()).toBe('%PDF');
    const download = page.waitForEvent('download');
    await page.locator('a[download]').first().click();
    expect((await download).suggestedFilename()).toBe(
      `carlos-martinez-${lang}.pdf`,
    );
  }
});
test('reduced motion avoids WebGL and pinned scroll', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('.sculpture canvas')).toHaveCount(0);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('#contact h2')).toBeVisible();
});
test('without JavaScript content, navigation and system theme remain available', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    colorScheme: 'dark',
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto(
    `${process.env.PORTFOLIO_URL || 'http://127.0.0.1:4322'}/es/`,
  );
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('#navigation')).toBeVisible();
  expect(
    await page
      .locator('html')
      .evaluate((el) => getComputedStyle(el).getPropertyValue('--bg').trim()),
  ).toBe('#111318');
  await page.locator('.project-name-link').first().click();
  await expect(page).toHaveURL(/\/es\/work\/zenit\//);
  await context.close();
});
test('unavailable WebGL retains the vector composition and working navigation', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      ...args: Parameters<typeof original>
    ) {
      if (args[0].toString().startsWith('webgl')) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('[data-sculpture="hero"]')).toHaveAttribute(
    'data-render-state',
    'fallback',
  );
  await expect(
    page.locator('[data-sculpture="hero"] .sculpture-fallback'),
  ).toHaveCSS('opacity', '1');
  await page.locator('.hero-buttons a').first().click();
  await expect(page).toHaveURL(/#work$/);
});
test('desktop 3D responds to scroll, pauses offscreen, and survives theme change', async ({
  page,
}) => {
  test.setTimeout(45000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({
    colorScheme: 'light',
    reducedMotion: 'no-preference',
  });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const hero = page.locator('[data-sculpture="hero"]');
  await expect(hero).toHaveAttribute('data-render-state', 'webgl', {
    timeout: 20000,
  });
  await expect(hero).toHaveAttribute('data-scene-state', 'running');
  await page.evaluate(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement & {
      originalScene?: boolean;
    };
    canvas.originalScene = true;
  });
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  expect(
    await page
      .locator('.sculpture canvas')
      .evaluate(
        (el) =>
          (el as HTMLCanvasElement & { originalScene?: boolean }).originalScene,
      ),
  ).toBe(true);
  await expect(page.locator('.pin-spacer')).toHaveCount(1);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-scene-state="running"]')).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(hero).toHaveAttribute('data-scene-state', 'running');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.sculpture canvas')).toHaveCount(0);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  expect(errors).toEqual([]);
});
