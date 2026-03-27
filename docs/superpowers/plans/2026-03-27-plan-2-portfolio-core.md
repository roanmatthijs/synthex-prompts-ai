# Synthex Prompts AI — Plan 2: Portfolio Core

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the portfolio homepage (masonry grid + image cards + modal) and the `/library` Prompts Library page (dual-view toggle, keyword search, tag filter). Replace the placeholder `app/page.tsx` with the real gallery.

**Architecture:** Static data layer (`posts.json` + `lib/posts.ts`). No backend needed — data is read at build time. Gallery uses CSS columns for masonry layout with Framer Motion scroll-reveal. Modal uses Framer Motion `layoutId` for the bloom/expand transition. Prompts Library is the same data in a different view mode, client-side filtered with React state.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Framer Motion v12, Vitest v4

**Branch:** `plan-2-portfolio-core` — create this branch before starting, do NOT merge to master.

---

## Tailwind v4 + Framer Motion v12 Gotchas

- **No `tailwind.config.ts`** — Tailwind v4 uses CSS-based config. Add any new theme values as CSS custom properties in `app/globals.css` inside the `:root {}` block or `@theme {}` block.
- **Ease arrays** in Framer Motion need a type assertion: `[0.22, 1, 0.36, 1] as [number, number, number, number]`
- **Stagger direction**: `staggerDirection: -1 as const`
- **Never add `initial/animate/exit` to nested `motion.*`** when parent uses named variants — it breaks stagger propagation. Only put those on the outermost motion element; nested elements use `variants` only.
- **`layoutId`** for bloom animation: give both the card thumbnail and the modal image the same `layoutId` value.

---

## File Map

```
E:/Claude/Synthex-Website/
├── posts.json                                 — Sample portfolio data (10 posts)
├── lib/
│   └── posts.ts                               — Typed read helper for posts.json
├── components/gallery/
│   ├── MasonryGrid.tsx                        — CSS columns masonry, scroll-reveal with IntersectionObserver
│   ├── ImageCard.tsx                          — Glass card: image, hover prompt teaser, magnetic tilt
│   └── ImageModal.tsx                         — Full modal: image, prompt, parameters, copy, related, fb link
├── components/library/
│   └── LibraryView.tsx                        — Library mode: prompt cards with copy buttons, no large images
├── app/
│   ├── page.tsx                               — Replace placeholder with <MasonryGrid posts={posts} />
│   └── library/
│       └── page.tsx                           — Prompts Library: dual-view toggle + search + tag filter
└── tests/
    ├── posts-data-layer.test.ts               — Schema validation, uniqueness checks
    └── library-search-filter.test.tsx         — Keyword search, tag filter, combined
```

---

## Task 1: Create branch

- [ ] **Step 1: Create and switch to branch**

```bash
cd "E:/Claude/Synthex-Website"
git checkout -b plan-2-portfolio-core
```

---

## Task 2: Data layer — posts.json + lib/posts.ts

**Files:**
- Create: `posts.json`
- Create: `lib/posts.ts`
- Create: `tests/posts-data-layer.test.ts`

### Post schema

```typescript
interface Post {
  id: string           // kebab-case slug, unique
  title: string        // display title for the image
  imageUrl: string     // Cloudflare R2 URL (placeholder during dev: use picsum.photos)
  prompt: string       // full Midjourney prompt text
  model: string        // e.g. "Midjourney v6.1"
  parameters: string   // e.g. "--ar 3:2 --v 6.1 --style raw --chaos 20"
  tags: string[]       // e.g. ["portrait", "cyberpunk", "neon"]
  date: string         // ISO date string, e.g. "2025-11-15"
  facebookUrl: string  // URL to original Facebook post (can be "#" for samples)
}
```

- [ ] **Step 1: Write the failing test first (TDD)**

