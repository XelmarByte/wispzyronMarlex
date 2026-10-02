import { VerifyInvitationPage } from '@/components/invitations/verify-invitation-page'
import type { InvitationSearch } from '@/data/demo-invitations'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/invitations/verify')({
  validateSearch: (search: Record<string, unknown>): InvitationSearch => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
  component: VerifyInvitationPage,
})
