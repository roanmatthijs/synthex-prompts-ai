// components/gallery/ImageModal.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Post } from '@/lib/posts'
import { getRelatedPosts } from '@/lib/posts'

interface Props {
  post: Post
  onClose: () => void
  allPosts: Post[]
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

export function ImageModal({ post, onClose, allPosts: _allPosts }: Props) {
  const [copied, setCopied] = useState(false)
  const related = getRelatedPosts(post)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleCopy = useCallback(() => {
    const fullPrompt = `${post.prompt} ${post.parameters}`
    navigator.clipboard.writeText(fullPrompt).then(() => {
      setCopied(true)
      window.dispatchEvent(new CustomEvent('aurora:pulse'))
      setTimeout(() => setCopied(false), 2000)
    })
  }, [post.prompt, post.parameters])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{ background: 'rgba(5,5,16,0.85)', backdropFilter: 'blur(16px)' }}
        role="dialog"
        aria-modal="true"
        aria-label={`Image details: ${post.title}`}
      >
        <motion.div
          className="glass relative max-w-5xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full text-white/60 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </button>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Image — layoutId matches card for bloom transition */}
            <motion.div layoutId={`image-${post.id}`} className="relative min-h-[300px] md:min-h-[500px]">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-tl-xl rounded-bl-xl"
                priority
              />
            </motion.div>

            {/* Metadata panel */}
            <div className="p-6 md:p-8 flex flex-col gap-5">
              <div>
                <h2 className="font-clash text-2xl md:text-3xl font-semibold text-white mb-1">{post.title}</h2>
                <p className="font-satoshi text-sm text-white/40">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full font-satoshi"
                    style={{ background: 'rgba(124,58,237,0.25)', color: 'rgba(167,139,250,1)', border: '1px solid rgba(124,58,237,0.4)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Prompt */}
              <div>
                <p className="font-satoshi text-xs text-white/40 uppercase tracking-widest mb-2">Prompt</p>
                <p className="font-satoshi text-sm text-white/80 leading-relaxed">{post.prompt}</p>
              </div>

              {/* Parameters */}
              <div>
                <p className="font-satoshi text-xs text-white/40 uppercase tracking-widest mb-2">Parameters</p>
                <code className="font-mono text-sm text-cyan-300/80 block p-3 rounded-lg" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)' }}>
                  {post.parameters}
                </code>
              </div>

              {/* Model */}
              <div>
                <p className="font-satoshi text-xs text-white/40 uppercase tracking-widest mb-1">Model</p>
                <p className="font-satoshi text-sm text-white/70">{post.model}</p>
              </div>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="w-full py-3 px-4 rounded-xl font-satoshi font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: copied ? 'rgba(6,182,212,0.2)' : 'rgba(124,58,237,0.25)',
                  border: `1px solid ${copied ? 'rgba(6,182,212,0.5)' : 'rgba(124,58,237,0.5)'}`,
                  color: copied ? 'rgb(6,182,212)' : 'rgba(167,139,250,1)',
                }}
              >
                {copied ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
                    Copy Full Prompt
                  </>
                )}
              </button>

              {/* Facebook link */}
              {post.facebookUrl !== '#' && (
                <Link
                  href={post.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-satoshi text-xs text-white/40 hover:text-white/70 transition-colors text-center"
                >
                  View original Facebook post →
                </Link>
              )}
            </div>
          </div>

          {/* Related images */}
          {related.length > 0 && (
            <div className="px-6 md:px-8 pb-8 pt-4" style={{ borderTop: '1px solid var(--border-glass)' }}>
              <p className="font-satoshi text-xs text-white/40 uppercase tracking-widest mb-4">Related</p>
              <div className="grid grid-cols-3 gap-3">
                {related.map(r => (
                  <div
                    key={r.id}
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => {/* handled by parent, TODO: navigate to related */}}
                  >
                    <Image src={r.imageUrl} alt={r.title} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