```typescript
// tests/posts-data-layer.test.ts
import { describe, it, expect } from 'vitest'
import { getAllPosts, getPostById } from '@/lib/posts'

describe('posts data layer', () => {
  it('returns an array of posts', () => {
    const posts = getAllPosts()
    expect(Array.isArray(posts)).toBe(true)
    expect(posts.length).toBeGreaterThan(0)
  })

  it('each post has required fields', () => {
    const posts = getAllPosts()
    posts.forEach(post => {
      expect(post.id).toBeTruthy()
      expect(post.title).toBeTruthy()
      expect(post.imageUrl).toBeTruthy()
      expect(post.prompt).toBeTruthy()
      expect(post.model).toBeTruthy()
      expect(post.parameters).toBeTruthy()
      expect(Array.isArray(post.tags)).toBe(true)
      expect(post.date).toBeTruthy()
      expect(post.facebookUrl).toBeTruthy()
    })
  })

  it('all post IDs are unique', () => {
    const posts = getAllPosts()
    const ids = posts.map(p => p.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('getPostById returns the correct post', () => {
    const posts = getAllPosts()
    const first = posts[0]
    const found = getPostById(first.id)
    expect(found).toBeDefined()
    expect(found!.id).toBe(first.id)
  })

  it('getPostById returns undefined for unknown id', () => {
    expect(getPostById('nonexistent-id')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test tests/posts-data-layer.test.ts
```

Expected: `FAIL` — `Cannot find module '@/lib/posts'`

- [ ] **Step 3: Create posts.json with 10 sample posts**

Use `picsum.photos` for image URLs during development (e.g. `"https://picsum.photos/seed/post1/800/600"`). Each post should have varied aspect ratios for the masonry layout to look interesting. Use realistic-sounding Midjourney prompts with `--ar`, `--v 6.1`, `--style`, `--chaos` parameters. Include at least these tags across posts so filters are testable: `portrait`, `landscape`, `cyberpunk`, `abstract`, `neon`, `nature`, `architecture`.

