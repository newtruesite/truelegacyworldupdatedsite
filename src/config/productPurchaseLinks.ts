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
    subtitle: 'Wild Okinawan Spring Turmeric Enriched with Kangen Water®',
    placeholder: 'https://... your Ukon Sigma order link',
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
    name: 'Kangen Wagyu™',
    category: 'other',
    subtitle: 'Artisanal Premium Japanese Wagyu Beef Collection',
    placeholder: 'https://... your Kangen Wagyu order link',
    enagicUrl: 'https://www.enagic.com/en_US/products/kangen-wagyu',
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
