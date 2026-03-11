type AnalyticsPayload = Record<string, unknown>

declare global {
  interface Window {
    tlAnalytics?: {
      trackPageView?: (path: string) => void
      trackEvent?: (name: string, payload?: AnalyticsPayload) => void
    }
    // Optional Google Tag Manager / Analytics data layer
    dataLayer?: Array<unknown>
  }
}

function safeConsoleInfo(...args: unknown[]) {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.info('[analytics]', ...args)
  }
}

export function trackPageView(path: string) {
  try {
    if (typeof window === 'undefined') return

    // Custom hook for future integrations (e.g. GA4, Plausible)
    if (window.tlAnalytics?.trackPageView) {
      window.tlAnalytics.trackPageView(path)
    }

    // Optional GTM/GA4 via dataLayer if you add it later
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'page_view',
        page_path: path,
      })
    }

    safeConsoleInfo('page_view', { path })
  } catch {
    // Fail silently — analytics must never break the app
  }
}

export function trackEvent(name: string, payload?: AnalyticsPayload) {
  try {
    if (typeof window === 'undefined') return

    if (window.tlAnalytics?.trackEvent) {
      window.tlAnalytics.trackEvent(name, payload)
    }

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: name,
        ...payload,
      })
    }

    safeConsoleInfo('event', { name, payload })
  } catch {
    // Do nothing on analytics errors
  }
}

