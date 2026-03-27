@AGENTS.md

# Synthex Prompts AI

AI-generated image portfolio with Midjourney prompts. See `PRD.md` for full spec, `docs/superpowers/plans/` for implementation plans.

## Commands

```bash
npm run dev    # Dev server — localhost:3000
npm test       # Vitest
npm run build  # Production build
```

## Stack
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4 — no `tailwind.config.ts`; custom theme goes in `@theme {}` in `globals.css`
- Framer Motion v12, Vitest v4

## Key Directories
- `app/` — pages and layouts
- `components/` — aurora, loading, nav (done); gallery, modal, admin (pending)
- `tests/` — test files
- `docs/superpowers/plans/` — implementation plans

## Standards
- Glass cards: use `.glass` CSS class (defined in `globals.css`)
- Aurora pulse: `window.dispatchEvent(new CustomEvent('aurora:pulse'))`
- Framer Motion: never add `initial/animate/exit` to nested `motion.*` when parent uses named variants — breaks stagger propagation
- Content data: `posts.json` (portfolio), `blog.json` (blog)

## Notes
- `public/logo.svg` is a placeholder — replace with real brand logo
- Admin requires Cloudflare R2 + GitHub OAuth env vars (see GitHub issues #4 and #5)
