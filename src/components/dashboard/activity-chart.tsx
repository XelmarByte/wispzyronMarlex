import { useId } from 'react'
import { cn } from '@/lib/utils'

export interface ActivityChartPoint {
  label: string
  value: number
}

interface ChartPosition {
  x: number
  y: number
}

interface ActivityChartProps {
  ariaLabel: string
  className?: string
  data: ActivityChartPoint[]
}

const chartWidth = 720
const chartHeight = 220

const padding = {
  bottom: 28,
  left: 4,
  right: 4,
  top: 16,
}

export function ActivityChart({
  ariaLabel,
  className,
  data,
}: ActivityChartProps) {
  const gradientId = `activity-gradient-${useId().replace(/:/g, '')}`

  if (data.length < 2) {
    return (
      <p className={cn('p-3 text-sm text-muted', className)}>
        No hay datos suficientes para mostrar el gráfico.
      </p>
    )
  }

  const values = data.map((point) => point.value)
  const minimumValue = Math.min(...values)
  const maximumValue = Math.max(...values)
  const valueRange = maximumValue - minimumValue || 1

  const availableWidth = chartWidth - padding.left - padding.right
  const availableHeight = chartHeight - padding.top - padding.bottom

  const points: ChartPosition[] = data.map((point, index) => ({
    x: padding.left + (availableWidth / (data.length - 1)) * index,
    y:
      padding.top +
      availableHeight -
      ((point.value - minimumValue) / valueRange) * availableHeight,
  }))

  const linePath = points
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
    )
    .join(' ')

  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]
  const baseline = chartHeight - padding.bottom

  const areaPath = [
    linePath,
    `L ${lastPoint.x.toFixed(2)} ${baseline}`,
    `L ${firstPoint.x.toFixed(2)} ${baseline}`,
    'Z',
  ].join(' ')

  const gridLines = Array.from({ length: 4 }, (_, index) => {
    const progress = index / 3

    return padding.top + availableHeight * progress
  })

  return (
    <figure className={cn('min-w-0', className)}>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={ariaLabel}
        className="h-52 w-full overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--chart-primary)"
              stopOpacity="0.2"
            />

            <stop
              offset="100%"
              stopColor="var(--chart-primary)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {gridLines.map((y) => (
          <line
            key={y}
            x1={padding.left}
            x2={chartWidth - padding.right}
            y1={y}
            y2={y}
            stroke="var(--border)"
            strokeWidth="1"
          />
        ))}

        <path d={areaPath} fill={`url(#${gradientId})`} />

        <path
          d={linePath}
          fill="none"
          stroke="var(--chart-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r="3"
          fill="var(--surface)"
          stroke="var(--chart-primary)"
          strokeWidth="2"
        />
      </svg>

      <figcaption
        className="mt-1 grid px-3 text-xs text-muted"
        style={{
          gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))`,
        }}
      >
        {data.map((point) => (
          <span key={point.label} className="text-center">
            {point.label}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}
