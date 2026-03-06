import { cn } from '@/lib/utils'

interface TrueLegacyLogoProps {
    className?: string
    variant?: 'full' | 'icon' | 'horizontal'
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeMap = {
    sm: { icon: 32, text: 14 },
    md: { icon: 44, text: 18 },
    lg: { icon: 64, text: 24 },
    xl: { icon: 96, text: 36 },
}

export function TrueLegacyLogo({ className, variant = 'horizontal', size = 'md' }: TrueLegacyLogoProps) {
    const s = sizeMap[size]

    const IconSVG = (
        <svg
            width={s.icon}
            height={s.icon}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="True Legacy World icon"
        >
            {/* Gold/amber arc (bottom-left) */}
            <path
                d="M15 72 C15 72 18 45 42 38"
                stroke="#F5A623"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
            />
            {/* Blue arrow/wingmark (top) */}
            <path
                d="M20 28 L48 14 L76 28 L58 28 L48 44 L38 28 Z"
                fill="#1B3A8C"
            />
            {/* Blue stem */}
            <rect x="44" y="42" width="8" height="22" rx="2" fill="#1B3A8C" />
        </svg>
    )

    if (variant === 'icon') {
        return <div className={cn('inline-flex items-center', className)}>{IconSVG}</div>
    }

    return (
        <div className={cn('inline-flex items-center gap-2', className)}>
            {IconSVG}
            <div className="flex flex-col leading-tight">
                <span
                    style={{ fontSize: s.text, fontWeight: 900, letterSpacing: '0.08em', color: '#1B3A8C', lineHeight: 1 }}
                >
                    TRUE LEGACY
                </span>
                <span
                    style={{
                        fontSize: s.text * 0.55,
                        fontWeight: 600,
                        letterSpacing: '0.25em',
                        color: '#1B3A8C',
                        lineHeight: 1.2,
                    }}
                >
                    WORLD
                </span>
            </div>
        </div>
    )
}

// Light variant for dark backgrounds
export function TrueLegacyLogoLight({ className, variant = 'horizontal', size = 'md' }: TrueLegacyLogoProps) {
    const s = sizeMap[size]

    const IconSVG = (
        <svg
            width={s.icon}
            height={s.icon}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M15 72 C15 72 18 45 42 38"
                stroke="#F5A623"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
            />
            <path
                d="M20 28 L48 14 L76 28 L58 28 L48 44 L38 28 Z"
                fill="white"
            />
            <rect x="44" y="42" width="8" height="22" rx="2" fill="white" />
        </svg>
    )

    if (variant === 'icon') {
        return <div className={cn('inline-flex items-center', className)}>{IconSVG}</div>
    }

    return (
        <div className={cn('inline-flex items-center gap-2', className)}>
            {IconSVG}
            <div className="flex flex-col leading-tight">
                <span
                    style={{ fontSize: s.text, fontWeight: 900, letterSpacing: '0.08em', color: 'white', lineHeight: 1 }}
                >
                    TRUE LEGACY
                </span>
                <span
                    style={{
                        fontSize: s.text * 0.55,
                        fontWeight: 600,
                        letterSpacing: '0.25em',
                        color: 'rgba(255,255,255,0.7)',
                        lineHeight: 1.2,
                    }}
                >
                    WORLD
                </span>
            </div>
        </div>
    )
}
