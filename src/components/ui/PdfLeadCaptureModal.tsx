import type { ProductInterest } from "@/contexts/PdfLeadCaptureContext";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const FORM_NAME = "pdf-lead-capture";
const SUBMIT_COOLDOWN_MS = 30_000; // 30 seconds

function sanitize(str: string): string {
  return str
    .trim()
    .replace(/<[^>]*>/g, "")
    .slice(0, 200);
}

function canSubmit(): boolean {
  if (typeof window === "undefined") return true;
  const last = localStorage.getItem("tl_last_submit");
  if (!last) return true;
  return Date.now() - parseInt(last, 10) > SUBMIT_COOLDOWN_MS;
}

type Option = { value: string; label: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  productPreset?: ProductInterest;
  countryOptions: Option[];
};

const PRODUCT_OPTIONS: {
  value: ProductInterest;
  labelEn: string;
  labelEs: string;
}[] = [
  { value: "emguarde", labelEn: "Emguarde", labelEs: "Emguarde" },
  { value: "kangen", labelEn: "Kangen Water", labelEs: "Agua Kangen" },
  { value: "both", labelEn: "Both", labelEs: "Ambos" },
];

export function PdfLeadCaptureModal({
  isOpen,
  onClose,
  pdfUrl,
  productPreset,
  countryOptions,
}: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    botField: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setForm({
        fullName: "",
        email: "",
        phone: "",
        country: "",
        botField: "",
      });
      setSubmitted(false);
    }
  }, [isOpen, productPreset]);

  const isSpanish =
    typeof navigator !== "undefined" && navigator.language.startsWith("es");
  const t = {
    heading: isSpanish ? "Obtén Tu Guía Gratuita" : "Get Your Free Guide",
    fullName: isSpanish ? "Nombre Completo" : "Full Name",
    email: isSpanish ? "Correo Electrónico" : "Email Address",
    phone: isSpanish ? "Teléfono" : "Phone Number",
    country: isSpanish ? "País" : "Country",
    productInterest: isSpanish
      ? "¿Qué producto te interesa?"
      : "Which product interests you?",
    submit: isSpanish ? "Envíame el PDF" : "Send Me the PDF",
    thankYou: isSpanish
      ? "¡Gracias! Revisa tu correo y tu descarga comenzará en un momento."
      : "Thank you! Check your email and your download will start in a moment.",
    required: isSpanish ? "Requerido" : "Required",
  };

  const validate = useCallback(() => {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = t.required;
    if (!form.email.trim()) next.email = t.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = isSpanish ? "Correo no válido" : "Invalid email";
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [form.fullName, form.email, t, isSpanish]);

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

      const fullName = sanitize(form.fullName);
      const email = sanitize(form.email);
      const phone = sanitize(form.phone);
      const country = sanitize(form.country);

      const formData = new FormData();
      formData.append("form-name", FORM_NAME);
      formData.append("full-name", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("country", country);
      formData.append(
        "pdf_requested",
        pdfUrl ? new URL(pdfUrl).pathname.split("/").pop() || "Resource" : "",
      );
      formData.append("pdf_url", pdfUrl || "");
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
          localStorage.setItem("tl_last_submit", Date.now().toString());
          localStorage.setItem(
            "tl_pdf_access",
            JSON.stringify({ name: fullName, email, ts: Date.now() }),
          );
        } catch {
          /* ignore */
        }
        setSubmitted(true);
        setTimeout(() => {
          if (pdfUrl) window.open(pdfUrl, "_blank");
          setSubmitted(false);
          onClose();
          window.location.href = "/training";
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
    [form, validate, pdfUrl, onClose, isSpanish],
  );

  const handleChange = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative z-10 w-full max-w-md rounded-2xl bg-[#0f172a] border border-white/10 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">{t.heading}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-5">
            {submitted ? (
              <p className="text-slate-300 text-center py-8">{t.thankYou}</p>
            ) : (
              <form
                name={FORM_NAME}
                method="post"
                action="/"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="form-name" value={FORM_NAME} />
                <div hidden>
                  <label>
                    Don’t fill this out if you’re human: <input name="bot-field" value={form.botField} onChange={(e) => handleChange("botField", e.target.value)} />
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      {t.fullName} *
                    </label>
                    <input
                      type="text"
                      name="full-name"
                      value={form.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                      placeholder={t.fullName}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      {t.email} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                      placeholder={t.email}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      {t.phone}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                      placeholder={t.phone}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      {t.country} *
                    </label>
                    <select
                      name="country"
                      value={form.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                    >
                      <option value="">
                        {isSpanish ? "Selecciona" : "Select"}
                      </option>
                      {countryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 w-full min-h-[48px] flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-bold text-white py-3 px-4 transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {submitting
                    ? isSpanish
                      ? "Enviando…"
                      : "Sending…"
                    : t.submit}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
