import type { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface Props {
  children: ReactElement
}

export function ProtectedRoute({ children }: Props) {
  const location = useLocation()

  if (typeof window === 'undefined') {
    return null
  }

  const user = window.netlifyIdentity?.currentUser()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

