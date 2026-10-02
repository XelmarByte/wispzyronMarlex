import { Badge } from '@/components/ui/badge'
import type { CustomOrganizationRole } from '@/data/custom-organization-roles'
import { systemOrganizationRoleTemplates } from '@/data/organization-role-templates'
import type { OrganizationWorkspace } from '@/data/organization-roles'
import { PlusIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

interface OrganizationRolesPageProps {
  customRoles: CustomOrganizationRole[]
  organizationName: string
  onCreateClick: () => void
}

function getWorkspaceLabel(workspace: OrganizationWorkspace): string {
  return workspace === 'manager' ? 'Panel de gerente' : 'Espacio de empleado'
}

export function OrganizationRolesPage({
  customRoles,
  organizationName,
  onCreateClick,
}: OrganizationRolesPageProps) {
  return (
    <div className="mx-auto w-full max-w-5xl p-6 sm:p-8">
      <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted">Equipo</p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Roles y permisos
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Define qué puede consultar y gestionar cada persona en{' '}
            {organizationName}.
          </p>
        </div>

        <Button className="gap-2" onClick={onCreateClick}>
          <PlusIcon className="size-4" aria-hidden="true" />
          Crear rol
        </Button>
      </header>

      <section className="mt-8">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Roles del sistema
          </h2>

          <p className="mt-1 text-sm text-muted">
            Son los niveles base de acceso de WispZyron.
          </p>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {systemOrganizationRoleTemplates.map((role) => (
            <article
              key={role.id}
              className="rounded-popover border border-border bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {role.label}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-muted">
                    {role.description}
                  </p>
                </div>

                <Badge variant="secondary">Sistema</Badge>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
                <div>
                  <dt className="text-xs text-muted">Espacio</dt>

                  <dd className="mt-1 text-sm font-medium text-foreground">
                    {getWorkspaceLabel(role.workspace)}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-muted">Permisos</dt>

                  <dd className="mt-1 text-sm font-medium text-foreground">
                    {role.permissionKeys.length}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Roles personalizados
          </h2>

          <p className="mt-1 text-sm text-muted">
            Plantillas creadas específicamente para esta organización.
          </p>
        </div>

        {customRoles.length > 0 ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {customRoles.map((role) => (
              <article
                key={role.id}
                className="rounded-popover border border-border bg-surface p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {role.name}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-muted">
                      {role.description || 'Sin descripción.'}
                    </p>
                  </div>

                  <Badge variant="beta">Personalizado</Badge>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
                  <div>
                    <dt className="text-xs text-muted">Espacio</dt>

                    <dd className="mt-1 text-sm font-medium text-foreground">
                      {getWorkspaceLabel(role.workspace)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-muted">Permisos</dt>

                    <dd className="mt-1 text-sm font-medium text-foreground">
                      {role.permissionKeys.length}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-popover border border-dashed border-border bg-surface px-5 py-10 text-center">
            <p className="text-sm font-medium text-foreground">
              Aún no hay roles personalizados
            </p>

            <p className="mt-1 text-sm text-muted">
              Podrás crear plantillas como Técnico de campo, Soporte o
              Facturación.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
