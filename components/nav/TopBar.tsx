// components/nav/TopBar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { NavOverlay } from './NavOverlay'

export function TopBar() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-30 px-6 py-4 flex items-center justify-between"
        style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      >
        <Link href="/" aria-label="Synthex Prompts AI home">
          <Image
            src="/logo.svg"
            alt="Synthex Prompts AI"
            width={130}
            height={34}
            priority
          />
        </Link>

        <button
          onClick={() => setNavOpen(v => !v)}
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={navOpen}
          className="flex flex-col gap-[5px] p-2"
        >
          <span
            className="block w-6 h-px bg-white origin-center transition-transform duration-300"
            style={{ transform: navOpen ? 'rotate(45deg) translateY(3px)' : undefined }}
          />
          <span
            className="block w-6 h-px bg-white origin-center transition-transform duration-300"
            style={{ transform: navOpen ? 'rotate(-45deg) translateY(-3px)' : undefined }}
          />
        </button>
      </header>

      <NavOverlay isOpen={navOpen} onClose={() => setNavOpen(false)} />
    </>
  )
}
