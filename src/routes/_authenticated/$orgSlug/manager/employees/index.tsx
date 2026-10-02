import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { EmployeesPage } from '@/modules/manager/employees/employees-page'
import { hasMembershipPermission } from '@/data/membership-access'
import { isManagementRole } from '@/data/organization-roles'
import { useDemoAccount } from '@/providers/demo-account-context'
import { getWorkspaceAccess } from '@/data/workspace-route-access'

export const Route = createFileRoute(
  '/_authenticated/$orgSlug/manager/employees/',
)({
  beforeLoad: ({ context, params }) => {
    const access = getWorkspaceAccess(context.accountState, params.orgSlug)

    if (
      access === null ||
      !isManagementRole(access.membership.role) ||
      !hasMembershipPermission(access.membership, 'employees.read')
    ) {
      throw redirect({
        to: '/organizations',
      })
    }
  },
  component: EmployeesRoute,
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

function EmployeesRoute() {
  const navigate = useNavigate()
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

  if (organization === undefined || membership === undefined) {
    return null
  }

  const memberships = state.memberships.filter(
    (item) => item.organizationId === organization.id,
  )

  const invitations = state.invitations.filter(
    (item) => item.organizationId === organization.id,
  )

  const handleInviteClick = () => {
    void navigate({
      to: '/$orgSlug/manager/employees/new',
      params: {
        orgSlug,
      },
    })
  }

  const customRoles = (state.customRoles ?? []).filter(
    (role) => role.organizationId === organization.id,
  )

  return (
    <EmployeesPage
      currentAccount={state.account}
      organizationName={organization.name}
      memberships={memberships}
      invitations={invitations}
      canInvite={hasMembershipPermission(membership, 'employees.invite')}
      onInviteClick={handleInviteClick}
      customRoles={customRoles}
    />
  )
}
