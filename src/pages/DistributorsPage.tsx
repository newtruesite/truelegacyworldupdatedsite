import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SEO } from "@/components/SEO";
import { TLBackground } from "@/components/ui/TLBackground";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { getPublicDistributors } from "@/lib/crm";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Globe2,
  Instagram,
  Languages,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type Distributor = {
  slug: string;
  name: string;
  title: string;
  photo: string;
  fallbackInitial: string;
  regions: string[];
  languages: string[];
  whatsapp?: string;
  instagram?: string;
};

const FEATURED_ORDER = [
  "mehdi-cohen",
  "simon-loh",
  "ming-way-sia",
  "zah-naderi",
  "alex-gonzalez",
  "ryan-pool",
  "magaly-cardona",
  "emanuela",
  "jesse-schexnayder",
  "angel-mok",
];

const FALLBACK_DISTRIBUTORS: Distributor[] = [
  {
    slug: "mehdi-cohen",
    name: "Mehdi Cohen",
    title: "True Legacy World",
    photo: "/leaders/standardized/mehdi-cohen.png",
    fallbackInitial: "M",
    regions: ["Global", "LATAM", "Morocco", "USA", "Canada"],
    languages: ["en", "es", "fr"],
    whatsapp: "https://wa.me/18649072149",
    instagram: "https://www.instagram.com/mehdicohen_/",
  },
  {
    slug: "ryan-pool",
    name: "Ryan Pool Sr",
    title: "True Legacy Leader",
    photo: "/leaders/standardized/ryan-pool-sr.png",
    fallbackInitial: "R",
    regions: ["USA"],
    languages: ["en"],
    instagram: "https://www.instagram.com/ryanpoolsr/",
  },
];

