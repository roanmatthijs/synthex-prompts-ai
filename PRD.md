# Synthex Prompts AI — Portfolio Website PRD

## Problem Statement

As the creator of the Synthex Prompts AI Facebook page, I generate high-quality AI images using Midjourney and share the prompts behind them. Currently, my work is scattered across Facebook posts with no dedicated home. I have no central place to showcase my portfolio professionally, share the prompts and parameters that produced each image, drive traffic to my sales channels (Redbubble, PromptBase), or publish tutorials and prompt breakdowns. I need a world-class portfolio website that reflects the quality of my AI art and serves as the definitive hub for my brand.

## Solution

A full-featured Next.js portfolio website for Synthex Prompts AI — visually striking, animated, and futuristic — that showcases AI-generated images alongside their full prompts and Midjourney parameters. The site includes a masonry gallery, a searchable prompts library, a blog for tutorials and prompt breakdowns, an about page, and a links page. Content is managed via a password-protected admin interface that makes adding new posts a two-step process: upload image, fill in metadata, publish. Images are stored on Cloudflare R2. The site is deployed on Vercel with automatic redeployment on every content push.

## User Stories

### Portfolio / Gallery
1. As a visitor, I want to see a beautiful masonry grid of AI-generated images on the homepage, so that I can immediately experience the quality and breadth of Synthex Prompts AI's work.
2. As a visitor, I want the masonry grid to animate in when the page loads, so that the experience feels alive and premium from the first moment.
3. As a visitor, I want to hover over an image and see a teaser of the prompt appear, so that I can quickly decide whether to explore further without clicking.
4. As a visitor, I want to click an image to open a full modal, so that I can see the complete prompt, model, and parameters used.
5. As a visitor, I want to copy the full prompt with a single button click, so that I can use it as a starting point for my own Midjourney generations.
6. As a visitor, I want to see the Midjourney model version and parameters (--ar, --v, --style, --chaos, etc.) in the modal, so that I can replicate the exact generation settings.
7. As a visitor, I want to see the date an image was created in the modal, so that I can understand the chronology of the creator's work.
8. As a visitor, I want to see tags on each image in the modal, so that I can discover related work in similar styles or subjects.
9. As a visitor, I want to see related images at the bottom of the modal, so that I can stay engaged and discover more work without closing the modal.
10. As a visitor, I want to see a link to the original Facebook post in the modal, so that I can follow the creator's page and engage with the community there.
11. As a visitor, I want image cards to tilt subtly toward my cursor as I move, so that the gallery feels tactile and premium.
12. As a visitor, I want the modal to open with a bloom/expand animation from the card I clicked, so that the transition feels connected and intentional.
13. As a visitor, I want the aurora background to pulse subtly when I copy a prompt, so that I get satisfying feedback from the interaction.

### Prompts Library
14. As a prompt hunter, I want a dedicated Prompts Library page, so that I can browse prompts without being distracted by the images.
15. As a prompt hunter, I want to toggle between gallery view (images prominent) and library view (prompts prominent) on the same content, so that I can browse in whichever mode suits my goal.
16. As a prompt hunter, I want to search prompts by keyword, so that I can find prompts relevant to a style or subject I'm working on.
17. As a prompt hunter, I want to filter prompts by tag, so that I can quickly narrow to a specific category like "portrait" or "landscape".
18. As a prompt hunter, I want a copy button on every prompt in library view, so that I can grab prompts without opening a modal.

### Blog
19. As an AI creator, I want to read prompt breakdown posts that deconstruct how a specific image was built element by element, so that I can learn advanced prompting techniques.
20. As an AI creator, I want to read tutorial posts with step-by-step Midjourney guidance, so that I can improve my own generations.
21. As a blog reader, I want posts to be listed in a clean feed with thumbnail, title, date, and tags, so that I can quickly scan what's available.
22. As a blog reader, I want individual blog posts to have their own page with a clean, readable layout, so that I can focus on the content.
23. As a blog reader, I want to filter blog posts by tag, so that I can find breakdowns vs tutorials separately.

### About Page
24. As a new visitor, I want to read the creator's personal story and journey into AI art, so that I can connect with the human behind the work.
25. As a new visitor, I want to understand what Synthex Prompts AI stands for and its mission, so that I know why this page exists and what it offers.

### Links Page
26. As a visitor, I want a dedicated links page with clear cards for Facebook, Redbubble, and PromptBase, so that I can easily navigate to the creator's sales and social channels.
27. As a buyer, I want the Redbubble link to be prominent, so that I can purchase prints and merchandise of the AI art I've been browsing.
28. As a prompt buyer, I want the PromptBase link to be prominent, so that I can purchase premium prompt packs directly.

