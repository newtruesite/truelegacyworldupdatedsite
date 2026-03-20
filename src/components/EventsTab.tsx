import { EVENTS_FORM_URL, getEventRegion, getEventsByRegion } from "@/lib/events"
import { motion } from "framer-motion"

type Props = {
  locale: string
  countrySlug: string | undefined
}

export function EventsTab({ locale, countrySlug }: Props) {
  const region = getEventRegion(countrySlug)
  const events = getEventsByRegion(region)
  const isLatam = region === "latam"
  const isSpanish = locale === "es"
  const isFrench = locale === "fr"
  const isPortuguese = locale === "pt"

  const handleOpenForm = () => {
    window.open(EVENTS_FORM_URL, '_blank', 'noopener,noreferrer')
  }

  if (events.length === 0) {
    return (
      <div className="text-center text-slate-400 py-12">
        {isSpanish
          ? "No hay eventos próximos para tu región."
          : isFrench
            ? "Aucun événement à venir pour votre région."
            : "No upcoming events for your region."}
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="text-center mb-6">
        <h2 className="section-title">
          {isSpanish ? "Próximos Eventos" : isFrench ? "Événements à Venir" : "Upcoming Events"}
        </h2>
      </div>

      {events.map((event) => {
        const desc =
          locale === "es"
            ? event.description_es
            : locale === "fr"
              ? event.description_fr
              : locale === "pt"
                ? (event.description_pt ?? event.description_en)
                : event.description_en

        const displayTitle =
          locale === "es" && event.title_es
            ? event.title_es
            : locale === "fr" && event.title_fr
              ? event.title_fr
              : locale === "pt" && event.title_pt
                ? event.title_pt
                : event.title

        const displayDate =
          locale === "es" && event.date_es
            ? event.date_es
            : locale === "fr" && event.date_fr
              ? event.date_fr
              : locale === "pt" && event.date_pt
                ? event.date_pt
                : event.date

        const timezones = isLatam ? event.latamTimezones : event.timezones
        const eventImage = isLatam && event.latamImage ? event.latamImage : event.image
        const joinUrl = isLatam ? event.latamZoomUrl : (event.joinUrl ?? event.registerUrl)

        return (
          <motion.article
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 max-w-3xl mx-auto"
          >
            {/* Event flyer image */}
            {eventImage && (
              <div className="relative w-full bg-white/5 flex items-center justify-center p-4">
                <img
                  src={eventImage}
                  alt={displayTitle}
                  className="max-w-full max-h-[500px] w-auto h-auto object-contain"
                />
              </div>
            )}

            <div className="p-5 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {displayTitle}
              </h3>
              <p className="text-[#00a896] font-semibold text-base mb-5">
                {displayDate}
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

              {/* CTA buttons */}
              {event.hasFirstTimePrompt === false ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={() => window.open(joinUrl, '_blank', 'noopener,noreferrer')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center px-8 py-3 rounded-xl font-bold text-white text-base transition min-h-12"
                    style={{ background: "linear-gradient(135deg, #00a896, #00c4ae)" }}
                  >
                    {isSpanish ? "Unirse Ahora" : isFrench ? "Rejoindre Maintenant" : isPortuguese ? "Entrar Agora" : "Join Now"}
                  </motion.button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={handleOpenForm}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center px-8 py-3 rounded-xl font-bold text-white text-base transition min-h-12"
                    style={{ background: "linear-gradient(135deg, #00a896, #00c4ae)" }}
                  >
                    {isSpanish ? "Regístrate Ahora" : isFrench ? "S'inscrire Maintenant" : "Register Now"}
                  </motion.button>
                  <motion.button
                    onClick={handleOpenForm}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center px-8 py-3 rounded-xl font-bold text-white text-base border border-white/30 hover:border-white/50 transition bg-white/5 min-h-12"
                  >
                    {isSpanish ? "Unirse Ahora" : isFrench ? "Rejoindre Maintenant" : "Join Now"}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.article>
        )
      })}

    </div>
  )
}
