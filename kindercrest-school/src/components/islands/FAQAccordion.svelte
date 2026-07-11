<script lang="ts">
  import { slide } from 'svelte/transition';

  export let faqs: { question: string; answer: string }[] = [];

  let activeIndex = 0;
  const accents = ['var(--kc-sky)', 'var(--kc-green)', 'var(--kc-gold)', 'var(--kc-magenta)'];

  function toggle(index: number) {
    activeIndex = activeIndex === index ? -1 : index;
  }
</script>

<div class="faq-list">
  {#each faqs as faq, index}
    <article
      class={activeIndex === index ? 'faq-item faq-item--open' : 'faq-item'}
      style={`--faq-accent: ${accents[index % accents.length]};`}
    >
      <h3>
        <button
          type="button"
          aria-expanded={activeIndex === index}
          aria-controls={`faq-panel-${index}`}
          id={`faq-button-${index}`}
          onclick={() => toggle(index)}
        >
          <span class="faq-item__number">{String(index + 1).padStart(2, '0')}</span>
          <span class="faq-item__question">{faq.question}</span>
          <span class="faq-item__mark" aria-hidden="true">
            <span></span>
            <span></span>
          </span>
        </button>
      </h3>
      {#if activeIndex === index}
        <div
          class="faq-item__panel"
          id={`faq-panel-${index}`}
          role="region"
          aria-labelledby={`faq-button-${index}`}
          transition:slide={{ duration: 180 }}
        >
          <p>{faq.answer}</p>
        </div>
      {/if}
    </article>
  {/each}
</div>

<style>
  .faq-list {
    display: grid;
  }

  .faq-item {
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid color-mix(in srgb, var(--kc-ink) 16%, white);
    background: transparent;
    transition:
      background-color 160ms ease,
      border-color 160ms ease,
      box-shadow 160ms ease;
  }

  .faq-item::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 3px;
    opacity: 0;
    background: var(--faq-accent);
    content: '';
    transition: opacity 160ms ease;
  }

  .faq-item:hover,
  .faq-item--open {
    border-color: color-mix(in srgb, var(--kc-navy) 20%, white);
    background: rgb(255 255 255 / 78%);
  }

  .faq-item--open {
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 70%);
  }

  .faq-item--open::before {
    opacity: 1;
  }

  .faq-item:last-child {
    border-bottom: 0;
  }

  .faq-item h3 {
    margin: 0;
  }

  .faq-item button {
    display: grid;
    width: 100%;
    min-height: 86px;
    grid-template-columns: 3rem minmax(0, 1fr) 2.75rem;
    align-items: center;
    gap: 1.15rem;
    border: 0;
    padding: 1.25rem 0.8rem 1.25rem 1.2rem;
    color: var(--kc-navy);
    background: transparent;
    text-align: left;
  }

  .faq-item button:hover .faq-item__mark,
  .faq-item button:focus-visible .faq-item__mark,
  .faq-item--open .faq-item__mark {
    border-color: var(--kc-navy);
    color: var(--kc-white);
    background: var(--kc-navy);
  }

  .faq-item button:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--kc-gold) 88%, white);
    outline-offset: -2px;
  }

  .faq-item__number {
    align-self: start;
    margin-top: 0.18rem;
    color: var(--faq-accent);
    font-size: 0.78rem;
    font-weight: 850;
    letter-spacing: 0.08em;
    line-height: 1.2;
  }

  .faq-item__question {
    max-width: 700px;
    color: var(--kc-navy);
    font-size: 1.1rem;
    font-weight: 650;
    letter-spacing: 0;
    line-height: 1.35;
  }

  .faq-item__mark {
    position: relative;
    display: grid;
    width: 2.45rem;
    height: 2.45rem;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid color-mix(in srgb, var(--kc-navy) 22%, white);
    border-radius: 50%;
    color: var(--kc-navy);
    background: transparent;
    transition:
      background-color 160ms ease,
      border-color 160ms ease,
      color 160ms ease;
  }

  .faq-item__mark span {
    position: absolute;
    width: 0.9rem;
    height: 2px;
    border-radius: 999px;
    background: currentColor;
    transition:
      opacity 160ms ease,
      transform 160ms ease;
  }

  .faq-item__mark span:last-child {
    transform: rotate(90deg);
  }

  .faq-item--open .faq-item__mark span:last-child {
    opacity: 0;
    transform: rotate(90deg) scaleX(0.4);
  }

  .faq-item__panel {
    padding: 0 3.2rem 1.65rem 4.55rem;
  }

  .faq-item__panel p {
    max-width: 760px;
    margin: 0;
    color: color-mix(in srgb, var(--kc-ink) 72%, white);
    font-size: 1rem;
    line-height: 1.66;
  }

  @media (min-width: 1120px) {
    .faq-item button {
      min-height: 96px;
      grid-template-columns: 3.25rem minmax(0, 1fr) 2.9rem;
      padding-left: 1.35rem;
      padding-right: 1rem;
    }

    .faq-item__question {
      font-size: 1.2rem;
    }

    .faq-item__panel {
      padding-right: 4rem;
      padding-bottom: 1.8rem;
      padding-left: 4.6rem;
    }
  }

  @media (max-width: 640px) {
    .faq-item button {
      min-height: 78px;
      grid-template-columns: minmax(0, 1fr) 2.45rem;
      gap: 0.9rem;
      padding: 1.1rem 0.55rem 1.1rem 0.9rem;
    }

    .faq-item__number {
      grid-column: 1 / -1;
      margin: 0 0 -0.45rem;
      font-size: 0.72rem;
    }

    .faq-item__question {
      font-size: 1.02rem;
      line-height: 1.38;
    }

    .faq-item__panel {
      padding: 0 1.15rem 1.25rem 0.9rem;
    }

    .faq-item__panel p {
      font-size: 0.96rem;
      line-height: 1.62;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .faq-item,
    .faq-item::before,
    .faq-item__mark,
    .faq-item__mark span {
      transition-duration: 0.01ms;
    }
  }
</style>