### Loading & Navigation
29. As a visitor, I want to see "SYNTHEX" assemble letter by letter from particles when the site first loads, so that the brand makes an immediate, memorable impression.
30. As a visitor, I want a minimal top navigation bar that stays out of the way of the content, so that the images and animations take center stage.
31. As a visitor, I want clicking the nav menu to trigger a dramatic full-screen overlay with large animated links, so that navigation feels like an intentional design moment.
32. As a visitor, I want the navigation overlay to close smoothly with an animation, so that returning to content feels seamless.
33. As a mobile visitor, I want the full-screen nav overlay to work perfectly on my phone, so that the experience is consistent across devices.

### Visual Design & Animation
34. As a visitor, I want the entire site to use a dark aesthetic with no light mode, so that the aurora and glassmorphism effects are always shown at their best.
35. As a visitor, I want a slowly shifting aurora background (Northern Lights across deep space), so that the site feels alive and cinematic at all times.
36. As a visitor, I want glassmorphism card effects — frosted glass, subtle blur, glow — so that UI elements feel layered and premium.
37. As a visitor, I want all page transitions and scroll reveals to be animated purposefully, so that every interaction feels considered and high-quality.
38. As a visitor, I want the site to use Clash Display for headings and Satoshi for body text, so that the typography feels premium and on-brand.

### Admin
39. As the site owner, I want a password-protected admin page at /admin, so that only I can add or manage content.
40. As the site owner, I want to log in to /admin using my GitHub account via NextAuth, so that I don't need to manage separate credentials.
41. As the site owner, I want to drag and drop an image onto the admin page to upload it, so that adding new images requires no manual file management.
42. As the site owner, I want to fill in a form with prompt, model, parameters, tags, date, and Facebook URL after uploading an image, so that all metadata is captured in one step.
43. As the site owner, I want to hit a single Publish button to make a new post live, so that the end-to-end process of adding content takes under two minutes.
44. As the site owner, I want uploaded images to be stored on Cloudflare R2 automatically, so that I never worry about storage costs or repo bloat.
45. As the site owner, I want Vercel to automatically redeploy the site when new content is published, so that changes go live without any manual deployment steps.

### SEO & Analytics
46. As the site owner, I want every page to have correct Open Graph meta tags, so that links shared on Facebook show rich preview cards with image and prompt text.
47. As the site owner, I want each individual portfolio image to generate its own Open Graph image, so that sharing a specific piece shows that piece's image and metadata in the Facebook preview.
48. As the site owner, I want Vercel Analytics enabled, so that I can see which pages and images attract the most traffic.
49. As the site owner, I want to understand where my traffic comes from (referrers), so that I can measure the impact of Facebook posts and other shares.

---

## Implementation Decisions

### Framework & Hosting
- **Next.js (App Router)** for the framework — supports static generation, API routes, image optimization, and server components
- **Vercel** for hosting — zero-config deployment, automatic redeployment on push, free tier, native Next.js support
- Initial domain: `.vercel.app` subdomain; custom domain to be added later

### Content & Data Layer
- All post content stored in `posts.json` at the project root
- Schema per post: `id`, `title`, `imageUrl`, `prompt`, `model`, `parameters`, `tags[]`, `date`, `facebookUrl`
- Blog posts stored in `blog.json` with: `id`, `title`, `body` (markdown), `tags[]`, `date`, `thumbnailUrl`
- Both JSON files are read at build time for static generation; admin writes trigger Vercel redeployment via webhook

### Image Storage
- **Cloudflare R2** for all uploaded images — near-zero storage cost, zero egress fees
- Admin upload API route handles multipart upload to R2 and returns the public CDN URL
- `next/image` component used throughout for automatic optimization, responsive sizing, and WebP conversion

### Admin & Authentication
- `/admin` route protected via **NextAuth.js** with GitHub OAuth provider
- Only the site owner's GitHub account is permitted (checked against a configured GitHub username environment variable)
- Admin UI: drag-and-drop upload zone + metadata form + publish button
- On publish: image uploaded to R2, posts.json updated, Vercel deploy webhook triggered

### Visual Design System
- **Aesthetic**: Dark glassmorphism + minimal futurism + biopunk aurora
- **Color**: Shifting aurora base (all hues cycling slowly), cyan-violet as primary interactive accent
- **Mode**: Dark only — no light mode toggle
- **Typography**: Clash Display (headings, display) + Satoshi (body, UI) — both from Fontshare
- **Glass cards**: `backdrop-filter: blur`, semi-transparent backgrounds, subtle border glow
- **Aurora**: CSS `@keyframes` gradient animation on a fixed background layer, blended with `mix-blend-mode`

### Animation Architecture
- **Loading screen**: Canvas-based or CSS particle animation assembles "SYNTHEX" letterforms, then dissolves into the main layout
- **Page transitions**: Framer Motion `AnimatePresence` for route transitions
- **Scroll reveals**: Intersection Observer triggers entrance animations on masonry cards
- **Magnetic cards**: `mousemove` event listener calculates cursor offset, applies CSS transform with spring physics
- **Modal bloom**: Framer Motion `layoutId` shared layout animation — card expands into modal using the same element
- **Aurora pulse on copy**: Brief saturation/brightness keyframe on the background layer triggered by copy event

