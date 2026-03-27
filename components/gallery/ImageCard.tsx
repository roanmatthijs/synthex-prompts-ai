// components/gallery/ImageCard.tsx
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

export function ImageCard({ post, onOpen, index }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    setTilt({ x: dy * -6, y: dx * 6 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      className="glass mb-4 overflow-hidden cursor-pointer break-inside-avoid"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
      onClick={() => onOpen(post)}
    >
      {/* Image with layoutId for bloom transition */}
      <motion.div layoutId={`image-${post.id}`} className="relative w-full">
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={800}
          height={600}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="w-full h-auto block"
          style={{ display: 'block' }}
        />
      </motion.div>

      {/* Hover prompt teaser */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{
          background: 'linear-gradient(to top, rgba(5,5,16,0.92) 0%, rgba(5,5,16,0.4) 50%, transparent 100%)',
        }}
      >
        <p className="font-satoshi text-xs text-white/80 line-clamp-3 mb-1">
          {post.prompt}
        </p>
        <div className="flex flex-wrap gap-1 mt-1">
          {post.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full font-satoshi"
              style={{ background: 'rgba(124,58,237,0.4)', color: 'rgba(167,139,250,1)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Card footer always visible */}
      <div className="px-3 py-2 border-t" style={{ borderColor: 'var(--border-glass)' }}>
        <p className="font-clash text-sm font-medium text-white/80 truncate">{post.title}</p>
      </div>
    </motion.div>
  )
}
