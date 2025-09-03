import { supabase, type Lead } from './supabase'

export async function getLeads() {
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { leads, error }
}

export async function createLead(newLead: Omit<Lead, 'id' | 'created_at'>) {
  const { data: lead, error } = await supabase
    .from('leads')
    .insert(newLead)
    .select()
    .single()
  
  return { lead, error }
}

export async function updateLead(id: string, updates: Partial<Lead>) {
  const { data: lead, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { lead, error }
}

export async function deleteLead(id: string) {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)
  
  return { error }
}
