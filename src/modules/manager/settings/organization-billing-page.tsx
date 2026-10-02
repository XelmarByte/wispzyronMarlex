import { Badge } from '@/components/ui/badge'
import type { DemoOrganizationRecord } from '@/data/demo-account'
import { getOrganizationPlan } from '@/data/demo-organization'

interface OrganizationBillingPageProps {
  organization: DemoOrganizationRecord
}

function getPaymentMethodLabel(
  method: DemoOrganizationRecord['paymentMethod'],
): string {
  if (method === 'yape') {
    return 'Yape'
  }

  if (method === 'agent-transfer') {
    return 'Transferencia o agente'
  }

  return 'Tarjeta'
}

function getPaymentStatusLabel(
  status: DemoOrganizationRecord['paymentStatus'],
): string {
  return status === 'confirmed' ? 'Confirmado' : 'Pendiente'
}

function getPaymentStatusVariant(
  status: DemoOrganizationRecord['paymentStatus'],
) {
  return status === 'confirmed' ? 'success' : 'warning'
}

export function OrganizationBillingPage({
  organization,
}: OrganizationBillingPageProps) {
  const plan = getOrganizationPlan(organization.plan)
  const billingCycleLabel =
    organization.billingCycle === 'annual' ? 'Anual' : 'Mensual'

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-muted-foreground">
          Configuración de empresa
        </p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight">
          Plan y facturación
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Consulta el plan activo y el estado de facturación de{' '}
          <span className="font-medium text-foreground">
            {organization.name}
          </span>
          .
        </p>
      </header>

      <section className="overflow-hidden rounded-popover border border-border bg-surface shadow-overlay">
        <div className="border-b border-border p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Plan actual</p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-semibold tracking-tight">
                  {plan.name}
                </h3>

                {plan.aiEnabled ? <Badge variant="beta">AI</Badge> : null}
              </div>

              <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                {plan.description}
              </p>
            </div>

            <div className="rounded-control border border-border bg-hover px-4 py-3 text-right">
              <p className="text-xs text-muted-foreground">Desde</p>

              <p className="mt-1 text-lg font-semibold tracking-tight">
                S/ {plan.monthlyPrice}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  / mes
                </span>
              </p>
            </div>
          </div>
        </div>

        <dl className="divide-y divide-border">
          <div className="flex items-center justify-between gap-5 px-5 py-4 sm:px-6">
            <dt>
              <p className="text-sm font-medium">Ciclo de facturación</p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Periodicidad seleccionada durante la creación.
              </p>
            </dt>

            <dd className="text-sm font-medium text-foreground">
              {billingCycleLabel}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-5 px-5 py-4 sm:px-6">
            <dt>
              <p className="text-sm font-medium">Método de pago</p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Método registrado para la suscripción demo.
              </p>
            </dt>

            <dd className="text-right text-sm font-medium text-foreground">
              {getPaymentMethodLabel(organization.paymentMethod)}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-5 px-5 py-4 sm:px-6">
            <dt>
              <p className="text-sm font-medium">Estado del pago</p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Resultado más reciente de la simulación de pago.
              </p>
            </dt>

            <dd>
              <Badge
                variant={getPaymentStatusVariant(organization.paymentStatus)}
                dot
              >
                {getPaymentStatusLabel(organization.paymentStatus)}
              </Badge>
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-popover border border-border bg-surface p-5 shadow-overlay sm:p-6">
        <h3 className="text-sm font-semibold">Administración de facturación</h3>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Los cambios de plan, renovación, comprobantes y métodos de pago se
          conectarán posteriormente al backend y al proveedor de pagos. Por
          ahora esta sección refleja los datos elegidos durante la creación de
          la organización.
        </p>
      </section>
    </div>
  )
}
