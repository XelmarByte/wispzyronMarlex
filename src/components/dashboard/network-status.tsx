import { NetworkIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

type NetworkStatusTone = 'success' | 'warning' | 'danger' | 'info'

export interface NetworkStatusItem {
  label: string
  tone: NetworkStatusTone
  value: string
}

interface NetworkStatusProps {
  availability: string
  items: NetworkStatusItem[]
}

const toneClasses: Record<NetworkStatusTone, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
}

export function NetworkStatus({ availability, items }: NetworkStatusProps) {
  return (
    <div className="p-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted">Disponibilidad</p>

          <p className="mt-1 text-2xl font-medium tracking-tight text-foreground">
            {availability}
          </p>
        </div>

        <span className="flex size-9 items-center justify-center rounded-full border-2 border-success text-success">
          <NetworkIcon className="size-4" aria-hidden="true" />
        </span>
      </div>

      <dl className="mt-4 divide-y divide-border border-t border-border">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-3 py-2.5"
          >
            <dt className="flex min-w-0 items-center gap-2 text-xs text-muted">
              <span
                className={cn(
                  'size-1.5 shrink-0 rounded-full',
                  toneClasses[item.tone],
                )}
                aria-hidden="true"
              />

              <span className="truncate">{item.label}</span>
            </dt>

            <dd className="shrink-0 text-xs font-medium text-foreground">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
