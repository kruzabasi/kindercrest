<script lang="ts">
  import { onDestroy } from 'svelte';
  import { images } from '../../data/site';

  type NavItem = {
    label: string;
    href: string;
  };

  type NavGroup = NavItem & {
    children?: NavItem[];
  };

  export let navGroups: NavGroup[] = [];
  export let activeHref = '/';

  let open = false;
  let expanded: string | null = null;

  function blurAfterPointer(event: MouseEvent) {
    if (event.detail > 0 && event.currentTarget instanceof HTMLElement) {
      event.currentTarget.blur();
    }
  }

  function syncBodyLock() {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('menu-open', open);
  }

  function toggleMenu(event: MouseEvent) {
    blurAfterPointer(event);
    open = !open;
    if (!open) expanded = null;
    syncBodyLock();
  }

  function closeMenu() {
    open = false;
    expanded = null;
    syncBodyLock();
  }

  function toggleSection(label: string, event: MouseEvent) {
    blurAfterPointer(event);
    expanded = expanded === label ? null : label;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  }

  onDestroy(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.remove('menu-open');
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<button
  class="menu-toggle"
  type="button"
  aria-label={open ? 'Close menu' : 'Open menu'}
  aria-expanded={open}
  aria-controls="mobile-menu"
  class:menu-toggle--open={open}
  onclick={toggleMenu}
>
  <span class="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
  <span class="menu-toggle__line"></span>
  <span class="menu-toggle__line"></span>
</button>

{#if open}
  <div
    class="mobile-menu"
    id="mobile-menu"
    role="region"
    aria-label="Site navigation"
    style={`--mobile-menu-image: url('${images.classroomActivity}');`}
  >
    <nav class="mobile-menu__nav" aria-label="Mobile navigation">
      {#each navGroups as item, index}
        {#if item.children?.length}
          <div class={expanded === item.label ? 'mobile-menu__group mobile-menu__group--open' : 'mobile-menu__group'}>
            <button
              class={item.href === activeHref ? 'mobile-menu__item mobile-menu__item--active' : 'mobile-menu__item'}
              type="button"
              aria-expanded={expanded === item.label}
              aria-controls={`mobile-menu-section-${index}`}
              onclick={(event) => toggleSection(item.label, event)}
            >
              <span>{item.label}</span>
              <span class="mobile-menu__arrow" aria-hidden="true">{expanded === item.label ? '↓' : '→'}</span>
            </button>

            {#if expanded === item.label}
              <div class="mobile-menu__children" id={`mobile-menu-section-${index}`}>
                {#each item.children as child}
                  <a href={child.href} onclick={closeMenu}>{child.label}</a>
                {/each}
              </div>
            {/if}
          </div>
        {:else}
          <a
            class={item.href === activeHref ? 'mobile-menu__item mobile-menu__item--active' : 'mobile-menu__item'}
            href={item.href}
            onclick={closeMenu}
          >
            <span>{item.label}</span>
          </a>
        {/if}
      {/each}
    </nav>
  </div>
{/if}

<style>
  .menu-toggle {
    position: relative;
    z-index: 90;
    display: grid;
    width: 46px;
    height: 34px;
    align-items: center;
    justify-content: center;
    border: 0;
    padding: 0;
    color: var(--kc-white);
    background: transparent;
  }

  .menu-toggle__line {
    grid-area: 1 / 1;
    display: block;
    width: 43px;
    height: 2px;
    border-radius: 999px;
    background: currentColor;
    transition:
      opacity 160ms ease,
      transform 160ms ease;
  }

  .menu-toggle__line:nth-of-type(2) {
    transform: translateY(-5px);
  }

  .menu-toggle__line:nth-of-type(3) {
    transform: translateY(5px);
  }

  .menu-toggle--open .menu-toggle__line:nth-of-type(2) {
    width: 30px;
    transform: rotate(45deg);
  }

  .menu-toggle--open .menu-toggle__line:nth-of-type(3) {
    width: 30px;
    transform: rotate(-45deg);
  }

  .menu-toggle:focus-visible {
    outline: 2px solid rgb(255 255 255 / 70%);
    outline-offset: 4px;
  }

  .mobile-menu {
    position: fixed;
    z-index: 80;
    top: 0;
    right: 0;
    left: 0;
    min-height: 100svh;
    max-height: 100svh;
    overflow-y: auto;
    padding: clamp(7rem, 22vw, 8.5rem) clamp(1.2rem, 7vw, 2.4rem) clamp(2.5rem, 9vw, 3.25rem);
    color: var(--kc-white);
    background:
      linear-gradient(90deg, rgb(7 26 70 / 96%), rgb(7 26 70 / 88%)),
      var(--mobile-menu-image) center / cover;
    box-shadow: 0 22px 38px rgb(0 0 0 / 18%);
    animation: menu-reveal 180ms ease-out both;
    backdrop-filter: blur(12px);
    pointer-events: auto;
  }

  .mobile-menu__nav {
    display: grid;
    max-width: 640px;
    gap: 0.48rem;
    justify-items: end;
    margin-left: auto;
    text-align: right;
  }

  .mobile-menu__group {
    display: grid;
    gap: 0.25rem;
  }

  .mobile-menu__item {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
    min-height: 34px;
    border: 0;
    padding: 0.34rem 0;
    color: var(--kc-white);
    background: transparent;
    font-size: clamp(1.4rem, 7.5vw, 2.45rem);
    font-weight: 430;
    letter-spacing: 0.02em;
    line-height: 1;
    text-align: right;
    text-transform: uppercase;
  }

  .mobile-menu__item:focus-visible,
  .mobile-menu__children a:focus-visible {
    outline: 1px solid rgb(255 255 255 / 72%);
    outline-offset: 4px;
  }

  .mobile-menu__item span:first-child {
    position: relative;
  }

  .mobile-menu__item span:first-child::after {
    position: absolute;
    bottom: -0.18rem;
    left: 0;
    width: 100%;
    height: 1px;
    background: currentColor;
    content: '';
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 220ms ease;
  }

  .mobile-menu__item:hover span:first-child::after,
  .mobile-menu__item:focus-visible span:first-child::after,
  .mobile-menu__item--active span:first-child::after {
    transform: scaleX(1);
  }

  .mobile-menu__arrow {
    order: -1;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1;
  }

  .mobile-menu__children {
    display: grid;
    gap: 0.52rem;
    justify-items: end;
    width: min(100%, 20rem);
    margin: 0.25rem 0 0.9rem auto;
    border-right: 1px solid rgb(255 255 255 / 34%);
    padding: 0.1rem 0.9rem 0.12rem 0;
  }

  .mobile-menu__children a {
    position: relative;
    color: rgb(255 255 255 / 78%);
    font-size: clamp(1.08rem, 4.1vw, 1.28rem);
    font-weight: 430;
    line-height: 1.2;
    text-align: right;
  }

  .mobile-menu__children a::after {
    position: absolute;
    bottom: -0.18rem;
    left: 0;
    width: 100%;
    height: 1px;
    background: currentColor;
    content: '';
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 220ms ease;
  }

  .mobile-menu__children a:hover::after,
  .mobile-menu__children a:focus-visible::after {
    transform: scaleX(1);
  }

  @keyframes menu-reveal {
    from {
      opacity: 0;
      transform: translateY(-0.35rem);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 560px) {
    .menu-toggle {
      width: 42px;
    }

    .menu-toggle__line {
      width: 39px;
    }

    .menu-toggle--open .menu-toggle__line {
      width: 29px;
    }

    .mobile-menu {
      max-height: 100svh;
      padding-top: 6.7rem;
    }
  }
</style>
