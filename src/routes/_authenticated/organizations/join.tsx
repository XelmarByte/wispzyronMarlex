import { JoinOrganizationPage as JoinOrganizationRouteComponent } from '@/components/organizations/join-organization-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/organizations/join')({
  component: JoinOrganizationRouteComponent,
})
