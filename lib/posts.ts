// lib/posts.ts
import postsData from '@/posts.json'

export interface Post {
  id: string
  title: string
  imageUrl: string
  prompt: string
  model: string
  parameters: string
  tags: string[]
  date: string
  facebookUrl: string
}

export function getAllPosts(): Post[] {
  return postsData as Post[]
}

export function getPostById(id: string): Post | undefined {
  return (postsData as Post[]).find(p => p.id === id)
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  return (postsData as Post[])
    .filter(p => p.id !== post.id && p.tags.some(t => post.tags.includes(t)))
    .slice(0, limit)
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>()
  ;(postsData as Post[]).forEach(p => p.tags.forEach(t => tagSet.add(t)))
  return Array.from(tagSet).sort()
}
