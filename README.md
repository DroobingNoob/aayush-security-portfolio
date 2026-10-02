# Aayush Dasgupta — Security Portfolio

An interactive portfolio focused on enterprise frontend development, application security, and hands-on cybersecurity work.

The site has two experiences:

- **Standard Portfolio** — résumé, projects, credentials, recognition, and a Linux-style portfolio filesystem.
- **Studio Mode** — a visual, scroll-based experience with interactive project demonstrations, including a miniature Obsidian assessment workflow built with fictional sample data.

## Development

Built with React and Vite. Both modes retain their original styling, content, and URLs.

Use Node.js 24, then run:

```sh
npm ci
npm run dev
```

Open the local address shown in the terminal. The Standard page is `index.html`; Studio is `studio.html`.

## Source structure

- `src/views/` — React markup preserving the original page structure.
- `src/components/` — terminal, carousels, and interactive project demos.
- `src/hooks/` — touch gestures and scroll/pointer effects with lifecycle cleanup.
- `src/data/` — sandbox filesystem and credential categories.
- `src/styles/` — the original styles, with their cascade order preserved.
- `public/assets/` — the original portraits.

The terminal and demos use React state and never execute server commands. Studio uses native CSS scroll snapping; scroll listeners only observe position and update visual effects.

## Build and checks

```sh
npm run build
npx playwright install chromium
npm test
```

The browser tests cover terminal commands, Markdown output, history, mode navigation, project demos, credential filtering, scroll snapping, and mobile/tablet controls. `npm run preview` serves the production build.

For a migration parity audit, serve the original site on port 4174 and the React development site on port 5173, then run `node scripts/compare-migration.mjs`. It compares layout geometry and screenshots at desktop, tablet, and phone widths. Temporary screenshots are ignored by Git.

## Deployment

GitHub Pages installs the locked dependencies, builds React, and publishes `dist` whenever `main` changes. The deployment workflow is in `.github/workflows/pages.yml`. `dist` is generated, not edited or committed. Relative asset paths support the GitHub Pages project subdirectory.

## Content note

Security demonstrations run entirely in the browser and use prepared sample data. They do not scan external systems or send commands to a server.