### Pages & Routing
- `/` — Portfolio (masonry grid, all posts)
- `/library` — Prompts Library (dual view toggle)
- `/blog` — Blog post list
- `/blog/[slug]` — Individual blog post
- `/about` — About page
- `/links` — Links page
- `/admin` — Protected admin interface

### Navigation
- Top bar: logo (left) + menu button (right), fixed, transparent with subtle blur
- Full-screen overlay: triggered by menu button, displays 5 nav links in large Clash Display type with staggered entrance animations

### Open Graph
- `generateMetadata` in each page's layout for static pages
- Dynamic OG for individual posts: Next.js `ImageResponse` generates a custom OG card with the post's image, title, and prompt excerpt
- Facebook-optimized: 1200×630 OG image dimensions

### Analytics
- Vercel Analytics installed via `@vercel/analytics` package — single `<Analytics />` component in root layout

### Modules Summary
| Module | Responsibility |
|---|---|
| Aurora Background | Animated shifting gradient, always-on background layer |
| Loading Screen | Particle assembly of SYNTHEX wordmark, one-time on first visit |
| Navigation | Top bar + full-screen overlay with Framer Motion animations |
| Masonry Grid | Responsive grid with scroll-triggered card entrance animations |
| Image Card | Glassmorphism card, hover prompt teaser, magnetic cursor tilt |
| Image Modal | Full metadata display, copy button, related images, bloom animation |
| Prompts Library | Dual view toggle, search, tag filter |
| Blog List | Paginated post feed with thumbnail, title, tags, date |
| Blog Post | Markdown rendered post page |
| About Page | Scrolling narrative layout |
| Links Page | Brand link cards for Facebook, Redbubble, PromptBase |
| Admin UI | Drag-and-drop upload form + metadata fields + publish |
| R2 Integration | API route handling multipart upload to Cloudflare R2 |
| Data Layer | posts.json / blog.json read/write with schema validation |
| Auth | NextAuth GitHub provider, /admin route guard |
| Open Graph | Dynamic OG metadata + ImageResponse per post |
| Analytics | Vercel Analytics wrapper component |

---

## Testing Decisions

### What makes a good test
Tests should verify **external behavior and data contracts**, not implementation details. A good test checks: given this input, does the system produce this output or this side effect? Tests should not break when internal code is refactored, only when behavior changes.

### Modules to test

**Data Layer** (highest priority)
- Schema validation: rejects posts missing required fields, accepts valid posts
- JSON read: returns correctly typed post objects
- JSON write: new post appears in subsequent reads, existing posts are not mutated
- Slug/ID uniqueness: duplicate IDs are rejected

**R2 Integration API Route**
- Returns a valid CDN URL on successful upload
- Returns 400 on missing file
- Returns 401 on unauthenticated request
- Handles large files (>1MB) without timeout

**Admin Publish API Route**
- Valid payload: posts.json is updated and Vercel webhook is triggered
- Invalid payload: returns 400 with validation errors
- Unauthenticated request: returns 401

**Auth (NextAuth Guard)**
- Authenticated user with correct GitHub username can access /admin
- Unauthenticated user is redirected to login
- Authenticated user with wrong GitHub username is denied

**Open Graph Metadata**
- Portfolio index page returns correct OG title and description
- Individual post page returns OG image URL pointing to the post's image
- OG image dimensions are 1200×630

**Prompts Library — Search & Filter**
- Keyword search returns only posts whose prompt contains the keyword
- Tag filter returns only posts with the specified tag
- Combined search + filter returns intersection of both

---

## Out of Scope

- Light mode / theme toggle
- User accounts or public commenting
- Email newsletter or subscription
- E-commerce / direct sales (handled by Redbubble and PromptBase)
- Multi-user admin or content collaboration
- Video content
- Internationalization / multiple languages
- Native mobile app
- A dedicated "Prompt Packs" section (future consideration)
- Blog editor in admin UI (blog posts added directly to blog.json for now)
- Prompt Library entries without a corresponding portfolio image (dual-view toggle operates on posts.json data only)

---

## Further Notes

- The Cloudflare R2 bucket should be configured with a public CDN URL so images are served directly without signed URLs
- Vercel deploy webhooks should be set up at project creation so admin publishes trigger redeployment automatically
- The `next/image` component requires R2's CDN domain to be added to `next.config.js` `remotePatterns`
- Clash Display and Satoshi are loaded via Fontshare CDN (`@import` in CSS) — verify no CORS issues at build time
- The particle assembly loading screen should only play on first visit (sessionStorage flag) to avoid annoying repeat visitors
- All animations should respect `prefers-reduced-motion` media query — provide static fallbacks
- Open Graph Facebook share previews should be tested with the Facebook Sharing Debugger tool after launch
- The logo file (existing asset) should be converted to SVG if not already, for use in the particle assembly animation
