import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { PdfLeadCaptureProvider } from '@/contexts/PdfLeadCaptureContext'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { AnimatePresence, motion } from 'framer-motion'
import HomePage from '@/pages/HomePage'
import CountryPage from '@/pages/CountryPage'
import RegionPage from '@/pages/RegionPage'
import TrainingPage from '@/pages/TrainingPage'
import LoginPage from '@/pages/LoginPage'
import SettingsPage from '@/pages/SettingsPage'
import EmGuardePage from '@/pages/EmGuardePage'
import K8Page from '@/pages/K8Page'
import PdfLibraryPage from '@/pages/PdfLibraryPage'
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
  }, [pathname])
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
              <ProtectedRoute>
                <PdfLibraryPage />
              </ProtectedRoute>
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
  return (
    <BrowserRouter>
      <LocaleProvider>
        <PdfLeadCaptureProvider>
          <AnimatedRoutes />
        </PdfLeadCaptureProvider>
      </LocaleProvider>
    </BrowserRouter>
  )
}

