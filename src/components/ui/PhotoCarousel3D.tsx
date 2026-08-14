import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Globe, Star, Trophy, Users, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocaleContext } from '@/contexts/LocaleContext'

const LEADERS = [
    {
        id: 1,
        name: 'Coach Mehdi',
        profileUrl: '/d/mehdi-cohen',
        handle: '@mehdicohen_',
        instagramUrl: 'https://www.instagram.com/mehdicohen_/',
        region: 'Morocco · Colombia · USA',
        role: 'Global Founder & Market Builder',
        intro: 'After 24 years in the U.S., Mehdi expanded into Morocco and now Colombia — opening new markets while mentoring leaders who want more intentional, flexible lives with Enagic.',
        bio: [
            'After spending 24 years living and working in the United States, I built my life the traditional way — career, routine, and a clear idea of what success was supposed to look like.',
            'Over time, I realized I wanted something more intentional and flexible. That shift began when I was introduced to Enagic\'s Japanese technology and the business model behind it.',
            'I chose to expand beyond what was familiar, helping open new markets internationally — first in Morocco, now in Colombia — while continuing to mentor and support people across the U.S. who want to build with purpose and long-term vision.',
        ],
        image: '/leaders/standardized/mehdi-cohen.png',
        icon: Globe,
        gradient: 'from-[#1B3A8C] to-blue-600',
        glow: 'rgba(27,58,140,0.5)',
    },
    {
        id: 2,
        name: 'Ryan Pool Sr',
        profileUrl: '/d/ryan-pool',
        handle: '@ryanpoolsr',
        instagramUrl: 'https://www.instagram.com/ryanpoolsr/',
        region: 'Los Angeles · USA',
        role: 'Entrepreneur & Community Leader',
        intro: 'Ryan is an entrepreneur, former athlete, and community-minded leader focused on wellness, personal development, financial freedom, and building a lasting family legacy.',
        bio: [
            'Ryan Pool is an entrepreneur, former athlete, and community-minded leader based in Los Angeles. Passionate about health, fitness, personal development, and entrepreneurship, Ryan is focused on building businesses, connecting with like-minded people, and creating opportunities for others.',
            'As an independent entrepreneur in the wellness space, Ryan is expanding his network and helping people discover new ways to prioritize hydration, wellness, and a healthier lifestyle. His vision goes beyond business—he wants to build a strong legacy for his family, create financial freedom, and inspire others to pursue their own goals with purpose, discipline, and consistency.',
        ],
        image: '/leaders/standardized/ryan-pool-sr.png',
        icon: Users,
        gradient: 'from-blue-600 to-indigo-600',
        glow: 'rgba(37,99,235,0.5)',
    },
    {
        id: 3,
        name: 'Coach Magaly',
        profileUrl: '/d/magaly-cardona',
        handle: '@mcardonita',
        instagramUrl: 'https://www.instagram.com/mcardonita/',
        region: 'USA · LATAM',
        role: 'Coach & Impact-Driven Entrepreneur',
        intro: 'Magaly helps people design work that aligns with their values — guiding leaders across the U.S. and Latin America to build intentional businesses through Enagic and community.',
        bio: [
            'After years of trying to create a life that felt both meaningful and balanced, I realized I wanted a way of working that aligned more deeply with my values. That journey led me to Enagic and a community centered around growth, education, and contribution.',
            'What began as a personal shift became a professional calling. Today, as a coach and entrepreneur, I support people in the U.S. and around the world who want to build with more intention — whether that\'s in their health, their work, or the direction of their lives.',
        ],
        image: '/leaders/standardized/magaly-cardona.png',
        icon: Trophy,
        gradient: 'from-indigo-500 to-purple-600',
        glow: 'rgba(99,102,241,0.5)',
    },
    {
        id: 4,
        name: 'Coach Ming Way',
        profileUrl: '/d/ming-way-sia',
        handle: '@mingwaysia',
        instagramUrl: 'https://www.instagram.com/mingwaysia/',
        region: 'Malaysia · India',
        role: 'Business Builder & Mentor',
        intro: 'Ming Way built from the ground up alongside his father, developing discipline and resilience that he now uses to help others build responsible, legacy-focused businesses.',
        bio: [
            'I made the decision to step away from a traditional academic path and work alongside my father to build a business from the ground up. It wasn\'t glamorous — for two years, I worked relentlessly, navigating challenges that tested my discipline, resilience, and character.',
            'That period became the foundation for everything that followed. What began as uncertainty turned into a long-term vision — a business and a legacy built through consistency, responsibility, and commitment.',
            'Today, I focus on helping others think beyond default paths, take ownership of their decisions, and build lives and businesses that reflect their values, not just society\'s expectations.',
        ],
        image: '/leaders/standardized/ming-way-sia.png',
        icon: Zap,
        gradient: 'from-amber-500 to-orange-600',
        glow: 'rgba(245,158,11,0.5)',
    },
    {
        id: 5,
        name: 'Coach Simon Loh',
        profileUrl: '/d/simon-loh',
        handle: '@simonloh_',
        instagramUrl: 'https://www.instagram.com/simonloh_/',
        region: 'Malaysia · UAE · Nigeria',
        role: 'Global Entrepreneur & Strategist',
        intro: 'Since 2016 Simon has supported more than 10,000 entrepreneurs and over $30M in sales volume — helping leaders in markets like Malaysia, India, UAE, Turkey, and Nigeria build sustainable businesses.',
        bio: [
            "I'm a global entrepreneur who has spent the last several years building and scaling businesses across multiple international markets.",
            "Since 2016, I've had the opportunity to work with and support more than 10,000 entrepreneurs, generate over $30 million in sales volume, and help expand operations in countries including Malaysia, India, the United Arab Emirates, Turkey, and Nigeria.",
            'My focus is on helping people move beyond traditional career limitations by applying practical, disciplined, and proven business strategies. Through speaking, mentoring, and direct collaboration, I work with individuals who want to build more intentional, flexible, and sustainable professional lives.',
        ],
        image: '/leaders/standardized/simon-loh.png',
        imageTransform: 'scale(1.24) translateY(-4.5%)',
        icon: Star,
        gradient: 'from-cyan-600 to-blue-700',
        glow: 'rgba(6,182,212,0.5)',
    },
    {
        id: 6,
        name: 'Alex Gonzalez',
        profileUrl: '/d/alex-gonzalez',
        handle: '@alexgonzalez_vp',
        instagramUrl: 'https://www.instagram.com/alexgonzalez_vp/',
        region: 'USA',
        role: 'Marketing & Wellness Leader',
        intro: 'Alex brings more than 35 years of supplement-industry marketing experience and a lifelong commitment to health, wellness, and helping others live fulfilling lives.',
        bio: [
            'Alex Gonzalez brings over 35 years of experience in marketing within the supplement industry. Throughout his career, he has remained passionate about health, wellness, and helping others live their best lives.',
            'For Alex, a healthy lifestyle isn’t just a profession—it’s a personal commitment and the most important foundation for a fulfilling life.',
        ],
        image: '/leaders/standardized/alex-gonzalez.png',
        icon: Globe,
        gradient: 'from-blue-700 to-cyan-700',
        glow: 'rgba(14,165,233,0.5)',
    },
    {
        id: 7,
        name: 'Zah Naderi',
        profileUrl: '/d/zah-naderi',
        handle: '@zahphysique',
        instagramUrl: 'https://www.instagram.com/zahphysique/',
        region: 'USA',
        role: 'Performance Coach & Legacy Builder',
        intro: 'For more than a decade, Zah has coached elite athletes, celebrities, and executives—bringing lessons in leadership, leverage, and collaboration to True Legacy.',
        bio: [
            'For more than a decade, I’ve had the privilege of coaching some of the world’s top performers—elite athletes, celebrities, and C-suite executives. What I discovered along that journey went beyond training: it was about mastering leadership, understanding leverage, and embracing a vision bigger than yourself.',
            'I realized true, lasting impact comes from connecting with the right people and choosing the right vehicle. That led me to Enagic and to a space where like-minded leaders unite, blend their strengths, and leverage our collective expertise to build generational wealth and a lasting legacy.',
        ],
        image: '/leaders/standardized/zah-naderi.png',
        icon: Trophy,
        gradient: 'from-indigo-600 to-blue-700',
        glow: 'rgba(79,70,229,0.5)',
    },
    {
        id: 8,
        name: 'Emanuela Doustova',
        profileUrl: '/d/emanuela-doustova',
        handle: '@emanuelabraj',
        instagramUrl: 'https://www.instagram.com/emanuelabraj/',
        region: 'USA',
        role: 'True Legacy Distributor',
        intro: 'Emanuela is part of the growing True Legacy distributor community. Her full story and additional profile details are coming soon.',
        bio: [
            'Emanuela is part of the growing True Legacy distributor community. Her full biography and additional profile details will be added soon.',
        ],
        image: '/leaders/standardized/emanuela-doustova.png',
        icon: Star,
        gradient: 'from-fuchsia-600 to-indigo-700',
        glow: 'rgba(192,38,211,0.45)',
    },
]

