import { EventsLeadCaptureModal } from "@/components/ui/EventsLeadCaptureModal"
import { useAuth } from "@/contexts/AuthContext"
import { getEventRegion, getEventsByRegion } from "@/lib/events"
import { motion } from "framer-motion"
import { useState } from "react"

type Props = {
  locale: string
  countrySlug: string | undefined
}

export function EventsTab({ locale, countrySlug }: Props) {
  const { user } = useAuth()
  const events = getEventsByRegion()
  const region = getEventRegion(countrySlug)
  const isLatam = region === "latam"
  const isSpanish = locale === "es"
  const isFrench = locale === "fr"

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEventTitle, setSelectedEventTitle] = useState("")

  const t = {
    heading: isSpanish
      ? "Próximos Eventos"
      : isFrench
        ? "Événements à Venir"
        : "Upcoming Events",
    noEvents: isSpanish
      ? "No hay eventos próximos para tu región."
      : isFrench
        ? "Aucun événement à venir pour votre région."
        : "No upcoming events for your region.",
    register: isSpanish
      ? "Regístrate Ahora"
      : isFrench
        ? "S'inscrire Maintenant"
        : "Register Now",
    joinNow: isSpanish
      ? "Unirse Ahora"
      : isFrench
        ? "Rejoindre Maintenant"
        : "Join Now",
  }

  // Extract user email and name if available
  const userEmail = user?.email ?? ""
  // gotrue-js stores extra metadata in user_metadata
  const meta = (user as { user_metadata?: { full_name?: string; first_name?: string; last_name?: string } } | null)
    ?.user_metadata ?? {}
  const initialFirstName = meta.first_name ?? (meta.full_name?.split(" ")[0] ?? "")
  const initialLastName = meta.last_name ?? (meta.full_name?.split(" ").slice(1).join(" ") ?? "")

  const handleRegister = (eventTitle: string) => {
    setSelectedEventTitle(eventTitle)
    setModalOpen(true)
  }

  const handleJoinDirect = (joinUrl: string) => {
    window.open(joinUrl, "_blank", "noopener,noreferrer")
  }

  if (events.length === 0) {
    return (
      <div className="text-center text-slate-400 py-12">{t.noEvents}</div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="text-center mb-6">
        <h2 className="section-title">{t.heading}</h2>
      </div>

      {events.map((event) => {
        const desc =
          locale === "es"
            ? event.description_es
            : locale === "fr"
              ? event.description_fr
              : event.description_en

        const timezones = isLatam ? event.latamTimezones : event.timezones
        const joinUrl = isLatam ? event.latamZoomUrl : event.registerUrl
        const displayTitle = isLatam
          ? "CLASE MAGISTRAL SOBRE EL VERDADERO LEGADO"
          : event.title

        return (
          <motion.article
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 max-w-3xl mx-auto"
          >
            {/* Event flyer image */}
            <div className="relative w-full bg-white/5 flex items-center justify-center p-4">
              <img
                src={isLatam && event.latamImage ? event.latamImage : event.image}
                alt={displayTitle}
                className="max-w-full max-h-[500px] w-auto h-auto object-contain"
              />
            </div>

            <div className="p-5 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {displayTitle}
              </h3>
              <p className="text-[#00a896] font-semibold text-base mb-5">
                {event.date}
              </p>

              {/* Timezone grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 p-4 rounded-xl bg-white/5 border border-white/5">
                {timezones.map((tz) => (
                  <div key={tz.region} className="text-sm text-slate-300">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-0.5">
                      {tz.region}
                    </span>
                    <span className="font-bold text-white">{tz.time}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="whitespace-pre-line text-slate-300 text-sm leading-relaxed mb-6">
                {desc}
              </div>

              {/* CTA buttons — authenticated users skip the "first time?" prompt */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={() => handleRegister(event.title)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center px-8 py-3 rounded-xl font-bold text-white text-base transition min-h-12"
                  style={{ background: "linear-gradient(135deg, #00a896, #00c4ae)" }}
                >
                  {t.register}
                </motion.button>
                <motion.button
                  onClick={() => handleJoinDirect(joinUrl)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center px-8 py-3 rounded-xl font-bold text-white text-base border border-white/30 hover:border-white/50 transition bg-white/5 min-h-12"
                >
                  {t.joinNow}
                </motion.button>
              </div>
            </div>
          </motion.article>
        )
      })}

      <EventsLeadCaptureModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
        region={region}
        eventTitle={selectedEventTitle}
        isSpanish={isSpanish}
        initialEmail={userEmail}
        initialFirstName={initialFirstName}
        initialLastName={initialLastName}
      />
    </div>
  )
}
