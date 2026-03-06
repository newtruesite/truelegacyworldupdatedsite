import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function useCountUp(end: number, duration: number, run: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!run) return
    let start = 0
    const startTime = performance.now()
    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      setValue(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [end, duration, run])
  return value
}

export function SocialProofStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const countries = useCountUp(45, 1500, inView)
  const members = useCountUp(8, 1500, inView)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(!!entry?.isIntersecting),
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 py-6 text-center"
    >
      <div>
        <span className="block text-2xl md:text-3xl font-bold text-white tabular-nums">{countries}+</span>
        <span className="text-sm text-slate-400">countries represented</span>
      </div>
      <div className="w-px h-10 bg-white/10 hidden sm:block" />
      <div>
        <span className="block text-2xl md:text-3xl font-bold text-white tabular-nums">{members}</span>
        <span className="text-sm text-slate-400">team regions worldwide</span>
      </div>
    </motion.div>
  )
}
