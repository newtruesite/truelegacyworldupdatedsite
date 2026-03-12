export {}

declare global {
  interface NetlifyIdentityUser {
    id: string
    email?: string
    app_metadata?: Record<string, unknown>
    user_metadata?: Record<string, unknown>
    token?: {
      access_token?: string
    }
  }

  interface NetlifyIdentity {
    init(options?: Record<string, unknown>): void
    on(event: 'init' | 'login' | 'logout' | 'error', cb: (...args: any[]) => void): void
    off?(event: 'init' | 'login' | 'logout' | 'error', cb?: (...args: any[]) => void): void
    open(action?: 'login' | 'signup' | 'recovery'): void
    close?(): void
    logout(): void
    currentUser(): NetlifyIdentityUser | null
  }

  interface Window {
    netlifyIdentity?: NetlifyIdentity
  }
}

