import { useState } from 'react'
import { useAuth } from '../../components/auth/AuthProvider'
import { signOut } from '../../lib/supabase'
import { LeadsTable } from '../../components/dashboard/LeadsTable'
import { IntakeTab } from './IntakeTab'
import { ConversationTab } from './ConversationTab'
import { SettingsTab } from './SettingsTab'
import { AnalyticsTab } from './AnalyticsTab'

const TABS = ['Analytics', 'Leads', 'Intake', 'Conversations', 'Settings'] as const
type Tab = typeof TABS[number]

export function Dashboard() {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('Leads')

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      console.error('Error signing out:', error.message)
    }
  }

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-cormorant-garamond font-bold text-navy-900">
                ODIADEV Dashboard
              </h1>
              <span className="ml-4 text-sm text-navy-500">
                Welcome, {profile?.full_name || profile?.email}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-navy-700 hover:text-navy-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-navy-200">
          <nav className="-mb-px flex space-x-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab
                    ? 'border-navy-500 text-navy-600'
                    : 'border-transparent text-navy-500 hover:text-navy-700 hover:border-navy-300'}
                `}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'Analytics' && <AnalyticsTab />}
          {activeTab === 'Leads' && <LeadsTable />}
          {activeTab === 'Intake' && <IntakeTab />}
          {activeTab === 'Conversations' && <ConversationTab />}
          {activeTab === 'Settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  )
}
