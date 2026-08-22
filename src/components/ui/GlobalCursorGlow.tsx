import { useEffect, useRef, useState } from 'react'

export function GlobalCursorGlow() {
  const [isActive, setIsActive] = useState(false)
  const targetX = useRef(0)
  const targetY = useRef(0)
  const glowX = useRef(0)
  const glowY = useRef(0)
  const animationFrameId = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Disable cursor tracking on touch devices/coarse pointers
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    if (isCoarse) return

    const tick = () => {
      // Linear interpolation (lerp): current = current + (target - current) * ease
      const ease = 0.07 // Lower values mean more lag/easing
      
      const dx = targetX.current - glowX.current
      const dy = targetY.current - glowY.current
      
      glowX.current += dx * ease
      glowY.current += dy * ease

      document.documentElement.style.setProperty('--mouse-x', `${glowX.current}px`)
      document.documentElement.style.setProperty('--mouse-y', `${glowY.current}px`)

      animationFrameId.current = requestAnimationFrame(tick)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isActive) {
        setIsActive(true)
        // Set initial positions immediately on first move to prevent jumping from (0,0)
        glowX.current = e.clientX
        glowY.current = e.clientY
        targetX.current = e.clientX
        targetY.current = e.clientY
      } else {
        targetX.current = e.clientX
        targetY.current = e.clientY
      }
    }

    const handleMouseLeave = () => {
      setIsActive(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    
    // Start animation loop
    animationFrameId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [isActive])

  return <div className={`global-cursor-glow ${isActive ? 'active' : ''}`} aria-hidden="true" />
}

