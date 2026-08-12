import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SEO } from '@/components/SEO'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="page-wrapper bg-[#060b1e] text-white">
      <SEO title="Page Not Found | True Legacy World" description="The requested True Legacy World page could not be found." />
      <Navbar />
      <main className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">404</p>
        <h1 className="mt-4 text-4xl font-bold sm:text-6xl">This page could not be found.</h1>
        <p className="mt-5 max-w-xl text-slate-300">The address may be outdated or incorrect. Return home, explore the products, or find a distributor.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-400">Return Home</Link>
          <Link to="/products" className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Explore Products</Link>
          <Link to="/distributors" className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Find a Distributor</Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
