import React from 'react'
import { X, ExternalLink, MessageCircle, Droplets, Radio, ShieldCheck, CheckCircle2 } from 'lucide-react'

interface DuoPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  distributorName: string
  k8PurchaseUrl?: string | null
  emguardePurchaseUrl?: string | null
  whatsappUrl: string
  locale: string
}

const MODAL_I18N = {
  en: {
    badge: 'VERIFIED ENAGIC® OEM CHECKOUT',
    title: 'ORDER THE TRUE LEGACY DUO',
    sub: 'The True Legacy Duo combines two independent Enagic® technologies. Because they are individual medical-grade & frequency systems, each device is ordered through its dedicated checkout. Follow the two options below to purchase both technologies for your home and lifestyle.',
    howToBuyTitle: 'HOW TO ACQUIRE BOTH TECHNOLOGIES:',
    step1: '1. Order your Leveluk K8® water ionizer unit.',
    step2: '2. Order your emGuarde® GO ambient frequency set.',
    step3: 'Both orders ship with official OEM warranty & distributor onboarding.',
    k8Title: 'Leveluk K8® Water Ionizer',
    k8Badge: 'PILLAR 01 · WATER IONIZATION',
    k8Specs: '8 Solid Titanium Plates · 5 Continuous pH Water Outputs · Antioxidant H₂',
    k8Desc: 'Engineered in Osaka, Japan. Restructures tap water into hydrogen-rich alkaline drinking water, pure hydration water, and chemical-free 2.5 pH sanitizing water.',
    k8Buy: '1. ORDER LEVELUK K8®',
    emguardeTitle: 'emGuarde® GO Frequency Set',
    emguardeBadge: 'PILLAR 02 · AMBIENT FREQUENCY',
    emguardeSpecs: 'Dual-Unit Portable Set · 3-Meter Spherical Field · USB-C Rechargeable',
    emguardeDesc: 'Clinically proven ambient harmonic resonance. Harmonizes high-frequency electromagnetic radiation (EMF) from 5G, Wi-Fi routers, phones, and modern electronics.',
    emguardeBuy: '2. ORDER EMGUARDE® GO',
    bundleHelpTitle: 'Need help completing both orders as a single bundle?',
    bundleHelpSub: 'Connect with your verified guide for market-specific pricing, local financing, and combined shipping assistance.',
    chatWith: 'Message',
    chatForBundle: 'for Duo Bundle Support',
    verifiedCheckout: 'Official Enagic Distributor Checkout · Encrypted & Direct',
  },
  es: {
    badge: 'CHECKOUT OFICIAL ENAGIC® OEM',
    title: 'ORDENA EL DÚO TRUE LEGACY',
    sub: 'El Dúo True Legacy combina dos tecnologías independientes de Enagic®. Debido a que son sistemas especializados de grado médico y frecuencia ambiental, cada uno se ordena a través de su enlace oficial. Utiliza las dos opciones siguientes para adquirir ambas tecnologías.',
    howToBuyTitle: 'CÓMO ADQUIRIR AMBAS TECNOLOGÍAS:',
    step1: '1. Ordena tu unidad de ionización de agua Leveluk K8®.',
    step2: '2. Ordena tu set de frecuencia ambiental emGuarde® GO.',
    step3: 'Ambos pedidos cuentan con garantía oficial OEM y asesoría personalizada.',
    k8Title: 'Ionizador de Agua Leveluk K8®',
    k8Badge: 'PILAR 01 · IONIZACIÓN DE AGUA',
    k8Specs: '8 Placas de Titanio · 5 Tipos de Agua pH Continuos · Hidrógeno Antioxidante',
    k8Desc: 'Fabricado en Osaka, Japón. Transforma el agua corriente en agua alcalina rica en hidrógeno, agua de belleza y agua desinfectante de pH 2.5 sin químicos.',
    k8Buy: '1. ORDENAR LEVELUK K8®',
    emguardeTitle: 'Set de Frecuencia emGuarde® GO',
    emguardeBadge: 'PILAR 02 · FRECUENCIA AMBIENTAL',
    emguardeSpecs: 'Set Portátil de 2 Unidades · Radio Esférico de 3 Metros · Batería USB-C',
    emguardeDesc: 'Tecnología de resonancia armónica probada. Neutraliza las frecuencias electromagnéticas (EMF) generadas por 5G, Wi-Fi y dispositivos electrónicos.',
    emguardeBuy: '2. ORDENAR EMGUARDE® GO',
    bundleHelpTitle: '¿Prefieres ordenar ambos con asistencia directa?',
    bundleHelpSub: 'Contacta a tu guía verificado para consultar precios locales, opciones de financiamiento y envío conjunto.',
    chatWith: 'Chatear con',
    chatForBundle: 'para Asistencia con el Paquete',
    verifiedCheckout: 'Pedido Oficial de Distribuidor Enagic · Seguro y Directo',
  },
  fr: {
    badge: 'COMMANDE OFFICIELLE ENAGIC® OEM',
    title: 'COMMANDEZ LE DUO TRUE LEGACY',
    sub: 'Le True Legacy Duo réunit deux technologies Enagic® complémentaires. Comme il s’agit de deux équipements distincts certifiés, chaque appareil se commande via son lien autorisé. Suivez les deux étapes ci-dessous pour commander les deux appareils.',
    howToBuyTitle: 'COMMENT COMMANDER LES DEUX APPAREILS :',
    step1: '1. Commandez votre ioniseur d’eau Leveluk K8®.',
    step2: '2. Commandez votre set de fréquence ambiante emGuarde® GO.',
    step3: 'Livraison directe d’usine Enagic avec garantie officielle et accompagnement.',
    k8Title: 'Ioniseur d’Eau Leveluk K8®',
    k8Badge: 'PILIER 01 · IONISATION DE L’EAU',
    k8Specs: '8 Plaques Titane Platine · 5 Niveaux de pH en Continu · Hydrogène Actif',
    k8Desc: 'Conçu à Osaka, Japon. Restructure l’eau du robinet en eau alcaline antioxydante riche en hydrogène, eau de soin et eau désinfectante pH 2.5 sans additif.',
    k8Buy: '1. COMMANDER LE LEVELUK K8®',
    emguardeTitle: 'Set de Fréquence emGuarde® GO',
    emguardeBadge: 'PILIER 02 · ENVIRONNEMENT AMBIANT',
    emguardeSpecs: 'Set Portatif 2 Unités · Champ Sphérique de 3 Mètres · Recharge USB-C',
    emguardeDesc: 'Technologie de résonance harmonique. Neutralise les perturbations électromagnétiques (CEM) émises par la 5G, le Wi-Fi et les écrans du quotidien.',
    emguardeBuy: '2. COMMANDER L’EMGUARDE® GO',
    bundleHelpTitle: 'Besoin d’aide pour commander le duo complet ?',
    bundleHelpSub: 'Échangez directement avec votre guide pour connaître les modalités de paiement et la livraison groupée.',
    chatWith: 'Échanger avec',
    chatForBundle: 'pour Aide Commande Duo',
    verifiedCheckout: 'Commande Officielle Distributeur Enagic · Sécurisée & Directe',
  },
  pt: {
    badge: 'CHECKOUT OFICIAL ENAGIC® OEM',
    title: 'PEÇA O TRUE LEGACY DUO',
    sub: 'O True Legacy Duo une duas tecnologias independentes da Enagic®. Por serem sistemas de grau médico e harmonização de frequência, cada equipamento possui seu checkout dedicado. Utilize as duas opções abaixo para adquirir ambas as tecnologias.',
    howToBuyTitle: 'COMO ADQUIRIR AS DUAS TECNOLOGIAS:',
    step1: '1. Peça sua unidade ionizadora de água Leveluk K8®.',
    step2: '2. Peça seu kit de frequência ambiental emGuarde® GO.',
    step3: 'Ambos os pedidos com garantia oficial de fábrica e suporte personalizado.',
    k8Title: 'Ionizador de Água Leveluk K8®',
    k8Badge: 'PILAR 01 · IONIZAÇÃO DA ÁGUA',
    k8Specs: '8 Placas de Titânio · 5 Tipos Contínuos de pH · Hidrogênio Antioxidante',
    k8Desc: 'Fabricado em Osaka, Japão. Transforma a água comum em água alcalina antioxidante rica em hidrogênio, água de beleza e água desinfetante pH 2.5.',
    k8Buy: '1. PEDIR LEVELUK K8®',
    emguardeTitle: 'Kit de Frequência emGuarde® GO',
    emguardeBadge: 'PILAR 02 · FREQUÊNCIA AMBIENTAL',
    emguardeSpecs: 'Kit Portátil com 2 Unidades · Raio Esférico de 3 Metros · Bateria USB-C',
    emguardeDesc: 'Tecnologia comprovada de ressonância harmônica. Neutraliza os campos eletromagnéticos (EMF) de roteadores Wi-Fi, antenas 5G e celulares.',
    emguardeBuy: '2. PEDIR EMGUARDE® GO',
    bundleHelpTitle: 'Precisa de suporte para pedir ambos juntos?',
    bundleHelpSub: 'Fale com seu líder verificado para verificar disponibilidade local, parcelamento e envio unificado.',
    chatWith: 'Conversar com',
    chatForBundle: 'para Suporte do Pacote Duo',
    verifiedCheckout: 'Pedido Oficial de Distribuidor Enagic · Seguro e Direto',
  },
}

