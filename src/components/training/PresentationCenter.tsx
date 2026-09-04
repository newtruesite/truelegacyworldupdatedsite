import React from "react";
import { motion } from "framer-motion";
import {
  Presentation,
  Download,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Clock,
} from "lucide-react";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { t } from "@/lib/translations";
import { trackEvent } from "@/lib/analytics";
import {
  OFFICIAL_PRESENTATIONS,
  type PresentationItem,
} from "@/config/presentationCenter";

interface PresentationCenterProps {
  items?: PresentationItem[];
  className?: string;
}

export const PresentationCenter: React.FC<PresentationCenterProps> = ({
  items = OFFICIAL_PRESENTATIONS,
  className = "",
}) => {
  const { locale } = useLocaleContext();
  const currentLang = (locale as keyof typeof t) in t ? (locale as keyof typeof t) : "en";
  const trainingCopy = t[currentLang]?.training;
  const pcCopy = trainingCopy?.presentationCenter || {
    eyebrow: "TRUE LEGACY LEADER RESOURCE",
    title: "Leader Presentation Center",
    subtitle: "Everything you need to present with confidence.",
    supportingCopy:
      "Access the official True Legacy presentations for prospect calls, Zoom presentations, home meetings, team events, and one-on-one conversations.",
    badgeOfficial: "OFFICIAL",
    badgeTrueLegacy: "TRUE LEGACY",
    badgeCustomizable: "CUSTOMIZABLE",
    badgeUpdated: "UPDATED",
    openPresentation: "Open Presentation",
    downloadPdf: "Download PDF",
    downloadPdfUnavailable: "PDF Download Coming Soon",
    openCanva: "Open in Canva",
    useCanvaTemplate: "Use Canva Template",
    versionLabel: "Version",
    updatedLabel: "Updated",
  };

  const handleOpenPresentation = (item: PresentationItem) => {
    if (!item.presentationUrl) return;
    trackEvent("presentation_opened", {
      id: item.id,
      title: item.title,
      language: item.language || locale,
    });
    window.open(item.presentationUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownloadPdf = (item: PresentationItem) => {
    if (!item.pdfUrl) return;
    trackEvent("presentation_pdf_downloaded", {
      id: item.id,
      title: item.title,
      language: item.language || locale,
    });
    window.open(item.pdfUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenCanva = (item: PresentationItem) => {
    if (!item.canvaUrl) return;
    trackEvent("presentation_canva_opened", {
      id: item.id,
      title: item.title,
      language: item.language || locale,
    });
    window.open(item.canvaUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      className={`mb-12 rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-black/60 via-slate-950/40 to-amber-950/10 backdrop-blur-xl p-5 sm:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.4)] ${className}`}
    >
      {/* SECTION HEADER — GOLD FEATURED LEADER RESOURCE IDENTITY */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-tl-gold shadow-lg shadow-amber-500/10">
            <Presentation className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-tl-gold">
              {pcCopy.eyebrow}
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black text-white">
              {pcCopy.title}
            </h2>
            <p className="mt-1 text-sm font-semibold text-amber-300/90">
              {pcCopy.subtitle}
            </p>
            <p className="mt-1.5 text-xs sm:text-sm text-[#cccccc] max-w-3xl leading-relaxed">
              {pcCopy.supportingCopy}
            </p>
          </div>
        </div>
      </div>

      {/* PRESENTATIONS CARDS GRID */}
      <div className="mt-7 space-y-6">
        {items.map((item) => {
          const isPdfConfigured = Boolean(item.pdfUrl && item.pdfUrl.trim().length > 0);
          const isCanvaConfigured = Boolean(item.canvaUrl && item.canvaUrl.trim().length > 0);
          const isPresentationConfigured = Boolean(
            item.presentationUrl && item.presentationUrl.trim().length > 0
          );

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-white/[0.04] via-black/60 to-slate-950 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-amber-400/40 hover:shadow-[0_0_40px_rgba(245,166,35,0.12)]"
            >
              <div className="grid gap-6 lg:grid-cols-[340px_1fr] items-center">
                {/* THUMBNAIL / COVER AREA */}
                {item.thumbnail ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-lg">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    
                    {/* Floating Overlay Badge on Thumbnail */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {item.isOfficial && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/40 bg-black/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-tl-gold backdrop-blur-md">
                          <ShieldCheck className="h-3 w-3 text-tl-gold" />
                          {pcCopy.badgeOfficial}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-md border border-cyan-400/40 bg-black/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#2997ff] backdrop-blur-md">
                        {pcCopy.badgeTrueLegacy}
                      </span>
                    </div>

                    {item.version && (
                      <div className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-medium text-[#cccccc] backdrop-blur-md">
                        {pcCopy.versionLabel} {item.version}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Fallback Banner Graphic if no image */
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 to-slate-950 p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-black uppercase text-tl-gold">
                        <ShieldCheck className="h-3 w-3" />
                        {pcCopy.badgeOfficial}
                      </span>
                      <span className="text-[10px] font-bold text-cyan-400">
                        {pcCopy.badgeTrueLegacy}
                      </span>
                    </div>
                    <Presentation className="h-12 w-12 text-tl-gold/60 self-center" />
                    <div className="text-[10px] text-[#cccccc] text-right">
                      {item.version && `${pcCopy.versionLabel} ${item.version}`}
                    </div>
                  </div>
                )}

                {/* CONTENT & ACTIONS AREA */}
                <div className="flex flex-col justify-between h-full space-y-4">
                  <div>
                    {/* Header Badges & Version Meta */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.isOfficial && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-tl-gold">
                            <ShieldCheck className="h-3 w-3" />
                            {pcCopy.badgeOfficial}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#2997ff]">
                          {pcCopy.badgeTrueLegacy}
                        </span>
                        {item.isCustomizable && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-purple-400/30 bg-purple-400/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-purple-300">
                            <Sparkles className="h-3 w-3" />
                            {pcCopy.badgeCustomizable}
                          </span>
                        )}
                        {item.isNew && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                            {pcCopy.badgeUpdated}
                          </span>
                        )}
                      </div>

                      {(item.version || item.updatedAt) && (
                        <div className="flex items-center gap-2 text-[11px] text-[#86868b]">
                          <Clock className="h-3 w-3 text-tl-gold" />
                          <span>
                            {item.version && `${pcCopy.versionLabel} ${item.version}`}
                            {item.version && item.updatedAt && " · "}
                            {item.updatedAt && `${pcCopy.updatedLabel} ${item.updatedAt}`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-200 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-[#cccccc] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* THREE PRIMARY ACTIONS — STRICT SEMANTIC HIERARCHY */}
                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* PRIMARY ACTION: TRUE LEGACY BLUE (Action / Primary) */}
                    <button
                      type="button"
                      disabled={!isPresentationConfigured}
                      onClick={() => handleOpenPresentation(item)}
                      className={`inline-flex min-h-11 items-center justify-center gap-2.5 rounded-xl px-5 py-2.5 font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg cursor-pointer active:scale-95 w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-[#2997ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060b1e] focus-visible:outline-none ${
                        isPresentationConfigured
                          ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 shadow-cyan-500/25 hover:-translate-y-0.5"
                          : "bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed"
                      }`}
                    >
                      <Presentation className="h-4 w-4 shrink-0" />
                      <span>{pcCopy.openPresentation}</span>
                    </button>

                    {/* SECONDARY ACTION: Download PDF (Neutral Glass / Disabled Gray) */}
                    <button
                      type="button"
                      disabled={!isPdfConfigured}
                      onClick={() => handleDownloadPdf(item)}
                      title={!isPdfConfigured ? pcCopy.downloadPdfUnavailable : ""}
                      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-bold text-xs sm:text-sm transition-all duration-200 border w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-[#2997ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060b1e] focus-visible:outline-none ${
                        isPdfConfigured
                          ? "bg-white/10 hover:bg-white/15 text-white border-white/20 hover:border-white/30 shadow-md cursor-pointer hover:-translate-y-0.5 active:scale-95"
                          : "bg-white/[0.03] text-[#86868b] border-white/10 cursor-not-allowed"
                      }`}
                    >
                      <Download className="h-4 w-4 shrink-0" />
                      <span>
                        {isPdfConfigured
                          ? pcCopy.downloadPdf
                          : pcCopy.downloadPdfUnavailable}
                      </span>
                    </button>

                    {/* TERTIARY ACTION: Open in Canva / Use Canva Template (Action Link) */}
                    {isCanvaConfigured && (
                      <button
                        type="button"
                        onClick={() => handleOpenCanva(item)}
                        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#2997ff] hover:text-cyan-300 hover:bg-white/5 transition-colors cursor-pointer w-full sm:w-auto sm:ml-auto focus-visible:ring-2 focus-visible:ring-[#2997ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060b1e] focus-visible:outline-none"
                      >
                        <span>
                          {item.isCustomizable
                            ? pcCopy.useCanvaTemplate
                            : pcCopy.openCanva}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[#2997ff] group-hover:text-cyan-300" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
