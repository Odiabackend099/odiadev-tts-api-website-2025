import { createBrowserRouter } from 'react-router-dom'
import { Home } from '../pages/Home'
import { MagicLinkSignIn } from '../components/auth/MagicLinkSignIn'
import { AuthCallback } from '../pages/auth/AuthCallback'
import { Dashboard } from '../pages/dashboard/Dashboard'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/auth/signin',
    element: <MagicLinkSignIn />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
])
