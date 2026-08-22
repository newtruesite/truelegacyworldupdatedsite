import { useEffect, useState } from 'react'

export function GlobalCursorGlow() {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Disable cursor tracking on touch devices/coarse pointers
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    if (isCoarse) return

    const handleMouseMove = (e: MouseEvent) => {
      setIsActive(true)
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`)
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`)
    }

    const handleMouseLeave = () => {
      setIsActive(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return <div className={`global-cursor-glow ${isActive ? 'active' : ''}`} aria-hidden="true" />
}
