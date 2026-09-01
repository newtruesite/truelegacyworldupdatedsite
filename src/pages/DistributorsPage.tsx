import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SEO } from "@/components/SEO";
import { TLBackground } from "@/components/ui/TLBackground";
import { LeaderCard } from "@/components/ui/LeaderCard";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { getPublicDistributors, getInitialPublicDistributors, getLeaderPortrait } from "@/lib/crm";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  Sparkles,
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

function mapProfileToDistributor(profile: {
  slug: string;
  display_name: string;
  title: string;
  avatar_url: string | null;
  regions: string[];
  languages: string[];
  phone?: string | null;
  instagram_url?: string | null;
}): Distributor {
  return {
    slug: profile.slug,
    name: profile.display_name,
    title: profile.title,
    photo: profile.avatar_url || "",
    fallbackInitial: profile.display_name.charAt(0),
    regions: profile.regions,
    languages: profile.languages,
    whatsapp: profile.phone ? `https://wa.me/${profile.phone.replace(/\D/g, "")}` : undefined,
    instagram: profile.instagram_url || undefined,
  };
}

const LANGUAGE_NAMES: Record<string, Record<string, string>> = {
  en: { en: "English", es: "Spanish", fr: "French", pt: "Portuguese", zh: "Mandarin", yue: "Cantonese", ms: "Malay", ar: "Arabic" },
  es: { en: "Inglés", es: "Español", fr: "Francés", pt: "Portugués", zh: "Mandarín", yue: "Cantonés", ms: "Malayo", ar: "Árabe" },
  fr: { en: "Anglais", es: "Espagnol", fr: "Français", pt: "Portugais", zh: "Mandarin", yue: "Cantonais", ms: "Malais", ar: "Arabe" },
  pt: { en: "Inglês", es: "Espanhol", fr: "Francês", pt: "Português", zh: "Mandarim", yue: "Cantonês", ms: "Malaio", ar: "Árabe" },
};

export default function DistributorsPage() {
  const { locale } = useLocaleContext();
  const [distributors, setDistributors] = useState<Distributor[]>(() =>
    getInitialPublicDistributors().map(mapProfileToDistributor)
  );
  const [isLoadingDistributors, setIsLoadingDistributors] = useState(true);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [language, setLanguage] = useState("all");

  useEffect(() => {
    let active = true;
    const loadDistributors = () => {
      getPublicDistributors().then((profiles) => {
        if (!active) return;
        setDistributors(profiles.map(mapProfileToDistributor));
        setIsLoadingDistributors(false);
      }).catch(() => {
        if (active) setIsLoadingDistributors(false);
      });
    };

    loadDistributors();
    window.addEventListener("truelegacy:leader-portrait-updated", loadDistributors);
    return () => {
      active = false;
      window.removeEventListener("truelegacy:leader-portrait-updated", loadDistributors);
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
      leaderApplyEyebrow: "Leadership panel",
      leaderApplyTitle: "Ready to represent True Legacy?",
      leaderApplyBody: "Qualified active leaders can submit their experience and credentials for a verified panel review.",
      leaderApplyButton: "Apply for panel review",
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
      leaderApplyEyebrow: "Panel de liderazgo",
      leaderApplyTitle: "¿Listo para representar a True Legacy?",
      leaderApplyBody: "Los líderes activos que cumplen los requisitos pueden enviar su experiencia y credenciales para una revisión del panel verificado.",
      leaderApplyButton: "Solicitar revisión",
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
      leaderApplyEyebrow: "Panel de leadership",
      leaderApplyTitle: "Prêt à représenter True Legacy ?",
      leaderApplyBody: "Les leaders actifs qualifiés peuvent soumettre leur expérience et leurs références à l’examen du panel vérifié.",
      leaderApplyButton: "Demander un examen",
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
      leaderApplyEyebrow: "Painel de liderança",
      leaderApplyTitle: "Pronto para representar a True Legacy?",
      leaderApplyBody: "Líderes ativos qualificados podem enviar sua experiência e credenciais para análise do painel verificado.",
      leaderApplyButton: "Solicitar análise",
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
                <p>{isLoadingDistributors ? <span className="text-[#86868b]">Loading verified leaders…</span> : <><strong className="text-white">{filtered.length}</strong> {copy.showing}</>}</p>
                {(query || region !== "all" || language !== "all") && <button type="button" onClick={resetFilters} className="font-semibold text-[#2997ff] hover:text-[#2997ff]">{copy.clear}</button>}
              </div>
            </div>

            {isLoadingDistributors && distributors.length === 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-80 rounded-3xl border border-white/10 bg-white/[0.03] animate-pulse" />
                ))}
              </div>
            ) : filtered.length ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((dist, index) => (
                  <LeaderCard
                    key={dist.slug}
                    dist={dist}
                    index={index}
                    profileLabel={copy.profile}
                    locale={locale}
                  />
                ))}
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
            <div className="mt-6 grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#2997ff]">{copy.leaderApplyEyebrow}</p>
                <h2 className="mt-3 text-2xl font-black md:text-3xl">{copy.leaderApplyTitle}</h2>
                <p className="mt-3 max-w-2xl leading-7 text-[#cccccc]">{copy.leaderApplyBody}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/leaders/portrait" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-[#2997ff]/40 bg-[#2997ff]/10 px-5 py-3.5 font-bold text-[#2997ff] transition hover:bg-[#2997ff]/20">
                  <Sparkles className="h-5 w-5" /> Portrait Studio
                </Link>
                <Link to="/leaders/apply" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 font-bold text-white transition hover:border-white/35 hover:bg-white/[0.06]">
                  {copy.leaderApplyButton} <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
