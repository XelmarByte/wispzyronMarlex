import type { ComponentProps, ComponentType } from 'react'
import {
  CreditCardIcon,
  HeadsetIcon,
  NoteIcon,
  UsersIcon,
} from '@/components/icons'
import type { ActivityChartPoint } from '@/components/dashboard/activity-chart'
import type { MetricTrend } from '@/components/dashboard/metric-card'
import type { NetworkStatusItem } from '@/components/dashboard/network-status'
import type { RecentActivityItem } from '@/components/dashboard/recent-activity'
import type { SupportTicket } from '@/components/dashboard/support-summary'

type DashboardIcon = ComponentType<ComponentProps<'svg'>>

export type DashboardActivityMetric = 'clients' | 'revenue' | 'traffic'

export interface DashboardMetric {
  icon: DashboardIcon
  label: string
  trend: MetricTrend
  value: string
}

export interface DashboardActivitySummary {
  change: string
  label: string
  tone: 'positive' | 'warning'
  value: string
}

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: 'Clientes activos',
    value: '1,284',
    icon: UsersIcon,
    trend: {
      label: '↗ +4.8% vs. período anterior',
      tone: 'positive',
    },
  },
  {
    label: 'Ingresos del mes',
    value: 'S/ 84.6K',
    icon: NoteIcon,
    trend: {
      label: '↗ +8.2% vs. período anterior',
      tone: 'positive',
    },
  },
  {
    label: 'Pagos pendientes',
    value: 'S/ 4.8K',
    icon: CreditCardIcon,
    trend: {
      label: '18 cuentas vs. período anterior',
      tone: 'neutral',
    },
  },
  {
    label: 'Tickets activos',
    value: '16',
    icon: HeadsetIcon,
    trend: {
      label: '5 críticos vs. período anterior',
      tone: 'warning',
    },
  },
]

export const activityData: Record<
  DashboardActivityMetric,
  ActivityChartPoint[]
> = {
  clients: [
    { label: '01', value: 52 },
    { label: '06', value: 76 },
    { label: '12', value: 96 },
    { label: '18', value: 112 },
    { label: '24', value: 138 },
    { label: '30', value: 145 },
  ],
  revenue: [
    { label: '01', value: 18 },
    { label: '06', value: 26 },
    { label: '12', value: 34 },
    { label: '18', value: 48 },
    { label: '24', value: 61 },
    { label: '30', value: 84.6 },
  ],
  traffic: [
    { label: '01', value: 8.2 },
    { label: '06', value: 10.4 },
    { label: '12', value: 11.8 },
    { label: '18', value: 14.1 },
    { label: '24', value: 16.5 },
    { label: '30', value: 18.7 },
  ],
}

export const activitySummaries: Record<
  DashboardActivityMetric,
  DashboardActivitySummary
> = {
  clients: {
    label: 'Nuevos clientes',
    value: '148',
    change: '+12.4%',
    tone: 'positive',
  },
  revenue: {
    label: 'Ingresos acumulados',
    value: 'S/ 84.6K',
    change: '+8.2%',
    tone: 'positive',
  },
  traffic: {
    label: 'Tráfico consumido',
    value: '18.7 TB',
    change: '+5.1%',
    tone: 'warning',
  },
}

export const networkStatusItems: NetworkStatusItem[] = [
  {
    label: 'Routers activos',
    value: '42 / 45',
    tone: 'success',
  },
  {
    label: 'Nodos con alertas',
    value: '2',
    tone: 'warning',
  },
  {
    label: 'Dispositivos sin conexión',
    value: '3',
    tone: 'danger',
  },
  {
    label: 'Técnicos activos',
    value: '8',
    tone: 'info',
  },
]

export const recentActivityItems: RecentActivityItem[] = [
  {
    id: 'payment',
    activity: 'Pago registrado',
    detail: 'Cliente #C-1284',
    status: {
      label: 'S/ 89.00',
      variant: 'success',
    },
    time: 'Hace 4 min',
  },
  {
    id: 'client',
    activity: 'Cliente activado',
    detail: 'Internet 300 Mbps',
    status: {
      label: 'Nuevo',
      variant: 'info',
    },
    time: 'Hace 17 min',
  },
  {
    id: 'ticket',
    activity: 'Ticket escalado',
    detail: '#TK-0428',
    status: {
      label: 'Crítico',
      variant: 'error',
    },
    time: 'Hace 26 min',
  },
  {
    id: 'router',
    activity: 'Router actualizado',
    detail: 'MikroTik RB5009',
    status: {
      label: 'Online',
      variant: 'success',
    },
    time: 'Hace 48 min',
  },
  {
    id: 'invoice',
    activity: 'Factura generada',
    detail: 'Cliente #C-1210',
    status: {
      label: 'S/ 120.00',
      variant: 'outline',
    },
    time: 'Hace 1 h',
  },
]

export const supportTickets: SupportTicket[] = [
  {
    id: 'TK-0428',
    title: 'Cliente sin conexión',
    location: 'Los Olivos',
    time: 'Hace 12 min',
    priority: {
      label: 'Crítico',
      variant: 'error',
    },
  },
  {
    id: 'TK-0427',
    title: 'Intermitencia de servicio',
    location: 'San Martín',
    time: 'Hace 28 min',
    priority: {
      label: 'Alta',
      variant: 'warning',
    },
  },
  {
    id: 'TK-0424',
    title: 'Cambio de router',
    location: 'Centro',
    time: 'Hace 1 h',
    priority: {
      label: 'Normal',
      variant: 'outline',
    },
  },
  {
    id: 'TK-0419',
    title: 'Consulta de facturación',
    location: 'Remoto',
    time: 'Hace 2 h',
    priority: {
      label: 'Normal',
      variant: 'outline',
    },
  },
]
