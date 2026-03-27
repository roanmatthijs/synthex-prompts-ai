import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { AuroraBackground } from '@/components/aurora/AuroraBackground'
import { TopBar } from '@/components/nav/TopBar'
import { LoadingGate } from '@/components/loading/LoadingGate'
import { SmoothScroll } from '@/components/providers/SmoothScroll'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Synthex Prompts AI',
    template: '%s | Synthex Prompts AI',
  },
  description: 'AI-generated art and the Midjourney prompts behind them.',
  openGraph: {
    title: 'Synthex Prompts AI',
    description: 'AI-generated art and the Midjourney prompts behind them.',
    type: 'website',
    siteName: 'Synthex Prompts AI',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuroraBackground />
        <LoadingGate />
        <SmoothScroll>
          <TopBar />
          <main className="relative z-10">
            {children}
          </main>
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  )
}
