"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, Star } from "lucide-react"

export interface Testimonial {
    id: number
    quote: string
    name: string
    role: string
    company?: string
    flagEmoji?: string
    image?: string
    stars?: number
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        quote:
            "Through hard work, focus, and faith, I was able to regain financial stability and discover a new sense of purpose. Today, almost 10 years later, I’ve not only transformed my health and my finances, but I’ve also been able to help others do the same around the world. This business gave me back hope. If I could move forward, you can too. You just need to take that first step.",
        name: "Nigara Ismailova",
        role: "True Legacy Leader",
        company: "North America",
        flagEmoji: "🇺🇸",
        image: "/testimonials/nigara.png",
        stars: 5,
    },
    {
        id: 2,
        quote:
            "Growing up in Pakistan, I had the odds stacked against me from being an out-of-shape kid with big dreams to becoming a refugee. After 11 years of relentless dedication to my health, I transformed my body and mindset. Enagic’s K8 technology was the missing piece that elevated my health to the next level. Now, I’m passionate about helping others craft their own wellness legacy.",
        name: "Zah Naderi",
        role: "Elite Performance Coach",
        company: "North America",
        flagEmoji: "🇵🇰",
        image: "/testimonials/zah.png",
        stars: 5,
    },
    {
        id: 3,
        quote:
            "For 10 years I poured my heart into my food and beverage business, but when COVID hit, I was close to losing everything. The fear of not being able to support my family was overwhelming. Enagic gave me the financial stability and peace of mind I needed to keep going. This journey also pushed me to grow as a person, helping me recognize my strengths, face my weaknesses, and understand that success comes from believing in yourself and surrounding yourself with the right team. Enagic isn’t just a business; it’s an opportunity that truly transforms lives.",
        name: "Egbert Nah",
        role: "Entrepreneur",
        company: "Asia",
        flagEmoji: "🇸🇬",
        image: "/testimonials/egbert.png",
        stars: 5,
    },
    {
        id: 4,
        quote:
            "My name is Doina, and Kangen Water has truly changed my daily life as a single mom living with fibromyalgia. For years, I lived in constant pain, especially in my hands, and nothing I tried seemed to help the inflammation in my body. A friend introduced me to Kangen Water, and even though I couldn’t afford the machine upfront, I chose to invest in my health and my kids’ future. After a few months of consistency, I began noticing real changes—less pain, more energy, clearer skin, and overall improvement in how I felt. I was even able to stop taking my nerve relaxation medications. Today, I can honestly say it’s one of the best investments I’ve ever made for my health, my children, and my life.",
        name: "Doina Rotar",
        role: "True Legacy Customer",
        company: "North America",
        flagEmoji: "🇺🇸",
        image: "/testimonials/doina.png",
        stars: 5,
    },
    {
        id: 5,
        quote:
            "My journey with Kangen Water began as a search for better health and wiser choices. I was tired of overpaying for water that wasn’t helping me feel my best. After staying consistent, I saw real changes—better mood, more energy, less fatigue, and less inflammation. What started as a health decision became a bigger opportunity, and I trusted the process knowing I was stepping into something aligned and purposeful.",
        name: "Ryan Pool",
        role: "Entrepreneur",
        company: "USA",
        flagEmoji: "🇺🇸",
        image: "/testimonials/ryan.png",
        stars: 5,
    },
    {
        id: 6,
        quote:
            "I’m very grateful to have discovered Kangen Water. At first, I didn’t pay much attention because I didn’t fully understand what it was, but two months later I attended a demonstration and everything clicked, so I decided to purchase the machine right there. After a few months of drinking Kangen Water consistently, I began to notice real changes: a clearer mind, more energy, and an overall sense of well-being. That’s when I realized I hadn’t just bought a machine, but a different way of taking care of my health from the inside out.",
        name: "Veronica Calafat",
        role: "True Legacy Customer",
        company: "Europe",
        flagEmoji: "🇪🇸",
        image: "/testimonials/veronica.png",
        stars: 5,
    },
    {
        id: 7,
        quote:
            "We got started with Enagic about 5 years ago with the goal of helping our family. Through that decision we have been blessed to help almost 200 other families. We can’t wait to see what the future holds.",
        name: "Thomas & Kristen Sinner",
        role: "True Legacy Leaders",
        company: "North America",
        flagEmoji: "🇺🇸",
        image: "/testimonials/thomas-kristen.png",
        stars: 5,
    },
    {
        id: 8,
        quote:
            "After graduating, I entered the fast-paced world of stock trading and landed a high-paying job that many people would envy. But despite the financial success, something still felt missing. In my search for purpose, I discovered True Legacy through Coach Simon, an opportunity to make a real difference. Today, I travel the world as a global emGuarde distributor, sharing a mission of protection and empowerment for people.",
        name: "Mok E Lin",
        role: "Global emGuarde Distributor",
        company: "Asia",
        flagEmoji: "🇲🇾",
        image: "/testimonials/mok.png",
        stars: 5,
    },
    {
        id: 9,
        quote:
            "My name is Sofia, and nine years ago I made a decision that changed my life. Purchasing my Kangen Water machine became part of my healing journey. After years of inflammation, digestive, and skin issues, drinking Kangen Water daily helped me notice real changes: less inflammation, better digestion, and the feeling that my body was finally being supported. This water became part of my lifestyle and continues to support my healing, awareness, and growth.",
        name: "Sofia Cohen",
        role: "True Legacy Customer",
        company: "USA",
        flagEmoji: "🇺🇸",
        image: "/testimonials/sofia.png",
        stars: 5,
    },
]

