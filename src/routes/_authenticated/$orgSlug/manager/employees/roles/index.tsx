import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { hasMembershipPermission } from '@/data/membership-access'
import { OrganizationRolesPage } from '@/modules/iam/roles/organization-roles-page'
import { useDemoAccount } from '@/providers/demo-account-context'
import { getWorkspaceAccess } from '@/data/workspace-route-access'

export const Route = createFileRoute(
  '/_authenticated/$orgSlug/manager/employees/roles/',
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
  component: OrganizationRolesRoute,
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

function OrganizationRolesRoute() {
  const routeParams: unknown = Route.useParams()
  const orgSlug = getOrgSlug(routeParams)

  const { state } = useDemoAccount()

  const organization = state.organizations.find((item) => item.slug === orgSlug)

  const navigate = useNavigate()

  if (organization === undefined) {
    return null
  }

  const customRoles = (state.customRoles ?? []).filter(
    (role) => role.organizationId === organization.id,
  )

  return (
    <OrganizationRolesPage
      organizationName={organization.name}
      customRoles={customRoles}
      onCreateClick={() =>
        void navigate({
          to: '/$orgSlug/manager/employees/roles/new',
          params: { orgSlug },
        })
      }
    />
  )
}
