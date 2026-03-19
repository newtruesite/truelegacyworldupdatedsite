import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useState } from 'react'

type EventsLeadCaptureContextValue = {
  openEventsModal: () => void
  closeEventsModal: () => void
  isOpen: boolean
}

const Context = createContext<EventsLeadCaptureContextValue | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useEventsLeadCapture() {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('useEventsLeadCapture must be used within EventsLeadCaptureProvider')
  return ctx
}

export function EventsLeadCaptureProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openEventsModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeEventsModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <Context.Provider value={{ openEventsModal, closeEventsModal, isOpen }}>
      {children}
    </Context.Provider>
  )
}