```json
[
  {
    "id": "neon-deity-portrait",
    "title": "Neon Deity Portrait",
    "imageUrl": "https://picsum.photos/seed/neon-deity/800/1100",
    "prompt": "portrait of a cyberpunk deity surrounded by glowing neon circuitry, biopunk aesthetic, ultra-detailed skin texture, dramatic volumetric lighting, floating holographic runes, deep space background",
    "model": "Midjourney v6.1",
    "parameters": "--ar 3:4 --v 6.1 --style raw --chaos 15",
    "tags": ["portrait", "cyberpunk", "neon"],
    "date": "2025-11-20",
    "facebookUrl": "#"
  },
  {
    "id": "aurora-cityscape",
    "title": "Aurora Cityscape",
    "imageUrl": "https://picsum.photos/seed/aurora-city/1200/800",
    "prompt": "futuristic megacity skyline under aurora borealis, glass and steel towers reflecting multicolored northern lights, photorealistic, epic wide angle, golden hour atmospheric haze",
    "model": "Midjourney v6.1",
    "parameters": "--ar 3:2 --v 6.1 --chaos 10",
    "tags": ["landscape", "architecture", "neon"],
    "date": "2025-11-18",
    "facebookUrl": "#"
  },
  {
    "id": "quantum-forest",
    "title": "Quantum Forest",
    "imageUrl": "https://picsum.photos/seed/quantum-forest/900/1200",
    "prompt": "ancient forest where trees grow from glowing quantum circuitry, bioluminescent moss, fractal branches dissolving into data streams, ethereal mist, god rays through digital canopy",
    "model": "Midjourney v6.1",
    "parameters": "--ar 3:4 --v 6.1 --style raw --chaos 25",
    "tags": ["nature", "abstract", "cyberpunk"],
    "date": "2025-11-15",
    "facebookUrl": "#"
  },
  {
    "id": "chrome-oracle",
    "title": "Chrome Oracle",
    "imageUrl": "https://picsum.photos/seed/chrome-oracle/800/800",
    "prompt": "chrome-plated oracle figure with fluid mercury skin, reflective surfaces showing parallel universes, minimalist composition, studio lighting, hyperrealistic",
    "model": "Midjourney v6.1",
    "parameters": "--ar 1:1 --v 6.1 --style raw",
    "tags": ["portrait", "abstract"],
    "date": "2025-11-12",
    "facebookUrl": "#"
  },
  {
    "id": "void-archipelago",
    "title": "Void Archipelago",
    "imageUrl": "https://picsum.photos/seed/void-arch/1400/700",
    "prompt": "floating island archipelago suspended in a violet void, waterfalls cascading into nothingness, crystal formations, ancient stone bridges, dramatic volumetric clouds, fantasy epic landscape",
    "model": "Midjourney v6.1",
    "parameters": "--ar 2:1 --v 6.1 --chaos 20",
    "tags": ["landscape", "abstract", "nature"],
    "date": "2025-11-10",
    "facebookUrl": "#"
  },
  {
    "id": "signal-bloom",
    "title": "Signal Bloom",
    "imageUrl": "https://picsum.photos/seed/signal-bloom/800/1050",
    "prompt": "macro photograph of a flower constructed from fiber optic cables and signal transmitters, data bursts as pollen, photorealistic macro lens, dark background, vivid saturated colors",
    "model": "Midjourney v6.1",
    "parameters": "--ar 4:5 --v 6.1 --style raw --chaos 5",
    "tags": ["nature", "abstract", "neon"],
    "date": "2025-11-08",
    "facebookUrl": "#"
  },
  {
    "id": "ghost-in-the-mesh",
    "title": "Ghost in the Mesh",
    "imageUrl": "https://picsum.photos/seed/ghost-mesh/800/1100",
    "prompt": "translucent human silhouette made of wireframe mesh dissolving into glowing particles, dark atmospheric background, cyberpunk dystopia, long exposure light trails, cinematic",
    "model": "Midjourney v6.1",
    "parameters": "--ar 3:4 --v 6.1 --chaos 30",
    "tags": ["portrait", "abstract", "cyberpunk"],
    "date": "2025-11-05",
    "facebookUrl": "#"
  },
  {
    "id": "cathedral-of-code",
    "title": "Cathedral of Code",
    "imageUrl": "https://picsum.photos/seed/cathedral-code/900/1300",
    "prompt": "gothic cathedral interior where stained glass windows display cascading code, pews made of server racks, digital monks in prayer, volumetric light through data streams, ultra-detailed architectural rendering",
    "model": "Midjourney v6.1",
    "parameters": "--ar 9:13 --v 6.1 --style raw",
    "tags": ["architecture", "cyberpunk", "abstract"],
    "date": "2025-11-01",
    "facebookUrl": "#"
  },
  {
    "id": "bioluminescent-deep",
    "title": "Bioluminescent Deep",
    "imageUrl": "https://picsum.photos/seed/bio-deep/1100/800",
    "prompt": "deep sea creature with bioluminescent patterns swimming through an alien ocean, vibrant blues and greens, photorealistic underwater photography, extreme detail, cosmic scale",
    "model": "Midjourney v6.1",
    "parameters": "--ar 11:8 --v 6.1 --chaos 15",
    "tags": ["nature", "abstract"],
    "date": "2025-10-28",
    "facebookUrl": "#"
  },
  {
    "id": "the-last-meridian",
    "title": "The Last Meridian",
    "imageUrl": "https://picsum.photos/seed/last-meridian/800/450",
    "prompt": "lone figure standing at the edge of a shattered planet, looking toward a binary star system, cinematic sci-fi, desolate beauty, dust and debris in atmosphere, epic scale, Terrence Malick aesthetic",
    "model": "Midjourney v6.1",
    "parameters": "--ar 16:9 --v 6.1 --style raw --chaos 12",
    "tags": ["landscape", "portrait"],
    "date": "2025-10-25",
    "facebookUrl": "#"
  }
]
```

