import { createFileRoute } from '@tanstack/react-router'
import { OrganizationBrandingPage } from '@/modules/manager/settings/organization-branding-page'
import { useDemoAccount } from '@/providers/demo-account-context'

export const Route = createFileRoute(
  '/_authenticated/$orgSlug/settings/branding',
)({
  component: OrganizationBrandingRoute,
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

function OrganizationBrandingRoute() {
  const routeParams: unknown = Route.useParams()
  const orgSlug = getOrgSlug(routeParams)

  const { state, updateOrganizationBranding } = useDemoAccount()

  const organization = state.organizations.find((item) => item.slug === orgSlug)

  if (organization === undefined) {
    return null
  }

  return (
    <OrganizationBrandingPage
      organization={organization}
      onSave={(branding) => {
        updateOrganizationBranding(organization.id, branding)
      }}
    />
  )
}
