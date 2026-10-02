import { createFileRoute } from '@tanstack/react-router'
import { OrganizationDomainPage } from '@/modules/manager/settings/organization-domain-page'
import { useDemoAccount } from '@/providers/demo-account-context'

export const Route = createFileRoute(
  '/_authenticated/$orgSlug/settings/domain',
)({
  component: OrganizationDomainRoute,
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

function OrganizationDomainRoute() {
  const routeParams: unknown = Route.useParams()
  const orgSlug = getOrgSlug(routeParams)

  const {
    state,
    confirmOrganizationDomainChange,
    requestOrganizationDomainChange,
  } = useDemoAccount()

  const organization = state.organizations.find((item) => item.slug === orgSlug)

  if (organization === undefined) {
    return null
  }

  return (
    <OrganizationDomainPage
      organization={organization}
      confirmationEmail={state.account.email}
      onRequestChange={(domain) => {
        requestOrganizationDomainChange(organization.id, domain)
      }}
      onConfirmChange={() => {
        confirmOrganizationDomainChange(organization.id)
      }}
    />
  )
}
