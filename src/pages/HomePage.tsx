import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProductSection } from "@/components/products/ProductSection";
import { SEO } from "@/components/SEO";
import { PhotoCarousel3D } from "@/components/ui/PhotoCarousel3D";
import { SocialProofStrip } from "@/components/ui/SocialProofStrip";
import { TestimonialsSplit } from "@/components/ui/split-testimonial";
import { TLBackground } from "@/components/ui/TLBackground";
import WorldMap from "@/components/ui/WorldMap";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { trackEvent } from "@/lib/analytics";
import { t } from "@/lib/translations";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenCheck, BriefcaseBusiness, CalendarDays, Droplets, PlayCircle, ShieldCheck, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function IconGlobe() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconGlobeLarge() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
function IconHeart() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function IconTrendingUp() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

export default function HomePage() {
  const { locale } = useLocaleContext();
  const copy = t[locale];
  const [pastHero, setPastHero] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const stickyCtaVisible = pastHero && !footerInView;

  useEffect(() => {
    const hero = heroRef.current;
    const footer = footerRef.current;
    if (!hero || !footer) return;
    const heroObserver = new IntersectionObserver(
      ([entry]) => setPastHero(!!entry && !entry.isIntersecting),
      { threshold: 0 },
    );
    heroObserver.observe(hero);
    const footerObserver = new IntersectionObserver(
      ([entry]) => setFooterInView(!!entry?.isIntersecting),
      { threshold: 0 },
    );
    footerObserver.observe(footer);

    // Section entrance animations
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".section-animate").forEach((section) => {
      sectionObserver.observe(section);
    });

    return () => {
      heroObserver.disconnect();
      footerObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <div className="page-wrapper" style={{ background: "#060b1e" }}>
      <SEO
        title={
          locale === "es"
            ? "True Legacy | Distribuidores Enagic de clase mundial"
            : locale === "fr"
              ? "True Legacy | Distributeurs Enagic de classe mondiale"
              : "True Legacy | World Class Enagic Distributors"
        }
        description={
          locale === "es"
            ? "True Legacy tiene miembros y líderes en 14 mercados destacados, con educación sobre productos Enagic, comunidad y apoyo para distribuidores independientes."
            : locale === "fr"
              ? "True Legacy compte des membres et des leaders dans 14 marchés clés, avec formation aux produits Enagic, communauté et soutien aux distributeurs indépendants."
              : "True Legacy has members and leaders across 14 featured markets, offering Enagic product education, community, and independent distributor support."
        }
        image="/logos/tl-square-white.png"
      />
      <Navbar />

      <main className="content-wrapper">
        {/* ===== HERO + MAP ===== */}
        <section ref={heroRef} className="map-section">
          <TLBackground className="relative flex flex-col items-center justify-start pt-20 pb-8 md:pt-32 md:pb-0">
            {/* Hero Text — extra top margin for spacing from navbar / "top categories" */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="map-heading relative z-10 w-full max-w-5xl mx-auto text-center px-6 mt-8 mb-10"
            >
              {/* Eyebrow */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mb-3 text-xs font-semibold tracking-[0.3em] uppercase text-tl-gold opacity-80"
              >
                {locale === "es"
                  ? "Salud · Liderazgo · Legado"
                  : locale === "fr"
                    ? "Santé · Leadership · Héritage"
                    : locale === "pt"
                      ? "Saúde · Liderança · Legado"
                      : "Health · Leadership · Legacy"}
              </motion.p>

              {/* Main heading — fluid on mobile, larger and more confident */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="hero-title mb-6 px-1"
              >
                {locale === "es" ? "Construye mejor salud." : locale === "fr" ? "Construisez une meilleure santé." : locale === "pt" ? "Construa uma saúde melhor." : "Build Better Health."}
                <br />
                <span className="gradient-text">{locale === "es" ? "Crea un legado mayor." : locale === "fr" ? "Créez un plus grand héritage." : locale === "pt" ? "Crie um legado maior." : "Create a Bigger Legacy."}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="hero-subtitle"
              >
                {locale === "es"
                  ? "Explora Kangen Water, emGuarde GO, la comunidad empresarial True Legacy y el sistema de entrenamiento que apoya a líderes en 14 mercados destacados."
                  : locale === "fr"
                    ? "Découvrez Kangen Water, emGuarde GO, la communauté True Legacy et le système de formation qui soutient des leaders dans 14 marchés clés."
                    : locale === "pt"
                      ? "Explore Kangen Water, emGuarde GO, a comunidade True Legacy e o sistema de treinamento que apoia líderes em 14 mercados em destaque."
                      : "Explore Kangen Water, emGuarde GO, the True Legacy business community, and the training system supporting leaders across 14 featured markets."}
              </motion.p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/products" onClick={()=>trackEvent("home_path_click",{path:"products",locale})} className="btn-primary inline-flex min-h-12 items-center justify-center gap-2 px-6">{locale==='es'?'Explorar productos':locale==='pt'?'Explorar produtos':'Explore the Products'}<ArrowRight className="h-4 w-4"/></Link>
                <Link to="/apply?interest=distributor" onClick={()=>trackEvent("home_path_click",{path:"business",locale})} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-tl-gold/40 bg-tl-gold/10 px-6 font-semibold text-tl-gold hover:bg-tl-gold/20">{locale==='es'?'Explorar el negocio':locale==='pt'?'Explorar o negócio':'Explore the Opportunity'}</Link>
                <Link to="/crm" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-6 font-semibold text-white hover:bg-white/10">{locale==='es'?'Acceso distribuidores':locale==='pt'?'Acesso distribuidores':'Distributor Login'}</Link>
              </div>
              <SocialProofStrip />
            </motion.div>

            {/* World Map — logo is inbuilt inside WorldMap */}
            <motion.div
              id="map"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.25 }}
              className="relative z-10 w-full max-w-6xl mx-auto px-4 scroll-mt-28 pb-16"
            >
              <div className="relative w-full">
                <div className="absolute -inset-x-10 -top-10 h-40 bg-gradient-to-b from-white/5 to-transparent opacity-40 pointer-events-none" />
                <div className="relative w-full overflow-visible">
                  <WorldMap />
                </div>
              </div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
              <span className="text-[9px] uppercase tracking-[0.35em] font-semibold text-slate-500">
                {copy.homeScrollToExplore}
              </span>
              <div className="w-px h-10 bg-gradient-to-b from-slate-500 to-transparent" />
            </motion.div>
          </TLBackground>
        </section>

        {/* ===== CHOOSE YOUR PATH ===== */}
        <section className="relative border-y border-white/5 bg-[#080e24] py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-3xl text-center"><p className="mb-3 text-xs font-semibold uppercase tracking-[.3em] text-tl-gold">Start here</p><h2 className="text-3xl font-black text-white md:text-5xl">What brought you to True Legacy?</h2><p className="mt-4 text-slate-400">Choose the experience that matches your goals. We’ll guide you to the right information and the right distributor.</p></div>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                {title:'Health & Products',body:'Discover Kangen Water, emGuarde GO, the Duo, and market-specific product education.',to:'/products',icon:Droplets,accent:'text-cyan-300 bg-cyan-400/10'},
                {title:'Business Opportunity',body:'Explore the independent distributor model, mentorship, duplication, and global community.',to:'/apply?interest=distributor',icon:BriefcaseBusiness,accent:'text-tl-gold bg-tl-gold/10'},
                {title:'Training & Community',body:'Access leadership education, weekly calls, events, and the True Legacy growth system.',to:'/training',icon:BookOpenCheck,accent:'text-violet-300 bg-violet-400/10'},
              ].map(item=><Link key={item.title} to={item.to} onClick={()=>trackEvent('home_path_click',{path:item.title,locale})} className="group rounded-3xl border border-white/10 bg-white/[.035] p-7 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[.055]"><div className={`grid h-14 w-14 place-items-center rounded-2xl ${item.accent}`}><item.icon className="h-7 w-7"/></div><h3 className="mt-6 text-2xl font-bold text-white">{item.title}</h3><p className="mt-3 min-h-20 text-sm leading-6 text-slate-400">{item.body}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">Explore this path <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1"/></span></Link>)}
            </div>
          </div>
        </section>

        {/* ===== DUO FEATURE ===== */}
        <section className="relative overflow-hidden bg-[#060b1e] py-20 md:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(14,165,233,.16),transparent_32%)]"/>
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div><p className="text-xs font-semibold uppercase tracking-[.3em] text-tl-gold">The True Legacy Duo</p><h2 className="mt-4 text-4xl font-black text-white md:text-6xl">Two technologies.<br/><span className="gradient-text">One connected story.</span></h2><p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Meet the K8 flagship water ionizer and emGuarde GO. Explore each technology, watch the demonstrations, and speak with a distributor about availability in your market.</p><a href="https://youtu.be/lB5fW55DmaI" target="_blank" rel="noreferrer" onClick={()=>trackEvent('video_click',{video:'duo_demo',locale})} className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-tl-gold to-amber-400 px-7 text-lg font-black text-slate-950 shadow-lg shadow-amber-500/20"><PlayCircle className="h-6 w-6"/>Watch the Duo</a><br/><Link to="/distributors" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-tl-gold">Connect with a distributor <ArrowRight className="h-4 w-4"/></Link></div>
            <div className="relative mx-auto w-full max-w-xl"><div className="absolute inset-10 rounded-full bg-cyan-400/20 blur-3xl"/><div className="relative grid grid-cols-2 items-end gap-4 rounded-[2rem] border border-white/10 bg-white/[.04] p-5 sm:p-8"><div className="flex h-full flex-col justify-end"><img src="/products/k8.png" alt="K8 flagship Kangen Water ionizer" className="mx-auto max-h-[390px] w-full object-contain drop-shadow-2xl"/><p className="mt-4 text-center font-bold text-white">K8 Flagship</p><a href="https://youtu.be/1nkOCId-SfQ" target="_blank" rel="noreferrer" onClick={()=>trackEvent('video_click',{video:'water_demo',locale})} className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-3 text-center text-xs font-bold text-slate-950 sm:text-sm"><PlayCircle className="h-4 w-4"/>Watch Water Demo</a></div><div className="flex h-full flex-col justify-end"><img src="/products/emguarde-go.png" alt="emGuarde GO product set" className="mx-auto max-h-[310px] w-full object-contain drop-shadow-2xl"/><p className="mt-4 text-center font-bold text-white">emGuarde GO</p><a href="https://youtu.be/5wuY1dKjHds" target="_blank" rel="noreferrer" onClick={()=>trackEvent('video_click',{video:'emguarde_go',locale})} className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-300/30 bg-white/5 px-3 text-center text-xs font-bold text-white sm:text-sm"><PlayCircle className="h-4 w-4"/>Watch emGuarde GO</a></div></div></div>
          </div>
        </section>

        {/* ===== LEADERS CAROUSEL ===== */}
        <section className="relative py-24" style={{ background: "#060b1e" }}>
          {/* Accent arcs at top */}
          <div className="absolute inset-x-0 top-0 h-px section-divider" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-tl-gold mb-3">
                  {copy.homeLeadersTitle}
                </p>
                <h2 className="text-3xl md:text-5xl text-white mb-4 leading-tight font-display font-bold">
                  {copy.homeLeadersHeadline}
                </h2>
                <p className="text-slate-400 text-base leading-relaxed font-light">
                  {copy.homeLeadersTagline}
                </p>
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-full border border-white/10 bg-tl-blue/10 text-slate-400">
                <IconGlobe />
              </div>
            </motion.div>
          </div>

          <PhotoCarousel3D />
          <div className="mt-12 text-center"><Link to="/distributors" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-cyan-400/30 px-6 font-semibold text-cyan-200 hover:bg-cyan-400/10"><Users className="h-5 w-5"/>Meet all leaders and distributors</Link></div>
        </section>

        {/* ===== ORIGINAL TESTIMONIALS ===== */}
        <section id="testimonials" className="relative border-y border-white/5 bg-[#080e24] py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6"><div className="mx-auto mb-12 max-w-3xl text-center"><p className="text-xs font-semibold uppercase tracking-[.3em] text-tl-gold">Individual stories</p><h2 className="mt-3 text-3xl font-black text-white md:text-5xl">Experiences from our community</h2><p className="mt-4 text-slate-400">Original True Legacy community stories shared in each person’s own voice.</p></div><TestimonialsSplit locale={locale}/><div className="mx-auto mt-2 flex max-w-4xl items-start gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/[.06] p-5 text-left text-xs leading-6 text-amber-50/80"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-300"/><p><strong className="text-amber-200">Individual experience disclaimer:</strong> These testimonials describe each person’s individual experience only. They are not medical advice, treatment claims, income promises, or representations of typical results. Experiences and business outcomes vary. No specific health improvement or income is guaranteed.</p></div></div>
        </section>

        {/* ===== JOIN THE TEAM (below leaders) ===== */}
        <section
          id="join"
          className="relative py-20 md:py-24"
          style={{ background: "#060b1e" }}
        >
          <div className="absolute inset-x-0 top-0 h-px section-divider" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                {copy.join_heading}
              </h2>
              <p className="text-slate-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
                {copy.join_sub}
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl border border-white/10 p-8 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 mb-5">
                  <IconGlobeLarge />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {copy.join_global}
                </h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                  {copy.join_global_body}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl border border-white/10 p-8 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-400 mb-5">
                  <IconHeart />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {copy.join_healing}
                </h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                  {copy.join_healing_body}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl border border-white/10 p-8 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-tl-gold/20 text-tl-gold mb-5">
                  <IconTrendingUp />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {copy.join_income}
                </h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                  {copy.join_income_body}
                </p>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <a
                href="/apply"
                target="_blank" rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("join_click", {
                    location: "home_join",
                    locale,
                  })
                }
                className="btn-primary inline-flex items-center justify-center"
              >
                {copy.join_cta}
              </a>
            </motion.div>
          </div>
        </section>

        {/* ===== COMMUNITY & EVENTS ===== */}
        <section className="relative border-t border-white/5 bg-[#080e24] px-3 py-20 md:px-12 md:py-24 lg:px-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6"><div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.3em] text-tl-gold">Community in action</p><h2 className="mt-3 text-3xl font-black text-white md:text-5xl">Learn live. Build together.</h2><p className="mt-4 leading-7 text-slate-400">Join the recurring global English and LATAM Spanish calls, meet the team, and continue your development through True Legacy events.</p></div><Link to="/events" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 font-bold text-slate-950"><CalendarDays className="h-5 w-5"/>View all events</Link></div><div className="grid gap-6 md:grid-cols-2"><Link to="/events/global" className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[.03]"><div className="aspect-[4/5] overflow-hidden bg-black/20"><img src="/assets/mehdicohen-global-weekly.png" alt="Unlock Your True Legacy global English call flyer" className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"/></div><div className="p-6"><p className="text-xs font-bold uppercase tracking-wider text-cyan-300">Global · English</p><h3 className="mt-2 text-2xl font-bold text-white">Unlock Your True Legacy</h3><p className="mt-2 text-sm text-slate-400">Every Wednesday · 8:30 PM Eastern / 5:30 PM Pacific</p><span className="mt-4 inline-flex items-center gap-2 text-sm text-cyan-200">See event details <ArrowRight className="h-4 w-4"/></span></div></Link><Link to="/events/latam" className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[.03]"><div className="aspect-[4/5] overflow-hidden bg-black/20"><img src="/assets/mehdicohen-latam-weekly.png" alt="La Revolución del Biohacking Llega a LATAM Spanish call flyer" className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"/></div><div className="p-6"><p className="text-xs font-bold uppercase tracking-wider text-tl-gold">LATAM · Español</p><h3 className="mt-2 text-2xl font-bold text-white">La Revolución del Biohacking Llega a LATAM</h3><p className="mt-2 text-sm text-slate-400">Cada jueves · 7:00 PM Colombia / 8:00 PM Eastern</p><span className="mt-4 inline-flex items-center gap-2 text-sm text-cyan-200">Ver detalles <ArrowRight className="h-4 w-4"/></span></div></Link></div></div>
        </section>

        {/* ===== TRAINING LIBRARY TEASER ===== */}
        <section
          className="relative py-16 border-t border-white/5"
          style={{ background: "#060b1e" }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl border border-cyan-500/25 p-8 md:p-12 text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(6,182,212,0.05), rgba(15,23,42,0.8))",
              }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 mb-6">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10,9 9,9 8,9" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {locale === "es"
                  ? "Biblioteca de Entrenamiento"
                  : locale === "fr"
                    ? "Bibliothèque de Formation"
                    : locale === "pt"
                      ? "Biblioteca de Treinamento"
                      : "Training Library"}
              </h3>
              <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
                {locale === "es"
                  ? "Accede a guías exclusivas, entrenamientos de productos y recursos para distribuidores que te ayudarán a construir tu negocio True Legacy."
                  : locale === "fr"
                    ? "Accédez à des guides exclusifs, des formations produits et des ressources distributeurs qui vous aideront à construire votre entreprise True Legacy."
                    : locale === "pt"
                      ? "Acesse guias exclusivos, treinamentos de produtos e recursos para distribuidores que ajudarão você a construir seu negócio True Legacy."
                      : "Access exclusive guides, product trainings, and distributor resources that will help you build your True Legacy business."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/training"
                  className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-md font-semibold text-white transition-all hover:scale-[1.02] hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #1B5A8C, #1e88e5)",
                    boxShadow: "0 2px 8px rgba(27, 90, 140, 0.2)",
                  }}
                >
                  {locale === "es"
                    ? "Acceso a Distribuidores"
                    : locale === "fr"
                      ? "Accès Distributeurs"
                      : locale === "pt"
                        ? "Acesso a Distribuidores"
                        : "Distributor Login"}
                </Link>
                <Link
                  to="/training#pdf-guides"
                  className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-md font-semibold text-cyan-300 border border-cyan-500/30 transition-all hover:bg-cyan-500/10 hover:-translate-y-0.5"
                >
                  {locale === "es"
                    ? "Guías de Productos"
                    : locale === "fr"
                      ? "Guides Produits"
                      : locale === "pt"
                        ? "Guias de Produtos"
                        : "Product Guides"}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== FEATURED PRODUCTS ===== */}
        <ProductSection
          productIds={[
            "k8",
            "anespa_dx",
            "emguarde",
          ]}
          variant="homeAll"
        />
        <section className="bg-[#060b1e] px-4 pb-24 text-center"><Link to="/products" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-7 font-bold text-white hover:bg-white/5">Explore all products and technologies <ArrowRight className="h-4 w-4"/></Link></section>
      </main>

      {/* Sticky mobile CTA — visible after hero, hidden at footer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 p-4 md:hidden transition-transform duration-300 ${
          stickyCtaVisible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          background:
            "linear-gradient(to top, rgba(6,11,30,0.98), transparent)",
        }}
      >
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-[#081027]/95 p-2 shadow-2xl backdrop-blur"><Link to="/products" className="flex min-h-12 items-center justify-center rounded-xl bg-cyan-500 px-2 text-center text-xs font-bold text-slate-950">Products</Link><Link to="/apply?interest=distributor" className="flex min-h-12 items-center justify-center rounded-xl bg-tl-gold px-2 text-center text-xs font-bold text-slate-950">Opportunity</Link><Link to="/distributors" className="flex min-h-12 items-center justify-center rounded-xl border border-white/15 px-2 text-center text-xs font-bold text-white">Connect</Link></div>
      </div>

      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
}
