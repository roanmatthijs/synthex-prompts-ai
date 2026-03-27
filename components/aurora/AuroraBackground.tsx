'use client'

import { useEffect, useRef } from 'react'

export function AuroraBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handlePulse = () => {
      el.classList.add('aurora-pulse')
      const timer = setTimeout(() => el.classList.remove('aurora-pulse'), 700)
      return () => clearTimeout(timer)
    }

    window.addEventListener('aurora:pulse', handlePulse)
    return () => window.removeEventListener('aurora:pulse', handlePulse)
  }, [])

  return <div ref={ref} className="aurora-bg" aria-hidden="true" />
}
