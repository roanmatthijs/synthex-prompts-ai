# Synthex Prompts AI — Plan 1: Foundation & Design System

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap a Next.js project with the complete visual shell — aurora background, typography, navigation, and SYNTHEX particle loading screen — so Plans 2–5 have a working foundation to build on.

**Architecture:** Next.js 14 App Router with TypeScript and Tailwind CSS for utilities. Design tokens live in CSS custom properties (globals.css) and Tailwind config. All animations use Framer Motion for route transitions and JS interactions, and CSS keyframes for ambient effects (aurora). The loading screen uses the Canvas API to assemble "SYNTHEX" from particles.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Canvas API, Vitest, @testing-library/react

---

## File Map

```
E:/Claude/Synthex-Website/
├── app/
│   ├── layout.tsx                        — Root layout: aurora, topbar, loading gate, analytics wrapper
│   ├── page.tsx                          — Homepage placeholder (replaced in Plan 2)
│   └── globals.css                       — Design tokens, aurora animation, glass utilities, reset
├── components/
│   ├── aurora/
│   │   └── AuroraBackground.tsx          — Fixed aurora layer, listens for 'aurora:pulse' events
│   ├── loading/
│   │   ├── SynthexLoader.tsx             — Canvas particle assembly animation
│   │   └── LoadingGate.tsx               — sessionStorage gate: shows loader on first visit only
│   └── nav/
│       ├── TopBar.tsx                    — Fixed top bar: logo left, hamburger right
│       └── NavOverlay.tsx                — Full-screen nav overlay with staggered Framer Motion links
├── public/
│   └── logo.svg                          — Brand logo (copy your existing logo file here)
├── tests/
│   ├── loading-gate.test.tsx             — LoadingGate shows on first visit, hides after complete
│   └── nav-overlay.test.tsx              — NavOverlay renders links, responds to isOpen prop
├── tailwind.config.ts                    — Font families, accent colors, aurora animation
├── vitest.config.ts                      — Vitest + jsdom + @testing-library setup
├── vitest.setup.ts                       — @testing-library/jest-dom matchers
└── next.config.ts                        — (generated, unchanged in this plan)
```

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: entire project via `create-next-app`

- [ ] **Step 1: Run create-next-app**

```bash
cd "e:/Claude/Synthex-Website"
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias="@/*"
```

When prompted, accept all defaults. This creates `app/`, `public/`, `tailwind.config.ts`, `next.config.ts`, `tsconfig.json`, `package.json`.

Expected output ends with: `✓ Installation complete`

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install framer-motion @vercel/analytics
```

Expected: `added N packages`

- [ ] **Step 3: Install test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

Expected: `added N packages`

- [ ] **Step 4: Create vitest.config.ts**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 5: Create vitest.setup.ts**

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Add test script to package.json**

In `package.json`, inside `"scripts"`, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 7: Run test suite to confirm setup works**

```bash
npm test
```

Expected: `No test files found` (zero failures — test runner works)

- [ ] **Step 8: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js project with Tailwind, Framer Motion, Vitest"
```

---

## Task 2: Design tokens & global CSS

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace app/globals.css**

```css
/* app/globals.css */
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,700&display=swap');

/* ─── Design tokens ─────────────────────────────── */
:root {
  --bg-deep: #050510;
  --bg-surface: rgba(255, 255, 255, 0.04);
  --bg-surface-hover: rgba(255, 255, 255, 0.08);
  --border-glass: rgba(255, 255, 255, 0.10);
  --border-glass-bright: rgba(255, 255, 255, 0.20);
  --accent: #7c3aed;
  --accent-light: #a78bfa;
  --accent-cyan: #06b6d4;
  --text-primary: rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.60);
  --text-muted: rgba(255, 255, 255, 0.35);
}

/* ─── Reset ─────────────────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  color-scheme: dark;
  background-color: var(--bg-deep);
  scroll-behavior: smooth;
}

body {
  font-family: 'Satoshi', sans-serif;
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Clash Display', sans-serif;
}

/* ─── Aurora background ──────────────────────────── */
.aurora-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 80% 50% at 20% 40%, rgba(120, 40, 200, 0.50) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 60%, rgba(0, 200, 220, 0.35) 0%, transparent 60%),
    radial-gradient(ellipse 70% 60% at 50% 20%, rgba(0, 100, 255, 0.30) 0%, transparent 60%),
    radial-gradient(ellipse 50% 80% at 10% 80%, rgba(200, 0, 150, 0.25) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 90% 20%, rgba(50, 255, 150, 0.20) 0%, transparent 60%),
    #050510;
  background-size: 200% 200%;
  animation: aurora-shift 25s ease infinite;
  pointer-events: none;
  transition: filter 0.1s ease;
}

.aurora-bg.aurora-pulse {
  animation: aurora-shift 25s ease infinite, aurora-copy-pulse 0.7s ease forwards;
}

@keyframes aurora-shift {
  0%   { background-position: 0% 50%;   filter: hue-rotate(0deg)   brightness(1);    }
  33%  { background-position: 100% 30%; filter: hue-rotate(30deg)  brightness(1.05); }
  66%  { background-position: 50% 100%; filter: hue-rotate(-20deg) brightness(0.95); }
  100% { background-position: 0% 50%;   filter: hue-rotate(0deg)   brightness(1);    }
}

@keyframes aurora-copy-pulse {
  0%   { filter: hue-rotate(0deg)  brightness(1)   saturate(1);   }
  30%  { filter: hue-rotate(20deg) brightness(1.4) saturate(1.6); }
  100% { filter: hue-rotate(0deg)  brightness(1)   saturate(1);   }
}

/* ─── Glass card utility ─────────────────────────── */
.glass {
  background: var(--bg-surface);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-glass);
  border-radius: 12px;
}

.glass:hover {
  background: var(--bg-surface-hover);
  border-color: var(--border-glass-bright);
}

/* ─── Reduced motion ─────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .aurora-bg {
    animation: none;
  }
}
```

