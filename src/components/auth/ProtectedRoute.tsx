import type { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface Props {
  children: ReactElement
}

export function ProtectedRoute({ children }: Props) {
  const location = useLocation()
  const { user, loading } = useAuth()

  if (typeof window === 'undefined') {
    return null
  }

  if (loading) {
    return null // or a loading spinner
  }

  if (!user) {
    return <Navigate to="/training" replace state={{ from: location }} />
  }

  return children
}

