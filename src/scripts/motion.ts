export async function initMotion() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) {
    reduced.addEventListener('change', () => initMotion(), { once: true });
    return;
  }
  try {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      {
        desktop: '(min-width: 1024px)',
        motion: '(prefers-reduced-motion: no-preference)',
      },
      (context) => {
        if (!context.conditions?.motion) return;
        const cleanups: (() => void)[] = [];
        let disposed = false;
        let sculpture:
          | { setProgress: (value: number) => void; dispose: () => void }
          | undefined;
        let progress = 0;
        const heroLines = document.querySelectorAll('[data-hero-line]');
        if (heroLines.length)
          gsap.from(heroLines, {
            yPercent: 105,
            duration: 1.35,
            stagger: 0.13,
            ease: 'power4.out',
            clearProps: 'transform',
          });
        if (heroLines.length)
          gsap.from('.hero-meta, .hero-bottom', {
            y: 18,
            opacity: 0,
            duration: 0.9,
            delay: 0.45,
            stagger: 0.1,
            clearProps: 'all',
          });
        document
          .querySelectorAll<HTMLElement>('[data-reveal-lines]')
          .forEach((el) => {
            gsap.from(el, {
              y: 32,
              clipPath: 'inset(0% 0% 100% 0%)',
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 94%', once: true },
              clearProps: 'all',
            });
          });
        document
          .querySelectorAll<HTMLElement>('.project-card, .case-art')
          .forEach((card) => {
            const art = card.querySelector<HTMLElement>('.project-art');
            if (!art) return;
            gsap.from(art, {
              scale: 1.06,
              duration: 1.4,
              ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 88%', once: true },
              clearProps: 'transform',
            });
            art
              .querySelectorAll<SVGGeometryElement>('.draw-path')
              .forEach((path) => {
                const length = path.getTotalLength();
                gsap.fromTo(
                  path,
                  { strokeDasharray: length, strokeDashoffset: length },
                  {
                    strokeDashoffset: 0,
                    duration: 1.9,
                    ease: 'power2.inOut',
                    scrollTrigger: {
                      trigger: art,
                      start: 'top 85%',
                      once: true,
                    },
                    clearProps: 'strokeDasharray,strokeDashoffset',
                  },
                );
              });
            const cubes = art.querySelector('.art-cubes, .visit-modules');
            if (cubes)
              gsap.from(cubes, {
                y: 30,
                opacity: 0,
                rotate: -8,
                duration: 1.15,
                scrollTrigger: { trigger: art, start: 'top 80%', once: true },
                clearProps: 'all',
              });
            if (
              window.matchMedia('(hover: hover) and (pointer: fine)').matches
            ) {
              const moveX = gsap.quickTo(art, 'x', {
                duration: 0.6,
                ease: 'power3.out',
              });
              const moveY = gsap.quickTo(art, 'y', {
                duration: 0.6,
                ease: 'power3.out',
              });
              const move = (event: PointerEvent) => {
                const rect = card.getBoundingClientRect();
                moveX((event.clientX - rect.left - rect.width / 2) * 0.012);
                moveY((event.clientY - rect.top - rect.height / 2) * 0.012);
              };
              const reset = () => {
                moveX(0);
                moveY(0);
              };
              card.addEventListener('pointermove', move);
              card.addEventListener('pointerleave', reset);
              cleanups.push(() => {
                card.removeEventListener('pointermove', move);
                card.removeEventListener('pointerleave', reset);
              });
            }
          });
        const timeline = document.querySelector('.timeline');
        if (timeline)
          gsap.fromTo(
            '.timeline-track span',
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: timeline,
                start: 'top 80%',
                end: 'bottom 65%',
                scrub: 0.5,
              },
              clearProps: 'transform',
            },
          );
        document
          .querySelectorAll(
            '.timeline-item, .skill-item, .case-prose, .decisions-grid > article',
          )
          .forEach((el) =>
            gsap.from(el, {
              y: 24,
              opacity: 0,
              duration: 0.8,
              scrollTrigger: { trigger: el, start: 'top 93%', once: true },
              clearProps: 'all',
            }),
          );
        if (document.querySelector('.about-monogram'))
          gsap.to('.about-monogram i', {
            rotate: 180,
            ease: 'none',
            scrollTrigger: {
              trigger: '.about-monogram',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          });
        const shell = document.querySelector<HTMLElement>('.process-shell');
        if (shell && context.conditions.desktop) {
          const layers = [
            ...document.querySelectorAll<HTMLElement>('.process-layer'),
          ];
          const update = (value: number) => {
            progress = value;
            sculpture?.setProgress(value);
            layers.forEach((layer, index) =>
              layer.classList.toggle(
                'is-active',
                index === Math.min(2, Math.floor(value * 3)),
              ),
            );
            shell.style.setProperty('--process-progress', String(value));
          };
          update(0);
          ScrollTrigger.create({
            trigger: shell,
            start: 'top 100px',
            end: '+=90%',
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => update(self.progress),
            onLeave: () => update(1),
            onLeaveBack: () => update(0),
          });
          cleanups.push(() => {
            layers.forEach((layer) => layer.classList.remove('is-active'));
            shell.style.removeProperty('--process-progress');
          });
          import('./sculpture')
            .then(({ initSculpture }) => {
              if (disposed) return;
              sculpture = initSculpture();
              sculpture?.setProgress(progress);
            })
            .catch(() => {
              /* The vector sculpture remains visible if WebGL cannot load. */
            });
        }
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
          document.querySelectorAll<HTMLElement>('.magnetic').forEach((el) => {
            const x = gsap.quickTo(el, 'x', {
                duration: 0.5,
                ease: 'power3.out',
              }),
              y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
            const move = (event: PointerEvent) => {
              const rect = el.getBoundingClientRect();
              x((event.clientX - rect.left - rect.width / 2) * 0.14);
              y((event.clientY - rect.top - rect.height / 2) * 0.14);
            };
            const leave = () => {
              x(0);
              y(0);
            };
            el.addEventListener('pointermove', move);
            el.addEventListener('pointerleave', leave);
            cleanups.push(() => {
              el.removeEventListener('pointermove', move);
              el.removeEventListener('pointerleave', leave);
            });
          });
        }
        document.documentElement.dataset.motion = 'ready';
        document.fonts.ready.then(() => {
          if (!disposed) ScrollTrigger.refresh();
        });
        return () => {
          disposed = true;
          sculpture?.dispose();
          cleanups.forEach((fn) => fn());
          document.documentElement.dataset.motion = 'reduced';
        };
      },
    );
    const refreshOnReturn = (event: PageTransitionEvent) => {
      if (event.persisted) ScrollTrigger.refresh();
    };
    window.addEventListener('pageshow', refreshOnReturn);
    window.addEventListener('pagehide', (event) => {
      if (!event.persisted) {
        media.revert();
        window.removeEventListener('pageshow', refreshOnReturn);
      }
    });
  } catch {
    /* Static HTML remains readable when animation dependencies are unavailable. */
  }
}
