export function initTheme() {
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const button = document.querySelector<HTMLButtonElement>('.theme-toggle');
  let manual: 'light' | 'dark' | null = null;
  try {
    const saved = localStorage.getItem('portfolio-theme');
    manual = saved === 'light' || saved === 'dark' ? saved : null;
  } catch {}
  if (manual !== 'light' && manual !== 'dark') manual = null;
  const apply = (theme: 'light' | 'dark') => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#111318' : '#f2f3f5');
    button?.setAttribute(
      'aria-label',
      (theme === 'dark'
        ? button.dataset.lightLabel
        : button.dataset.darkLabel) || 'Change theme',
    );
    document.dispatchEvent(
      new CustomEvent('portfolio:theme', { detail: theme }),
    );
  };
  apply(
    manual === 'light' || manual === 'dark'
      ? manual
      : media.matches
        ? 'dark'
        : 'light',
  );
  button?.addEventListener('click', () => {
    manual = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('portfolio-theme', manual);
    } catch {}
    apply(manual);
  });
  media.addEventListener('change', (event) => {
    if (!manual) apply(event.matches ? 'dark' : 'light');
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== 'portfolio-theme' && event.key !== null) return;
    manual =
      event.newValue === 'light' || event.newValue === 'dark'
        ? event.newValue
        : null;
    apply(manual || (media.matches ? 'dark' : 'light'));
  });
}
