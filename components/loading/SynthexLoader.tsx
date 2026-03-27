// components/loading/SynthexLoader.tsx
'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  targetX: number
  targetY: number
}

interface Props {
  onComplete: () => void
}

const ASSEMBLE_FRAMES = 160  // ~2.7s at 60fps
const HOLD_FRAMES = 90       // ~1.5s hold
const DISSOLVE_FRAMES = 60   // ~1s dissolve
const PARTICLE_STEP = 4
const PARTICLE_RADIUS = 1.5

export function SynthexLoader({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = window.innerWidth
    const H = window.innerHeight
    canvas.width = W
    canvas.height = H

    // Sample target pixel positions from offscreen canvas
    const offscreen = document.createElement('canvas')
    offscreen.width = W
    offscreen.height = H
    const off = offscreen.getContext('2d')!
    const fontSize = Math.min(W * 0.13, 130)
    off.font = `700 ${fontSize}px 'Clash Display', sans-serif`
    off.fillStyle = 'white'
    off.textAlign = 'center'
    off.textBaseline = 'middle'
    off.fillText('SYNTHEX', W / 2, H / 2)

    const imageData = off.getImageData(0, 0, W, H)
    const targets: { x: number; y: number }[] = []
    for (let y = 0; y < H; y += PARTICLE_STEP) {
      for (let x = 0; x < W; x += PARTICLE_STEP) {
        if (imageData.data[(y * W + x) * 4 + 3] > 128) {
          targets.push({ x, y })
        }
      }
    }

    const particles: Particle[] = targets.map(t => ({
      x: Math.random() * W,
      y: Math.random() * H,
      targetX: t.x,
      targetY: t.y,
    }))

    let frame = 0
    let opacity = 1
    let rafId: number

    const drawParticles = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180, 120, 255, ${opacity})`
        ctx.fill()
      })
    }

    const assemble = () => {
      const speed = 0.06 + (frame / ASSEMBLE_FRAMES) * 0.04
      particles.forEach(p => {
        p.x += (p.targetX - p.x) * speed
        p.y += (p.targetY - p.y) * speed
      })
      drawParticles()
      frame++

      if (frame < ASSEMBLE_FRAMES + HOLD_FRAMES) {
        rafId = requestAnimationFrame(assemble)
      } else {
        rafId = requestAnimationFrame(dissolve)
      }
    }

    let dissolveFrame = 0
    const dissolve = () => {
      opacity = 1 - dissolveFrame / DISSOLVE_FRAMES
      particles.forEach(p => {
        p.x += (Math.random() - 0.5) * 5
        p.y += (Math.random() - 0.5) * 5
      })
      drawParticles()
      dissolveFrame++

      if (dissolveFrame < DISSOLVE_FRAMES) {
        rafId = requestAnimationFrame(dissolve)
      } else {
        onComplete()
      }
    }

    rafId = requestAnimationFrame(assemble)

    return () => cancelAnimationFrame(rafId)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-[#050510]" data-testid="synthex-loader-screen">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
