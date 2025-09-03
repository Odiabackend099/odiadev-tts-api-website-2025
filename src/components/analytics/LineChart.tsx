import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const defaultOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#f1f5f9',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
}

type LineChartProps = {
  data: ChartData<'line'>
  options?: ChartOptions<'line'>
  height?: number
}

export function LineChart({ data, options = {}, height = 300 }: LineChartProps) {
  return (
    <div style={{ height }}>
      <Line
        data={data}
        options={{
          ...defaultOptions,
          ...options,
        }}
      />
    </div>
  )
}
