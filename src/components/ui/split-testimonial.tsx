"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role?: string;
  company?: string;
  flagEmoji?: string;
  image?: string;
  photo?: string;
  stars?: number;
  instagram?: string;
  instagramUrl?: string;
  handle?: string;
  tiktok?: string;
  region?: string;
  isLeader?: boolean;
  verified?: boolean;
}

// Order and assets from public/assets/testimonials — each photo matches the person by name/handle
const TESTIMONIALS_RAW = [
  {
    id: 1,
    name: "Doina Rotar",
    handle: "@doinitarotar",
    instagramUrl: "https://www.instagram.com/doinitarotar/",
    photo: "/assets/testimonials/doina.png",
    quote:
      "My name is Doina, and Kangen Water has truly changed my daily life as a single mom living with fibromyalgia. For years, I lived in constant pain, especially in my hands, and nothing I tried seemed to help the inflammation in my body. A friend introduced me to Kangen Water, and even though I couldn't afford the machine upfront, I chose to invest in my health and my kids' future. After a few months of consistency, I began noticing real changes—less pain, more energy, clearer skin, and overall improvement in how I felt. I was even able to stop taking my nerve relaxation medications. Today, I'm in my second year of using my Kangen machine, and I can honestly say it's one of the best investments I've ever made for my health, my children, and my life.",
    stars: 5,
    verified: true,
  },
  {
    id: 2,
    name: "Egbert Nah",
    handle: "@egbertnah",
    instagramUrl: "https://www.instagram.com/egbertnah/",
    photo: "/assets/testimonials/egbert.png",
    quote:
      "For 10 years I poured my heart into my food and beverage business, but when COVID hit, I was close to losing everything. The fear of not being able to support my family was overwhelming. Enagic gave me the financial stability and peace of mind I needed to keep going. This journey also pushed me to grow as a person, helping me recognize my strengths, face my weaknesses, and understand that success comes from believing in yourself and surrounding yourself with the right team. Enagic isn't just a business; it's an opportunity that truly transforms lives.",
    stars: 5,
    verified: true,
  },
  {
    id: 3,
    name: "Mok E Lin",
    handle: "@elinmok98",
    instagramUrl: "https://www.instagram.com/elinmok98/",
    photo: "/assets/testimonials/mok.png",
    quote:
      "After graduating, I entered the fast-paced world of stock trading and landed a high-paying job that many people would envy. But despite the financial success, something still felt missing. In my search for purpose, I discovered True Legacy through Coach Simon, an opportunity to make a real difference. Today, I travel the world as a global emGuarde distributor, sharing a mission of protection and empowerment for people.",
    stars: 5,
    verified: true,
  },
  {
    id: 4,
    name: "Nigara Ismailova",
    handle: "@nigara.ismail",
    instagramUrl: "https://www.instagram.com/nigara.ismail/",
    photo: "/assets/testimonials/nigara.png",
    quote:
      "Through hard work, focus, and faith, I was able to regain financial stability and discover a new sense of purpose. Today, almost 10 years later, I've not only transformed my health and my finances, but I've also been able to help others do the same around the world. This business gave me back hope. If I could move forward, you can too. You just need to take that first step.",
    stars: 5,
    verified: true,
  },
  {
    id: 5,
    name: "Ryan Pool",
    handle: "@ocbbullet",
    instagramUrl: "https://www.instagram.com/ocbbullet/",
    photo: "/assets/testimonials/ryan.png",
    quote:
      "My journey with Kangen Water began as a search for better health and wiser choices. I was tired of overpaying for water that wasn't helping me feel my best. After staying consistent, I saw real changes—better mood, more energy, less fatigue, and less inflammation. What started as a health decision became a bigger opportunity, and I trusted the process knowing I was stepping into something aligned and purposeful.",
    stars: 5,
    verified: true,
  },
  {
    id: 6,
    name: "Sofia Cohen",
    handle: "@moroccanprincess91",
    instagramUrl: "https://www.instagram.com/moroccanprincess91/",
    photo: "/assets/testimonials/sofia.png",
    quote:
      "My name is Sofia, and nine years ago I made a decision that changed my life. Purchasing my Kangen Water machine became part of my healing journey. After years of inflammation, digestive, and skin issues, drinking Kangen Water daily helped me notice real changes: less inflammation, better digestion, and the feeling that my body was finally being supported. This water became part of my lifestyle and continues to support my healing, awareness, and growth.",
    stars: 5,
    verified: true,
  },
  {
    id: 7,
    name: "Thomas & Kristen Sinner",
    handle: "@thomas_sinner",
    instagramUrl: "https://www.instagram.com/thomas_sinner/",
    photo: "/assets/testimonials/thomas-kristen.png",
    quote:
      "We got started with Enagic about 5 years ago with the goal of helping our family. Through that decision we have been blessed to help almost 200 other families. Can't wait to see what the future holds.",
    stars: 5,
    verified: true,
  },
  {
    id: 8,
    name: "Zah Naderi",
    handle: "@zahphysique",
    instagramUrl: "https://www.instagram.com/zahphysique/",
    photo: "/assets/testimonials/zah.png",
    quote:
      "Growing up in Pakistan, I had the odds stacked against me from being an out-of-shape kid with big dreams to becoming a refugee. After 11 years of relentless dedication to my health, I transformed my body and mindset. Enagic's K8 technology was the missing piece that elevated my health to the next level. Now, I'm passionate about helping others craft their own wellness legacy.",
    stars: 5,
    verified: true,
  },
  {
    id: 9,
    name: "Veronica Calafat",
    handle: "@vero.calafat",
    instagramUrl: "https://www.instagram.com/vero.calafat/",
    photo: "/assets/testimonials/veronica.png",
    quote:
      "I'm very grateful to have discovered Kangen Water. At first, I didn't pay much attention because I didn't fully understand what it was, but two months later I attended a demonstration and everything clicked, so I decided to purchase the machine right there. After a few months of drinking Kangen Water consistently, I began to notice real changes: a clearer mind, more energy, and an overall sense of well-being. That's when I realized I hadn't just bought a machine, but a different way of taking care of my health from the inside out.",
    stars: 5,
    verified: true,
  },
];

