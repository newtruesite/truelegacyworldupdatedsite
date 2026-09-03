import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export interface AppPageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  backTo?: string
  backLabel?: string
  actions?: React.ReactNode
  stat?: React.ReactNode
  badge?: React.ReactNode
  children?: React.ReactNode
  className?: string
  maxWidthClass?: string
}

export function AppPageHeader({
  eyebrow,
  title,
  description,
  backTo,
  backLabel = 'Back',
  actions,
  stat,
  badge,
  children,
  className = '',
  maxWidthClass = '',
}: AppPageHeaderProps) {
  return (
    <header className={`w-full border-b border-white/10 pb-6 mb-7 text-white ${className}`}>
      <div className={`w-full ${maxWidthClass}`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3.5 sm:gap-4 min-w-0 flex-1">
            {backTo && (
              <Link
                to={backTo}
                aria-label={backLabel}
                className="mt-1 grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[.04] text-cyan-400 hover:bg-white/[.08] transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {eyebrow && (
                  <p className="text-xs font-black uppercase tracking-[.24em] text-[#2997ff]">
                    {eyebrow}
                  </p>
                )}
                {badge}
              </div>
              <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl lg:text-5xl tracking-tight">
                {title}
              </h1>
              {description && (
                <p className="mt-2.5 max-w-3xl text-sm sm:text-base leading-relaxed text-[#cccccc] break-words">
                  {description}
                </p>
              )}
            </div>
          </div>

          {(actions || stat) && (
            <div className="flex shrink-0 flex-wrap items-center gap-2.5 sm:gap-3 sm:self-start">
              {stat}
              {actions}
            </div>
          )}
        </div>

        {children && <div className="mt-5">{children}</div>}
      </div>
    </header>
  )
}
