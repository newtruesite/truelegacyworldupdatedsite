import { Download, RefreshCw, Share, Smartphone, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISSED_KEY = 'true-legacy-install-dismissed'

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
}

export function AppInstallPrompt() {
  const { pathname } = useLocation()
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const [showIosHelp, setShowIosHelp] = useState(false)
  const [updateReady, setUpdateReady] = useState<ServiceWorker | null>(null)
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISSED_KEY) === '1')

  const isIos = useMemo(() => /iphone|ipad|ipod/i.test(navigator.userAgent), [])
  const isAppRoute = pathname.startsWith('/crm') || pathname.includes('/training')

  useEffect(() => {
    setInstalled(isStandalone())
    const capturePrompt = (event: Event) => {
      event.preventDefault()
      setPromptEvent(event as InstallPromptEvent)
    }
    const markInstalled = () => setInstalled(true)
    window.addEventListener('beforeinstallprompt', capturePrompt)
    window.addEventListener('appinstalled', markInstalled)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) setUpdateReady(registration.waiting)
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing
          worker?.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) setUpdateReady(worker)
          })
        })
      }).catch(() => undefined)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', capturePrompt)
      window.removeEventListener('appinstalled', markInstalled)
    }
  }, [])

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const reload = () => window.location.reload()
    navigator.serviceWorker.addEventListener('controllerchange', reload)
    return () => navigator.serviceWorker.removeEventListener('controllerchange', reload)
  }, [])

  const install = async () => {
    if (promptEvent) {
      await promptEvent.prompt()
      const result = await promptEvent.userChoice
      if (result.outcome === 'accepted') setInstalled(true)
      setPromptEvent(null)
    } else if (isIos) setShowIosHelp(true)
  }

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1')
    setDismissed(true)
  }

  if (updateReady) return <aside className="tl-app-prompt" aria-live="polite"><RefreshCw aria-hidden="true" /><div><strong>True Legacy update ready</strong><span>Reload to use the latest version.</span></div><button onClick={() => updateReady.postMessage({ type: 'SKIP_WAITING' })}>Update</button></aside>
  if (!isAppRoute || installed || dismissed || (!promptEvent && !isIos)) return null

  return (
    <aside className="tl-app-prompt" aria-label="Install True Legacy app">
      <div className="tl-app-prompt__icon"><Smartphone aria-hidden="true" /></div>
      <div><strong>Install True Legacy</strong><span>Open your dashboard and training from your home screen.</span></div>
      <button onClick={install}><Download aria-hidden="true" /> Install</button>
      <button className="tl-app-prompt__close" onClick={dismiss} aria-label="Dismiss install invitation"><X aria-hidden="true" /></button>
      {showIosHelp && <div className="tl-app-prompt__ios"><Share aria-hidden="true" /><span>In Safari, tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.</span></div>}
    </aside>
  )
}
