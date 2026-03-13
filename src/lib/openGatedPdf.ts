const PENDING_PDF_KEY = 'pending_pdf'
const PENDING_PDF_NAME_KEY = 'pending_pdf_name'

/**
 * Opens a PDF if user is logged in (Netlify Identity).
 * If not logged in, stores the PDF URL and redirects to login.
 */
export function openGatedPDF(pdfUrl: string, pdfName?: string): void {
  if (typeof window === 'undefined') return
  const user = window.netlifyIdentity?.currentUser()
  if (user) {
    window.open(pdfUrl, '_blank')
  } else {
    try {
      sessionStorage.setItem(PENDING_PDF_KEY, pdfUrl)
      if (pdfName) sessionStorage.setItem(PENDING_PDF_NAME_KEY, pdfName)
    } catch {
      /* ignore */
    }
    const params = new URLSearchParams({ redirect: 'pdf', pdf: pdfUrl })
    window.location.href = `/login?${params.toString()}`
  }
}

export function getPendingPdf(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const url = sessionStorage.getItem(PENDING_PDF_KEY)
    if (url) {
      sessionStorage.removeItem(PENDING_PDF_KEY)
      sessionStorage.removeItem(PENDING_PDF_NAME_KEY)
      return url
    }
  } catch {
    /* ignore */
  }
  return null
}