- [ ] **Step 4: Create lib/posts.ts**

```typescript
// lib/posts.ts
import postsData from '@/posts.json'

export interface Post {
  id: string
  title: string
  imageUrl: string
  prompt: string
  model: string
  parameters: string
  tags: string[]
  date: string
  facebookUrl: string
}

export function getAllPosts(): Post[] {
  return postsData as Post[]
}

export function getPostById(id: string): Post | undefined {
  return (postsData as Post[]).find(p => p.id === id)
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  return (postsData as Post[])
    .filter(p => p.id !== post.id && p.tags.some(t => post.tags.includes(t)))
    .slice(0, limit)
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>()
  ;(postsData as Post[]).forEach(p => p.tags.forEach(t => tagSet.add(t)))
  return Array.from(tagSet).sort()
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npm test tests/posts-data-layer.test.ts
```

Expected: `PASS` — 5 tests pass

- [ ] **Step 6: Commit**

```bash
git add posts.json lib/posts.ts tests/posts-data-layer.test.ts
git commit -m "feat: add posts.json data layer with typed read helpers"
```

---

## Task 3: MasonryGrid + ImageCard components

**Files:**
- Create: `components/gallery/MasonryGrid.tsx`
- Create: `components/gallery/ImageCard.tsx`

The masonry layout uses CSS `columns` (not grid) for true masonry stacking. Cards animate in with IntersectionObserver (scroll-reveal). Each card has a subtle magnetic cursor tilt on hover.

**Note on `layoutId` for bloom animation:** Give the `<motion.div>` wrapping the card image a `layoutId={post.id}`. The modal will use the same `layoutId` so Framer Motion animates the transition.

- [ ] **Step 1: Create ImageCard.tsx**

```tsx
// components/gallery/ImageCard.tsx
'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Post } from '@/lib/posts'

interface Props {
  post: Post
  onOpen: (post: Post) => void
  index: number
}

export function ImageCard({ post, onOpen, index }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    setTilt({ x: dy * -6, y: dx * 6 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      className="glass mb-4 overflow-hidden cursor-pointer break-inside-avoid"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
      onClick={() => onOpen(post)}
    >
      {/* Image with layoutId for bloom transition */}
      <motion.div layoutId={`image-${post.id}`} className="relative w-full">
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={800}
          height={600}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="w-full h-auto block"
          style={{ display: 'block' }}
        />
      </motion.div>

      {/* Hover prompt teaser */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{
          background: 'linear-gradient(to top, rgba(5,5,16,0.92) 0%, rgba(5,5,16,0.4) 50%, transparent 100%)',
        }}
      >
        <p className="font-satoshi text-xs text-white/80 line-clamp-3 mb-1">
          {post.prompt}
        </p>
        <div className="flex flex-wrap gap-1 mt-1">
          {post.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full font-satoshi"
              style={{ background: 'rgba(124,58,237,0.4)', color: 'rgba(167,139,250,1)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Card footer always visible */}
      <div className="px-3 py-2 border-t" style={{ borderColor: 'var(--border-glass)' }}>
        <p className="font-clash text-sm font-medium text-white/80 truncate">{post.title}</p>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Create MasonryGrid.tsx**

```tsx
// components/gallery/MasonryGrid.tsx
'use client'

import { useState } from 'react'
import type { Post } from '@/lib/posts'
import { ImageCard } from './ImageCard'
import { ImageModal } from './ImageModal'

interface Props {
  posts: Post[]
}

