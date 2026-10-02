import { PlusIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type {
  DemoAccount,
  DemoInvitation,
  DemoMembership,
  MembershipRole,
} from '@/data/demo-account'
import { isManagementRole } from '@/data/organization-roles'
import { isInvitationAvailable } from '@/lib/invitations'
import type { CustomOrganizationRole } from '@/data/custom-organization-roles'
import { getOrganizationRoleAssignmentLabel } from '@/data/organization-role-assignment'

interface EmployeesPageProps {
  currentAccount: DemoAccount
  invitations: DemoInvitation[]
  memberships: DemoMembership[]
  organizationName: string
  canInvite: boolean
  customRoles: CustomOrganizationRole[]
  onInviteClick: () => void
}

function getRoleBadgeVariant(
  role: MembershipRole,
): 'warning' | 'info' | 'secondary' {
  if (role === 'owner') {
    return 'warning'
  }
  if (role === 'administrator') {
    return 'warning'
  }
  if (role === 'manager') {
    return 'info'
  }

  return 'secondary'
}

function getInitials(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')

  return initials || 'MI'
}

function formatExpirationDate(date: string): string {
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function EmployeesPage({
  currentAccount,
  customRoles,
  invitations,
  memberships,
  organizationName,
  onInviteClick,
  canInvite,
}: EmployeesPageProps) {
  const pendingInvitations = invitations.filter(isInvitationAvailable)

  const managerCount = memberships.filter((membership) =>
    isManagementRole(membership.role),
  ).length

  return (
    <div className="mx-auto w-full max-w-5xl p-6 sm:p-8">
      <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted">Equipo</p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Empleados y accesos
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Administra las personas que pueden acceder a {organizationName}.
          </p>
        </div>

        {canInvite ? (
          <Button className="gap-2" onClick={onInviteClick}>
            <PlusIcon className="size-4" aria-hidden="true" />
            Invitar persona
          </Button>
        ) : null}
      </header>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-control border border-border bg-surface p-4">
          <p className="text-xs font-medium text-muted">Miembros activos</p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {memberships.length}
          </p>
        </div>

        <div className="rounded-control border border-border bg-surface p-4">
          <p className="text-xs font-medium text-muted">Administradores</p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {managerCount}
          </p>
        </div>

        <div className="rounded-control border border-border bg-surface p-4">
          <p className="text-xs font-medium text-muted">
            Invitaciones pendientes
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {pendingInvitations.length}
          </p>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-popover border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Miembros</h2>

            <p className="mt-1 text-xs text-muted">
              Personas que ya tienen acceso a la organización.
            </p>
          </div>

          <Badge variant="success" dot>
            {memberships.length} activos
          </Badge>
        </div>

        {memberships.length > 0 ? (
          <div className="divide-y divide-border">
            {memberships.map((membership) => {
              const isCurrentAccount =
                membership.accountId === currentAccount.id

              const memberName = isCurrentAccount
                ? currentAccount.name
                : 'Miembro activo'

              const memberEmail = isCurrentAccount
                ? currentAccount.email
                : 'Perfil disponible al conectar el backend'

              return (
                <div
                  key={membership.id}
                  className="flex items-center gap-3 px-5 py-4"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-control border border-border bg-hover text-xs font-semibold text-foreground">
                    {getInitials(memberName)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {memberName}
                      {isCurrentAccount ? ' · Tú' : null}
                    </p>

                    <p className="truncate text-xs text-muted">{memberEmail}</p>
                  </div>

                  <Badge variant={getRoleBadgeVariant(membership.role)}>
                    {getOrganizationRoleAssignmentLabel(
                      membership,
                      customRoles,
                    )}
                  </Badge>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-medium text-foreground">
              Aún no hay miembros
            </p>

            <p className="mt-1 text-sm text-muted">
              Invita a la primera persona para comenzar a formar tu equipo.
            </p>
          </div>
        )}
      </section>

      <section className="mt-6 overflow-hidden rounded-popover border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Invitaciones pendientes
            </h2>

            <p className="mt-1 text-xs text-muted">
              Se activarán cuando la persona acepte con el correo invitado.
            </p>
          </div>
        </div>

        {pendingInvitations.length > 0 ? (
          <div className="divide-y divide-border">
            {pendingInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center gap-3 px-5 py-4"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-control border border-border bg-hover text-xs font-semibold text-muted">
                  @
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {invitation.recipientEmail}
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    Vence el {formatExpirationDate(invitation.expiresAt)}
                  </p>
                </div>

                <Badge variant={getRoleBadgeVariant(invitation.role)}>
                  {getOrganizationRoleAssignmentLabel(invitation, customRoles)}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-medium text-foreground">
              No hay invitaciones pendientes
            </p>

            <p className="mt-1 text-sm text-muted">
              Las nuevas invitaciones aparecerán aquí hasta ser aceptadas,
              vencidas o revocadas.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
