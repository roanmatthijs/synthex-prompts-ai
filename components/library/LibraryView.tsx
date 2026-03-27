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
