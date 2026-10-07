import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
const output = 'qa-results/another-version';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    (existsSync('/usr/bin/google-chrome')
      ? '/usr/bin/google-chrome'
      : undefined),
  args: ['--no-sandbox', '--enable-unsafe-swiftshader'],
});
try {
  for (const theme of ['light', 'dark']) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      colorScheme: theme,
      reducedMotion: 'no-preference',
    });
    page.on('pageerror', (e) => console.error(e.message));
    await page.goto(
      (process.env.PORTFOLIO_URL || 'http://127.0.0.1:4322') + '/',
    );
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(
      () =>
        document
          .querySelector('[data-sculpture="hero"]')
          ?.getAttribute('data-scene-state') === 'running',
      { timeout: 20000 },
    );
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${output}/motion-hero-${theme}.png` });
    await page.evaluate(() => {
      const shell = document.querySelector('.process-shell');
      if (shell)
        window.scrollTo(
          0,
          shell.getBoundingClientRect().top +
            scrollY -
            100 +
            innerHeight * 0.45,
        );
    });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${output}/motion-process-${theme}.png` });
    await page.locator('#work').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${output}/motion-work-${theme}.png` });
    await page.close();
    const mobile = await browser.newPage({
      viewport: { width: 390, height: 844 },
      colorScheme: theme,
      reducedMotion: 'reduce',
    });
    await mobile.goto(
      (process.env.PORTFOLIO_URL || 'http://127.0.0.1:4322') + '/es/',
    );
    await mobile.evaluate(() => document.fonts.ready);
    await mobile.screenshot({
      path: `${output}/sculpture-mobile-${theme}.png`,
    });
    await mobile.close();
  }
  console.log(
    'Captured assembled 3D, scroll sequence and selected work in both themes.',
  );
} finally {
  await browser.close();
}
