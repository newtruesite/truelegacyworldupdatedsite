import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SEO } from '@/components/SEO'
import { LeaderPortraitGenerator } from '@/components/leaders/LeaderPortraitGenerator'
import type { LeaderPortraitData } from '@/config/portraitStandard'
import { COUNTRIES } from '@/lib/countries'
import { crmConfigured, submitLeaderApplication } from '@/lib/crm'
import { BadgeCheck, CheckCircle2, ShieldCheck, Sparkles, UsersRound } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

const LANGUAGES = [['en', 'English'], ['es', 'Spanish'], ['fr', 'French'], ['pt', 'Portuguese'], ['zh', 'Mandarin'], ['yue', 'Cantonese'], ['ms', 'Malay'], ['ar', 'Arabic'], ['ru', 'Russian']] as const

export default function LeaderApplicationPage() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [portraitData, setPortraitData] = useState<LeaderPortraitData | null>(null)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (!crmConfigured) { setError('The secure application connection is unavailable. Please try again later.'); return }
    const data = new FormData(event.currentTarget)
    setSubmitting(true)
    try {
      await submitLeaderApplication({
        fullName: String(data.get('fullName') || ''), email: String(data.get('email') || ''),
        phone: String(data.get('phone') || ''), country: String(data.get('country') || ''),
        distributorId: String(data.get('distributorId') || ''), currentRank: String(data.get('currentRank') || ''),
        yearsActive: Number(data.get('yearsActive')), activeTeamSize: Number(data.get('activeTeamSize')),
        sponsorName: String(data.get('sponsorName') || ''), instagramUrl: String(data.get('instagramUrl') || ''),
        regions: String(data.get('regions') || '').split(',').map(item => item.trim()).filter(Boolean),
        languages: data.getAll('languages').map(String), leadershipSummary: String(data.get('leadershipSummary') || ''),
        verifiedDistributor: data.get('verifiedDistributor') === 'on', trueLegacyTeamMember: data.get('trueLegacyTeamMember') === 'on',
        informationAccurate: data.get('informationAccurate') === 'on', consent: data.get('consent') === 'on',
        website: String(data.get('website') || ''),
        portraitStatus: portraitData?.status || 'not_generated',
        portraitFileName: portraitData?.originalFileName || '',
        portraitPromptUsed: portraitData?.promptUsed || '',
        hasApprovedPortrait: portraitData?.status === 'applicant_approved',
      })
      setSubmitted(true)
    } catch {
      setError('We could not submit the application. Confirm every qualification field and try again.')
    } finally { setSubmitting(false) }
  }

  return (
    <div className="page-wrapper bg-black text-white">
      <SEO
        title="Apply to the True Legacy Leader Panel"
        description="Qualified True Legacy distributors can submit their credentials for leader-panel review."
      />
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 md:py-28">
        <div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
          <aside className="lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-[.25em] text-[#2997ff]">Leadership verification</p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">Apply for the leader panel.</h1>
            <p className="mt-5 leading-7 text-[#aeb4c0]">
              The directory is reserved for verified True Legacy leaders. Applications are reviewed before any profile is created or published.
            </p>
            <div className="mt-7 space-y-3">
              {[
                'Active, verifiable Enagic distributor account',
                'Current member of the True Legacy organization',
                'Standardized leader studio portrait matching brand guidelines',
                'Demonstrated leadership, team support, and market activity',
                'Agreement to accurate, professional public information',
              ].map(item => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-4 text-sm leading-6">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs leading-5 text-[#747b88]">
              Submission does not guarantee acceptance. An administrator verifies eligibility, identity, rank, team relationship, and portrait quality.
            </p>
          </aside>

          {submitted ? (
            <section className="rounded-[30px] border border-emerald-300/20 bg-emerald-300/[.06] p-7 sm:p-10">
              <CheckCircle2 className="h-12 w-12 text-emerald-300" />
              <h2 className="mt-5 text-3xl font-black">Application received</h2>
              <p className="mt-4 leading-7 text-[#c3c8d1]">
                Your information and leader portrait details are in the private review queue. The True Legacy team will verify the submitted qualifications before creating or linking a leader account.
              </p>
              {portraitData?.approvedPortraitUrl ? (
                <div className="mt-6 flex items-center gap-4 rounded-2xl border border-emerald-300/20 bg-black/40 p-4">
                  <img
                    src={portraitData.approvedPortraitUrl}
                    alt="Submitted Leader Portrait"
                    className="h-16 w-14 rounded-lg object-cover border border-white/15"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <BadgeCheck className="h-4 w-4 text-[#2997ff]" />
                      Leader Portrait Submitted
                    </p>
                    <p className="mt-0.5 text-[#868c98]">Status: Pending Admin Review</p>
                  </div>
                </div>
              ) : null}
              <Link to="/distributors" className="mt-7 inline-flex min-h-12 items-center rounded-xl border border-white/15 px-5 font-bold hover:bg-white/10 transition">
                Return to the leader directory
              </Link>
            </section>
          ) : (
            <div className="space-y-8">
              {/* Leader Portrait Generator Section */}
              <LeaderPortraitGenerator onPortraitChange={setPortraitData} />

              {/* Candidate Information Form */}
              <form onSubmit={submit} className="rounded-[30px] border border-white/10 bg-white/[.035] p-5 sm:p-8">
                <div className="hidden" aria-hidden="true">
                  <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
                </div>
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/10 text-[#2997ff]">
                    <UsersRound className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-xl font-black">Candidate information</h2>
                    <p className="text-sm text-[#868c98]">All fields are used for private verification.</p>
                  </div>
                </div>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <Field label="Full legal name"><input required name="fullName" minLength={2} maxLength={160} autoComplete="name" className="account-input" /></Field>
                  <Field label="Email"><input required name="email" type="email" maxLength={254} autoComplete="email" className="account-input" /></Field>
                  <Field label="Phone / WhatsApp"><input name="phone" maxLength={50} autoComplete="tel" className="account-input" /></Field>
                  <Field label="Country">
                    <select required name="country" defaultValue="" className="account-input">
                      <option value="">Select country</option>
                      {COUNTRIES.map(country => <option key={country.slug} value={country.slug}>{country.name}</option>)}
                    </select>
                  </Field>
                  <Field label="Enagic distributor ID"><input required name="distributorId" minLength={3} maxLength={50} className="account-input" /></Field>
                  <Field label="Current Enagic rank"><input required name="currentRank" maxLength={80} placeholder="Example: 6A2-4" className="account-input" /></Field>
                  <Field label="Years active"><input required name="yearsActive" type="number" min={0} max={80} className="account-input" /></Field>
                  <Field label="Active team size"><input required name="activeTeamSize" type="number" min={0} max={1000000} className="account-input" /></Field>
                  <Field label="True Legacy sponsor / upline"><input required name="sponsorName" minLength={2} maxLength={160} className="account-input" /></Field>
                  <Field label="Instagram profile URL"><input name="instagramUrl" type="url" placeholder="https://instagram.com/username" className="account-input" /></Field>
                  <Field label="Markets served" hint="Comma-separated"><input required name="regions" placeholder="USA, Colombia, Global" className="account-input" /></Field>
                </div>

                <fieldset className="mt-5">
                  <legend className="text-sm font-bold">Languages served</legend>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {LANGUAGES.map(([value, label]) => (
                      <label key={value} className="flex items-center gap-2 rounded-xl border border-white/10 p-3 text-sm text-[#c9ced7]">
                        <input type="checkbox" name="languages" value={value} />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <Field label="Leadership summary" hint="Minimum 80 characters" className="mt-5">
                  <textarea
                    required
                    name="leadershipSummary"
                    minLength={80}
                    maxLength={3000}
                    rows={7}
                    className="account-input resize-y"
                    placeholder="Describe your True Legacy activity, leadership experience, markets, training contribution, and how you support your team."
                  />
                </Field>

                <fieldset className="mt-6 space-y-3">
                  <legend className="mb-3 text-sm font-black">Required qualification confirmations</legend>
                  <Check name="verifiedDistributor">I have an active, verifiable Enagic distributor account.</Check>
                  <Check name="trueLegacyTeamMember">I am currently part of the True Legacy organization and can identify my sponsor/upline.</Check>
                  <Check name="informationAccurate">The rank, experience, team size, portrait, and contact details above are accurate.</Check>
                  <Check name="consent">I consent to private qualification review and to being contacted about this application.</Check>
                </fieldset>

                {error ? <p role="alert" className="mt-5 rounded-xl border border-rose-300/20 bg-rose-300/[.08] p-4 text-sm text-rose-100">{error}</p> : null}

                <button
                  disabled={submitting}
                  className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 font-black text-slate-950 disabled:opacity-60 transition hover:bg-cyan-300"
                >
                  <Sparkles className="h-4 w-4" />
                  {submitting ? 'Submitting securely…' : 'Submit for leader review'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Field({ label, hint, className = '', children }: { label: string; hint?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block text-sm text-[#c9ced7] ${className}`}>
      <span className="font-bold text-white">{label}</span>
      {hint ? <span className="ml-2 text-xs text-[#747b88]">{hint}</span> : null}
      <span className="mt-2 block">{children}</span>
    </label>
  )
}

function Check({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-[#c9ced7]">
      <input required type="checkbox" name={name} className="mt-1" />
      {children}
    </label>
  )
}

