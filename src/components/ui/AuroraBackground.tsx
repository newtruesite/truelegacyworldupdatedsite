import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface MousePosition {
    x: number
    y: number
}

interface AuroraBackgroundProps {
    children: React.ReactNode
    className?: string
    showRadialGradient?: boolean
}

export function AuroraBackground({
    children,
    className,
    showRadialGradient = true,
}: AuroraBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [mouse, setMouse] = useState<MousePosition>({ x: 50, y: 50 })

    useEffect(() => {
        if (typeof window === 'undefined') return

        // Disable cursor-follow behavior on touch / coarse pointer devices
        const isCoarsePointer =
            (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
            'ontouchstart' in window

        if (isCoarsePointer) {
            return
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            setMouse({
                x: ((e.clientX - rect.left) / rect.width) * 100,
                y: ((e.clientY - rect.top) / rect.height) * 100,
            })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div
            ref={containerRef}
            className={cn('relative overflow-hidden bg-black', className)}
        >
            {/* Aurora blobs */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0"
            >
                {/* Primary aurora — deep blue/navy */}
                <div
                    className="animate-aurora-1 absolute -left-[20%] -top-[30%] h-[80%] w-[70%] rounded-full opacity-60"
                    style={{
                        background:
                            'radial-gradient(ellipse at center, rgba(10,36,99,0.8) 0%, rgba(30,64,175,0.4) 40%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                />
                {/* Secondary aurora — cyan */}
                <div
                    className="animate-aurora-2 absolute -right-[10%] top-[10%] h-[60%] w-[50%] rounded-full opacity-50"
                    style={{
                        background:
                            'radial-gradient(ellipse at center, rgba(6,182,212,0.5) 0%, rgba(59,130,246,0.3) 40%, transparent 70%)',
                        filter: 'blur(80px)',
                    }}
                />
                {/* Tertiary aurora — green tint */}
                <div
                    className="animate-aurora-1 absolute bottom-[-20%] left-[20%] h-[50%] w-[60%] rounded-full opacity-30"
                    style={{
                        background:
                            'radial-gradient(ellipse at center, rgba(16,185,129,0.4) 0%, rgba(6,182,212,0.2) 50%, transparent 70%)',
                        filter: 'blur(100px)',
                        animationDelay: '-4s',
                    }}
                />

                {/* Cursor-reactive glow */}
                <div
                    className="absolute h-[40%] w-[40%] rounded-full opacity-20 transition-all duration-500 ease-out"
                    style={{
                        background:
                            'radial-gradient(circle at center, rgba(6,182,212,0.6) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                        left: `${mouse.x - 20}%`,
                        top: `${mouse.y - 20}%`,
                    }}
                />

                {/* Radial vignette mask */}
                {showRadialGradient && (
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(10,14,26,0.7) 100%)',
                        }}
                    />
                )}

                {/* Noise texture overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: '128px 128px',
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    )
}
