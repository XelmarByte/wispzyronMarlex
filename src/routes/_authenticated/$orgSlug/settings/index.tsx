import { createFileRoute } from '@tanstack/react-router'
import { OrganizationSettingsPage } from '@/modules/manager/settings/organization-settings-page'
import { useDemoAccount } from '@/providers/demo-account-context'

export const Route = createFileRoute('/_authenticated/$orgSlug/settings/')({
  component: OrganizationSettingsIndexRoute,
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

function OrganizationSettingsIndexRoute() {
  const routeParams: unknown = Route.useParams()
  const orgSlug = getOrgSlug(routeParams)

  const { state, updateOrganizationSettings } = useDemoAccount()

  const organization = state.organizations.find((item) => item.slug === orgSlug)

  if (organization === undefined) {
    return null
  }

  return (
    <OrganizationSettingsPage
      organization={organization}
      onSave={(updates) => {
        updateOrganizationSettings(organization.id, updates)
      }}
    />
  )
}
