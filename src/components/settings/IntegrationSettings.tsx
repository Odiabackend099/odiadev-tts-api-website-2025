import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createWebhook } from '../../lib/automation'
import { supabase } from '../../lib/supabase'

type IntegrationKey = {
  id: string
  name: string
  key: string
  service: 'tts' | 'brain' | 'n8n'
  created_at: string
}

export function IntegrationSettings() {
  const queryClient = useQueryClient()
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    events: [] as string[],
    description: '',
  })

  // Fetch API keys
  const { data: apiKeys, isLoading: isLoadingKeys } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('integration_keys')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as IntegrationKey[]
    },
  })

  // Fetch webhooks
  const { data: webhooks, isLoading: isLoadingWebhooks } = useQuery({
    queryKey: ['webhooks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
  })

  // Create new API key
  const createKeyMutation = useMutation({
    mutationFn: async (service: IntegrationKey['service']) => {
      const key = crypto.randomUUID()
      const { data, error } = await supabase
        .from('integration_keys')
        .insert({
          name: `${service}_key_${new Date().toISOString().split('T')[0]}`,
          key,
          service,
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })

  // Create new webhook
  const createWebhookMutation = useMutation({
    mutationFn: async (webhookData: typeof newWebhook) => {
      const secret = crypto.randomUUID()
      const { webhook, error } = await createWebhook({
        ...webhookData,
        secret,
      })
      if (error) throw error
      return webhook
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] })
      setNewWebhook({ url: '', events: [], description: '' })
    },
  })

  if (isLoadingKeys || isLoadingWebhooks) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-navy-200 rounded-lg"></div>
        <div className="h-40 bg-navy-200 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* API Keys Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-navy-900 mb-4">
          API Keys
        </h3>

        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => createKeyMutation.mutate('tts')}
              className="px-4 py-2 bg-navy-600 text-white rounded-md hover:bg-navy-700"
            >
              Generate TTS Key
            </button>
            <button
              onClick={() => createKeyMutation.mutate('brain')}
              className="px-4 py-2 bg-navy-600 text-white rounded-md hover:bg-navy-700"
            >
              Generate Brain Key
            </button>
            <button
              onClick={() => createKeyMutation.mutate('n8n')}
              className="px-4 py-2 bg-navy-600 text-white rounded-md hover:bg-navy-700"
            >
              Generate n8n Key
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-navy-200">
              <thead className="bg-navy-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                    Key
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-navy-200">
                {apiKeys?.map((key) => (
                  <tr key={key.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-900">
                      {key.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono bg-navy-50 rounded">
                      {key.key}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-500">
                      {key.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-500">
                      {new Date(key.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Webhooks Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-navy-900 mb-4">
          Webhook Configuration
        </h3>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            createWebhookMutation.mutate(newWebhook)
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="webhook-url" className="block text-sm font-medium text-navy-700">
              Webhook URL
            </label>
            <input
              id="webhook-url"
              type="url"
              value={newWebhook.url}
              onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
              required
              className="mt-1 block w-full rounded-md border-navy-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700">
              Events
            </label>
            <div className="mt-2 space-y-2">
              {['new_lead', 'status_change', 'conversation', 'intake_submission'].map((event) => (
                <label key={event} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={newWebhook.events.includes(event)}
                    onChange={(e) => {
                      setNewWebhook(prev => ({
                        ...prev,
                        events: e.target.checked
                          ? [...prev.events, event]
                          : prev.events.filter(e => e !== event),
                      }))
                    }}
                    className="rounded border-navy-300 text-navy-600 focus:ring-navy-500"
                  />
                  <span className="ml-2 text-sm text-navy-700">
                    {event.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="webhook-description" className="block text-sm font-medium text-navy-700">
              Description
            </label>
            <textarea
              id="webhook-description"
              value={newWebhook.description}
              onChange={(e) => setNewWebhook(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md border-navy-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createWebhookMutation.isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navy-600 hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 disabled:opacity-50"
            >
              {createWebhookMutation.isLoading ? 'Creating...' : 'Create Webhook'}
            </button>
          </div>
        </form>

        {webhooks && webhooks.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-navy-900 mb-3">
              Existing Webhooks
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-navy-200">
                <thead className="bg-navy-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                      Events
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-navy-200">
                  {webhooks.map((webhook: any) => (
                    <tr key={webhook.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-navy-900">
                        {webhook.url}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-500">
                        {webhook.events.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-500">
                        {webhook.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
