# rendered — the pages as the desk sees them

The kb comes as an export, not a site. These files are its pages after a build, so you can read
what a page shows without building it.

| page | source | rendered |
|---|---|---|
| #4471 split: one ticket per problem | `src/routes/kb/incidents/4471/problems/+page.svx` | [`kb/incidents/4471/problems.html`](kb/incidents/4471/problems.html) · [`.png`](kb/incidents/4471/problems.png) |
| #4471 · dates parse mm/dd in eu locales | `src/routes/kb/incidents/4471/+page.svx` | [`kb/incidents/4471.html`](kb/incidents/4471.html) · [`.png`](kb/incidents/4471.png) |
| Support knowledge base (index) | `src/routes/kb/+page.svx` | [`kb.png`](kb.png) |

The tickets the split page links to:
[#1 parser](https://github.com/piotrsmoczyk-allegro/mega-dev-challenge/issues/1) ·
[#2 hint](https://github.com/piotrsmoczyk-allegro/mega-dev-challenge/issues/2) ·
[#3 one-day move](https://github.com/piotrsmoczyk-allegro/mega-dev-challenge/issues/3).

## How they were made

1. `npm install` and `npm run build`: SvelteKit 2.69.3 with `@sveltejs/adapter-static`, mdsvex 0.12.8,
   Svelte 5.57.2, Vite 7.3.1, on Node 26.0.0. Every page under `/kb` is prerendered into `build/`.
2. The `.html` files are the prerendered pages with their CSS inlined and the scripts left out. The
   content is in the HTML already; nothing on these pages needs JavaScript.
3. The `.png` files are full-page screenshots of `vite preview` in Chromium, 1000 px wide.

Rendered on 2026-10-28, from the export of 2026-10-04 (`kb-export-267efc5e.zip`). Tables and
counts come from `src/lib/data/` at render time: build again and they follow the data.
