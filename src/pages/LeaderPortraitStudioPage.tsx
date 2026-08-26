import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SEO } from '@/components/SEO'
import { LeaderPortraitGenerator } from '@/components/leaders/LeaderPortraitGenerator'
import type { LeaderPortraitData } from '@/config/portraitStandard'
import { BadgeCheck, CheckCircle2, ShieldCheck, Sparkles, UserCheck, Users, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LeaderPortraitStudioPage() {
  const [portraitData, setPortraitData] = useState<LeaderPortraitData | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  const handleSaveToProfile = () => {
    setIsSaved(true)
  }

  return (
    <div className="page-wrapper bg-black text-white">
      <SEO
        title="Leader Portrait Studio | True Legacy"
        description="Standardize your leader portrait for the official True Legacy directory using our studio prompt and 4:5 luxury canvas."
      />
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 md:py-28">
        {/* Header section */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2997ff]/30 bg-[#2997ff]/10 px-3.5 py-1.5 text-xs font-bold text-[#2997ff]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Leader Identity & Studio Standard</span>
          </div>
          <h1 className="mt-4 text-3xl font-black sm:text-5xl">Leader Portrait Studio</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#aeb4c0] sm:text-base">
            Whether you are a new applicant or an existing True Legacy leader, use this studio to
            generate your standardized portrait transformation prompt and preview your image in the
            official 4:5 leadership directory format.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.35fr_.65fr] lg:items-start">
          {/* Main Portrait Generator */}
          <div className="space-y-6">
            <LeaderPortraitGenerator onPortraitChange={setPortraitData} />

            {portraitData?.approvedPortraitUrl ? (
              <div className="rounded-2xl border border-emerald-300/30 bg-emerald-300/[0.08] p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Standardized Portrait Ready
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#c3c8d1]">
                      Your portrait has been calibrated to the official True Legacy 4:5 studio
                      specifications.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <Link
                        to="/app/settings"
                        className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-xs font-black text-slate-950 transition hover:bg-cyan-300"
                      >
                        <UserCheck className="h-4 w-4" />
                        Apply to Your Account Settings
                      </Link>
                      <Link
                        to="/leaders/apply"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20"
                      >
                        Submit with Leader Application
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Sidebar Guidelines & Existing Leader Quick Navigation */}
          <aside className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2997ff]">
                Directory Standards
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#8f96a3]">
                Every photo on the True Legacy leadership board follows the same studio criteria to
                maintain world-class visual prestige.
              </p>

              <div className="mt-5 space-y-3">
                {[
                  'Preserves your exact facial features, skin tone, and clothing',
                  'Upper-body or mid-torso centered composition (4:5 ratio)',
                  'Deep charcoal & slate neutral studio gradient backdrop',
                  'Refined studio lighting with clear subject separation',
                  'No filters, distortion, AI hallucinations, or background clutter',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-black/30 p-3 text-xs leading-5 text-[#c9ced7]"
                  >
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-cyan-400/[0.06] to-transparent p-6">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2997ff]">
                <Users className="h-4 w-4" />
                <span>Existing Leaders & Distributors</span>
              </div>
              <h4 className="mt-2 text-base font-bold text-white">
                Manage Profile & Picture
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-[#8f96a3]">
                Already a verified True Legacy distributor? You can update your picture and bio
                directly in your account settings.
              </p>
              <Link
                to="/app/settings"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:border-[#2997ff]/50 hover:bg-[#2997ff]/20"
              >
                Go to Account Settings
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
