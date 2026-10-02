import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  getOrganizationPlan,
  type OrganizationDraft,
} from '@/data/demo-organization'

interface OrganizationReviewPageProps {
  draft: OrganizationDraft
  onBack: () => void
  onContinue: () => void
}

function formatPrice(amount: number, currency: 'PEN') {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function OrganizationReviewPage({
  draft,
  onBack,
  onContinue,
}: OrganizationReviewPageProps) {
  if (!draft.plan) {
    return null
  }

  const plan = getOrganizationPlan(draft.plan)
  const isSelfAdministrator = draft.primaryAdministratorMode === 'self'

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col px-6 py-10 sm:px-8">
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-control border border-border bg-surface">
              <span className="size-4 rounded-[4px] bg-primary" />
            </span>

            <div>
              <p className="text-sm font-medium leading-none">WispZyron</p>

              <p className="mt-1 text-xs text-muted">Crear organización</p>
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-xs text-muted">Paso 4 de 5</p>

            <div className="mt-2 flex items-center gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-primary" />
              <span className="h-1.5 w-8 rounded-full bg-primary" />
              <span className="h-1.5 w-8 rounded-full bg-primary" />
              <span className="h-1.5 w-8 rounded-full bg-primary" />
              <span className="h-1.5 w-8 rounded-full bg-hover" />
            </div>
          </div>
        </header>

        <section className="mx-auto w-full max-w-2xl flex-1">
          <div className="mb-9">
            <p className="mb-3 text-sm font-medium text-muted">
              Revisión final
            </p>

            <h1 className="text-3xl font-semibold tracking-tight">
              Revisa tu organización
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
              Confirma los datos antes de continuar a la confirmación de pago.
            </p>
          </div>

          <div className="overflow-hidden rounded-popover border border-border bg-surface">
            <section className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">{draft.companyName}</p>

                  <p className="mt-1 text-sm text-muted">
                    /{draft.slug}/manager
                  </p>
                </div>

                <Badge variant="success">Nueva organización</Badge>
              </div>

              <dl className="mt-6 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted">País</dt>

                  <dd className="mt-1 font-medium">{draft.country}</dd>
                </div>

                <div>
                  <dt className="text-muted">Teléfono principal</dt>

                  <dd className="mt-1 font-medium">
                    {draft.phone || 'Sin registrar'}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted">RUC o identificador fiscal</dt>

                  <dd className="mt-1 font-medium">
                    {draft.taxId || 'Sin registrar'}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted">Ciclo de facturación</dt>

                  <dd className="mt-1 font-medium">
                    {draft.billingCycle === 'annual' ? 'Anual' : 'Mensual'}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="border-t border-border p-5">
              <p className="text-sm font-semibold">Plan seleccionado</p>

              <div className="mt-4 flex items-center justify-between gap-5 rounded-control border border-border bg-background px-4 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{plan.name}</p>

                    {plan.aiEnabled ? <Badge variant="beta">AI</Badge> : null}
                  </div>

                  <p className="mt-1 text-xs text-muted">{plan.description}</p>
                </div>

                <p className="shrink-0 text-sm font-semibold">
                  {formatPrice(plan.monthlyPrice, plan.currency)}
                  <span className="font-normal text-muted"> / mes</span>
                </p>
              </div>
            </section>

            <section className="border-t border-border p-5">
              <p className="text-sm font-semibold">Accesos iniciales</p>

              <dl className="mt-4 divide-y divide-border rounded-control border border-border">
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <div>
                    <dt className="text-sm font-medium">{draft.ownerName}</dt>

                    <dd className="mt-1 text-xs text-muted">
                      {draft.ownerEmail}
                    </dd>
                  </div>

                  <Badge variant="warning">Propietario</Badge>
                </div>

                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <div>
                    <dt className="text-sm font-medium">
                      {isSelfAdministrator
                        ? draft.ownerName
                        : draft.administratorName}
                    </dt>

                    <dd className="mt-1 text-xs text-muted">
                      {isSelfAdministrator
                        ? 'El propietario administrará la operación inicial.'
                        : draft.administratorEmail}
                    </dd>
                  </div>

                  <Badge variant={isSelfAdministrator ? 'info' : 'secondary'}>
                    {isSelfAdministrator
                      ? 'Administrador principal'
                      : 'Invitación pendiente'}
                  </Badge>
                </div>
              </dl>
            </section>
          </div>

          <div className="mt-5 rounded-control border border-border bg-surface px-4 py-3">
            <p className="text-xs leading-5 text-muted">
              Si invitaste a un administrador, la invitación se preparará al
              completar la creación. Podrás invitar empleados y asignar roles
              desde el panel de gerente en cualquier momento.
            </p>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="ghost" onClick={onBack}>
              Atrás
            </Button>

            <Button onClick={onContinue}>Continuar al pago</Button>
          </div>
        </section>
      </div>
    </main>
  )
}
