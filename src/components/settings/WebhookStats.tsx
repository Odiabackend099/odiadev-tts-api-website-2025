import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import type { ChartData } from 'chart.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useQuery } from '@tanstack/react-query'
import { getWebhookStats } from '../../lib/automation'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export function WebhookStats({ webhookId }: { webhookId: string }) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['webhook-stats', webhookId],
    queryFn: () => getWebhookStats(webhookId),
  })

  const chartData: ChartData<'line'> = useMemo(() => {
    if (!stats?.stats) {
      return {
        labels: [],
        datasets: [],
      }
    }

    // Group by day
    const dailyStats = stats.stats.reduce((acc, log) => {
      const date = new Date(log.delivered_at).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { success: 0, failure: 0 }
      }
      if (log.response_status && log.response_status < 400) {
        acc[date].success++
      } else {
        acc[date].failure++
      }
      return acc
    }, {} as Record<string, { success: number, failure: number }>)

    const dates = Object.keys(dailyStats).sort()
    const successData = dates.map(date => dailyStats[date].success)
    const failureData = dates.map(date => dailyStats[date].failure)

    return {
      labels: dates,
      datasets: [
        {
          label: 'Successful Deliveries',
          data: successData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.2,
        },
        {
          label: 'Failed Deliveries',
          data: failureData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.2,
        },
      ],
    }
  }, [stats])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Webhook Performance',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-64 bg-navy-200 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-50 p-4 rounded-lg">
            <p className="text-sm text-emerald-600 font-medium">Success Rate</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-700">
              {stats?.stats ? Math.round((stats.stats.success / stats.stats.total) * 100) : 0}%
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Failure Rate</p>
            <p className="mt-2 text-2xl font-semibold text-red-700">
              {stats?.stats ? Math.round((stats.stats.failure / stats.stats.total) * 100) : 0}%
            </p>
          </div>
          <div className="bg-navy-50 p-4 rounded-lg">
            <p className="text-sm text-navy-600 font-medium">Total Deliveries</p>
            <p className="mt-2 text-2xl font-semibold text-navy-700">
              {stats?.stats?.total || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="h-64">
        <Line options={options} data={chartData} />
      </div>

      {stats?.stats?.lastDelivery && (
        <p className="mt-4 text-sm text-navy-500">
          Last delivery: {new Date(stats.stats.lastDelivery).toLocaleString()}
        </p>
      )}
    </div>
  )
}
