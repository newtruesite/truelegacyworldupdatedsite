import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const FORM_NAME = "events-lead-capture";
const SUBMIT_COOLDOWN_MS = 30_000;

function sanitize(str: string): string {
  return str
    .trim()
    .replace(/<[^>]*>/g, "")
    .slice(0, 200);
}

function canSubmit(): boolean {
  if (typeof window === "undefined") return true;
  const last = localStorage.getItem("tl_last_events_submit");
  if (!last) return true;
  return Date.now() - parseInt(last, 10) > SUBMIT_COOLDOWN_MS;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  region: string;
  eventTitle: string;
  isSpanish: boolean;
};

export function EventsLeadCaptureModal({
  isOpen,
  onClose,
  onSuccess,
  region,
  eventTitle,
  isSpanish,
}: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    botField: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        botField: "",
      });
      setSubmitted(false);
    }
  }, [isOpen]);

  const t = {
    heading: isSpanish ? "Regístrate para el Evento" : "Sign Up for the Event",
    firstName: isSpanish ? "Nombre" : "First Name",
    lastName: isSpanish ? "Apellido" : "Last Name",
    email: isSpanish ? "Correo Electrónico" : "Email",
    phone: isSpanish ? "Teléfono" : "Phone",
    submit: isSpanish ? "Regístrate Ahora" : "Sign Up Now",
    thankYou: isSpanish
      ? "¡Gracias por registrarte! En un momento verás el enlace para unirse."
      : "Thank you for signing up! Your join link will appear shortly.",
    required: isSpanish ? "Requerido" : "Required",
    invalidEmail: isSpanish ? "Correo no válido" : "Invalid email",
  };

  const validate = useCallback(() => {
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = t.required;
    if (!form.lastName.trim()) next.lastName = t.required;
    if (!form.email.trim()) next.email = t.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = t.invalidEmail;
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [form.firstName, form.lastName, form.email, t]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit()) {
        setErrors({
          email: isSpanish
            ? "Espere unos segundos antes de enviar de nuevo."
            : "Please wait before submitting again.",
        });
        return;
      }
      if (!validate()) return;
      setSubmitting(true);
      setErrors({});

      const firstName = sanitize(form.firstName);
      const lastName = sanitize(form.lastName);
      const email = sanitize(form.email);
      const phone = sanitize(form.phone);

      const formData = new FormData();
      formData.append("form-name", FORM_NAME);
      formData.append("first-name", firstName);
      formData.append("last-name", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("region", region);
      formData.append("event_title", eventTitle);
      if (form.botField) formData.append("bot-field", form.botField);

      try {
        const params = new URLSearchParams();
        formData.forEach((value, key) => params.append(key, value.toString()));
        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        });
        if (!res.ok) throw new Error("Submit failed");
        try {
          localStorage.setItem("tl_last_events_submit", Date.now().toString());
        } catch {
          /* ignore */
        }
        setSubmitted(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } catch {
        setErrors({
          email: isSpanish
            ? "Error al enviar. Intenta de nuevo."
            : "Submit failed. Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [form, validate, region, eventTitle, isSpanish, onSuccess],
  );

  const handleChange = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative z-50 w-full max-w-md bg-[#0a1428] rounded-2xl p-6 border border-white/10 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {submitted ? (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mb-4 w-12 h-12 mx-auto rounded-full bg-[#00a896]/20 flex items-center justify-center"
              >
                <span className="text-2xl">✓</span>
              </motion.div>
              <h3 className="text-lg font-bold text-white mb-2">
                {isSpanish ? "¡Gracias!" : "Thank You!"}
              </h3>
              <p className="text-slate-400">{t.thankYou}</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-6">
                {t.heading}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t.firstName}
                  </label>
                  <input
                    type="text"
                    name="first-name"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg bg-white/10 border ${
                      errors.firstName ? "border-red-500" : "border-white/20"
                    } text-white placeholder-slate-500 focus:outline-none focus:border-[#00a896] transition`}
                    disabled={submitting}
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t.lastName}
                  </label>
                  <input
                    type="text"
                    name="last-name"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg bg-white/10 border ${
                      errors.lastName ? "border-red-500" : "border-white/20"
                    } text-white placeholder-slate-500 focus:outline-none focus:border-[#00a896] transition`}
                    disabled={submitting}
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg bg-white/10 border ${
                      errors.email ? "border-red-500" : "border-white/20"
                    } text-white placeholder-slate-500 focus:outline-none focus:border-[#00a896] transition`}
                    disabled={submitting}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t.phone}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-[#00a896] transition"
                    disabled={submitting}
                  />
                </div>

                <input
                  type="hidden"
                  name="bot-field"
                  value={form.botField}
                  onChange={(e) => handleChange("botField", e.target.value)}
                />

                <motion.button
                  type="submit"
                  disabled={submitting || submitted}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center py-3 mt-6 rounded-lg font-bold text-white transition disabled:opacity-50 min-h-[48px]"
                  style={{
                    background:
                      submitting || submitted
                        ? "#666"
                        : "linear-gradient(135deg, #00a896, #00c4ae)",
                  }}
                >
                  {submitting
                    ? isSpanish
                      ? "Enviando..."
                      : "Sending..."
                    : t.submit}
                </motion.button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
