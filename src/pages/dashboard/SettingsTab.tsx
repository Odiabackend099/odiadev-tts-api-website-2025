import { useState } from 'react'
import { ProfileSettings } from '../../components/settings/ProfileSettings'
import { NotificationSettings } from '../../components/settings/NotificationSettings'

const SECTIONS = ['Profile', 'Notifications'] as const
type Section = typeof SECTIONS[number]

export function SettingsTab() {
  const [activeSection, setActiveSection] = useState<Section>('Profile')

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-cormorant-garamond font-semibold text-navy-900">
          Settings
        </h2>
        <p className="mt-1 text-sm text-navy-500">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Navigation */}
      <div className="border-b border-navy-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {SECTIONS.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${activeSection === section
                  ? 'border-navy-500 text-navy-600'
                  : 'border-transparent text-navy-500 hover:text-navy-700 hover:border-navy-300'}
              `}
            >
              {section}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="space-y-6">
        {activeSection === 'Profile' && <ProfileSettings />}
        {activeSection === 'Notifications' && <NotificationSettings />}
      </div>
    </div>
  )
}
