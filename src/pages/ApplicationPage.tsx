import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SEO } from '@/components/SEO'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { COUNTRIES } from '@/lib/countries'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

const INTERESTS = [
  'Product information for myself or my family',
  'K8 + emGuarde GO Duo package',
  'Independent distributor opportunity',
  'Training and team support',
  'Events and community',
]

export default function ApplicationPage() {
  const { locale } = useLocaleContext()
  const [hasReferrer, setHasReferrer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="page-wrapper bg-[#060b1e] text-white">
      <SEO title="True Legacy Interest and Referral Form" description="Tell True Legacy what you are interested in, who referred you, and which distributor should assist you." />
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 md:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Team lead routing</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-5xl">Let’s connect you with the right person.</h1>
        <p className="mt-4 text-slate-300">Tell us what you are interested in and who introduced you. Referral attribution is respected; visitors without a referrer can choose an available distributor.</p>

        {submitted ? (
          <div className="mt-10 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-6">
            <h2 className="text-xl font-semibold">Your routing details are ready.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">The final secure delivery connection is awaiting the team’s approved inbox or CRM. No information was transmitted or stored from this preview.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to={locale === 'es' || locale === 'pt' ? '/latam/distributors' : '/distributors'} className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold hover:bg-cyan-400">Choose a Distributor</Link>
              <button type="button" onClick={() => setSubmitted(false)} className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10">Review Answers</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 space-y-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm text-slate-300">Full name<input required name="fullName" autoComplete="name" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none" /></label>
              <label className="text-sm text-slate-300">Email<input required type="email" name="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none" /></label>
              <label className="text-sm text-slate-300">Phone or WhatsApp<input name="phone" autoComplete="tel" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none" /></label>
              <label className="text-sm text-slate-300">Country<select required name="country" className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a1020] px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"><option value="">Select your country</option>{COUNTRIES.map(country => <option key={country.slug} value={country.slug}>{country.name}</option>)}</select></label>
            </div>

            <fieldset><legend className="text-sm font-semibold text-white">What are you interested in?</legend><div className="mt-3 grid gap-2">{INTERESTS.map(interest => <label key={interest} className="flex items-start gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300"><input required type="radio" name="interest" value={interest} className="mt-1" />{interest}</label>)}</div></fieldset>

            <fieldset><legend className="text-sm font-semibold text-white">Did someone refer you to True Legacy?</legend><div className="mt-3 flex gap-3">{['Yes', 'No'].map(value => <label key={value} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm"><input required type="radio" name="hasReferrer" value={value} onChange={() => setHasReferrer(value)} />{value}</label>)}</div></fieldset>

            {hasReferrer === 'Yes' && <label className="block text-sm text-slate-300">Who referred you?<input required name="referredBy" placeholder="Name, handle, or referral code" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none" /></label>}
            {hasReferrer === 'No' && <label className="block text-sm text-slate-300">Choose a distributor<select required name="selectedDistributor" className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a1020] px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"><option value="">Select a distributor</option><option value="mehdi-cohen">Mehdi Cohen — Global & LATAM</option><option value="ryan-pool">Ryan Pool — Global</option></select><span className="mt-2 block text-xs text-slate-500">Additional verified team profiles can be added as the platform grows.</span></label>}

            <label className="flex items-start gap-3 text-xs leading-5 text-slate-400"><input required type="checkbox" name="consent" className="mt-1" />I consent to having my information routed to the named referrer or selected independent distributor for follow-up. I have reviewed the <Link to="/legal/privacy" className="text-cyan-300 underline">Privacy Policy</Link>.</label>
            <button type="submit" className="w-full rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold text-white hover:bg-cyan-400">Continue</button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  )
}
