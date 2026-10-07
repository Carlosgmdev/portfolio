// @ts-check
import { defineConfig } from 'astro/config';
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  output: 'static',
  devToolbar: { enabled: false },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
});
