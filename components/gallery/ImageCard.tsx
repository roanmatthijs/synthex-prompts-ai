'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Post } from '@/lib/posts'

interface Props {
  post: Post
  onOpen: (post: Post) => void
  index: number
}

function parseDimensions(url: string): { width: number; height: number } {
  const m = url.match(/\/(\d+)\/(\d+)\/?$/)
  if (m) return { width: parseInt(m[1]), height: parseInt(m[2]) }
  return { width: 800, height: 600 }
}

export function ImageCard({ post, onOpen, index }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const { width, height } = parseDimensions(post.imageUrl)

  return (
    <motion.div
      ref={cardRef}
      className="relative break-inside-avoid cursor-pointer"
      style={{ marginBottom: '12px' }}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 1.1,
        delay: (index % 3) * 0.09,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(post)}
      data-cursor-hover
    >
      {/* Image container — clip-path + scale/rotate on hover (Ashfall technique) */}
      <div
        style={{
          overflow: 'hidden',
          borderRadius: '8px',
          clipPath: 'inset(0% 0% 0% 0% round 8px)',
        }}
      >
        <motion.div layoutId={`image-${post.id}`}>
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={width}
            height={height}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="w-full h-auto block"
            style={{
              display: 'block',
              transform: hovered ? 'scale(1.12) rotate(2deg)' : 'scale(1) rotate(0deg)',
              transition: 'transform 0.8s cubic-bezier(.22,1,.36,1)',
              willChange: 'transform',
            }}
          />
        </motion.div>

        {/* Gradient overlay — fades in on hover */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(6,6,10,0.92) 0%, rgba(6,6,10,0.4) 40%, transparent 100%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Hover text — slides up */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '20px',
            overflow: 'hidden',
          }}
        >
          <div style={{
            transform: hovered ? 'translateY(0)' : 'translateY(16px)',
            opacity: hovered ? 1 : 0,
            transition: 'transform 0.5s cubic-bezier(.22,1,.36,1), opacity 0.3s ease',
          }}>
            <p style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: '15px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.95)',
              marginBottom: '6px',
              lineHeight: 1.2,
            }}>
              {post.title}
            </p>
            <p style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: '12px',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: '10px',
            }}>
              {post.prompt}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {post.tags.slice(0, 3).map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
