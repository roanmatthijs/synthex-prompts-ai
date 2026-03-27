// lib/blog.ts
import blogData from '@/blog.json'

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  body: string
  tags: string[]
  date: string
  thumbnailUrl: string
}

export function getAllBlogPosts(): BlogPost[] {
  return [...(blogData as BlogPost[])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return (blogData as BlogPost[]).find(p => p.id === slug)
}

export function getBlogTags(): string[] {
  const tagSet = new Set<string>()
  ;(blogData as BlogPost[]).forEach(p => p.tags.forEach(t => tagSet.add(t)))
  return Array.from(tagSet).sort()
}
