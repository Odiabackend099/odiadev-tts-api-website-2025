import { supabase } from './supabase'
import Papa from 'papaparse'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import type { Lead, Conversation, Profile } from './supabase'

export type AutomationRule = {
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

// Automated data export with scheduling
export async function scheduleDataExport(
  exportType: 'leads' | 'conversations' | 'analytics',
  format: 'csv' | 'pdf',
  schedule: 'daily' | 'weekly' | 'monthly',
  recipients: string[]
) {
  const { data, error } = await supabase
    .from('scheduled_exports')
    .insert({
      export_type: exportType,
      format,
      schedule,
      recipients,
      last_run: new Date().toISOString(),
    })
    .select()
    .single()

  return { scheduledExport: data, error }
}

// Generate and execute exports
export async function generateExport(
  type: 'leads' | 'conversations' | 'analytics',
  format: 'csv' | 'pdf',
  filters?: Record<string, any>
) {
  // Fetch data based on type
  const { data, error } = await fetchDataForExport(type, filters)
  if (error) throw error

  // Generate export based on format
  if (format === 'csv') {
    return generateCSV(data, type)
  } else {
    return generatePDF(data, type)
  }
}

async function fetchDataForExport(type: string, filters?: Record<string, any>) {
  let query = supabase.from(type)

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
  }

  return await query.select('*')
}

function generateCSV(data: any[], type: string) {
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  return {
    filename: `${type}_export_${new Date().toISOString()}.csv`,
    blob,
  }
}

function generatePDF(data: any[], type: string) {
  const doc = new jsPDF()
  
  // Add header
  doc.setFontSize(16)
  doc.text(`${type.charAt(0).toUpperCase() + type.slice(1)} Report`, 14, 15)
  doc.setFontSize(10)
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25)

  // Generate table
  const headers = Object.keys(data[0] || {})
  const rows = data.map(item => headers.map(header => item[header]))
  
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 35,
  })

  return {
    filename: `${type}_report_${new Date().toISOString()}.pdf`,
    blob: doc.output('blob'),
  }
}

// Webhook Management
export type CreateWebhookInput = {
  url: string
  events: string[]
  description?: string
  secret: string
}

