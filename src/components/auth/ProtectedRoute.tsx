import type { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface Props {
  children: ReactElement
}

export function ProtectedRoute({ children }: Props) {
  const location = useLocation()
  const user = window.netlifyIdentity?.currentUser()

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}

