export interface ProductPurchaseLinkItem {
  id: string
  name: string
  category: 'standard' | 'other'
  subtitle: string
  placeholder: string
  enagicUrl?: string
}

export const PURCHASE_LINK_CONFIG: ProductPurchaseLinkItem[] = [
  // Standard Products (Promoted First)
  {
    id: 'k8',
    name: 'Leveluk K8',
    category: 'standard',
    subtitle: '8-Plate Flagship Japanese Medical-Grade Water Ionizer',
    placeholder: 'https://www.enagic.com/... or your personal K8 order link',
    enagicUrl: 'https://www.enagic.com/en_US/products/leveluk-k8',
  },
  {
    id: 'emguarde',
    name: 'emGuarde GO / emGuarde',
    category: 'standard',
    subtitle: 'Patented Harmonic Resonance Electro Smoke & EMF Protection',
    placeholder: 'https://... your direct emGuarde purchase URL',
    enagicUrl: 'https://www.enagic.com/en_US/product-emguarde',
  },

  // Other Products (Below Standard Products)
  {
    id: 'ukon_sigma',
    name: 'Kangen Ukon® Sigma',
    category: 'other',
    subtitle: 'Add your official Kangen Ukon ordering link. When saved, the Buy Now button will automatically appear on your Ukon landing page.',
    placeholder: 'https://... your official Kangen Ukon order link',
    enagicUrl: 'https://www.enagic.com/en_US/products/ukon-sigma-turmeric-supplement',
  },
  {
    id: 'anespa_dx',
    name: 'Anespa DX',
    category: 'other',
    subtitle: 'Japanese Hot Spring Mineral Ion Shower & Chlorine Filter',
    placeholder: 'https://... your Anespa DX order link',
    enagicUrl: 'https://www.enagic.com/en_US/products/anespadx-mineral-ion-water-spa',
  },
  {
    id: 'sd501_dx',
    name: 'Leveluk SD501 DX',
    category: 'other',
    subtitle: '7-Plate Classic High Performance Ionizer',
    placeholder: 'https://... your SD501 DX order link',
    enagicUrl: 'https://www.enagic.com/en_US/products/leveluk-sd501dx',
  },
  {
    id: 'sd501_super',
    name: 'Leveluk Super 501',
    category: 'other',
    subtitle: '12-Plate High-Output Commercial & Family Heavy Duty Ionizer',
    placeholder: 'https://... your Super 501 order link',
    enagicUrl: 'https://www.enagic.com/en_US/products/leveluk-super501',
  },
  {
    id: 'sd501',
    name: 'Leveluk Jr IV',
    category: 'other',
    subtitle: '4-Plate Compact Starter Ionizer for Small Households',
    placeholder: 'https://... your Jr IV order link',
    enagicUrl: 'https://www.enagic.com/en_US/product-comparison',
  },
  {
    id: 'kangen_beaute',
    name: 'Kangen Beauté®',
    category: 'other',
    subtitle: 'Luxury 3-Step Clean Skincare Collection',
    placeholder: 'https://... your Kangen Beauté order link',
    enagicUrl: 'https://www.enagic.com/en_US/product-kangen-beaute',
  },
  {
    id: 'kangen_wagyu',
    name: 'Kangen Wagyu®',
    category: 'other',
    subtitle: 'Add your official Kangen Wagyu ordering link. When added, the Buy Now button will automatically appear on your Wagyu landing page.',
    placeholder: 'https://... your official Kangen Wagyu order link',
  },
  {
    id: 'kangen_air',
    name: 'Kangen Air',
    category: 'other',
    subtitle: 'Japanese Medical Grade Air Purification Technology',
    placeholder: 'https://... your Kangen Air order link',
  },
]

export const STANDARD_PURCHASE_PRODUCTS = PURCHASE_LINK_CONFIG.filter((p) => p.category === 'standard')
export const OTHER_PURCHASE_PRODUCTS = PURCHASE_LINK_CONFIG.filter((p) => p.category === 'other')

/** Canonical saved-link keys, including legacy aliases still present on older profiles. */
export const PRODUCT_PURCHASE_LINK_KEYS: Record<string, readonly string[]> = {
  k8: ['k8'],
  emguarde: ['emguarde', 'emguarde_original'],
  emguarde_original: ['emguarde', 'emguarde_original'],
  ukon_sigma: ['ukon_sigma', 'ukonPurchaseUrl', 'ukon'],
  ukon: ['ukonPurchaseUrl', 'ukon_sigma', 'ukon'],
  ukonPurchaseUrl: ['ukonPurchaseUrl', 'ukon_sigma', 'ukon'],
  anespa_dx: ['anespa_dx'],
  sd501_dx: ['sd501_dx'],
  sd501_super: ['sd501_super'],
  sd501: ['sd501'],
  kangen_beaute: ['kangen_beaute'],
  kangen_wagyu: ['kangen_wagyu', 'wagyu', 'wagyuPurchaseUrl'],
  kangen_air: ['kangen_air'],
}

export function getProductPurchaseLink(
  links: Record<string, string> | null | undefined,
  productId: string
): string | null {
  if (!links) return null
  const keys = PRODUCT_PURCHASE_LINK_KEYS[productId] || [productId]
  for (const key of keys) {
    const value = links[key]?.trim()
    if (value && isValidPurchaseUrl(value)) return value
  }
  return null
}

/**
 * Validates whether a provided string is a valid HTTP/HTTPS URL or safely empty.
 */
export function isValidPurchaseUrl(url: string | undefined | null): boolean {
  if (!url) return true
  const trimmed = url.trim()
  if (!trimmed) return true
  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}
