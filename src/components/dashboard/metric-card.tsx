import type { ComponentProps, ComponentType } from 'react'
import { cn } from '@/lib/utils'

export type MetricTrendTone = 'positive' | 'warning' | 'neutral'

type MetricIcon = ComponentType<ComponentProps<'svg'>>

export interface MetricTrend {
  label: string
  tone?: MetricTrendTone
}

interface MetricCardProps {
  className?: string
  icon: MetricIcon
  label: string
  trend?: MetricTrend
  value: string
}

const trendClasses: Record<MetricTrendTone, string> = {
  positive: 'text-success',
  warning: 'text-warning',
  neutral: 'text-muted',
}

export function MetricCard({
  className,
  icon: Icon,
  label,
  trend,
  value,
}: MetricCardProps) {
  const trendTone = trend?.tone ?? 'neutral'

  return (
    <article
      className={cn(
        'min-w-0 rounded-popover border border-border bg-surface p-3.5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-muted">{label}</p>

        <Icon className="size-4 shrink-0 text-muted" aria-hidden="true" />
      </div>

      <p className="mt-2 text-2xl font-medium tracking-tight text-foreground">
        {value}
      </p>

      {trend ? (
        <p className={cn('mt-1 text-xs', trendClasses[trendTone])}>
          {trend.label}
        </p>
      ) : null}
    </article>
  )
}
