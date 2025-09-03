import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { updateWebhookStatus, deleteWebhook } from '../../lib/automation'
import { WebhookStats } from './WebhookStats'
import type { Webhook } from '../../lib/database.types'

type SubscribedEvent = {
  webhook_events: {
    id: string
    name: string
    description: string | null
  }
}

export function WebhookDetails({ webhook }: { webhook: Webhook }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const queryClient = useQueryClient()

  // Fetch webhook events
  const { data: subscriptions } = useQuery({
    queryKey: ['webhook-events', webhook.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('webhook_subscriptions')
        .select(`
          webhook_events (
            id,
            name,
            description
          )
        `)
        .eq('webhook_id', webhook.id)
      return data as SubscribedEvent[]
    },
  })

  const events = subscriptions?.map(sub => sub.webhook_events) ?? []

  // Update webhook status
  const updateStatusMutation = useMutation({
    mutationFn: ({ webhookId, isActive }: { webhookId: string, isActive: boolean }) =>
      updateWebhookStatus(webhookId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] })
    },
  })

  // Delete webhook
  const deleteMutation = useMutation({
    mutationFn: (webhookId: string) => deleteWebhook(webhookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] })
    },
  })

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-medium text-navy-900">
              {new URL(webhook.url).hostname}
            </h4>
            <p className="text-sm text-navy-500 mt-1">
              {webhook.description || 'No description provided'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="sr-only">Webhook status</span>
              <button
                type="button"
                onClick={() => updateStatusMutation.mutate({
                  webhookId: webhook.id,
                  isActive: !webhook.is_active,
                })}
                className={`${
                  webhook.is_active
                    ? 'bg-emerald-600'
                    : 'bg-navy-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    webhook.is_active ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                >
                  <span
                    className={`${
                      webhook.is_active
                        ? 'opacity-0 duration-100 ease-out'
                        : 'opacity-100 duration-200 ease-in'
                    } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                  >
                    <svg className="h-3 w-3 text-navy-400" fill="none" viewBox="0 0 12 12">
                      <path
                        d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span
                    className={`${
                      webhook.is_active
                        ? 'opacity-100 duration-200 ease-in'
                        : 'opacity-0 duration-100 ease-out'
                    } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                  >
                    <svg className="h-3 w-3 text-emerald-600" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  </span>
                </span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to delete this webhook?')) {
                  deleteMutation.mutate(webhook.id)
                }
              }}
              className="text-red-600 hover:text-red-700"
            >
              <span className="sr-only">Delete webhook</span>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-navy-500 hover:text-navy-700"
            >
              <span className="sr-only">
                {isExpanded ? 'Collapse details' : 'Expand details'}
              </span>
              <svg
                className={`h-5 w-5 transform transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-2">
          <div className="flex flex-wrap gap-2">
            {events?.map((event) => (
              <span
                key={event.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-navy-100 text-navy-800"
              >
                {event.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-navy-200 p-4">
          <WebhookStats webhookId={webhook.id} />
        </div>
      )}
    </div>
  )
}
