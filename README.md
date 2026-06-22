# YLH UI Sample — Sidebar Command

Full multi-page Next.js site (Home, About, Events, Team, Contact, Join, Blogs) using YLH's real color tokens and fonts, with a persistent left sidebar navigation, scroll-progress indicator, cursor-glow on the sidebar, and a floating animated network background. Includes a working light/dark mode toggle (persisted via localStorage), matching the real site's actual theme system.

## Run locally
```bash
npm install
npm run dev
```

## Deploy to GitHub Pages
1. Push as its own repo named exactly `ylh-sample-sidebar` (or update `basePath` in `next.config.js` to match whatever name you use).
2. `npm run build` → creates `out/`.
3. Use GitHub Actions (recommended, no terminal needed after first push) or push `out/` to a `gh-pages` branch.
4. Enable GitHub Pages: Settings → Pages → Source.

## What's distinct about this sample
- Navigation: persistent left sidebar, collapses to a hamburger menu on mobile
- Background: floating connected-node network (calm, legal-tech)
- Animation style: clean fade/slide reveals, word-by-word headline reveals
- Cursor interaction: soft glow follows cursor inside the sidebar only
