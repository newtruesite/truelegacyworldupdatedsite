import { motion } from "framer-motion";

type Props = {
  onYes: () => void;
  onNo: (joinUrl: string) => void;
  joinUrl: string;
  locale: string;
};

const PROMPT_COPY: Record<string, { title: string; subtitle: string; yes: string; no: string }> = {
  es: {
    title: "¿Es tu primera vez?",
    subtitle: "Queremos conocerte antes de que entres al evento.",
    yes: "Sí, quiero registrarme",
    no: "No, llévame al evento",
  },
  fr: {
    title: "Première fois ?",
    subtitle: "Nous aimerions vous connaître avant que vous rejoigniez.",
    yes: "Oui, inscrivez-moi",
    no: "Non, emmenez-moi maintenant",
  },
  pt: {
    title: "É sua primeira vez?",
    subtitle: "Adoraríamos conhecê-lo antes de você entrar no evento.",
    yes: "Sim, me inscreva",
    no: "Não, leve-me agora",
  },
  en: {
    title: "First time joining?",
    subtitle: "We'd love to know you before you join.",
    yes: "Yes, sign me up",
    no: "No, take me now",
  },
};

export function EventsFirstTimePrompt({
  onYes,
  onNo,
  joinUrl,
  locale,
}: Props) {
  const copy = PROMPT_COPY[locale] ?? PROMPT_COPY.en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 sm:p-8 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          {copy.title}
        </h3>
        <p className="text-[#cccccc] text-base">{copy.subtitle}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          onClick={onYes}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 sm:flex-none flex items-center justify-center px-8 py-3 rounded-xl font-bold text-white text-base transition min-h-12"
          style={{
            background: "linear-gradient(135deg, #00a896, #00c4ae)",
          }}
        >
          {copy.yes}
        </motion.button>

        <motion.button
          onClick={() => onNo(joinUrl)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 sm:flex-none flex items-center justify-center px-8 py-3 rounded-xl font-bold text-white text-base border border-white/30 hover:border-white/50 transition bg-white/5 min-h-12"
        >
          {copy.no}
        </motion.button>
      </div>
    </motion.div>
  );
}
