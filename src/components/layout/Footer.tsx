import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Youtube, Instagram, Facebook, Heart } from 'lucide-react'
import { COUNTRIES, getFlagSrcSet } from '@/lib/countries'

export function Footer() {
    const currentYear = new Date().getFullYear()
    const [failedFlagSlugs, setFailedFlagSlugs] = useState<Set<string>>(new Set())

    return (
        <footer className="relative border-t border-white/10 bg-[#060810]">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-3 group mb-4 logo-container" style={{ background: 'transparent', padding: 0 }}>
                            <img
                                src="/logos/tl-horizontal-white.png"
                                alt="True Legacy World"
                                className="h-10 w-auto object-contain nav-logo logo-img"
                                style={{ background: 'transparent', backgroundColor: 'transparent', mixBlendMode: 'normal' }}
                            />
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6">
                            A global movement transforming lives through health innovation, entrepreneurship, and lasting legacy building.
                        </p>
                        {/* Community CTA */}
                        <a
                            href="https://www.facebook.com/groups/truelegacycommunity"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#1877F2] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#166FE5] hover:scale-105 shadow-lg"
                        >
                            <Facebook className="h-4 w-4" />
                            Join Our Facebook Community
                        </a>
                    </div>

                    {/* Countries */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                            Global Regions
                        </h3>
                        <ul className="space-y-2">
                            {COUNTRIES.map((country) => (
                                <li key={country.slug}>
                                    <Link
                                        to={`/${country.slug}`}
                                        className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                                    >
                                        <span className="inline-flex h-4 w-6 flex-shrink-0 overflow-hidden rounded border border-white/20 bg-[#0a2060]">
                                            {failedFlagSlugs.has(country.slug) ? (
                                                <span className="flex h-full w-full items-center justify-center text-xs leading-none">{country.flagEmoji}</span>
                                            ) : (
                                                <img {...getFlagSrcSet(country.slug)} alt="" className="h-full w-full object-cover" loading="lazy" onError={() => setFailedFlagSlugs((prev) => new Set(prev).add(country.slug))} />
                                            )}
                                        </span>
                                        <span>{country.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                            Company
                        </h3>
                        <ul className="space-y-2">
                            {[
                                { label: 'Home', href: '/' },
                                { label: 'Leadership Training', href: '/training' },
                                { label: 'My Account', href: '/settings' },
                                { label: 'Kangen Water', href: '/#kangen' },
                                { label: 'emGuarde Technology', href: '/#emguarde' },
                                { label: 'Our Story', href: '/#story' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-slate-400 transition-colors hover:text-white"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                            Follow Us
                        </h3>
                        <div className="space-y-3">
                            <a
                                href="https://youtube.com/@TrueLegacyWorld"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm text-slate-400 transition-colors hover:text-white group"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-colors group-hover:bg-red-500/20">
                                    <Youtube className="h-4 w-4 text-red-400" />
                                </div>
                                @TrueLegacyWorld
                            </a>
                            <a
                                href="https://youtube.com/@TrueLegacyLATAM"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm text-slate-400 transition-colors hover:text-white group"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-colors group-hover:bg-red-500/20">
                                    <Youtube className="h-4 w-4 text-red-400" />
                                </div>
                                @TrueLegacyLATAM
                            </a>
                            <a
                                href="https://instagram.com/truelegacyworld"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm text-slate-400 transition-colors hover:text-white group"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-colors group-hover:bg-pink-500/20">
                                    <Instagram className="h-4 w-4 text-pink-400" />
                                </div>
                                @truelegacyworld
                            </a>
                        </div>

                        <div className="mt-8">
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                                Products
                            </h3>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-400">🌊 Kangen Water (Enagic)</p>
                                <p className="text-sm text-slate-400">🛡️ emGuarde Technology</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust signals */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
                    <span>Authorized Enagic Distributor</span>
                    <span className="text-white/40">·</span>
                    <span>True Legacy World — Global Team</span>
                </div>
                {/* Bottom Bar */}
                <div className="mt-8 border-t border-white/10 pt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                    <p className="text-xs text-slate-500">
                        © {currentYear} True Legacy World. All rights reserved.
                    </p>
                    <p className="flex items-center gap-1 text-xs text-slate-500">
                        Built with <Heart className="h-3 w-3 text-red-400" /> for global legacy builders
                    </p>
                </div>
            </div>
        </footer>
    )
}
