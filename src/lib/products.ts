export type ProductId =
  | 'k8'
  | 'sd501'
  | 'sd501_super'
  | 'sd501_dx'
  | 'anespa_dx'
  | 'emguarde'
  | 'ukon_sigma'
  | 'kangen_wagyu'
  | 'kangen_air'

export type ProductCategory = 'ionizer' | 'shower' | 'supplement' | 'meat' | 'air' | 'accessory'

export interface ProductDefinition {
  id: ProductId
  slug: string
  /** Short internal name; use translations for display copy. */
  name: string
  category: ProductCategory
  /** Primary Enagic product or introduction URL (per product). */
  enagicProductUrl?: string
  /** PDF product guide or related brochure. */
  pdfGuideUrl?: string
  /** Optional secondary guide (e.g. compensation, maintenance). */
  secondaryPdfUrl?: string
  /** Local image path under /public */
  imageSrc: string
  imageAlt: string
}

export const PRODUCTS: Record<ProductId, ProductDefinition> = {
  k8: {
    id: 'k8',
    slug: 'k8',
    name: 'Leveluk K8',
    category: 'ionizer',
    enagicProductUrl: 'https://www.enagic.com/en_US/products/leveluk-k8',
    pdfGuideUrl: 'https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf?v=1767139619',
    secondaryPdfUrl: 'https://www.enagic.com/pdf/1099/Machine_Care_and_Maintenance_Guide.pdf?v=1767139562',
    imageSrc: '/products/k8.png',
    imageAlt: 'Leveluk K8 Kangen Water® ionizer by Enagic',
  },
  sd501: {
    id: 'sd501',
    slug: 'sd501',
    name: 'Leveluk Jr IV',
    category: 'ionizer',
    enagicProductUrl: 'https://www.enagic.com/en_US/products/leveuluk-sd501-platinum',
    pdfGuideUrl: 'https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf?v=1767139619',
    secondaryPdfUrl: 'https://www.enagic.com/pdf/1099/Machine_Care_and_Maintenance_Guide.pdf?v=1767139562',
    imageSrc: '/products/jr-iv.png',
    imageAlt: 'Leveluk Jr IV Kangen Water® ionizer by Enagic',
  },
  sd501_super: {
    id: 'sd501_super',
    slug: 'sd501-super',
    name: 'Leveluk Super 501',
    category: 'ionizer',
    enagicProductUrl: 'https://www.enagic.com/en_US/products/leveluk-super501',
    pdfGuideUrl: 'https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf?v=1767139619',
    secondaryPdfUrl: 'https://www.enagic.com/pdf/1099/Machine_Care_and_Maintenance_Guide.pdf?v=1767139562',
    imageSrc: '/products/sd501-super.png',
    imageAlt: 'Leveluk Super 501 high-output Kangen Water® ionizer by Enagic',
  },
  sd501_dx: {
    id: 'sd501_dx',
    slug: 'sd501-dx',
    name: 'Leveluk SD501 DX',
    category: 'ionizer',
    enagicProductUrl: 'https://www.enagic.com/en_US/products/leveluk-sd501dx',
    pdfGuideUrl: 'https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf?v=1767139619',
    secondaryPdfUrl: 'https://www.enagic.com/pdf/1099/Machine_Care_and_Maintenance_Guide.pdf?v=1767139562',
    imageSrc: '/products/sd501-dx.png',
    imageAlt: 'Leveluk SD501 DX Kangen Water® ionizer by Enagic',
  },
  anespa_dx: {
    id: 'anespa_dx',
    slug: 'anespa-dx',
    name: 'Anespa DX',
    category: 'shower',
    enagicProductUrl: 'https://www.enagic.com/en_US/products/anespadx-mineral-ion-water-spa',
    pdfGuideUrl: 'https://www.enagic.com/pdf/1094/ANESPA_DX_Product_Guide.pdf?v=1767139664',
    imageSrc: '/products/anespa-dx.png',
    imageAlt: 'Anespa DX mineral ion water spa system by Enagic',
  },
  emguarde: {
    id: 'emguarde',
    slug: 'emguarde',
    name: 'emGuarde GO™ (Set of 2)',
    category: 'accessory',
    enagicProductUrl: 'https://EmGuarde.com',
    pdfGuideUrl: 'https://www.truelegacyworld.com/_files/ugd/7b12be_ff7cba88b07d461890527e0d74fcea43.pdf',
    imageSrc: '/products/emguarde-go.png',
    imageAlt: 'emGuarde GO portable device set of two by Enagic',
  },
  ukon_sigma: {
    id: 'ukon_sigma',
    slug: 'ukon-sigma',
    name: 'Kangen Ukon® Sigma',
    category: 'supplement',
    enagicProductUrl: 'https://www.enagic.com/en_US/products/ukon-sigma-turmeric-supplement',
    pdfGuideUrl: 'https://www.enagic.com/pdf/1097/Kangen_Ukon_Product_Guide.pdf?v=1767139574',
    imageSrc: '/products/ukon-sigma.png',
    imageAlt: 'Kangen Ukon® Sigma turmeric supplement by Enagic',
  },
  kangen_wagyu: {
    id: 'kangen_wagyu',
    slug: 'kangen-wagyu',
    name: 'Kangen Wagyu™',
    category: 'meat',
    enagicProductUrl: 'https://www.enagic.com/en_US/products/kangen-wagyu',
    pdfGuideUrl: 'https://www.enagic.com/pdf/1098/Kangen_Wagyu_Product_Guide.pdf?v=1766769996',
    imageSrc: '/products/kangen-wagyu.png',
    imageAlt: 'Kangen Wagyu™ premium beef set by Enagic',
  },
  kangen_air: {
    id: 'kangen_air',
    slug: 'kangen-air',
    name: 'Kangen Air',
    category: 'air',
    enagicProductUrl: undefined,
    pdfGuideUrl: undefined,
    imageSrc: '/products/kangen-air.png',
    imageAlt: 'Kangen Air purifier by Enagic',
  },
}
