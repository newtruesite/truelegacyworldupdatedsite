import React from 'react'

interface TrueLegacyLogoProps {
  variant?: 'nav' | 'footer' | 'map' | 'mapOverlay'
  className?: string
}

const TrueLegacyLogo: React.FC<TrueLegacyLogoProps> = ({ 
  variant = 'nav', 
  className = '' 
}) => {
  // Height based on variant
  const heights = {
    nav: '44px',
    footer: '32px', 
    map: '48px',
    mapOverlay: '48px'
  }

  const combinedClasses = `true-legacy-logo ${className}`.trim()

  return (
    <img
      src="/logo.png"
      alt="True Legacy World"
      className={combinedClasses}
      style={{ 
        height: heights[variant], 
        width: 'auto', 
        display: 'block',
        background: 'transparent !important',
        backgroundColor: 'transparent !important'
      }}
    />
  )
}

export default TrueLegacyLogo