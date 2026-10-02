import { createFileRoute, redirect } from '@tanstack/react-router'
import { InviteEmployeePage } from '@/modules/manager/employees/invite-employee-page'
import { hasMembershipPermission } from '@/data/membership-access'
import { isManagementRole } from '@/data/organization-roles'
import { useDemoAccount } from '@/providers/demo-account-context'
import { getWorkspaceAccess } from '@/data/workspace-route-access'

export const Route = createFileRoute(
  '/_authenticated/$orgSlug/manager/employees/new',
)({
  beforeLoad: ({ context, params }) => {
    const access = getWorkspaceAccess(context.accountState, params.orgSlug)

    if (
      access === null ||
      !isManagementRole(access.membership.role) ||
      !hasMembershipPermission(access.membership, 'employees.invite')
    ) {
      throw redirect({
        to: '/organizations',
      })
    }
  },
  component: NewEmployeeInvitationRoute,
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

function NewEmployeeInvitationRoute() {
  const routeParams: unknown = Route.useParams()
  const orgSlug = getOrgSlug(routeParams)

  const { createInvitation, state } = useDemoAccount()

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

  const customRoles = (state.customRoles ?? []).filter(
    (role) => role.organizationId === organization.id,
  )

  const canManageRoles = hasMembershipPermission(membership, 'roles.manage')

  return (
    <InviteEmployeePage
      organizationId={organization.id}
      organizationName={organization.name}
      inviterName={state.account.name}
      customRoles={customRoles}
      canManageRoles={canManageRoles}
      onCreateInvitation={createInvitation}
    />
  )
}
