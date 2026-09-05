import React from 'react'
import { X, ExternalLink, MessageCircle, Droplets, Radio, ShieldCheck } from 'lucide-react'

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
    title: 'COMPLETE YOUR DUO',
    sub: 'Choose which technology to order through your verified distributor checkout, or connect directly for personalized package support.',
    k8Title: 'Leveluk K8® Water Ionizer',
    k8Badge: 'PILLAR 01 · WATER',
    k8Desc: '8 Solid Platinum-Dipped Titanium Plates · 5 Continuous pH Water Outputs',
    k8Buy: 'BUY LEVELUK K8',
    emguardeTitle: 'emGuarde® GO Frequency Set',
    emguardeBadge: 'PILLAR 02 · ENVIRONMENT',
    emguardeDesc: 'Dual-Unit Portable Set · 3-Meter Spherical Field · USB-C Rechargeable',
    emguardeBuy: 'BUY EMGUARDE GO',
    needHelp: 'Need personal assistance with your order?',
    chatWith: 'Message',
    verifiedCheckout: 'Official Enagic Distributor Checkout · Encrypted & Direct',
  },
  es: {
    title: 'COMPLETA TU DÚO',
    sub: 'Elige qué tecnología ordenar mediante el enlace oficial de tu distribuidor verificado, o contáctalo directamente para asistencia personalizada.',
    k8Title: 'Ionizador de Agua Leveluk K8®',
    k8Badge: 'PILAR 01 · AGUA',
    k8Desc: '8 Placas de Titanio Bañadas en Platino · 5 Tipos de Agua pH Continuos',
    k8Buy: 'COMPRAR LEVELUK K8',
    emguardeTitle: 'Set de Frecuencia emGuarde® GO',
    emguardeBadge: 'PILAR 02 · AMBIENTE',
    emguardeDesc: 'Set Portátil de 2 Unidades · Radio Esférico de 3 Metros · Batería USB-C',
    emguardeBuy: 'COMPRAR EMGUARDE GO',
    needHelp: '¿Necesitas asesoría con tu pedido?',
    chatWith: 'Chatear con',
    verifiedCheckout: 'Pedido Oficial de Distribuidor Enagic · Seguro y Directo',
  },
  fr: {
    title: 'COMPLÉTEZ VOTRE DUO',
    sub: 'Choisissez l’appareil que vous souhaitez commander via le lien officiel de votre distributeur, ou contactez-le directement.',
    k8Title: 'Ioniseur d’Eau Leveluk K8®',
    k8Badge: 'PILIER 01 · EAU',
    k8Desc: '8 Plaques en Titane Trempées de Platine · 5 Niveaux de pH en Continu',
    k8Buy: 'ACHETER LEVELUK K8',
    emguardeTitle: 'Set emGuarde® GO',
    emguardeBadge: 'PILIER 02 · ENVIRONNEMENT',
    emguardeDesc: 'Set Portatif de 2 Unités · Champ Sphérique de 3 Mètres · Recharge USB-C',
    emguardeBuy: 'ACHETER EMGUARDE GO',
    needHelp: 'Besoin d’aide pour votre commande ?',
    chatWith: 'Échanger avec',
    verifiedCheckout: 'Commande Officielle Distributeur Enagic · Sécurisée & Directe',
  },
  pt: {
    title: 'COMPLETE SEU DUO',
    sub: 'Escolha qual tecnologia deseja pedir através do checkout oficial do seu distribuidor, ou fale diretamente para suporte personalizado.',
    k8Title: 'Ionizador de Água Leveluk K8®',
    k8Badge: 'PILAR 01 · ÁGUA',
    k8Desc: '8 Placas de Titânio Banhadas a Platina · 5 Tipos de Água Contínuos',
    k8Buy: 'COMPRAR LEVELUK K8',
    emguardeTitle: 'Set de Frequência emGuarde® GO',
    emguardeBadge: 'PILAR 02 · AMBIENTE',
    emguardeDesc: 'Set Portátil com 2 Unidades · Raio Esférico de 3 Metros · Carga USB-C',
    emguardeBuy: 'COMPRAR EMGUARDE GO',
    needHelp: 'Precisa de ajuda com o seu pedido?',
    chatWith: 'Conversar com',
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md transition-all duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-t-3xl sm:rounded-3xl border border-white/20 bg-gradient-to-b from-[#091322] via-[#050b14] to-[#02050a] p-6 sm:p-8 shadow-2xl text-left relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 h-48 w-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-48 w-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-400/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                <ShieldCheck className="h-3 w-3 text-cyan-400" />
                VERIFIED CHECKOUT
              </span>
              <span className="text-xs text-slate-400">· {distributorName}</span>
            </div>
            <h3 className="mt-2 text-xl sm:text-2xl font-black text-white tracking-tight">
              {t.title}
            </h3>
            <p className="mt-1 text-xs text-[#a0abbd] leading-relaxed">
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

        {/* Dual Option Cards */}
        <div className="mt-6 space-y-4">
          {/* Option 1: Leveluk K8 */}
          <div className="rounded-2xl border border-cyan-500/30 bg-white/[0.03] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-cyan-400/60 transition-all">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="h-16 w-16 rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-1 flex items-center justify-center shrink-0">
                <img
                  src="/products/k8.png"
                  alt="Leveluk K8"
                  className="h-full w-auto object-contain drop-shadow-md"
                />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-cyan-300 tracking-wider">
                  <Droplets className="h-3 w-3 text-cyan-400" />
                  {t.k8Badge}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white">
                  {t.k8Title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {t.k8Desc}
                </p>
              </div>
            </div>

            {k8PurchaseUrl ? (
              <a
                href={k8PurchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-5 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-cyan-500/20 transition-all shrink-0 cursor-pointer"
              >
                <span>{t.k8Buy}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition-all shrink-0"
              >
                <MessageCircle className="h-3.5 w-3.5 text-cyan-400" />
                <span>INQUIRE ABOUT K8</span>
              </a>
            )}
          </div>

          {/* Option 2: emGuarde GO */}
          <div className="rounded-2xl border border-emerald-500/30 bg-white/[0.03] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-emerald-400/60 transition-all">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="h-16 w-16 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-1 flex items-center justify-center shrink-0">
                <img
                  src="/products/emguarde-go.png"
                  alt="emGuarde GO"
                  className="h-full w-auto object-contain drop-shadow-md"
                />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-300 tracking-wider">
                  <Radio className="h-3 w-3 text-emerald-400" />
                  {t.emguardeBadge}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white">
                  {t.emguardeTitle}
                </h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {t.emguardeDesc}
                </p>
              </div>
            </div>

            {emguardePurchaseUrl ? (
              <a
                href={emguardePurchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-emerald-500/20 transition-all shrink-0 cursor-pointer"
              >
                <span>{t.emguardeBuy}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition-all shrink-0"
              >
                <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>INQUIRE ABOUT EMGUARDE</span>
              </a>
            )}
          </div>
        </div>

        {/* Footer / Direct Distributor Support */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="text-xs font-medium text-slate-300">
              {t.needHelp}
            </p>
            <p className="text-[10px] text-slate-500">
              {t.verifiedCheckout}
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 px-4 py-2 text-xs font-bold border border-emerald-400/30 transition-all"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>{t.chatWith} {distributorName.split(' ')[0]}</span>
          </a>
        </div>
      </div>
    </div>
  )
}
