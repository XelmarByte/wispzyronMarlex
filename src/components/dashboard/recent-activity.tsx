import { Badge } from '@/components/ui/badge'

type ActivityStatusVariant =
  'error' | 'info' | 'outline' | 'success' | 'warning'

export interface RecentActivityItem {
  activity: string
  detail: string
  id: string
  status: {
    label: string
    variant: ActivityStatusVariant
  }
  time: string
}

interface RecentActivityProps {
  items: RecentActivityItem[]
}

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-150 text-left">
        <caption className="sr-only">
          Actividad reciente de la organización
        </caption>

        <thead className="border-b border-border">
          <tr className="text-xs text-muted">
            <th scope="col" className="px-3 py-2 font-medium">
              Actividad
            </th>

            <th scope="col" className="px-3 py-2 font-medium">
              Detalle
            </th>

            <th scope="col" className="px-3 py-2 font-medium">
              Estado
            </th>

            <th scope="col" className="px-3 py-2 text-right font-medium">
              Tiempo
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-border last:border-b-0 hover:bg-hover"
            >
              <td className="whitespace-nowrap px-3 py-3 text-xs font-medium text-foreground">
                {item.activity}
              </td>

              <td className="whitespace-nowrap px-3 py-3 text-xs text-muted">
                {item.detail}
              </td>

              <td className="whitespace-nowrap px-3 py-3">
                <Badge variant={item.status.variant}>{item.status.label}</Badge>
              </td>

              <td className="whitespace-nowrap px-3 py-3 text-right text-xs text-muted">
                {item.time}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