// Spanish testimonials for LATAM / Spanish country pages
const SPANISH_TESTIMONIALS: Testimonial[] = [
    { id: 1, quote: "Con trabajo duro, enfoque y fe, pude recuperar la estabilidad financiera y descubrir un nuevo sentido de propósito. Hoy, casi 10 años después, no solo he transformado mi salud y mis finanzas, sino que también he podido ayudar a otros a hacer lo mismo en todo el mundo. Este negocio me devolvió la esperanza. Si yo pude seguir adelante, tú también puedes. Solo necesitas dar ese primer paso.", name: "Nigara Ismailova", role: "Líder True Legacy", company: "Norteamérica", flagEmoji: "🇺🇸", image: "/testimonials/nigara.png", stars: 5 },
    { id: 2, quote: "Crecí en Pakistán con las probabilidades en mi contra, desde ser un niño fuera de forma con grandes sueños hasta convertirme en refugiado. Después de 11 años de dedicación a mi salud, transformé mi cuerpo y mi mentalidad. La tecnología K8 de Enagic fue la pieza que faltaba para elevar mi salud al siguiente nivel. Ahora me apasiona ayudar a otros a crear su propio legado de bienestar.", name: "Zah Naderi", role: "Coach de Alto Rendimiento", company: "Norteamérica", flagEmoji: "🇵🇰", image: "/testimonials/zah.png", stars: 5 },
    { id: 3, quote: "Durante 10 años dediqué mi corazón a mi negocio de alimentos y bebidas, pero cuando llegó el COVID, estuve a punto de perderlo todo. El miedo de no poder mantener a mi familia era abrumador. Enagic me dio la estabilidad financiera y la paz mental que necesitaba para seguir adelante. Este camino también me impulsó a crecer como persona, a reconocer mis fortalezas y a entender que el éxito viene de creer en uno mismo y rodearte del equipo correcto. Enagic no es solo un negocio; es una oportunidad que realmente transforma vidas.", name: "Egbert Nah", role: "Empresario", company: "Asia", flagEmoji: "🇸🇬", image: "/testimonials/egbert.png", stars: 5 },
    { id: 4, quote: "Me llamo Doina y el Agua Kangen realmente cambió mi vida diaria como madre soltera que vive con fibromialgia. Durante años viví con dolor constante, especialmente en las manos, y nada de lo que probé parecía ayudar con la inflamación. Una amiga me introdujo al Agua Kangen y, aunque no podía pagar la máquina de entrada, elegí invertir en mi salud y en el futuro de mis hijos. Después de unos meses siendo constante, empecé a notar cambios reales: menos dolor, más energía, piel más clara. Hoy digo con honestidad que es una de las mejores inversiones que he hecho para mi salud, mis hijos y mi vida.", name: "Doina Rotar", role: "Cliente True Legacy", company: "Norteamérica", flagEmoji: "🇺🇸", image: "/testimonials/doina.png", stars: 5 },
    { id: 5, quote: "Mi camino con el Agua Kangen comenzó como una búsqueda de mejor salud y decisiones más sabias. Estaba cansada de pagar de más por agua que no me hacía sentir bien. Después de ser constante, vi cambios reales: mejor ánimo, más energía, menos fatiga e inflamación. Lo que empezó como una decisión de salud se convirtió en una oportunidad más grande, y confié en el proceso sabiendo que estaba entrando en algo alineado y con propósito.", name: "Ryan Pool", role: "Empresario", company: "USA", flagEmoji: "🇺🇸", image: "/testimonials/ryan.png", stars: 5 },
    { id: 6, quote: "Estoy muy agradecida de haber descubierto el Agua Kangen. Al principio no le presté mucha atención porque no entendía bien qué era, pero dos meses después asistí a una demostración y todo cobró sentido, así que decidí comprar la máquina ahí mismo. Después de unos meses tomando Agua Kangen con constancia, empecé a notar cambios reales: una mente más clara, más energía y una sensación general de bienestar. Ahí me di cuenta de que no solo había comprado una máquina, sino una forma distinta de cuidar mi salud desde adentro.", name: "Veronica Calafat", role: "Cliente True Legacy", company: "Europa", flagEmoji: "🇪🇸", image: "/testimonials/veronica.png", stars: 5 },
    { id: 7, quote: "Comenzamos con Enagic hace unos 5 años con el objetivo de ayudar a nuestra familia. Gracias a esa decisión hemos tenido la bendición de ayudar a casi 200 familias más. No vemos la hora de ver lo que el futuro depara.", name: "Thomas & Kristen Sinner", role: "Líderes True Legacy", company: "Norteamérica", flagEmoji: "🇺🇸", image: "/testimonials/thomas-kristen.png", stars: 5 },
    { id: 8, quote: "Después de graduarme, entré al mundo acelerado del trading de acciones y conseguí un trabajo muy bien pagado que muchos envidiarían. Pero a pesar del éxito financiero, algo aún faltaba. En mi búsqueda de propósito, descubrí True Legacy a través del Coach Simon, una oportunidad de marcar una verdadera diferencia. Hoy viajo por el mundo como distribuidor global de emGuarde, compartiendo una misión de protección y empoderamiento para las personas.", name: "Mok E Lin", role: "Distribuidor Global emGuarde", company: "Asia", flagEmoji: "🇲🇾", image: "/testimonials/mok.png", stars: 5 },
    { id: 9, quote: "Me llamo Sofia y hace nueve años tomé una decisión que cambió mi vida. Comprar mi máquina de Agua Kangen se convirtió en parte de mi proceso de sanación. Después de años de problemas de inflamación, digestivos y de piel, beber Agua Kangen a diario me ayudó a notar cambios reales: menos inflamación, mejor digestión y la sensación de que mi cuerpo por fin estaba siendo apoyado. Esta agua se volvió parte de mi estilo de vida y sigue apoyando mi sanación, conciencia y crecimiento.", name: "Sofia Cohen", role: "Cliente True Legacy", company: "USA", flagEmoji: "🇺🇸", image: "/testimonials/sofia.png", stars: 5 },
]

