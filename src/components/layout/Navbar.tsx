import TrueLegacyLogo from "@/components/ui/TrueLegacyLogo";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { trackEvent } from "@/lib/analytics";
import { COUNTRIES, getFlagSrcSet } from "@/lib/countries";
import { t } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, Menu, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";

// ── Custom SVG Icon Components ──────────────────────────────
function IconShield({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function IconDroplets({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
    </svg>
  );
}

const COUNTRY_SLUGS = COUNTRIES.map((c) => c.slug);
const DEFAULT_JOTFORM = "/apply";

// Custom hook for scroll detection
function useScroll(threshold: number = 10) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    handleScroll(); // Check initial state
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return scrolled;
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [countriesOpen, setCountriesOpen] = useState(false);
  const [failedFlagSlugs, setFailedFlagSlugs] = useState<Set<string>>(
    new Set(),
  );
  const countriesRef = useRef<HTMLDivElement>(null);
  const scrolled = useScroll(10);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const firstSegment = pathname.slice(1).split("/")[0];
  const isCountryPage = firstSegment && COUNTRY_SLUGS.includes(firstSegment);
  const country = isCountryPage
    ? COUNTRIES.find((c) => c.slug === firstSegment)
    : null;

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("menu-open");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        countriesRef.current &&
        !countriesRef.current.contains(e.target as Node)
      ) {
        setCountriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCountriesOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const goToCountry = (slug: string) => {
    setMenuOpen(false);
    navigate(`/${slug}`);
  };

  const jotformUrl = country?.jotformUrl ?? DEFAULT_JOTFORM;
  const { locale, setLocale: setLocaleOverride } = useLocaleContext();

  // Navigation paths
  const productsPath = country ? `/${country.slug}/products` : "/products";
  const trainingPath = country ? `/${country.slug}/training` : "/training";
  const eventsPath = "/events";

  const distributorsPath =
    country &&
    ["brazil", "mexico", "colombia", "paraguay"].includes(country.slug)
      ? "/latam/distributors"
      : "/distributors";

  // Navigation labels
  const navLabels = {
    home: t[locale].nav_home,
    training: t[locale].nav_training,
    events: t[locale].nav_events,
    community: t[locale].nav_community,
    countries: t[locale].nav_countries,
    products: t[locale].nav_products,
    distributors: t[locale].nav_distributors,
    unlockLegacy: t[locale].unlockLegacy,
    navProductK8: t[locale].navProductK8,
    navProductEmguarde: t[locale].navProductEmguarde,
    login:
      locale === "es"
        ? "Acceso"
        : locale === "fr"
          ? "Connexion"
          : locale === "pt"
            ? "Entrar"
            : "Login",
  };

  // Main navigation links for desktop
  const mainNavLinks = [
    { label: navLabels.home, to: "/" },
    { label: navLabels.training, to: trainingPath },
    { label: navLabels.events, to: eventsPath },
    { label: navLabels.distributors, to: distributorsPath },
    { label: navLabels.products, to: productsPath },
    { label: navLabels.countries, to: "/select-country" },
    {
      label: navLabels.community,
      to: "https://www.facebook.com/groups/truelegacycommunity",
      external: true,
    },
  ];

  return (
    <>
      <header
        className={cn("sticky top-0 z-50 w-full border-b border-transparent", {
          "bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg":
            scrolled,
        })}
        style={{
          background: scrolled ? "rgba(6,11,30,0.95)" : "rgba(6,11,30,0.88)",
          backdropFilter: scrolled
            ? "blur(20px) saturate(180%)"
            : "blur(16px) saturate(180%)",
          WebkitBackdropFilter: scrolled
            ? "blur(20px) saturate(180%)"
            : "blur(16px) saturate(180%)",
          borderColor: scrolled ? "rgba(255,255,255,0.1)" : "transparent",
        }}
      >
        <nav className="relative mx-auto flex h-14 w-full max-w-7xl items-center justify-center px-4 sm:px-6">
          {/* Left: Logo */}
          <div className="absolute left-4 flex items-center">
            <Link to="/" className="flex items-center">
              <TrueLegacyLogo variant="nav" />
            </Link>
          </div>

          {/* Center: Desktop Navigation + Controls */}
          <div className="tl-desktop-nav hidden md:flex items-center justify-center gap-6">
            <div className="flex items-center space-x-1">
              {mainNavLinks.map((link) => {
                if (link.to === "/select-country") {
                  return (
                    <div key={link.to} className="relative" ref={countriesRef}>
                      <button
                        onClick={() => setCountriesOpen(!countriesOpen)}
                        className={cn(
                          "px-3 py-2 text-sm font-medium rounded-md transition-colors inline-flex items-center gap-1",
                          pathname === "/select-country" ||
                            isCountryPage ||
                            countriesOpen
                            ? "text-white bg-white/10"
                            : "text-[#cccccc] hover:text-white hover:bg-white/5",
                        )}
                        aria-haspopup="listbox"
                        aria-expanded={countriesOpen}
                        aria-controls="desktop-countries-dropdown"
                      >
                        <span>{link.label}</span>
                        <svg
                          className={cn(
                            "w-3.5 h-3.5 transition-transform duration-200",
                            countriesOpen && "rotate-180",
                          )}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      <AnimatePresence>
                        {countriesOpen && (
                          <motion.div
                            id="desktop-countries-dropdown"
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[240px] w-max max-w-[min(400px,90vw)] max-h-[60vh] overflow-y-auto rounded-xl border border-white/10 shadow-2xl custom-scrollbar"
                            style={{
                              background: "rgba(6,11,30,0.95)",
                              backdropFilter: "blur(20px) saturate(180%)",
                              WebkitBackdropFilter: "blur(20px) saturate(180%)",
                              overscrollBehavior: "contain",
                            }}
                          >
                            <div
                              className="p-2 grid grid-cols-1 gap-1"
                              role="listbox"
                            >
                              {COUNTRIES.map((c) => (
                                <button
                                  key={c.slug}
                                  onClick={() => {
                                    setCountriesOpen(false);
                                    navigate(`/${c.slug}`);
                                  }}
                                  className={cn(
                                    "flex items-center gap-3 w-full p-2 rounded-lg text-left text-sm transition-colors",
                                    country?.slug === c.slug
                                      ? "bg-white/10 text-white"
                                      : "text-[#cccccc] hover:text-white hover:bg-white/5",
                                  )}
                                  role="option"
                                  aria-selected={country?.slug === c.slug}
                                >
                                  <span className="inline-flex h-5 w-7 shrink-0 overflow-hidden rounded border border-white/20 bg-black">
                                    {failedFlagSlugs.has(c.slug) ? (
                                      <span className="flex h-full w-full items-center justify-center text-[10px] leading-none">
                                        {c.flagEmoji}
                                      </span>
                                    ) : (
                                      <img
                                        {...getFlagSrcSet(c.slug)}
                                        alt=""
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                        onError={() =>
                                          setFailedFlagSlugs((prev) =>
                                            new Set(prev).add(c.slug),
                                          )
                                        }
                                      />
                                    )}
                                  </span>
                                  <span className="font-medium text-left flex-1 break-words leading-tight">
                                    {c.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return link.external ? (
                  <a
                    key={link.to}
                    href={link.to}
                    target="_blank" rel="noopener noreferrer"
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors inline-flex items-center",
                      "text-[#cccccc] hover:text-white hover:bg-white/5",
                    )}
                  >
                    <span>{link.label}</span>
                  </a>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors inline-flex items-center",
                      pathname === link.to
                        ? "text-white bg-white/10"
                        : "text-[#cccccc] hover:text-white hover:bg-white/5",
                    )}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              {/* Language Toggle - Desktop Only */}
              <div className="hidden md:flex items-center gap-0.5 notranslate" translate="no">
                {(["en", "es", "fr", "pt"] as const).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocaleOverride(loc)}
                    className={cn(
                      "px-2 py-1 text-xs font-bold rounded transition-colors notranslate",
                      locale === loc
                        ? "text-white bg-white/10"
                        : "text-[#cccccc] hover:text-white hover:bg-white/5",
                    )}
                    translate="no"
                  >
                    {loc === "en" ? "EN" : loc === "es" ? "ES" : loc === "fr" ? "FR" : "PT"}
                  </button>
                ))}
              </div>

              <Link
                to="/crm"
                onClick={() =>
                  trackEvent("distributor_login_click", {
                    location: "navbar_desktop",
                    locale,
                  })
                }
                className="nav-login-btn hidden min-h-9 items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300 transition-all hover:bg-amber-500/20 hover:border-amber-400/60 shadow-sm shadow-amber-500/10 md:inline-flex"
              >
                <LogIn className="h-3.5 w-3.5 text-amber-400" />
                {navLabels.login}
              </Link>

              {/* CTA Button - Desktop Only */}
              <a
                href={jotformUrl}
                target="_blank" rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("join_click", {
                    location: "navbar_desktop",
                    countrySlug: country?.slug ?? null,
                    locale,
                  })
                }
                className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-md transition-all"
              >
                {country
                  ? navLabels.unlockLegacy
                  : t[locale].nav_join_team}
              </a>
            </div>
          </div>

          {/* Hamburger Button - Mobile Only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="tl-mobile-trigger md:hidden absolute right-4 inline-flex items-center justify-center p-2 rounded-md text-[#cccccc] hover:text-white hover:bg-white/5 transition-colors"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div className="flex w-full flex-col gap-y-4">
          {/* Language Selection */}
          <div className="space-y-2 notranslate" translate="no">
            <span className="px-2 text-xs font-semibold uppercase tracking-wider text-[#86868b]">
              {t[locale].nav_language}
            </span>
            <div className="flex gap-2">
              {(["en", "es", "fr", "pt"] as const).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocaleOverride(loc)}
                  className={cn(
                    "flex-1 min-h-[44px] flex items-center justify-center px-4 py-2 rounded-xl transition-colors font-medium text-sm notranslate",
                    locale === loc
                      ? "text-white bg-white/10 font-bold"
                      : "text-[#cccccc] hover:text-white hover:bg-white/5",
                  )}
                  translate="no"
                >
                  {loc === "en"
                    ? "English"
                    : loc === "es"
                      ? "Español"
                    : loc === "fr"
                      ? "Français"
                      : "Português"}
                </button>
              ))}
            </div>
          </div>

          {/* Main Navigation */}
          <div className="space-y-1">
            <span className="px-2 text-xs font-semibold uppercase tracking-wider text-[#86868b]">
              {t[locale].nav_navigation}
            </span>
            {mainNavLinks.map((link) => {
              if (link.to === "/select-country") return null;
              return link.external ? (
                <a
                  key={link.to}
                  href={link.to}
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center min-h-[48px] px-4 py-3 text-base font-medium text-[#cccccc] hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center min-h-[48px] px-4 py-3 text-base font-medium rounded-xl transition-colors",
                    pathname === link.to
                      ? "text-white bg-white/10"
                      : "text-[#cccccc] hover:text-white hover:bg-white/5",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Products Section */}
          <div className="space-y-1">
            <span className="px-2 text-xs font-semibold uppercase tracking-wider text-[#86868b]">
              {t[locale].nav_duo_package}
            </span>
            <Link
              to={country ? `/${country.slug}/emguarde` : "/emguarde"}
              onClick={() => setMenuOpen(false)}
              className="flex items-center min-h-[48px] gap-3 px-4 py-3 text-base font-medium text-[#2997ff] hover:bg-purple-500/10 rounded-xl transition-colors"
            >
              <IconShield className="text-[#2997ff] shrink-0" />{" "}
              {navLabels.navProductEmguarde}
            </Link>
            <Link
              to={country ? `/${country.slug}/k8` : "/k8"}
              onClick={() => setMenuOpen(false)}
              className="flex items-center min-h-[48px] gap-3 px-4 py-3 text-base font-medium text-[#2997ff] hover:bg-cyan-500/10 rounded-xl transition-colors"
            >
              <IconDroplets className="text-[#2997ff] shrink-0" />{" "}
              {navLabels.navProductK8}
            </Link>
          </div>

          {/* Countries — all with flags */}
          <div className="space-y-2">
            <span className="px-2 text-xs font-semibold uppercase tracking-wider text-[#86868b]">
              {t[locale].nav_countries}
            </span>
            <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[50vh] min-h-0">
              {COUNTRIES.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => goToCountry(c.slug)}
                  className="flex items-start min-h-[44px] gap-3 rounded-xl px-2 py-2.5 text-sm text-[#cccccc] hover:bg-white/5 hover:text-white transition-colors text-left"
                >
                  <span className="inline-flex mt-0.5 h-4 w-6 shrink-0 overflow-hidden rounded border border-white/20 bg-black">
                    {failedFlagSlugs.has(c.slug) ? (
                      <span className="flex h-full w-full items-center justify-center text-[10px] leading-none">
                        {c.flagEmoji}
                      </span>
                    ) : (
                      <img
                        {...getFlagSrcSet(c.slug)}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={() =>
                          setFailedFlagSlugs((prev) =>
                            new Set(prev).add(c.slug),
                          )
                        }
                      />
                    )}
                  </span>
                  <span className="text-sm leading-tight text-left flex-1 break-words">
                    {c.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col gap-2 pt-4">
          <Link
            to="/crm"
            onClick={() => {
              trackEvent("distributor_login_click", {
                location: "navbar_mobile",
                locale,
              });
              setMenuOpen(false);
            }}
            className="nav-login-btn flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-6 py-3 text-base font-bold text-amber-300 transition-colors hover:bg-amber-500/20"
          >
            <LogIn className="h-5 w-5 text-amber-400" />
            {navLabels.login}
          </Link>
          <a
            href={jotformUrl}
            target="_blank" rel="noopener noreferrer"
            onClick={() => {
              trackEvent("join_click", {
                location: "navbar_mobile",
                countrySlug: country?.slug ?? null,
                locale,
              });
              setMenuOpen(false);
            }}
            className="w-full min-h-[52px] flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all"
          >
            {country
              ? navLabels.unlockLegacy
              : t[locale].nav_join_team}
          </a>
        </div>
      </MobileMenu>
    </>
  );
}

// Mobile Menu Component
type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function MobileMenu({ open, children }: MobileMenuProps) {
  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="tl-mobile-menu fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden md:hidden"
          style={{
            background: "rgba(5,16,48,0.98)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          <div
            className="size-full p-4 overflow-y-auto flex flex-col justify-between"
            style={{ touchAction: "pan-y" }}
          >
            <div className="flex-1">{children}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
