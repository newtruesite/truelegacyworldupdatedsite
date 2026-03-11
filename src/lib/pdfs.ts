export type PdfCategory = 'research' | 'experts' | 'home' | 'product'

export interface PdfDocument {
  id: string
  category: PdfCategory
  /** File path under /public */
  path: string
  /** Default (English) title */
  title: string
}

export const PDF_DOCUMENTS: PdfDocument[] = [
  {
    id: 'america-anti-cancer-society-kangen',
    category: 'research',
    path: '/pdfs/america-anti-cancer-society-kangen.pdf',
    title: 'American Anti-Cancer Society & Kangen Water®',
  },
  {
    id: 'doctors-scientists-nutritionists-kangen',
    category: 'experts',
    path: '/pdfs/doctors-scientists-nutritionists-kangen.pdf',
    title: 'Doctors, Scientists & Nutritionists on Kangen Water®',
  },
  {
    id: 'chemical-free-home',
    category: 'home',
    path: '/pdfs/create-a-chemical-free-home.pdf',
    title: 'Create a Chemical-Free Home with Kangen Water®',
  },
  {
    id: 'leveluk-anespa-dx',
    category: 'product',
    path: '/pdfs/leveluk-anespa-dx.pdf',
    title: 'Leveluk & Anespa DX Product Guide',
  },
]

