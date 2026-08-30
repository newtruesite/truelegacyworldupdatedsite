import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SEO } from '@/components/SEO'
import { useLocaleContext } from '@/contexts/LocaleContext'
import { crmSupabase, getPublicDistributors, getLeaderPortrait } from '@/lib/crm'
import type { PublicDistributor } from '@/lib/crm'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Droplets,
  ExternalLink,
  Globe,
  Globe2,
  Instagram,
  Languages,
  MapPin,
  MessageCircle,
  Phone,
  Radio,
  ShieldCheck,
  Sparkles,
  UserCheck
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'

const LEADER_PORTRAITS: Record<string, string> = {
  'mehdi-cohen': '/leaders/standardized/mehdi-cohen.png',
  'simon-loh': '/leaders/standardized/simon-loh-v2.png',
  'ming-way-sia': '/leaders/standardized/ming-way-sia.png',
  'zah-naderi': '/leaders/standardized/zah-naderi-v3.png',
  'alex-gonzalez': '/leaders/standardized/alex-gonzalez.png',
  'ryan-pool': '/leaders/standardized/ryan-pool-sr.png',
  'ryan-pool-sr': '/leaders/standardized/ryan-pool-sr.png',
  'magaly-cardona': '/leaders/standardized/magaly-cardona.png',
  emanuela: '/leaders/standardized/emanuela-doustova.png',
  'emanuela-braj': '/leaders/standardized/emanuela-doustova.png',
  'jesse-schexnayder': '/leaders/standardized/jesse-schexnayder.png',
  'angel-mok': '/leaders/standardized/angel-mok-v2.png',
}

