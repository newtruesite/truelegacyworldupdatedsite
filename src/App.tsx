import { LanguageReset } from "@/components/LanguageReset";
import { AuthProvider } from "@/contexts/AuthContext";
import { EventsLeadCaptureProvider } from "@/contexts/EventsLeadCaptureContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { PdfLeadCaptureProvider } from "@/contexts/PdfLeadCaptureContext";
import { trackPageView } from "@/lib/analytics";
import CountryPage from "@/pages/CountryPage";
import DistributorsPage from "@/pages/DistributorsPage";
import EmGuardePage from "@/pages/EmGuardePage";
import EventsPage from "@/pages/EventsPage";
import HomePage from "@/pages/HomePage";
import K8Page from "@/pages/K8Page";
import LatamDistributorsPage from "@/pages/LatamDistributorsPage";
import LoginPage from "@/pages/LoginPage";
import PdfLibraryPage from "@/pages/PdfLibraryPage";
import ProductsPage from "@/pages/ProductsPage";
import RegionPage from "@/pages/RegionPage";
import SelectCountryPage from "@/pages/SelectCountryPage";
import SettingsPage from "@/pages/SettingsPage";
import TrainingPage from "@/pages/TrainingPage";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect } from "react";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";

function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    trackPageView(pathname);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

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
            path="/distributors"
            element={
              <PageTransitionWrapper>
                <DistributorsPage />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/latam/distributors"
            element={
              <PageTransitionWrapper>
                <LatamDistributorsPage />
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
            path="/events/:country"
            element={
              <PageTransitionWrapper>
                <EventsPage />
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
          {/* Country-scoped training and products — keeps locale (LATAM/Morocco) */}
          <Route
            path="/:countrySlug/training"
            element={
              <PageTransitionWrapper>
                <TrainingPage />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/:countrySlug/products"
            element={
              <PageTransitionWrapper>
                <ProductsPage />
              </PageTransitionWrapper>
            }
          />
          {/* Legacy redirects so /k8 and /emguarde still work */}
          <Route path="/k8" element={<Navigate to="/usa/k8" replace />} />
          <Route
            path="/emguarde"
            element={<Navigate to="/usa/emguarde" replace />}
          />
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
  );
}

export default function App() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    const handleError = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target && target.tagName === "IMG") {
        (target as HTMLImageElement).style.visibility = "hidden";
      }
    };

    // Capture phase listener to catch all image load errors, including future images
    document.addEventListener("error", handleError, true);

    return () => {
      document.removeEventListener("error", handleError, true);
    };
  }, []);

  // Prevent browser from restoring scroll position when navigating between routes
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("scrollRestoration" in window.history)
    )
      return;
    window.history.scrollRestoration = "manual";
  }, []);

  // Global UX: smooth anchor scroll, product img error fallback (navbar stays visible — V20)
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    const anchorHandlers: Array<{ el: Element; handler: (e: Event) => void }> =
      [];
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      const handler = (e: Event) => {
        e.preventDefault();
        const href = (a as HTMLAnchorElement).getAttribute("href");
        if (!href) return;
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      };
      a.addEventListener("click", handler);
      anchorHandlers.push({ el: a, handler });
    });

    document
      .querySelectorAll(".product-card img, .product img")
      .forEach((img) => {
        const image = img as HTMLImageElement;
        image.onerror = function () {
          this.style.visibility = "hidden";
        };
      });

    return () => {
      anchorHandlers.forEach(({ el, handler }) => {
        el.removeEventListener("click", handler);
      });
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageReset />
        <LocaleProvider>
          <PdfLeadCaptureProvider>
            <EventsLeadCaptureProvider>
              <AnimatedRoutes />
            </EventsLeadCaptureProvider>
          </PdfLeadCaptureProvider>
        </LocaleProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
