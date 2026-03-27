import { describe, it, expect } from 'vitest'
import { getAllPosts, getPostById } from '@/lib/posts'

describe('posts data layer', () => {
  it('returns an array of posts', () => {
    const posts = getAllPosts()
    expect(Array.isArray(posts)).toBe(true)
    expect(posts.length).toBeGreaterThan(0)
  })

  it('each post has required fields', () => {
    const posts = getAllPosts()
    posts.forEach(post => {
      expect(post.id).toBeTruthy()
      expect(post.title).toBeTruthy()
      expect(post.imageUrl).toBeTruthy()
      expect(post.prompt).toBeTruthy()
      expect(post.model).toBeTruthy()
      expect(post.parameters).toBeTruthy()
      expect(Array.isArray(post.tags)).toBe(true)
      expect(post.date).toBeTruthy()
      expect(post.facebookUrl).toBeTruthy()
    })
  })

  it('all post IDs are unique', () => {
    const posts = getAllPosts()
    const ids = posts.map(p => p.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('getPostById returns the correct post', () => {
    const posts = getAllPosts()
    const first = posts[0]
    const found = getPostById(first.id)
    expect(found).toBeDefined()
    expect(found!.id).toBe(first.id)
  })

  it('getPostById returns undefined for unknown id', () => {
    expect(getPostById('nonexistent-id')).toBeUndefined()
  })
})
