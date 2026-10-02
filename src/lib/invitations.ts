import type { DemoInvitation, InvitationStatus } from '@/data/demo-account'

export const invitationLifetimeMs = 24 * 60 * 60 * 1000

export function isInvitationExpired(
  invitation: DemoInvitation,
  now = Date.now(),
): boolean {
  const expirationTime = Date.parse(invitation.expiresAt)

  return Number.isNaN(expirationTime) || expirationTime <= now
}

export function isInvitationAvailable(
  invitation: DemoInvitation,
  now = Date.now(),
): boolean {
  return (
    invitation.status === 'pending' && !isInvitationExpired(invitation, now)
  )
}

export function getInvitationStatus(
  invitation: DemoInvitation,
): InvitationStatus {
  if (invitation.status === 'pending' && isInvitationExpired(invitation)) {
    return 'expired'
  }

  return invitation.status
}
