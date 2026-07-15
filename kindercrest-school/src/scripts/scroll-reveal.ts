const revealRootSelector = '[data-reveal-root]';
const revealSelector = '[data-reveal]';

const revealAll = (elements: HTMLElement[]) => {
  elements.forEach((element) => element.classList.add('is-revealed'));
};

export const initializeScrollReveals = () => {
  const root = document.querySelector<HTMLElement>(revealRootSelector);

  if (!root) return;

  const elements = Array.from(root.querySelectorAll<HTMLElement>(revealSelector));

  if (elements.length === 0) return;

  elements.forEach((element) => {
    const delay = Number.parseInt(element.dataset.revealDelay ?? '0', 10);
    element.style.setProperty('--reveal-delay', `${Number.isFinite(delay) ? delay : 0}ms`);
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealAll(elements);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        (entry.target as HTMLElement).classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.14
    }
  );

  elements.forEach((element) => observer.observe(element));
};
