import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface TLBackgroundProps {
    children: React.ReactNode
    className?: string
    variant?: 'dark' | 'light'
}

/**
 * True Legacy animated background — deep navy with sweeping blue arcs and lens flare,
 * matching the brand background style shown in the reference images.
 */
export function TLBackground({ children, className, variant = 'dark' }: TLBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [mouse, setMouse] = useState({ x: 30, y: 50 })

    useEffect(() => {
        if (typeof window === 'undefined') return

        // Disable cursor-follow behavior on touch / coarse pointer devices
        const isCoarsePointer =
            (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
            'ontouchstart' in window

        if (isCoarsePointer) {
            return
        }

        const handleMove = (e: MouseEvent) => {
            if (!containerRef.current) return
            const r = containerRef.current.getBoundingClientRect()
            setMouse({
                x: ((e.clientX - r.left) / r.width) * 100,
                y: ((e.clientY - r.top) / r.height) * 100,
            })
        }

        window.addEventListener('mousemove', handleMove, { passive: true })
        return () => window.removeEventListener('mousemove', handleMove)
    }, [])

    if (variant === 'light') {
        return (
            <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
                {/* Light background */}
                <div className="absolute inset-0 tl-bg-light" />
                {/* Animated arcs */}
                <div
                    className="animate-arc-1 pointer-events-none absolute"
                    style={{
                        width: '140%',
                        height: '140%',
                        top: '-20%',
                        left: '-10%',
                        borderRadius: '40%',
                        background: 'transparent',
                        border: '1.5px solid rgba(30,136,229,0.3)',
                        boxShadow: '0 0 40px rgba(30,136,229,0.15)',
                    }}
                />
                <div
                    className="animate-arc-2 pointer-events-none absolute"
                    style={{
                        width: '120%',
                        height: '120%',
                        top: '20%',
                        left: '-5%',
                        borderRadius: '50%',
                        background: 'transparent',
                        border: '1px solid rgba(30,136,229,0.2)',
                    }}
                />
                {/* Lens flare */}
                <div
                    className="animate-lens-flare pointer-events-none absolute"
                    style={{ left: '62%', bottom: '18%', width: 20, height: 20 }}
                >
                    <LensFlare color="rgba(30,136,229,0.8)" size={20} />
                </div>
                <div className="relative z-10">{children}</div>
            </div>
        )
    }

    return (
        <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
            {/* Base navy gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at 15% 55%, #0a2060 0%, transparent 55%), radial-gradient(ellipse at 85% 15%, #0d3a8c 0%, transparent 50%), linear-gradient(180deg, #051030 0%, #060b1e 65%, #051030 100%)',
                }}
            />

            {/* Primary large arc — top right */}
            <div
                className="animate-arc-1 pointer-events-none absolute"
                aria-hidden="true"
                style={{
                    width: '160%',
                    height: '160%',
                    top: '-55%',
                    right: '-30%',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: '2px solid rgba(29,102,200,0.45)',
                    boxShadow: '0 0 60px rgba(29,102,200,0.2), inset 0 0 60px rgba(29,102,200,0.05)',
                }}
            />

            {/* Secondary arc — bottom right bulge */}
            <div
                className="animate-arc-2 pointer-events-none absolute"
                aria-hidden="true"
                style={{
                    width: '180%',
                    height: '100%',
                    bottom: '-40%',
                    right: '-40%',
                    borderRadius: '45%',
                    background: 'radial-gradient(ellipse at 60% 80%, rgba(13,58,140,0.55) 0%, transparent 60%)',
                    border: '1px solid rgba(30,136,229,0.25)',
                    boxShadow: '0 0 120px rgba(13,58,140,0.4)',
                }}
            />

            {/* Thin bright arc line */}
            <div
                className="animate-arc-1 pointer-events-none absolute"
                aria-hidden="true"
                style={{
                    width: '130%',
                    height: '130%',
                    top: '-45%',
                    right: '-15%',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: '0.8px solid rgba(96,165,250,0.35)',
                    boxShadow: '0 0 20px rgba(96,165,250,0.25)',
                    animationDelay: '-4s',
                }}
            />

            {/* Glowing blue sphere — top right fill */}
            <div
                aria-hidden="true"
                className="animate-aurora-2 pointer-events-none absolute"
                style={{
                    width: '60%',
                    height: '70%',
                    top: '-30%',
                    right: '-10%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 40% 40%, rgba(13,58,140,0.7) 0%, rgba(10,32,96,0.5) 40%, transparent 70%)',
                    filter: 'blur(40px)',
                }}
            />

            {/* Mouse-reactive glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute transition-all duration-700 ease-out"
                style={{
                    width: '35%',
                    height: '35%',
                    borderRadius: '50%',
                    left: `${mouse.x - 17}%`,
                    top: `${mouse.y - 17}%`,
                    background: 'radial-gradient(circle, rgba(29,102,200,0.18) 0%, transparent 70%)',
                    filter: 'blur(30px)',
                }}
            />

            {/* Lens flare — travels along the arc */}
            <div
                className="animate-lens-flare pointer-events-none absolute"
                aria-hidden="true"
                style={{ left: '7%', top: '28%' }}
            >
                <LensFlare color="rgba(120,180,255,0.9)" size={16} />
            </div>

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    )
}

function LensFlare({ color, size }: { color: string; size: number }) {
    return (
        <svg width={size * 2} height={size * 2} viewBox="0 0 40 40" fill="none">
            {/* Center dot */}
            <circle cx="20" cy="20" r="3" fill={color} />
            {/* 4 main rays */}
            <line x1="20" y1="2" x2="20" y2="38" stroke={color} strokeWidth="0.8" opacity="0.9" />
            <line x1="2" y1="20" x2="38" y2="20" stroke={color} strokeWidth="0.8" opacity="0.9" />
            {/* Diagonal rays */}
            <line x1="7" y1="7" x2="33" y2="33" stroke={color} strokeWidth="0.5" opacity="0.5" />
            <line x1="33" y1="7" x2="7" y2="33" stroke={color} strokeWidth="0.5" opacity="0.5" />
            {/* Outer glow circle */}
            <circle cx="20" cy="20" r="10" stroke={color} strokeWidth="0.3" opacity="0.3" />
        </svg>
    )
}
