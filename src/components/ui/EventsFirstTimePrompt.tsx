import { motion } from "framer-motion";

type Props = {
  onYes: () => void;
  onNo: (joinUrl: string) => void;
  joinUrl: string;
  isSpanish: boolean;
};

export function EventsFirstTimePrompt({
  onYes,
  onNo,
  joinUrl,
  isSpanish,
}: Props) {
  const t = {
    title: isSpanish ? "¿Es tu primera vez?" : "First time joining?",
    subtitle: isSpanish
      ? "Queremos conocerte antes de que entres al evento."
      : "We'd love to know you before you join.",
    yes: isSpanish ? "Sí, quiero registrarme" : "Yes, sign me up",
    no: isSpanish ? "No, llévame al evento" : "No, take me now",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 sm:p-8 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          {t.title}
        </h3>
        <p className="text-slate-400 text-base">{t.subtitle}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          onClick={onYes}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold text-white text-base transition"
          style={{
            background: "linear-gradient(135deg, #00a896, #00c4ae)",
          }}
        >
          {t.yes}
        </motion.button>

        <motion.button
          onClick={() => onNo(joinUrl)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold text-white text-base border border-white/30 hover:border-white/50 transition bg-white/5"
        >
          {t.no}
        </motion.button>
      </div>
    </motion.div>
  );
}