interface TestimonialsSplitProps {
    testimonials?: Testimonial[]
    locale?: 'en' | 'es'
}

export function TestimonialsSplit({ testimonials, locale = 'en' }: TestimonialsSplitProps) {
    const list = testimonials ?? (locale === 'es' ? SPANISH_TESTIMONIALS : DEFAULT_TESTIMONIALS)
    const [activeIndex, setActiveIndex] = useState(0)
    const [isHovering, setIsHovering] = useState(false)

    const active = list[activeIndex]

    const nextTestimonial = () => {
        setActiveIndex((prev) => (prev + 1) % list.length)
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-6 pb-20">
            <div
                className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-center cursor-pointer group"
                onClick={nextTestimonial}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Left: Quote Content */}
                <div className="space-y-6">
                    {/* Company Tag */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active.company}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-slate-500"
                        >
                            <span className="w-8 h-px bg-orange-500/50" />
                            {active.flagEmoji && (
                                <span className="text-lg leading-none drop-shadow-sm">
                                    {active.flagEmoji}
                                </span>
                            )}
                            {active.company}
                        </motion.div>
                    </AnimatePresence>

                    {/* Stars */}
                    {active.stars && (
                        <div className="flex gap-1">
                            {Array.from({ length: active.stars }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                    )}

                    {/* Quote */}
                    <div className="relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.blockquote
                                key={active.id}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -40 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed tracking-tight text-white"
                            >
                                "{active.quote}"
                            </motion.blockquote>
                        </AnimatePresence>
                    </div>

                    {/* Author Info */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active.name}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="flex items-center gap-4"
                        >
                            <div className="w-10 h-px bg-white/20" />
                            <div>
                                <p className="text-sm font-semibold text-white">{active.name}</p>
                                <p className="text-xs text-slate-400">{active.role}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right: Photo */}
                <div className="relative w-full md:w-48 h-48 md:h-64 flex-shrink-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active.id}
                            initial={{ opacity: 0, filter: "blur(20px)", scale: 1.05 }}
                            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                            exit={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0"
                        >
                            <div
                                className="w-full h-full rounded-[1.5rem] overflow-hidden border-[2px] border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)] bg-[#0a1628] flex items-center justify-center"
                            >
                                {active.image ? (
                                    <img
                                        src={active.image}
                                        alt={active.name}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-800 to-navy-900 flex items-center justify-center">
                                        <span className="text-4xl font-black text-white">{active.name[0]}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Click indicator */}
                    <motion.div
                        animate={{
                            opacity: isHovering ? 1 : 0,
                            scale: isHovering ? 1 : 0.8,
                        }}
                        transition={{ duration: 0.2 }}
                        className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs text-orange-400 font-medium"
                    >
                        <span>{locale === 'es' ? 'Siguiente' : 'Next'}</span>
                        <ArrowUpRight className="w-3 h-3" />
                    </motion.div>
                </div>

                {/* Progress Dots */}
                <div className="absolute -bottom-12 left-0 flex items-center gap-3 md:col-span-1">
                    {list.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation()
                                setActiveIndex(index)
                            }}
                            className="relative p-1"
                            aria-label={`Testimonial ${index + 1}`}
                        >
                            <span
                                className={`block w-2 h-2 rounded-full transition-all duration-300 ${index === activeIndex
                                        ? "bg-orange-500 scale-100"
                                        : "bg-white/20 scale-75 hover:bg-white/40 hover:scale-100"
                                    }`}
                            />
                            {index === activeIndex && (
                                <motion.span
                                    layoutId="activeDot"
                                    className="absolute inset-0 border border-orange-500/50 rounded-full"
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
