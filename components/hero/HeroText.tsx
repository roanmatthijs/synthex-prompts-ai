'use client'

import { useEffect, useRef } from 'react'

interface Props {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}

/** Single line that slides up from below — translateY(100%) → 0 */
export function RevealLine({ children, delay = 0, className = '', style = {} }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const timer = setTimeout(() => {
      el.style.transform = 'translateY(0)'
      el.style.opacity = '1'
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div style={{ overflow: 'hidden', display: 'block' }}>
      <div
        ref={wrapRef}
        className={className}
        style={{
          transform: 'translateY(100%)',
          opacity: 0,
          transition: `transform 1.1s cubic-bezier(.22,1,.36,1), opacity 0.6s ease`,
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  )
}
