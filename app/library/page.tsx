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
