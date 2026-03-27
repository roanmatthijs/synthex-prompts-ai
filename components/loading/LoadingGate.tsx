// components/loading/LoadingGate.tsx
'use client'

import { useState, useEffect } from 'react'
import { SynthexLoader } from './SynthexLoader'

const SESSION_KEY = 'synthex-loaded'

export function LoadingGate() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem(SESSION_KEY)) {
      setShow(true)
    }
  }, [])

  if (!show) return null

  return (
    <SynthexLoader
      onComplete={() => {
        sessionStorage.setItem(SESSION_KEY, '1')
        setShow(false)
      }}
    />
  )
}
