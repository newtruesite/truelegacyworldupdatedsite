import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SEO } from '@/components/SEO'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { crmSupabase, getPublicDistributors } from '@/lib/crm'
import type { PublicDistributor } from '@/lib/crm'
import { ArrowUpRight, BookOpen, BriefcaseBusiness, CalendarDays, Globe2, Instagram, Languages, MapPin, Phone, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'

const PROFILE_TRANSLATIONS: Record<string, Record<'es' | 'fr' | 'pt', { title: string; bio: string }>> = {
  'simon-loh': {
    es: { title: 'Líder True Legacy 6A2-4', bio: 'Contador de formación y emprendedor por vocación. Simon salió de la carrera tradicional en 2016 y construyó su negocio Enagic en mercados internacionales. Hoy viaja por el mundo compartiendo su experiencia y capacitando a emprendedores para alcanzar la libertad financiera a través de Enagic y la comunidad True Legacy.' },
    fr: { title: 'Leader True Legacy 6A2-4', bio: 'Comptable de formation et entrepreneur par vocation, Simon a quitté la course traditionnelle en 2016 et développé son activité Enagic sur plusieurs marchés internationaux. Aujourd’hui, il parcourt le monde pour partager son expérience et former des entrepreneurs à poursuivre leur liberté financière grâce à Enagic et à la communauté True Legacy.' },
    pt: { title: 'Líder True Legacy 6A2-4', bio: 'Contador por formação e empreendedor por vocação, Simon deixou a corrida tradicional em 2016 e construiu seu negócio Enagic em mercados internacionais. Hoje, viaja pelo mundo compartilhando sua experiência e treinando empreendedores para buscar liberdade financeira por meio da Enagic e da comunidade True Legacy.' },
  },
  'mehdi-cohen': {
    es: { title: 'True Legacy World', bio: 'Educación global y para LATAM sobre productos, liderazgo y apoyo al equipo.' },
    fr: { title: 'True Legacy World', bio: 'Éducation produit mondiale et LATAM, leadership et soutien d’équipe.' },
    pt: { title: 'True Legacy World', bio: 'Educação global e para a América Latina sobre produtos, liderança e suporte à equipe.' },
  },
  'ryan-pool': {
    es: { title: 'Líder True Legacy', bio: 'Ryan es emprendedor, exatleta y líder comunitario en Los Ángeles. Se enfoca en el bienestar, el desarrollo personal, la libertad financiera y en construir un legado familiar duradero.' },
    fr: { title: 'Leader True Legacy', bio: 'Ryan est entrepreneur, ancien athlète et leader communautaire à Los Angeles. Il se consacre au bien-être, au développement personnel, à la liberté financière et à la création d’un héritage familial durable.' },
    pt: { title: 'Líder True Legacy', bio: 'Ryan é empreendedor, ex-atleta e líder comunitário em Los Angeles. Seu foco está no bem-estar, desenvolvimento pessoal, liberdade financeira e na construção de um legado familiar duradouro.' },
  },
  'magaly-cardona': {
    es: { title: 'Distribuidora True Legacy', bio: 'Magaly ayuda a las personas a diseñar un trabajo alineado con sus valores y guía a líderes de Estados Unidos y Latinoamérica para construir negocios intencionales mediante Enagic y la comunidad.' },
    fr: { title: 'Distributrice True Legacy', bio: 'Magaly aide les personnes à concevoir un travail aligné avec leurs valeurs et accompagne des leaders aux États-Unis et en Amérique latine dans la création d’activités intentionnelles grâce à Enagic et à la communauté.' },
    pt: { title: 'Distribuidora True Legacy', bio: 'Magaly ajuda pessoas a criarem um trabalho alinhado aos seus valores e orienta líderes nos Estados Unidos e na América Latina a desenvolverem negócios intencionais por meio da Enagic e da comunidade.' },
  },
  'ming-way-sia': {
    es: { title: 'Líder True Legacy 6A2-5', bio: 'Ming-Way construyó desde cero junto a su padre, desarrollando disciplina y resiliencia que hoy utiliza para ayudar a otros a crear negocios responsables y orientados al legado.' },
    fr: { title: 'Leader True Legacy 6A2-5', bio: 'Ming-Way a bâti une activité à partir de zéro avec son père, développant la discipline et la résilience qu’il met aujourd’hui au service de ceux qui souhaitent créer des entreprises responsables et axées sur l’héritage.' },
    pt: { title: 'Líder True Legacy 6A2-5', bio: 'Ming-Way construiu do zero ao lado do pai, desenvolvendo disciplina e resiliência que hoje usa para ajudar outras pessoas a criarem negócios responsáveis e orientados por legado.' },
  },
  'alex-gonzalez': {
    es: { title: 'Distribuidor True Legacy', bio: 'Alex aporta más de 35 años de experiencia en marketing dentro de la industria de suplementos y un compromiso permanente con la salud, el bienestar y ayudar a otros a vivir plenamente.' },
    fr: { title: 'Distributeur True Legacy', bio: 'Alex apporte plus de 35 ans d’expérience en marketing dans l’industrie des compléments alimentaires et un engagement durable envers la santé, le bien-être et l’épanouissement des autres.' },
    pt: { title: 'Distribuidor True Legacy', bio: 'Alex reúne mais de 35 anos de experiência em marketing na indústria de suplementos e um compromisso permanente com saúde, bem-estar e ajudar outras pessoas a viverem plenamente.' },
  },
  'zah-naderi': {
    es: { title: 'Distribuidor True Legacy', bio: 'Durante más de una década, Zah ha entrenado a atletas de élite, celebridades y ejecutivos. Hoy aplica esas lecciones de liderazgo, visión y colaboración para ayudar a construir un legado duradero.' },
    fr: { title: 'Distributeur True Legacy', bio: 'Depuis plus de dix ans, Zah accompagne des athlètes d’élite, des célébrités et des dirigeants. Il met aujourd’hui ces leçons de leadership, de vision et de collaboration au service d’un héritage durable.' },
    pt: { title: 'Distribuidor True Legacy', bio: 'Há mais de uma década, Zah treina atletas de elite, celebridades e executivos. Hoje aplica essas lições de liderança, visão e colaboração para ajudar a construir um legado duradouro.' },
  },
  emanuela: {
    es: { title: 'Distribuidora True Legacy', bio: 'Emanuela forma parte de la creciente comunidad de distribuidores True Legacy. Próximamente se agregarán su historia completa y más detalles del perfil.' },
    fr: { title: 'Distributrice True Legacy', bio: 'Emanuela fait partie de la communauté grandissante des distributeurs True Legacy. Son histoire complète et d’autres détails de son profil seront bientôt ajoutés.' },
    pt: { title: 'Distribuidora True Legacy', bio: 'Emanuela faz parte da crescente comunidade de distribuidores True Legacy. Sua história completa e mais detalhes do perfil serão adicionados em breve.' },
  },
  'jesse-schexnayder': {
    es: { title: 'Distribuidor True Legacy', bio: 'Jesse es un emprendedor en serie, conocido especialmente por HotShotz Reusable Heat Packs. Ama la vida y el universo y es CEO de Let’s Go!!' },
    fr: { title: 'Distributeur True Legacy', bio: 'Jesse est un entrepreneur en série, notamment connu pour HotShotz Reusable Heat Packs. Il aime la vie et l’univers et dirige Let’s Go!!' },
    pt: { title: 'Distribuidor True Legacy', bio: 'Jesse é um empreendedor em série, conhecido principalmente pela HotShotz Reusable Heat Packs. Ama a vida e o universo e é CEO da Let’s Go!!' },
  },
  'angel-mok': {
    es: { title: 'Distribuidora True Legacy', bio: 'Después de graduarse de la universidad, Angel construyó una carrera exitosa en el dinámico mundo del comercio de acciones, pero buscaba algo con mayor significado. A través del Coach Simon encontró True Legacy y un nuevo camino de emprendimiento, propósito y crecimiento personal. Hoy viaja por el mundo mientras desarrolla su negocio de inversiones y una organización internacional con Enagic, ayudando a otros a descubrir nuevas posibilidades. Para Angel, el éxito significa libertad, impacto y el legado que dejamos.' },
    fr: { title: 'Distributrice True Legacy', bio: 'Après ses études universitaires, Angel a bâti une carrière florissante dans le monde dynamique du trading d’actions, tout en recherchant quelque chose de plus porteur de sens. Grâce au Coach Simon, elle a découvert True Legacy et une nouvelle voie faite d’entrepreneuriat, de raison d’être et de développement personnel. Aujourd’hui, elle voyage à travers le monde tout en développant son activité financière et une organisation internationale avec Enagic, aidant les autres à découvrir de nouvelles possibilités. Pour Angel, la réussite signifie liberté, impact et héritage.' },
    pt: { title: 'Distribuidora True Legacy', bio: 'Depois de se formar na universidade, Angel construiu uma carreira de sucesso no dinâmico mercado de ações, mas sabia que buscava algo com mais significado. Por meio do Coach Simon, conheceu a True Legacy e descobriu um novo caminho de empreendedorismo, propósito e crescimento pessoal. Hoje viaja pelo mundo enquanto desenvolve seu negócio financeiro e uma organização internacional com a Enagic, ajudando outras pessoas a descobrirem novas possibilidades. Para Angel, sucesso significa liberdade, impacto e o legado que deixamos.' },
  },
}

export default function DistributorProfilePage() {
  const { slug } = useParams()
  const { locale } = useLocaleContext()
  const [profile, setProfile] = useState<PublicDistributor | null | undefined>(undefined)

  useEffect(() => {
    getPublicDistributors().then(items => setProfile(items.find(item => item.slug === slug) || null))
  }, [slug])

  useEffect(() => {
    if (!profile || !crmSupabase) return
    void crmSupabase.rpc('crm_track_share_click', { p_slug: profile.slug, p_campaign: 'profile', p_locale: locale })
  }, [profile, locale])

  if (profile === null) return <NotFoundPage />

  const title = locale === 'es' ? 'Conecta con este distribuidor' : locale === 'fr' ? 'Contactez ce distributeur' : locale === 'pt' ? 'Conecte-se com este distribuidor' : 'Connect with this distributor'
  const cta = locale === 'es' ? 'Enviar mi interés' : locale === 'fr' ? 'Envoyer ma demande' : locale === 'pt' ? 'Enviar meu interesse' : 'Submit my interest'
  const firstName = profile?.display_name.split(' ')[0] || 'your leader'
  const ui = {
    en: { verified: 'True Legacy verified profile', attribution: 'True Legacy team attribution', choose: 'Choose your experience', explore: `Explore with ${firstName}`, intro: `Four clear ways to learn, connect, and take your next step. Every response stays personally connected to ${profile?.display_name || firstName}.`, personal: `Personalized to ${firstName}`, path: `A personal path with ${firstName}`, duoTag: 'Water + environment', trainingTag: 'Learn · apply · duplicate', eventsTag: 'English + Spanish events', loading: 'Loading verified profile…', cards: [['Build','Explore the business',`See how ${firstName} approaches leadership, duplication, and building a legacy-driven business.`,'See the opportunity'],['Discover','Meet the True Legacy Duo','Explore the K8 and emGuarde GO through clear product demonstrations.','Explore the Duo'],['Learn','Preview the training','See the education and support available inside the community.','Preview the system'],['Connect','Join a live event','Find the next English or Spanish community presentation.','View live events']] },
    es: { verified: 'Perfil verificado de True Legacy', attribution: 'Atribución del equipo True Legacy', choose: 'Elige tu experiencia', explore: `Explora con ${firstName}`, intro: `Cuatro formas claras de aprender, conectar y dar tu próximo paso. Cada respuesta permanece vinculada personalmente con ${profile?.display_name || firstName}.`, personal: `Personalizado para ${firstName}`, path: `Un camino personal con ${firstName}`, duoTag: 'Agua + entorno', trainingTag: 'Aprende · aplica · duplica', eventsTag: 'Eventos en inglés + español', loading: 'Cargando perfil verificado…', cards: [['Construye','Explora el negocio',`Descubre cómo ${firstName} aborda el liderazgo, la duplicación y la creación de un negocio con legado.`,'Ver la oportunidad'],['Descubre','Conoce el Dúo True Legacy','Explora el K8 y emGuarde GO mediante demostraciones claras.','Explorar el Dúo'],['Aprende','Vista previa de la capacitación','Conoce la educación y el apoyo disponibles en la comunidad.','Ver el sistema'],['Conecta','Únete a un evento en vivo','Encuentra la próxima presentación comunitaria en inglés o español.','Ver eventos en vivo']] },
    fr: { verified: 'Profil True Legacy vérifié', attribution: "Attribution à l’équipe True Legacy", choose: 'Choisissez votre expérience', explore: `Explorez avec ${firstName}`, intro: `Quatre façons simples d’apprendre, de vous connecter et de passer à l’étape suivante. Chaque réponse reste directement liée à ${profile?.display_name || firstName}.`, personal: `Personnalisé pour ${firstName}`, path: `Un parcours personnel avec ${firstName}`, duoTag: 'Eau + environnement', trainingTag: 'Apprendre · appliquer · dupliquer', eventsTag: 'Événements en anglais + espagnol', loading: 'Chargement du profil vérifié…', cards: [['Construire',"Explorer l’activité",`Découvrez comment ${firstName} aborde le leadership, la duplication et la création d’une activité fondée sur l’héritage.`,'Voir l’opportunité'],['Découvrir','Découvrir le Duo True Legacy','Explorez le K8 et emGuarde GO grâce à des démonstrations claires.','Explorer le Duo'],['Apprendre','Aperçu de la formation',"Découvrez l’éducation et le soutien disponibles dans la communauté.",'Voir le système'],['Se connecter','Participer à un événement en direct','Trouvez la prochaine présentation communautaire en anglais ou en espagnol.','Voir les événements']] },
    pt: { verified: 'Perfil verificado True Legacy', attribution: 'Atribuição da equipe True Legacy', choose: 'Escolha sua experiência', explore: `Explore com ${firstName}`, intro: `Quatro formas claras de aprender, se conectar e dar o próximo passo. Cada resposta permanece vinculada pessoalmente a ${profile?.display_name || firstName}.`, personal: `Personalizado para ${firstName}`, path: `Um caminho pessoal com ${firstName}`, duoTag: 'Água + ambiente', trainingTag: 'Aprenda · aplique · duplique', eventsTag: 'Eventos em inglês + espanhol', loading: 'Carregando perfil verificado…', cards: [['Construa','Explore o negócio',`Veja como ${firstName} aborda liderança, duplicação e a construção de um negócio orientado por legado.`,'Ver a oportunidade'],['Descubra','Conheça o Duo True Legacy','Explore o K8 e o emGuarde GO por meio de demonstrações claras.','Explorar o Duo'],['Aprenda','Prévia do treinamento','Conheça a educação e o suporte disponíveis na comunidade.','Ver o sistema'],['Conecte-se','Participe de um evento ao vivo','Encontre a próxima apresentação da comunidade em inglês ou espanhol.','Ver eventos ao vivo']] },
  }[locale]
  const languageNames = {
    en: { en: 'English', zh: 'Mandarin', yue: 'Cantonese', ms: 'Malay', es: 'Spanish', fr: 'French', pt: 'Portuguese', ar: 'Arabic' },
    es: { en: 'Inglés', zh: 'Mandarín', yue: 'Cantonés', ms: 'Malayo', es: 'Español', fr: 'Francés', pt: 'Portugués', ar: 'Árabe' },
    fr: { en: 'Anglais', zh: 'Mandarin', yue: 'Cantonais', ms: 'Malais', es: 'Espagnol', fr: 'Français', pt: 'Portugais', ar: 'Arabe' },
    pt: { en: 'Inglês', zh: 'Mandarim', yue: 'Cantonês', ms: 'Malaio', es: 'Espanhol', fr: 'Francês', pt: 'Português', ar: 'Árabe' },
  }[locale] as Record<string, string>
  const localizedProfile = profile && locale !== 'en' ? PROFILE_TRANSLATIONS[profile.slug]?.[locale] : undefined
  const profileHeroAssets: Record<string, string> = {
    'angel-mok': '/leaders/standardized/angel-mok-v2.png',
    'jesse-schexnayder': '/leaders/jesse-hero-transparent.png',
    'mehdi-cohen': '/leaders/mehdi-hero.png',
    'simon-loh': '/leaders/simon-hero.png',
    'ming-way-sia': '/leaders/mingway-hero.png',
    'zah-naderi': '/leaders/zah-hero-v3.png',
    'magaly-cardona': '/leaders/magaly-hero.png',
    'ryan-pool': '/leaders/ryan-hero.png',
    'alex-gonzalez': '/leaders/alex-hero-transparent.png',
    'emanuela': '/leaders/emanuela-hero-transparent.png',
  }
  const profileHero = profile ? profileHeroAssets[profile.slug] || profile.avatar_url || '/logos/tl-square-white.png' : '/logos/tl-square-white.png'
  const currentProfilePhoto = profile?.avatar_url || profileHero
  const cardMeta = [['business', BriefcaseBusiness, 'business'], ['duo', Sparkles, 'duo'], ['training', BookOpen, 'training'], ['events', CalendarDays, 'events']] as const
  const landingPages = cardMeta.map(([slug, icon, visual], index) => ({ slug, icon, visual, eyebrow: ui.cards[index][0], label: ui.cards[index][1], text: ui.cards[index][2], cta: ui.cards[index][3] }))

  return <div className="page-wrapper bg-black text-white">
    <SEO title={`${profile?.display_name || 'Distributor'} | True Legacy World`} description={profile?.bio || 'True Legacy distributor profile and team attribution link.'} />
    <Navbar />
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-20 sm:px-6">
      {profile ? <><article className="mx-auto grid w-full max-w-4xl gap-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-[280px_1fr] md:p-10">
        <img src={profile.avatar_url || '/logos/tl-square-white.png'} alt={profile.display_name} className="h-[360px] w-full rounded-2xl object-cover object-top" />
        <div className="flex flex-col justify-center"><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#2997ff]">{ui.verified}</p><h1 className="mt-3 text-4xl font-black">{profile.display_name}</h1><p className="mt-2 text-[#cccccc]">{localizedProfile?.title || profile.title}</p><p className="mt-6 whitespace-pre-line leading-7 text-[#cccccc]">{localizedProfile?.bio || profile.bio}</p><div className="mt-6 grid gap-3 text-sm text-[#cccccc]"><p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[#2997ff]" /> {profile.regions.join(' · ')}</p><p className="flex items-center gap-3"><Languages className="h-4 w-4 text-[#2997ff]" /> {profile.languages.map(item => languageNames[item] ?? item.toUpperCase()).join(' · ')}</p><p className="flex items-center gap-3"><Globe2 className="h-4 w-4 text-[#2997ff]" /> {ui.attribution}</p>{profile.phone && <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-3 hover:text-[#2997ff]"><Phone className="h-4 w-4 text-[#2997ff]" /> {profile.phone}</a>}{profile.instagram_url && <a href={profile.instagram_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-[#2997ff]"><Instagram className="h-4 w-4 text-[#2997ff]" /> Instagram</a>}</div><div className="mt-8"><p className="mb-3 text-sm text-[#cccccc]">{title}</p><Link to={`/apply?ref=${profile.referral_code}`} className="inline-flex rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold hover:bg-cyan-400">{cta}</Link></div></div>
      </article><section className="w-full py-5 sm:py-8 lg:py-12">
        <div className="mx-auto mb-9 max-w-3xl text-center sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#2997ff]">{ui.choose}</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">{ui.explore}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#cccccc] sm:text-base">{ui.intro}</p>
          <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-cyan-300/[0.07] px-4 py-2 text-xs font-semibold text-[#2997ff]">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> {ui.personal}
          </div>
        </div>
        <div className="grid items-stretch gap-6 md:grid-cols-2 lg:gap-7">
          {landingPages.map((item, index) => <Link key={item.slug} to={`/d/${profile.slug}/${item.slug}`} className="group relative flex min-h-[460px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.24)] transition duration-500 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_28px_80px_rgba(8,145,178,0.16)] sm:min-h-[500px]">
            <div className="relative h-52 shrink-0 overflow-hidden sm:h-60 lg:h-64">
              {item.visual === 'business' && <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_44%,rgba(34,211,238,0.2),transparent_38%),linear-gradient(135deg,#07142f,#0a2550)]" />
                <div aria-hidden="true" className="absolute -right-14 top-2 h-56 w-56 rounded-full border border-white/20 sm:h-64 sm:w-64" />
                <div className="absolute bottom-0 right-[5%] h-[94%] w-[72%] transition duration-700 group-hover:scale-[1.035]">
                  <img src={currentProfilePhoto} alt={`${profile.display_name} profile`} style={{ height: '100%', width: '100%', objectFit: 'contain', objectPosition: 'center bottom' }} className="drop-shadow-[0_22px_34px_rgba(0,0,0,0.55)]" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#06112d] via-[#06112d]/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0a1229]/70 to-transparent" />
                <span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">{ui.path}</span>
              </>}
              {item.visual === 'duo' && <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_75%,rgba(34,211,238,0.24),transparent_48%),linear-gradient(135deg,#07142f,#0b2450)]" />
                <img src="/products/k8.png" alt="K8 water ionizer" className="absolute bottom-2 left-[8%] h-[74%] w-[43%] object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.45)] transition duration-700 group-hover:-translate-x-1 group-hover:scale-105" />
                <img src="/products/emguarde-go.png" alt="emGuarde GO" className="absolute bottom-1 right-[7%] h-[91%] w-[39%] object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)] transition duration-700 group-hover:translate-x-1 group-hover:scale-105" />
                <span className="absolute right-5 top-5 rounded-full border border-white/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2997ff] backdrop-blur-md">{ui.duoTag}</span>
              </>}
              {item.visual === 'training' && <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_82%,rgba(34,211,238,0.18),transparent_46%),linear-gradient(135deg,#07142f,#0a2550)]" />
                <div className="absolute inset-x-[6%] bottom-0 flex h-[92%] items-end justify-center">
                  {['/leaders/standardized/simon-loh-v2.png', '/leaders/standardized/mehdi-cohen.png', '/leaders/standardized/ming-way-sia.png'].map((src, leaderIndex) => <img key={src} src={src} alt="True Legacy leader" className={`h-[86%] w-[36%] rounded-t-2xl border border-white/15 object-cover object-top shadow-2xl shadow-black/40 transition duration-700 group-hover:-translate-y-1 ${leaderIndex === 1 ? 'z-20 h-[96%] -mx-3' : 'z-10 opacity-90'}`} />)}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a1229]/80 to-transparent" />
                <span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">{ui.trainingTag}</span>
              </>}
              {item.visual === 'events' && <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(245,158,11,0.18),transparent_42%),linear-gradient(135deg,#07142f,#0a2550)]" />
                <div className="absolute inset-x-[8%] bottom-3 top-3 flex items-center justify-center gap-3 sm:gap-4">
                  <img src="/assets/mehdicohen-global-weekly.png" alt="Unlock Your True Legacy global English event" className="h-[92%] min-w-0 flex-1 rounded-lg object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.45)] transition duration-700 group-hover:-translate-y-1 group-hover:-rotate-1" />
                  <img src="/assets/mehdicohen-latam-weekly.png" alt="La Revolución del Biohacking LATAM Spanish event" className="h-[92%] min-w-0 flex-1 rounded-lg object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.45)] transition duration-700 group-hover:-translate-y-1 group-hover:rotate-1" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#071126]/50 via-transparent to-[#071126]/10" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a1229]/80 to-transparent" />
                <span className="absolute bottom-5 left-5 rounded-full border border-amber-200/25 bg-amber-400/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-100 backdrop-blur-md">{ui.eventsTag}</span>
              </>}
            </div>
            <div className="relative flex flex-1 flex-col border-t border-white/[0.07] p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex items-center gap-3"><span className="inline-flex rounded-xl border border-white/20 bg-cyan-200/10 p-2.5"><item.icon className="h-5 w-5 text-[#2997ff]" /></span><span className="text-[10px] font-bold tracking-[0.22em] text-[#86868b]">0{index + 1}</span></span>
                <ArrowUpRight className="h-5 w-5 text-[#86868b] transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#2997ff]" />
              </div>
              <div className="mt-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2997ff]">{item.eyebrow}</p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-white">{item.label}</h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#cccccc]">{item.text}</p>
              </div>
              <div className="mt-auto flex items-center justify-between border-t border-white/[0.08] pt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#2997ff]"><span>{item.cta}</span><span aria-hidden="true" className="inline-block text-lg transition-transform duration-300 group-hover:translate-x-1">→</span></div>
            </div>
          </Link>)}
        </div>
      </section></> : <div className="w-full animate-pulse rounded-3xl border border-white/10 p-20 text-center text-[#86868b]">{ui.loading}</div>}
    </main>
    <Footer />
  </div>
}
