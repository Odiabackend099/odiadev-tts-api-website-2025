import { supabase, type ClientIntake } from './supabase'

export async function getIntakes() {
  const { data: intakes, error } = await supabase
    .from('client_intake')
    .select(`
      *,
      leads:leads(*)
    `)
    .order('created_at', { ascending: false })
  
  return { intakes, error }
}

export async function getIntakeByLeadId(leadId: string) {
  const { data: intake, error } = await supabase
    .from('client_intake')
    .select(`
      *,
      leads:leads(*)
    `)
    .eq('lead_id', leadId)
    .single()
  
  return { intake, error }
}

export async function createIntake(newIntake: Omit<ClientIntake, 'id' | 'created_at'>) {
  const { data: intake, error } = await supabase
    .from('client_intake')
    .insert(newIntake)
    .select()
    .single()
  
  return { intake, error }
}

export async function updateIntake(id: string, updates: Partial<ClientIntake>) {
  const { data: intake, error } = await supabase
    .from('client_intake')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { intake, error }
}
