import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { getLeads, updateLead, deleteLead } from '../../lib/leads'
import type { Lead } from '../../lib/supabase'

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-green-100 text-green-800',
  converted: 'bg-purple-100 text-purple-800',
  disqualified: 'bg-red-100 text-red-800',
} as const

export function LeadsTable() {
  const queryClient = useQueryClient()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  // Fetch leads
  const { data: leadsData, isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { leads, error: leadsError } = await getLeads()
      if (leadsError) throw leadsError
      return leads
    },
  })

  // Update lead status
  const updateLeadMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Lead['status'] }) =>
      updateLead(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })

  // Delete lead
  const deleteLeadMutation = useMutation({
    mutationFn: (id: string) => deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      setSelectedLead(null)
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
        Error loading leads: {error.message}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-navy-200">
        <thead className="bg-navy-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
              Company
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
              Last Contact
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
              Source
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-navy-200">
          {leadsData?.map((lead) => (
            <tr key={lead.id} className="hover:bg-navy-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy-900">
                {lead.full_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-500">
                {lead.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-500">
                {lead.company || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={lead.status}
                  onChange={(e) => {
                    updateLeadMutation.mutate({
                      id: lead.id,
                      status: e.target.value as Lead['status'],
                    })
                  }}
                  className={`text-sm font-medium px-2.5 py-0.5 rounded-full 
                    ${STATUS_COLORS[lead.status]} border-0 cursor-pointer`}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="disqualified">Disqualified</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-500">
                {lead.last_contact
                  ? format(new Date(lead.last_contact), 'MMM d, yyyy')
                  : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-500">
                {lead.source}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => setSelectedLead(lead)}
                  className="text-navy-600 hover:text-navy-900 mr-4"
                >
                  View
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this lead?')) {
                      deleteLeadMutation.mutate(lead.id)
                    }
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-navy-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-navy-900">
                Lead Details
              </h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-navy-500 hover:text-navy-700"
              >
                ✕
              </button>
            </div>
            
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-navy-500">Name</dt>
                <dd className="mt-1 text-sm text-navy-900">{selectedLead.full_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-navy-500">Email</dt>
                <dd className="mt-1 text-sm text-navy-900">{selectedLead.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-navy-500">Company</dt>
                <dd className="mt-1 text-sm text-navy-900">{selectedLead.company || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-navy-500">Source</dt>
                <dd className="mt-1 text-sm text-navy-900">{selectedLead.source}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-navy-500">Notes</dt>
                <dd className="mt-1 text-sm text-navy-900 whitespace-pre-wrap">
                  {selectedLead.notes || '-'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}
