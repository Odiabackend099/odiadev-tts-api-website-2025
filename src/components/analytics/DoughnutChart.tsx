import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const defaultOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
    },
  },
}

type DoughnutChartProps = {
  data: ChartData<'doughnut'>
  options?: ChartOptions<'doughnut'>
  height?: number
}

export function DoughnutChart({ data, options = {}, height = 300 }: DoughnutChartProps) {
  return (
    <div style={{ height }}>
      <Doughnut
        data={data}
        options={{
          ...defaultOptions,
          ...options,
        }}
      />
    </div>
  )
}
