'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NavOverlay } from './NavOverlay'

export function TopBar() {
  const [navOpen, setNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-30 px-6 md:px-10 py-5 flex items-center justify-between transition-all duration-500"
        style={{
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          background: scrolled ? 'rgba(6,6,10,0.7)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
        }}
      >
        {/* Logo — text-based, reliable */}
        <Link
          href="/"
          className="tracking-widest text-white/80 hover:text-white transition-colors duration-200"
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.18em',
          }}
          aria-label="Synthex Prompts AI home"
        >
          SYNTHEX
        </Link>

        {/* Menu button */}
        <button
          onClick={() => setNavOpen(v => !v)}
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={navOpen}
          aria-controls="nav-overlay"
          aria-haspopup="dialog"
          className="flex flex-col justify-center gap-[6px] p-2 group"
        >
          <span
            className="block h-px bg-white/70 group-hover:bg-white transition-all duration-300 origin-center"
            style={{
              width: '24px',
              transform: navOpen ? 'rotate(45deg) translate(0, 4.5px)' : 'none',
            }}
          />
          <span
            className="block h-px bg-white/70 group-hover:bg-white transition-all duration-300 origin-center"
            style={{
              width: '16px',
              opacity: navOpen ? 0 : 1,
              transform: navOpen ? 'scaleX(0)' : 'none',
            }}
          />
          <span
            className="block h-px bg-white/70 group-hover:bg-white transition-all duration-300 origin-center"
            style={{
              width: '24px',
              transform: navOpen ? 'rotate(-45deg) translate(0, -4.5px)' : 'none',
            }}
          />
        </button>
      </header>

      <NavOverlay isOpen={navOpen} onClose={() => setNavOpen(false)} />
    </>
  )
}
