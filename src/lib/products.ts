export type ProductId =
  | 'k8'
  | 'sd501'
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
    name: 'Leveluk SD501',
    category: 'ionizer',
    enagicProductUrl: 'https://www.enagic.com/en_US/products/leveluk-sd501',
    pdfGuideUrl: 'https://www.enagic.com/pdf/1096/Kangen_Water_Ionizers_Product_Guide.pdf?v=1767139619',
    secondaryPdfUrl: 'https://www.enagic.com/pdf/1099/Machine_Care_and_Maintenance_Guide.pdf?v=1767139562',
    imageSrc: '/products/sd501.png',
    imageAlt: 'Leveluk SD501 Kangen Water® ionizer by Enagic',
  },
  anespa_dx: {
    id: 'anespa_dx',
    slug: 'anespa-dx',
    name: 'Anespa DX',
    category: 'shower',
    enagicProductUrl: 'https://www.enagic.com/en_US/products/anespa-dx',
    pdfGuideUrl: 'https://www.enagic.com/pdf/1094/ANESPA_DX_Product_Guide.pdf?v=1767139664',
    imageSrc: '/products/anespa-dx.png',
    imageAlt: 'Anespa DX mineral ion water spa system by Enagic',
  },
  emguarde: {
    id: 'emguarde',
    slug: 'emguarde',
    name: 'emGuarde™',
    category: 'accessory',
    enagicProductUrl:
      'https://information.enagic.com/en/introduction?company_id=2&h=65c8bc2eba9f21e83eb4b6aae8ae3fd4&enroller_id=37000004828&sponsor_id=37000004829&representative_id=37000004828&line_rank=0&product_id=1007',
    pdfGuideUrl: 'https://www.truelegacyworld.com/_files/ugd/7b12be_ff7cba88b07d461890527e0d74fcea43.pdf',
    imageSrc: '/assets/images/emguarde-product.png',
    imageAlt: 'emGuarde™ EMF harmonizer by Enagic',
  },
  ukon_sigma: {
    id: 'ukon_sigma',
    slug: 'ukon-sigma',
    name: 'Kangen Ukon® Sigma',
    category: 'supplement',
    enagicProductUrl:
      'https://information.enagic.com/en/introduction?company_id=2&h=65c8bc2eba9f21e83eb4b6aae8ae3fd4&enroller_id=37000004828&sponsor_id=37000004829&representative_id=37000004828&line_rank=0&product_id=2006',
    pdfGuideUrl: 'https://www.enagic.com/pdf/1097/Kangen_Ukon_Product_Guide.pdf?v=1767139574',
    imageSrc: '/products/ukon-sigma.png',
    imageAlt: 'Kangen Ukon® Sigma turmeric supplement by Enagic',
  },
  kangen_wagyu: {
    id: 'kangen_wagyu',
    slug: 'kangen-wagyu',
    name: 'Kangen Wagyu™',
    category: 'meat',
    enagicProductUrl:
      'https://information.enagic.com/en/introduction?company_id=2&h=65c8bc2eba9f21e83eb4b6aae8ae3fd4&enroller_id=37000004828&sponsor_id=37000004829&representative_id=37000004828&line_rank=0&product_id=2115',
    pdfGuideUrl: 'https://www.enagic.com/pdf/1098/Kangen_Wagyu_Product_Guide.pdf?v=1766769996',
    imageSrc: '/products/kangen-wagyu.png',
    imageAlt: 'Kangen Wagyu™ premium beef set by Enagic',
  },
  kangen_air: {
    id: 'kangen_air',
    slug: 'kangen-air',
    name: 'Kangen Air',
    category: 'air',
    enagicProductUrl: 'mailto:kangenair@enagicsg.com',
    pdfGuideUrl: undefined,
    imageSrc: '/products/kangen-air.png',
    imageAlt: 'Kangen Air purifier by Enagic',
  },
}

