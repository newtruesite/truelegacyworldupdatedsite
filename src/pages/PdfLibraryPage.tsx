import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function PdfLibraryPage() {
  const { locale } = useLocaleContext()

  // Redirect after a brief moment to show the message
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/training#pdf-guides'
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col" style={{ background: '#050b18', minHeight: '100dvh' }}>
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <section className="relative py-20 md:py-24">
          <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass rounded-2xl border border-white/20 p-8 md:p-12"
              style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.05), rgba(15,23,42,0.8))' }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/20 text-[#2997ff] mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10,9 9,9 8,9" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {locale === 'es' ? 'Biblioteca Movida' : 
                 locale === 'fr' ? 'Bibliothèque Déplacée' :
                 locale === 'pt' ? 'Biblioteca Movida' : 
                 'Library Moved'}
              </h1>
              <p className="text-[#cccccc] text-base leading-relaxed mb-8">
                {locale === 'es' ? 'Nuestra biblioteca de PDFs ahora está integrada en la página de entrenamiento para una mejor experiencia. Serás redirigido automáticamente...' :
                 locale === 'fr' ? 'Notre bibliothèque PDF est maintenant intégrée dans la page de formation pour une meilleure expérience. Vous serez redirigé automatiquement...' :
                 locale === 'pt' ? 'Nossa biblioteca de PDFs agora está integrada na página de treinamento para uma melhor experiência. Você será redirecionado automaticamente...' :
                 'Our PDF library is now integrated into the training page for a better experience. You\'ll be redirected automatically...'}
              </p>
              <Link
                to="/training#pdf-guides"
                className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-md font-semibold text-white transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #1B5A8C, #1e88e5)',
                  boxShadow: '0 2px 8px rgba(27, 90, 140, 0.2)',
                }}
              >
                {locale === 'es' ? 'Ir a Entrenamiento →' :
                 locale === 'fr' ? 'Aller à la Formation →' :
                 locale === 'pt' ? 'Ir para Treinamento →' :
                 'Go to Training →'}
              </Link>
              <p className="mt-4 text-[#cccccc] text-sm">
                {locale === 'es' ? 'Redirigiendo en 3 segundos...' :
                 locale === 'fr' ? 'Redirection dans 3 secondes...' :
                 locale === 'pt' ? 'Redirecionando em 3 segundos...' :
                 'Redirecting in 3 seconds...'}
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

