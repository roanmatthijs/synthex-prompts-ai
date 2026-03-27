# Synthex Prompts AI — Plan 3: Content Pages

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Blog (list + individual post pages), About page, and Links page. These are standalone content pages — no dependency on Plan 2's gallery components.

**Architecture:** Blog posts stored in `blog.json` with `body` as markdown string. Individual post pages use `react-markdown` for rendering. Blog list and individual posts are Server Components with `generateStaticParams` for static generation. About and Links pages are simple Server Components. All pages use the existing design system (`.glass`, CSS vars, Clash Display / Satoshi fonts).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, react-markdown, Vitest v4

**Branch:** `plan-3-content-pages` — create this branch before starting, do NOT merge to master.

---

## Tailwind v4 + Stack Gotchas

- **No `tailwind.config.ts`** — Tailwind v4 uses CSS-based config. Add any new CSS as custom properties in `:root {}` in `app/globals.css`. Do NOT touch `@theme {}` (already defined) or the aurora/glass/reset sections.
- **`.glass` class** is defined in `app/globals.css` — use it for cards and containers.
- **Font classes** — use inline `style={{ fontFamily: "'Clash Display', sans-serif" }}` or `style={{ fontFamily: "'Satoshi', sans-serif" }}` since Tailwind v4 utility classes for custom fonts may not generate. Or use the CSS custom properties approach.
- **react-markdown** — install with `npm install react-markdown`. Use the default export: `import ReactMarkdown from 'react-markdown'`

---

## File Map

```
E:/Claude/Synthex-Website/
├── blog.json                                  — Blog post data (5 sample posts with markdown body)
├── lib/
│   └── blog.ts                                — Typed read helpers for blog.json
├── app/
│   ├── blog/
│   │   ├── page.tsx                           — Blog list: thumbnail, title, date, tags, tag filter
│   │   └── [slug]/
│   │       └── page.tsx                       — Individual post: markdown rendered
│   ├── about/
│   │   └── page.tsx                           — About page: scrolling narrative
│   └── links/
│       └── page.tsx                           — Links page: Facebook, Redbubble, PromptBase cards
└── tests/
    └── blog-data-layer.test.ts                — Schema validation, slug uniqueness, getPostBySlug
```

---

## Task 1: Create branch

- [ ] **Step 1: Create and switch to branch**

```bash
cd "E:/Claude/Synthex-Website"
git checkout -b plan-3-content-pages
```

---

## Task 2: Blog data layer — blog.json + lib/blog.ts

**Files:**
- Create: `blog.json`
- Create: `lib/blog.ts`
- Create: `tests/blog-data-layer.test.ts`

### Blog post schema

```typescript
interface BlogPost {
  id: string           // kebab-case slug, unique, used as URL segment
  title: string
  excerpt: string      // 1-2 sentence summary for list view
  body: string         // full post content as markdown string
  tags: string[]       // e.g. ["tutorial", "prompt breakdown", "midjourney"]
  date: string         // ISO date string
  thumbnailUrl: string // image URL (picsum.photos for dev)
}
```

- [ ] **Step 1: Write the failing test first (TDD)**

```typescript
// tests/blog-data-layer.test.ts
import { describe, it, expect } from 'vitest'
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog'

describe('blog data layer', () => {
  it('returns an array of blog posts', () => {
    const posts = getAllBlogPosts()
    expect(Array.isArray(posts)).toBe(true)
    expect(posts.length).toBeGreaterThan(0)
  })

  it('each post has required fields', () => {
    const posts = getAllBlogPosts()
    posts.forEach(post => {
      expect(post.id).toBeTruthy()
      expect(post.title).toBeTruthy()
      expect(post.excerpt).toBeTruthy()
      expect(post.body).toBeTruthy()
      expect(Array.isArray(post.tags)).toBe(true)
      expect(post.date).toBeTruthy()
      expect(post.thumbnailUrl).toBeTruthy()
    })
  })

  it('all post IDs are unique', () => {
    const posts = getAllBlogPosts()
    const ids = posts.map(p => p.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('getBlogPostBySlug returns the correct post', () => {
    const posts = getAllBlogPosts()
    const first = posts[0]
    const found = getBlogPostBySlug(first.id)
    expect(found).toBeDefined()
    expect(found!.id).toBe(first.id)
  })

  it('getBlogPostBySlug returns undefined for unknown slug', () => {
    expect(getBlogPostBySlug('nonexistent-slug')).toBeUndefined()
  })

  it('posts are sorted newest first', () => {
    const posts = getAllBlogPosts()
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date) >= new Date(posts[i].date)).toBe(true)
    }
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test tests/blog-data-layer.test.ts
```

