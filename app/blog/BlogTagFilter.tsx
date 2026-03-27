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
