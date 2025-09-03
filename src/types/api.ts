// Event Types
export type EventType = 'lead' | 'intake' | 'conversation_end' | 'error'

// Lead Event
export interface LeadEvent {
  type: 'lead'
  name: string
  email: string
  phone?: string
  message?: string
  source?: string
  session_id?: string
}

// Intake Event
export interface IntakeEvent {
  type: 'intake'
  business_name: string
  industry: string
  country: string
  preferred_channels: string[]
  whatsapp_number?: string
  telegram_handle?: string
  website_url?: string
  use_cases: string[]
  required_integrations: string[]
  budget_tier: string
  timeline: string
  voice_pref: {
    avatar?: string
    tone?: string
  }
  contact: {
    name: string
    email: string
    phone?: string
  }
  session_id?: string
}

// Conversation End Event
export interface ConversationEndEvent {
  type: 'conversation_end'
  transcript: string
  final_reply: string
  session_id?: string
}

// Error Event
export interface ErrorEvent {
  type: 'error'
  message: string
  session_id?: string
}

// Union type for all events
export type Event = LeadEvent | IntakeEvent | ConversationEndEvent | ErrorEvent

// API Response types
export interface ApiResponse<T = undefined> {
  ok: boolean
  data?: T
  error?: string
}

// TTS Request/Response
export interface TtsRequest {
  text: string
  voice_id: string
}

// Brain API Types
export interface QualifyResponse {
  qualified: boolean
  score: number
  notes?: string
}
