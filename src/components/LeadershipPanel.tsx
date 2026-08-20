import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    TrendingUp,
    Users,
    Target,
    ShieldAlert,
    FileText,
    Video,
    Plus,
    Search,
    Filter,
    X,
    AlertCircle,
    Globe,
    Percent,
    Eye,
    ThumbsUp,
    ThumbsDown,
    BookOpen,
    Send
} from 'lucide-react'

// --- Interface Definitions ---
interface DownlineMember {
    id: string
    name: string
    rank: string
    leads: number
    trainingProgress: number
    lastActive: string
    email: string
    phone: string
    country: string
    modules: { name: string; completed: boolean }[]
}

interface TeamTemplate {
    id: string
    title: string
    type: string
    description: string
    attachedFile: string
    activeMembers: number
    dateCreated: string
}

interface PublishedResource {
    id: string
    title: string
    type: 'pdf' | 'announcement' | 'video'
    targetRank: string
    description: string
    link?: string
    datePublished: string
}

interface TeamChallenge {
    id: string
    title: string
    description: string
    targetGroup: string
    metric: string
    targetValue: number
    reward: string
    endDate: string
    participants: { name: string; progress: number; completed: boolean }[]
}

interface ComplianceSubmission {
    id: string
    distributorName: string
    type: string
    title: string
    link: string
    submittedDate: string
    status: 'pending' | 'approved' | 'rejected'
    feedback?: string
}

// --- Initial Mock Data Constants ---
const INITIAL_DOWNLINES: DownlineMember[] = [
    {
        id: '1',
        name: 'Sarah Miller',
        rank: 'Bronze Leader',
        leads: 14,
        trainingProgress: 80,
        lastActive: '2 hours ago',
        email: 'sarah.m@example.com',
        phone: '+1 (555) 987-6543',
        country: 'usa',
        modules: [
            { name: 'Kangen Hydration Science', completed: true },
            { name: 'Compensation Plan Core', completed: true },
            { name: 'Lead Generation Basics', completed: true },
            { name: 'Compliance & Medical Claims', completed: false }
        ]
    },
    {
        id: '2',
        name: 'Juan Perez',
        rank: 'Starter',
        leads: 3,
        trainingProgress: 25,
        lastActive: '3 days ago',
        email: 'juan.p@example.com',
        phone: '+57 (300) 123-4567',
        country: 'colombia',
        modules: [
            { name: 'Kangen Hydration Science', completed: true },
            { name: 'Compensation Plan Core', completed: false },
            { name: 'Lead Generation Basics', completed: false },
            { name: 'Compliance & Medical Claims', completed: false }
        ]
    },
    {
        id: '3',
        name: 'Emma Watson',
        rank: 'Silver Leader',
        leads: 28,
        trainingProgress: 95,
        lastActive: '10 minutes ago',
        email: 'emma.w@example.com',
        phone: '+44 (7911) 123456',
        country: 'canada',
        modules: [
            { name: 'Kangen Hydration Science', completed: true },
            { name: 'Compensation Plan Core', completed: true },
            { name: 'Lead Generation Basics', completed: true },
            { name: 'Compliance & Medical Claims', completed: true }
        ]
    },
    {
        id: '4',
        name: 'Carlos Silva',
        rank: 'Starter',
        leads: 1,
        trainingProgress: 0,
        lastActive: '5 days ago',
        email: 'carlos.s@example.com',
        phone: '+55 (11) 98765-4321',
        country: 'brazil',
        modules: [
            { name: 'Kangen Hydration Science', completed: false },
            { name: 'Compensation Plan Core', completed: false },
            { name: 'Lead Generation Basics', completed: false },
            { name: 'Compliance & Medical Claims', completed: false }
        ]
    },
    {
        id: '5',
        name: 'Yuki Tanaka',
        rank: 'Starter',
        leads: 6,
        trainingProgress: 50,
        lastActive: '1 day ago',
        email: 'yuki.t@example.com',
        phone: '+81 (90) 1234-5678',
        country: 'usa',
        modules: [
            { name: 'Kangen Hydration Science', completed: true },
            { name: 'Compensation Plan Core', completed: true },
            { name: 'Lead Generation Basics', completed: false },
            { name: 'Compliance & Medical Claims', completed: false }
        ]
    }
]

const INITIAL_TEMPLATES: TeamTemplate[] = [
    {
        id: 't1',
        title: 'Latam Distributor Onboarding',
        type: 'Training Track',
        description: 'A 4-step training track introducing Enagic products, business plan, and local Latam compliance guidelines.',
        attachedFile: 'latam_onboarding_v2.pdf',
        activeMembers: 12,
        dateCreated: 'May 10, 2026'
    },
    {
        id: 't2',
        title: 'Fast-track 6A Blueprint',
        type: 'Leadership Blueprint',
        description: 'Advanced strategic layout for building structured leg groups to reach 6A rank within 6 months.',
        attachedFile: 'fast_track_6a.pdf',
        activeMembers: 8,
        dateCreated: 'June 18, 2026'
    },
    {
        id: 't3',
        title: 'Social Media Ad Compliance Pack',
        type: 'Compliance Guideline',
        description: 'Approved copy, layouts, and image guidelines for posting on Instagram and Facebook without violating rules.',
        attachedFile: 'social_compliance_morocco.pdf',
        activeMembers: 15,
        dateCreated: 'July 01, 2026'
    }
]

const INITIAL_RESOURCES: PublishedResource[] = [
    {
        id: 'r1',
        title: 'Morocco Launch Event Presentation',
        type: 'pdf',
        targetRank: 'All',
        description: 'The official PDF slide deck used during the Morocco distributor launch event.',
        link: 'morocco_launch_deck.pdf',
        datePublished: 'Aug 12, 2026'
    },
    {
        id: 'r2',
        title: 'New Enagic Compliance Rules Update',
        type: 'announcement',
        targetRank: 'All',
        description: 'Critical update regarding health claims: do not associate Enagic ionizers with treating active medical conditions.',
        datePublished: 'Aug 10, 2026'
    },
    {
        id: 'r3',
        title: '6A Structure Training Call Replay',
        type: 'video',
        targetRank: 'Gold+ Leaders',
        description: 'Private leadership webinar covering downline coaching and volume metrics.',
        link: 'https://youtube.com/watch?v=mock_video_id',
        datePublished: 'Aug 05, 2026'
    }
]

