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
- Framer Motion v12, Vitest v4, Lenis (smooth scroll)

## Key Directories
- `app/` — pages and layouts
- `components/aurora/` — AuroraBackground (aurora:pulse event)
- `components/cursor/` — CustomCursor (mix-blend-mode: difference, desktop only)
- `components/gallery/` — ImageCard, MasonryGrid, ImageModal
- `components/hero/` — RevealLine (translateY line reveal animation)
- `components/library/` — LibraryCard
- `components/loading/` — SynthexLoader, LoadingGate
- `components/nav/` — TopBar, NavOverlay
- `components/providers/` — SmoothScroll (Lenis wrapper)
- `tests/` — Vitest test files
- `docs/superpowers/plans/` — implementation plans (one per plan/feature)
- `references-for-claude/` — design reference briefs

## Design Standards
- **Shell stays dark and quiet** — images carry the visual weight, not UI chrome
- **No `.glass` on image cards** — `.glass` is for modals and overlays only
- **Image hover**: `scale(1.05) rotate(1deg)` inside `clip-path: inset(0% round 8px)` container
- **Text reveals**: use `<RevealLine delay={ms}>` for headline line-by-line reveals
- **Cursor**: `data-cursor-hover` attribute on any element that should expand the cursor ring
- **Aurora pulse**: `window.dispatchEvent(new CustomEvent('aurora:pulse'))`
- **Tags**: use `.tag` CSS class (defined in `globals.css`)
- **Entrance easing**: `cubic-bezier(.22,1,.36,1)` at `1.1s–1.4s` duration
- Framer Motion: never add `initial/animate/exit` to nested `motion.*` when parent uses named variants

## Content Data
- `posts.json` — portfolio posts (id, title, imageUrl, prompt, model, parameters, tags, date, facebookUrl)
- `blog.json` — blog posts (id, title, excerpt, body as markdown, tags, date, thumbnailUrl)
- Image URLs: picsum.photos for dev — dimensions encoded in URL `/seed/name/WIDTH/HEIGHT`

## Process Rule
**All non-trivial work needs a plan doc + GitHub issue + feature branch before any files are touched.**
See `docs/superpowers/plans/` for format. No direct commits to master for planned features.

## Notes
- `public/logo.svg` is a placeholder — TopBar currently uses text "SYNTHEX" until real logo is provided
- Admin (Plan 4) requires Cloudflare R2 + GitHub OAuth env vars
- Scrollbars are hidden globally — do not re-add them
- Default cursor hidden on desktop (`pointer: fine`) — CustomCursor handles all cursor display
