import { motion } from 'framer-motion'
import { PDF_DOCUMENTS, type PdfCategory } from '@/lib/pdfs'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { t } from '@/lib/translations'
import { trackEvent } from '@/lib/analytics'
import { usePdfLeadCapture } from '@/contexts/PdfLeadCaptureContext'

const CATEGORY_ORDER: PdfCategory[] = ['research', 'experts', 'home', 'product']

const CATEGORY_TITLE_KEY: Record<PdfCategory, keyof (typeof t)['en']['pdfLibrary']> = {
  research: 'researchSection',
  experts: 'expertsSection',
  home: 'homeSection',
  product: 'productSection',
}

export default function PdfLibraryPage() {
  const { locale } = useLocaleContext()
  const copy = t[locale].pdfLibrary
  const { openModal } = usePdfLeadCapture()

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    title: copy[CATEGORY_TITLE_KEY[category]],
    items: PDF_DOCUMENTS.filter((doc) => doc.category === category),
  })).filter((group) => group.items.length > 0)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#050b18' }}>
      <main className="flex-1">
        <section className="relative py-20 md:py-24 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.2)_0,transparent_55%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.25)_0,transparent_60%)]" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300 mb-3">
                TRUE LEGACY WORLD
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
                {copy.title}
              </h1>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">{copy.intro}</p>
            </motion.div>

            <div className="space-y-10">
              {grouped.map((group, groupIndex) => (
                <motion.section
                  key={group.category}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + groupIndex * 0.05 }}
                  className="relative"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
                    <h2 className="text-sm md:text-base font-semibold uppercase tracking-[0.3em] text-slate-300">
                      {group.title}
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {group.items.map((doc, index) => (
                      <motion.article
                        key={doc.id}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: 0.05 + index * 0.04 }}
                        className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80 shadow-xl"
                      >
                        <div className="absolute inset-0 opacity-60 mix-blend-screen bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.25)_0,transparent_55%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.35)_0,transparent_60%)]" />
                        <div className="relative p-6 md:p-7 flex flex-col gap-3">
                          <h3 className="text-base md:text-lg font-semibold text-white">{doc.title}</h3>
                          <p className="text-xs text-slate-300/90">
                            {group.category === 'research' &&
                              'Peer-referenced information to help you understand why Kangen Water® is taken seriously by health professionals.'}
                            {group.category === 'experts' &&
                              'Hear directly from doctors, scientists, and nutritionists on how they view Kangen Water®.'}
                            {group.category === 'home' &&
                              'Practical guides for creating a safer, lower-chemical home using Enagic water.'}
                            {group.category === 'product' &&
                              'Official Enagic product literature so you can confidently present the technology.'}
                          </p>
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                trackEvent('pdf_open', {
                                  id: doc.id,
                                  category: group.category,
                                  path: doc.path,
                                  locale,
                                })
                                openModal(doc.path)
                              }}
                              className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-cyan-500/40 hover:bg-cyan-400 transition-colors"
                            >
                              {copy.openPdf}
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </motion.section>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

