# Kindercrest School Website

First version of the Kindercrest School website, built as a static-first Astro project with Svelte used only for interactive islands.

## Commands

- `npm run dev` starts the local dev server.
- `npm run build` builds the static site.
- `npm run preview` previews the production build.

## Architecture

- `src/data/site.ts` contains reusable school content, navigation, programmes, FAQs, and values.
- `src/layouts/BaseLayout.astro` owns shared document metadata and global styles.
- `src/components/sections/` contains page sections.
- `src/components/islands/` contains hydrated Svelte components.
- `src/styles/` contains design tokens and global CSS.

Design direction must continue to follow the root `design.md` and the moodboard references in the root `assets/references/` folder.
