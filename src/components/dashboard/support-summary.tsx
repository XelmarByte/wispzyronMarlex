import { Badge } from '@/components/ui/badge'

type SupportPriority = 'error' | 'outline' | 'warning'

export interface SupportTicket {
  id: string
  location: string
  priority: {
    label: string
    variant: SupportPriority
  }
  time: string
  title: string
}

interface SupportSummaryProps {
  tickets: SupportTicket[]
}

export function SupportSummary({ tickets }: SupportSummaryProps) {
  return (
    <ul className="divide-y divide-border">
      {tickets.map((ticket) => (
        <li key={ticket.id} className="px-3 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">#{ticket.id}</span>

                <Badge variant={ticket.priority.variant}>
                  {ticket.priority.label}
                </Badge>
              </div>

              <h3 className="mt-1 truncate text-sm font-medium text-foreground">
                {ticket.title}
              </h3>

              <p className="mt-0.5 truncate text-xs text-muted">
                {ticket.location}
              </p>
            </div>

            <time className="shrink-0 text-xs text-muted">{ticket.time}</time>
          </div>
        </li>
      ))}
    </ul>
  )
}
