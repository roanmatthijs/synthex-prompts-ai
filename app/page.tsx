import { getAllPosts } from '@/lib/posts'
import { MasonryGrid } from '@/components/gallery/MasonryGrid'

export const metadata = {
  title: 'Synthex Prompts AI',
  description: 'AI-generated art and the Midjourney prompts behind every image.',
}

export default function HomePage() {
  const posts = getAllPosts()

  return (
    <>
      {/* Hero */}
      <section
        className="relative flex flex-col justify-end"
        style={{ minHeight: '90vh', padding: '0 20px 64px' }}
      >
        {/* Subtle horizontal rule */}
        <div
          className="absolute bottom-0 left-5 right-5"
          style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }}
        />

        <div style={{ maxWidth: '900px' }}>
          <p
            className="mb-4"
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.35)',
              textTransform: 'uppercase',
            }}
          >
            AI Art & Prompts
          </p>

          <h1
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: 'clamp(52px, 9vw, 120px)',
              fontWeight: 700,
              lineHeight: 0.92,
              letterSpacing: '-0.03em',
              color: 'rgba(255,255,255,0.95)',
            }}
          >
            Synthex
            <br />
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Prompts AI</span>
          </h1>

          <p
            className="mt-6"
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: '16px',
              color: 'rgba(255,255,255,0.4)',
              maxWidth: '420px',
              lineHeight: 1.6,
            }}
          >
            Every image. Every prompt. Exactly as generated.
          </p>
        </div>

        {/* Scroll cue */}
        <div
          className="absolute right-8 bottom-8 flex flex-col items-center gap-2"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <span
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: '10px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              writingMode: 'vertical-rl',
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: '1px',
              height: '48px',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)',
            }}
          />
        </div>
      </section>

      {/* Gallery */}
      <section style={{ paddingTop: '60px' }}>
        <MasonryGrid posts={posts} />
      </section>
    </>
  )
}
