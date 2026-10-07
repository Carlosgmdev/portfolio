import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results/another-version',
  use: {
    locale: 'en-US',
    baseURL: process.env.PORTFOLIO_URL || 'http://127.0.0.1:4322',
    launchOptions: {
      executablePath:
        process.env.CHROME_PATH ||
        (existsSync('/usr/bin/google-chrome')
          ? '/usr/bin/google-chrome'
          : undefined),
      args: ['--no-sandbox', '--enable-unsafe-swiftshader'],
    },
  },
  reporter: 'list',
});
