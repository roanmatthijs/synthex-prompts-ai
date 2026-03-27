// app/links/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Links',
  description: 'Find Synthex Prompts AI on Facebook, shop prints on Redbubble, and buy premium prompt packs on PromptBase.',
}

const LINKS = [
  {
    label: 'Facebook',
    sublabel: 'Follow for daily new images and prompts',
    href: 'https://www.facebook.com/SynthexPromptsAI',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    accentColor: 'rgba(59,89,152,1)',
    accentBg: 'rgba(59,89,152,0.15)',
    accentBorder: 'rgba(59,89,152,0.35)',
  },
  {
    label: 'Redbubble',
    sublabel: 'Shop prints, posters, and merchandise',
    href: 'https://www.redbubble.com',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" fill="var(--bg-deep)" />
      </svg>
    ),
    accentColor: 'rgba(230,0,35,1)',
    accentBg: 'rgba(230,0,35,0.12)',
    accentBorder: 'rgba(230,0,35,0.3)',
  },
  {
    label: 'PromptBase',
    sublabel: 'Buy premium Midjourney prompt packs',
    href: 'https://promptbase.com',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    accentColor: 'rgba(124,58,237,1)',
    accentBg: 'rgba(124,58,237,0.15)',
    accentBorder: 'rgba(124,58,237,0.35)',
  },
]

export default function LinksPage() {
  return (
    <section className="pt-8 pb-20 px-4 md:px-8 max-w-xl mx-auto">
      <div className="mb-12 text-center">
        <h1
          className="text-5xl md:text-6xl font-bold text-white/90 mb-3"
          style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: '-0.02em' }}
        >
          Links
        </h1>
        <p className="font-satoshi text-white/50">Find Synthex Prompts AI everywhere.</p>
      </div>

      <div className="flex flex-col gap-4">
        {LINKS.map(link => (
          <Link
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="glass flex items-center gap-5 px-6 py-5 transition-all duration-200 group"
            style={{
              '--link-accent': link.accentColor,
              '--link-bg': link.accentBg,
              '--link-border': link.accentBorder,
            } as React.CSSProperties}
          >
            <div
              className="shrink-0 p-3 rounded-xl transition-colors duration-200"
              style={{
                background: link.accentBg,
                color: link.accentColor,
                border: `1px solid ${link.accentBorder}`,
              }}
            >
              {link.icon}
            </div>

            <div className="flex-1 min-w-0">
              <p
                className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {link.label}
              </p>
              <p className="font-satoshi text-sm text-white/45 mt-0.5">{link.sublabel}</p>
            </div>

            <svg
              className="shrink-0 text-white/25 group-hover:text-white/60 transition-colors"
              width="20" height="20" viewBox="0 0 20 20" fill="currentColor"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        ))}
      </div>
    </section>
  )
}
