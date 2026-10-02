import {
  demoEstablishedAccountState,
  getInvitationByToken as findInvitationByToken,
  getOrganizationById,
  type MembershipRole,
} from '@/data/demo-account'

export type InvitationRole = 'Employee' | 'Manager'

export interface InvitationSearch {
  token?: string
}

export interface DemoOrganization {
  name: string
  slug: string
}

export interface DemoInvitation {
  token: string
  organization: DemoOrganization
  inviterName: string
  recipientEmail: string
  role: InvitationRole
  expiresAt: string
  requiresApproval: boolean
}

function getInvitationRole(role: Exclude<MembershipRole, 'owner'>) {
  return role === 'manager' ? 'Manager' : 'Employee'
}

function formatExpirationDate(date: string) {
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

const accountState = demoEstablishedAccountState

const pendingInvitation = accountState.invitations.find(
  (invitation) => invitation.status === 'pending',
)

if (!pendingInvitation) {
  throw new Error('No existe una invitación pendiente de demostración.')
}

const invitationOrganization = getOrganizationById(
  accountState,
  pendingInvitation.organizationId,
)

if (!invitationOrganization) {
  throw new Error('No existe la organización de la invitación de demostración.')
}

export const demoInvitationToken = pendingInvitation.token

export const demoInvitation: DemoInvitation = {
  token: pendingInvitation.token,
  organization: {
    name: invitationOrganization.name,
    slug: invitationOrganization.slug,
  },
  inviterName: pendingInvitation.inviterName,
  recipientEmail: pendingInvitation.recipientEmail,
  role: getInvitationRole(pendingInvitation.role),
  expiresAt: formatExpirationDate(pendingInvitation.expiresAt),
  requiresApproval: pendingInvitation.requiresApproval,
}

export function getDemoInvitation(token: string): DemoInvitation | undefined {
  const invitation = findInvitationByToken(accountState, token)

  if (invitation?.status !== 'pending') {
    return undefined
  }

  return invitation.token === demoInvitation.token ? demoInvitation : undefined
}