Expected: `FAIL` — `Cannot find module '@/lib/blog'`

- [ ] **Step 3: Create blog.json with 5 sample posts**

Use `picsum.photos` for thumbnail URLs. Bodies should be realistic markdown — a mix of a tutorial post and prompt breakdown posts. Keep bodies reasonably detailed but not excessively long (3-6 paragraphs).

```json
[
  {
    "id": "how-to-prompt-cinematic-portraits",
    "title": "How to Prompt Cinematic Portraits in Midjourney v6",
    "excerpt": "A step-by-step guide to crafting portrait prompts that consistently produce cinematic, high-impact results in Midjourney v6.1.",
    "body": "# How to Prompt Cinematic Portraits in Midjourney v6\n\nGetting cinematic portraits from Midjourney consistently is one of those skills that seems mysterious at first, but once you understand the underlying prompt architecture, you can reproduce it reliably every time.\n\n## The Core Formula\n\nEvery cinematic portrait prompt I use follows this structure:\n\n```\n[subject description] + [lighting type] + [aesthetic/style reference] + [technical camera language] + [mood/atmosphere]\n```\n\nLet's break that down with a real example:\n\n**Subject:** `portrait of a middle-aged woman, weathered face, silver hair`  \n**Lighting:** `dramatic Rembrandt lighting, deep shadows`  \n**Style:** `hyperrealistic, photographic`  \n**Camera:** `85mm f/1.4 lens, shallow depth of field, bokeh`  \n**Mood:** `pensive, solitary, cinematic`\n\n## Why Lighting is Everything\n\nOf all the elements in the formula, lighting makes the biggest single difference. Here are the three lighting types I use most:\n\n- **Rembrandt lighting** — creates that classic triangle of light on the shadowed cheek, immediately adds gravitas\n- **Rim lighting** — a bright edge separating the subject from the background, great for silhouette drama\n- **Golden hour** — warm, soft, directional, almost universally flattering\n\n## The `--style raw` Parameter\n\nFor portraits, I almost always add `--style raw`. The default Midjourney style tends to over-smooth skin and make faces look like they were treated with a beauty filter. `--style raw` gives you textures that actually look like skin.\n\n## Sample Prompt\n\n```\nportrait of a young astronaut, intense gaze, glass helmet reflecting nebulae, rim lighting, cinematic sci-fi, 85mm lens, hyperrealistic photography, dramatic composition --ar 2:3 --v 6.1 --style raw --chaos 5\n```\n\nTry this prompt and iterate from there. Change the subject, swap the lighting type, and adjust `--chaos` between 5 and 25 to see the variation range.\n",
    "tags": ["tutorial", "portrait", "midjourney v6"],
    "date": "2025-12-01",
    "thumbnailUrl": "https://picsum.photos/seed/blog-portrait/800/450"
  },
  {
    "id": "neon-deity-breakdown",
    "title": "Prompt Breakdown: Neon Deity Portrait",
    "excerpt": "Deconstructing every element of the Neon Deity prompt — from the biopunk concept to the final parameter choices that locked in the result.",
    "body": "# Prompt Breakdown: Neon Deity Portrait\n\nThis post deconstructs the prompt behind one of my most-shared images: the Neon Deity Portrait. I'll walk through each element and explain why it's there.\n\n## The Final Prompt\n\n```\nportrait of a cyberpunk deity surrounded by glowing neon circuitry, biopunk aesthetic, ultra-detailed skin texture, dramatic volumetric lighting, floating holographic runes, deep space background --ar 3:4 --v 6.1 --style raw --chaos 15\n```\n\n## Breaking It Down\n\n**`portrait of a cyberpunk deity`** — Setting up the core subject. \"deity\" signals Midjourney to add grandeur and scale to the face. \"cyberpunk\" establishes the genre aesthetic immediately.\n\n**`surrounded by glowing neon circuitry`** — This gives Midjourney a specific environmental element to work with. \"Glowing\" emphasizes light sources, which improves the lighting quality of the overall image.\n\n**`biopunk aesthetic`** — Biopunk is a sub-genre of cyberpunk that blends organic life with technology — think circuits that look like veins, chrome that bleeds. Adding this word pulls the image away from generic cyberpunk into something more distinctive.\n\n**`ultra-detailed skin texture`** — Counteracting Midjourney's tendency to over-smooth faces. Combined with `--style raw`, this pushes the skin into believably photorealistic territory.\n\n**`dramatic volumetric lighting`** — Volumetric light creates visible beams and atmosphere. \"Dramatic\" amplifies the contrast between light and shadow.\n\n**`floating holographic runes`** — A concrete, visual detail that Midjourney can actually place in the scene, adding depth and story.\n\n**`deep space background`** — Keeps the background dark and clean, letting the subject dominate, while adding cosmic scale.\n\n## Parameter Choices\n\n- **`--ar 3:4`** — Portrait orientation for a portrait subject. Simple.\n- **`--style raw`** — Avoids the beauty-filter smoothing on the face.\n- **`--chaos 15`** — Enough variation to get interesting results across 4 generations, but not so high that the prompt loses coherence.\n",
    "tags": ["prompt breakdown", "portrait", "cyberpunk"],
    "date": "2025-11-22",
    "thumbnailUrl": "https://picsum.photos/seed/blog-neon/800/450"
  },
  {
    "id": "mastering-chaos-parameter",
    "title": "Mastering the --chaos Parameter",
    "excerpt": "A practical guide to using --chaos values from 0 to 100, with real examples showing exactly how it affects output at each level.",
    "body": "# Mastering the --chaos Parameter\n\n`--chaos` is one of the most misunderstood parameters in Midjourney. Most people either ignore it (defaulting to 0) or crank it to 100 expecting magic. Here's what it actually does and how to use it intentionally.\n\n## What --chaos Does\n\n`--chaos` controls the variety between the 4 images in a generation. At `--chaos 0`, all 4 images are close interpretations of the same prompt. At `--chaos 100`, you get 4 completely different takes on the prompt — sometimes wildly divergent.\n\nThis is not randomness within a single image. It's variation *between* images in the same generation.\n\n## The Practical Scale\n\n**`--chaos 0–5`** — Use when you've found a prompt that works perfectly and you want tight consistency. Great for creating series of images that feel like they belong together.\n\n**`--chaos 10–20`** — My default for exploration. Gives you meaningful variation without losing coherence. You'll still recognise all 4 images as responses to the same prompt.\n\n**`--chaos 25–50`** — Use when you're not sure which direction to take a concept. You're asking Midjourney to surprise you with interpretations.\n\n**`--chaos 50–100`** — Rarely useful for production work. Great for breaking out of creative ruts or discovering unexpected aesthetic directions you wouldn't have thought to prompt directly.\n\n## Practical Workflow\n\n1. Start with `--chaos 20` to find the most promising direction\n2. Once you have a direction you like, drop to `--chaos 5` and iterate\n3. When a single image looks right, use Vary (Subtle) or Vary (Strong) instead of chaos\n\n## One Rule\n\nHigh chaos requires more specific prompts. At `--chaos 0`, vague prompts still produce coherent results. At `--chaos 50+`, a vague prompt produces chaos that isn't useful. The more chaos, the more specific your subject and style descriptors need to be.\n",
    "tags": ["tutorial", "parameters", "midjourney"],
    "date": "2025-11-10",
    "thumbnailUrl": "https://picsum.photos/seed/blog-chaos/800/450"
  },
  {
    "id": "aurora-cityscape-breakdown",
    "title": "Prompt Breakdown: Aurora Cityscape",
    "excerpt": "How I built the Aurora Cityscape prompt from scratch — the specific words that triggered the lighting response I was looking for.",
    "body": "# Prompt Breakdown: Aurora Cityscape\n\n## The Final Prompt\n\n```\nfuturistic megacity skyline under aurora borealis, glass and steel towers reflecting multicolored northern lights, photorealistic, epic wide angle, golden hour atmospheric haze --ar 3:2 --v 6.1 --chaos 10\n```\n\n## The Concept\n\nI wanted an image that combined two visually powerful elements: the scale and density of a sci-fi megacity, and the ethereal quality of the northern lights. The challenge with combining two strong visual concepts is that Midjourney sometimes leans too hard into one and ignores the other.\n\n## How Each Element Contributes\n\n**`futuristic megacity skyline`** — \"Megacity\" is more specific than \"city\" — it implies scale, density, and near-future technology. Midjourney responds to it by adding more architectural detail and height.\n\n**`under aurora borealis`** — Placing the aurora *above* the city (implied by \"under\") ensures Midjourney puts it in the sky where it belongs, rather than treating it as a surface texture.\n\n**`glass and steel towers reflecting multicolored northern lights`** — This is the detail that made the image. Asking for reflections forces Midjourney to put the aurora colors onto the buildings, creating that satisfying visual connection between the two elements.\n\n**`photorealistic`** — Without this, Midjourney often goes toward illustrated or painterly styles for fantasy/sci-fi scenes. I wanted something that felt like a photograph.\n\n**`epic wide angle`** — Signals that the entire skyline should be in frame, not a close crop of one building.\n\n**`golden hour atmospheric haze`** — This is a subtle inclusion. Golden hour naturally warms the lower portions of the image, which contrasts beautifully with the cool aurora colors in the sky. The haze adds depth to the cityscape.\n\n## Why No `--style raw`?\n\nFor landscapes and architecture, the default Midjourney aesthetic often enhances the image rather than diminishing it. The slight stylization makes the clouds and atmosphere look more dramatic. I only use `--style raw` when skin texture matters — portraits and figurative work.\n",
    "tags": ["prompt breakdown", "landscape", "architecture"],
    "date": "2025-10-30",
    "thumbnailUrl": "https://picsum.photos/seed/blog-aurora/800/450"
  },
  {
    "id": "aspect-ratios-complete-guide",
    "title": "The Complete Guide to Aspect Ratios in Midjourney",
    "excerpt": "Every aspect ratio I use, when I use it, and how the choice of ratio changes what Midjourney generates.",
    "body": "# The Complete Guide to Aspect Ratios in Midjourney\n\nAspect ratio is the first parameter decision I make for every prompt. It's not just about how the image looks — the ratio you choose actively changes what Midjourney generates.\n\n## Why Ratio Affects Content, Not Just Shape\n\nWhen you specify `--ar 2:3` (portrait), Midjourney optimizes the composition for a tall, narrow frame. A portrait subject naturally fits. A wide cityscape doesn't. So Midjourney leans toward subjects that fit the frame.\n\nThis is a creative tool, not just a formatting choice.\n\n## My Go-To Ratios\n\n**`--ar 1:1` (Square)**  \nUse for: product-like shots, faces and busts, minimalist compositions, anything that will be displayed in a grid.  \nAvoid for: landscapes, cinematic scenes.\n\n**`--ar 3:4` or `--ar 2:3` (Portrait)**  \nUse for: full portraits, figures, fashion, architectural interiors with height.  \nAvoid for: scenes where horizontal breadth matters.\n\n**`--ar 3:2` (Landscape)**  \nUse for: general landscapes, outdoor scenes, most horizontal compositions.  \nThe most cinematically neutral ratio — close to 35mm film.\n\n**`--ar 16:9` (Widescreen)**  \nUse for: cinematic sci-fi, space scenes, panoramic landscapes.  \nMidjourney naturally generates more cinematic compositions at this ratio.\n\n**`--ar 2:1` or wider**  \nUse for: epic panoramas, diptych-style compositions, anything that will be used as a banner or header.  \nBe careful — very wide ratios can make subjects look small. Use when the environment is the subject.\n\n## Matching Ratio to Platform\n\n- **Facebook post**: `--ar 4:5` or `--ar 1:1` (both perform well in feed)\n- **Facebook cover**: `--ar 16:9`\n- **Redbubble print**: `--ar 2:3` or `--ar 3:2` (standard print sizes)\n- **PromptBase thumbnail**: `--ar 1:1`\n\n## One Rule\n\nAlways decide the ratio before you finalize the prompt. The ratio changes the composition, and the composition changes which prompt elements matter. A prompt optimized for `--ar 1:1` will produce a different result at `--ar 16:9` — not just a different shape, but a different image.\n",
    "tags": ["tutorial", "parameters", "midjourney"],
    "date": "2025-10-15",
    "thumbnailUrl": "https://picsum.photos/seed/blog-ratios/800/450"
  }
]
```

