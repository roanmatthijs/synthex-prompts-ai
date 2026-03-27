// components/nav/NavOverlay.tsx
'use client'

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
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center"
          style={{
            background: 'rgba(5, 5, 16, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.nav
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center gap-8 md:gap-10"
          >
            {NAV_LINKS.map(link => (
              <motion.div key={link.href} variants={itemVariants}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="font-clash font-semibold text-5xl md:text-7xl tracking-tight text-white/90 hover:text-white transition-colors duration-150 block"
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