export function MasonryGrid({ posts }: Props) {
  const [selected, setSelected] = useState<Post | null>(null)

  return (
    <>
      <div
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 px-4 md:px-8"
        style={{ columnGap: '1rem' }}
      >
        {posts.map((post, i) => (
          <ImageCard key={post.id} post={post} onOpen={setSelected} index={i} />
        ))}
      </div>

      {selected && (
        <ImageModal post={selected} onClose={() => setSelected(null)} allPosts={posts} />
      )}
    </>
  )
}
```

- [ ] **Step 3: Commit (modal comes next — commit both together after Task 4)**

---

## Task 4: ImageModal component

**Files:**
- Create: `components/gallery/ImageModal.tsx`

The modal uses Framer Motion `layoutId` matching the card's `layoutId` for a smooth bloom/expand transition. It also has a copy-to-clipboard button that fires the `aurora:pulse` event.

- [ ] **Step 1: Create ImageModal.tsx**

```tsx
// components/gallery/ImageModal.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Post } from '@/lib/posts'
import { getRelatedPosts } from '@/lib/posts'

interface Props {
  post: Post
  onClose: () => void
  allPosts: Post[]
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

export function ImageModal({ post, onClose, allPosts }: Props) {
  const [copied, setCopied] = useState(false)
  const related = getRelatedPosts(post)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleCopy = useCallback(() => {
    const fullPrompt = `${post.prompt} ${post.parameters}`
    navigator.clipboard.writeText(fullPrompt).then(() => {
      setCopied(true)
      window.dispatchEvent(new CustomEvent('aurora:pulse'))
      setTimeout(() => setCopied(false), 2000)
    })
  }, [post.prompt, post.parameters])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{ background: 'rgba(5,5,16,0.85)', backdropFilter: 'blur(16px)' }}
        role="dialog"
        aria-modal="true"
        aria-label={`Image details: ${post.title}`}
      >
        <motion.div
          className="glass relative max-w-5xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full text-white/60 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </button>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Image — layoutId matches card for bloom transition */}
            <motion.div layoutId={`image-${post.id}`} className="relative min-h-[300px] md:min-h-[500px]">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-tl-xl rounded-bl-xl"
                priority
              />
            </motion.div>

