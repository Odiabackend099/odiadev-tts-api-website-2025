import { supabase } from './supabase'

export type AnalyticsData = {
  totalLeads: number
  leadsByStatus: Record<string, number>
  leadsBySource: Record<string, number>
  conversationCount: number
  averageSentiment: Record<string, number>
  conversionRate: number
  projectTypeDistribution: Record<string, number>
  budgetRangeDistribution: Record<string, number>
  timelineDistribution: Record<string, number>
  monthlyLeads: Array<{ month: string; count: number }>
  monthlyConversions: Array<{ month: string; count: number }>
}

export async function getAnalytics(timeRange: 'week' | 'month' | 'year' = 'month') {
  const now = new Date()
  const startDate = new Date()
  
  switch (timeRange) {
    case 'week':
      startDate.setDate(startDate.getDate() - 7)
      break
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1)
      break
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1)
      break
  }

  const startDateStr = startDate.toISOString()

  // Fetch leads data
  const { data: leads, error: leadsError } = await supabase
    .from('leads')
    .select('*')
    .gte('created_at', startDateStr)

  if (leadsError) throw leadsError

  // Fetch conversations data
  const { data: conversations, error: convoError } = await supabase
    .from('conversations')
    .select('*')
    .gte('created_at', startDateStr)

  if (convoError) throw convoError

  // Fetch intake data
  const { data: intakes, error: intakeError } = await supabase
    .from('client_intake')
    .select('*')
    .gte('created_at', startDateStr)

  if (intakeError) throw intakeError

  // Calculate analytics metrics
  const leadsByStatus = leads?.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const leadsBySource = leads?.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const sentiments = conversations?.reduce((acc, convo) => {
    if (convo.sentiment) {
      acc[convo.sentiment] = (acc[convo.sentiment] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>) || {}

  const totalSentiments = Object.values(sentiments).reduce((a, b) => a + b, 0)
  const averageSentiment = Object.entries(sentiments).reduce((acc, [key, value]) => {
    acc[key] = value / totalSentiments
    return acc
  }, {} as Record<string, number>)

  const projectTypes = intakes?.reduce((acc, intake) => {
    acc[intake.project_type] = (acc[intake.project_type] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const budgetRanges = intakes?.reduce((acc, intake) => {
    acc[intake.budget_range] = (acc[intake.budget_range] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const timelines = intakes?.reduce((acc, intake) => {
    acc[intake.timeline] = (acc[intake.timeline] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // Calculate monthly metrics
  const monthlyLeads = getMonthlyMetrics(leads || [], startDate)
  const monthlyConversions = getMonthlyMetrics(
    leads?.filter(lead => lead.status === 'converted') || [],
    startDate
  )

  return {
    totalLeads: leads?.length || 0,
    leadsByStatus,
    leadsBySource,
    conversationCount: conversations?.length || 0,
    averageSentiment,
    conversionRate: leads
      ? leads.filter(l => l.status === 'converted').length / leads.length
      : 0,
    projectTypeDistribution: projectTypes,
    budgetRangeDistribution: budgetRanges,
    timelineDistribution: timelines,
    monthlyLeads,
    monthlyConversions,
  }
}

function getMonthlyMetrics(data: Array<{ created_at: string }>, startDate: Date) {
  const months: Record<string, number> = {}
  const current = new Date(startDate)
  const now = new Date()

  while (current <= now) {
    const monthKey = current.toISOString().substring(0, 7) // YYYY-MM format
    months[monthKey] = 0
    current.setMonth(current.getMonth() + 1)
  }

  data.forEach(item => {
    const monthKey = item.created_at.substring(0, 7)
    if (months[monthKey] !== undefined) {
      months[monthKey]++
    }
  })

  return Object.entries(months)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month))
}
