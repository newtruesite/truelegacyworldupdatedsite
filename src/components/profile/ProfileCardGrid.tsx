import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { getActiveProfileLandingCards, type ProfileLandingCardConfig } from '@/config/profileLandingCards'
import type { PublicDistributor } from '@/lib/crm'

interface ProfileCardGridProps {
  profile: PublicDistributor
  locale?: string
}

export function ProfileCardGrid({ profile, locale = 'en' }: ProfileCardGridProps) {
  const firstName = useMemo(() => profile.display_name.split(' ')[0] || 'Leader', [profile.display_name])

  const activeCards = useMemo(() => getActiveProfileLandingCards(), [])

  // Partition cards for desktop layout: full 3-card rows in 3-col grid, any remainder centered in bottom row
  const fullRowCount = useMemo(() => Math.floor(activeCards.length / 3) * 3, [activeCards])
  const gridCards = useMemo(() => activeCards.slice(0, fullRowCount), [activeCards, fullRowCount])
  const remainingCards = useMemo(() => activeCards.slice(fullRowCount), [activeCards, fullRowCount])

  const langKey = locale === 'es' ? 'es' : 'en'

  const renderCardItem = (item: ProfileLandingCardConfig) => {
    const Icon = item.icon
    const targetPath = item.getPath(profile.slug) + `?source=profile&interest=${item.analyticsInterest}`
    const categoryText = item.categoryLabel[langKey] || item.categoryLabel.en
    const eyebrowText = item.eyebrow[langKey] || item.eyebrow.en
    const titleText = item.title[langKey] || item.title.en
    const descText = item.description[langKey] ? item.description[langKey](firstName) : item.description.en(firstName)
    const ctaText = item.ctaText[langKey] || item.ctaText.en

    return (
      <Link
        key={item.id}
        to={targetPath}
        aria-label={`${item.numberLabel} ${categoryText}: ${titleText}`}
        className={`group relative flex w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#090d16] shadow-xl transition-all duration-300 hover:-translate-y-1.5 ${item.accentColor.borderGlow} hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400`}
      >
        {/* Visual Media Header with Custom Compositions */}
        <div className={`relative h-48 sm:h-52 w-full overflow-hidden border-b border-white/10 bg-gradient-to-br ${item.accentColor.gradient}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(255,255,255,0.08),transparent_55%)]" />

          {/* CARD TYPE: ANESPA DX (07) */}
          {item.cardType === 'anespa' && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative h-full w-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <div className={`absolute h-32 w-32 rounded-full ${item.accentColor.glowBlur} blur-xl pointer-events-none`} />
                <img
                  src={item.image || '/products/anespa-dx.png'}
                  alt={item.imageAlt}
                  className="h-36 w-auto object-contain drop-shadow-[0_10px_25px_rgba(14,165,233,0.3)] relative z-10"
                  style={{ maxHeight: '135px', maxWidth: '75%' }}
                />
              </div>
            </div>
          )}

          {/* CARD TYPE: UKON SIGMA (09) */}
          {item.cardType === 'ukon' && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative h-full w-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <div className={`absolute h-32 w-32 rounded-full ${item.accentColor.glowBlur} blur-xl pointer-events-none`} />
                <img
                  src={item.image || '/products/ukon-sigma.png'}
                  alt={item.imageAlt}
                  className="h-36 w-auto object-contain drop-shadow-[0_10px_25px_rgba(245,158,11,0.35)] relative z-10"
                  style={{ maxHeight: '135px', maxWidth: '75%' }}
                />
              </div>
            </div>
          )}

          {/* CARD TYPE: BEAUTE (10) */}
          {item.cardType === 'beaute' && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative h-full w-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <div className={`absolute h-32 w-32 rounded-full ${item.accentColor.glowBlur} blur-xl pointer-events-none`} />
                <img
                  src={item.image || '/products/kangen-beaute.png'}
                  alt={item.imageAlt}
                  className="h-36 w-auto object-contain drop-shadow-[0_10px_25px_rgba(254,243,199,0.3)] relative z-10"
                  style={{ maxHeight: '135px', maxWidth: '75%' }}
                />
              </div>
            </div>
          )}

          {/* CARD TYPE: LIVE EVENTS (06) */}
          {item.cardType === 'events' && (
            <div className="absolute inset-0 flex items-center justify-center p-2">
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-black/60 shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <img
                  src={item.image || '/assets/event-masterclass.png'}
                  alt={item.imageAlt}
                  className="h-full w-full object-cover object-[center_top] opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-blue-400/30">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping" />
                    Global & LATAM
                  </span>
                  <span>Weekly Presentations</span>
                </div>
              </div>
            </div>
          )}

          {/* CARD TYPE: KANGEN WAGYU (11) */}
          {item.cardType === 'wagyu' && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative h-full w-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <div className={`absolute h-32 w-32 rounded-full ${item.accentColor.glowBlur} blur-xl pointer-events-none`} />
                <img
                  src={item.image || '/assets/profile-kangen-wagyu.png'}
                  alt={item.imageAlt}
                  className="h-40 w-auto object-contain drop-shadow-[0_10px_25px_rgba(245,158,11,0.3)] relative z-10"
                  style={{ maxHeight: '155px', maxWidth: '88%' }}
                />
              </div>
            </div>
          )}

          {/* CARD TYPE: BUSINESS OPPORTUNITY PRESENTATION */}
          {item.cardType === 'presentation' && (
            <div className="absolute inset-0 flex items-center justify-center p-3">
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-black/60 shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <img
                  src="/assets/business-opportunity-preview.jpg"
                  alt="True Legacy Global Business Opportunity"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              </div>
            </div>
          )}

          {/* CARD TYPE: PRODUCT COLLECTION */}
          {item.cardType === 'collection' && (
            <div className="absolute inset-0 flex items-center justify-center p-3">
              <div className="relative h-full w-full flex items-center justify-center gap-1.5 group-hover:scale-105 transition-transform duration-500">
                <img
                  src="/products/anespa-dx.png"
                  alt="Anespa DX"
                  className="h-28 w-auto object-contain drop-shadow-lg opacity-85 hover:opacity-100 transition-opacity"
                  style={{ maxHeight: '105px', maxWidth: '30%' }}
                />
                <img
                  src="/products/k8.png"
                  alt="Leveluk K8"
                  className="h-36 w-auto object-contain drop-shadow-2xl z-10"
                  style={{ maxHeight: '135px', maxWidth: '42%' }}
                />
                <img
                  src="/products/ukon-sigma.png"
                  alt="Ukon Sigma"
                  className="h-24 w-auto object-contain drop-shadow-lg opacity-85 hover:opacity-100 transition-opacity"
                  style={{ maxHeight: '90px', maxWidth: '28%' }}
                />
              </div>
            </div>
          )}

          {/* CARD TYPE: THE DUO */}
          {item.cardType === 'duo' && (
            <div className="absolute inset-0 flex items-center justify-center p-3">
              <div className="relative h-full w-full flex items-center justify-center gap-3 group-hover:scale-105 transition-transform duration-500">
                <img
                  src="/products/k8.png"
                  alt="Leveluk K8 Water System"
                  className="h-36 w-auto object-contain drop-shadow-2xl"
                  style={{ maxHeight: '135px', maxWidth: '50%' }}
                />
                <img
                  src="/products/emguarde-go.png"
                  alt="emGuarde GO Set of 2"
                  className="h-28 w-auto object-contain drop-shadow-2xl"
                  style={{ maxHeight: '105px', maxWidth: '40%' }}
                />
              </div>
            </div>
          )}

          {/* CARD TYPE: LEVELUK K8 */}
          {item.cardType === 'k8' && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative h-full w-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <div className={`absolute h-32 w-32 rounded-full ${item.accentColor.glowBlur} blur-xl pointer-events-none`} />
                <img
                  src="/products/k8.png"
                  alt={item.imageAlt}
                  className="h-36 w-auto object-contain drop-shadow-2xl relative z-10"
                  style={{ maxHeight: '140px', maxWidth: '75%' }}
                />
              </div>
            </div>
          )}

          {/* CARD TYPE: EMGUARDE */}
          {item.cardType === 'emguarde' && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative h-full w-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <div className={`absolute h-32 w-32 rounded-full ${item.accentColor.glowBlur} blur-xl pointer-events-none`} />
                <img
                  src="/products/emguarde-go.png"
                  alt={item.imageAlt}
                  className="h-32 w-auto object-contain drop-shadow-2xl relative z-10"
                  style={{ maxHeight: '125px', maxWidth: '70%' }}
                />
              </div>
            </div>
          )}

          {/* CARD TYPE: LEVELUK JRIV (12) */}
          {item.cardType === 'jr4' && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative h-full w-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <div className={`absolute h-32 w-32 rounded-full ${item.accentColor.glowBlur} blur-xl pointer-events-none`} />
                <img
                  src={item.image || '/products/jr-iv.png'}
                  alt={item.imageAlt}
                  className="h-36 w-auto object-contain drop-shadow-[0_10px_25px_rgba(56,189,248,0.35)] relative z-10"
                  style={{ maxHeight: '135px', maxWidth: '75%' }}
                />
              </div>
            </div>
          )}

          {/* CARD TYPE: LEADERSHIP ACADEMY */}
          {item.cardType === 'academy' && (
            <div className="absolute inset-0 flex items-center justify-center p-3">
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-black/60 shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <img
                  src="/assets/academy-leadership-team-v2.jpg"
                  alt={item.imageAlt}
                  className="h-full w-full object-cover object-center opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-400/20">
                  <span>Workshop & Mentorship</span>
                  <span>True Legacy</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Gradient Fade for Content Transition */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#090d16] to-transparent pointer-events-none" />

          {/* Card Top Category Label & Icon */}
          <div className="absolute left-3.5 top-3.5 flex items-center gap-2 z-10">
            <span className={`grid h-8 w-8 place-items-center rounded-xl backdrop-blur-md shadow-md ${item.accentColor.iconBg}`}>
              <Icon className="h-4 w-4" />
            </span>
          </div>
          <span className="absolute right-3.5 top-3.5 rounded-full border border-white/20 bg-black/80 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white/90 backdrop-blur-md shadow-md z-10">
            {item.numberLabel} · {categoryText}
          </span>
        </div>

        {/* Card Content & Action Button */}
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider ${item.accentColor.badgeText}`}>
                {eyebrowText}
              </span>
              {item.isNew && (
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-cyan-300">
                  NEW
                </span>
              )}
            </div>
            <h3 className={`text-lg sm:text-xl font-bold leading-snug !text-white transition-colors ${item.accentColor.textHighlight}`}>
              {titleText}
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#b9c0cc]">
              {descText}
            </p>
          </div>

          {/* Bottom Interactive Button Affordance (Pinned to Bottom) */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className={`text-xs font-bold text-white transition-colors ${item.accentColor.textHighlight}`}>
              {ctaText}
            </span>
            <span className={`inline-flex items-center justify-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${item.accentColor.btnBg}`}>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="w-full">
      {/* TABLET / MOBILE RESPONSIVE GRID (All active cards in 1-col mobile or 2-col tablet) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:hidden items-stretch">
        {activeCards.map((card) => renderCardItem(card))}
      </div>

      {/* DESKTOP RESPONSIVE GRID (Full 3-col rows, remainder centered below) */}
      <div className="hidden lg:block space-y-5">
        {gridCards.length > 0 && (
          <div className="grid grid-cols-3 gap-5 items-stretch">
            {gridCards.map((card) => renderCardItem(card))}
          </div>
        )}

        {/* Remainder Cards centered with identical 3-col card width */}
        {remainingCards.length > 0 && (
          <div className="flex justify-center gap-5 items-stretch">
            {remainingCards.map((card) => (
              <div key={card.id} className="w-[calc((100%-2.5rem)/3)] flex flex-col">
                {renderCardItem(card)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
