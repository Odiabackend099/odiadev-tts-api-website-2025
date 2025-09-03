import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { getIntakes } from '../../lib/intakes'
import type { ClientIntake } from '../../lib/supabase'

export function IntakeList() {
  const [selectedIntake, setSelectedIntake] = useState<ClientIntake | null>(null)

  const { data: intakesData, isLoading, error } = useQuery({
    queryKey: ['intakes'],
    queryFn: async () => {
      const { intakes, error: intakesError } = await getIntakes()
      if (intakesError) throw intakesError
      return intakes
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
        Error loading intakes: {error.message}
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-navy-200">
          <thead className="bg-navy-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                Lead
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                Project Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                Budget
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                Timeline
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                Submitted
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-navy-200">
            {intakesData?.map((intake) => (
              <tr key={intake.id} className="hover:bg-navy-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy-900">
                  {intake.leads?.full_name || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-500">
                  {intake.project_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-500">
                  {intake.budget_range}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-500">
                  {intake.timeline}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-500">
                  {format(new Date(intake.created_at), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setSelectedIntake(intake)}
                    className="text-navy-600 hover:text-navy-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Intake Details Modal */}
      {selectedIntake && (
        <div className="fixed inset-0 bg-navy-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-navy-900">
                Intake Details
              </h3>
              <button
                onClick={() => setSelectedIntake(null)}
                className="text-navy-500 hover:text-navy-700"
              >
                ✕
              </button>
            </div>
            
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-navy-500">Lead</dt>
                <dd className="mt-1 text-sm text-navy-900">
                  {selectedIntake.leads?.full_name || 'Unknown'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-navy-500">Project Type</dt>
                <dd className="mt-1 text-sm text-navy-900">{selectedIntake.project_type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-navy-500">Budget Range</dt>
                <dd className="mt-1 text-sm text-navy-900">{selectedIntake.budget_range}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-navy-500">Timeline</dt>
                <dd className="mt-1 text-sm text-navy-900">{selectedIntake.timeline}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-navy-500">Requirements</dt>
                <dd className="mt-1 text-sm text-navy-900 whitespace-pre-wrap">
                  {selectedIntake.requirements}
                </dd>
              </div>
              {selectedIntake.technical_details && (
                <div className="col-span-2">
                  <dt className="text-sm font-medium text-navy-500">Technical Details</dt>
                  <dd className="mt-1 text-sm text-navy-900 whitespace-pre-wrap">
                    {selectedIntake.technical_details}
                  </dd>
                </div>
              )}
              {selectedIntake.additional_notes && (
                <div className="col-span-2">
                  <dt className="text-sm font-medium text-navy-500">Additional Notes</dt>
                  <dd className="mt-1 text-sm text-navy-900 whitespace-pre-wrap">
                    {selectedIntake.additional_notes}
                  </dd>
                </div>
              )}
              <div className="col-span-2">
                <dt className="text-sm font-medium text-navy-500">Submitted</dt>
                <dd className="mt-1 text-sm text-navy-900">
                  {format(new Date(selectedIntake.created_at), 'MMMM d, yyyy')}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}
