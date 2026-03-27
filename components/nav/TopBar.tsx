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
        className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between transition-all duration-500"
        style={{
          padding: '0 5vw',
          height: '72px',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          background: scrolled ? 'rgba(6,6,10,0.75)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.75)',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,1)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
          aria-label="Synthex Prompts AI home"
        >
          SYNTHEX
        </Link>

        {/* Menu button — larger, easier to hit */}
        <button
          onClick={() => setNavOpen(v => !v)}
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={navOpen}
          aria-controls="nav-overlay"
          aria-haspopup="dialog"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '7px',
            padding: '12px',
            margin: '-12px',
            background: 'none',
            border: 'none',
            cursor: 'none',
          }}
        >
          <span style={{
            display: 'block',
            width: '28px',
            height: '1.5px',
            background: 'rgba(255,255,255,0.75)',
            transformOrigin: 'center',
            transition: 'transform 0.35s cubic-bezier(.22,1,.36,1), opacity 0.2s ease, background 0.2s ease',
            transform: navOpen ? 'rotate(45deg) translate(0, 5px)' : 'none',
          }} />
          <span style={{
            display: 'block',
            width: '20px',
            height: '1.5px',
            background: 'rgba(255,255,255,0.75)',
            transformOrigin: 'center',
            transition: 'transform 0.35s cubic-bezier(.22,1,.36,1), opacity 0.2s ease',
            opacity: navOpen ? 0 : 1,
            transform: navOpen ? 'scaleX(0)' : 'none',
          }} />
          <span style={{
            display: 'block',
            width: '28px',
            height: '1.5px',
            background: 'rgba(255,255,255,0.75)',
            transformOrigin: 'center',
            transition: 'transform 0.35s cubic-bezier(.22,1,.36,1), background 0.2s ease',
            transform: navOpen ? 'rotate(-45deg) translate(0, -5px)' : 'none',
          }} />
        </button>
      </header>

      <NavOverlay isOpen={navOpen} onClose={() => setNavOpen(false)} />
    </>
  )
}
