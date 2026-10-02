import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  getOrganizationPlan,
  type DemoOrganization,
} from '@/data/demo-organization'

interface OrganizationCreatedProps {
  organization: DemoOrganization
  onOpenDashboard: () => void
}

export function OrganizationCreated({
  organization,
  onOpenDashboard,
}: OrganizationCreatedProps) {
  const plan = getOrganizationPlan(organization.plan)
  const administrator = organization.primaryAdministrator
  const administratorStatus =
    administrator.invitationStatus === 'pending'
      ? 'Invitación de gerente preparada'
      : 'Administrador principal configurado'

  return (
    <main className="flex min-h-svh items-center bg-background px-6 py-10 text-foreground">
      <section className="mx-auto w-full max-w-xl">
        <div className="rounded-popover border border-border bg-surface p-6 shadow-overlay sm:p-8">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground">
            ✓
          </span>

          <p className="mt-7 text-sm font-medium text-muted">
            Organización creada
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            ¡Tu organización está lista!
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            <strong>{organization.organizationName}</strong> ya tiene su espacio
            de trabajo preparado en WispZyron.
          </p>

          <div className="mt-7 divide-y divide-border overflow-hidden rounded-control border border-border">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-sm text-muted">Panel</span>

              <span className="text-sm font-medium">
                /{organization.subdomain}/manager
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-sm text-muted">Plan</span>

              <Badge variant="info">{plan.name}</Badge>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-sm text-muted">Propietario</span>

              <span className="text-sm font-medium">
                {organization.ownerName}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-sm text-muted">Administración</span>

              <span className="text-right text-sm font-medium">
                {administratorStatus}
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-control border border-border bg-hover px-4 py-3">
            <p className="text-sm font-medium">Siguiente recomendación</p>

            <p className="mt-1 text-xs leading-5 text-muted">
              Completa la configuración inicial del panel, invita a tu equipo y
              prepara los módulos que utilizará tu empresa.
            </p>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <Button className="w-full" onClick={onOpenDashboard}>
              Ir al panel de gerente
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