const DEFAULT_TESTIMONIALS: Testimonial[] = TESTIMONIALS_RAW.map((t) => ({
  id: t.id,
  name: t.name,
  quote: t.quote,
  role: "True Legacy Distributor",
  company: "Global",
  flagEmoji: "🌍",
  image: t.photo,
  photo: t.photo,
  stars: t.stars,
  instagram: t.instagramUrl,
  instagramUrl: t.instagramUrl,
  handle: t.handle,
  verified: t.verified,
}));

// Localized testimonial copies (AI-translated from English originals)
const SPANISH_TESTIMONIALS: Testimonial[] = [
  {
    ...DEFAULT_TESTIMONIALS[0],
    quote:
      "Me llamo Doina, y el Agua Kangen ha transformado por completo mi día a día como madre soltera que vive con fibromialgia. Durante años viví con dolor constante, especialmente en las manos, y nada parecía ayudar con la inflamación de mi cuerpo. Una amiga me presentó el Agua Kangen y, aunque no podía permitirme la máquina al principio, decidí invertir en mi salud y en el futuro de mis hijos. Después de unos meses de constancia empecé a notar cambios reales: menos dolor, más energía, piel más clara y una mejora general en cómo me sentía. Incluso pude dejar mis medicamentos para los nervios. Hoy, después de dos años con mi máquina Kangen, puedo decir que ha sido una de las mejores inversiones que he hecho para mi salud, mis hijos y mi vida.",
  },
  {
    ...DEFAULT_TESTIMONIALS[1],
    quote:
      "Durante 10 años di todo en mi negocio de alimentos y bebidas, pero cuando llegó el COVID estuve a punto de perderlo todo. El miedo de no poder mantener a mi familia era abrumador. Enagic me dio la estabilidad financiera y la tranquilidad que necesitaba para seguir adelante. Este camino también me hizo crecer como persona, ayudándome a reconocer mis fortalezas, enfrentar mis debilidades y entender que el éxito viene de creer en ti mismo y rodearte del equipo correcto. Enagic no es solo un negocio; es una oportunidad que realmente transforma vidas.",
  },
  {
    ...DEFAULT_TESTIMONIALS[2],
    quote:
      "Después de graduarme entré en el mundo acelerado del trading bursátil y conseguí un trabajo muy bien pagado que muchos envidiarían. Pero a pesar del éxito financiero, sentía que me faltaba algo. Buscando propósito, descubrí True Legacy a través del Coach Simon: una oportunidad para generar un impacto real. Hoy viajo por el mundo como distribuidora global de emGuarde, compartiendo una misión de protección y empoderamiento para las personas.",
  },
  {
    ...DEFAULT_TESTIMONIALS[3],
    quote:
      "Gracias al trabajo duro, el enfoque y la fe, pude recuperar mi estabilidad financiera y descubrir un nuevo sentido de propósito. Hoy, casi 10 años después, no solo he transformado mi salud y mis finanzas, sino que también he podido ayudar a otros a hacer lo mismo en todo el mundo. Este negocio me devolvió la esperanza. Si yo pude seguir adelante, tú también puedes. Solo necesitas dar ese primer paso.",
  },
  {
    ...DEFAULT_TESTIMONIALS[4],
    quote:
      "Mi camino con el Agua Kangen comenzó buscando mejor salud y decisiones más inteligentes. Estaba cansado de pagar de más por agua que no me hacía sentir mejor. Después de ser constante, vi cambios reales: mejor estado de ánimo, más energía, menos fatiga y menos inflamación. Lo que empezó como una decisión de salud se convirtió en una oportunidad más grande, y confié en el proceso sabiendo que estaba entrando en algo alineado y con propósito.",
  },
  {
    ...DEFAULT_TESTIMONIALS[5],
    quote:
      "Me llamo Sofía, y hace nueve años tomé una decisión que cambió mi vida. Comprar mi máquina de Agua Kangen se convirtió en parte de mi proceso de sanación. Después de años de inflamación, problemas digestivos y de piel, beber Agua Kangen a diario me ayudó a notar cambios reales: menos inflamación, mejor digestión y la sensación de que mi cuerpo por fin estaba siendo apoyado. Esta agua se volvió parte de mi estilo de vida y sigue apoyando mi sanación, consciencia y crecimiento.",
  },
  {
    ...DEFAULT_TESTIMONIALS[6],
    quote:
      "Empezamos con Enagic hace unos 5 años con el objetivo de ayudar a nuestra familia. A través de esa decisión hemos tenido la bendición de ayudar a casi 200 familias más. Estamos emocionados por todo lo que viene en el futuro.",
  },
  {
    ...DEFAULT_TESTIMONIALS[7],
    quote:
      "Crecí en Pakistán con todas las probabilidades en mi contra: de ser un niño con sobrepeso y grandes sueños a convertirme en refugiado. Después de 11 años de dedicación implacable a mi salud, transformé mi cuerpo y mi mentalidad. La tecnología K8 de Enagic fue la pieza que faltaba para llevar mi salud al siguiente nivel. Ahora me apasiona ayudar a otros a construir su propia herencia de bienestar.",
  },
  {
    ...DEFAULT_TESTIMONIALS[8],
    quote:
      "Estoy muy agradecida de haber descubierto el Agua Kangen. Al principio no le presté mucha atención porque no entendía bien qué era, pero dos meses después asistí a una demostración y todo hizo clic, así que decidí comprar la máquina en ese mismo momento. Después de unos meses bebiendo Agua Kangen de forma constante, empecé a notar cambios reales: mente más clara, más energía y una sensación general de bienestar. Ahí entendí que no solo había comprado una máquina, sino una nueva forma de cuidar mi salud desde adentro hacia afuera.",
  },
];

