const PRELOAD_TIMEOUT = 12000;
const RETRY_DELAY = 1000;

const delay = (duration: number) => new Promise((resolve) => window.setTimeout(resolve, duration));

export const initializeHero = (hero: HTMLElement) => {
  const slideshow = hero.querySelector<HTMLElement>('[data-hero-slideshow]');
  const layers = Array.from(hero.querySelectorAll<HTMLElement>('[data-hero-layer]'));
  const templates = Array.from(hero.querySelectorAll<HTMLTemplateElement>('[data-hero-slide-template]'));
  const currentSlide = hero.querySelector<HTMLElement>('[data-hero-slide-current]');
  const progressFill = hero.querySelector<HTMLElement>('[data-hero-progress]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!slideshow || layers.length !== 2 || !currentSlide || !progressFill || reducedMotion || templates.length < 2) {
    return;
  }

  const holdDuration = Number(slideshow.dataset.holdDuration);
  const fadeDuration = Number(slideshow.dataset.fadeDuration);

  if (!Number.isFinite(holdDuration) || !Number.isFinite(fadeDuration)) {
    return;
  }

  let currentIndex = 0;
  let currentLayer = layers[0];
  let stagingLayer = layers[1];
  const preloadCache = new Map<number, Promise<boolean>>();

  const getTemplate = (index: number) => templates[index % templates.length];

  const preloadSlide = (index: number) => {
    const normalizedIndex = index % templates.length;
    const cached = preloadCache.get(normalizedIndex);

    if (cached) return cached;

    const template = getTemplate(normalizedIndex);
    const source = template?.content.querySelector<HTMLSourceElement>('source');
    const fallback = template?.content.querySelector<HTMLImageElement>('img');

    if (!fallback) return Promise.resolve(false);

    const preload = new Image();
    preload.decoding = 'async';
    preload.fetchPriority = 'low';
    preload.sizes = source?.sizes || '100vw';
    preload.srcset = source?.srcset || '';
    preload.src = fallback.src;

    const result = Promise.race([
      preload.decode().then(() => true).catch(() => false),
      delay(PRELOAD_TIMEOUT).then(() => false)
    ]);

    preloadCache.set(normalizedIndex, result);
    void result.then((loaded) => {
      if (!loaded) preloadCache.delete(normalizedIndex);
    });

    return result;
  };

  const preloadAhead = (index: number) => {
    void preloadSlide(index + 1);
    void preloadSlide(index + 2);
  };

  const findNextSlide = async () => {
    for (let offset = 1; offset < templates.length; offset += 1) {
      const candidate = (currentIndex + offset) % templates.length;
      if (await preloadSlide(candidate)) return candidate;
    }

    return null;
  };

  const mountSlide = async (layer: HTMLElement, index: number) => {
    const template = getTemplate(index);
    if (!template) return false;

    layer.replaceChildren(template.content.cloneNode(true));
    const image = layer.querySelector<HTMLImageElement>('img');

    if (!image) return false;

    try {
      await image.decode();
      return true;
    } catch {
      layer.replaceChildren();
      return false;
    }
  };

  const waitForFade = (layer: HTMLElement) =>
    new Promise<void>((resolve) => {
      let complete = false;

      const finish = () => {
        if (complete) return;
        complete = true;
        window.clearTimeout(fallbackTimer);
        layer.removeEventListener('transitionend', handleTransitionEnd);
        resolve();
      };

      const handleTransitionEnd = (event: TransitionEvent) => {
        if (event.target === layer && event.propertyName === 'opacity') finish();
      };

      const fallbackTimer = window.setTimeout(finish, fadeDuration + 150);
      layer.addEventListener('transitionend', handleTransitionEnd);
    });

  const restartProgress = () => {
    progressFill.classList.remove('is-running');
    void progressFill.offsetWidth;
    progressFill.classList.add('is-running');
  };

  const transitionTo = async (nextIndex: number) => {
    if (!(await mountSlide(stagingLayer, nextIndex))) return false;

    const fadeComplete = waitForFade(stagingLayer);
    currentLayer.classList.add('is-leaving');
    stagingLayer.classList.add('is-entering');
    await fadeComplete;

    currentLayer.classList.remove('is-current', 'is-leaving');
    currentLayer.replaceChildren();
    stagingLayer.classList.remove('is-entering');
    stagingLayer.classList.add('is-current');
    [currentLayer, stagingLayer] = [stagingLayer, currentLayer];

    currentIndex = nextIndex;
    currentSlide.textContent = String(currentIndex + 1).padStart(2, '0');
    preloadAhead(currentIndex);
    restartProgress();
    return true;
  };

  const runSlideshow = async () => {
    hero.classList.add('is-enhanced');
    preloadAhead(currentIndex);
    restartProgress();

    while (hero.isConnected) {
      await delay(holdDuration);
      const nextIndex = await findNextSlide();

      if (nextIndex === null || !(await transitionTo(nextIndex))) {
        await delay(RETRY_DELAY);
      }
    }
  };

  void runSlideshow();
};