- [ ] **Step 2: Replace tailwind.config.ts**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        clash: ['Clash Display', 'sans-serif'],
        satoshi: ['Satoshi', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#7c3aed',
          light: '#a78bfa',
          cyan: '#06b6d4',
        },
      },
      backgroundImage: {
        'glass-surface': 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 3: Commit**

```bash
git add app/globals.css tailwind.config.ts
git commit -m "feat: add design tokens, aurora CSS, glass utility"
```

---

## Task 3: Aurora Background component

**Files:**
- Create: `components/aurora/AuroraBackground.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/aurora/AuroraBackground.tsx
'use client'

import { useEffect, useRef } from 'react'

export function AuroraBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handlePulse = () => {
      el.classList.add('aurora-pulse')
      const timer = setTimeout(() => el.classList.remove('aurora-pulse'), 700)
      return () => clearTimeout(timer)
    }

    window.addEventListener('aurora:pulse', handlePulse)
    return () => window.removeEventListener('aurora:pulse', handlePulse)
  }, [])

  return <div ref={ref} className="aurora-bg" aria-hidden="true" />
}
```

- [ ] **Step 2: Commit**

```bash
git add components/aurora/AuroraBackground.tsx
git commit -m "feat: add AuroraBackground component with pulse event listener"
```

---

## Task 4: Loading Screen

**Files:**
- Create: `components/loading/SynthexLoader.tsx`
- Create: `components/loading/LoadingGate.tsx`
- Create: `tests/loading-gate.test.tsx`

- [ ] **Step 1: Write the failing test for LoadingGate**

```tsx
// tests/loading-gate.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { LoadingGate } from '@/components/loading/LoadingGate'

// Mock SynthexLoader so tests don't run canvas logic
vi.mock('@/components/loading/SynthexLoader', () => ({
  SynthexLoader: ({ onComplete }: { onComplete: () => void }) => (
    <div data-testid="loader">
      <button onClick={onComplete}>complete</button>
    </div>
  ),
}))

describe('LoadingGate', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('shows loader on first visit', () => {
    render(<LoadingGate />)
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('does not show loader if already visited', () => {
    sessionStorage.setItem('synthex-loaded', '1')
    render(<LoadingGate />)
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
  })

  it('hides loader and sets sessionStorage when onComplete fires', async () => {
    render(<LoadingGate />)
    expect(screen.getByTestId('loader')).toBeInTheDocument()

    await act(async () => {
      screen.getByRole('button', { name: 'complete' }).click()
    })

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    expect(sessionStorage.getItem('synthex-loaded')).toBe('1')
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test tests/loading-gate.test.tsx
```

Expected: `FAIL` — `Cannot find module '@/components/loading/LoadingGate'`

- [ ] **Step 3: Create SynthexLoader.tsx**

```tsx
// components/loading/SynthexLoader.tsx
'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  targetX: number
  targetY: number
}

interface Props {
  onComplete: () => void
}

const ASSEMBLE_FRAMES = 90  // ~1.5s at 60fps
const HOLD_FRAMES = 40       // ~0.7s hold
const DISSOLVE_FRAMES = 30   // ~0.5s dissolve
const PARTICLE_STEP = 4      // sample every 4px
const PARTICLE_RADIUS = 1.5

export function SynthexLoader({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = window.innerWidth
    const H = window.innerHeight
    canvas.width = W
    canvas.height = H

    // Sample target pixel positions from offscreen canvas
    const offscreen = document.createElement('canvas')
    offscreen.width = W
    offscreen.height = H
    const off = offscreen.getContext('2d')!
    const fontSize = Math.min(W * 0.13, 130)
    off.font = `700 ${fontSize}px 'Clash Display', sans-serif`
    off.fillStyle = 'white'
    off.textAlign = 'center'
    off.textBaseline = 'middle'
    off.fillText('SYNTHEX', W / 2, H / 2)

    const imageData = off.getImageData(0, 0, W, H)
    const targets: { x: number; y: number }[] = []
    for (let y = 0; y < H; y += PARTICLE_STEP) {
      for (let x = 0; x < W; x += PARTICLE_STEP) {
        if (imageData.data[(y * W + x) * 4 + 3] > 128) {
          targets.push({ x, y })
        }
      }
    }

    const particles: Particle[] = targets.map(t => ({
      x: Math.random() * W,
      y: Math.random() * H,
      targetX: t.x,
      targetY: t.y,
    }))

    let frame = 0
    let opacity = 1
    let rafId: number

    const drawParticles = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180, 120, 255, ${opacity})`
        ctx.fill()
      })
    }

    const assemble = () => {
      const speed = 0.06 + (frame / ASSEMBLE_FRAMES) * 0.04
      particles.forEach(p => {
        p.x += (p.targetX - p.x) * speed
        p.y += (p.targetY - p.y) * speed
      })
      drawParticles()
      frame++

      if (frame < ASSEMBLE_FRAMES + HOLD_FRAMES) {
        rafId = requestAnimationFrame(assemble)
      } else {
        rafId = requestAnimationFrame(dissolve)
      }
    }

    let dissolveFrame = 0
    const dissolve = () => {
      opacity = 1 - dissolveFrame / DISSOLVE_FRAMES
      particles.forEach(p => {
        p.x += (Math.random() - 0.5) * 5
        p.y += (Math.random() - 0.5) * 5
      })
      drawParticles()
      dissolveFrame++

      if (dissolveFrame < DISSOLVE_FRAMES) {
        rafId = requestAnimationFrame(dissolve)
      } else {
        onComplete()
      }
    }

    rafId = requestAnimationFrame(assemble)

    return () => cancelAnimationFrame(rafId)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-[#050510]" data-testid="synthex-loader-screen">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
```

- [ ] **Step 4: Create LoadingGate.tsx**

```tsx
// components/loading/LoadingGate.tsx
'use client'

import { useState, useEffect } from 'react'
import { SynthexLoader } from './SynthexLoader'

const SESSION_KEY = 'synthex-loaded'

export function LoadingGate() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem(SESSION_KEY)) {
      setShow(true)
    }
  }, [])

  if (!show) return null

  return (
    <SynthexLoader
      onComplete={() => {
        sessionStorage.setItem(SESSION_KEY, '1')
        setShow(false)
      }}
    />
  )
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npm test tests/loading-gate.test.tsx
```

Expected: `PASS` — 3 tests pass

- [ ] **Step 6: Commit**

```bash
git add components/loading/ tests/loading-gate.test.tsx
git commit -m "feat: add SYNTHEX particle loader with sessionStorage gate"
```

---

## Task 5: TopBar navigation component

**Files:**
- Create: `components/nav/TopBar.tsx`

The TopBar is wired to NavOverlay. Write them together so they're testable as a unit.

- [ ] **Step 1: Create TopBar.tsx**

```tsx
// components/nav/TopBar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { NavOverlay } from './NavOverlay'

