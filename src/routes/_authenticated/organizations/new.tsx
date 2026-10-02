import { createFileRoute } from '@tanstack/react-router'
import { OrganizationCreationFlow } from '@/components/organizations/organization-creation-flow'

export const Route = createFileRoute('/_authenticated/organizations/new')({
  component: NewOrganizationRoute,
})

function NewOrganizationRoute() {
  return <OrganizationCreationFlow />
}
