import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.hash.substring(1)
      )

      if (error) {
        console.error('Error:', error.message)
        navigate('/auth/error')
      } else {
        navigate('/dashboard')
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">
        <div className="h-8 w-8 rounded-full border-4 border-navy-600 border-t-transparent animate-spin" />
      </div>
    </div>
  )
}
