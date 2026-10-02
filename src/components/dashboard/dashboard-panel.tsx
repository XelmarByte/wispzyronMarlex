import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DashboardPanelProps {
  actions?: ReactNode
  children: ReactNode
  className?: string
  description?: string
  title: string
}

export function DashboardPanel({
  actions,
  children,
  className,
  description,
  title,
}: DashboardPanelProps) {
  const titleId = useId()

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        'overflow-hidden rounded-popover border border-border bg-surface',
        className,
      )}
    >
      <header className="flex min-h-12 items-center justify-between gap-3 border-b border-border px-3">
        <div className="min-w-0">
          <h2 id={titleId} className="text-sm font-medium text-foreground">
            {title}
          </h2>

          {description ? (
            <p className="mt-0.5 text-xs text-muted">{description}</p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </header>

      {children}
    </section>
  )
}
