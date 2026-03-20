/**
 * Opens a PDF in a new tab. No login required — training resources are open to all.
 */
export function openGatedPDF(pdfUrl: string): void {
  if (typeof window === 'undefined') return
  window.open(pdfUrl, '_blank', 'noopener,noreferrer')
}

/** @deprecated No longer used; PDFs are open. */
export function getPendingPdf(): string | null {
  return null
}
