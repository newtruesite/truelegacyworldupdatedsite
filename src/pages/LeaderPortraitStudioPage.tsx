import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SEO } from '@/components/SEO'
import { LeaderPortraitGenerator } from '@/components/leaders/LeaderPortraitGenerator'
import type { LeaderPortraitData } from '@/config/portraitStandard'
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LeaderPortraitStudioPage() {
  const [portraitData, setPortraitData] = useState<LeaderPortraitData | null>(null)

  const isApproved =
    portraitData?.status === 'applicant_approved' || portraitData?.status === 'admin_approved'

  return (
    <div className="page-wrapper bg-black text-white">
      <SEO
        title="Leader Portrait Studio | True Legacy"
        description="Generate your standardized official True Legacy leader portrait. Upload one photo — the AI handles the rest."
      />
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 md:py-28">
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2997ff]/30 bg-[#2997ff]/10 px-3.5 py-1.5 text-xs font-bold text-[#2997ff]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Official Portrait Standardization Engine</span>
          </div>
          <h1 className="mt-4 text-3xl font-black sm:text-5xl">Leader Portrait Studio</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#aeb4c0] sm:text-base">
            Upload one photo. The system automatically generates your official True Legacy portrait
            that matches the visual standard used across the entire leadership directory.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_.6fr] lg:items-start w-full max-w-full min-w-0">
          {/* Main Generator */}
          <div className="space-y-6 w-full max-w-full min-w-0">
            <LeaderPortraitGenerator
              onPortraitChange={setPortraitData}
              title="Generate Your Leader Portrait"
            />

            {/* Success state after approval */}
            {isApproved && (
              <div className="rounded-2xl border border-emerald-300/30 bg-emerald-300/[0.08] p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Portrait Approved & Ready to Use
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#c3c8d1]">
                      Your portrait has been standardized to the official True Legacy 4:5 studio
                      specification and is ready to be applied to your profile.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <Link
                        to="/app/settings"
                        className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-xs font-black text-slate-950 transition hover:bg-cyan-300"
                      >
                        <UserCheck className="h-4 w-4" />
                        Apply to Your Profile
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
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-28">
            {/* What to expect */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2997ff]">
                What Happens Automatically
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#8f96a3]">
                You upload one photo. The engine handles everything else.
              </p>

              <div className="mt-4 space-y-2.5">
                {[
                  ['Background removed & replaced with official charcoal studio backdrop', true],
                  ['Composition calibrated to 4:5 with correct head scale & crop', true],
                  ['Studio lighting modeled from approved reference portraits', true],
                  ['Identity preserved: face, outfit, accessories — unchanged', true],
                  ['Auto-validated against directory standards before showing result', true],
                  ['Retried up to 3× automatically if quality check fails', true],
                ].map(([label]) => (
                  <div
                    key={String(label)}
                    className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-black/30 p-2.5 text-xs leading-relaxed text-[#c9ced7]"
                  >
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{String(label)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo tips */}
            <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-5">
              <h3 className="text-sm font-bold text-white">Best Photo Tips</h3>
              <div className="mt-3 space-y-1.5 text-xs text-[#8f96a3] leading-relaxed">
                {[
                  'Face clearly visible and well-lit',
                  'You are the only person in the photo',
                  'Wear the outfit you want in the portrait',
                  'Any background is fine — the AI replaces it',
                  'Selfies, outdoor shots, and casual photos all work',
                  'Minimum 400×400px resolution',
                ].map((tip) => (
                  <p key={tip} className="flex items-center gap-2">
                    <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#2997ff]" />
                    {tip}
                  </p>
                ))}
              </div>
            </div>

            {/* Existing leaders */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-cyan-400/[0.06] to-transparent p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2997ff]">
                <Users className="h-4 w-4" />
                <span>Existing Leaders & Distributors</span>
              </div>
              <h4 className="mt-2 text-base font-bold text-white">Update Your Profile Photo</h4>
              <p className="mt-2 text-xs leading-relaxed text-[#8f96a3]">
                Already verified? Generate your portrait here, then apply it directly in account
                settings.
              </p>
              <Link
                to="/app/settings"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:border-[#2997ff]/50 hover:bg-[#2997ff]/20"
              >
                Account Settings
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