const LEADER_COPY = {
    es: {
        viewProfile: 'Ver perfil',
        roles: ['Fundador global y desarrollador de mercados', 'Emprendedor y líder comunitario', 'Coach y emprendedora con propósito', 'Constructor de negocios y mentor', 'Emprendedor global y estratega', 'Líder de marketing y bienestar', 'Coach de rendimiento y creador de legado', 'Distribuidora de True Legacy'],
        bios: [
            'Después de 24 años en Estados Unidos, Mehdi ahora ayuda a abrir mercados en Marruecos y Colombia mientras acompaña a personas que desean construir con propósito y visión a largo plazo.',
            'Ryan es emprendedor, exatleta y líder comunitario en Los Ángeles. Su visión es crear libertad financiera, un legado familiar sólido e inspirar a otros con propósito, disciplina y constancia.',
            'Magaly acompaña a personas en Estados Unidos y otros mercados para que construyan su salud, su trabajo y su vida con mayor intención, equilibrio y conexión con sus valores.',
            'Ming Way construyó un negocio desde cero junto a su padre. Hoy ayuda a otros a desarrollar disciplina, asumir sus decisiones y crear negocios responsables que reflejen sus valores.',
            'Desde 2016, Simon ha apoyado a más de 10.000 emprendedores en mercados internacionales y enseña estrategias prácticas para crear vidas profesionales más flexibles y sostenibles.',
            'Alex aporta más de 35 años de experiencia en marketing dentro de la industria de suplementos y un compromiso permanente con la salud, el bienestar y una vida plena.',
            'Durante más de una década, Zah ha entrenado a atletas de élite, celebridades y ejecutivos, uniendo liderazgo, visión y colaboración para construir un legado auténtico.',
            'Emanuela forma parte de la creciente comunidad de distribuidores de True Legacy. Su historia completa y más detalles de su perfil se agregarán próximamente.',
        ],
    },
    fr: {
        viewProfile: 'Voir le profil',
        roles: ['Fondateur mondial et développeur de marchés', 'Entrepreneur et leader communautaire', 'Coach et entrepreneure engagée', 'Bâtisseur d’entreprise et mentor', 'Entrepreneur mondial et stratège', 'Leader en marketing et bien-être', 'Coach de performance et bâtisseur d’héritage', 'Distributrice True Legacy'],
        bios: [
            'Après 24 ans aux États-Unis, Mehdi contribue aujourd’hui à ouvrir des marchés au Maroc et en Colombie tout en accompagnant ceux qui souhaitent bâtir avec vision et détermination.',
            'Ryan est entrepreneur, ancien athlète et leader communautaire à Los Angeles. Sa vision est de créer une liberté financière, un héritage familial durable et d’inspirer les autres.',
            'Magaly accompagne des personnes aux États-Unis et ailleurs afin qu’elles construisent leur santé, leur travail et leur vie avec davantage d’intention et d’équilibre.',
            'Ming Way a bâti une entreprise avec son père. Aujourd’hui, il aide les autres à développer leur discipline et à créer des activités responsables, alignées avec leurs valeurs.',
            'Depuis 2016, Simon a accompagné plus de 10 000 entrepreneurs sur plusieurs marchés et partage des stratégies pratiques pour bâtir une vie professionnelle plus libre et durable.',
            'Alex apporte plus de 35 ans d’expérience en marketing dans l’industrie des compléments alimentaires et un engagement constant envers la santé et le bien-être.',
            'Depuis plus de dix ans, Zah accompagne des athlètes d’élite, des célébrités et des dirigeants, en réunissant leadership, vision et collaboration pour bâtir un héritage authentique.',
            'Emanuela fait partie de la communauté grandissante des distributeurs True Legacy. Son histoire complète et les détails de son profil seront ajoutés prochainement.',
        ],
    },
    pt: {
        viewProfile: 'Ver perfil',
        roles: ['Fundador global e desenvolvedor de mercados', 'Empreendedor e líder comunitário', 'Coach e empreendedora de impacto', 'Construtor de negócios e mentor', 'Empreendedor global e estrategista', 'Líder de marketing e bem-estar', 'Coach de performance e construtor de legado', 'Distribuidora True Legacy'],
        bios: [
            'Depois de 24 anos nos Estados Unidos, Mehdi agora ajuda a abrir mercados no Marrocos e na Colômbia e apoia pessoas que desejam construir com propósito e visão de longo prazo.',
            'Ryan é empreendedor, ex-atleta e líder comunitário em Los Angeles. Sua visão é criar liberdade financeira, um legado familiar sólido e inspirar outras pessoas.',
            'Magaly apoia pessoas nos Estados Unidos e em outros mercados a construírem sua saúde, seu trabalho e sua vida com mais intenção, equilíbrio e alinhamento com seus valores.',
            'Ming Way construiu um negócio ao lado do pai. Hoje ajuda outras pessoas a desenvolverem disciplina e criarem negócios responsáveis, alinhados aos seus valores.',
            'Desde 2016, Simon já apoiou mais de 10 mil empreendedores em mercados internacionais e ensina estratégias práticas para criar vidas profissionais mais flexíveis e sustentáveis.',
            'Alex reúne mais de 35 anos de experiência em marketing na indústria de suplementos e um compromisso permanente com saúde, bem-estar e uma vida plena.',
            'Há mais de uma década, Zah treina atletas de elite, celebridades e executivos, unindo liderança, visão e colaboração para construir um legado autêntico.',
            'Emanuela faz parte da crescente comunidade de distribuidores True Legacy. Sua história completa e mais detalhes do perfil serão adicionados em breve.',
        ],
    },
} as const

