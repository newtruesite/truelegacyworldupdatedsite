import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Info,
  Leaf,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Sun,
  Droplets,
  Waves,
} from 'lucide-react'
import TrueLegacyLogo from '@/components/ui/TrueLegacyLogo'
import { SEO } from '@/components/SEO'
import { DistributorBuyButton } from '@/components/products/DistributorBuyButton'
import { Footer } from '@/components/layout/Footer'
import { getLeaderPortrait, getPublicDistributors, submitCrmApplication, type PublicDistributor } from '@/lib/crm'

interface UkonLandingPageProps {
  profile?: PublicDistributor | null
  distributorSlug?: string
}

export function UkonLandingPage({ profile: propProfile, distributorSlug }: UkonLandingPageProps) {
  const [profile, setProfile] = useState<PublicDistributor | null>(propProfile || null)
  const [loadingProfile, setLoadingProfile] = useState(!propProfile)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showFullIngredients, setShowFullIngredients] = useState(false)

  // Form State
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('United States')

  const activeSlug = distributorSlug || 'mehdi-cohen'

  useEffect(() => {
    if (propProfile) {
      setProfile(propProfile)
      setLoadingProfile(false)
      return
    }
    getPublicDistributors()
      .then((distributors) => {
        const found =
          distributors.find((d) => d.slug.toLowerCase() === activeSlug.toLowerCase()) ||
          distributors.find((d) => d.slug === 'mehdi-cohen') ||
          distributors[0]
        setProfile(found || null)
      })
      .finally(() => setLoadingProfile(false))
  }, [propProfile, activeSlug])

  const firstName = useMemo(() => profile?.display_name.split(' ')[0] || 'Leader', [profile])

  const portraitUrl = useMemo(() => {
    if (!profile) return '/leaders/standardized/mehdi-cohen.png'
    return getLeaderPortrait(profile.slug, profile.avatar_url || undefined)
  }, [profile])

  const whatsappMessage = useMemo(() => {
    return encodeURIComponent(
      `Hi ${firstName}, I viewed your Ukon Sigma page and would like to learn more about the product and the options available in my market.`
    )
  }, [firstName])

  const whatsappUrl = useMemo(() => {
    const phoneNum = profile?.phone ? profile.phone.replace(/[^0-9]/g, '') : '14389947844'
    return `https://wa.me/${phoneNum}?text=${whatsappMessage}`
  }, [profile, whatsappMessage])

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!fullName.trim() || fullName.trim().length < 2) {
      setFormError('Please enter your full name.')
      return
    }

    if (!email.trim() && !phone.trim()) {
      setFormError('Please provide an email address or phone number.')
      return
    }

    setSubmitting(true)
    try {
      await submitCrmApplication({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        country: country.trim(),
        interest: 'ukon',
        selectedDistributor: profile?.slug || 'mehdi-cohen',
        hasReferrer: true,
        sourcePath: typeof window !== 'undefined' ? window.location.pathname : `/d/${activeSlug}/ukon`,
        consent: true,
        privacyVersion: '2026-08-phase-1',
        referredBy: profile?.display_name || 'True Legacy Leader',
      })
      setFormSuccess(true)
    } catch {
      setFormError('Unable to submit request right now. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const faqs = [
    {
      q: 'What is Ukon?',
      a: 'Ukon is the Japanese word commonly used for turmeric. Enagic’s formula includes turmeric and wild turmeric ingredients within a softgel dietary supplement.',
    },
    {
      q: 'Where is Enagic’s Ukon grown?',
      a: 'Enagic states that its Spring Ukon is grown on dedicated farms in Yanbaru, in northern Okinawa, Japan.',
    },
    {
      q: 'Where is Ukon Sigma produced?',
      a: 'The official Enagic product information identifies the supplement as made in Japan.',
    },
    {
      q: 'How many capsules are included?',
      a: 'The referenced US product contains 100 capsules. Packaging may vary by country, so confirm the label for your market.',
    },
    {
      q: 'What is the serving size?',
      a: 'The official US supplement-facts panel lists a serving size of three capsules. This is serving information, not personalized medical advice. Always follow the label supplied with your product.',
    },
    {
      q: 'Is Ukon Sigma vegan?',
      a: 'Do not label it vegan. The official ingredient list includes beeswax.',
    },
    {
      q: 'Is the capsule made from gelatin?',
      a: 'The official Enagic reference describes carrageenan, a seaweed derivative, as an ingredient in the capsule coating. However, visitors should review the complete current product label for all ingredients and dietary restrictions.',
    },
    {
      q: 'Does Ukon Sigma treat inflammation or disease?',
      a: 'No medical treatment claim should be made. Ukon Sigma is sold as a dietary supplement and is not intended to diagnose, treat, cure, or prevent disease.',
    },
    {
      q: 'Can I take Ukon Sigma with medication?',
      a: 'The page must not give individualized medical advice. Visitors taking medication or managing a health condition should speak with a qualified healthcare professional before use.',
    },
    {
      q: 'Is it available in my country?',
      a: 'Availability, formulation, packaging, purchasing programs, and price can vary by market. Contact the distributor who shared this page to confirm current options.',
    },
    {
      q: 'Is recurring delivery available?',
      a: 'Enagic offers an optional Ukon DD program in select markets. Recurring delivery is optional, and billing and cancellation terms are disclosed prior to enrollment.',
    },
    {
      q: 'How can I order?',
      a: 'Contact the verified distributor shown on this page. They can confirm availability, current pricing, purchase options, and the correct official ordering process for your market.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#050811] text-white selection:bg-amber-500 selection:text-black">
      <SEO
        title={`Kangen Ukon Sigma | Okinawan Turmeric | ${profile?.display_name || 'True Legacy'}`}
        description={`Explore Kangen Ukon Sigma, Enagic’s turmeric-based dietary supplement produced in Japan, and connect with ${profile?.display_name || 'your advisor'} for product information and availability.`}
      />

      {/* Turmeric Gold & Okinawan Ambient Glowing Background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[700px] overflow-hidden">
        <div className="absolute left-1/2 -top-40 h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.15)_0%,rgba(16,185,129,0.05)_45%,transparent_70%)] blur-3xl" />
        <div className="absolute left-1/4 top-32 h-[350px] w-[350px] rounded-full bg-amber-500/10 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 top-48 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* 1. SIMPLIFIED HEADER (No distracting global nav links) */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050811]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              to={`/d/${activeSlug}`}
              className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:border-amber-400/50 hover:bg-amber-500/10 transition-all"
              title={`Return to ${firstName}'s profile`}
            >
              <ArrowLeft className="h-4 w-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <TrueLegacyLogo />
          </div>

          <div className="flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-emerald-600/20 px-4 py-2 text-xs font-bold text-amber-300 hover:border-amber-300 hover:from-amber-500/30 hover:to-emerald-600/30 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            >
              Ask {firstName}
            </a>
          </div>
        </div>
      </header>

      {/* 2. PREMIUM PRODUCT HERO */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Column: Story Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                PREMIUM TURMERIC FORMULA FROM OKINAWA, JAPAN
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.08]">
                Kangen Ukon{' '}
                <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-400 bg-clip-text text-transparent">
                  Sigma
                </span>
              </h1>

              <p className="mt-3 text-lg font-extrabold text-amber-200/90 sm:text-xl">
                Turmeric Heritage. Japanese Precision. A Formula Made With Intention.
              </p>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#cccccc] sm:text-lg">
                Discover Enagic’s premium turmeric-based dietary supplement, produced in Japan with Spring Ukon, Autumn Ukon, supporting oils, vitamins, and a patented softgel formulation.
              </p>

              {/* Personalized Referral Attribution Line */}
              {profile && (
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#86868b]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Shared personally with you by <strong className="text-white">{profile.display_name}</strong></span>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => scrollToSection('origin')}
                  className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-7 py-4 text-sm font-black text-slate-950 shadow-[0_10px_35px_rgba(245,158,11,0.35)] hover:from-amber-400 hover:to-amber-500 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Explore Ukon Sigma
                  <ChevronRight className="h-4 w-4" />
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-4 text-sm font-bold text-white hover:border-amber-400/50 hover:bg-white/[0.08] transition-all"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-400" />
                  Ask {firstName}
                </a>
              </div>

              <p className="mt-6 text-xs text-[#86868b] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                Dietary supplement · 100 capsules · Made in Japan
              </p>
            </motion.div>

            {/* Right Column: Product Bottle & Softgel Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md rounded-[32px] border border-amber-500/30 bg-gradient-to-b from-amber-950/30 via-slate-900/50 to-black p-6 sm:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-md">
                <div className="absolute -top-3.5 right-6 rounded-full border border-amber-400/40 bg-[#050811] px-4 py-1 text-[11px] font-bold text-amber-300 shadow-lg">
                  Made in Japan · Enagic®
                </div>

                <div className="relative my-6 flex justify-center items-center min-h-[280px]">
                  <div className="absolute inset-0 rounded-full bg-amber-500/15 blur-2xl animate-pulse pointer-events-none" />
                  
                  <img
                    src="/products/ukon-sigma.png"
                    alt="Enagic Kangen Ukon Sigma Dietary Supplement Bottle"
                    className="relative z-10 h-72 sm:h-80 w-auto object-contain drop-shadow-[0_20px_45px_rgba(245,158,11,0.35)] transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="space-y-2 border-t border-white/10 pt-5 text-center">
                  <h3 className="text-xl font-black text-white">Kangen Ukon® Sigma</h3>
                  <p className="text-xs text-[#cccccc]">Yanbaru Okinawan Turmeric · Patented Softgel</p>

                  <div className="pt-3">
                    <DistributorBuyButton
                      profile={profile}
                      productId="ukon_sigma"
                      label="Order Ukon® Sigma"
                      className="w-full justify-center"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT TRUST STRIP */}
      <section className="py-6 border-y border-white/10 bg-[#080d1e]/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-[#cccccc] max-w-5xl mx-auto">
            <span className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-emerald-400" />
              Grown in Okinawa
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-400" />
              Produced in Japan
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Patented Softgel
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              100 Capsules
            </span>
            <span className="flex items-center gap-2">
              <Info className="h-4 w-4 text-amber-400" />
              Transparent Supplement Facts
            </span>
          </div>
        </div>
      </section>

      {/* 4. OKINAWA AND YANBARU ORIGIN STORY */}
      <section id="origin" className="py-16 sm:py-24 border-t border-white/10 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
                <Leaf className="h-3.5 w-3.5" />
                FROM THE NORTHERN LAND OF OKINAWA
              </div>

              <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl lg:text-5xl leading-tight">
                Grown in Yanbaru, Known as Nature’s Treasure
              </h2>

              <p className="mt-5 text-base leading-relaxed text-[#cccccc]">
                Enagic’s Ukon begins in Yanbaru, the northern region of Okinawa often described in Japan as “nature’s treasure.”
              </p>

              <p className="mt-4 text-base leading-relaxed text-[#cccccc]">
                Spring Ukon grown exclusively for Enagic is cultivated on dedicated farms in this region. The location, cultivation, harvesting, and nearby production process are central to the story behind Kangen Ukon Sigma.
              </p>

              <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <span>Product formulation and availability may vary by market. Refer to the label supplied with your product.</span>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-black p-6 sm:p-8 shadow-2xl">
                <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-2xl bg-black/50 p-4 flex items-center justify-center">
                  <img
                    src="/products/ukon-sigma.png"
                    alt="Yanbaru Okinawa Turmeric Product Story"
                    className="h-full w-auto object-contain drop-shadow-2xl"
                  />
                </div>
                <div className="mt-5 flex items-center justify-between text-xs text-[#cccccc]">
                  <span className="font-bold text-white">Yanbaru Region, Okinawa</span>
                  <span className="text-emerald-400">Dedicated Enagic Farms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHAT MAKES THE FORMULATION DIFFERENT */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#060a18]/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">THE FORMULATION</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">More Than Turmeric Alone</h2>
            <p className="mt-3 text-sm text-[#cccccc]">
              Kangen Ukon Sigma combines turmeric ingredients with selected oils, vitamins, and a patented softgel system in a formula produced in Japan.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Panel 1 */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition-all hover:border-amber-400/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-400/30">
                <Sun className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-black text-white">Spring and Autumn Ukon</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#cccccc]">
                The formulation includes turmeric and wild turmeric rhizome ingredients associated with Enagic’s Okinawan Ukon story.
              </p>
            </div>

            {/* Panel 2 */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition-all hover:border-emerald-400/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-400/30">
                <Waves className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-black text-white">Processed With Kangen Water Technology</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#cccccc]">
                Enagic states that Spring and Autumn Ukon are cleansed and sanitized at its Ukon factory using Strong Kangen Water and Strong Acidic Water.
              </p>
            </div>

            {/* Panel 3 */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition-all hover:border-amber-400/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-400/30">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-black text-white">Patented Softgel Formulation</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#cccccc]">
                The softgel combines Ukon with ingredients including olive oil, perilla oil, flaxseed oil, tocotrienols, and a carrageenan-based capsule coating.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INGREDIENT STORY */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">INGREDIENT DISCLOSURE</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">A Carefully Composed Formula</h2>
            <p className="mt-3 text-sm text-[#cccccc]">
              Every major ingredient included in the official Enagic formulation.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h4 className="font-bold text-amber-300 text-base">Turmeric & Wild Turmeric</h4>
              <p className="mt-1.5 text-xs text-[#cccccc]">The foundation of the Ukon formula.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h4 className="font-bold text-amber-300 text-base">Turmeric Oil</h4>
              <p className="mt-1.5 text-xs text-[#cccccc]">Included alongside turmeric powder in official supplement facts.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h4 className="font-bold text-amber-300 text-base">Olive Oil</h4>
              <p className="mt-1.5 text-xs text-[#cccccc]">One of the supporting oils used in softgel formulation.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h4 className="font-bold text-amber-300 text-base">Perilla Oil</h4>
              <p className="mt-1.5 text-xs text-[#cccccc]">A plant-derived oil included in the ingredient blend.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h4 className="font-bold text-amber-300 text-base">Flaxseed Oil</h4>
              <p className="mt-1.5 text-xs text-[#cccccc]">Included as part of the supporting oil composition.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h4 className="font-bold text-amber-300 text-base">Evening Primrose Oil</h4>
              <p className="mt-1.5 text-xs text-[#cccccc]">Listed among the formulation’s ingredients.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h4 className="font-bold text-amber-300 text-base">Tocotrienols & Vitamin E</h4>
              <p className="mt-1.5 text-xs text-[#cccccc]">Antioxidant nutrients included in the formulation.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h4 className="font-bold text-amber-300 text-base">B Vitamins & Vitamin C</h4>
              <p className="mt-1.5 text-xs text-[#cccccc]">Includes vitamins B1, B2, B12, niacinamide, folic acid, and vitamin C.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. OFFICIAL SUPPLEMENT FACTS */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#060a18]/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">SUPPLEMENT FACTS</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Know Exactly What You Are Taking</h2>
            <p className="mt-3 text-sm text-[#cccccc]">
              Transparency matters. Review the official serving information and ingredient label before using any dietary supplement.
            </p>
          </div>

          {/* Official Panel Container */}
          <div className="mt-10 rounded-3xl border border-amber-500/30 bg-black/80 p-6 sm:p-8 shadow-2xl">
            <div className="border-b border-white/20 pb-4">
              <h3 className="text-2xl font-black text-white">Supplement Facts</h3>
              <p className="text-xs text-[#cccccc]">Serving Size: 3 capsules · Servings Per Container: 33 (100 capsules net weight 44g)</p>
            </div>

            <div className="divide-y divide-white/10 text-xs sm:text-sm">
              <div className="py-3 flex justify-between font-bold text-white">
                <span>Amount Per Serving</span>
                <span>% Daily Value</span>
              </div>
              <div className="py-2.5 flex justify-between text-[#cccccc]">
                <span>Turmeric Powder</span>
                <span className="font-mono text-white">360 mg*</span>
              </div>
              <div className="py-2.5 flex justify-between text-[#cccccc]">
                <span>Turmeric Oil</span>
                <span className="font-mono text-white">30 mg*</span>
              </div>
              <div className="py-2.5 flex justify-between text-[#cccccc]">
                <span>Rice Oil Extract</span>
                <span className="font-mono text-white">30 mg*</span>
              </div>
              <div className="py-2.5 flex justify-between text-[#cccccc]">
                <span>Tocotrienols</span>
                <span className="font-mono text-white">4.8 mg*</span>
              </div>
              <div className="py-2.5 flex justify-between text-[#cccccc]">
                <span>Vitamin B2 (Riboflavin)</span>
                <span className="font-mono text-white">15 mg (1,071%)</span>
              </div>
              <div className="py-2.5 flex justify-between text-[#cccccc]">
                <span>Vitamin E (d-alpha-tocopherol)</span>
                <span className="font-mono text-white">10.08 mg (67%)</span>
              </div>
              <div className="py-2.5 flex justify-between text-[#cccccc]">
                <span>Vitamin B1 (Thiamine Mononitrate)</span>
                <span className="font-mono text-white">3 mg (250%)</span>
              </div>
              <div className="py-2.5 flex justify-between text-[#cccccc]">
                <span>Niacinamide</span>
                <span className="font-mono text-white">3 mg (19%)</span>
              </div>
              <div className="py-2.5 flex justify-between text-[#cccccc]">
                <span>Folic Acid</span>
                <span className="font-mono text-white">0.09 mg (23%)</span>
              </div>
              <div className="py-2.5 flex justify-between text-[#cccccc]">
                <span>Vitamin B12 (Cyanocobalamin)</span>
                <span className="font-mono text-white">0.03 mg (1,250%)</span>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-[#86868b]">* Daily Value not established.</p>

            {/* Collapsible Complete Ingredient List */}
            <div className="mt-6 border-t border-white/10 pt-4">
              <button
                onClick={() => setShowFullIngredients(!showFullIngredients)}
                className="flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors"
              >
                <span>{showFullIngredients ? 'Hide Complete Ingredient List' : 'View Complete Ingredient List'}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFullIngredients ? 'rotate-180' : ''}`} />
              </button>

              {showFullIngredients && (
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-[#cccccc] leading-relaxed">
                  Turmeric rhizome, wild turmeric rhizome, olive oil, processed starch, starch, carrageenan, glycerin, edible vegetable oil including perilla oil, sorbitol, flaxseed oil, rice oil extract, evening primrose oil, glycerin-fatty acid ester, beeswax, riboflavin, d-alpha-tocopherol, ascorbic acid, thiamine mononitrate, niacinamide, sodium citrate, citric acid, folic acid, and cyanocobalamin.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 8. FROM FARM TO SOFTGEL PROCESS */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">PRODUCTION STORY</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">From Okinawa to the Finished Softgel</h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 relative">
              <span className="text-3xl font-black text-amber-400/40">01</span>
              <h4 className="mt-2 font-bold text-white text-base">Cultivated</h4>
              <p className="mt-2 text-xs text-[#cccccc]">Spring Ukon is grown for Enagic on dedicated farms in Yanbaru, Okinawa.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 relative">
              <span className="text-3xl font-black text-amber-400/40">02</span>
              <h4 className="mt-2 font-bold text-white text-base">Harvested</h4>
              <p className="mt-2 text-xs text-[#cccccc]">The turmeric is harvested and transported for processing near the growing region.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 relative">
              <span className="text-3xl font-black text-amber-400/40">03</span>
              <h4 className="mt-2 font-bold text-white text-base">Cleansed & Prepared</h4>
              <p className="mt-2 text-xs text-[#cccccc]">Enagic states that Spring and Autumn Ukon are cleansed using its water technologies.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 relative">
              <span className="text-3xl font-black text-amber-400/40">04</span>
              <h4 className="mt-2 font-bold text-white text-base">Formulated in Japan</h4>
              <p className="mt-2 text-xs text-[#cccccc]">The turmeric ingredients, supporting oils, and vitamins are brought together in Japan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. QUALITY AND ENAGIC CREDIBILITY */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#060a18]/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">BACKED BY ENAGIC</p>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Japanese Manufacturing With Global Quality Systems</h2>
              <p className="mt-4 text-base text-[#cccccc] leading-relaxed">
                Kangen Ukon Sigma is part of Enagic’s broader product portfolio and is produced in Japan.
              </p>

              <div className="mt-6 space-y-3 text-xs sm:text-sm text-[#cccccc]">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Produced in Japan</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Official Enagic product</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Transparent ingredient labeling</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Manufacturer information available</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>International Enagic support network</span>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="https://www.enagic.com/en_US/products/ukon-sigma-turmeric-supplement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-xs font-bold text-white hover:bg-white/[0.08] transition-all"
                >
                  View Official Enagic Product Information <ExternalLink className="h-3.5 w-3.5 text-amber-400" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="rounded-3xl border border-white/10 bg-black/60 p-6 text-center">
                <img
                  src="/products/ukon-sigma.png"
                  alt="Enagic Ukon Sigma Quality Certification"
                  className="h-64 w-auto object-contain mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. IMPORTANT PRODUCT TRANSPARENCY */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-amber-400/30 bg-amber-400/5 p-6 sm:p-8">
            <h3 className="text-xl font-black text-amber-300">Before Adding Ukon Sigma to Your Routine</h3>
            <p className="mt-2 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              Ukon Sigma is a dietary supplement, not a medication. Individual needs vary, and supplements are not a substitute for a balanced diet, medical care, or prescribed treatment.
            </p>

            <ul className="mt-5 space-y-2 text-xs text-[#cccccc] list-disc list-inside">
              <li>Read the complete product label before use.</li>
              <li>Follow the directions printed on the market-specific package.</li>
              <li>Review the full ingredient list for personal sensitivities or dietary restrictions.</li>
              <li>Speak with a qualified healthcare professional if you are pregnant, nursing, managing a health condition, or taking medication.</li>
              <li>Stop using the product and seek appropriate professional advice if you experience an adverse reaction.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 11. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#060a18]/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">FAQS</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Questions About Ukon Sigma</h2>
          </div>

          <div className="mt-12 space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-white hover:text-amber-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${openFaq === index ? 'rotate-180 text-amber-400' : 'text-[#86868b]'}`} />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-xs text-[#cccccc] leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. PERSONAL DISTRIBUTOR GUIDANCE */}
      <section className="py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10 text-center sm:text-left grid gap-8 sm:grid-cols-12 items-center">
            <div className="sm:col-span-4 flex justify-center">
              <img
                src={portraitUrl}
                alt={`${profile?.display_name || firstName} profile`}
                className="h-28 w-28 rounded-2xl object-cover border-2 border-amber-400/40 shadow-xl"
              />
            </div>
            <div className="sm:col-span-8 space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">YOUR PERSONAL PRODUCT GUIDE</p>
              <h3 className="text-2xl font-black text-white">Explore Ukon Sigma With {firstName}</h3>
              <p className="text-xs text-[#cccccc] leading-relaxed">
                {profile?.slug === 'mehdi-cohen' ? (
                  `I shared Ukon Sigma with you because the story behind this product goes far beyond placing turmeric into a capsule. It begins with the land of Okinawa, continues through Enagic’s production process, and ends with a formula that is transparent about what it contains. My role is to help you understand the product and answer your questions.`
                ) : (
                  `${firstName} can help you understand Ukon Sigma, confirm current availability in your market, and guide you through the official purchasing options.`
                )}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-400 transition-all"
                >
                  Ask {firstName} About Ukon Sigma
                </a>
                <Link
                  to={`/d/${activeSlug}`}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-all"
                >
                  View {firstName}’s Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. FINAL CTA */}
      <section className="py-20 sm:py-28 border-t border-white/10 relative overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15),transparent_60%)]" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">EXPLORE YOUR OPTIONS</p>
          <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl lg:text-6xl tracking-tight leading-tight">
            Ready to Learn More About Ukon Sigma?
          </h2>
          <p className="mt-6 text-base text-[#cccccc] max-w-2xl mx-auto leading-relaxed">
            Ask your verified distributor about current availability, market-specific product information, pricing, and official purchasing options.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-sm font-black text-slate-950 shadow-[0_10px_35px_rgba(245,158,11,0.35)] hover:from-amber-400 hover:to-amber-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              Message {firstName}
            </a>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.04] px-7 py-4 text-sm font-bold text-white hover:border-amber-400/50 hover:bg-white/[0.08] transition-all cursor-pointer"
            >
              Request Ukon Sigma Information
            </button>
          </div>

          <p className="mt-6 text-xs text-[#86868b]">No exaggerated promises. Just clear product information and personal guidance.</p>
        </div>
      </section>

      {/* 14. SUPPLEMENT DISCLAIMER */}
      <section className="py-8 border-t border-white/10 bg-[#04060d]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] leading-relaxed text-[#71717a]">
            Kangen Ukon Sigma is a dietary supplement and is not intended to diagnose, treat, cure, or prevent any disease. Statements about dietary supplements may not have been evaluated by the U.S. Food and Drug Administration or other local medical authorities. Product formulation, packaging, labeling, availability, and permitted claims vary by country. Read the product label and consult an appropriate healthcare professional when necessary.
          </p>
        </div>
      </section>

      {/* Inquiry Form Modal */}
      <AnimatePresence>
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-[#080d21] p-6 sm:p-8 shadow-2xl"
            >
              {formSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Thank You!</h3>
                  <p className="text-sm text-[#cccccc] leading-relaxed">
                    Your inquiry for Kangen Ukon® Sigma has been received. {profile?.display_name || 'Your advisor'} will contact you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setShowModal(false)
                      setFormSuccess(false)
                    }}
                    className="mt-4 rounded-xl bg-amber-400 px-6 py-2.5 text-xs font-black text-slate-950"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">UKON SIGMA INQUIRY</p>
                    <h3 className="mt-1 text-2xl font-black text-white">Connect with {profile?.display_name || 'Advisor'}</h3>
                    <p className="mt-1 text-xs text-[#cccccc]">
                      Ask questions about Kangen Ukon® Sigma availability, formulation, or ordering in your country.
                    </p>
                  </div>

                  {formError && (
                    <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs text-rose-300">
                      {formError}
                    </p>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. sarah@example.com"
                        className="w-full h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United States"
                      className="w-full h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="w-1/2 h-12 rounded-xl border border-white/10 bg-white/5 font-bold text-xs text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-1/2 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 font-black text-xs text-slate-950 disabled:opacity-50"
                    >
                      {submitting ? 'Sending...' : 'Send Inquiry'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
