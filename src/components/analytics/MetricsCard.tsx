type MetricsCardProps = {
  title: string
  value: string | number
  change?: {
    value: number
    isPositive: boolean
  }
  icon?: React.ReactNode
}

export function MetricsCard({ title, value, change, icon }: MetricsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-navy-500">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold text-navy-900">
            {value}
          </p>
        </div>
        {icon && (
          <div className="rounded-full p-3 bg-navy-50">
            {icon}
          </div>
        )}
      </div>
      {change && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${
            change.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
          </span>
          <span className="ml-2 text-sm text-navy-500">
            vs last period
          </span>
        </div>
      )}
    </div>
  )
}
