export type IntegrationService = 'tts' | 'brain' | 'n8n'

export interface IntegrationKey {
  id: string
  name: string
  key: string
  service: IntegrationService
  created_at: string
  created_by: string
  is_active: boolean
  last_used_at: string | null
}

export interface WebhookEvent {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface Webhook {
  id: string
  url: string
  description: string | null
  secret: string
  created_at: string
  created_by: string
  is_active: boolean
  last_triggered_at: string | null
  failure_count: number
}

export interface WebhookSubscription {
  webhook_id: string
  event_id: string
  created_at: string
}

export interface WebhookDeliveryLog {
  id: string
  webhook_id: string
  event_id: string | null
  payload: Record<string, any>
  response_status: number | null
  response_body: string | null
  error_message: string | null
  delivered_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  email: string
  full_name: string | null
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  source: string | null
  created_at: string
  updated_at: string
}

export interface ClientIntake {
  id: string
  lead_id: string
  company_name: string | null
  industry: string | null
  project_description: string | null
  budget_range: string | null
  timeline: string | null
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  lead_id: string
  message: string
  type: 'incoming' | 'outgoing'
  created_at: string
}

export interface Notification {
  id: string
  message: string
  data: Record<string, any>
  is_read: boolean
  created_at: string
  user_id: string
}

export interface TeamInvite {
  id: string
  email: string
  role: string
  token: string
  expires_at: string
  created_at: string
  accepted_at: string | null
}

export interface AutomationRule {
  id: string
  trigger_type: 'new_lead' | 'status_change' | 'conversation' | 'intake_submission'
  conditions: Array<{
    field: string
    operator: 'equals' | 'contains' | 'gt' | 'lt' | 'exists'
    value: any
  }>
  actions: Array<{
    type: 'webhook' | 'email' | 'status_update' | 'notification' | 'export'
    config: Record<string, any>
  }>
  is_active: boolean
  team_id: string
}

export interface ScheduledExport {
  id: string
  export_type: 'leads' | 'conversations' | 'analytics'
  format: 'csv' | 'pdf'
  schedule: 'daily' | 'weekly' | 'monthly'
  recipients: string[]
  last_run: string
  created_at: string
  created_by: string
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      leads: {
        Row: Lead
        Insert: Omit<Lead, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Lead, 'id' | 'created_at'>>
      }
      client_intake: {
        Row: ClientIntake
        Insert: Omit<ClientIntake, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ClientIntake, 'id' | 'created_at'>>
      }
      conversations: {
        Row: Conversation
        Insert: Omit<Conversation, 'id' | 'created_at'>
        Update: Partial<Omit<Conversation, 'id' | 'created_at'>>
      }
      integration_keys: {
        Row: IntegrationKey
        Insert: Omit<IntegrationKey, 'id' | 'created_at' | 'last_used_at'>
        Update: Partial<Omit<IntegrationKey, 'id' | 'created_at'>>
      }
      webhook_events: {
        Row: WebhookEvent
        Insert: Omit<WebhookEvent, 'id' | 'created_at'>
        Update: Partial<Omit<WebhookEvent, 'id' | 'created_at'>>
      }
      webhooks: {
        Row: Webhook
        Insert: Omit<Webhook, 'id' | 'created_at' | 'last_triggered_at' | 'failure_count'>
        Update: Partial<Omit<Webhook, 'id' | 'created_at'>>
      }
      webhook_subscriptions: {
        Row: WebhookSubscription
        Insert: Omit<WebhookSubscription, 'created_at'>
        Update: Partial<Omit<WebhookSubscription, 'webhook_id' | 'event_id' | 'created_at'>>
      }
      webhook_delivery_logs: {
        Row: WebhookDeliveryLog
        Insert: Omit<WebhookDeliveryLog, 'id' | 'delivered_at'>
        Update: Partial<Omit<WebhookDeliveryLog, 'id' | 'delivered_at'>>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, 'id' | 'created_at'>
        Update: Partial<Omit<Notification, 'id' | 'created_at'>>
      }
      team_invites: {
        Row: TeamInvite
        Insert: Omit<TeamInvite, 'id' | 'created_at' | 'accepted_at'>
        Update: Partial<Omit<TeamInvite, 'id' | 'created_at'>>
      }
      automation_rules: {
        Row: AutomationRule
        Insert: Omit<AutomationRule, 'id'>
        Update: Partial<Omit<AutomationRule, 'id'>>
      }
      scheduled_exports: {
        Row: ScheduledExport
        Insert: Omit<ScheduledExport, 'id' | 'created_at'>
        Update: Partial<Omit<ScheduledExport, 'id' | 'created_at'>>
      }
    }
    Enums: {
      integration_service: IntegrationService
    }
    Functions: {
      get_webhook_events: {
        Args: { webhook_id: string }
        Returns: { event_name: string }[]
      }
    }
  }
}
