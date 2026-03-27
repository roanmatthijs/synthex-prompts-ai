'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Post } from '@/lib/posts'

interface Props {
  post: Post
  onClose: () => void
  allPosts?: Post[]
}

function parseDimensions(url: string): { width: number; height: number } {
  const m = url.match(/\/(\d+)\/(\d+)\/?$/)
  if (m) return { width: parseInt(m[1]), height: parseInt(m[2]) }
  return { width: 800, height: 600 }
}

export function ImageModal({ post, onClose }: Props) {
  const [copied, setCopied] = useState(false)
  const { width, height } = parseDimensions(post.imageUrl)
  const isPortrait = height > width

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(`${post.prompt} ${post.parameters}`).then(() => {
      setCopied(true)
      window.dispatchEvent(new CustomEvent('aurora:pulse'))
      setTimeout(() => setCopied(false), 2000)
    })
  }, [post.prompt, post.parameters])

  return (
    <AnimatePresence>
      {/* Backdrop — click to close */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ padding: '24px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Image: ${post.title}`}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(4,4,8,0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        />

        {/* Modal panel */}
        <motion.div
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: isPortrait ? '1fr 1fr' : '1fr',
            maxWidth: isPortrait ? '900px' : '680px',
            maxHeight: '90vh',
            width: '100%',
            background: 'rgba(10,10,16,0.95)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          {/* Image */}
          <motion.div
            layoutId={`image-${post.id}`}
            style={{
              position: 'relative',
              minHeight: isPortrait ? '500px' : '340px',
              maxHeight: isPortrait ? '90vh' : '55vw',
            }}
          >
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              style={{ borderRadius: isPortrait ? '16px 0 0 16px' : '16px 16px 0 0' }}
              priority
            />
          </motion.div>

          {/* Metadata — separate panel with generous internal padding */}
          <div
            style={{
              overflowY: 'auto',
              padding: '40px 36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
            }}
          >
            {/* Close */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.95)',
                  lineHeight: 1.2,
                  marginBottom: '6px',
                }}>
                  {post.title}
                </h2>
                <p style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.3)',
                }}>
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  flexShrink: 0,
                  marginLeft: '16px',
                  padding: '8px',
                  margin: '-8px -8px 0 0',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.3)',
                  cursor: 'none',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 3l12 12M15 3L3 15" />
                </svg>
              </button>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {post.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>

            {/* Prompt */}
            <div>
              <p style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)',
                marginBottom: '10px',
              }}>Prompt</p>
              <p style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: '14px',
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.7,
              }}>
                {post.prompt}
              </p>
            </div>

            {/* Parameters */}
            <div>
              <p style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)',
                marginBottom: '10px',
              }}>Parameters</p>
              <code style={{
                display: 'block',
                fontFamily: 'ui-monospace, monospace',
                fontSize: '13px',
                color: 'rgba(180,220,255,0.75)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '12px 14px',
                lineHeight: 1.5,
              }}>
                {post.parameters}
              </code>
            </div>

            {/* Model */}
            <div>
              <p style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)',
                marginBottom: '6px',
              }}>Model</p>
              <p style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: '14px',
                color: 'rgba(255,255,255,0.55)',
              }}>
                {post.model}
              </p>
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                fontFamily: "'Satoshi', sans-serif",
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'none',
                transition: 'all 0.2s ease',
                background: copied ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${copied ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
                color: copied ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)',
              }}
            >
              {copied ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Copied to clipboard
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copy full prompt
                </>
              )}
            </button>

            {post.facebookUrl !== '#' && (
              <Link
                href={post.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.25)',
                  textAlign: 'center',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
              >
                View original Facebook post →
              </Link>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
