export function initLanguageChoice() {
  document
    .querySelectorAll<HTMLAnchorElement>('.language-switch a')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const language = link.lang;
        if (language !== 'en' && language !== 'es') return;
        for (const storage of ['localStorage', 'sessionStorage'] as const) {
          try {
            window[storage].setItem('portfolio-language', language);
            return;
          } catch {}
        }
        // An explicit URL choice also works when all browser storage is blocked.
        const target = new URL(link.href);
        target.searchParams.set('lang', language);
        link.href = target.href;
      });
    });
}
