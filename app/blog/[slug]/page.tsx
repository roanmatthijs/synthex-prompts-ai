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

      {/* Body - markdown rendered */}
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
