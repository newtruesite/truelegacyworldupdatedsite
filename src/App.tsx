import { LanguageReset } from "@/components/LanguageReset";
import { BackToTopButton } from "@/components/layout/BackToTopButton";
import { AppInstallPrompt } from "@/components/pwa/AppInstallPrompt";
import { AppNavigation } from "@/components/pwa/AppNavigation";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { trackPageView } from "@/lib/analytics";
import CountryPage from "@/pages/CountryPage";
import ApplicationPage from "@/pages/ApplicationPage";
import DistributorsPage from "@/pages/DistributorsPage";
import DistributorProfilePage from "@/pages/DistributorProfilePage";
import DistributorLandingPage from "@/pages/DistributorLandingPage";
import { DuoLandingPage } from "@/components/duo/DuoLandingPage";
import { BusinessLandingPage } from "@/components/business/BusinessLandingPage";
import { KangenLandingPage } from "@/components/kangen/KangenLandingPage";
import { EmguardeLandingPage } from "@/components/emguarde/EmguardeLandingPage";
import EmGuardePage from "@/pages/EmGuardePage";
import EventsPage from "@/pages/EventsPage";
import EventsHubPage from "@/pages/EventsHubPage";
import HomePage from "@/pages/HomePage";
import K8Page from "@/pages/K8Page";
import KangenAirPage from "@/pages/KangenAirPage";
import LatamDistributorsPage from "@/pages/LatamDistributorsPage";
import LegalPage from "@/pages/LegalPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProductsPage from "@/pages/ProductsPage";
import RegionPage from "@/pages/RegionPage";
import SelectCountryPage from "@/pages/SelectCountryPage";
import TrainingPage from "@/pages/TrainingPage";
import CrmPage from "@/pages/CrmPage";
import GrowthCenterPage from "@/pages/GrowthCenterPage";
import PhaseFourPage from "@/pages/PhaseFourPage";
import AppHomePage from "@/pages/AppHomePage";
import AppTodayPage from "@/pages/AppTodayPage";
import AppResourcesPage from "@/pages/AppResourcesPage";
import ResourceSharePage from "@/pages/ResourceSharePage";
import AppLibraryPage from "@/pages/AppLibraryPage";
import SagaLibraryPage from "@/pages/SagaLibraryPage";
import AppSharePage from "@/pages/AppSharePage";
import AppBookingsPage from "@/pages/AppBookingsPage";
import AppAccountPage from "@/pages/AppAccountPage";
import LeaderApplicationPage from "@/pages/LeaderApplicationPage";
import LeaderPortraitStudioPage from "@/pages/LeaderPortraitStudioPage";
import BookingPage from "@/pages/BookingPage";
import { GlobalCursorGlow } from "@/components/ui/GlobalCursorGlow";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect } from "react";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useLocation,
    useParams,
} from "react-router-dom";

function LegacyEmanuelaLandingRedirect() {
  const { campaign } = useParams();
  return <Navigate to={`/d/emanuela/${campaign || "business"}`} replace />;
}

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
          <Route path="/app" element={<AppHomePage />} />
          <Route path="/app/today" element={<AppTodayPage />} />
          <Route path="/app/resources" element={<AppResourcesPage />} />
          <Route path="/app/library" element={<AppLibraryPage />} />
          <Route path="/app/saga-library" element={<SagaLibraryPage />} />
          <Route path="/app/share" element={<AppSharePage />} />
          <Route path="/app/bookings" element={<AppBookingsPage />} />
          <Route path="/app/settings" element={<AppAccountPage />} />
          <Route path="/resource/:resourceId/:slug" element={<ResourceSharePage />} />
          <Route path="/book/:slug/:typeSlug" element={<BookingPage />} />
          {/* Static pages first — so they don't get matched by /:country */}
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
            element={<Navigate to="/training" replace />}
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
            path="/duo"
            element={
              <PageTransitionWrapper>
                <DuoLandingPage distributorSlug="mehdi-cohen" />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/kangen"
            element={
              <PageTransitionWrapper>
                <KangenLandingPage distributorSlug="mehdi-cohen" />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/water"
            element={
              <PageTransitionWrapper>
                <KangenLandingPage distributorSlug="mehdi-cohen" />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/emguarde"
            element={
              <PageTransitionWrapper>
                <EmguardeLandingPage distributorSlug="mehdi-cohen" />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/business"
            element={
              <PageTransitionWrapper>
                <BusinessLandingPage distributorSlug="mehdi-cohen" />
              </PageTransitionWrapper>
            }
          />
          <Route path="/d/emanuela-doustova" element={<Navigate to="/d/emanuela" replace />} />
          <Route path="/d/emanuela-doustova/:campaign" element={<LegacyEmanuelaLandingRedirect />} />
          <Route path="/d/emanuela-braj" element={<Navigate to="/d/emanuela" replace />} />
          <Route path="/d/emanuela-braj/:campaign" element={<LegacyEmanuelaLandingRedirect />} />
          <Route
            path="/d/:slug/:campaign"
            element={
              <PageTransitionWrapper>
                <DistributorLandingPage />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/d/:slug"
            element={
              <PageTransitionWrapper>
                <DistributorProfilePage />
              </PageTransitionWrapper>
            }
          />
          <Route path="/crm" element={<CrmPage />} />
          <Route path="/crm/growth" element={<GrowthCenterPage />} />
          <Route path="/crm/platform" element={<PhaseFourPage />} />
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
            path="/events"
            element={
              <PageTransitionWrapper>
                <EventsHubPage />
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
            element={<Navigate to="/app/settings" replace />}
          />
          <Route
            path="/leaders/portrait"
            element={
              <PageTransitionWrapper>
                <LeaderPortraitStudioPage />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/app/portrait"
            element={
              <PageTransitionWrapper>
                <LeaderPortraitStudioPage />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/leaders/apply"
            element={
              <PageTransitionWrapper>
                <LeaderApplicationPage />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/apply"
            element={
              <PageTransitionWrapper>
                <ApplicationPage />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/legal/:document"
            element={
              <PageTransitionWrapper>
                <LegalPage />
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
          <Route
            path="/:countrySlug/kangen-air"
            element={
              <PageTransitionWrapper>
                <KangenAirPage />
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
          <Route
            path="/kangen-air"
            element={<Navigate to="/usa/kangen-air" replace />}
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
                <NotFoundPage />
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
      <LanguageReset />
      <LocaleProvider>
        <GlobalCursorGlow />
        <AnimatedRoutes />
        <AppInstallPrompt />
        <AppNavigation />
        <BackToTopButton />
      </LocaleProvider>
    </BrowserRouter>
  );
}
