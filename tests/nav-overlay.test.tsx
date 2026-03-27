// tests/nav-overlay.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavOverlay } from '@/components/nav/NavOverlay'

const NAV_LINKS = ['Portfolio', 'Prompts Library', 'Blog', 'About', 'Links']

describe('NavOverlay', () => {
  it('renders all nav links when open', () => {
    render(<NavOverlay isOpen={true} onClose={() => {}} />)
    NAV_LINKS.forEach(label => {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    })
  })

  it('renders nothing when closed', () => {
    render(<NavOverlay isOpen={false} onClose={() => {}} />)
    NAV_LINKS.forEach(label => {
      expect(screen.queryByRole('link', { name: label })).not.toBeInTheDocument()
    })
  })

  it('calls onClose when a link is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<NavOverlay isOpen={true} onClose={onClose} />)
    await user.click(screen.getByRole('link', { name: 'Blog' }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
