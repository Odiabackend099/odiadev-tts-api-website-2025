import { useState, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/AuthProvider'
import { updateUserProfile, updateUserAvatar } from '../../lib/settings'

export function ProfileSettings() {
  const { user, profile } = useAuth()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    company: profile?.company || '',
    role: profile?.role || '',
  })

  const updateProfileMutation = useMutation({
    mutationFn: (updates: typeof formData) => 
      updateUserProfile(user!.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  const updateAvatarMutation = useMutation({
    mutationFn: (file: File) => updateUserAvatar(user!.id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate(formData)
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateAvatarMutation.mutate(file)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-navy-900 mb-6">
        Profile Settings
      </h3>

      <div className="flex items-start space-x-6 mb-6">
        <div className="flex-shrink-0">
          <div className="relative">
            <button
              type="button"
              onClick={handleAvatarClick}
              className="relative block h-24 w-24 rounded-full overflow-hidden bg-navy-100 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || 'Avatar'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-navy-200">
                  <span className="text-2xl font-medium text-navy-600">
                    {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-sm">Change</span>
              </div>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          {updateAvatarMutation.isLoading && (
            <p className="mt-2 text-sm text-navy-500">Uploading...</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-navy-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user?.email || ''}
              disabled
              className="mt-1 block w-full rounded-md border-navy-300 bg-navy-50 shadow-sm focus:border-gold-500 focus:ring-gold-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-navy-700">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-navy-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-navy-700">
              Company
            </label>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="mt-1 block w-full rounded-md border-navy-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-navy-700">
              Role
            </label>
            <input
              type="text"
              id="role"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="mt-1 block w-full rounded-md border-navy-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateProfileMutation.isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navy-600 hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 disabled:opacity-50"
            >
              {updateProfileMutation.isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {updateProfileMutation.isError && (
            <div className="mt-4 p-3 rounded-md bg-red-50 text-red-800">
              Error saving changes. Please try again.
            </div>
          )}

          {updateProfileMutation.isSuccess && (
            <div className="mt-4 p-3 rounded-md bg-green-50 text-green-800">
              Profile updated successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
