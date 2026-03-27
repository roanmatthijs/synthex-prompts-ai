// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'The story behind Synthex Prompts AI - who I am, how I got here, and why I share every prompt.',
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
          I started generating AI images the way most people do &mdash; by accident. I typed something into Midjourney expecting something mediocre, and something extraordinary came back. That was it.
        </p>

        <p>
          <strong className="text-white/90 font-semibold">Synthex Prompts AI</strong> grew out of a simple frustration: every time I made something worth keeping, I&apos;d lose the prompt. I&apos;d try to recreate it and fail. So I started treating prompts like code &mdash; version-controlled, annotated, reproducible.
        </p>

        <p>
          This site is that practice made public. Every image here comes with the full prompt and parameters &mdash; exactly what I typed, exactly what I used. Nothing withheld. Because I believe sharing the recipe makes the food better for everyone.
        </p>

        <div className="glass p-6 my-10">
          <p className="text-white/85 text-lg leading-snug" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            &ldquo;The prompt is the art. The image is just proof that it worked.&rdquo;
          </p>
        </div>

        <p>
          I sell prints on <strong className="text-white/90 font-semibold">Redbubble</strong> and premium prompt packs on <strong className="text-white/90 font-semibold">PromptBase</strong>. The Facebook page is where I post new work first. This site is where the archive lives.
        </p>

        <p>
          If you&apos;ve used one of my prompts to make something, I&apos;d genuinely love to see it. Find me on Facebook and share.
        </p>
      </div>
    </section>
  )
}