export function TopBar() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-30 px-6 py-4 flex items-center justify-between"
        style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      >
        <Link href="/" aria-label="Synthex Prompts AI home">
          <Image
            src="/logo.svg"
            alt="Synthex Prompts AI"
            width={130}
            height={34}
            priority
          />
        </Link>

        <button
          onClick={() => setNavOpen(v => !v)}
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={navOpen}
          className="flex flex-col gap-[5px] p-2 group"
        >
          <span
            className="block w-6 h-px bg-white origin-center transition-transform duration-300"
            style={{ transform: navOpen ? 'rotate(45deg) translateY(3px)' : undefined }}
          />
          <span
            className="block w-6 h-px bg-white origin-center transition-transform duration-300"
            style={{ transform: navOpen ? 'rotate(-45deg) translateY(-3px)' : undefined }}
          />
        </button>
      </header>

      <NavOverlay isOpen={navOpen} onClose={() => setNavOpen(false)} />
    </>
  )
}
```

- [ ] **Step 2: Commit (NavOverlay comes next — commit both together after Task 6)**

---

## Task 6: NavOverlay full-screen menu

**Files:**
- Create: `components/nav/NavOverlay.tsx`
- Create: `tests/nav-overlay.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// tests/nav-overlay.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavOverlay } from '@/components/nav/NavOverlay'

const NAV_LINKS = ['Portfolio', 'Prompts Library', 'Blog', 'About', 'Links']

