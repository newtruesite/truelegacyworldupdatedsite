import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { Country } from '@/lib/countries'

const LEADERS = [
  {
    name: 'Mehdi Cohen',
    title: 'True Legacy World Founder',
    telegram: 'https://t.me/mehdicohen',
    instagram: 'https://www.instagram.com/mehdicohen/',
    website: 'https://mehdicohen.com',
    whatsapp: 'https://wa.me/1234567890',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&crop=face',
    region: 'Global',
  },
  {
    name: 'Ryan Pool',
    title: 'True Legacy Leader',
    telegram: 'https://t.me/ryanpool',
    instagram: 'https://www.instagram.com/ryanpool/',
    whatsapp: 'https://wa.me/1234567890',
    photo: '/leaders/ryan-hero.png',
    region: 'Global',
  },
  {
    name: 'Simon Loh',
    title: '6A2-4 Leader',
    telegram: 'https://t.me/simonloh',
    region: 'Asia / Malaysia',
    photo: null as string | null,
  },
  {
    name: 'Ming-Way Sia',
    title: '6A2-5 Leader',
    telegram: 'https://t.me/mingwaysia',
    region: 'Asia / Malaysia',
    photo: null as string | null,
  },
  {
    name: 'Hemanth',
    title: '6A5-2 Leader',
    telegram: 'https://t.me/hemanth',
    region: 'India / UAE',
    photo: null as string | null,
  },
]

function IconTelegram({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}
function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}

const LATAM_SLUGS = ['colombia', 'mexico', 'paraguay', 'brazil']
// TODO: Replace with actual LATAM WhatsApp number when provided
const WHATSAPP_LATAM = 'https://wa.me/1234567890'

type Props = {
  isOpen: boolean
  onClose: () => void
  country?: Country | null
  title?: string
  subtitle?: string
}

export function LeadersModal({ isOpen, onClose, country, title = 'Connect With a True Legacy Leader', subtitle = 'Choose your region to be connected directly' }: Props) {
  const isLATAM = country ? LATAM_SLUGS.includes(country.slug) : false

  useEffect(() => {
    if (!isOpen) return
    const handle = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handle)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handle)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        className="relative w-full max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-white/10 bg-[#0a1628] shadow-2xl max-w-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="leaders-modal-title"
      >
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10 bg-[#0a1628]/95 z-10">
          <div>
            <h2 id="leaders-modal-title" className="text-lg font-bold text-white">{title}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {LEADERS.map((leader) => (
            <div key={leader.name} className="rounded-xl border border-white/10 bg-white/5 p-4 flex gap-4">
              {leader.photo ? (
                <img src={leader.photo} alt="" className="w-14 h-14 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#00a896]/20 flex items-center justify-center text-[#00a896] font-bold text-lg shrink-0">
                  {leader.name.slice(0, 1)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="leader-name">{leader.name}</p>
                <p className="text-sm text-slate-400">{leader.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{leader.region}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {(leader as { whatsapp?: string }).whatsapp && (
                    <a
                      href={(leader as { whatsapp?: string }).whatsapp}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg font-bold text-white no-underline text-sm transition-opacity hover:opacity-90"
                      style={{ background: '#25D366' }}
                    >
                      <IconWhatsApp className="w-5 h-5" />
                      WhatsApp
                    </a>
                  )}
                  {(leader as { website?: string }).website && (
                    <a
                      href={(leader as { website?: string }).website}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg font-bold text-white no-underline text-sm border border-white/20 bg-white/5 hover:bg-white/10"
                    >
                      Website
                    </a>
                  )}
                  {leader.telegram && (
                    <a
                      href={leader.telegram}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg font-bold text-white no-underline text-sm transition-opacity hover:opacity-90"
                      style={{ background: '#229ED9' }}
                    >
                      <IconTelegram className="w-5 h-5" />
                      Telegram
                    </a>
                  )}
                  {isLATAM && !(leader as { whatsapp?: string }).whatsapp && (
                    <a
                      href={WHATSAPP_LATAM}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg font-bold text-white no-underline text-sm transition-opacity hover:opacity-90"
                      style={{ background: '#25D366' }}
                    >
                      <IconWhatsApp className="w-5 h-5" />
                      WhatsApp (LATAM)
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