- [ ] **Step 4: Create lib/blog.ts**

```typescript
// lib/blog.ts
import blogData from '@/blog.json'

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  body: string
  tags: string[]
  date: string
  thumbnailUrl: string
}

export function getAllBlogPosts(): BlogPost[] {
  return [...(blogData as BlogPost[])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return (blogData as BlogPost[]).find(p => p.id === slug)
}

export function getBlogTags(): string[] {
  const tagSet = new Set<string>()
  ;(blogData as BlogPost[]).forEach(p => p.tags.forEach(t => tagSet.add(t)))
  return Array.from(tagSet).sort()
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npm test tests/blog-data-layer.test.ts
```

Expected: `PASS` — 6 tests pass

- [ ] **Step 6: Commit**

```bash
git add blog.json lib/blog.ts tests/blog-data-layer.test.ts
git commit -m "feat: add blog.json data layer with typed read helpers"
```

---

## Task 3: Install react-markdown

- [ ] **Step 1: Install dependency**

```bash
npm install react-markdown
```

- [ ] **Step 2: Commit package.json and lock file**

```bash
git add package.json package-lock.json
git commit -m "deps: add react-markdown for blog post rendering"
```

---

## Task 4: Blog list page — app/blog/page.tsx

**Files:**
- Create: `app/blog/page.tsx`

