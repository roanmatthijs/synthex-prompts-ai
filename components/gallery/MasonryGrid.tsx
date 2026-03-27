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
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 px-4 md:px-8"
        style={{ columnGap: '1rem' }}
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