const INITIAL_CHALLENGES: TeamChallenge[] = [
    {
        id: 'c1',
        title: 'Summer K8 Sales Sprint',
        description: 'Sell 3 Leveluk K8 machines before the end of August.',
        targetGroup: 'All Distributors',
        metric: 'K8 Sales',
        targetValue: 3,
        reward: 'VIP Ticket to Latam Summit + Stage Recognition',
        endDate: '2026-08-31',
        participants: [
            { name: 'Sarah Miller', progress: 2, completed: false },
            { name: 'Juan Perez', progress: 0, completed: false },
            { name: 'Emma Watson', progress: 3, completed: true },
            { name: 'Carlos Silva', progress: 0, completed: false },
            { name: 'Yuki Tanaka', progress: 1, completed: false }
        ]
    },
    {
        id: 'c2',
        title: 'Fast Start Recruiter',
        description: 'Recruit 2 new active distributors within 14 days of start.',
        targetGroup: 'Starters',
        metric: 'Recruits',
        targetValue: 2,
        reward: '1-on-1 Strategy Session with Mehdi Cohen',
        endDate: '2026-08-25',
        participants: [
            { name: 'Juan Perez', progress: 1, completed: false },
            { name: 'Carlos Silva', progress: 0, completed: false },
            { name: 'Yuki Tanaka', progress: 2, completed: true }
        ]
    }
]

const INITIAL_COMPLIANCE: ComplianceSubmission[] = [
    {
        id: 'comp1',
        distributorName: 'Juan Perez',
        type: 'Landing Page',
        title: 'colombia-kangen.net (Vite + React)',
        link: 'https://colombia-kangen-mock.net',
        submittedDate: 'Aug 15, 2026',
        status: 'pending'
    },
    {
        id: 'comp2',
        distributorName: 'Sarah Miller',
        type: 'Social Flyer',
        title: 'Instagram K8 Hydration Promo Story',
        link: 'https://instagram.com/p/mockflyer',
        submittedDate: 'Aug 14, 2026',
        status: 'pending'
    },
    {
        id: 'comp3',
        distributorName: 'Carlos Silva',
        type: 'Advertisement',
        title: 'Facebook Local Lead Gen Ad',
        link: 'https://facebook.com/ads/mock_carlos',
        submittedDate: 'Aug 11, 2026',
        status: 'rejected',
        feedback: 'Contains medical claims about curing active diseases. Please rewrite to focus on hydration and antioxidant properties.'
    },
    {
        id: 'comp4',
        distributorName: 'Emma Watson',
        type: 'Bio Page',
        title: 'True Legacy Distributor Bio - Emma Watson',
        link: 'https://truelegacyworld.com/distributor/emma-watson',
        submittedDate: 'Aug 12, 2026',
        status: 'approved'
    }
]

type LeadershipSubTab = 'analytics' | 'templates' | 'publishing' | 'distributors' | 'challenges' | 'compliance'

