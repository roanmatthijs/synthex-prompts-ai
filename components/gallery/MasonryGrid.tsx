// components/gallery/MasonryGrid.tsx
'use client'

import { useState } from 'react'
import type { Post } from '@/lib/posts'
import { ImageCard } from './ImageCard'
import { ImageModal } from './ImageModal'

interface Props {
  posts: Post[]
}

export function MasonryGrid({ posts }: Props) {
  const [selected, setSelected] = useState<Post | null>(null)

  return (
    <>
      <div
        className="columns-1 sm:columns-2 xl:columns-3"
        style={{ columnGap: '12px', padding: '0 20px 80px' }}
      >
        {posts.map((post, i) => (
          <ImageCard key={post.id} post={post} onOpen={setSelected} index={i} />
        ))}
      </div>

      {selected && (
        <ImageModal post={selected} onClose={() => setSelected(null)} allPosts={posts} />
      )}
    </>
  )
}
