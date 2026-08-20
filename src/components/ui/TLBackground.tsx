import { cn } from '@/lib/utils'

interface TLBackgroundProps {
    children: React.ReactNode
    className?: string
    variant?: 'dark' | 'light'
}

/** Cinematic True Legacy surface: a restrained black or silk stage for page content. */
export function TLBackground({ children, className, variant = 'dark' }: TLBackgroundProps) {
    if (variant === 'light') {
        return (
            <div className={cn('relative overflow-hidden', className)}>
                <div className="absolute inset-0 tl-bg-light" />
                <div className="relative z-10">{children}</div>
            </div>
        )
    }

    return (
        <div className={cn('relative overflow-hidden bg-black', className)}>
            <div className="relative z-10">{children}</div>
        </div>
    )
}