export function DuoPurchaseModal({
  isOpen,
  onClose,
  distributorName,
  k8PurchaseUrl,
  emguardePurchaseUrl,
  whatsappUrl,
  locale,
}: DuoPurchaseModalProps) {
  if (!isOpen) return null

  const t = MODAL_I18N[locale as keyof typeof MODAL_I18N] || MODAL_I18N.en
  const distributorFirstName = distributorName.split(' ')[0]

  const activeK8Url = k8PurchaseUrl || 'https://www.enagic.com/en_US/products/leveluk-k8'
  const activeEmguardeUrl = emguardePurchaseUrl || 'https://www.enagic.com/en_US/product-emguarde'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-white/20 bg-gradient-to-b from-[#0a1324] via-[#050b16] to-[#02050b] p-6 sm:p-8 shadow-2xl text-left relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 h-64 w-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-64 w-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/10 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-400/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                <ShieldCheck className="h-3 w-3 text-cyan-400" />
                {t.badge}
              </span>
              <span className="text-xs text-slate-400">· {distributorName}</span>
            </div>
            <h3 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t.title}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#a0abbd] leading-relaxed max-w-xl">
              {t.sub}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* How to Buy Both Instructions Box */}
        <div className="mt-5 rounded-2xl border border-cyan-400/25 bg-cyan-950/25 p-4 relative z-10">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-300">
            <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>{t.howToBuyTitle}</span>
          </div>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <p className="font-semibold text-white">{t.step1}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <p className="font-semibold text-white">{t.step2}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <p className="text-slate-300">{t.step3}</p>
            </div>
          </div>
        </div>

        {/* Dual Option Product Cards */}
        <div className="mt-6 space-y-4 relative z-10">
          {/* Button Option 1: Leveluk K8 */}
          <div className="rounded-2xl border border-cyan-500/40 bg-white/[0.04] p-5 flex flex-col sm:flex-row items-center justify-between gap-5 group hover:border-cyan-400 transition-all shadow-xl">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="h-20 w-20 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 p-2 flex items-center justify-center shrink-0">
                <img
                  src="/products/k8.png"
                  alt="Leveluk K8 Water Ionizer"
                  className="h-full w-auto object-contain drop-shadow-lg group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-cyan-300 tracking-wider">
                  <Droplets className="h-3 w-3 text-cyan-400" />
                  {t.k8Badge}
                </span>
                <h4 className="text-base sm:text-lg font-black text-white leading-snug">
                  {t.k8Title}
                </h4>
                <p className="text-xs text-cyan-200/90 font-medium">
                  {t.k8Specs}
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm">
                  {t.k8Desc}
                </p>
              </div>
            </div>

            <a
              href={activeK8Url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 px-6 py-3.5 text-xs font-black text-slate-950 shadow-lg shadow-cyan-400/25 transition-all shrink-0 cursor-pointer hover:scale-105 active:scale-95 text-center"
            >
              <span>{t.k8Buy}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </a>
          </div>

          {/* Button Option 2: emGuarde GO */}
          <div className="rounded-2xl border border-emerald-500/40 bg-white/[0.04] p-5 flex flex-col sm:flex-row items-center justify-between gap-5 group hover:border-emerald-400 transition-all shadow-xl">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="h-20 w-20 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-2 flex items-center justify-center shrink-0">
                <img
                  src="/products/emguarde-go.png"
                  alt="emGuarde GO Frequency Set"
                  className="h-full w-auto object-contain drop-shadow-lg group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-300 tracking-wider">
                  <Radio className="h-3 w-3 text-emerald-400" />
                  {t.emguardeBadge}
                </span>
                <h4 className="text-base sm:text-lg font-black text-white leading-snug">
                  {t.emguardeTitle}
                </h4>
                <p className="text-xs text-emerald-200/90 font-medium">
                  {t.emguardeSpecs}
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm">
                  {t.emguardeDesc}
                </p>
              </div>
            </div>

            <a
              href={activeEmguardeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 px-6 py-3.5 text-xs font-black text-slate-950 shadow-lg shadow-emerald-400/25 transition-all shrink-0 cursor-pointer hover:scale-105 active:scale-95 text-center"
            >
              <span>{t.emguardeBuy}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </a>
          </div>
        </div>

        {/* Dedicated WhatsApp Duo Bundle Support Card */}
        <div className="mt-6 rounded-2xl border border-white/15 bg-white/[0.03] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-xs sm:text-sm font-bold text-white">
              {t.bundleHelpTitle}
            </p>
            <p className="text-[11px] text-[#a0abbd] max-w-md">
              {t.bundleHelpSub}
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-3 text-xs font-black shadow-lg shadow-emerald-500/20 transition-all shrink-0 hover:scale-105 active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{t.chatWith} {distributorFirstName} {t.chatForBundle}</span>
          </a>
        </div>

        {/* Footer Security Badge */}
        <div className="mt-4 text-center">
          <p className="text-[10px] text-slate-500 font-mono tracking-tight">
            {t.verifiedCheckout}
          </p>
        </div>
      </div>
    </div>
  )
}
