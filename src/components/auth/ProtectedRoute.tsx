import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../components/auth/AuthProvider'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-8 rounded-full border-4 border-navy-600 border-t-transparent animate-spin" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />
  }

  return <>{children}</>
}
