import { supabase, type Conversation } from './supabase'

export async function getConversations() {
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(`
      *,
      leads:leads(*)
    `)
    .order('created_at', { ascending: false })
  
  return { conversations, error }
}

export async function getConversationsByLeadId(leadId: string) {
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(`
      *,
      leads:leads(*)
    `)
    .eq('lead_id', leadId)
    .order('created_at', { ascending: true })
  
  return { conversations, error }
}

export async function createConversation(newConversation: Omit<Conversation, 'id' | 'created_at'>) {
  const { data: conversation, error } = await supabase
    .from('conversations')
    .insert(newConversation)
    .select(`
      *,
      leads:leads(*)
    `)
    .single()
  
  return { conversation, error }
}

export async function updateConversationSentiment(id: string, sentiment: Conversation['sentiment']) {
  const { data: conversation, error } = await supabase
    .from('conversations')
    .update({ sentiment })
    .eq('id', id)
    .select()
    .single()
  
  return { conversation, error }
}
