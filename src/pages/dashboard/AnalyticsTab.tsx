import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { getAnalytics, type AnalyticsData } from '../../lib/analytics'
import { MetricsCard } from '../../components/analytics/MetricsCard'
import { LineChart } from '../../components/analytics/LineChart'
import { DoughnutChart } from '../../components/analytics/DoughnutChart'

const TIME_RANGES = ['week', 'month', 'year'] as const
type TimeRange = typeof TIME_RANGES[number]

const CHART_COLORS = {
  navy: 'rgb(30, 58, 138)',
  blue: 'rgb(59, 130, 246)',
  gold: 'rgb(234, 179, 8)',
  green: 'rgb(34, 197, 94)',
  red: 'rgb(239, 68, 68)',
  purple: 'rgb(168, 85, 247)',
}

export function AnalyticsTab() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month')

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: () => getAnalytics(timeRange),
  })

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-navy-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-navy-200 rounded-lg"></div>
          ))}
        </div>
        <div className="h-80 bg-navy-200 rounded-lg"></div>
      </div>
    )
  }

  if (!analytics) return null

  const conversionRateFormatted = `${(analytics.conversionRate * 100).toFixed(1)}%`

  const monthlyData = {
    labels: analytics.monthlyLeads.map(d => format(new Date(d.month), 'MMM yyyy')),
    datasets: [
      {
        label: 'New Leads',
        data: analytics.monthlyLeads.map(d => d.count),
        borderColor: CHART_COLORS.blue,
        backgroundColor: CHART_COLORS.blue,
      },
      {
        label: 'Conversions',
        data: analytics.monthlyConversions.map(d => d.count),
        borderColor: CHART_COLORS.green,
        backgroundColor: CHART_COLORS.green,
      },
    ],
  }

  const leadStatusData = {
    labels: Object.keys(analytics.leadsByStatus),
    datasets: [{
      data: Object.values(analytics.leadsByStatus),
      backgroundColor: [
        CHART_COLORS.blue,
        CHART_COLORS.gold,
        CHART_COLORS.green,
        CHART_COLORS.purple,
        CHART_COLORS.red,
      ],
    }],
  }

  const projectTypeData = {
    labels: Object.keys(analytics.projectTypeDistribution),
    datasets: [{
      data: Object.values(analytics.projectTypeDistribution),
      backgroundColor: [
        CHART_COLORS.navy,
        CHART_COLORS.blue,
        CHART_COLORS.gold,
        CHART_COLORS.green,
        CHART_COLORS.purple,
        CHART_COLORS.red,
      ],
    }],
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-cormorant-garamond font-semibold text-navy-900">
            Analytics Dashboard
          </h2>
          <p className="mt-1 text-sm text-navy-500">
            Track your business performance and growth
          </p>
        </div>
        <div className="flex space-x-2">
          {TIME_RANGES.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`
                px-4 py-2 text-sm font-medium rounded-md
                ${timeRange === range
                  ? 'bg-navy-600 text-white'
                  : 'bg-white text-navy-600 hover:bg-navy-50'}
              `}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="Total Leads"
          value={analytics.totalLeads}
          change={{
            value: 12.5,
            isPositive: true,
          }}
        />
        <MetricsCard
          title="Conversion Rate"
          value={conversionRateFormatted}
          change={{
            value: 2.3,
            isPositive: true,
          }}
        />
        <MetricsCard
          title="Total Conversations"
          value={analytics.conversationCount}
          change={{
            value: 8.1,
            isPositive: true,
          }}
        />
        <MetricsCard
          title="Average Deal Size"
          value="$45,000"
          change={{
            value: 15.4,
            isPositive: true,
          }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-navy-900 mb-4">
            Monthly Trends
          </h3>
          <LineChart data={monthlyData} height={300} />
        </div>

        {/* Lead Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-navy-900 mb-4">
            Lead Status Distribution
          </h3>
          <DoughnutChart data={leadStatusData} height={300} />
        </div>

        {/* Project Type Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-navy-900 mb-4">
            Project Type Distribution
          </h3>
          <DoughnutChart data={projectTypeData} height={300} />
        </div>

        {/* Budget Range Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-navy-900 mb-4">
            Budget Range Distribution
          </h3>
          <DoughnutChart
            data={{
              labels: Object.keys(analytics.budgetRangeDistribution),
              datasets: [{
                data: Object.values(analytics.budgetRangeDistribution),
                backgroundColor: [
                  CHART_COLORS.navy,
                  CHART_COLORS.blue,
                  CHART_COLORS.gold,
                  CHART_COLORS.green,
                  CHART_COLORS.purple,
                ],
              }],
            }}
            height={300}
          />
        </div>
      </div>
    </div>
  )
}
