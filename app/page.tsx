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
