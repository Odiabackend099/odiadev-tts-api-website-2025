import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { getConversations, getConversationsByLeadId } from '../../lib/conversations'
import { getLeads } from '../../lib/leads'
import type { Conversation, Lead } from '../../lib/supabase'

const SENTIMENT_COLORS = {
  positive: 'bg-green-100 text-green-800',
  neutral: 'bg-blue-100 text-blue-800',
  negative: 'bg-red-100 text-red-800',
} as const

export function ConversationList() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  // Fetch leads
  const { data: leadsData } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { leads, error } = await getLeads()
      if (error) throw error
      return leads
    },
  })

  // Fetch conversations
  const { data: conversationsData, isLoading, error } = useQuery({
    queryKey: ['conversations', selectedLead?.id],
    queryFn: async () => {
      const { conversations, error } = selectedLead
        ? await getConversationsByLeadId(selectedLead.id)
        : await getConversations()
      if (error) throw error
      return conversations
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse">
          <div className="h-8 w-8 rounded-full border-4 border-navy-600 border-t-transparent animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        Error loading conversations: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Lead Filter */}
      <div className="w-72">
        <label className="block text-sm font-medium text-navy-700 mb-2">
          Filter by Lead
        </label>
        <select
          value={selectedLead?.id || ''}
          onChange={(e) => {
            const lead = leadsData?.find(l => l.id === e.target.value) || null
            setSelectedLead(lead)
          }}
          className="mt-1 block w-full rounded-md border-navy-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
        >
          <option value="">All Conversations</option>
          {leadsData?.map((lead) => (
            <option key={lead.id} value={lead.id}>
              {lead.full_name} - {lead.company || 'No Company'}
            </option>
          ))}
        </select>
      </div>

      {/* Conversations List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-navy-200">
          {conversationsData?.map((conversation) => (
            <li key={conversation.id}>
              <button
                onClick={() => setSelectedConversation(conversation)}
                className="w-full text-left px-6 py-4 hover:bg-navy-50 focus:outline-none focus:bg-navy-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-navy-200 flex items-center justify-center">
                        <span className="text-navy-600 font-medium">
                          {conversation.leads?.full_name?.[0] || '?'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy-900">
                        {conversation.leads?.full_name || 'Anonymous User'}
                      </p>
                      <p className="text-sm text-navy-500">
                        {format(new Date(conversation.created_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                  {conversation.sentiment && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      SENTIMENT_COLORS[conversation.sentiment]
                    }`}>
                      {conversation.sentiment.charAt(0).toUpperCase() + conversation.sentiment.slice(1)}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-sm text-navy-600 line-clamp-2">
                    {conversation.user_message}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Conversation Detail Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-navy-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-navy-900">
                  Conversation Details
                </h3>
                <p className="text-sm text-navy-500">
                  {format(new Date(selectedConversation.created_at), 'MMMM d, yyyy h:mm a')}
                </p>
              </div>
              <button
                onClick={() => setSelectedConversation(null)}
                className="text-navy-500 hover:text-navy-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Lead Info */}
              {selectedConversation.leads && (
                <div className="border-b border-navy-200 pb-4">
                  <h4 className="text-sm font-medium text-navy-500 mb-2">Lead Information</h4>
                  <p className="text-sm text-navy-900">
                    <span className="font-medium">Name:</span> {selectedConversation.leads.full_name}
                  </p>
                  {selectedConversation.leads.company && (
                    <p className="text-sm text-navy-900">
                      <span className="font-medium">Company:</span> {selectedConversation.leads.company}
                    </p>
                  )}
                  <p className="text-sm text-navy-900">
                    <span className="font-medium">Email:</span> {selectedConversation.leads.email}
                  </p>
                </div>
              )}

              {/* Conversation */}
              <div className="space-y-4">
                <div className="bg-navy-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-navy-500 mb-2">User Message</p>
                  <p className="text-sm text-navy-900 whitespace-pre-wrap">
                    {selectedConversation.user_message}
                  </p>
                </div>

                <div className="bg-white border border-navy-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-navy-500 mb-2">AI Response</p>
                  <p className="text-sm text-navy-900 whitespace-pre-wrap">
                    {selectedConversation.ai_response}
                  </p>
                </div>

                {selectedConversation.voice_url && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-navy-500 mb-2">Voice Response</p>
                    <audio controls className="w-full">
                      <source src={selectedConversation.voice_url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}

                {selectedConversation.qualification_result && (
                  <div className="bg-navy-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-navy-500 mb-2">Qualification Result</p>
                    <pre className="text-sm text-navy-900 whitespace-pre-wrap">
                      {JSON.stringify(selectedConversation.qualification_result, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedConversation.sentiment && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-navy-500 mb-2">Sentiment</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      SENTIMENT_COLORS[selectedConversation.sentiment]
                    }`}>
                      {selectedConversation.sentiment.charAt(0).toUpperCase() + selectedConversation.sentiment.slice(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
