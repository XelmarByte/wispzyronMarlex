import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { hasMembershipPermission } from '@/data/membership-access'
import { CreateOrganizationRolePage } from '@/modules/iam/roles/create-organization-role-page'
import { useDemoAccount } from '@/providers/demo-account-context'
import { getWorkspaceAccess } from '@/data/workspace-route-access'

export const Route = createFileRoute(
  '/_authenticated/$orgSlug/manager/employees/roles/new',
)({
  beforeLoad: ({ context, params }) => {
    const access = getWorkspaceAccess(context.accountState, params.orgSlug)

    if (
      access === null ||
      !hasMembershipPermission(access.membership, 'roles.manage')
    ) {
      throw redirect({
        to: '/organizations',
      })
    }
  },
  component: NewOrganizationRoleRoute,
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

function NewOrganizationRoleRoute() {
  const navigate = useNavigate()
  const routeParams: unknown = Route.useParams()
  const orgSlug = getOrgSlug(routeParams)

  const { createCustomOrganizationRole, state } = useDemoAccount()

  const organization = state.organizations.find((item) => item.slug === orgSlug)

  if (organization === undefined) {
    return null
  }

  const navigateToRoles = () => {
    void navigate({
      to: '/$orgSlug/manager/employees/roles',
      params: { orgSlug },
    })
  }

  return (
    <CreateOrganizationRolePage
      organizationId={organization.id}
      organizationName={organization.name}
      onCreate={createCustomOrganizationRole}
      onCancel={navigateToRoles}
      onCreated={navigateToRoles}
    />
  )
}