            {/* Metadata panel */}
            <div className="p-6 md:p-8 flex flex-col gap-5">
              <div>
                <h2 className="font-clash text-2xl md:text-3xl font-semibold text-white mb-1">{post.title}</h2>
                <p className="font-satoshi text-sm text-white/40">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full font-satoshi"
                    style={{ background: 'rgba(124,58,237,0.25)', color: 'rgba(167,139,250,1)', border: '1px solid rgba(124,58,237,0.4)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Prompt */}
              <div>
                <p className="font-satoshi text-xs text-white/40 uppercase tracking-widest mb-2">Prompt</p>
                <p className="font-satoshi text-sm text-white/80 leading-relaxed">{post.prompt}</p>
              </div>

              {/* Parameters */}
              <div>
                <p className="font-satoshi text-xs text-white/40 uppercase tracking-widest mb-2">Parameters</p>
                <code className="font-mono text-sm text-cyan-300/80 block p-3 rounded-lg" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)' }}>
                  {post.parameters}
                </code>
              </div>

              {/* Model */}
              <div>
                <p className="font-satoshi text-xs text-white/40 uppercase tracking-widest mb-1">Model</p>
                <p className="font-satoshi text-sm text-white/70">{post.model}</p>
              </div>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="w-full py-3 px-4 rounded-xl font-satoshi font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: copied ? 'rgba(6,182,212,0.2)' : 'rgba(124,58,237,0.25)',
                  border: `1px solid ${copied ? 'rgba(6,182,212,0.5)' : 'rgba(124,58,237,0.5)'}`,
                  color: copied ? 'rgb(6,182,212)' : 'rgba(167,139,250,1)',
                }}
              >
                {copied ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
                    Copy Full Prompt
                  </>
                )}
              </button>

              {/* Facebook link */}
              {post.facebookUrl !== '#' && (
                <Link
                  href={post.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-satoshi text-xs text-white/40 hover:text-white/70 transition-colors text-center"
                >
                  View original Facebook post →
                </Link>
              )}
            </div>
          </div>

          {/* Related images */}
          {related.length > 0 && (
            <div className="px-6 md:px-8 pb-8 pt-4" style={{ borderTop: '1px solid var(--border-glass)' }}>
              <p className="font-satoshi text-xs text-white/40 uppercase tracking-widest mb-4">Related</p>
              <div className="grid grid-cols-3 gap-3">
                {related.map(r => (
                  <div
                    key={r.id}
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => {/* handled by parent, TODO: navigate to related */}}
                  >
                    <Image src={r.imageUrl} alt={r.title} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Commit gallery components**

```bash
git add components/gallery/
git commit -m "feat: add MasonryGrid, ImageCard with magnetic tilt, ImageModal with bloom + copy"
```

---

## Task 5: Homepage — replace placeholder

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace app/page.tsx**

```tsx
// app/page.tsx
import { getAllPosts } from '@/lib/posts'
import { MasonryGrid } from '@/components/gallery/MasonryGrid'

export const metadata = {
  title: 'Synthex Prompts AI',
  description: 'AI-generated art and the Midjourney prompts behind every image.',
}

export default function HomePage() {
  const posts = getAllPosts()

  return (
    <section className="pt-8 pb-16">
      <div className="text-center mb-12 px-4">
        <h1 className="font-clash text-5xl md:text-7xl font-bold tracking-tight text-white/90 mb-4" style={{ letterSpacing: '-0.02em' }}>
          Synthex Prompts AI
        </h1>
        <p className="font-satoshi text-lg text-white/50 max-w-xl mx-auto">
          AI-generated art with the Midjourney prompts that created them.
        </p>
      </div>

      <MasonryGrid posts={posts} />
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: replace homepage placeholder with live masonry gallery"
```

---

## Task 6: Prompts Library page

**Files:**
- Create: `app/library/page.tsx`
- Create: `components/library/LibraryView.tsx`
- Create: `tests/library-search-filter.test.tsx`

The Library page is client-side — all filtering/search happens in React state. It defaults to gallery view (same ImageCard grid) and can toggle to library view (text-first cards with copy buttons).

- [ ] **Step 1: Write failing tests for search and filter**

```tsx
// tests/library-search-filter.test.tsx
import { describe, it, expect } from 'vitest'
import { getAllPosts } from '@/lib/posts'

// Test the filtering logic directly (not the React component)
function searchPosts(posts: ReturnType<typeof getAllPosts>, keyword: string) {
  const kw = keyword.toLowerCase()
  return posts.filter(p => p.prompt.toLowerCase().includes(kw))
}

function filterByTag(posts: ReturnType<typeof getAllPosts>, tag: string) {
  return posts.filter(p => p.tags.includes(tag))
}

describe('prompts library search and filter', () => {
  const posts = getAllPosts()

  it('keyword search returns posts containing the keyword in prompt', () => {
    const results = searchPosts(posts, 'cyberpunk')
    expect(results.length).toBeGreaterThan(0)
    results.forEach(p => {
      expect(p.prompt.toLowerCase()).toContain('cyberpunk')
    })
  })

  it('keyword search returns empty array for non-matching keyword', () => {
    const results = searchPosts(posts, 'xyznonexistentterm')
    expect(results).toHaveLength(0)
  })

  it('tag filter returns only posts with the given tag', () => {
    const results = filterByTag(posts, 'portrait')
    expect(results.length).toBeGreaterThan(0)
    results.forEach(p => {
      expect(p.tags).toContain('portrait')
    })
  })

  it('tag filter combined with keyword returns intersection', () => {
    const byTag = filterByTag(posts, 'cyberpunk')
    const combined = searchPosts(byTag, 'neon')
    combined.forEach(p => {
      expect(p.tags).toContain('cyberpunk')
      expect(p.prompt.toLowerCase()).toContain('neon')
    })
  })

  it('empty keyword returns all posts', () => {
    const results = searchPosts(posts, '')
    expect(results).toHaveLength(posts.length)
  })
})
```

- [ ] **Step 2: Run test to confirm it passes** (tests logic directly — no component needed)

```bash
npm test tests/library-search-filter.test.tsx
```

Expected: `PASS` — 5 tests pass

- [ ] **Step 3: Create LibraryView.tsx**

```tsx
// components/library/LibraryView.tsx
'use client'

import { useState, useCallback } from 'react'
import type { Post } from '@/lib/posts'

interface Props {
  post: Post
}

export function LibraryCard({ post }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    const fullPrompt = `${post.prompt} ${post.parameters}`
    navigator.clipboard.writeText(fullPrompt).then(() => {
      setCopied(true)
      window.dispatchEvent(new CustomEvent('aurora:pulse'))
      setTimeout(() => setCopied(false), 2000)
    })
  }, [post.prompt, post.parameters])

  return (
    <div className="glass p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-clash text-lg font-medium text-white/90">{post.title}</h3>
          <p className="font-satoshi text-xs text-white/40 mt-0.5">
            {post.model} · {new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-satoshi font-medium transition-all duration-200"
          style={{
            background: copied ? 'rgba(6,182,212,0.15)' : 'rgba(124,58,237,0.2)',
            border: `1px solid ${copied ? 'rgba(6,182,212,0.4)' : 'rgba(124,58,237,0.3)'}`,
            color: copied ? 'rgb(6,182,212)' : 'rgba(167,139,250,0.9)',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <p className="font-satoshi text-sm text-white/70 leading-relaxed">{post.prompt}</p>

      <code
        className="font-mono text-xs text-cyan-300/70 px-3 py-2 rounded-lg block"
        style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.12)' }}
      >
        {post.parameters}
      </code>

      <div className="flex flex-wrap gap-1.5">
        {post.tags.map(tag => (
          <span
            key={tag}
            className="text-[10px] px-2 py-0.5 rounded-full font-satoshi"
            style={{ background: 'rgba(124,58,237,0.2)', color: 'rgba(167,139,250,0.8)' }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create app/library/page.tsx**

```tsx
// app/library/page.tsx
'use client'

import { useState, useMemo } from 'react'
import { getAllPosts, getAllTags } from '@/lib/posts'
import { ImageCard } from '@/components/gallery/ImageCard'
import { ImageModal } from '@/components/gallery/ImageModal'
import { LibraryCard } from '@/components/library/LibraryView'
import type { Post } from '@/lib/posts'

const allPosts = getAllPosts()
const allTags = getAllTags()

export default function LibraryPage() {
  const [view, setView] = useState<'gallery' | 'library'>('gallery')
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [selected, setSelected] = useState<Post | null>(null)

  const filtered = useMemo(() => {
    let result = allPosts
    if (activeTag) result = result.filter(p => p.tags.includes(activeTag))
    if (search.trim()) {
      const kw = search.toLowerCase()
      result = result.filter(p => p.prompt.toLowerCase().includes(kw))
    }
    return result
  }, [search, activeTag])

  return (
    <section className="pt-8 pb-16 px-4 md:px-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="font-clash text-5xl md:text-6xl font-bold tracking-tight text-white/90 mb-3" style={{ letterSpacing: '-0.02em' }}>
          Prompts Library
        </h1>
        <p className="font-satoshi text-white/50 max-w-lg mx-auto">
          Browse, search, and copy every prompt.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
        {/* Search */}
        <input
          type="search"
          placeholder="Search prompts…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl font-satoshi text-sm text-white/80 placeholder-white/30 outline-none"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-glass)',
          }}
        />

        {/* View toggle */}
        <div
          className="flex rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--border-glass)' }}
        >
          {(['gallery', 'library'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-5 py-3 font-satoshi text-sm capitalize transition-colors duration-200"
              style={{
                background: view === v ? 'rgba(124,58,237,0.3)' : 'transparent',
                color: view === v ? 'rgba(167,139,250,1)' : 'rgba(255,255,255,0.5)',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Tag filters */}
      <div className="flex flex-wrap gap-2 mb-8 max-w-4xl mx-auto">
        <button
          onClick={() => setActiveTag(null)}
          className="px-3 py-1.5 rounded-full text-xs font-satoshi transition-colors duration-200"
          style={{
            background: activeTag === null ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.05)',
            color: activeTag === null ? 'rgba(167,139,250,1)' : 'rgba(255,255,255,0.5)',
            border: `1px solid ${activeTag === null ? 'rgba(124,58,237,0.5)' : 'var(--border-glass)'}`,
          }}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className="px-3 py-1.5 rounded-full text-xs font-satoshi capitalize transition-colors duration-200"
            style={{
              background: activeTag === tag ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.05)',
              color: activeTag === tag ? 'rgba(167,139,250,1)' : 'rgba(255,255,255,0.5)',
              border: `1px solid ${activeTag === tag ? 'rgba(124,58,237,0.5)' : 'var(--border-glass)'}`,
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="font-satoshi text-xs text-white/30 mb-6 max-w-4xl mx-auto">
        {filtered.length} {filtered.length === 1 ? 'prompt' : 'prompts'}
      </p>

      {/* Content */}
      {view === 'gallery' ? (
        <>
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4" style={{ columnGap: '1rem' }}>
            {filtered.map((post, i) => (
              <ImageCard key={post.id} post={post} onOpen={setSelected} index={i} />
            ))}
          </div>
          {selected && (
            <ImageModal post={selected} onClose={() => setSelected(null)} allPosts={allPosts} />
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {filtered.map(post => (
            <LibraryCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="font-satoshi text-white/30">No prompts match your search.</p>
        </div>
      )}
    </section>
  )
}
```

**Note:** The `app/library/page.tsx` uses `getAllPosts()` and `getAllTags()` from `@/lib/posts`. Since it uses `useState`, it must be a Client Component (`'use client'`). Add `'use client'` at the top.

Wait — in Next.js App Router, calling `getAllPosts()` (which imports JSON) is fine in a Server Component, but the page needs `useState` for client-side filtering. Solution: use `'use client'` and call `getAllPosts()` outside the component (module-level constant) so it runs once. This is the pattern already shown in the code above.

- [ ] **Step 5: Add 'use client' to the page**

Ensure the first line of `app/library/page.tsx` is `'use client'`.

- [ ] **Step 6: Run full test suite**

```bash
npm test
```

Expected: `PASS` — all tests pass (5 data layer + 5 search/filter + 3 loading-gate + 3 nav-overlay = 16 tests)

- [ ] **Step 7: Commit**

```bash
git add app/library/ components/library/ tests/library-search-filter.test.tsx
git commit -m "feat: add Prompts Library page with dual-view toggle, search, tag filter"
```

---

## Task 7: Build check + push branch

- [ ] **Step 1: Run TypeScript check**

```bash
npx tsc --noEmit
```

Fix any TypeScript errors before proceeding.

- [ ] **Step 2: Run full test suite**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 3: Run build**

```bash
npm run build
```

Fix any build errors. Common issues:
- `next/image` needs `remotePatterns` for `picsum.photos` — add to `next.config.ts`:

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

- [ ] **Step 4: Push branch to GitHub**

```bash
git push -u origin plan-2-portfolio-core
```

---

## Plan 2 Complete

Portfolio Core is live on branch `plan-2-portfolio-core`. Delivers:
- `posts.json` data layer with typed helpers
- Masonry gallery with scroll-reveal entrance + magnetic card tilt
- Full image modal with prompt copy, aurora pulse feedback, related images
- Prompts Library with dual-view toggle, keyword search, tag filter
- 16 total passing tests
