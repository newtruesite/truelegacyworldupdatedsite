import { PdfLeadCaptureModal } from '@/components/ui/PdfLeadCaptureModal'
import { COUNTRIES } from '@/lib/countries'
import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useState } from 'react'

export type ProductInterest = 'emguarde' | 'kangen' | 'both'

type PdfLeadCaptureContextValue = {
  openModal: (pdfUrl: string, productPreset?: ProductInterest) => void
}

const Context = createContext<PdfLeadCaptureContextValue | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function usePdfLeadCapture() {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('usePdfLeadCapture must be used within PdfLeadCaptureProvider')
  return ctx
}

const COUNTRY_OPTIONS = COUNTRIES.map((c) => ({ value: c.slug, label: c.name }))

export function PdfLeadCaptureProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  const [productPreset, setProductPreset] = useState<ProductInterest | undefined>()

  const openModal = useCallback((url: string, preset?: ProductInterest) => {
    const alreadySubmitted = typeof localStorage !== 'undefined' && localStorage.getItem('tl_pdf_access')
    if (alreadySubmitted) {
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }
    setPdfUrl(url)
    setProductPreset(preset)
    setOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setOpen(false)
    setPdfUrl('')
    setProductPreset(undefined)
  }, [])

  return (
    <Context.Provider value={{ openModal }}>
      {children}
      <PdfLeadCaptureModal
        isOpen={open}
        onClose={closeModal}
        pdfUrl={pdfUrl}
        productPreset={productPreset}
        countryOptions={COUNTRY_OPTIONS}
      />
    </Context.Provider>
  )
}