export function LeadershipPanel() {
    const [subTab, setSubTab] = useState<LeadershipSubTab>('analytics')

    // --- State Hooks with Lazy Initializers to avoid synchronous setState inside useEffect ---
    const [downlines] = useState<DownlineMember[]>(() => {
        if (typeof window === 'undefined') return []
        const stored = localStorage.getItem('tl_downlines')
        if (stored) return JSON.parse(stored)
        localStorage.setItem('tl_downlines', JSON.stringify(INITIAL_DOWNLINES))
        return INITIAL_DOWNLINES
    })

    const [templates, setTemplates] = useState<TeamTemplate[]>(() => {
        if (typeof window === 'undefined') return []
        const stored = localStorage.getItem('tl_templates')
        if (stored) return JSON.parse(stored)
        localStorage.setItem('tl_templates', JSON.stringify(INITIAL_TEMPLATES))
        return INITIAL_TEMPLATES
    })

    const [resources, setResources] = useState<PublishedResource[]>(() => {
        if (typeof window === 'undefined') return []
        const stored = localStorage.getItem('tl_resources')
        if (stored) return JSON.parse(stored)
        localStorage.setItem('tl_resources', JSON.stringify(INITIAL_RESOURCES))
        return INITIAL_RESOURCES
    })

    const [challenges, setChallenges] = useState<TeamChallenge[]>(() => {
        if (typeof window === 'undefined') return []
        const stored = localStorage.getItem('tl_challenges')
        if (stored) return JSON.parse(stored)
        localStorage.setItem('tl_challenges', JSON.stringify(INITIAL_CHALLENGES))
        return INITIAL_CHALLENGES
    })

    const [complianceQueue, setComplianceQueue] = useState<ComplianceSubmission[]>(() => {
        if (typeof window === 'undefined') return []
        const stored = localStorage.getItem('tl_compliance')
        if (stored) return JSON.parse(stored)
        localStorage.setItem('tl_compliance', JSON.stringify(INITIAL_COMPLIANCE))
        return INITIAL_COMPLIANCE
    })

    // Search/Filters states
    const [distributorSearch, setDistributorSearch] = useState('')
    const [distributorRankFilter, setDistributorRankFilter] = useState('all')
    const [selectedDistributor, setSelectedDistributor] = useState<DownlineMember | null>(null)
    const [complianceTab, setComplianceTab] = useState<'pending' | 'approved' | 'rejected'>('pending')

    // Modal creation states
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
    const [newTemplate, setNewTemplate] = useState({ title: '', type: 'Training Track', description: '', file: '' })

    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
    const [newResource, setNewResource] = useState({ title: '', type: 'announcement' as 'pdf' | 'announcement' | 'video', targetRank: 'All', description: '', link: '' })

    const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false)
    const [newChallenge, setNewChallenge] = useState({ title: '', description: '', targetGroup: 'All', metric: 'Sales', targetValue: 3, reward: '', endDate: '' })

    const [rejectionModalItem, setRejectionModalItem] = useState<ComplianceSubmission | null>(null)
    const [rejectionFeedback, setRejectionFeedback] = useState('')

    // --- Helper updates persistence ---
    const updateLocalStorage = (key: string, data: unknown) => {
        localStorage.setItem(key, JSON.stringify(data))
    }

    // --- Template handlers ---
    const handleCreateTemplate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTemplate.title || !newTemplate.description) return

        const updated: TeamTemplate = {
            id: 't_' + Date.now(),
            title: newTemplate.title,
            type: newTemplate.type,
            description: newTemplate.description,
            attachedFile: newTemplate.file || 'inherited_resource.pdf',
            activeMembers: 0,
            dateCreated: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        }

        const list = [updated, ...templates]
        setTemplates(list)
        updateLocalStorage('tl_templates', list)
        setIsTemplateModalOpen(false)
        setNewTemplate({ title: '', type: 'Training Track', description: '', file: '' })
    }

    const handleDeleteTemplate = (id: string) => {
        const list = templates.filter(t => t.id !== id)
        setTemplates(list)
        updateLocalStorage('tl_templates', list)
    }

    // --- Content Publishing handlers ---
    const handlePublishResource = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newResource.title || !newResource.description) return

        const updated: PublishedResource = {
            id: 'r_' + Date.now(),
            title: newResource.title,
            type: newResource.type,
            targetRank: newResource.targetRank,
            description: newResource.description,
            link: newResource.link || undefined,
            datePublished: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        }

        const list = [updated, ...resources]
        setResources(list)
        updateLocalStorage('tl_resources', list)
        setIsPublishModalOpen(false)
        setNewResource({ title: '', type: 'announcement', targetRank: 'All', description: '', link: '' })
    }

    const handleDeleteResource = (id: string) => {
        const list = resources.filter(r => r.id !== id)
        setResources(list)
        updateLocalStorage('tl_resources', list)
    }

    // --- Challenges handlers ---
    const handleCreateChallenge = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newChallenge.title || !newChallenge.description || !newChallenge.endDate) return

        // Prepopulate participants with current downlines
        const challengeParticipants = downlines.map(d => ({
            name: d.name,
            progress: 0,
            completed: false
        }))

        const updated: TeamChallenge = {
            id: 'c_' + Date.now(),
            title: newChallenge.title,
            description: newChallenge.description,
            targetGroup: newChallenge.targetGroup,
            metric: newChallenge.metric,
            targetValue: newChallenge.targetValue,
            reward: newChallenge.reward,
            endDate: newChallenge.endDate,
            participants: challengeParticipants
        }

        const list = [updated, ...challenges]
        setChallenges(list)
        updateLocalStorage('tl_challenges', list)
        setIsChallengeModalOpen(false)
        setNewChallenge({ title: '', description: '', targetGroup: 'All', metric: 'Sales', targetValue: 3, reward: '', endDate: '' })
    }

    const handleProgressChallenge = (challengeId: string, participantName: string, amount: number) => {
        const list = challenges.map(c => {
            if (c.id === challengeId) {
                const updatedParts = c.participants.map(p => {
                    if (p.name === participantName) {
                        const newProgress = Math.min(c.targetValue, Math.max(0, p.progress + amount))
                        return {
                            ...p,
                            progress: newProgress,
                            completed: newProgress >= c.targetValue
                        }
                    }
                    return p
                })
                return { ...c, participants: updatedParts }
            }
            return c
        })
        setChallenges(list)
        updateLocalStorage('tl_challenges', list)
    }

    // --- Compliance Queue handlers ---
    const handleApproveCompliance = (id: string) => {
        const list = complianceQueue.map(c => {
            if (c.id === id) {
                return { ...c, status: 'approved' as const, feedback: undefined }
            }
            return c
        })
        setComplianceQueue(list)
        updateLocalStorage('tl_compliance', list)
    }

    const handleRejectCompliance = (e: React.FormEvent) => {
        e.preventDefault()
        if (!rejectionModalItem || !rejectionFeedback) return

        const list = complianceQueue.map(c => {
            if (c.id === rejectionModalItem.id) {
                return { ...c, status: 'rejected' as const, feedback: rejectionFeedback }
            }
            return c
        })
        setComplianceQueue(list)
        updateLocalStorage('tl_compliance', list)
        setRejectionModalItem(null)
        setRejectionFeedback('')
    }

    // Filtered downlines
    const filteredDownlines = downlines.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(distributorSearch.toLowerCase()) ||
            d.email.toLowerCase().includes(distributorSearch.toLowerCase())
        const matchesRank = distributorRankFilter === 'all' || d.rank.toLowerCase() === distributorRankFilter.toLowerCase()
        return matchesSearch && matchesRank
    })

    return (
        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            {/* Leadership Top Header Navigation */}
            <div className="flex flex-wrap border-b border-white/10 bg-white/3">
                {([
                    { id: 'analytics', label: 'Overview & Analytics', icon: TrendingUp },
                    { id: 'templates', label: 'Team Templates', icon: BookOpen },
                    { id: 'publishing', label: 'Content Publisher', icon: Send },
                    { id: 'distributors', label: 'Distributor Tracker', icon: Users },
                    { id: 'challenges', label: 'Activity Goals', icon: Target },
                    { id: 'compliance', label: 'Compliance Queue', icon: ShieldAlert }
                ] as const).map(tab => {
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setSubTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
                                subTab === tab.id
                                    ? 'border-white/20 text-white bg-white/5'
                                    : 'border-transparent text-[#cccccc] hover:text-white hover:bg-white/3'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Sub-tab Views */}
            <div className="p-8">
                {/* 1. Analytics View */}
                {subTab === 'analytics' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Organization Performance</h3>
                            <p className="text-sm text-[#cccccc]">Real-time metrics and geographic insights for your downline network.</p>
                        </div>

                        {/* Stats Summary Cards */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                            {[
                                { title: 'Total Team Volume', value: '$128,450', desc: '+18.4% from last month', icon: TrendingUp, color: 'from-blue-600 to-cyan-500' },
                                { title: 'Active Network', value: '24 Members', desc: '15 active in last 24h', icon: Users, color: 'from-purple-600 to-indigo-500' },
                                { title: 'Staging Leads', value: '112 Leads', desc: '+22 new today', icon: Target, color: 'from-green-600 to-teal-500' },
                                { title: 'Conversion Rate', value: '18.5%', desc: '+2.1% overall increase', icon: Percent, color: 'from-amber-600 to-orange-500' },
                            ].map((stat, idx) => {
                                const Icon = stat.icon
                                return (
                                    <div key={idx} className="glass rounded-xl border border-white/10 p-5 relative overflow-hidden group">
                                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-xl group-hover:scale-125 transition-all`} />
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">{stat.title}</span>
                                            <Icon className="h-5 w-5 text-[#cccccc]" />
                                        </div>
                                        <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                                        <p className="text-xs text-green-400 font-semibold">{stat.desc}</p>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Analytics Charts Grid */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* SVG Trend Line Chart */}
                            <div className="lg:col-span-2 glass rounded-xl border border-white/10 p-6">
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Monthly Sales Volume Trend ($K)</h4>
                                <div className="h-64 w-full relative">
                                    <svg className="w-full h-full" viewBox="0 0 600 240" fill="none">
                                        {/* Chart Grid Lines */}
                                        <line x1="0" y1="200" x2="600" y2="200" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                        <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                        <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                        <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                                        {/* Chart Gradient fill */}
                                        <path
                                            d="M 50 180 C 130 150, 130 110, 210 120 C 295 130, 295 80, 380 60 C 465 40, 465 30, 550 20 L 550 200 L 50 200 Z"
                                            fill="url(#chartGrad)"
                                            opacity="0.15"
                                        />

                                        {/* Line path */}
                                        <path
                                            d="M 50 180 C 130 150, 130 110, 210 120 C 295 130, 295 80, 380 60 C 465 40, 465 30, 550 20"
                                            stroke="#22d3ee"
                                            strokeWidth="3.5"
                                            strokeLinecap="round"
                                        />

                                        {/* Data nodes */}
                                        {[
                                            { x: 50, y: 180, label: 'Jan' },
                                            { x: 130, y: 150, label: 'Feb' },
                                            { x: 210, y: 120, label: 'Mar' },
                                            { x: 295, y: 130, label: 'Apr' },
                                            { x: 380, y: 60, label: 'May' },
                                            { x: 465, y: 40, label: 'Jun' },
                                            { x: 550, y: 20, label: 'Jul' }
                                        ].map((node, i) => (
                                            <g key={i}>
                                                <circle cx={node.x} cy={node.y} r="5" fill="#0ea5e9" stroke="#ffffff" strokeWidth="2" />
                                                <text x={node.x} y={node.y - 12} fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">{node.label}</text>
                                            </g>
                                        ))}

                                        <defs>
                                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#22d3ee" />
                                                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>

                            {/* Geographic Distribution Card */}
                            <div className="glass rounded-xl border border-white/10 p-6 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Geographic Volume</h4>
                                    <div className="space-y-4">
                                        {[
                                            { country: 'United States', percentage: 50, sales: '$64,225', code: 'US' },
                                            { country: 'Colombia', percentage: 25, sales: '$32,112', code: 'CO' },
                                            { country: 'Mexico', percentage: 15, sales: '$19,267', code: 'MX' },
                                            { country: 'Brazil / Others', percentage: 10, sales: '$12,845', code: 'BR' },
                                        ].map((geo, idx) => (
                                            <div key={idx} className="space-y-1.5">
                                                <div className="flex justify-between text-xs">
                                                    <span className="font-semibold text-[#cccccc]">{geo.country}</span>
                                                    <span className="font-bold text-white">{geo.sales} ({geo.percentage}%)</span>
                                                </div>
                                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                                                        style={{ width: `${geo.percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#cccccc]">
                                    <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-[#2997ff]" /> Active regions</span>
                                    <span className="font-bold text-white">4 Countries</span>
                                </div>
                            </div>
                        </div>

                        {/* Rank Distribution and Activity Logs */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div className="glass rounded-xl border border-white/10 p-6 flex flex-col justify-center items-center text-center">
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 w-full text-left">Team Rank distribution</h4>
                                <div className="relative h-44 w-44 mb-6">
                                    {/* Donut Chart SVG */}
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        {/* Starter: 40% (0 to 40) */}
                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#475569" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="100.48" />
                                        {/* Bronze: 30% (40 to 70) */}
                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#d97706" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="175.84" style={{ transformOrigin: '50px 50px', transform: 'rotate(144deg)' }} />
                                        {/* Silver: 20% (70 to 90) */}
                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#cbd5e1" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="200.96" style={{ transformOrigin: '50px 50px', transform: 'rotate(252deg)' }} />
                                        {/* Gold: 10% (90 to 100) */}
                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#facc15" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="226.08" style={{ transformOrigin: '50px 50px', transform: 'rotate(324deg)' }} />
                                        {/* Core hole */}
                                        <circle cx="50" cy="50" r="34" fill="#0c1120" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-extrabold text-white">24</span>
                                        <span className="text-[10px] text-[#86868b] uppercase tracking-wider font-semibold">Total Reps</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full text-xs text-left">
                                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-slate-500" /> <span className="text-[#cccccc]">Starter (40%)</span></div>
                                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-600" /> <span className="text-[#cccccc]">Bronze (30%)</span></div>
                                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-slate-300" /> <span className="text-[#cccccc]">Silver (20%)</span></div>
                                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-yellow-400" /> <span className="text-[#cccccc]">Gold (10%)</span></div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 glass rounded-xl border border-white/10 p-6">
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Recent Distributor Events</h4>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Emma Watson completed compliance validation module', type: 'training', time: '10 mins ago', color: 'text-green-400 bg-green-500/10' },
                                        { label: 'Juan Perez submitted new landing page for approval', type: 'compliance', time: '2 hours ago', color: 'text-amber-400 bg-amber-500/10' },
                                        { label: 'Sarah Miller completed 2/3 sales for Summer Sprint', type: 'challenge', time: '5 hours ago', color: 'text-[#2997ff] bg-cyan-500/10' },
                                        { label: 'Yuki Tanaka reached Silver Leader rank status', type: 'rank', time: '1 day ago', color: 'text-yellow-400 bg-yellow-500/10' }
                                    ].map((log, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-xs border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[9px] ${log.color}`}>{log.type}</span>
                                                <span className="text-[#cccccc] font-medium">{log.label}</span>
                                            </div>
                                            <span className="text-[#86868b]">{log.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 2. Team Templates View */}
                {subTab === 'templates' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Downline Template Inheritance</h3>
                                <p className="text-sm text-[#cccccc]">Define onboarding flows, sales assets, and tracks that downstream distributors inherit automatically.</p>
                            </div>
                            <button
                                onClick={() => setIsTemplateModalOpen(true)}
                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-xs font-bold text-white hover:scale-105 transition-all shadow-md"
                            >
                                <Plus className="h-4 w-4" /> Define Template
                            </button>
                        </div>

                        {/* Templates List */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {templates.map(template => (
                                <div key={template.id} className="glass rounded-xl border border-white/10 p-6 flex flex-col justify-between hover:border-white/20 transition-all group">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-[#2997ff] font-semibold text-[10px] uppercase tracking-wider">{template.type}</span>
                                            <button
                                                onClick={() => handleDeleteTemplate(template.id)}
                                                className="text-[#86868b] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <h4 className="text-base font-bold text-white mb-2">{template.title}</h4>
                                        <p className="text-xs text-[#cccccc] mb-4 line-clamp-3 leading-relaxed">{template.description}</p>
                                    </div>
                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#cccccc]">
                                        <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Inherited by {template.activeMembers} reps</span>
                                        <span className="flex items-center gap-1 font-semibold text-[#2997ff]"><FileText className="h-3.5 w-3.5" /> {template.attachedFile.slice(0, 16)}...</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Create Template Modal */}
                        <AnimatePresence>
                            {isTemplateModalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.95, opacity: 0 }}
                                        className="w-full max-w-lg glass rounded-2xl border border-white/15 p-6 shadow-2xl"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className="text-lg font-bold text-white">Define New Inherited Template</h4>
                                            <button onClick={() => setIsTemplateModalOpen(false)} className="text-[#cccccc] hover:text-white"><X className="h-5 w-5" /></button>
                                        </div>
                                        <form onSubmit={handleCreateTemplate} className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#cccccc] mb-2">Template Title</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. Europe Compliance Guide"
                                                    value={newTemplate.title}
                                                    onChange={e => setNewTemplate({ ...newTemplate, title: e.target.value })}
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-white/20"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#cccccc] mb-2">Template Type</label>
                                                    <select
                                                        value={newTemplate.type}
                                                        onChange={e => setNewTemplate({ ...newTemplate, type: e.target.value })}
                                                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-sm text-white outline-none focus:border-white/20"
                                                    >
                                                        <option value="Training Track">Training Track</option>
                                                        <option value="Leadership Blueprint">Leadership Blueprint</option>
                                                        <option value="Compliance Guideline">Compliance Guideline</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#cccccc] mb-2">File Attachment</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. blueprint.pdf"
                                                        value={newTemplate.file}
                                                        onChange={e => setNewTemplate({ ...newTemplate, file: e.target.value })}
                                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-white/20"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#cccccc] mb-2">Detailed Instructions</label>
                                                <textarea
                                                    required
                                                    rows={4}
                                                    placeholder="Describe the steps, goals, and details that distributors inheriting this blueprint will follow..."
                                                    value={newTemplate.description}
                                                    onChange={e => setNewTemplate({ ...newTemplate, description: e.target.value })}
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-white/20 resize-none"
                                                />
                                            </div>
                                            <div className="pt-4 flex justify-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsTemplateModalOpen(false)}
                                                    className="rounded-xl px-5 py-2.5 text-xs font-bold text-[#cccccc] bg-white/5 hover:bg-white/10"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white hover:scale-105 transition-all shadow-lg"
                                                >
                                                    Deploy to Team
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* 3. Content Publisher View */}
                {subTab === 'publishing' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Resource & Announcement Publisher</h3>
                                <p className="text-sm text-[#cccccc]">Broadcast PDFs, training videos, or organizational announcements targeting specific rank groups.</p>
                            </div>
                            <button
                                onClick={() => setIsPublishModalOpen(true)}
                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-xs font-bold text-white hover:scale-105 transition-all shadow-md"
                            >
                                <Plus className="h-4 w-4" /> Publish Content
                            </button>
                        </div>

                        {/* Resources Feed */}
                        <div className="space-y-4">
                            {resources.map(resource => (
                                <div key={resource.id} className="glass rounded-xl border border-white/10 p-5 flex items-center justify-between hover:border-white/20 transition-all group">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#2997ff]">
                                            {resource.type === 'pdf' ? (
                                                <FileText className="h-5 w-5" />
                                            ) : resource.type === 'video' ? (
                                                <Video className="h-5 w-5" />
                                            ) : (
                                                <AlertCircle className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-sm font-bold text-white">{resource.title}</h4>
                                                <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider">• targeting: {resource.targetRank}</span>
                                            </div>
                                            <p className="text-xs text-[#cccccc] mb-1 max-w-xl">{resource.description}</p>
                                            {resource.link && (
                                                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#2997ff] font-semibold hover:underline">
                                                    View Resource file/link →
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <span className="text-xs text-[#86868b]">{resource.datePublished}</span>
                                        <button
                                            onClick={() => handleDeleteResource(resource.id)}
                                            className="text-[#86868b] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Publish Content Modal */}
                        <AnimatePresence>
                            {isPublishModalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.95, opacity: 0 }}
                                        className="w-full max-w-lg glass rounded-2xl border border-white/15 p-6 shadow-2xl"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className="text-lg font-bold text-white">Publish New Resource</h4>
                                            <button onClick={() => setIsPublishModalOpen(false)} className="text-[#cccccc] hover:text-white"><X className="h-5 w-5" /></button>
                                        </div>
                                        <form onSubmit={handlePublishResource} className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#cccccc] mb-2">Resource Title</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. August Promotion Strategy"
                                                    value={newResource.title}
                                                    onChange={e => setNewResource({ ...newResource, title: e.target.value })}
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-white/20"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#cccccc] mb-2">Content Type</label>
                                                    <select
                                                        value={newResource.type}
                                                        onChange={e => setNewResource({ ...newResource, type: e.target.value as 'pdf' | 'announcement' | 'video' })}
                                                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-sm text-white outline-none focus:border-white/20"
                                                    >
                                                        <option value="announcement">Announcement</option>
                                                        <option value="pdf">PDF Resource</option>
                                                        <option value="video">Training Video</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#cccccc] mb-2">Target Rank Audience</label>
                                                    <select
                                                        value={newResource.targetRank}
                                                        onChange={e => setNewResource({ ...newResource, targetRank: e.target.value })}
                                                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-sm text-white outline-none focus:border-white/20"
                                                    >
                                                        <option value="All">All Distributors</option>
                                                        <option value="Starters Only">Starters Only</option>
                                                        <option value="Bronze+ Leaders">Bronze+ Leaders</option>
                                                        <option value="Gold+ Leaders">Gold+ Leaders</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#cccccc] mb-2">Resource Link / File path (Optional)</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. https://youtube.com/... or resource.pdf"
                                                    value={newResource.link}
                                                    onChange={e => setNewResource({ ...newResource, link: e.target.value })}
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-white/20"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#cccccc] mb-2">Brief Summary</label>
                                                <textarea
                                                    required
                                                    rows={4}
                                                    placeholder="Enter a description of what this resource provides and why it is important..."
                                                    value={newResource.description}
                                                    onChange={e => setNewResource({ ...newResource, description: e.target.value })}
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-white/20 resize-none"
                                                />
                                            </div>
                                            <div className="pt-4 flex justify-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsPublishModalOpen(false)}
                                                    className="rounded-xl px-5 py-2.5 text-xs font-bold text-[#cccccc] bg-white/5 hover:bg-white/10"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white hover:scale-105 transition-all shadow-lg"
                                                >
                                                    Publish Resource
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* 4. Distributor Tracker View */}
                {subTab === 'distributors' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Downline Activity Directory</h3>
                                <p className="text-sm text-[#cccccc]">Track module completions, lead captures, and last active status of team members.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-[#86868b]" />
                                    <input
                                        type="text"
                                        placeholder="Search downlines..."
                                        value={distributorSearch}
                                        onChange={e => setDistributorSearch(e.target.value)}
                                        className="w-48 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pl-9 text-xs text-white outline-none focus:border-white/20"
                                    />
                                </div>
                                <div className="relative">
                                    <Filter className="absolute left-3 top-3 h-4 w-4 text-[#86868b]" />
                                    <select
                                        value={distributorRankFilter}
                                        onChange={e => setDistributorRankFilter(e.target.value)}
                                        className="w-44 rounded-xl border border-white/10 bg-black px-4 py-2.5 pl-9 text-xs text-white outline-none focus:border-white/20"
                                    >
                                        <option value="all">All Ranks</option>
                                        <option value="Starter">Starter</option>
                                        <option value="Bronze Leader">Bronze Leader</option>
                                        <option value="Silver Leader">Silver Leader</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Distributor Table */}
                        <div className="glass rounded-xl border border-white/10 overflow-hidden">
                            <table className="w-full text-left text-xs text-[#cccccc]">
                                <thead className="bg-white/3 text-[10px] font-semibold uppercase tracking-wider text-[#cccccc] border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-4">Distributor</th>
                                        <th className="px-6 py-4">Rank</th>
                                        <th className="px-6 py-4">Country</th>
                                        <th className="px-6 py-4">Active Leads</th>
                                        <th className="px-6 py-4">Training Progress</th>
                                        <th className="px-6 py-4">Last Login</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredDownlines.map(member => (
                                        <tr key={member.id} className="hover:bg-white/3 transition-colors">
                                            <td className="px-6 py-4 font-bold text-white">
                                                <div>{member.name}</div>
                                                <div className="text-[10px] text-[#86868b] font-normal">{member.email}</div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-[#2997ff]">{member.rank}</td>
                                            <td className="px-6 py-4 uppercase font-semibold">{member.country}</td>
                                            <td className="px-6 py-4 font-bold text-white">{member.leads}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                                                        <div className="h-full bg-cyan-500" style={{ width: `${member.trainingProgress}%` }} />
                                                    </div>
                                                    <span className="font-bold text-white">{member.trainingProgress}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[#cccccc]">{member.lastActive}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedDistributor(member)}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 hover:bg-white/10 hover:border-white/20 text-xs font-semibold text-white transition-all"
                                                >
                                                    <Eye className="h-3.5 w-3.5" /> Inspect
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredDownlines.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-[#86868b]">
                                                No team members matched the search filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Distributor Detail Modal */}
                        <AnimatePresence>
                            {selectedDistributor && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.95, opacity: 0 }}
                                        className="w-full max-w-xl glass rounded-2xl border border-white/15 p-6 shadow-2xl text-[#cccccc]"
                                    >
                                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                                            <div>
                                                <h4 className="text-lg font-bold text-white">{selectedDistributor.name}</h4>
                                                <p className="text-xs text-[#2997ff]">{selectedDistributor.rank} • {selectedDistributor.email}</p>
                                            </div>
                                            <button onClick={() => setSelectedDistributor(null)} className="text-[#cccccc] hover:text-white"><X className="h-5 w-5" /></button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 mb-6">
                                            <div className="glass rounded-xl p-4 border border-white/5 space-y-1">
                                                <div className="text-[10px] uppercase font-bold text-[#86868b]">Lead captures</div>
                                                <div className="text-2xl font-black text-white">{selectedDistributor.leads}</div>
                                                <div className="text-xs text-[#cccccc]">Total pipeline contacts captured</div>
                                            </div>
                                            <div className="glass rounded-xl p-4 border border-white/5 space-y-1">
                                                <div className="text-[10px] uppercase font-bold text-[#86868b]">Last activity</div>
                                                <div className="text-sm font-semibold text-white mt-1">{selectedDistributor.lastActive}</div>
                                                <div className="text-xs text-[#cccccc]">Distributor login activity status</div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Module Checklist completions</h5>
                                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                                {selectedDistributor.modules.map((mod, idx) => (
                                                    <div key={idx} className="flex items-center justify-between bg-white/3 border border-white/5 px-4 py-3 rounded-xl">
                                                        <span className="text-xs font-semibold text-slate-200">{mod.name}</span>
                                                        {mod.completed ? (
                                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-xs">✓</span>
                                                        ) : (
                                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-[#86868b] text-xs">•</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-6 mt-6 border-t border-white/10 flex justify-end">
                                            <button
                                                onClick={() => setSelectedDistributor(null)}
                                                className="rounded-xl bg-white/5 hover:bg-white/10 px-5 py-2.5 text-xs font-bold text-white"
                                            >
                                                Close profile
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* 5. Team Challenges View */}
                {subTab === 'challenges' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Network Activity Challenges</h3>
                                <p className="text-sm text-[#cccccc]">Launch challenges, reward performers, and track individual progress status across metrics.</p>
                            </div>
                            <button
                                onClick={() => setIsChallengeModalOpen(true)}
                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-xs font-bold text-white hover:scale-105 transition-all shadow-md"
                            >
                                <Plus className="h-4 w-4" /> Start Challenge
                            </button>
                        </div>

                        {/* Challenges List */}
                        <div className="space-y-6">
                            {challenges.map(challenge => {
                                const completedCount = challenge.participants.filter(p => p.completed).length
                                return (
                                    <div key={challenge.id} className="glass rounded-xl border border-white/10 p-6 space-y-6">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-white/5">
                                            <div>
                                                <h4 className="text-base font-bold text-white">{challenge.title}</h4>
                                                <p className="text-xs text-[#cccccc] mt-1">{challenge.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="inline-block rounded-full bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 text-xs text-yellow-400 font-semibold">
                                                    🏆 Reward: {challenge.reward}
                                                </span>
                                                <div className="text-[10px] text-[#86868b] mt-1">End Date: {challenge.endDate}</div>
                                            </div>
                                        </div>

                                        {/* Progress breakdown */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-xs font-semibold">
                                                <span className="text-[#cccccc]">Participants Tracker ({completedCount} / {challenge.participants.length} finished)</span>
                                                <span className="text-[#2997ff]">{Math.round((completedCount / challenge.participants.length) * 100)}% overall completion</span>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                {challenge.participants.map((part, pIdx) => {
                                                    const pct = Math.round((part.progress / challenge.targetValue) * 100)
                                                    return (
                                                        <div key={pIdx} className="glass rounded-xl border border-white/5 p-4 flex flex-col justify-between">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-xs font-bold text-white">{part.name}</span>
                                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${part.completed ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-[#cccccc]'}`}>
                                                                    {part.completed ? 'Finished' : `${part.progress} / ${challenge.targetValue}`}
                                                                </span>
                                                            </div>
                                                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                                                                <div className="h-full bg-cyan-400" style={{ width: `${pct}%` }} />
                                                            </div>
                                                            <div className="flex justify-end gap-1.5">
                                                                <button
                                                                    onClick={() => handleProgressChallenge(challenge.id, part.name, -1)}
                                                                    disabled={part.progress <= 0}
                                                                    className="h-6 w-6 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-[#cccccc] disabled:opacity-30"
                                                                >
                                                                    -
                                                                </button>
                                                                <button
                                                                    onClick={() => handleProgressChallenge(challenge.id, part.name, 1)}
                                                                    disabled={part.completed}
                                                                    className="h-6 w-6 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-[#cccccc] disabled:opacity-30"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Start Challenge Modal */}
                        <AnimatePresence>
                            {isChallengeModalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.95, opacity: 0 }}
                                        className="w-full max-w-lg glass rounded-2xl border border-white/15 p-6 shadow-2xl"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className="text-lg font-bold text-white">Start New Goal Challenge</h4>
                                            <button onClick={() => setIsChallengeModalOpen(false)} className="text-[#cccccc] hover:text-white"><X className="h-5 w-5" /></button>
                                        </div>
                                        <form onSubmit={handleCreateChallenge} className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#cccccc] mb-2">Challenge Title</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. Latam Recruits Sprint"
                                                    value={newChallenge.title}
                                                    onChange={e => setNewChallenge({ ...newChallenge, title: e.target.value })}
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-white/20"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#cccccc] mb-2">Target Group</label>
                                                    <select
                                                        value={newChallenge.targetGroup}
                                                        onChange={e => setNewChallenge({ ...newChallenge, targetGroup: e.target.value })}
                                                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-sm text-white outline-none focus:border-white/20"
                                                    >
                                                        <option value="All Distributors">All Distributors</option>
                                                        <option value="Starters">Starters Only</option>
                                                        <option value="Leaders">Leaders Only</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#cccccc] mb-2">Metric Type</label>
                                                    <select
                                                        value={newChallenge.metric}
                                                        onChange={e => setNewChallenge({ ...newChallenge, metric: e.target.value })}
                                                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-sm text-white outline-none focus:border-white/20"
                                                    >
                                                        <option value="K8 Sales">K8 Sales Volume</option>
                                                        <option value="Recruits">New Recruits</option>
                                                        <option value="Training Completions">Training Completions</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#cccccc] mb-2">Target value count</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        min="1"
                                                        value={newChallenge.targetValue}
                                                        onChange={e => setNewChallenge({ ...newChallenge, targetValue: parseInt(e.target.value) || 1 })}
                                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-white/20"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#cccccc] mb-2">Deadline Date</label>
                                                    <input
                                                        type="date"
                                                        required
                                                        value={newChallenge.endDate}
                                                        onChange={e => setNewChallenge({ ...newChallenge, endDate: e.target.value })}
                                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-white/20"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#cccccc] mb-2">Completion Reward Details</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. Free emGuarde device or special commission bonus"
                                                    value={newChallenge.reward}
                                                    onChange={e => setNewChallenge({ ...newChallenge, reward: e.target.value })}
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-white/20"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#cccccc] mb-2">Instructions</label>
                                                <textarea
                                                    required
                                                    rows={3}
                                                    placeholder="Write details or guidelines to motivate the team to finish this task..."
                                                    value={newChallenge.description}
                                                    onChange={e => setNewChallenge({ ...newChallenge, description: e.target.value })}
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-white/20 resize-none"
                                                />
                                            </div>
                                            <div className="pt-4 flex justify-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsChallengeModalOpen(false)}
                                                    className="rounded-xl px-5 py-2.5 text-xs font-bold text-[#cccccc] bg-white/5 hover:bg-white/10"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white hover:scale-105 transition-all shadow-lg"
                                                >
                                                    Launch Challenge
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* 6. Compliance Approval View */}
                {subTab === 'compliance' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Compliance Approval Queue</h3>
                            <p className="text-sm text-[#cccccc]">Review distributor websites, landing pages, and promotional resources to ensure alignment with compliance guidelines.</p>
                        </div>

                        {/* Tab Headers */}
                        <div className="flex border-b border-white/5">
                            {([
                                { id: 'pending', label: 'Pending Review' },
                                { id: 'approved', label: 'Approved Materials' },
                                { id: 'rejected', label: 'Non-Compliant' }
                            ] as const).map(cTab => (
                                <button
                                    key={cTab.id}
                                    onClick={() => setComplianceTab(cTab.id)}
                                    className={`px-5 py-3 text-xs font-bold transition-all border-b-2 ${
                                        complianceTab === cTab.id
                                            ? 'border-white/20 text-white'
                                            : 'border-transparent text-[#86868b] hover:text-[#cccccc]'
                                    }`}
                                >
                                    {cTab.label}
                                </button>
                            ))}
                        </div>

                        {/* Submissions List */}
                        <div className="space-y-4">
                            {complianceQueue.filter(item => item.status === complianceTab).map(item => (
                                <div key={item.id} className="glass rounded-xl border border-white/10 p-5 space-y-4 hover:border-white/15 transition-all">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-white text-sm">{item.distributorName}</span>
                                                <span className="text-[10px] text-[#86868b] uppercase tracking-wider">• {item.type}</span>
                                            </div>
                                            <h4 className="text-xs font-semibold text-[#cccccc]">Submission: <span className="text-[#cccccc]">{item.title}</span></h4>
                                            <div className="text-[10px] text-[#86868b]">Submitted on {item.submittedDate}</div>
                                        </div>
                                        <div className="text-right">
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs text-[#2997ff] font-bold hover:underline"
                                            >
                                                Inspect Resource →
                                            </a>
                                        </div>
                                    </div>

                                    {/* Reject reason details */}
                                    {item.status === 'rejected' && item.feedback && (
                                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3.5 text-xs">
                                            <strong className="block mb-1">Rejection Feedback:</strong>
                                            {item.feedback}
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    {item.status === 'pending' && (
                                        <div className="pt-3 border-t border-white/5 flex gap-2 justify-end">
                                            <button
                                                onClick={() => setRejectionModalItem(item)}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3.5 py-1.5 text-xs font-bold text-red-400 transition-all"
                                            >
                                                <ThumbsDown className="h-3.5 w-3.5" /> Reject / Flag
                                            </button>
                                            <button
                                                onClick={() => handleApproveCompliance(item.id)}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 px-3.5 py-1.5 text-xs font-bold text-green-400 transition-all"
                                            >
                                                <ThumbsUp className="h-3.5 w-3.5" /> Approve
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {complianceQueue.filter(item => item.status === complianceTab).length === 0 && (
                                <div className="py-12 text-center text-[#86868b] text-xs">
                                    No elements found in this queue tab.
                                </div>
                            )}
                        </div>

                        {/* Rejection Reasons feedback modal */}
                        <AnimatePresence>
                            {rejectionModalItem && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.95, opacity: 0 }}
                                        className="w-full max-w-lg glass rounded-2xl border border-white/15 p-6 shadow-2xl"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className="text-lg font-bold text-white">Flag Non-Compliant Material</h4>
                                            <button onClick={() => setRejectionModalItem(null)} className="text-[#cccccc] hover:text-white"><X className="h-5 w-5" /></button>
                                        </div>
                                        <form onSubmit={handleRejectCompliance} className="space-y-4">
                                            <div>
                                                <p className="text-xs text-[#cccccc] mb-2">
                                                    Distributor: <strong className="text-white">{rejectionModalItem.distributorName}</strong><br />
                                                    Item: <strong className="text-white">{rejectionModalItem.title}</strong>
                                                </p>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#cccccc] mb-2">Rejection Feedback & Required Changes</label>
                                                <textarea
                                                    required
                                                    rows={4}
                                                    placeholder="e.g. Please remove medical claims referencing cancer and diabetes. Under Enagic rules, you can only make approved water wellness benefits claims..."
                                                    value={rejectionFeedback}
                                                    onChange={e => setRejectionFeedback(e.target.value)}
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 resize-none"
                                                />
                                            </div>
                                            <div className="pt-4 flex justify-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setRejectionModalItem(null)}
                                                    className="rounded-xl px-5 py-2.5 text-xs font-bold text-[#cccccc] bg-white/5 hover:bg-white/10"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-lg"
                                                >
                                                    Flag Material
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
