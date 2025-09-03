import { useState } from 'react'
import { IntakeForm } from '../../components/dashboard/IntakeForm'
import { IntakeList } from '../../components/dashboard/IntakeList'

export function IntakeTab() {
  const [view, setView] = useState<'list' | 'new'>('list')

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-cormorant-garamond font-semibold text-navy-900">
          Client Intake Management
        </h2>
        <button
          onClick={() => setView(view === 'list' ? 'new' : 'list')}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navy-600 hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500"
        >
          {view === 'list' ? 'New Intake Form' : 'View All Intakes'}
        </button>
      </div>

      {view === 'list' ? <IntakeList /> : <IntakeForm />}
    </div>
  )
}
