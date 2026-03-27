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

/** Extract pixel dimensions encoded in a picsum URL like /seed/name/800/1100 */
function parseDimensions(url: string): { width: number; height: number } {
  const m = url.match(/\/(\d+)\/(\d+)\/?$/)
  if (m) return { width: parseInt(m[1]), height: parseInt(m[2]) }
  return { width: 800, height: 600 }
}

export function ImageCard({ post, onOpen, index }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const { width, height } = parseDimensions(post.imageUrl)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    setTilt({ x: dy * -4, y: dx * 4 })
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative overflow-hidden cursor-pointer mb-3 md:mb-4 break-inside-avoid rounded-xl"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.7,
        delay: (index % 3) * 0.08,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: hovered
          ? 'transform 0.12s ease'
          : 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false) }}
      onMouseEnter={() => setHovered(true)}
      onClick={() => onOpen(post)}
    >
      {/* Image — true aspect ratio, no forced container height */}
      <motion.div layoutId={`image-${post.id}`}>
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={width}
          height={height}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="w-full h-auto block"
          style={{ display: 'block' }}
        />
      </motion.div>

      {/* Hover reveal — slides up from bottom */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end p-4 md:p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.22 }}
        style={{
          background:
            'linear-gradient(to top, rgba(6,6,10,0.95) 0%, rgba(6,6,10,0.5) 45%, transparent 100%)',
        }}
      >
        <motion.div
          initial={{ y: 10 }}
          animate={{ y: hovered ? 0 : 10 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <p
            className="text-white/90 mb-2 leading-snug"
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: '15px',
              fontWeight: 600,
            }}
          >
            {post.title}
          </p>
          <p className="text-white/55 text-xs leading-relaxed line-clamp-2 mb-3"
            style={{ fontFamily: "'Satoshi', sans-serif" }}>
            {post.prompt}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
