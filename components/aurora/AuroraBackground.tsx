'use client'

import { useEffect, useRef } from 'react'

export function AuroraBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let timer: ReturnType<typeof setTimeout> | null = null

    const handlePulse = () => {
      el.classList.add('aurora-pulse')
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => el.classList.remove('aurora-pulse'), 700)
    }

    window.addEventListener('aurora:pulse', handlePulse)
    return () => {
      window.removeEventListener('aurora:pulse', handlePulse)
      if (timer) clearTimeout(timer)
    }
  }, [])

  return <div ref={ref} className="aurora-bg" aria-hidden="true" />
}
