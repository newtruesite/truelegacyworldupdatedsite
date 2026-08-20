import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SEO } from '@/components/SEO'
import { Link, Navigate, useParams } from 'react-router-dom'

type LegalDocument = {
  title: string
  description: string
  sections: Array<{ heading: string; paragraphs: string[] }>
}

const DOCUMENTS: Record<string, LegalDocument> = {
  privacy: {
    title: 'Privacy Policy',
    description: 'How True Legacy World handles information submitted through its website and team application process.',
    sections: [
      { heading: 'Information we collect', paragraphs: ['We may collect contact details, location, product or business interests, the name of the person who referred you, and the distributor you select. We also receive basic technical information needed to operate and protect the website.'] },
      { heading: 'How information is used', paragraphs: ['Information is used to respond to requests, route inquiries to an appropriate True Legacy distributor, maintain team attribution, provide requested education, and improve the platform. We do not sell personal information.'] },
      { heading: 'Referral and distributor routing', paragraphs: ['When a referrer is identified, the platform may associate an inquiry with that person or their team. When no referrer is identified, the visitor may select an available distributor.'] },
      { heading: 'Service providers and retention', paragraphs: ['Forms, scheduling, email, hosting, and future analytics providers may process information on our behalf. Information is retained only as long as reasonably needed for the purposes described here or as required by law.'] },
      { heading: 'Your choices', paragraphs: ['You may request access, correction, or deletion of information by contacting the distributor who assisted you or through the distributor directory. Do not submit sensitive medical or financial information through general website forms.'] },
      { heading: 'Important review note', paragraphs: ['This is a working platform policy prepared for operational review and should be reviewed by qualified counsel for the jurisdictions in which True Legacy operates.'] },
    ],
  },
  terms: {
    title: 'Terms of Use',
    description: 'Basic terms governing use of the True Legacy World team platform.',
    sections: [
      { heading: 'Purpose of the platform', paragraphs: ['True Legacy World provides product education, community information, event details, training resources, and routing to independent distributors. Content is informational and may change as products, markets, and policies change.'] },
      { heading: 'No professional advice', paragraphs: ['Website content is not medical, legal, tax, or financial advice. Consult an appropriate licensed professional before making decisions that require professional guidance.'] },
      { heading: 'Independent distributor relationship', paragraphs: ['True Legacy World and the distributors shown on this platform are independent from Enagic. Nothing on this website creates employment, agency, partnership, or a guarantee of acceptance as an Enagic distributor.'] },
      { heading: 'Acceptable use', paragraphs: ['Do not misuse the platform, attempt unauthorized access, copy protected training content, submit false referral information, or use member resources in a way that violates applicable law or Enagic policy.'] },
      { heading: 'Third-party services', paragraphs: ['The website may link to Enagic, Jotform, Zoom, social networks, scheduling providers, and distributor websites. Their own terms and privacy policies apply.'] },
      { heading: 'Important review note', paragraphs: ['These working terms are provided for review and should be finalized by qualified counsel before the platform expands its member, payment, or data-processing features.'] },
    ],
  },
  medical: {
    title: 'Health and Medical Disclaimer',
    description: 'Important limitations concerning health and product information on True Legacy World.',
    sections: [
      { heading: 'Educational information only', paragraphs: ['Product information is provided for general education and is not intended to diagnose, treat, cure, prevent, or mitigate any disease or medical condition.'] },
      { heading: 'Consult a qualified professional', paragraphs: ['Do not delay or discontinue medical treatment because of information on this website. Speak with a licensed healthcare professional about personal health questions, medications, and use of any wellness product.'] },
      { heading: 'Individual experiences', paragraphs: ['Personal experiences are individual opinions and are not proof of typical results. True Legacy does not endorse medical, curative, or treatment claims for Enagic or emGuarde products.'] },
      { heading: 'Official product information', paragraphs: ['Product specifications, intended uses, warnings, and availability should be confirmed through current official manufacturer materials and the applicable local market.'] },
    ],
  },
  earnings: {
    title: 'Earnings Disclosure',
    description: 'Important information about the Enagic independent distributor opportunity and individual results.',
    sections: [
      { heading: 'No earnings guarantee', paragraphs: ['There is no guarantee that a participant will earn income. Results vary widely and depend on individual effort, skill, sales activity, expenses, market conditions, eligibility, and compliance with the current Enagic compensation plan.'] },
      { heading: 'No projections', paragraphs: ['Examples, goals, ranks, or personal stories must not be interpreted as promises, typical outcomes, or income projections. Prospective distributors should review Enagic’s current official compensation materials and average gross compensation statement.'] },
      { heading: 'Business costs and responsibility', paragraphs: ['Independent distributors are responsible for understanding possible expenses, taxes, legal obligations, and local requirements. Consider obtaining independent professional advice before starting a business.'] },
      { heading: 'Product-based model', paragraphs: ['Enagic describes its model as product-focused, with compensation based on eligible product sales rather than recruitment alone. Current terms and eligibility are controlled by Enagic and may vary by market.'] },
    ],
  },
  distributor: {
    title: 'Independent Distributor Disclosure',
    description: 'The relationship between True Legacy World, its members, and Enagic.',
    sections: [
      { heading: 'Independent status', paragraphs: ['True Legacy World is a team education and lead-routing platform created for independent distributors. It is not Enagic’s corporate website and is not operated by Enagic Co., Ltd.'] },
      { heading: 'No authority to bind Enagic', paragraphs: ['True Legacy members and distributors are independent and cannot make commitments, warranties, medical claims, or income guarantees on behalf of Enagic.'] },
      { heading: 'Purchasing and enrollment', paragraphs: ['Product purchases, distributor applications, pricing, warranties, returns, and compensation are governed by official Enagic documents and the rules of the applicable market.'] },
      { heading: 'Attribution and choice', paragraphs: ['The platform asks who referred each applicant so inquiries can be routed responsibly. Visitors without a referrer may choose from available distributor profiles.'] },
    ],
  },
}

export default function LegalPage() {
  const { document } = useParams<{ document: string }>()
  const page = document ? DOCUMENTS[document] : undefined
  if (!page) return <Navigate to="/" replace />

  return (
    <div className="page-wrapper bg-black text-white">
      <SEO title={`${page.title} | True Legacy World`} description={page.description} />
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 md:py-24">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#2997ff]">Phase 1 working draft</p>
        <h1 className="text-3xl font-bold sm:text-5xl">{page.title}</h1>
        <p className="mt-4 max-w-3xl text-[#cccccc]">{page.description}</p>
        <p className="mt-3 text-xs text-[#86868b]">Last updated August 2026 · Prepared for owner and legal review</p>

        <div className="mt-12 space-y-8">
          {page.sections.map((section) => (
            <section key={section.heading} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-white">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-[#cccccc]">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/distributors" className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-400">Contact a Distributor</Link>
          <Link to="/" className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Return Home</Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
