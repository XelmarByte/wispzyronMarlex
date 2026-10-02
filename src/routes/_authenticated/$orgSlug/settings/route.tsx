import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { OrganizationSettingsLayout } from '@/modules/manager/settings/organization-settings-layout'
import { useDemoAccount } from '@/providers/demo-account-context'
import {
  getSystemOrganizationRoleLabel,
  isManagementRole,
} from '@/data/organization-roles'
import { hasMembershipModuleAccess } from '@/data/membership-access'
import { getWorkspaceAccess } from '@/data/workspace-route-access'

export const Route = createFileRoute('/_authenticated/$orgSlug/settings')({
  beforeLoad: ({ context, params }) => {
    const access = getWorkspaceAccess(context.accountState, params.orgSlug)

    if (
      access === null ||
      !isManagementRole(access.membership.role) ||
      !hasMembershipModuleAccess(access.membership, 'settings')
    ) {
      throw redirect({
        to: '/organizations',
      })
    }
  },
  component: OrganizationSettingsRoute,
})

function getOrgSlug(routeParams: unknown): string {
  if (
    typeof routeParams === 'object' &&
    routeParams !== null &&
    'orgSlug' in routeParams &&
    typeof routeParams.orgSlug === 'string'
  ) {
    return routeParams.orgSlug
  }

  return ''
}

function OrganizationSettingsRoute() {
  const routeParams: unknown = Route.useParams()
  const orgSlug = getOrgSlug(routeParams)

  const { state } = useDemoAccount()

  const organization = state.organizations.find((item) => item.slug === orgSlug)

  const membership = organization
    ? state.memberships.find(
        (item) =>
          item.accountId === state.account.id &&
          item.organizationId === organization.id,
      )
    : undefined

  if (
    organization === undefined ||
    membership === undefined ||
    !isManagementRole(membership.role) ||
    !hasMembershipModuleAccess(membership, 'settings')
  ) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background p-6">
        <section className="w-full max-w-md rounded-popover border border-border bg-surface p-6 shadow-overlay">
          <p className="text-sm font-medium text-muted-foreground">
            Acceso restringido
          </p>

          <h1 className="mt-2 text-xl font-semibold tracking-tight">
            No tienes acceso a esta configuración.
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            La configuración de empresa está disponible solo para propietarios y
            gerentes autorizados.
          </p>

          <Link
            to="/organizations"
            className="mt-6 inline-flex h-9 items-center rounded-control border border-border bg-surface px-3 text-sm font-medium text-foreground transition-colors hover:bg-hover"
          >
            Volver a organizaciones
          </Link>
        </section>
      </main>
    )
  }

  const role = getSystemOrganizationRoleLabel(membership.role)

  return (
    <div className="min-h-svh bg-background">
      <header className="flex h-13 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
        <Link
          to="/$orgSlug/manager"
          params={{ orgSlug }}
          className="rounded-control text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          ← Volver al panel
        </Link>

        <div className="text-right">
          <p className="text-xs font-medium text-foreground">
            {organization.name}
          </p>

          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </header>

      <main>
        <OrganizationSettingsLayout
          orgSlug={orgSlug}
          organizationName={organization.name}
        >
          <Outlet />
        </OrganizationSettingsLayout>
      </main>
    </div>
  )
}
