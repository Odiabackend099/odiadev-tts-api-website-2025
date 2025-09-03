import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/AuthProvider'
import { getNotificationPreferences, updateNotificationPreferences } from '../../lib/settings'

const NOTIFICATION_TYPES = [
  'New Lead',
  'Lead Status Update',
  'New Conversation',
  'New Intake Form',
  'Qualification Result',
] as const

export function NotificationSettings() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isSaving, setIsSaving] = useState(false)

  const { data: preferencesData, isLoading } = useQuery({
    queryKey: ['notification-preferences', user?.id],
    queryFn: () => getNotificationPreferences(user!.id),
    enabled: !!user,
  })

  const [preferences, setPreferences] = useState({
    email_notifications: preferencesData?.preferences?.email_notifications ?? true,
    web_notifications: preferencesData?.preferences?.web_notifications ?? true,
    notification_types: preferencesData?.preferences?.notification_types ?? NOTIFICATION_TYPES,
  })

  const updatePreferencesMutation = useMutation({
    mutationFn: (newPreferences: typeof preferences) =>
      updateNotificationPreferences(user!.id, newPreferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] })
      setIsSaving(false)
    },
    onError: () => {
      setIsSaving(false)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    updatePreferencesMutation.mutate(preferences)
  }

  const toggleNotificationType = (type: typeof NOTIFICATION_TYPES[number]) => {
    setPreferences(prev => ({
      ...prev,
      notification_types: prev.notification_types.includes(type)
        ? prev.notification_types.filter(t => t !== type)
        : [...prev.notification_types, type],
    }))
  }

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-navy-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-8 bg-navy-200 rounded"></div>
            <div className="h-8 bg-navy-200 rounded"></div>
            <div className="h-8 bg-navy-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-navy-900 mb-6">
        Notification Settings
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-navy-900">Email Notifications</h4>
            <p className="text-sm text-navy-500">Receive updates via email</p>
          </div>
          <button
            type="button"
            onClick={() => setPreferences(prev => ({
              ...prev,
              email_notifications: !prev.email_notifications,
            }))}
            className={`
              relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full 
              transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-navy-500
              ${preferences.email_notifications ? 'bg-navy-600' : 'bg-navy-200'}
            `}
          >
            <span className={`
              pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform 
              ring-0 transition ease-in-out duration-200
              ${preferences.email_notifications ? 'translate-x-5' : 'translate-x-0'}
            `} />
          </button>
        </div>

        {/* Web Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-navy-900">Web Notifications</h4>
            <p className="text-sm text-navy-500">Receive updates in the browser</p>
          </div>
          <button
            type="button"
            onClick={() => setPreferences(prev => ({
              ...prev,
              web_notifications: !prev.web_notifications,
            }))}
            className={`
              relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full 
              transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-navy-500
              ${preferences.web_notifications ? 'bg-navy-600' : 'bg-navy-200'}
            `}
          >
            <span className={`
              pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform 
              ring-0 transition ease-in-out duration-200
              ${preferences.web_notifications ? 'translate-x-5' : 'translate-x-0'}
            `} />
          </button>
        </div>

        {/* Notification Types */}
        <div>
          <h4 className="text-sm font-medium text-navy-900 mb-3">Notification Types</h4>
          <div className="space-y-3">
            {NOTIFICATION_TYPES.map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.notification_types.includes(type)}
                  onChange={() => toggleNotificationType(type)}
                  className="h-4 w-4 text-navy-600 focus:ring-navy-500 border-navy-300 rounded"
                />
                <span className="ml-3 text-sm text-navy-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving || updatePreferencesMutation.isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navy-600 hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>

        {updatePreferencesMutation.isError && (
          <div className="mt-4 p-3 rounded-md bg-red-50 text-red-800">
            Error saving preferences. Please try again.
          </div>
        )}

        {updatePreferencesMutation.isSuccess && (
          <div className="mt-4 p-3 rounded-md bg-green-50 text-green-800">
            Preferences updated successfully!
          </div>
        )}
      </form>
    </div>
  )
}