const PROFILE_TRANSLATIONS: Record<string, Record<'es' | 'fr' | 'pt', { title: string; bio: string }>> = {
  'simon-loh': {
    es: { title: 'Líder True Legacy 6A2-4', bio: 'Contador de formación y emprendedor por vocación. Simon salió de la carrera tradicional en 2016 y construyó su negocio Enagic en mercados internacionales. Hoy viaja por el mundo compartiendo su experiencia y capacitando a emprendedores para alcanzar la libertad financiera a través de Enagic y la comunidad True Legacy.' },
    fr: { title: 'Leader True Legacy 6A2-4', bio: 'Comptable de formation et entrepreneur par vocation, Simon a quitté la course traditionnelle en 2016 et développé son activité Enagic sur plusieurs marchés internationaux. Aujourd’hui, il parcourt le monde pour partager son expérience et former des entrepreneurs à poursuivre leur liberté financière grâce à Enagic et à la communauté True Legacy.' },
    pt: { title: 'Líder True Legacy 6A2-4', bio: 'Contador por formação e empreendedor por vocação, Simon deixou a corrida tradicional em 2016 e construiu seu negócio Enagic em mercados internacionais. Hoje, viaja pelo mundo compartilhando sua experiência e treinando empreendedores para buscar liberdade financeira por meio da Enagic e da comunidade True Legacy.' },
  },
  'mehdi-cohen': {
    es: { title: 'Líder True Legacy 6A', bio: 'Educación global y para LATAM sobre productos, liderazgo y apoyo al equipo.' },
    fr: { title: 'Leader True Legacy 6A', bio: 'Éducation produit mondiale et LATAM, leadership et soutien d’équipe.' },
    pt: { title: 'Líder True Legacy 6A', bio: 'Educação global e para a América Latina sobre produtos, liderança e suporte à equipe.' },
  },
  'ryan-pool': {
    es: { title: 'Líder True Legacy', bio: 'Ryan es emprendedor, exatleta y líder comunitario en Los Ángeles. Se enfoca en el bienestar, el desarrollo personal, la libertad financiera y en construir un legado familiar duradero.' },
    fr: { title: 'Leader True Legacy', bio: 'Ryan est entrepreneur, ancien athlète et leader communautaire à Los Angeles. Il se consacre au bien-être, au développement personnel, à la liberté financière et à la création d’un héritage familial durable.' },
    pt: { title: 'Líder True Legacy', bio: 'Ryan é empreendedor, ex-atleta e líder comunitário em Los Angeles. Seu foco está no bem-estar, desenvolvimento pessoal, liberdade financeira e na construção de um legado familiar duradouro.' },
  },
  'magaly-cardona': {
    es: { title: 'Líder True Legacy 6A', bio: 'Magaly ayuda a las personas a diseñar un trabajo alineado con sus valores y guía a líderes de Estados Unidos y Latinoamérica para construir negocios intencionales mediante Enagic y la comunidad.' },
    fr: { title: 'Leader True Legacy 6A', bio: 'Magaly aide les personnes à concevoir un travail aligné avec leurs valeurs et accompagne des leaders aux États-Unis et en Amérique latine dans la création d’activités intentionnelles grâce à Enagic et à la communauté.' },
    pt: { title: 'Líder True Legacy 6A', bio: 'Magaly ajuda pessoas a criarem um trabalho alinhado aos seus valores e orienta líderes nos Estados Unidos e na América Latina a desenvolverem negócios intencionais por meio da Enagic e da comunidade.' },
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
    es: { title: 'Distribuidora True Legacy', bio: 'Con más de una década de experiencia en ventas y marketing, Emanuela ha construido su carrera conectando con personas, creando oportunidades y ayudando a otros a ver lo que es posible en sus vidas.\n\nSu pasión por la salud, el bienestar, el desarrollo personal y la fe la llevó a Enagic y a la comunidad True Legacy, un vehículo alineado con su visión de generar un impacto global y una libertad duradera.\n\nHoy construye un negocio internacional mientras empodera a emprendedores con propósito para transformar su salud, desarrollar su liderazgo y crear riqueza generacional y un legado duradero.' },
    fr: { title: 'Distributrice True Legacy', bio: 'Forte de plus de dix ans d’expérience dans la vente et le marketing, Emanuela a bâti sa carrière autour du contact humain, de la création d’opportunités et de l’accompagnement de chacun vers son plein potentiel.\n\nSa passion pour la santé, le bien-être, le développement personnel et la foi l’a menée vers Enagic et la communauté True Legacy, un véhicule aligné avec sa vision d’impact mondial et de liberté durable.\n\nAujourd’hui, elle développe une activité internationale tout en accompagnant des entrepreneurs engagés à transformer leur santé, renforcer leur leadership et bâtir un héritage transgénérationnel.' },
    pt: { title: 'Distribuidora True Legacy', bio: 'Com mais de uma década de experiência em vendas e marketing, Emanuela construiu sua carreira conectando pessoas, criando oportunidades e ajudando outros a enxergarem novas possibilidades de vida.\n\nSua paixão por saúde, bem-estar, desenvolvimento pessoal e fé a conduziu à Enagic e à comunidade True Legacy, um veículo alinhado à sua visão de gerar impacto global e liberdade duradoura.\n\nHoje, ela constrói um negócio internacional enquanto capacita empreendedores com propósito a transformar sua saúde, desenvolver liderança e criar riqueza geracional e um legado duradouro.' },
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

function getShortPositioning(bio: string): string {
  if (!bio) return ''
  const firstParagraph = bio.split('\n')[0]
  const sentences = firstParagraph.match(/[^.!?]+[.!?]+/g)
  if (sentences && sentences.length > 0) {
    return sentences.slice(0, 2).join(' ').trim()
  }
  return firstParagraph.slice(0, 160).trim() + '…'
}

export default function DistributorProfilePage() {
  const { slug } = useParams()
  const { locale } = useLocaleContext()
  const [profile, setProfile] = useState<PublicDistributor | null | undefined>(undefined)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  useEffect(() => {
    let active = true
    const loadProfile = () => {
      getPublicDistributors().then(items => {
        if (!active) return
        setProfile(items.find(item => item.slug === slug) || null)
      })
    }
    loadProfile()
    window.addEventListener('truelegacy:leader-portrait-updated', loadProfile)
    return () => {
      active = false
      window.removeEventListener('truelegacy:leader-portrait-updated', loadProfile)
    }
  }, [slug])

  useEffect(() => {
    if (!profile || !crmSupabase) return
    void crmSupabase.rpc('crm_track_share_click', { p_slug: profile.slug, p_campaign: 'profile', p_locale: locale })
  }, [profile, locale])

  if (profile === null) return <NotFoundPage />

  const firstName = profile?.display_name.split(' ')[0] || 'Leader'
  const localizedProfile = profile && locale !== 'en' ? PROFILE_TRANSLATIONS[profile.slug]?.[locale] : undefined
  const leaderPhoto = profile?.avatar_url || (profile?.slug && getLeaderPortrait(profile.slug, LEADER_PORTRAITS[profile.slug])) || '/logos/tl-square-white.png'
  const websiteUrl = profile?.website_url || (profile?.slug === 'mehdi-cohen' ? 'https://mehdicohen.com' : null)
  const activeTitle = localizedProfile?.title || profile?.title || 'Independent Distributor'
  const activeBio = localizedProfile?.bio || profile?.bio || ''
  const shortPositioning = getShortPositioning(activeBio)

  const ui = {
    en: {
      invitationBadge: `Personal True Legacy invitation from ${firstName}`,
      verifiedLeader: 'Verified Leader',
      attributionAssurance: 'Team Attribution Assured',
      primaryMessage: `Message ${firstName} on WhatsApp`,
      requestInfo: 'Request information',
      chooseHeading: 'Choose your personal path',
      chooseSub: `Explore the business, products, training, and live events. Every step connects directly back to ${firstName}.`,
      aboutTitle: `About ${profile?.display_name || firstName}`,
      storySubtitle: 'Background & Mission',
      connectDirectly: `Direct Connection`,
      phoneLabel: 'Direct Phone',
      instagramLabel: 'Instagram Profile',
      websiteLabel: 'Personal Website',
      attributionNote: 'When you submit an inquiry through this page, you are attributed directly to this distributor inside True Legacy CRM.',
      reconnectHeading: `Ready to take your next step with ${firstName}?`,
      reconnectSub: 'Whether you want to learn more about the products or explore the business, we are here to support your journey.',
      paths: [
        {
          tag: '01 · Opportunity',
          title: 'Business Presentation',
          desc: `See how ${firstName} approaches leadership, global expansion, and building an independent business.`,
          cta: 'Explore the Business',
        },
        {
          tag: '02 · Products',
          title: 'The Duo Technologies',
          desc: 'Watch clear demonstrations of the Leveluk K8 water system and portable emGuarde GO set.',
          cta: 'Explore the Duo',
        },
        {
          tag: '03 · Ionization',
          title: 'Kangen Water®',
          desc: 'Explore Japanese medical-grade ionization, molecular hydrogen (H2), and negative ORP antioxidant power.',
          cta: 'Discover Kangen Water',
        },
        {
          tag: '04 · Protection',
          title: 'emGuarde® Defense',
          desc: 'Learn how patented harmonic resonance suppresses 5G and EMF radiation noise across a 4-meter radius.',
          cta: 'Explore emGuarde',
        },
        {
          tag: '05 · Academy',
          title: 'Leadership Training',
          desc: 'Preview the practical learning systems, product education, and global mentorship community.',
          cta: 'Preview Academy',
        },
        {
          tag: '06 · Live Events',
          title: 'Weekly Live Calls',
          desc: 'Join our upcoming English or Spanish Zoom presentation with True Legacy leaders.',
          cta: 'Join Live Event',
        },
      ],
    },
    es: {
      invitationBadge: `Invitación personal de True Legacy de ${firstName}`,
      verifiedLeader: 'Líder Verificado',
      attributionAssurance: 'Atribución de Equipo Garantizada',
      primaryMessage: `Mensaje a ${firstName} por WhatsApp`,
      requestInfo: 'Solicitar información',
      chooseHeading: 'Elige tu camino personalizado',
      chooseSub: `Explora el negocio, los productos, la capacitación y los eventos en vivo. Cada paso se conecta directamente con ${firstName}.`,
      aboutTitle: `Acerca de ${profile?.display_name || firstName}`,
      storySubtitle: 'Trayectoria y Misión',
      connectDirectly: `Conexión Directa`,
      phoneLabel: 'Teléfono Directo',
      instagramLabel: 'Perfil de Instagram',
      websiteLabel: 'Sitio Web Personal',
      attributionNote: 'Al enviar una solicitud a través de esta página, tu registro queda atribuido directamente a este distribuidor dentro del CRM de True Legacy.',
      reconnectHeading: `¿Listo para dar el siguiente paso con ${firstName}?`,
      reconnectSub: 'Ya sea que desees conocer más sobre los productos o explorar el negocio, estamos aquí para acompañarte.',
      paths: [
        {
          tag: '01 · Oportunidad',
          title: 'Presentación de Negocio',
          desc: `Descubre cómo ${firstName} aborda el liderazgo, la expansión global y la creación de un negocio independiente.`,
          cta: 'Explorar Negocio',
        },
        {
          tag: '02 · Productos',
          title: 'Tecnologías del Dúo',
          desc: 'Demostraciones claras del sistema de agua K8 y el set portátil emGuarde GO.',
          cta: 'Explorar el Dúo',
        },
        {
          tag: '03 · Ionización',
          title: 'Agua Kangen®',
          desc: 'Descubre la ionización médica japonesa, el hidrógeno molecular (H2) y el poder antioxidante del Leveluk K8.',
          cta: 'Descubrir Agua Kangen',
        },
        {
          tag: '04 · Protección',
          title: 'Defensa emGuarde®',
          desc: 'Tecnología patentada de resonancia armónica que suprime la radiación EMF y 5G en un radio de 4 metros.',
          cta: 'Explorar emGuarde',
        },
        {
          tag: '05 · Academia',
          title: 'Capacitación y Liderazgo',
          desc: 'Conoce los sistemas de aprendizaje, la educación de productos y el apoyo de la comunidad.',
          cta: 'Ver Academia',
        },
        {
          tag: '06 · Eventos',
          title: 'Eventos Semanales en Vivo',
          desc: 'Únete a nuestra próxima presentación en Zoom en inglés o español con líderes del equipo.',
          cta: 'Ver Eventos en Vivo',
        },
      ],
    },
    fr: {
      invitationBadge: `Invitation personnelle True Legacy de ${firstName}`,
      verifiedLeader: 'Leader Vérifié',
      attributionAssurance: 'Attribution d’Équipe Garantie',
      primaryMessage: `Contacter ${firstName} sur WhatsApp`,
      requestInfo: 'Demander des informations',
      chooseHeading: 'Choisissez votre parcours personnalisé',
      chooseSub: `Découvrez l’activité, les produits, la formation et les événements en direct. Chaque étape reste directement liée à ${firstName}.`,
      aboutTitle: `À propos de ${profile?.display_name || firstName}`,
      storySubtitle: 'Parcours et Vision',
      connectDirectly: `Contact Direct`,
      phoneLabel: 'Téléphone Direct',
      instagramLabel: 'Profil Instagram',
      websiteLabel: 'Site Web Personnel',
      attributionNote: 'En soumettant une demande sur cette page, votre contact est directement attribué à ce distributeur dans le CRM True Legacy.',
      reconnectHeading: `Prêt à franchir l’étape suivante avec ${firstName} ?`,
      reconnectSub: 'Que vous souhaitiez en savoir plus sur les produits ou découvrir l’activité, nous sommes là pour vous accompagner.',
      paths: [
        {
          tag: '01 · Opportunité',
          title: 'Présentation de l’Activité',
          desc: `Découvrez la vision de ${firstName} sur le leadership, l’expansion et la création d’une activité indépendante.`,
          cta: 'Découvrir l’Activité',
        },
        {
          tag: '02 · Produits',
          title: 'Technologies du Duo',
          desc: 'Démonstrations claires du système K8 et de la protection nomade emGuarde GO.',
          cta: 'Découvrir le Duo',
        },
        {
          tag: '03 · Ionisation',
          title: 'Eau Kangen®',
          desc: 'Explorez l’ionisation médicale japonaise, l’hydrogène moléculaire (H2) et la puissance antioxydante du Leveluk K8.',
          cta: 'Découvrir Eau Kangen',
        },
        {
          tag: '04 · Protection',
          title: 'Défense emGuarde®',
          desc: 'Technologie brevetée de résonance harmonique supprimant le bruit des ondes 5G et CEM sur 4 mètres.',
          cta: 'Découvrir emGuarde',
        },
        {
          tag: '05 · Académie',
          title: 'Formation & Leadership',
          desc: 'Accédez aux systèmes de formation, à l’éducation produit et au mentorat d’équipe.',
          cta: 'Voir l’Académie',
        },
        {
          tag: '06 · Événements',
          title: 'Présentations en Direct',
          desc: 'Participez à notre prochaine présentation Zoom hebdomadaire en anglais ou en espagnol.',
          cta: 'Rejoindre le Direct',
        },
      ],
    },
    pt: {
      invitationBadge: `Convite pessoal True Legacy de ${firstName}`,
      verifiedLeader: 'Líder Verificado',
      attributionAssurance: 'Atribuição de Equipe Garantida',
      primaryMessage: `Mensagem para ${firstName} no WhatsApp`,
      requestInfo: 'Solicitar informações',
      chooseHeading: 'Escolha seu caminho personalizado',
      chooseSub: `Explore o negócio, os produtos, o treinamento e os eventos ao vivo. Cada passo se conecta diretamente a ${firstName}.`,
      aboutTitle: `Sobre ${profile?.display_name || firstName}`,
      storySubtitle: 'Trajetória e Propósito',
      connectDirectly: `Conexão Direta`,
      phoneLabel: 'Telefone Direto',
      instagramLabel: 'Perfil no Instagram',
      websiteLabel: 'Site Pessoal',
      attributionNote: 'Ao enviar uma solicitação através desta página, você fica atribuído diretamente a este distribuidor no CRM True Legacy.',
      reconnectHeading: `Pronto para dar o próximo passo com ${firstName}?`,
      reconnectSub: 'Seja para conhecer mais sobre os produtos ou explorar o negócio, estamos prontos para apoiar sua jornada.',
      paths: [
        {
          tag: '01 · Oportunidade',
          title: 'Apresentação de Negócio',
          desc: `Veja como ${firstName} aborda liderança, duplicação e construção de um negócio independente.`,
          cta: 'Explorar Negócio',
        },
        {
          tag: '02 · Produtos',
          title: 'Tecnologias do Duo',
          desc: 'Demonstrações práticas do ionizador K8 e do protetor portátil emGuarde GO.',
          cta: 'Explorar o Duo',
        },
        {
          tag: '03 · Ionização',
          title: 'Água Kangen®',
          desc: 'Explore a ionização médica japonesa, hidrogênio molecular (H2) e o poder antioxidante do Leveluk K8.',
          cta: 'Conhecer Água Kangen',
        },
        {
          tag: '04 · Proteção',
          title: 'Defesa emGuarde®',
          desc: 'Tecnologia patenteada de ressonância harmônica que suprime a radiação EMF e 5G em um raio de 4 metros.',
          cta: 'Explorar emGuarde',
        },
        {
          tag: '05 · Academia',
          title: 'Treinamento e Liderança',
          desc: 'Conheça o sistema de aprendizado, educação de produtos e mentoria global da comunidade.',
          cta: 'Ver Academia',
        },
        {
          tag: '06 · Eventos',
          title: 'Apresentações Semanais',
          desc: 'Participe do nosso próximo evento Zoom ao vivo em inglês ou espanhol.',
          cta: 'Entrar no Evento',
        },
      ],
    },
  }[locale]

  const languageNames: Record<string, string> = {
    en: 'English',
    zh: 'Mandarin',
    yue: 'Cantonese',
    ms: 'Malay',
    es: 'Spanish',
    fr: 'French',
    pt: 'Portuguese',
    ar: 'Arabic',
    ru: 'Russian',
  }

  const whatsappPhone = profile?.phone ? profile.phone.replace(/\D/g, '') : null
  const whatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`Hi ${firstName}, I visited your True Legacy profile and would like to learn more.`)}`
    : null
  const applyUrl = `/apply?ref=${profile?.referral_code || slug}`

  const paths = [
    {
      slug: 'business',
      icon: BriefcaseBusiness,
      tag: ui.paths[0].tag,
      title: ui.paths[0].title,
      desc: ui.paths[0].desc,
      cta: ui.paths[0].cta,
      gradient: 'from-cyan-500/20 via-blue-600/10 to-transparent',
      borderGlow: 'hover:border-cyan-400/40',
      iconBg: 'bg-cyan-400/10 text-[#2997ff]',
    },
    {
      slug: 'duo',
      icon: Sparkles,
      tag: ui.paths[1].tag,
      title: ui.paths[1].title,
      desc: ui.paths[1].desc,
      cta: ui.paths[1].cta,
      gradient: 'from-sky-500/20 via-indigo-600/10 to-transparent',
      borderGlow: 'hover:border-sky-400/40',
      iconBg: 'bg-sky-400/10 text-sky-400',
    },
    {
      slug: 'kangen',
      icon: Droplets,
      tag: ui.paths[2].tag,
      title: ui.paths[2].title,
      desc: ui.paths[2].desc,
      cta: ui.paths[2].cta,
      gradient: 'from-cyan-500/20 via-sky-600/10 to-transparent',
      borderGlow: 'hover:border-cyan-400/40',
      iconBg: 'bg-cyan-400/10 text-cyan-300',
    },
    {
      slug: 'emguarde',
      icon: Radio,
      tag: ui.paths[3].tag,
      title: ui.paths[3].title,
      desc: ui.paths[3].desc,
      cta: ui.paths[3].cta,
      gradient: 'from-violet-500/20 via-purple-600/10 to-transparent',
      borderGlow: 'hover:border-violet-400/40',
      iconBg: 'bg-violet-400/10 text-violet-300',
    },
    {
      slug: 'training',
      icon: BookOpen,
      tag: ui.paths[4].tag,
      title: ui.paths[4].title,
      desc: ui.paths[4].desc,
      cta: ui.paths[4].cta,
      gradient: 'from-blue-600/20 via-indigo-700/10 to-transparent',
      borderGlow: 'hover:border-blue-400/40',
      iconBg: 'bg-blue-400/10 text-blue-400',
    },
    {
      slug: 'events',
      icon: CalendarDays,
      tag: ui.paths[5].tag,
      title: ui.paths[5].title,
      desc: ui.paths[5].desc,
      cta: ui.paths[5].cta,
      gradient: 'from-amber-500/20 via-orange-600/10 to-transparent',
      borderGlow: 'hover:border-amber-400/40',
      iconBg: 'bg-amber-400/10 text-amber-400',
    },
  ]

  return (
    <div className="page-wrapper bg-black text-white selection:bg-cyan-500 selection:text-black">
      <SEO
        title={`${profile?.display_name || 'Leader'} | True Legacy World`}
        description={shortPositioning || 'Verified True Legacy distributor profile and team attribution.'}
        image={profile?.avatar_url || undefined}
      />
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-24 pb-16 sm:px-6 md:pt-28 md:pb-24">
        {profile ? (
          <>
            {/* 1. COMPRESSED TOP HERO CARD (Consistent deep dark aesthetic matching cards below) */}
            <header
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative mb-10 overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#090d16] p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-cyan-500/30"
            >
              {/* Interactive dynamic subtle cursor spotlight (Clean, sharp, no gray blur) */}
              <div
                className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
                style={{
                  opacity: isHovered ? 1 : 0,
                  background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(41, 151, 255, 0.09), transparent 80%)`,
                }}
              />

              {/* Invitation & Attribution Top Banner */}
              <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3.5 py-1 text-xs font-semibold text-[#2997ff]">
                  <UserCheck className="h-3.5 w-3.5 text-[#2997ff]" />
                  {ui.invitationBadge}
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{ui.attributionAssurance}</span>
                </div>
              </div>

              {/* Balanced 3-Column Hero Grid */}
              <div className="relative z-10 grid gap-6 sm:grid-cols-[160px_1fr] md:grid-cols-[190px_1fr] lg:grid-cols-[200px_1fr_270px] items-center">
                {/* Standardized Studio Portrait */}
                <div className="relative mx-auto sm:mx-0 h-52 w-44 sm:h-60 sm:w-full max-w-[200px] shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-black/60 shadow-xl group/photo transition-all duration-300 hover:border-cyan-400/40">
                  <img
                    src={leaderPhoto}
                    alt={profile.display_name}
                    className="h-full w-full object-cover object-top transition duration-500 group-hover/photo:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#2997ff] backdrop-blur-md shadow-lg">
                    <BadgeCheck className="h-3 w-3 text-[#2997ff]" />
                    {ui.verifiedLeader}
                  </span>
                </div>

                {/* Identity, Positioning & 2 Primary CTAs */}
                <div className="flex flex-col justify-center text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black !text-white leading-tight tracking-tight">
                    {profile.display_name}
                  </h1>
                  <p className="mt-1 text-sm sm:text-base font-semibold text-[#2997ff]">
                    {activeTitle}
                  </p>

                  {/* Positioning statement (Short & crisp) */}
                  {shortPositioning && (
                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#cccccc] max-w-2xl line-clamp-2 sm:line-clamp-3">
                      {shortPositioning}
                    </p>
                  )}

                  {/* Metadata Tags: Markets & Languages */}
                  <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-[#86868b]">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-slate-300">
                      <MapPin className="h-3.5 w-3.5 text-[#2997ff]" />
                      {profile.regions.join(' · ')}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-slate-300">
                      <Languages className="h-3.5 w-3.5 text-[#2997ff]" />
                      {profile.languages.map(code => languageNames[code] ?? code.toUpperCase()).join(' · ')}
                    </span>
                  </div>

                  {/* Standardized Dual CTA Row: Exactly 1 Primary + 1 Secondary */}
                  <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    {whatsappUrl ? (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {ui.primaryMessage}
                      </a>
                    ) : (
                      <Link
                        to={applyUrl}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition-all shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-95"
                      >
                        {ui.requestInfo}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}

                    <Link
                      to={applyUrl}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-black/40 hover:bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:border-white/30 active:scale-95"
                    >
                      {ui.requestInfo}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Right Column: Verified Channels & Links Glass Card */}
                <div className="flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-black/40 p-4 shadow-xl sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">Verified Channels</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Guide
                    </span>
                  </div>

                  {websiteUrl && (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link flex items-center justify-between rounded-xl border border-cyan-500/20 bg-cyan-500/[0.06] p-2.5 hover:border-cyan-400/50 hover:bg-cyan-400/15 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-400 group-hover/link:bg-cyan-400 group-hover/link:text-black transition-colors">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-[10px] uppercase font-bold text-[#86868b]">{ui.websiteLabel}</p>
                          <p className="text-xs font-bold text-white group-hover/link:text-cyan-300 transition-colors truncate">
                            {websiteUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[#86868b] group-hover/link:text-cyan-300 transition-colors" />
                    </a>
                  )}

                  {profile.instagram_url && (
                    <a
                      href={profile.instagram_url}
                      target="_blank"
                      rel="noreferrer"
                      className="group/ig flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-2.5 hover:border-pink-400/40 hover:bg-pink-400/10 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-400/10 text-pink-400 group-hover/ig:bg-pink-400 group-hover/ig:text-black transition-colors">
                          <Instagram className="h-4 w-4" />
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-[10px] uppercase font-bold text-[#86868b]">{ui.instagramLabel}</p>
                          <p className="text-xs font-bold text-white group-hover/ig:text-pink-300 transition-colors truncate">
                            @{profile.instagram_url.replace(/https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '')}
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[#86868b] group-hover/ig:text-pink-300 transition-colors" />
                    </a>
                  )}

                  <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/60 px-3 py-2 text-[11px] text-[#86868b]">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Ref ID: <strong className="text-white font-mono">{profile.referral_code || profile.slug}</strong></span>
                  </div>
                </div>
              </div>
            </header>

            {/* 2. FOUR-PATH GUIDED EXPERIENCE CARDS (Reduced height, connected visual cards, NO text-heavy flyers) */}
            <section className="mb-14">
              <div className="mb-8 text-center sm:text-left">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#2997ff]">
                  {ui.chooseHeading}
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {ui.chooseSub}
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                {paths.map(item => (
                  <Link
                    key={item.slug}
                    to={`/d/${profile.slug}/${item.slug}`}
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#090d16] p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 ${item.borderGlow} hover:shadow-2xl hover:shadow-cyan-950/20`}
                  >
                    {/* Visual Header Glow (Clean, minimal, no messy flyer posters) */}
                    <div
                      className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${item.gradient}`}
                    />

                    <div>
                      {/* Top Row: Icon + Step Tag */}
                      <div className="relative mb-4 flex items-center justify-between">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 ${item.iconBg}`}
                        >
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868b]">
                          {item.tag}
                        </span>
                      </div>

                      {/* Card Title & Description */}
                      <h3 className="relative text-lg font-bold !text-white leading-snug group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="relative mt-2 text-xs leading-relaxed text-[#cccccc] line-clamp-3">
                        {item.desc}
                      </p>
                    </div>

                    {/* Standardized Single Primary Action Arrow */}
                    <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-3 text-xs font-bold text-[#2997ff]">
                      <span>{item.cta}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 3. PERSONAL STORY & EXTENDED DETAILS (Structured lower for deep trust) */}
            <section className="mb-14 grid gap-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2997ff]">
                  {ui.storySubtitle}
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">
                  {ui.aboutTitle}
                </h3>
                <div className="mt-5 space-y-4 text-sm sm:text-base leading-relaxed text-[#cccccc] whitespace-pre-line">
                  {activeBio}
                </div>
              </div>

              {/* Direct Connection & Verification Sidebar */}
              <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#2997ff]">
                  {ui.connectDirectly}
                </h4>

                <div className="space-y-3 text-sm text-[#cccccc]">
                  {profile.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-[#2997ff]" />
                      <div>
                        <p className="text-[11px] text-[#86868b]">{ui.phoneLabel}</p>
                        <a
                          href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}
                          className="font-medium text-white hover:text-[#2997ff] transition-colors"
                        >
                          {profile.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile.instagram_url && (
                    <div className="flex items-center gap-3">
                      <Instagram className="h-4 w-4 text-pink-400" />
                      <div>
                        <p className="text-[11px] text-[#86868b]">{ui.instagramLabel}</p>
                        <a
                          href={profile.instagram_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-white hover:text-pink-300 transition-colors"
                        >
                          @{profile.instagram_url.replace(/https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '')}
                        </a>
                      </div>
                    </div>
                  )}

                  {websiteUrl && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-cyan-400" />
                      <div>
                        <p className="text-[11px] text-[#86868b]">{ui.websiteLabel}</p>
                        <a
                          href={websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-medium text-white hover:text-cyan-300 transition-colors"
                        >
                          {websiteUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                          <ExternalLink className="h-3 w-3 text-[#86868b]" />
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 border-t border-white/10 pt-3">
                    <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2997ff]" />
                    <p className="text-xs text-[#86868b] leading-relaxed">
                      {ui.attributionNote}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. PERSONALIZED CLOSING RECONNECTION BLOCK (Funnel Closing Action) */}
            <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#141926] via-[#090d16] to-[#04060a] p-8 sm:p-12 text-center shadow-2xl">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.15),transparent_60%)]" />

              <div className="relative mx-auto max-w-2xl">
                <div className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full border-2 border-cyan-400/30 p-0.5 shadow-lg">
                  <img
                    src={leaderPhoto}
                    alt={profile.display_name}
                    className="h-full w-full rounded-full object-cover object-top"
                  />
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {ui.reconnectHeading}
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[#cccccc] leading-relaxed">
                  {ui.reconnectSub}
                </p>

                {/* 1 Primary + 1 Secondary Action */}
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3 font-bold text-slate-950 transition-colors shadow-lg shadow-emerald-500/10 active:scale-95"
                    >
                      <MessageCircle className="h-5 w-5" />
                      {ui.primaryMessage}
                    </a>
                  )}
                  <Link
                    to={applyUrl}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition-colors shadow-lg shadow-cyan-500/10 active:scale-95"
                  >
                    {ui.requestInfo}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>

                <p className="mt-6 text-[11px] text-[#86868b]">
                  {ui.attributionNote}
                </p>
              </div>
            </section>
          </>
        ) : (
          <div className="w-full animate-pulse rounded-3xl border border-white/10 p-20 text-center text-[#86868b]">
            Loading verified profile…
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
