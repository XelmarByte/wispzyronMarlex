import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { BuildingsIcon } from '@/components/icons'
import { ActivityChart } from '@/components/dashboard/activity-chart'
import { DashboardPanel } from '@/components/dashboard/dashboard-panel'
import { MetricCard } from '@/components/dashboard/metric-card'
import { NetworkStatus } from '@/components/dashboard/network-status'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { SupportSummary } from '@/components/dashboard/support-summary'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  activityData,
  activitySummaries,
  dashboardMetrics,
  networkStatusItems,
  recentActivityItems,
  supportTickets,
  type DashboardActivityMetric,
} from '@/data/dashboard-demo'
import { cn } from '@/lib/utils'

type DashboardPeriod = '24h' | '7d' | '30d' | '90d'

const dashboardPeriods: DashboardPeriod[] = ['24h', '7d', '30d', '90d']

const activityMetrics: DashboardActivityMetric[] = [
  'clients',
  'revenue',
  'traffic',
]

const periodDescriptions: Record<DashboardPeriod, string> = {
  '24h': 'últimas 24 horas',
  '7d': 'últimos 7 días',
  '30d': 'últimos 30 días',
  '90d': 'últimos 90 días',
}

export const Route = createFileRoute('/_authenticated/$orgSlug/employee/')({
  component: EmployeeDashboardPage,
})

function EmployeeDashboardPage() {
  const { orgSlug } = Route.useParams()
  const [activityMetric, setActivityMetric] =
    useState<DashboardActivityMetric>('clients')
  const [period, setPeriod] = useState<DashboardPeriod>('30d')
  const [lastUpdated, setLastUpdated] = useState('Hace 1 min')

  const organizationName =
    orgSlug === 'novaspeed' ? 'NovaSpeed' : 'WispZyron Telecom'

  return (
    <main className="mx-auto w-full max-w-[1440px] p-4 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-xl font-medium text-foreground">Dashboard</h1>

          <p className="mt-1 text-sm text-muted">
            Resumen operativo de la organización y estado actual del servicio.
          </p>
        </div>

        <div
          className="inline-flex w-fit items-center rounded-control border border-border bg-surface p-0.5"
          role="group"
          aria-label="Período del dashboard"
        >
          {dashboardPeriods.map((dashboardPeriod) => (
            <Button
              key={dashboardPeriod}
              type="button"
              size="sm"
              variant="ghost"
              aria-pressed={period === dashboardPeriod}
              className={cn(
                'h-7 px-2 text-xs',
                period === dashboardPeriod && 'bg-hover text-foreground',
              )}
              onClick={() => setPeriod(dashboardPeriod)}
            >
              {dashboardPeriod}
            </Button>
          ))}

          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs"
            onClick={() => setLastUpdated('Ahora')}
          >
            Actualizar
          </Button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 rounded-control border border-border bg-surface px-3 py-2">
        <p className="flex min-w-0 items-center gap-2 text-xs text-muted">
          <BuildingsIcon className="size-4 shrink-0" aria-hidden="true" />

          <span className="truncate">
            Organización{' '}
            <strong className="font-medium text-foreground">
              {organizationName}
            </strong>
          </span>
        </p>

        <p className="shrink-0 text-xs text-muted">
          Última actualización: {lastUpdated}
        </p>
      </div>

      <section
        className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Métricas principales"
      >
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
        <Tabs value={activityMetric} onValueChange={setActivityMetric}>
          <DashboardPanel
            title="Actividad"
            description={`Datos de los ${periodDescriptions[period]}`}
            actions={
              <TabsList aria-label="Métrica de actividad">
                <TabsTrigger value="clients">Clientes</TabsTrigger>
                <TabsTrigger value="revenue">Ingresos</TabsTrigger>
                <TabsTrigger value="traffic">Tráfico</TabsTrigger>
              </TabsList>
            }
          >
            {activityMetrics.map((metric) => {
              const summary = activitySummaries[metric]

              return (
                <TabsContent key={metric} value={metric} className="p-3">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted">{summary.label}</p>

                      <p className="mt-1 text-2xl font-medium tracking-tight text-foreground">
                        {summary.value}
                      </p>
                    </div>

                    <p
                      className={cn(
                        'text-xs font-medium',
                        summary.tone === 'positive'
                          ? 'text-success'
                          : 'text-warning',
                      )}
                    >
                      ↗ {summary.change}
                    </p>
                  </div>

                  <ActivityChart
                    className="mt-3"
                    ariaLabel={`${summary.label} durante los ${periodDescriptions[period]}`}
                    data={activityData[metric]}
                  />
                </TabsContent>
              )
            })}
          </DashboardPanel>
        </Tabs>

        <DashboardPanel
          title="Estado de la red"
          description="Infraestructura operativa"
        >
          <NetworkStatus availability="99.72%" items={networkStatusItems} />
        </DashboardPanel>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
        <DashboardPanel
          title="Actividad reciente"
          description="Últimos cambios operativos"
          actions={
            <Link
              to="/$orgSlug/employee/$"
              params={{
                orgSlug,
                _splat: 'activity',
              }}
              className="text-xs font-medium text-foreground hover:underline"
            >
              Ver todo
            </Link>
          }
        >
          <RecentActivity items={recentActivityItems} />
        </DashboardPanel>

        <DashboardPanel
          title="Soporte"
          description="Tickets que requieren atención"
          actions={
            <Link
              to="/$orgSlug/employee/$"
              params={{
                orgSlug,
                _splat: 'support',
              }}
              className="text-xs font-medium text-foreground hover:underline"
            >
              Ver tickets
            </Link>
          }
        >
          <SupportSummary tickets={supportTickets} />
        </DashboardPanel>
      </section>
    </main>
  )
}