export async function createWebhook(input: CreateWebhookInput) {
  try {
    // Start a transaction
    const { data: webhook, error: webhookError } = await supabase
      .from('webhooks')
      .insert({
        url: input.url,
        description: input.description,
        secret: input.secret,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single()

    if (webhookError) throw webhookError

    // Get event IDs
    const { data: events, error: eventsError } = await supabase
      .from('webhook_events')
      .select('id, name')
      .in('name', input.events)

    if (eventsError) throw eventsError

    // Create subscriptions
    const { error: subscriptionError } = await supabase
      .from('webhook_subscriptions')
      .insert(
        events.map(event => ({
          webhook_id: webhook.id,
          event_id: event.id,
        }))
      )

    if (subscriptionError) throw subscriptionError

    // Register with n8n
    await registerN8nWebhook(webhook)

    return { webhook, error: null }
  } catch (error) {
    console.error('Error creating webhook:', error)
    return { webhook: null, error }
  }
}

async function registerN8nWebhook(webhook: any) {
  // Implementation for n8n webhook registration
  const n8nUrl = import.meta.env.VITE_N8N_API_URL
  const n8nApiKey = import.meta.env.VITE_N8N_API_KEY

  await fetch(`${n8nUrl}/webhooks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': n8nApiKey,
    },
    body: JSON.stringify({
      name: `webhook_${webhook.id}`,
      endpoint: webhook.url,
      events: webhook.events,
      webhookSecret: webhook.secret,
    }),
  })
}

export async function deleteWebhook(webhookId: string) {
  const { error } = await supabase
    .from('webhooks')
    .delete()
    .eq('id', webhookId)

  return { error }
}

export async function updateWebhookStatus(webhookId: string, isActive: boolean) {
  const { data, error } = await supabase
    .from('webhooks')
    .update({ is_active: isActive })
    .eq('id', webhookId)
    .select()
    .single()

  return { webhook: data, error }
}

export async function getWebhookStats(webhookId: string) {
  const { data, error } = await supabase
    .from('webhook_delivery_logs')
    .select('response_status, delivered_at')
    .eq('webhook_id', webhookId)
    .order('delivered_at', { ascending: false })
    .limit(100)

  if (error) return { error }

  const stats = {
    total: data.length,
    success: data.filter(log => log.response_status && log.response_status < 400).length,
    failure: data.filter(log => log.response_status && log.response_status >= 400).length,
    lastDelivery: data[0]?.delivered_at || null,
  }

  return { stats, error: null }
}

export async function logWebhookDelivery(
  webhookId: string,
  eventId: string,
  payload: any,
  response?: Response
) {
  const log = {
    webhook_id: webhookId,
    event_id: eventId,
    payload,
    response_status: response?.status,
    response_body: await response?.text(),
  }

  const { data, error } = await supabase
    .from('webhook_delivery_logs')
    .insert(log)
    .select()
    .single()

  return { log: data, error }
}

// Automation Rules Engine
export async function createAutomationRule(rule: Omit<AutomationRule, 'id'>) {
  const { data, error } = await supabase
    .from('automation_rules')
    .insert(rule)
    .select()
    .single()

  return { rule: data, error }
}

export async function executeAutomationRules(
  trigger: AutomationRule['trigger_type'],
  payload: any
) {
  // Fetch relevant rules
  const { data: rules } = await supabase
    .from('automation_rules')
    .select('*')
    .eq('trigger_type', trigger)
    .eq('is_active', true)

  if (!rules) return

  // Execute matching rules
  for (const rule of rules) {
    if (evaluateConditions(rule.conditions, payload)) {
      await executeActions(rule.actions, payload)
    }
  }
}

function evaluateConditions(conditions: AutomationRule['conditions'], payload: any): boolean {
  return conditions.every(condition => {
    const value = payload[condition.field]
    switch (condition.operator) {
      case 'equals':
        return value === condition.value
      case 'contains':
        return value?.includes(condition.value)
      case 'gt':
        return value > condition.value
      case 'lt':
        return value < condition.value
      case 'exists':
        return value !== undefined && value !== null
      default:
        return false
    }
  })
}

async function executeActions(actions: AutomationRule['actions'], payload: any) {
  for (const action of actions) {
    switch (action.type) {
      case 'webhook':
        await triggerWebhook(action.config.url, payload)
        break
      case 'email':
        await sendAutomatedEmail(action.config.template, payload)
        break
      case 'status_update':
        await updateLeadStatus(payload.id, action.config.status)
        break
      case 'notification':
        await createNotification(action.config.message, payload)
        break
      case 'export':
        await generateExport(action.config.type, action.config.format)
        break
    }
  }
}

async function triggerWebhook(url: string, payload: any) {
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

async function sendAutomatedEmail(template: string, data: any) {
  // Implementation for sending automated emails
  // This would integrate with your email service provider
}

async function updateLeadStatus(leadId: string, status: Lead['status']) {
  await supabase
    .from('leads')
    .update({ status })
    .eq('id', leadId)
}

async function createNotification(message: string, data: any) {
  await supabase
    .from('notifications')
    .insert({
      message,
      data,
      is_read: false,
    })
}

// Team Management Automation
export async function inviteTeamMember(email: string, role: string) {
  // Generate invite token
  const token = generateInviteToken()

  const { data, error } = await supabase
    .from('team_invites')
    .insert({
      email,
      role,
      token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    })
    .select()
    .single()

  if (data) {
    // Send invitation email
    await sendInvitationEmail(email, token)
  }

  return { invite: data, error }
}

function generateInviteToken(): string {
  return crypto.randomUUID()
}

async function sendInvitationEmail(email: string, token: string) {
  // Implementation for sending invitation emails
  // This would integrate with your email service provider
}

// Role-based Access Control
export type Permission = 'read' | 'write' | 'delete' | 'admin'
export type Resource = 'leads' | 'conversations' | 'intakes' | 'analytics' | 'settings'

export async function checkPermission(
  userId: string,
  resource: Resource,
  permission: Permission
): Promise<boolean> {
  const { data: userRole } = await supabase
    .from('team_members')
    .select('role')
    .eq('user_id', userId)
    .single()

  if (!userRole) return false

  const { data: rolePermissions } = await supabase
    .from('role_permissions')
    .select('*')
    .eq('role', userRole.role)
    .eq('resource', resource)
    .single()

  return rolePermissions?.permissions?.includes(permission) || false
}
