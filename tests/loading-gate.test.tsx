// tests/loading-gate.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { LoadingGate } from '@/components/loading/LoadingGate'

// Mock SynthexLoader so tests don't run canvas logic
vi.mock('@/components/loading/SynthexLoader', () => ({
  SynthexLoader: ({ onComplete }: { onComplete: () => void }) => (
    <div data-testid="loader">
      <button onClick={onComplete}>complete</button>
    </div>
  ),
}))

describe('LoadingGate', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('shows loader on first visit', () => {
    render(<LoadingGate />)
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('does not show loader if already visited', () => {
    sessionStorage.setItem('synthex-loaded', '1')
    render(<LoadingGate />)
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
  })

  it('hides loader and sets sessionStorage when onComplete fires', async () => {
    render(<LoadingGate />)
    expect(screen.getByTestId('loader')).toBeInTheDocument()

    await act(async () => {
      screen.getByRole('button', { name: 'complete' }).click()
    })

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    expect(sessionStorage.getItem('synthex-loaded')).toBe('1')
  })
})
