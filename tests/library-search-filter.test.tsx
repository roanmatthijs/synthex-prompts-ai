import { describe, it, expect } from 'vitest'
import { getAllPosts } from '@/lib/posts'

// Test the filtering logic directly (not the React component)
function searchPosts(posts: ReturnType<typeof getAllPosts>, keyword: string) {
  const kw = keyword.toLowerCase()
  return posts.filter(p => p.prompt.toLowerCase().includes(kw))
}

function filterByTag(posts: ReturnType<typeof getAllPosts>, tag: string) {
  return posts.filter(p => p.tags.includes(tag))
}

describe('prompts library search and filter', () => {
  const posts = getAllPosts()

  it('keyword search returns posts containing the keyword in prompt', () => {
    const results = searchPosts(posts, 'cyberpunk')
    expect(results.length).toBeGreaterThan(0)
    results.forEach(p => {
      expect(p.prompt.toLowerCase()).toContain('cyberpunk')
    })
  })

  it('keyword search returns empty array for non-matching keyword', () => {
    const results = searchPosts(posts, 'xyznonexistentterm')
    expect(results).toHaveLength(0)
  })

  it('tag filter returns only posts with the given tag', () => {
    const results = filterByTag(posts, 'portrait')
    expect(results.length).toBeGreaterThan(0)
    results.forEach(p => {
      expect(p.tags).toContain('portrait')
    })
  })

  it('tag filter combined with keyword returns intersection', () => {
    const byTag = filterByTag(posts, 'cyberpunk')
    const combined = searchPosts(byTag, 'neon')
    combined.forEach(p => {
      expect(p.tags).toContain('cyberpunk')
      expect(p.prompt.toLowerCase()).toContain('neon')
    })
  })

  it('empty keyword returns all posts', () => {
    const results = searchPosts(posts, '')
    expect(results).toHaveLength(posts.length)
  })
})
