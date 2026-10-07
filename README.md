# Carlos Martínez — Engineered in motion

Second portfolio design, developed on `another_version` with Astro, TypeScript, GSAP and Three.js. Silver/blue editorial direction, light/dark themes, bilingual content and three project case studies.

## Start the preview

Requires Node.js 22.12+ and npm.

```sh
npm ci
npx astro dev --background --port 4322
npx astro dev status
npx astro dev logs
npx astro dev stop
```

Open `http://localhost:4322/` or `http://localhost:4322/es/`. Port 4322 keeps the new preview separate from any first-version preview.

## Content and visual system

- `src/data/portfolio.ts`: typed English/Spanish content, projects, experience, contact and article links.
- `src/styles/global.css`: semantic light/dark colors, local fonts, layouts, illustrations and breakpoints.
- `src/scripts/theme.ts`: system preference, manual choice, persistence and cross-tab updates.
- `src/components/LanguageDetection.astro` and `src/scripts/language.ts`: initial language detection and remembered EN/ES selection.
- `src/scripts/motion.ts`: masked reveals, SVG path drawing, pointer interactions, timeline and pinned architecture sequence.
- `src/scripts/sculpture.ts`: a procedural three-layer software stack: an interface panel, a logic module and a data layer, joined by blue connectors. One renderer moves between the hero and architecture section; theme changes update materials and lights without recreating it.
- `public/cv/`: the original Spanish and English PDFs.

Project illustrations are conceptual. Case studies describe contributions supported by the supplied CVs and contain no invented impact metrics.

## Theme and motion behavior

On a direct visit to `/`, a saved EN/ES choice takes priority; otherwise the first supported language in the browser's preferences is selected (including regional variants such as `es-MX`). Unsupported languages fall back to English. Detection runs in the head and uses replacement navigation, preserving query parameters and anchors. Explicit `/es/` and case-study links keep their language. Internal navigation stays in the current language. Manual choices persist in local storage, with session storage and an explicit URL parameter as fallbacks when storage is blocked. Without JavaScript, `/` is English and `/es/` is Spanish.

The first visit follows the operating-system theme. The header button saves an explicit `light`/`dark` choice in `localStorage`; an inline head script applies it before body rendering. If storage is blocked, manual selection still works for the current visit. Theme changes synchronize between tabs. Without JavaScript, CSS follows the system preference.

On screens at least 1024px wide with standard motion enabled, Three.js loads separately and renders the sculpture. Its three layers separate during the short pinned architecture sequence. The render loop pauses offscreen and when the document is hidden. Resources and event listeners are released when the desktop motion condition stops applying.

Smaller screens use the equivalent SVG sculpture. Reduced-motion mode removes animated sequences and pinning. Missing WebGL, failed dynamic imports or context loss leave the static composition readable. Scrolling is native, and all core content is server-rendered.

Cross-document native view transitions connect project titles and illustrations to their case-study pages in supporting browsers. Other browsers use ordinary navigation.

## Validation

```sh
npm run check
npm run build
npm test
npm run capture
npm run audit
```

Tests and motion captures expect the dev server at `http://127.0.0.1:4322`. Override it with `PORTFOLIO_URL` when needed. Chrome defaults to `/usr/bin/google-chrome` if installed; override with `CHROME_PATH`. Playwright tests also support its bundled Chromium (`npx playwright install chromium`).

Browser tests check all eight pages in both themes, WCAG A/AA accessibility, local links, responsive layouts, theme persistence, initial theme application, blocked storage, language switching, keyboard navigation, CV downloads, no-JavaScript mode, reduced motion, missing WebGL, desktop rendering, theme changes and offscreen pause.

`npm run capture` records the actual 3D hero and architecture sequence in both themes. `npm run audit` builds production, captures all pages at 390/768/1440px in both themes and runs mobile Lighthouse for English/Spanish homepages and the English ZÉNIT case. Audit scripts close their temporary server/browser when complete.

Artifacts live in ignored `qa-results/another-version/` and `test-results/another-version/`.

## Publishing

Set the final public origin during build to generate canonical, hreflang and absolute Open Graph URLs:

```sh
SITE_URL=https://your-domain.example npm run build
```

Deploy `dist/` to a static host with directory-index support. No backend or contact service is required. This implementation does not publish the site.