export function PhotoCarousel3D() {
    const { locale } = useLocaleContext()
    const [active, setActive] = useState(0)
    const count = LEADERS.length

    const prev = () => {
        setActive((a) => (a - 1 + count) % count)
    }

    const next = () => {
        setActive((a) => (a + 1) % count)
    }

    useEffect(() => {
        const t = setInterval(next, 5000)
        return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getCardStyle = (idx: number) => {
        const diff = ((idx - active + count) % count + count) % count
        const normDiff = diff > count / 2 ? diff - count : diff

        if (normDiff === 0) return { zIndex: 10, x: '0%', scale: 1, opacity: 1, rotateY: 0 }
        if (normDiff === 1 || normDiff === -1) {
            return {
                zIndex: 5,
                x: normDiff > 0 ? '55%' : '-55%',
                scale: 0.82,
                opacity: 0.6,
                rotateY: normDiff > 0 ? -18 : 18,
            }
        }
        return {
            zIndex: 1,
            x: normDiff > 0 ? '90%' : '-90%',
            scale: 0.65,
            opacity: 0.2,
            rotateY: normDiff > 0 ? -28 : 28,
        }
    }

    const localized = locale === 'en' ? null : LEADER_COPY[locale]
    const leaders = LEADERS.map((leader, index) => localized ? { ...leader, role: localized.roles[index], bio: [localized.bios[index]] } : leader)
    const activeLeader = leaders[active]

    return (
        <div className="w-full px-4 md:px-8 pb-12 overflow-visible" style={{ touchAction: 'pan-y' }}>
            {/* 3D Stage */}
            <div
                className="relative mx-auto overflow-hidden h-[380px] sm:h-[440px]"
                style={{ perspective: '1200px' }}
            >
                {leaders.map((leader, idx) => {
                    const style = getCardStyle(idx)
                    const LIcon = leader.icon
                    return (
                        <motion.div
                            key={leader.id}
                            animate={{
                                x: style.x,
                                scale: style.scale,
                                opacity: style.opacity,
                                rotateY: style.rotateY,
                                zIndex: style.zIndex,
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
                            className="absolute top-0 left-1/2 w-[280px] sm:w-[320px] -translate-x-1/2 cursor-pointer"
                            onClick={() => {
                                if (idx !== active) {
                                    setActive(idx)
                                }
                            }}
                            style={{ zIndex: style.zIndex, transformStyle: 'preserve-3d' }}
                        >
                            <div
                                className={`relative h-[360px] sm:h-[420px] rounded-3xl overflow-hidden bg-gradient-to-br ${leader.gradient} border border-white/15 shadow-2xl`}
                                style={{ boxShadow: `0 25px 60px ${leader.glow}` }}
                            >
                                {/* Leader Photo (if available) or Icon background */}
                                {leader.image ? (
                                    <img
                                        src={leader.image}
                                        alt={leader.name}
                                        className="absolute inset-0 w-full h-full object-cover object-top"
                                        style={{ transform: 'imageTransform' in leader ? leader.imageTransform : undefined }}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-15">
                                        <LIcon className="w-40 h-40 text-white" />
                                    </div>
                                )}
                                {/* Gradient fade bottom for readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-between p-6">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                                            {leader.region}
                                        </p>
                                    </div>
                                    <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                        <h4 className="font-black text-white text-base mb-0.5">{leader.name}</h4>
                                        <p className="text-white/70 text-xs leading-relaxed line-clamp-2">{leader.role}</p>
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    )
                })}
            </div>

            {/* Controls stay attached to the active card, especially on mobile. */}
            <div className="mt-3 flex min-h-[44px] flex-nowrap items-center justify-center gap-3 px-2 sm:mt-5 sm:gap-4">
                <button
                    onClick={prev}
                    aria-label="Previous leader"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all hover:bg-white/10 hover:text-white sm:h-11 sm:w-11"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex shrink-0 flex-nowrap items-center justify-center gap-1.5 sm:gap-2">
                    {LEADERS.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActive(idx)}
                            aria-label={`Go to leader ${idx + 1}`}
                            className={`!min-h-0 !min-w-0 shrink-0 rounded-full transition-all duration-300 ${idx === active
                                ? '!h-1.5 !w-4 bg-orange-500 sm:!h-2 sm:!w-6'
                                : '!h-1.5 !w-1.5 bg-white/25 hover:bg-white/50 sm:!h-2 sm:!w-2'
                                }`}
                        />
                    ))}
                </div>

                <button
                    onClick={next}
                    aria-label="Next leader"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all hover:bg-white/10 hover:text-white sm:h-11 sm:w-11"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            {/* Leader intro (below 3D cards): full bio + Instagram */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="mt-6 max-w-2xl mx-auto text-center px-4"
                >
                    <div className="flex justify-center mb-1">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">{activeLeader.role}</span>
                    </div>
                    <h3 className="text-xl font-black text-white mb-0.5">{activeLeader.name}</h3>
                    <div className="mb-3 flex flex-wrap items-center justify-center gap-3">
                        {activeLeader.instagramUrl && (
                            <a
                                href={activeLeader.instagramUrl}
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 text-sm text-tl-gold hover:text-white transition-colors"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                </svg>
                                <span>{activeLeader.handle}</span>
                            </a>
                        )}
                        <Link to={activeLeader.profileUrl} className="text-sm font-semibold text-cyan-300 transition-colors hover:text-white">
                            {localized?.viewProfile ?? 'View profile'}
                        </Link>
                    </div>
                    <div className="text-slate-400 text-sm leading-relaxed text-left space-y-3">
                        {activeLeader.bio.map((para, idx) => (
                            <p key={idx}>{para}</p>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

        </div>
    )
}