const FRENCH_TESTIMONIALS: Testimonial[] = [
  {
    ...DEFAULT_TESTIMONIALS[0],
    quote:
      "Je m’appelle Doina et l’eau Kangen a véritablement transformé mon quotidien de maman célibataire vivant avec la fibromyalgie. Pendant des années, j’ai vécu avec des douleurs constantes, surtout dans les mains, et rien ne semblait aider l’inflammation de mon corps. Une amie m’a fait découvrir l’eau Kangen et, même si je ne pouvais pas vraiment me permettre la machine au début, j’ai choisi d’investir dans ma santé et dans l’avenir de mes enfants. Après quelques mois de constance, j’ai commencé à remarquer de vrais changements : moins de douleur, plus d’énergie, une peau plus nette et une amélioration générale de mon bien‑être. J’ai même pu arrêter mes médicaments pour les nerfs. Aujourd’hui, après deux ans avec ma machine Kangen, je peux dire que c’est l’un des meilleurs investissements que j’ai faits pour ma santé, mes enfants et ma vie.",
  },
  {
    ...DEFAULT_TESTIMONIALS[1],
    quote:
      "Pendant 10 ans, j’ai tout donné dans mon entreprise de restauration, mais lorsque le COVID est arrivé, j’ai failli tout perdre. La peur de ne plus pouvoir subvenir aux besoins de ma famille était immense. Enagic m’a apporté la stabilité financière et la tranquillité d’esprit dont j’avais besoin pour continuer. Ce parcours m’a aussi poussé à grandir en tant que personne, m’aidant à reconnaître mes forces, à affronter mes faiblesses et à comprendre que la réussite vient de la confiance en soi et du bon entourage. Enagic n’est pas seulement un business ; c’est une opportunité qui transforme réellement des vies.",
  },
  {
    ...DEFAULT_TESTIMONIALS[2],
    quote:
      "Après mes études, je suis entré dans le monde très rapide du trading boursier et j’ai obtenu un poste très bien payé que beaucoup envieraient. Mais malgré ce succès financier, il me manquait quelque chose. En cherchant un sens plus profond, j’ai découvert True Legacy grâce au Coach Simon – une opportunité d’avoir un véritable impact. Aujourd’hui, je voyage dans le monde entier comme distributrice globale emGuarde, en partageant une mission de protection et d’autonomisation.",
  },
  {
    ...DEFAULT_TESTIMONIALS[3],
    quote:
      "Grâce au travail, à la concentration et à la foi, j’ai pu retrouver une stabilité financière et découvrir un nouveau sens à ma vie. Aujourd’hui, presque 10 ans plus tard, je n’ai pas seulement transformé ma santé et mes finances, j’ai aussi pu aider d’autres personnes à faire de même partout dans le monde. Ce business m’a redonné espoir. Si j’ai pu avancer, vous le pouvez aussi. Il suffit de faire le premier pas.",
  },
  {
    ...DEFAULT_TESTIMONIALS[4],
    quote:
      "Mon parcours avec l’eau Kangen a commencé par une recherche de meilleure santé et de choix plus intelligents. J’en avais assez de payer trop cher pour une eau qui ne m’aidait pas à me sentir mieux. En restant constant, j’ai vu de vrais changements : meilleur humeur, plus d’énergie, moins de fatigue et moins d’inflammation. Ce qui avait commencé comme une décision de bien‑être est devenu une opportunité beaucoup plus grande, et j’ai fait confiance au processus en sachant que je m’engageais dans quelque chose d’aligné et porteur de sens.",
  },
  {
    ...DEFAULT_TESTIMONIALS[5],
    quote:
      "Je m’appelle Sofia, et il y a neuf ans j’ai pris une décision qui a changé ma vie. L’achat de ma machine d’eau Kangen est devenu une partie essentielle de mon chemin de guérison. Après des années d’inflammation, de problèmes digestifs et de peau, boire de l’eau Kangen chaque jour m’a permis de constater de vrais changements : moins d’inflammation, une meilleure digestion et la sensation que mon corps était enfin soutenu. Cette eau fait maintenant partie de mon mode de vie et continue de soutenir ma guérison, ma conscience et ma croissance.",
  },
  {
    ...DEFAULT_TESTIMONIALS[6],
    quote:
      "Nous avons commencé avec Enagic il y a environ 5 ans, avec l’objectif d’aider notre famille. Grâce à cette décision, nous avons eu la chance d’aider près de 200 autres familles. Nous avons hâte de voir ce que l’avenir nous réserve.",
  },
  {
    ...DEFAULT_TESTIMONIALS[7],
    quote:
      "En grandissant au Pakistan, tout jouait contre moi : j’étais un enfant en surpoids avec de grands rêves, puis je suis devenu réfugié. Après 11 ans de dévouement sans relâche à ma santé, j’ai transformé mon corps et mon état d’esprit. La technologie K8 d’Enagic a été la pièce manquante qui a élevé ma santé à un niveau supérieur. Aujourd’hui, je suis passionné par l’idée d’aider les autres à construire leur propre héritage de bien‑être.",
  },
  {
    ...DEFAULT_TESTIMONIALS[8],
    quote:
      "Je suis très reconnaissante d’avoir découvert l’eau Kangen. Au début, je n’y ai pas prêté beaucoup attention parce que je ne comprenais pas vraiment ce que c’était, mais deux mois plus tard j’ai assisté à une démonstration et tout est devenu clair ; j’ai donc décidé d’acheter la machine sur le moment. Après quelques mois à boire de l’eau Kangen régulièrement, j’ai commencé à remarquer de vrais changements : esprit plus clair, plus d’énergie et un sentiment général de bien‑être. C’est là que j’ai compris que je n’avais pas seulement acheté une machine, mais une nouvelle façon de prendre soin de ma santé de l’intérieur.",
  },
];

