import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { PdfLeadCaptureProvider } from '@/contexts/PdfLeadCaptureContext'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { AnimatePresence, motion } from 'framer-motion'
import { trackPageView } from '@/lib/analytics'
import HomePage from '@/pages/HomePage'
import CountryPage from '@/pages/CountryPage'
import RegionPage from '@/pages/RegionPage'
import TrainingPage from '@/pages/TrainingPage'
import LoginPage from '@/pages/LoginPage'
import SettingsPage from '@/pages/SettingsPage'
import EmGuardePage from '@/pages/EmGuardePage'
import K8Page from '@/pages/K8Page'
import PdfLibraryPage from '@/pages/PdfLibraryPage'
import ProductsPage from '@/pages/ProductsPage'
import SelectCountryPage from '@/pages/SelectCountryPage'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    trackPageView(pathname)
  }, [pathname])
  return null
}

function LanguageReset() {
  const location = useLocation()

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    const path = location.pathname.replace(/\/+$/, '')
    const parts = path.split('/')
    const slug = parts[1] || ''

    const LANG_MAP: Record<string, 'en' | 'es' | 'fr'> = {
      colombia: 'es',
      mexico: 'es',
      paraguay: 'es',
      brazil: 'es',
      morocco: 'fr',
      usa: 'en',
      canada: 'en',
      nigeria: 'en',
      india: 'en',
      uae: 'en',
      malaysia: 'en',
    }

    const pageLang = LANG_MAP[slug]
    if (pageLang) {
      window.localStorage.setItem('tl_lang', pageLang)
      ;(window as any).__PAGE_LANG__ = pageLang
      document.documentElement.lang = pageLang
      document.documentElement.setAttribute('data-lang', pageLang)
    }
  }, [location.pathname])

  return null
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Home */}
        <Route
          path="/"
          element={
            <PageTransitionWrapper>
              <HomePage />
            </PageTransitionWrapper>
          }
        />
        {/* Static pages first — so they don't get matched by /:country */}
        <Route
          path="/login"
          element={
            <PageTransitionWrapper>
              <LoginPage />
            </PageTransitionWrapper>
          }
        />
        <Route
          path="/training"
          element={
            <PageTransitionWrapper>
              <TrainingPage />
            </PageTransitionWrapper>
          }
        />
        <Route
          path="/library"
          element={
            <PageTransitionWrapper>
              <PdfLibraryPage />
            </PageTransitionWrapper>
          }
        />
        <Route
          path="/products"
          element={
            <PageTransitionWrapper>
              <ProductsPage />
            </PageTransitionWrapper>
          }
        />
        <Route
          path="/select-country"
          element={
            <PageTransitionWrapper>
              <SelectCountryPage />
            </PageTransitionWrapper>
          }
        />
        <Route
          path="/settings"
          element={
            <PageTransitionWrapper>
              <SettingsPage />
            </PageTransitionWrapper>
          }
        />
        {/* Region route */}
        <Route
          path="/region/:regionId"
          element={
            <PageTransitionWrapper>
              <RegionPage />
            </PageTransitionWrapper>
          }
        />
        {/* Per-country product pages — must be before /:country */}
        <Route
          path="/:countrySlug/k8"
          element={
            <PageTransitionWrapper>
              <K8Page />
            </PageTransitionWrapper>
          }
        />
        <Route
          path="/:countrySlug/emguarde"
          element={
            <PageTransitionWrapper>
              <EmGuardePage />
            </PageTransitionWrapper>
          }
        />
        {/* Legacy redirects so /k8 and /emguarde still work */}
        <Route path="/k8" element={<Navigate to="/usa/k8" replace />} />
        <Route path="/emguarde" element={<Navigate to="/usa/emguarde" replace />} />
        {/* Dynamic country route — matches /usa, /canada, /morocco, etc. */}
        <Route
          path="/:country"
          element={
            <PageTransitionWrapper>
              <CountryPage />
            </PageTransitionWrapper>
          }
        />
        {/* Fallback */}
        <Route
          path="*"
          element={
            <PageTransitionWrapper>
              <HomePage />
            </PageTransitionWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
    </>
  )
}

export default function App() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    const handleError = (event: Event) => {
      const target = event.target as HTMLElement | null
      if (target && target.tagName === 'IMG') {
        ;(target as HTMLImageElement).style.visibility = 'hidden'
      }
    }

    // Capture phase listener to catch all image load errors, including future images
    document.addEventListener('error', handleError, true)

    return () => {
      document.removeEventListener('error', handleError, true)
    }
  }, [])

  // Global UX polish: navbar hide-on-scroll, smooth anchor scroll, product img error fallback
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    const navbar = document.querySelector('nav, header, .navbar') as HTMLElement | null
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      if (!navbar) return
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        navbar.style.transform = 'translateY(-100%)'
        navbar.style.transition = 'transform 0.3s ease'
      } else {
        navbar.style.transform = 'translateY(0)'
      }
      lastScrollY = window.scrollY
    }

    window.addEventListener('scroll', handleScroll)

    const anchorHandlers: Array<{ el: Element; handler: (e: Event) => void }> = []
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      const handler = (e: Event) => {
        e.preventDefault()
        const href = (a as HTMLAnchorElement).getAttribute('href')
        if (!href) return
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' })
        }
      }
      a.addEventListener('click', handler)
      anchorHandlers.push({ el: a, handler })
    })

    document.querySelectorAll('.product-card img, .product img').forEach((img) => {
      const image = img as HTMLImageElement
      image.onerror = function () {
        this.style.visibility = 'hidden'
      }
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      anchorHandlers.forEach(({ el, handler }) => {
        el.removeEventListener('click', handler)
      })
    }
  }, [])

  return (
    <BrowserRouter>
      <LanguageReset />
      <LocaleProvider>
        <PdfLeadCaptureProvider>
          <AnimatedRoutes />
        </PdfLeadCaptureProvider>
      </LocaleProvider>
    </BrowserRouter>
  )
}

