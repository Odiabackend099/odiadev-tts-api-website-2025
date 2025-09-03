import { ConversationList } from '../../components/dashboard/ConversationList'

export function ConversationTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-cormorant-garamond font-semibold text-navy-900">
          Chat History
        </h2>
        <p className="mt-1 text-sm text-navy-500">
          Review and analyze conversations with potential clients
        </p>
      </div>

      <ConversationList />
    </div>
  )
}
