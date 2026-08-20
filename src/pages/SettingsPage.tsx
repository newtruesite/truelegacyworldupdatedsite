import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Globe, Settings, Star, Edit3, Save, X, Shield } from 'lucide-react'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { COUNTRIES, getFlagImageUrl } from '@/lib/countries'
import { cn } from '@/lib/utils'
import { LeadershipPanel } from '@/components/LeadershipPanel'

const MOCK_USER = {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    country: 'usa',
    sponsorName: 'Mehdi Cohen',
    sponsorInstagram: '@mehdicohen',
    rank: 'Gold Leader',
    joinDate: 'January 2025',
    teamSize: 24,
    monthlyVolume: '$12,450',
}

const RANKS = [
    { name: 'Starter', color: 'text-[#cccccc]', bg: 'bg-slate-500/20' },
    { name: 'Bronze Leader', color: 'text-amber-600', bg: 'bg-amber-600/20' },
    { name: 'Silver Leader', color: 'text-[#cccccc]', bg: 'bg-slate-400/20' },
    { name: 'Gold Leader', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { name: 'Platinum Director', color: 'text-[#2997ff]', bg: 'bg-cyan-500/20' },
    { name: 'Legacy Master', color: 'text-[#2997ff]', bg: 'bg-purple-500/20' },
]

const NAV_ITEMS = [
    { label: 'Profile', icon: User, id: 'profile' },
    { label: 'Settings', icon: Settings, id: 'settings' },
    { label: 'My Status', icon: Star, id: 'status' },
    { label: 'Leadership', icon: Shield, id: 'leadership' },
]

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile')
    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState(MOCK_USER)
    const [failedFlagSlugs, setFailedFlagSlugs] = useState<Set<string>>(new Set())

    const currentRankIndex = RANKS.findIndex((r) => r.name === MOCK_USER.rank)
    const nextRank = RANKS[currentRankIndex + 1]
    const countryObj = COUNTRIES.find((c) => c.slug === MOCK_USER.country)

    return (
        <div style={{ minHeight: '100dvh' }}>
            <Navbar />

            <AuroraBackground className="pt-24 pb-16">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-bold text-white sm:text-4xl">
                            My True Legacy{' '}
                            <span className="gradient-text">Dashboard</span>
                        </h1>
                        <p className="mt-2 text-[#cccccc]">Manage your profile, track your status, and view your legacy progress.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                        {/* Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="lg:col-span-1"
                        >
                            {/* Profile Card */}
                            <div className="glass rounded-2xl border border-white/10 p-6 mb-4 text-center">
                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-2xl font-bold text-white">
                                    {MOCK_USER.name.split(' ').map((n) => n[0]).join('')}
                                </div>
                                <h2 className="text-lg font-bold text-white">{MOCK_USER.name}</h2>
                                <p className="text-sm text-[#cccccc] mb-3">{MOCK_USER.email}</p>
                                <span
                                    className={cn(
                                        'inline-block rounded-full px-3 py-1 text-xs font-semibold',
                                        RANKS.find((r) => r.name === MOCK_USER.rank)?.bg,
                                        RANKS.find((r) => r.name === MOCK_USER.rank)?.color
                                    )}
                                >
                                    ⭐ {MOCK_USER.rank}
                                </span>
                            </div>

                            {/* Nav */}
                            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                                {NAV_ITEMS.map((item) => {
                                    const Icon = item.icon
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={cn(
                                                'flex w-full items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all',
                                                activeTab === item.id
                                                    ? 'bg-gradient-to-r from-blue-600/20 to-cyan-500/20 text-white border-l-2 border-white/20'
                                                    : 'text-[#cccccc] hover:bg-white/5 hover:text-white'
                                            )}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {item.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </motion.div>

                        {/* Main Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="lg:col-span-3"
                        >
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="glass rounded-2xl border border-white/10 p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-white">Personal Information</h3>
                                        <button
                                            onClick={() => setEditing(!editing)}
                                            className={cn(
                                                'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                                                editing
                                                    ? 'bg-white/10 text-white hover:bg-white/15'
                                                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:scale-105'
                                            )}
                                        >
                                            {editing ? (
                                                <><X className="h-4 w-4" /> Cancel</>
                                            ) : (
                                                <><Edit3 className="h-4 w-4" /> Edit Profile</>
                                            )}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        {[
                                            { label: 'Full Name', key: 'name', icon: User, type: 'text' },
                                            { label: 'Email Address', key: 'email', icon: Mail, type: 'email' },
                                            { label: 'Phone Number', key: 'phone', icon: Phone, type: 'tel' },
                                        ].map(({ label, key, icon: Icon, type }) => (
                                            <div key={key}>
                                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#86868b]">
                                                    {label}
                                                </label>
                                                {editing ? (
                                                    <div className="relative">
                                                        <Icon className="absolute left-3 top-3 h-4 w-4 text-[#86868b]" />
                                                        <input
                                                            type={type}
                                                            value={formData[key as keyof typeof formData]}
                                                            onChange={(e) =>
                                                                setFormData({ ...formData, [key]: e.target.value })
                                                            }
                                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pl-10 text-sm text-white outline-none focus:border-white/20 focus:ring-1 focus:ring-cyan-500/30"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/3 px-4 py-2.5">
                                                        <Icon className="h-4 w-4 text-[#86868b]" />
                                                        <span className="text-sm text-[#cccccc]">
                                                            {formData[key as keyof typeof formData]}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Country */}
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#86868b]">
                                                Country
                                            </label>
                                            {editing ? (
                                                <div className="relative">
                                                    <Globe className="absolute left-3 top-3 h-4 w-4 text-[#86868b]" />
                                                    <select
                                                        value={formData.country}
                                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                        className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pl-10 text-sm text-white outline-none focus:border-white/20"
                                                    >
                                                        {COUNTRIES.map((c) => (
                                                            <option key={c.slug} value={c.slug} className="bg-black">
                                                                {c.flagEmoji} {c.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/3 px-4 py-2.5">
                                                    {countryObj && (
                                                        <span className="inline-flex h-5 w-7 shrink-0 overflow-hidden rounded border border-white/20 bg-black">
                                                            {failedFlagSlugs.has(countryObj.slug) ? (
                                                                <span className="flex h-full w-full items-center justify-center text-base leading-none">{countryObj.flagEmoji}</span>
                                                            ) : (
                                                                <img src={getFlagImageUrl(countryObj.slug, 40)} alt="" className="h-full w-full object-cover" onError={() => setFailedFlagSlugs((prev) => new Set(prev).add(countryObj.slug))} />
                                                            )}
                                                        </span>
                                                    )}
                                                    <span className="text-sm text-[#cccccc]">{countryObj?.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {editing && (
                                        <div className="mt-6 flex justify-end">
                                            <button
                                                onClick={() => setEditing(false)}
                                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105"
                                            >
                                                <Save className="h-4 w-4" />
                                                Save Changes
                                            </button>
                                        </div>
                                    )}

                                    {/* Sponsor */}
                                    <div className="mt-8 pt-8 border-t border-white/10">
                                        <h4 className="mb-4 text-base font-semibold text-white">Your Sponsor</h4>
                                        <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-600/10 to-cyan-500/10 border border-blue-500/20 p-5">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold">
                                                MC
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{MOCK_USER.sponsorName}</p>
                                                <p className="text-sm text-[#cccccc]">{MOCK_USER.sponsorInstagram}</p>
                                            </div>
                                            <Star className="ml-auto h-5 w-5 text-yellow-400" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Status Tab */}
                            {activeTab === 'status' && (
                                <div className="glass rounded-2xl border border-white/10 p-8">
                                    <h3 className="text-lg font-bold text-white mb-6">True Legacy Status</h3>

                                    {/* Current Rank */}
                                    <div className="mb-8 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 p-6 text-center">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-[#86868b] mb-2">Current Rank</p>
                                        <p className="text-4xl font-extrabold text-yellow-400 mb-1">{MOCK_USER.rank}</p>
                                        <p className="text-sm text-[#cccccc]">Member since {MOCK_USER.joinDate}</p>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
                                        {[
                                            { label: 'Team Size', value: MOCK_USER.teamSize, icon: '👥' },
                                            { label: 'Monthly Volume', value: MOCK_USER.monthlyVolume, icon: '💰' },
                                            { label: 'Countries Active', value: '3', icon: '🌍' },
                                        ].map((stat) => (
                                            <div key={stat.label} className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                                                <div className="text-2xl mb-1">{stat.icon}</div>
                                                <p className="text-xl font-bold text-white">{stat.value}</p>
                                                <p className="text-xs text-[#86868b] mt-0.5">{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Rank progression */}
                                    <h4 className="text-sm font-semibold text-[#cccccc] uppercase tracking-wider mb-4">Rank Progression</h4>
                                    <div className="space-y-2">
                                        {RANKS.map((rank, i) => (
                                            <div
                                                key={rank.name}
                                                className={cn(
                                                    'flex items-center gap-3 rounded-xl px-4 py-3 transition-all',
                                                    i < currentRankIndex
                                                        ? 'bg-white/5 opacity-50'
                                                        : i === currentRankIndex
                                                            ? `${rank.bg} border border-white/20`
                                                            : 'bg-white/3 opacity-40'
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                                                        i < currentRankIndex ? 'bg-green-500/20 text-green-400' : rank.bg
                                                    )}
                                                >
                                                    {i < currentRankIndex ? '✓' : i + 1}
                                                </div>
                                                <span className={cn('text-sm font-medium', rank.color)}>{rank.name}</span>
                                                {i === currentRankIndex && (
                                                    <span className="ml-auto text-xs text-[#2997ff] font-semibold">Current</span>
                                                )}
                                                {i === currentRankIndex + 1 && (
                                                    <span className="ml-auto text-xs text-[#86868b]">Next Goal</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {nextRank && (
                                        <div className="mt-6 rounded-2xl bg-blue-600/10 border border-blue-500/20 p-5">
                                            <p className="text-sm font-semibold text-white mb-1">
                                                🎯 Next milestone: {nextRank.name}
                                            </p>
                                            <p className="text-xs text-[#cccccc]">
                                                Keep growing your team and volume. Your sponsor will guide you to the next rank.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Settings Tab */}
                            {activeTab === 'settings' && (
                                <div className="glass rounded-2xl border border-white/10 p-8">
                                    <h3 className="text-lg font-bold text-white mb-6">Account Settings</h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Email Notifications', desc: 'Receive training updates and team alerts', enabled: true },
                                            { label: 'Community Access', desc: 'Stay connected in the True Legacy Facebook group', enabled: true },
                                            { label: 'Weekly Summary', desc: 'Receive weekly performance summary via email', enabled: false },
                                        ].map((setting) => (
                                            <div
                                                key={setting.label}
                                                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/3 px-5 py-4"
                                            >
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{setting.label}</p>
                                                    <p className="text-xs text-[#86868b] mt-0.5">{setting.desc}</p>
                                                </div>
                                                <div
                                                    className={cn(
                                                        'h-6 w-11 rounded-full transition-colors relative',
                                                        setting.enabled ? 'bg-cyan-500' : 'bg-white/10'
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
                                                            setting.enabled ? 'left-[22px]' : 'left-0.5'
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Leadership Tab */}
                            {activeTab === 'leadership' && (
                                <LeadershipPanel />
                            )}
                        </motion.div>
                    </div>
                </div>
            </AuroraBackground>

            <Footer />
        </div>
    )
}
