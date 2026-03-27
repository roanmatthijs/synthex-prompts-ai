import { describe, it, expect } from 'vitest'
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog'

describe('blog data layer', () => {
  it('returns an array of blog posts', () => {
    const posts = getAllBlogPosts()
    expect(Array.isArray(posts)).toBe(true)
    expect(posts.length).toBeGreaterThan(0)
  })

  it('each post has required fields', () => {
    const posts = getAllBlogPosts()
    posts.forEach(post => {
      expect(post.id).toBeTruthy()
      expect(post.title).toBeTruthy()
      expect(post.excerpt).toBeTruthy()
      expect(post.body).toBeTruthy()
      expect(Array.isArray(post.tags)).toBe(true)
      expect(post.date).toBeTruthy()
      expect(post.thumbnailUrl).toBeTruthy()
    })
  })

  it('all post IDs are unique', () => {
    const posts = getAllBlogPosts()
    const ids = posts.map(p => p.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('getBlogPostBySlug returns the correct post', () => {
    const posts = getAllBlogPosts()
    const first = posts[0]
    const found = getBlogPostBySlug(first.id)
    expect(found).toBeDefined()
    expect(found!.id).toBe(first.id)
  })

  it('getBlogPostBySlug returns undefined for unknown slug', () => {
    expect(getBlogPostBySlug('nonexistent-slug')).toBeUndefined()
  })

  it('posts are sorted newest first', () => {
    const posts = getAllBlogPosts()
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date) >= new Date(posts[i].date)).toBe(true)
    }
  })
})