interface TestimonialsSplitProps {
  testimonials?: Testimonial[];
  locale?: "en" | "es" | "fr" | "pt";
}

export function TestimonialsSplit({
  testimonials,
  locale = "en",
}: TestimonialsSplitProps) {
  const list =
    testimonials ??
    (locale === "es" || locale === "pt"
      ? SPANISH_TESTIMONIALS
      : locale === "fr"
        ? FRENCH_TESTIMONIALS
        : DEFAULT_TESTIMONIALS);

  const roleLabel =
    locale === "es" || locale === "pt"
      ? "Distribuidor de True Legacy"
      : locale === "fr"
        ? "Distributeur True Legacy"
        : "True Legacy Distributor";

  const listWithLocaleRole = list.map((item) => ({
    ...item,
    role: roleLabel,
  }));

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const active = listWithLocaleRole[activeIndex];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % list.length);
  };

  // Auto-advance every 5 seconds, pauses on hover
  useEffect(() => {
    if (isHovering) return;
    const t = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % list.length);
    }, 5000);
    return () => clearInterval(t);
  }, [isHovering, list.length]);

  const igUrl = (company: string | undefined) => {
    if (!company) return "https://www.instagram.com/truelegacyworld/";
    const latam = [
      "Colombia",
      "Brazil",
      "Mexico",
      "Paraguay",
      "Norteamérica",
      "Europa",
      "Sudamérica",
      "LATAM",
      "Latin America",
    ];
    return latam.some((r) => company?.includes(r))
      ? "https://www.instagram.com/truelegacylatam/"
      : "https://www.instagram.com/truelegacyworld/";
  };

  const igHandle = (company: string | undefined) => {
    if (!company) return "@truelegacyworld";
    const latam = [
      "Colombia",
      "Brazil",
      "Mexico",
      "Paraguay",
      "Norteamérica",
      "Europa",
      "Sudamérica",
      "LATAM",
      "Latin America",
    ];
    return latam.some((r) => company?.includes(r))
      ? "@truelegacylatam"
      : "@truelegacyworld";
  };

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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
                <Star
                  key={i}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
          )}

          {/* Quote */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={active.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-base md:text-lg font-light leading-relaxed tracking-tight text-white"
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
                <p className="text-sm font-semibold text-white">
                  {active.name}
                </p>
                <p className="text-xs text-slate-400">
                  {active.role}
                  {active.isLeader ? " · Team Leader" : ""}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Instagram (above photo) + Photo */}
        <div className="relative w-full md:w-72 md:h-[400px] shrink-0 flex flex-col items-center">
          <div className="flex flex-col items-center gap-2 mb-3">
            <a
              href={
                active.instagramUrl ?? active.instagram ?? igUrl(active.company)
              }
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#c13584",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: "14px",
              }}
              className="testimonial-ig-link hover:opacity-90 transition-opacity"
            >
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>{active.handle ?? igHandle(active.company)}</span>
              {active.verified && <span style={{ color: "#1da1f2" }}>✓</span>}
            </a>
            {active.tiktok && (
              <a
                href={active.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white opacity-80 hover:opacity-100 transition-opacity"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.78 1.52V6.73a4.84 4.84 0 01-1.01-.04z" />
                </svg>
                <span>@mehdi_cohen</span>
              </a>
            )}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, filter: "blur(20px)", scale: 1.05 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full min-h-[300px] md:min-h-[380px]"
            >
              <div className="w-full h-full rounded-[1.5rem] overflow-hidden border-[2px] border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)] bg-slate-900 flex items-center justify-center">
                {(active.image ?? active.photo) ? (
                  <img
                    src={active.image ?? active.photo}
                    alt={active.name}
                    className="testimonial-avatar w-full h-full object-contain rounded-2xl"
                    style={{ minWidth: 72, minHeight: 72 }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-800 to-navy-900 flex items-center justify-center">
                    <span className="text-4xl font-black text-white">
                      {active.name[0]}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="mt-8 mb-6 flex justify-center">
        <div className="flex items-center gap-2">
          {list.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(index);
              }}
              aria-label={`Testimonial ${index + 1}`}
              className={`transition-all duration-300 rounded-full shrink-0 ${
                index === activeIndex
                  ? "w-5 h-2.5 sm:w-6 bg-orange-500"
                  : "w-2.5 h-2.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
