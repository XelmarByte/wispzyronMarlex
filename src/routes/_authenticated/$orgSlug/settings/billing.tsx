import { createFileRoute } from '@tanstack/react-router'
import { OrganizationBillingPage } from '@/modules/manager/settings/organization-billing-page'
import { useDemoAccount } from '@/providers/demo-account-context'

export const Route = createFileRoute(
  '/_authenticated/$orgSlug/settings/billing',
)({
  component: OrganizationBillingRoute,
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

function OrganizationBillingRoute() {
  const routeParams: unknown = Route.useParams()
  const orgSlug = getOrgSlug(routeParams)

  const { state } = useDemoAccount()

  const organization = state.organizations.find((item) => item.slug === orgSlug)

  if (organization === undefined) {
    return null
  }

  return <OrganizationBillingPage organization={organization} />
}
