import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LandingHeaderBackButtonProps {
  fallbackUrl?: string
  label?: string
  className?: string
  showText?: boolean
  textLabel?: string
}

/**
 * Standardized Back Button for all True Legacy Landing Pages.
 * Seamlessly integrates into the sticky slim header navigation.
 * Navigates back in history if available, or falls back to the distributor profile / home.
 */
export function LandingHeaderBackButton({
  fallbackUrl = '/',
  label = 'Go back',
  className = '',
  showText = false,
  textLabel = 'Back',
}: LandingHeaderBackButtonProps) {
  const navigate = useNavigate()

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    if (window.history.length > 1) {
      window.history.back()
    } else if (fallbackUrl) {
      navigate(fallbackUrl)
    } else {
      navigate('/')
    }
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all shrink-0 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-white/20',
        showText ? 'px-2.5 py-1.5 text-xs font-bold' : 'w-8 h-8 sm:w-8.5 sm:h-8.5',
        className
      )}
      aria-label={label}
      title={label}
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 shrink-0" />
      {showText && <span className="text-xs font-bold leading-none">{textLabel}</span>}
    </button>
  )
}
