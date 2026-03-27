// components/nav/NavOverlay.tsx
'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/',        label: 'Portfolio'       },
  { href: '/library', label: 'Prompts Library' },
  { href: '/blog',    label: 'Blog'            },
  { href: '/about',   label: 'About'           },
  { href: '/links',   label: 'Links'           },
]

const overlayVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.25 } },
}

const listVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  exit:    { transition: { staggerChildren: 0.04, staggerDirection: -1 as const } },
}

const itemVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.2 } },
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function NavOverlay({ isOpen, onClose }: Props) {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isOpen) return

    // Move focus to first link when overlay opens
    const firstLink = navRef.current?.querySelector<HTMLAnchorElement>('a')
    firstLink?.focus()

    // Escape key closes overlay
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          id="nav-overlay"
          className="fixed inset-0 z-40 flex items-center justify-center"
          style={{
            background: 'rgba(4, 4, 8, 0.94)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.nav
            ref={navRef}
            variants={listVariants}
            aria-label="Main navigation"
            className="flex flex-col items-center gap-8 md:gap-10"
            onClick={e => e.stopPropagation()}
          >
            {NAV_LINKS.map(link => (
              <motion.div key={link.href} variants={itemVariants}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="font-clash font-semibold text-5xl md:text-7xl text-white/90 hover:text-white transition-colors duration-150 block"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
