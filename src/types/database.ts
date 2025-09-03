export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          company: string | null
          role: string | null
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          company?: string | null
          role?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          company?: string | null
          role?: string | null
        }
      }
      leads: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string
          company: string | null
          status: 'new' | 'contacted' | 'qualified' | 'converted' | 'disqualified'
          source: string
          notes: string | null
          last_contact: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          full_name: string
          company?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'disqualified'
          source: string
          notes?: string | null
          last_contact?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string
          company?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'disqualified'
          source?: string
          notes?: string | null
          last_contact?: string | null
        }
      }
      client_intake: {
        Row: {
          id: string
          created_at: string
          lead_id: string
          project_type: string
          budget_range: string
          timeline: string
          requirements: string
          technical_details: string | null
          additional_notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          lead_id: string
          project_type: string
          budget_range: string
          timeline: string
          requirements: string
          technical_details?: string | null
          additional_notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          lead_id?: string
          project_type?: string
          budget_range?: string
          timeline?: string
          requirements?: string
          technical_details?: string | null
          additional_notes?: string | null
        }
      }
      conversations: {
        Row: {
          id: string
          created_at: string
          lead_id: string | null
          user_message: string
          ai_response: string
          voice_url: string | null
          qualification_result: Json | null
          sentiment: 'positive' | 'neutral' | 'negative' | null
        }
        Insert: {
          id?: string
          created_at?: string
          lead_id?: string | null
          user_message: string
          ai_response: string
          voice_url?: string | null
          qualification_result?: Json | null
          sentiment?: 'positive' | 'neutral' | 'negative' | null
        }
        Update: {
          id?: string
          created_at?: string
          lead_id?: string | null
          user_message?: string
          ai_response?: string
          voice_url?: string | null
          qualification_result?: Json | null
          sentiment?: 'positive' | 'neutral' | 'negative' | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