const LANGUAGE_NAMES: Record<string, Record<string, string>> = {
  en: { en: "English", es: "Spanish", fr: "French", pt: "Portuguese", zh: "Mandarin", yue: "Cantonese", ms: "Malay", ar: "Arabic" },
  es: { en: "Inglés", es: "Español", fr: "Francés", pt: "Portugués", zh: "Mandarín", yue: "Cantonés", ms: "Malayo", ar: "Árabe" },
  fr: { en: "Anglais", es: "Espagnol", fr: "Français", pt: "Portugais", zh: "Mandarin", yue: "Cantonais", ms: "Malais", ar: "Arabe" },
  pt: { en: "Inglês", es: "Espanhol", fr: "Francês", pt: "Português", zh: "Mandarim", yue: "Cantonês", ms: "Malaio", ar: "Árabe" },
};

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default function DistributorsPage() {
  const { locale } = useLocaleContext();
  const [distributors, setDistributors] = useState<Distributor[]>(FALLBACK_DISTRIBUTORS);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [language, setLanguage] = useState("all");

  useEffect(() => {
    let active = true;
    getPublicDistributors().then((profiles) => {
      if (!active) return;
      setDistributors(
        profiles.map((profile) => ({
          slug: profile.slug,
          name: profile.display_name,
          title: profile.title,
          photo: profile.avatar_url || "",
          fallbackInitial: profile.display_name.charAt(0),
          regions: profile.regions,
          languages: profile.languages,
          whatsapp: profile.phone ? `https://wa.me/${profile.phone.replace(/\D/g, "")}` : undefined,
          instagram: profile.instagram_url || undefined,
        })),
      );
    });
    return () => {
      active = false;
    };
  }, []);

  const copy = {
    en: {
      eyebrow: "Verified True Legacy team",
      title: "Find your True Legacy guide.",
      subtitle: "Connect with the right leader by market, language, and relationship. If someone referred you, choose that person so your team attribution stays protected.",
      search: "Search by name",
      market: "All markets",
      language: "All languages",
      showing: "verified leaders",
      noResults: "No leaders match those filters yet.",
      clear: "Clear filters",
      profile: "View profile",
      referred: "Already referred?",
      referredBody: "Choose the person who introduced you to True Legacy. We protect existing relationships and team attribution.",
      unsure: "Not sure who to choose?",
      unsureBody: "Tell us your market, language, and interest. We’ll help route you to an available distributor.",
      match: "Help me find the right guide",
    },
    es: {
      eyebrow: "Equipo True Legacy verificado",
      title: "Encuentra tu guía True Legacy.",
      subtitle: "Conecta con el líder correcto según mercado, idioma y relación. Si alguien te refirió, elige a esa persona para proteger la atribución del equipo.",
      search: "Buscar por nombre",
      market: "Todos los mercados",
      language: "Todos los idiomas",
      showing: "líderes verificados",
      noResults: "Aún no hay líderes que coincidan con esos filtros.",
      clear: "Borrar filtros",
      profile: "Ver perfil",
      referred: "¿Ya tienes referente?",
      referredBody: "Elige a la persona que te presentó True Legacy. Protegemos las relaciones y la atribución del equipo.",
      unsure: "¿No sabes a quién elegir?",
      unsureBody: "Indica tu mercado, idioma e interés. Te conectaremos con un distribuidor disponible.",
      match: "Ayúdame a encontrar mi guía",
    },
    fr: {
      eyebrow: "Équipe True Legacy vérifiée",
      title: "Trouvez votre guide True Legacy.",
      subtitle: "Trouvez le bon leader selon le marché, la langue et votre relation. Si quelqu’un vous a recommandé, choisissez cette personne afin de protéger l’attribution d’équipe.",
      search: "Rechercher par nom",
      market: "Tous les marchés",
      language: "Toutes les langues",
      showing: "leaders vérifiés",
      noResults: "Aucun leader ne correspond encore à ces filtres.",
      clear: "Effacer les filtres",
      profile: "Voir le profil",
      referred: "Déjà recommandé ?",
      referredBody: "Choisissez la personne qui vous a présenté True Legacy. Nous protégeons les relations et l’attribution d’équipe.",
      unsure: "Vous ne savez pas qui choisir ?",
      unsureBody: "Indiquez votre marché, votre langue et votre intérêt. Nous vous orienterons vers un distributeur disponible.",
      match: "Trouver le bon guide",
    },
    pt: {
      eyebrow: "Equipe True Legacy verificada",
      title: "Encontre seu guia True Legacy.",
      subtitle: "Conecte-se com o líder certo por mercado, idioma e relacionamento. Se alguém indicou você, escolha essa pessoa para proteger a atribuição da equipe.",
      search: "Buscar por nome",
      market: "Todos os mercados",
      language: "Todos os idiomas",
      showing: "líderes verificados",
      noResults: "Nenhum líder corresponde a esses filtros ainda.",
      clear: "Limpar filtros",
      profile: "Ver perfil",
      referred: "Já foi indicado?",
      referredBody: "Escolha quem apresentou a True Legacy a você. Protegemos os relacionamentos e a atribuição da equipe.",
      unsure: "Não sabe quem escolher?",
      unsureBody: "Informe seu mercado, idioma e interesse. Vamos encaminhar você a um distribuidor disponível.",
      match: "Ajude-me a encontrar meu guia",
    },
  }[locale];

  const regions = useMemo(
    () => Array.from(new Set(distributors.flatMap((item) => item.regions))).sort(),
    [distributors],
  );
  const languages = useMemo(
    () => Array.from(new Set(distributors.flatMap((item) => item.languages))).sort(),
    [distributors],
  );
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return [...distributors]
      .sort((a, b) => {
        const aRank = FEATURED_ORDER.indexOf(a.slug);
        const bRank = FEATURED_ORDER.indexOf(b.slug);
        return (aRank < 0 ? 999 : aRank) - (bRank < 0 ? 999 : bRank) || a.name.localeCompare(b.name);
      })
      .filter((item) => !normalized || `${item.name} ${item.title} ${item.regions.join(" ")}`.toLowerCase().includes(normalized))
      .filter((item) => region === "all" || item.regions.includes(region))
      .filter((item) => language === "all" || item.languages.includes(language));
  }, [distributors, language, query, region]);

  const resetFilters = () => {
    setQuery("");
    setRegion("all");
    setLanguage("all");
  };

  return (
    <div className="page-wrapper bg-black text-white">
      <SEO title="True Legacy Verified Leaders & Distributors" description="Find a verified True Legacy leader by market and language while preserving referral and team attribution." />
      <Navbar />
      <main className="content-wrapper">
        <TLBackground className="pb-20 pt-28">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold uppercase tracking-[0.3em] text-tl-gold">
              {copy.eyebrow}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-4 text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              {copy.title}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="mx-auto mt-5 max-w-3xl text-base leading-7 text-[#cccccc] md:text-lg">
              {copy.subtitle}
            </motion.p>
            <div className="mx-auto mt-8 flex max-w-3xl items-start gap-3 rounded-2xl border border-white/20 bg-cyan-300/[0.07] p-4 text-left text-sm leading-6 text-cyan-50/90">
              <Users className="mt-0.5 h-5 w-5 shrink-0 text-[#2997ff]" />
              <p><strong className="text-white">{copy.referred}</strong> {copy.referredBody}</p>
            </div>
          </div>
        </TLBackground>

        <section className="border-t border-white/5 bg-black py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="sticky top-20 z-20 mb-10 rounded-3xl border border-white/10 bg-black/95 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-5">
              <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]">
                <label className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#86868b]" />
                  <span className="sr-only">{copy.search}</span>
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-[#86868b] focus:border-white/20" />
                </label>
                <select value={region} onChange={(event) => setRegion(event.target.value)} aria-label={copy.market} className="min-h-12 rounded-xl border border-white/10 bg-black px-4 text-sm text-white outline-none focus:border-white/20">
                  <option value="all">{copy.market}</option>
                  {regions.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={copy.language} className="min-h-12 rounded-xl border border-white/10 bg-black px-4 text-sm text-white outline-none focus:border-white/20">
                  <option value="all">{copy.language}</option>
                  {languages.map((item) => <option key={item} value={item}>{LANGUAGE_NAMES[locale]?.[item] || item.toUpperCase()}</option>)}
                </select>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 text-xs text-[#cccccc]">
                <p><strong className="text-white">{filtered.length}</strong> {copy.showing}</p>
                {(query || region !== "all" || language !== "all") && <button type="button" onClick={resetFilters} className="font-semibold text-[#2997ff] hover:text-[#2997ff]">{copy.clear}</button>}
              </div>
            </div>

            {filtered.length ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((dist, index) => <DistributorCard key={dist.slug} dist={dist} index={index} profileLabel={copy.profile} locale={locale} />)}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center">
                <p className="text-[#cccccc]">{copy.noResults}</p>
                <button type="button" onClick={resetFilters} className="mt-5 rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-[#2997ff] hover:bg-cyan-400/10">{copy.clear}</button>
              </div>
            )}

            <div className="mt-14 grid gap-6 rounded-[2rem] border border-white/20 bg-gradient-to-br from-cyan-400/[0.10] to-blue-600/[0.07] p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#2997ff]">{copy.unsure}</p>
                <h2 className="mt-3 text-2xl font-black md:text-3xl">{copy.match}</h2>
                <p className="mt-3 max-w-2xl leading-7 text-[#cccccc]">{copy.unsureBody}</p>
              </div>
              <Link to="/apply?interest=product" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-400">
                {copy.match} <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function DistributorCard({ dist, index, profileLabel, locale }: { dist: Distributor; index: number; profileLabel: string; locale: string }) {
  const [imgError, setImgError] = useState(false);
  return (
    <motion.article initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index, 7) * 0.05 }} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-black transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-cyan-950/20">
      <Link to={`/d/${dist.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-cyan-500/10">
        {!imgError && dist.photo ? <img src={dist.photo} alt={dist.name} className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.025]" onError={() => setImgError(true)} /> : <span className="flex h-full items-center justify-center text-5xl font-black text-[#2997ff]">{dist.fallbackInitial}</span>}
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#2997ff] backdrop-blur">
          <BadgeCheck className="h-4 w-4 text-[#2997ff]" /> {locale === 'es' ? 'Verificado' : locale === 'fr' ? 'Vérifié' : locale === 'pt' ? 'Verificado' : 'Verified'}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-xl font-black text-white">{dist.name}</h2>
        <p className="mt-1 min-h-10 text-sm leading-5 text-[#2997ff]/80">{dist.title}</p>
        <div className="mt-4 space-y-2 text-xs leading-5 text-[#cccccc]">
          <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2997ff]" /><span>{dist.regions.join(" · ")}</span></p>
          <p className="flex items-start gap-2"><Languages className="mt-0.5 h-4 w-4 shrink-0 text-[#2997ff]" /><span>{dist.languages.map((item) => LANGUAGE_NAMES[locale]?.[item] || item.toUpperCase()).join(" · ")}</span></p>
          <p className="flex items-center gap-2"><Globe2 className="h-4 w-4 shrink-0 text-[#2997ff]" /> {locale === 'es' ? 'Equipo True Legacy' : locale === 'fr' ? 'Équipe True Legacy' : locale === 'pt' ? 'Equipe True Legacy' : 'True Legacy team'}</p>
        </div>
        <div className="mt-auto flex items-center gap-2 pt-6">
          <Link to={`/d/${dist.slug}`} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 text-sm font-bold text-slate-950 hover:bg-cyan-400">
            {profileLabel} <ArrowRight className="h-4 w-4" />
          </Link>
          {dist.whatsapp && <a href={dist.whatsapp} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${dist.name}`} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-emerald-300/25 bg-emerald-400/10 text-[#cccccc] hover:bg-emerald-400/20"><IconWhatsApp className="h-5 w-5" /></a>}
          {dist.instagram && <a href={dist.instagram} target="_blank" rel="noreferrer" aria-label={`Instagram ${dist.name}`} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-pink-300/20 bg-pink-400/10 text-pink-300 hover:bg-pink-400/20"><Instagram className="h-5 w-5" /></a>}
        </div>
      </div>
    </motion.article>
  );
}
