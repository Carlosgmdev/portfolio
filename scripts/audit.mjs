import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';

const root = resolve('dist');
const output = resolve('qa-results/another-version');
await mkdir(output, { recursive: true });
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, 'http://localhost').pathname,
    );
    let file = resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    res.writeHead(200, {
      'Content-Type': mime[extname(file)] || 'application/octet-stream',
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end('Not found');
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const executablePath =
  process.env.CHROME_PATH ||
  (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
let browser;
let chrome;
try {
  browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
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
  for (const theme of ['light', 'dark']) {
    for (const width of [390, 768, 1440]) {
      for (const route of routes) {
        const page = await browser.newPage({
          viewport: { width, height: 900 },
          reducedMotion: 'reduce',
          colorScheme: theme,
        });
        await page.goto(base + route);
        await page.evaluate(() => document.fonts.ready);
        const name =
          route === '/'
            ? 'home-en'
            : route.replaceAll('/', '-').replace(/^-|-$/g, '');
        await page.screenshot({
          path: `${output}/${name}-${theme}-${width}.png`,
          fullPage: true,
        });
        if (route === '/' || route === '/es/')
          await page.screenshot({
            path: `${output}/${name}-${theme}-${width}-viewport.png`,
          });
        await page.close();
      }
    }
  }
  console.log(
    'Visual QA: all eight pages captured in both themes at 390, 768 and 1440px.',
  );
  await browser.close();
  browser = undefined;
  chrome = await launch({
    chromePath: executablePath,
    chromeFlags: ['--headless', '--no-sandbox'],
  });
  const summary = [];
  for (const route of ['/', '/es/', '/work/zenit/']) {
    const name =
      route === '/'
        ? 'home-en'
        : route.replaceAll('/', '-').replace(/^-|-$/g, '');
    const result = await lighthouse(base + route, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });
    await writeFile(`${output}/lighthouse-${name}.json`, result.report);
    const scores = Object.fromEntries(
      Object.entries(result.lhr.categories).map(([key, category]) => [
        key,
        Math.round(category.score * 100),
      ]),
    );
    summary.push({ route, ...scores });
    console.log(route, scores);
  }
  await writeFile(
    `${output}/summary.json`,
    JSON.stringify(summary, null, 2) + '\n',
  );
} finally {
  await browser?.close();
  if (chrome) await Promise.resolve(chrome.kill());
  server.close();
}
