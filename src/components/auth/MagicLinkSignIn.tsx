import { useState } from 'react'
import { signIn } from '../../lib/supabase'

export function MagicLinkSignIn() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const { error } = await signIn(email)
    
    if (error) {
      setMessage('Error sending magic link. Please try again.')
      console.error('Error:', error.message)
    } else {
      setMessage('Check your email for the magic link!')
      setEmail('')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-cormorant-garamond font-bold text-navy-900 mb-6">
        Sign in to ODIADEV
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-navy-700"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-navy-300 rounded-md shadow-sm focus:outline-none focus:ring-gold-500 focus:border-gold-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navy-600 hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : 'Send Magic Link'}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          message.includes('Error') 
            ? 'bg-red-50 text-red-800' 
            : 'bg-green-50 text-green-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
}