describe('NavOverlay', () => {
  it('renders all nav links when open', () => {
    render(<NavOverlay isOpen={true} onClose={() => {}} />)
    NAV_LINKS.forEach(label => {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    })
  })

  it('renders nothing when closed', () => {
    render(<NavOverlay isOpen={false} onClose={() => {}} />)
    NAV_LINKS.forEach(label => {
      expect(screen.queryByRole('link', { name: label })).not.toBeInTheDocument()
    })
  })

  it('calls onClose when a link is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<NavOverlay isOpen={true} onClose={onClose} />)
    await user.click(screen.getByRole('link', { name: 'Blog' }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test tests/nav-overlay.test.tsx
```

Expected: `FAIL` — `Cannot find module '@/components/nav/NavOverlay'`

- [ ] **Step 3: Create NavOverlay.tsx**

```tsx
// components/nav/NavOverlay.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/',         label: 'Portfolio'       },
  { href: '/library',  label: 'Prompts Library' },
  { href: '/blog',     label: 'Blog'            },
  { href: '/about',    label: 'About'           },
  { href: '/links',    label: 'Links'           },
]

const overlayVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.25 } },
}

const listVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  exit:    { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
}

const itemVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.2 } },
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function NavOverlay({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center"
          style={{
            background: 'rgba(5, 5, 16, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.nav
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center gap-8 md:gap-10"
          >
            {NAV_LINKS.map(link => (
              <motion.div key={link.href} variants={itemVariants}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="font-clash font-semibold text-5xl md:text-7xl tracking-tight text-white/90 hover:text-white transition-colors duration-150 block"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test tests/nav-overlay.test.tsx
```

Expected: `PASS` — 3 tests pass

- [ ] **Step 5: Run full test suite**

```bash
npm test
```

Expected: `PASS` — 6 tests pass total (3 loading-gate + 3 nav-overlay)

- [ ] **Step 6: Commit**

```bash
git add components/nav/ tests/nav-overlay.test.tsx
git commit -m "feat: add TopBar and NavOverlay with full-screen animated menu"
```

---

## Task 7: Root layout assembly

**Files:**
- Modify: `app/layout.tsx`
- Add: `public/logo.svg` — copy your existing logo file here, renaming it to `logo.svg`

- [ ] **Step 1: Copy your logo file to public/**

Place your brand logo at `public/logo.svg`. If it's a PNG, place it as `public/logo.png` and update the `src` in TopBar.tsx to `/logo.png`.

- [ ] **Step 2: Replace app/layout.tsx**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { AuroraBackground } from '@/components/aurora/AuroraBackground'
import { TopBar } from '@/components/nav/TopBar'
import { LoadingGate } from '@/components/loading/LoadingGate'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Synthex Prompts AI',
    template: '%s | Synthex Prompts AI',
  },
  description: 'AI-generated art and the Midjourney prompts behind them.',
  openGraph: {
    title: 'Synthex Prompts AI',
    description: 'AI-generated art and the Midjourney prompts behind them.',
    type: 'website',
    siteName: 'Synthex Prompts AI',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuroraBackground />
        <LoadingGate />
        <TopBar />
        <main className="relative z-10 pt-16 min-h-screen">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx public/
git commit -m "feat: assemble root layout with aurora, topbar, loader, analytics"
```

---

## Task 8: Homepage placeholder & smoke test

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace app/page.tsx with a placeholder**

```tsx
// app/page.tsx
export default function HomePage() {
  return (
    <section className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <h1 className="font-clash text-6xl md:text-8xl font-bold tracking-tight text-white/90 mb-4">
          Synthex Prompts AI
        </h1>
        <p className="text-white/50 font-satoshi text-lg">
          Portfolio coming soon.
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Start the dev server and verify visually**

```bash
npm run dev
```

Open `http://localhost:3000` and verify:
- Deep dark background with shifting aurora gradient ✓
- SYNTHEX particle loader appears on first load, then disappears ✓
- After reload, loader does NOT appear (sessionStorage flag) ✓
- TopBar visible with logo and hamburger icon ✓
- Clicking hamburger opens full-screen nav overlay with all 5 links ✓
- Clicking a nav link closes the overlay ✓
- "Synthex Prompts AI" heading visible on homepage ✓

- [ ] **Step 3: Run full test suite one final time**

```bash
npm test
```

Expected: `PASS` — 6 tests pass

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add homepage placeholder — Plan 1 foundation complete"
```

---

## Plan 1 Complete

The visual shell is live. Next steps in order:

- **Plan 2** — Data layer (`posts.json` schema), masonry grid, image cards, and modal
- **Plan 4** — Can start in parallel: R2 setup, NextAuth, admin UI (no dependency on Plan 2)
- **Plan 3** — Prompts Library, Blog, About, Links (after Plan 2 data layer is done)
- **Plan 5** — Open Graph, analytics (after all content pages exist)
