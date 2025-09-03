import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { getIntakes, createIntake, updateIntake } from '../../lib/intakes'
import { getLeads } from '../../lib/leads'
import type { Lead } from '../../lib/supabase'

const PROJECT_TYPES = [
  'Website Development',
  'Mobile App',
  'AI Integration',
  'Voice/TTS Solution',
  'Custom Software',
  'Consulting',
] as const

const BUDGET_RANGES = [
  '< $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000+',
] as const

const TIMELINES = [
  'ASAP',
  '1-3 months',
  '3-6 months',
  '6-12 months',
  '12+ months',
] as const

type IntakeFormData = {
  lead_id: string
  project_type: string
  budget_range: string
  timeline: string
  requirements: string
  technical_details?: string
  additional_notes?: string
}

export function IntakeForm() {
  const queryClient = useQueryClient()
  const [selectedLeadId, setSelectedLeadId] = useState<string>('')
  const [formData, setFormData] = useState<IntakeFormData>({
    lead_id: '',
    project_type: PROJECT_TYPES[0],
    budget_range: BUDGET_RANGES[0],
    timeline: TIMELINES[0],
    requirements: '',
    technical_details: '',
    additional_notes: '',
  })

  // Fetch intakes
  const { data: intakesData, isLoading: isLoadingIntakes } = useQuery({
    queryKey: ['intakes'],
    queryFn: async () => {
      const { intakes, error } = await getIntakes()
      if (error) throw error
      return intakes
    },
  })

  // Fetch leads
  const { data: leadsData, isLoading: isLoadingLeads } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { leads, error } = await getLeads()
      if (error) throw error
      return leads?.filter(lead => 
        lead.status === 'qualified' && 
        !intakesData?.some(intake => intake.lead_id === lead.id)
      )
    },
    enabled: !!intakesData,
  })

  // Create intake mutation
  const createIntakeMutation = useMutation({
    mutationFn: (data: IntakeFormData) => createIntake(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intakes'] })
      resetForm()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createIntakeMutation.mutate(formData)
  }

  const resetForm = () => {
    setFormData({
      lead_id: '',
      project_type: PROJECT_TYPES[0],
      budget_range: BUDGET_RANGES[0],
      timeline: TIMELINES[0],
      requirements: '',
      technical_details: '',
      additional_notes: '',
    })
    setSelectedLeadId('')
  }

  const handleLeadChange = (leadId: string) => {
    setSelectedLeadId(leadId)
    setFormData(prev => ({ ...prev, lead_id: leadId }))
  }

  if (isLoadingIntakes || isLoadingLeads) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse">
          <div className="h-8 w-8 rounded-full border-4 border-navy-600 border-t-transparent animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* Lead Selection */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            Select Qualified Lead
          </label>
          <select
            value={selectedLeadId}
            onChange={(e) => handleLeadChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-navy-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
            required
          >
            <option value="">Select a lead...</option>
            {leadsData?.map((lead: Lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.full_name} - {lead.company || 'No Company'}
              </option>
            ))}
          </select>
        </div>

        {/* Project Type */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            Project Type
          </label>
          <select
            value={formData.project_type}
            onChange={(e) => setFormData(prev => ({ ...prev, project_type: e.target.value }))}
            className="mt-1 block w-full rounded-md border-navy-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
            required
          >
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Budget Range */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            Budget Range
          </label>
          <select
            value={formData.budget_range}
            onChange={(e) => setFormData(prev => ({ ...prev, budget_range: e.target.value }))}
            className="mt-1 block w-full rounded-md border-navy-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
            required
          >
            {BUDGET_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        {/* Timeline */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            Timeline
          </label>
          <select
            value={formData.timeline}
            onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
            className="mt-1 block w-full rounded-md border-navy-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
            required
          >
            {TIMELINES.map((timeline) => (
              <option key={timeline} value={timeline}>
                {timeline}
              </option>
            ))}
          </select>
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            Project Requirements
          </label>
          <textarea
            value={formData.requirements}
            onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
            rows={4}
            className="mt-1 block w-full rounded-md border-navy-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
            required
            placeholder="Describe the project requirements..."
          />
        </div>

        {/* Technical Details */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            Technical Details (Optional)
          </label>
          <textarea
            value={formData.technical_details}
            onChange={(e) => setFormData(prev => ({ ...prev, technical_details: e.target.value }))}
            rows={4}
            className="mt-1 block w-full rounded-md border-navy-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
            placeholder="Any technical specifications or requirements..."
          />
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            value={formData.additional_notes}
            onChange={(e) => setFormData(prev => ({ ...prev, additional_notes: e.target.value }))}
            rows={4}
            className="mt-1 block w-full rounded-md border-navy-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
            placeholder="Any other relevant information..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={resetForm}
            className="mr-4 px-4 py-2 border border-navy-300 rounded-md shadow-sm text-sm font-medium text-navy-700 bg-white hover:bg-navy-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={createIntakeMutation.isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navy-600 hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 disabled:opacity-50"
          >
            {createIntakeMutation.isLoading ? 'Submitting...' : 'Submit Intake Form'}
          </button>
        </div>

        {createIntakeMutation.isError && (
          <div className="mt-4 p-3 rounded-md bg-red-50 text-red-800">
            Error submitting form. Please try again.
          </div>
        )}

        {createIntakeMutation.isSuccess && (
          <div className="mt-4 p-3 rounded-md bg-green-50 text-green-800">
            Intake form submitted successfully!
          </div>
        )}
      </form>
    </div>
  )
}
