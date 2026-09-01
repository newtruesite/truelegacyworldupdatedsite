import { getProductPurchaseLink, PURCHASE_LINK_CONFIG } from '@/config/productPurchaseLinks'
import type { PublicDistributor } from '@/lib/crm'
import { ExternalLink, ShoppingCart } from 'lucide-react'

type DistributorBuyButtonProps = {
  profile: PublicDistributor | null | undefined
  productId: string
  label: string
  className?: string
}

export function DistributorBuyButton({
  profile,
  productId,
  label,
  className = '',
}: DistributorBuyButtonProps) {
  const customHref = getProductPurchaseLink(profile?.purchase_links, productId)
  const configItem = PURCHASE_LINK_CONFIG.find((p) => p.id === productId)
  const href = customHref || configItem?.enagicUrl

  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-black text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:bg-amber-400 active:scale-95 ${className}`}
    >
      <ShoppingCart className="h-3.5 w-3.5" />
      {label}
      <ExternalLink className="h-3 w-3" />
    </a>
  )
}