This is a Server Component. Tag filtering is client-side — extract the filter UI into a separate client component.

- [ ] **Step 1: Create app/blog/page.tsx**

First create the filter component:

```tsx
// app/blog/BlogTagFilter.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { BlogPost } from '@/lib/blog'

interface Props {
  posts: BlogPost[]
  tags: string[]
}

export function BlogTagFilter({ posts, tags }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = activeTag
    ? posts.filter(p => p.tags.includes(activeTag))
    : posts

  return (
    <>
      {/* Tag filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActiveTag(null)}
          className="px-3 py-1.5 rounded-full text-xs font-satoshi transition-colors duration-200"
          style={{
            background: activeTag === null ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.05)',
            color: activeTag === null ? 'rgba(167,139,250,1)' : 'rgba(255,255,255,0.5)',
            border: `1px solid ${activeTag === null ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.1)'}`,
          }}
        >
          All
        </button>
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className="px-3 py-1.5 rounded-full text-xs font-satoshi capitalize transition-colors duration-200"
            style={{
              background: activeTag === tag ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.05)',
              color: activeTag === tag ? 'rgba(167,139,250,1)' : 'rgba(255,255,255,0.5)',
              border: `1px solid ${activeTag === tag ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.1)'}`,
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Post grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(post => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className="glass overflow-hidden group block"
          >
            {/* Thumbnail */}
            <div className="relative w-full aspect-video overflow-hidden">
              <Image
                src={post.thumbnailUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full font-satoshi capitalize"
                    style={{ background: 'rgba(124,58,237,0.2)', color: 'rgba(167,139,250,0.9)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h2
                className="font-clash text-xl font-semibold text-white/90 mb-2 leading-snug group-hover:text-white transition-colors"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {post.title}
              </h2>

              <p className="font-satoshi text-sm text-white/55 leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>

              <p className="font-satoshi text-xs text-white/30 mt-4">
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="font-satoshi text-white/30">No posts in this category.</p>
        </div>
      )}
    </>
  )
}
```

Now create the page:

```tsx
// app/blog/page.tsx
import { getAllBlogPosts, getBlogTags } from '@/lib/blog'
import { BlogTagFilter } from './BlogTagFilter'

export const metadata = {
  title: 'Blog',
  description: 'Midjourney tutorials, prompt breakdowns, and AI art insights from Synthex Prompts AI.',
}

export default function BlogPage() {
  const posts = getAllBlogPosts()
  const tags = getBlogTags()

  return (
    <section className="pt-8 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="mb-10 text-center">
        <h1
          className="text-5xl md:text-6xl font-bold tracking-tight text-white/90 mb-3"
          style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: '-0.02em' }}
        >
          Blog
        </h1>
        <p className="font-satoshi text-white/50 max-w-lg mx-auto">
          Prompt breakdowns, tutorials, and behind-the-scenes on every image.
        </p>
      </div>

      <BlogTagFilter posts={posts} tags={tags} />
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/blog/
git commit -m "feat: add blog list page with thumbnail grid and tag filter"
```

---

## Task 5: Individual blog post page

**Files:**
- Create: `app/blog/[slug]/page.tsx`

This is a Server Component that uses `generateStaticParams` to pre-render all blog posts at build time.

- [ ] **Step 1: Create app/blog/[slug]/page.tsx**

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog'

export function generateStaticParams() {
  return getAllBlogPosts().map(post => ({ slug: post.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.thumbnailUrl, width: 800, height: 450 }],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) notFound()

  return (
    <article className="pt-8 pb-16 px-4 md:px-8 max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 font-satoshi text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Blog
      </Link>

      {/* Hero image */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8">
        <Image
          src={post.thumbnailUrl}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover"
          priority
        />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map(tag => (
          <span
            key={tag}
            className="text-xs px-3 py-1 rounded-full font-satoshi capitalize"
            style={{ background: 'rgba(124,58,237,0.2)', color: 'rgba(167,139,250,0.9)', border: '1px solid rgba(124,58,237,0.3)' }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1
        className="text-3xl md:text-5xl font-bold text-white/95 mb-3 leading-tight"
        style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: '-0.02em' }}
      >
        {post.title}
      </h1>

      {/* Date */}
      <p className="font-satoshi text-sm text-white/35 mb-10">
        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      {/* Body — markdown rendered */}
      <div className="prose-synthex">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="font-clash text-3xl font-bold text-white/90 mt-8 mb-4" style={{ fontFamily: "'Clash Display', sans-serif" }}>{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="font-clash text-2xl font-semibold text-white/85 mt-8 mb-3" style={{ fontFamily: "'Clash Display', sans-serif" }}>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="font-clash text-xl font-medium text-white/80 mt-6 mb-2" style={{ fontFamily: "'Clash Display', sans-serif" }}>{children}</h3>
            ),
            p: ({ children }) => (
              <p className="font-satoshi text-base text-white/70 leading-relaxed mb-4">{children}</p>
            ),
            code: ({ children, className }) => {
              const isBlock = className?.includes('language-')
              if (isBlock) {
                return (
                  <code className="block font-mono text-sm text-cyan-300/80 p-4 rounded-xl my-4 overflow-x-auto" style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)' }}>
                    {children}
                  </code>
                )
              }
              return (
                <code className="font-mono text-sm text-cyan-300/80 px-2 py-0.5 rounded" style={{ background: 'rgba(6,182,212,0.1)' }}>
                  {children}
                </code>
              )
            },
            pre: ({ children }) => <>{children}</>,
            ul: ({ children }) => (
              <ul className="font-satoshi text-white/70 ml-5 mb-4 space-y-1.5 list-disc">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="font-satoshi text-white/70 ml-5 mb-4 space-y-1.5 list-decimal">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
            strong: ({ children }) => (
              <strong className="text-white/90 font-semibold">{children}</strong>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 pl-4 my-4 italic text-white/50" style={{ borderColor: 'var(--accent)' }}>{children}</blockquote>
            ),
          }}
        >
          {post.body}
        </ReactMarkdown>
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/blog/
git commit -m "feat: add individual blog post page with markdown rendering"
```

---

## Task 6: About page

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Create app/about/page.tsx**

```tsx
// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'The story behind Synthex Prompts AI — who I am, how I got here, and why I share every prompt.',
}

export default function AboutPage() {
  return (
    <section className="pt-8 pb-20 px-4 md:px-8 max-w-2xl mx-auto">
      <div className="mb-12">
        <h1
          className="text-5xl md:text-6xl font-bold text-white/90 mb-4"
          style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: '-0.02em' }}
        >
          About
        </h1>
        <div className="h-px w-16" style={{ background: 'var(--accent)' }} />
      </div>

      <div className="space-y-8 font-satoshi text-base text-white/70 leading-relaxed">
        <p>
          I started generating AI images the way most people do — by accident. I typed something into Midjourney expecting something mediocre, and something extraordinary came back. That was it.
        </p>

        <p>
          <strong className="text-white/90 font-semibold">Synthex Prompts AI</strong> grew out of a simple frustration: every time I made something worth keeping, I'd lose the prompt. I'd try to recreate it and fail. So I started treating prompts like code — version-controlled, annotated, reproducible.
        </p>

        <p>
          This site is that practice made public. Every image here comes with the full prompt and parameters — exactly what I typed, exactly what I used. Nothing withheld. Because I believe sharing the recipe makes the food better for everyone.
        </p>

        <div className="glass p-6 my-10">
          <p className="text-white/85 text-lg leading-snug" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            "The prompt is the art. The image is just proof that it worked."
          </p>
        </div>

        <p>
          I sell prints on <strong className="text-white/90 font-semibold">Redbubble</strong> and premium prompt packs on <strong className="text-white/90 font-semibold">PromptBase</strong>. The Facebook page is where I post new work first. This site is where the archive lives.
        </p>

        <p>
          If you've used one of my prompts to make something, I'd genuinely love to see it. Find me on Facebook and share.
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/about/
git commit -m "feat: add About page"
```

---

## Task 7: Links page

**Files:**
- Create: `app/links/page.tsx`

- [ ] **Step 1: Create app/links/page.tsx**

```tsx
// app/links/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Links',
  description: 'Find Synthex Prompts AI on Facebook, shop prints on Redbubble, and buy premium prompt packs on PromptBase.',
}

const LINKS = [
  {
    label: 'Facebook',
    sublabel: 'Follow for daily new images and prompts',
    href: 'https://www.facebook.com/SynthexPromptsAI',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    accentColor: 'rgba(59,89,152,1)',
    accentBg: 'rgba(59,89,152,0.15)',
    accentBorder: 'rgba(59,89,152,0.35)',
  },
  {
    label: 'Redbubble',
    sublabel: 'Shop prints, posters, and merchandise',
    href: 'https://www.redbubble.com',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" fill="var(--bg-deep)" />
      </svg>
    ),
    accentColor: 'rgba(230,0,35,1)',
    accentBg: 'rgba(230,0,35,0.12)',
    accentBorder: 'rgba(230,0,35,0.3)',
  },
  {
    label: 'PromptBase',
    sublabel: 'Buy premium Midjourney prompt packs',
    href: 'https://promptbase.com',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    accentColor: 'rgba(124,58,237,1)',
    accentBg: 'rgba(124,58,237,0.15)',
    accentBorder: 'rgba(124,58,237,0.35)',
  },
]

export default function LinksPage() {
  return (
    <section className="pt-8 pb-20 px-4 md:px-8 max-w-xl mx-auto">
      <div className="mb-12 text-center">
        <h1
          className="text-5xl md:text-6xl font-bold text-white/90 mb-3"
          style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: '-0.02em' }}
        >
          Links
        </h1>
        <p className="font-satoshi text-white/50">Find Synthex Prompts AI everywhere.</p>
      </div>

      <div className="flex flex-col gap-4">
        {LINKS.map(link => (
          <Link
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="glass flex items-center gap-5 px-6 py-5 transition-all duration-200 group"
            style={{
              '--link-accent': link.accentColor,
              '--link-bg': link.accentBg,
              '--link-border': link.accentBorder,
            } as React.CSSProperties}
          >
            <div
              className="shrink-0 p-3 rounded-xl transition-colors duration-200"
              style={{
                background: link.accentBg,
                color: link.accentColor,
                border: `1px solid ${link.accentBorder}`,
              }}
            >
              {link.icon}
            </div>

            <div className="flex-1 min-w-0">
              <p
                className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {link.label}
              </p>
              <p className="font-satoshi text-sm text-white/45 mt-0.5">{link.sublabel}</p>
            </div>

            <svg
              className="shrink-0 text-white/25 group-hover:text-white/60 transition-colors"
              width="20" height="20" viewBox="0 0 20 20" fill="currentColor"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/links/
git commit -m "feat: add Links page with Facebook, Redbubble, PromptBase cards"
```

---

## Task 8: Build check + push branch

- [ ] **Step 1: Run TypeScript check**

```bash
npx tsc --noEmit
```

Fix any TypeScript errors before proceeding.

- [ ] **Step 2: Run full test suite**

```bash
npm test
```

Expected: all existing tests + 6 new blog data layer tests pass.

- [ ] **Step 3: Check next.config.ts for picsum.photos domain**

Ensure `next.config.ts` includes `picsum.photos` in `remotePatterns`. If not, add it:

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 4: Run build**

```bash
npm run build
```

Fix any build errors.

- [ ] **Step 5: Push branch to GitHub**

```bash
git push -u origin plan-3-content-pages
```

---

## Plan 3 Complete

Content pages are live on branch `plan-3-content-pages`. Delivers:
- `blog.json` data layer with typed helpers (sorted newest-first)
- Blog list page with thumbnail grid and client-side tag filter
- Individual blog post pages with markdown rendering (Clash Display + Satoshi styled)
- About page with personal narrative
- Links page with branded cards for Facebook, Redbubble, PromptBase
- 6 new passing tests (blog data layer)
