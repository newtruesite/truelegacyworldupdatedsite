export const LATAM_CONTACT_NUMBERS: Record<string, string> = {
  mexico: '+18186196238',
  paraguay: '+18186196238',
  brazil: '+18186196238',
  colombia: '+18186196238',
}

export const GLOBAL_CONTACT_LINK = 'https://wa.me/18186196238' // Default fallback

export function getWhatsAppLink(countrySlug?: string, message?: string): string {
  const defaultMessage = message ? encodeURIComponent(message) : ''
  
  if (countrySlug && LATAM_CONTACT_NUMBERS[countrySlug]) {
    const number = LATAM_CONTACT_NUMBERS[countrySlug].replace('+', '')
    return `https://wa.me/${number}${defaultMessage ? `?text=${defaultMessage}` : ''}`
  }

  // Fallback to global
  const globalNumber = GLOBAL_CONTACT_LINK.replace('https://wa.me/', '').replace('+', '')
  return `https://wa.me/${globalNumber}${defaultMessage ? `?text=${defaultMessage}` : ''}`
}
