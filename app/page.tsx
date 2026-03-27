import { getAllPosts } from '@/lib/posts'
import { MasonryGrid } from '@/components/gallery/MasonryGrid'
import { RevealLine } from '@/components/hero/HeroText'

export const metadata = {
  title: 'Synthex Prompts AI',
  description: 'AI-generated art and the Midjourney prompts behind every image.',
}

export default function HomePage() {
  const posts = getAllPosts()

  return (
    <>
      {/* ── Hero ──────────────────────────────────────── */}
      <section
        className="relative flex flex-col justify-end"
        style={{ minHeight: '92svh', padding: '0 5vw 6vw' }}
      >
        {/* Divider */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 5vw' }}
        />

        {/* Eyebrow */}
        <RevealLine delay={100} style={{ marginBottom: '2vw' }}>
          <p style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
          }}>
            AI Art — Every Prompt Included
          </p>
        </RevealLine>

        {/* Display headline — vw-scaled like the references */}
        <div style={{ lineHeight: 0.9, letterSpacing: '-0.03em' }}>
          <RevealLine delay={180}>
            <h1 style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: 'clamp(48px, 9.5vw, 140px)',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.95)',
            }}>
              Synthex
            </h1>
          </RevealLine>
          <RevealLine delay={280}>
            <h1 style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: 'clamp(48px, 9.5vw, 140px)',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.28)',
            }}>
              Prompts AI
            </h1>
          </RevealLine>
        </div>

        {/* Sub line */}
        <RevealLine delay={420} style={{ marginTop: '3vw' }}>
          <p style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: 'clamp(14px, 1.1vw, 18px)',
            color: 'rgba(255,255,255,0.38)',
            maxWidth: '380px',
            lineHeight: 1.65,
          }}>
            Midjourney-generated art with the full prompt and parameters behind every image.
          </p>
        </RevealLine>

        {/* Scroll cue — vertical text right side */}
        <div
          className="absolute"
          style={{
            right: '5vw',
            bottom: '6vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.18)',
            writingMode: 'vertical-rl',
          }}>
            Scroll
          </span>
          <div style={{
            width: '1px',
            height: '56px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)',
          }} />
        </div>
      </section>

      {/* ── Gallery ───────────────────────────────────── */}
      <section style={{ paddingTop: '80px' }}>
        <MasonryGrid posts={posts} />
      </section>
    </>
  )
}
