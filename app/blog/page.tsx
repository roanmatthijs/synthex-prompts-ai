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
