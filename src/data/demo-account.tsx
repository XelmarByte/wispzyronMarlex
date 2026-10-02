import type {
  BillingCycle,
  DemoPaymentMethod,
  DemoPaymentStatus,
  OrganizationOnboardingStatus,
  OrganizationPlan,
} from '@/data/demo-organization'
import type { SystemOrganizationRoleKey } from '@/data/organization-roles'
import type { OrganizationModuleId } from '@/data/organization-modules'
import type { OrganizationPermissionKey } from '@/data/organization-permissions'
import type { CustomOrganizationRole } from '@/data/custom-organization-roles'
import type { CustomOrganizationRoleId } from '@/data/custom-organization-roles'
import type { OrganizationWorkspaceNavigationId } from '@/data/organization-workspace-navigation'

export type MembershipRole = SystemOrganizationRoleKey

export type InvitationStatus =
  'pending' | 'accepted' | 'declined' | 'expired' | 'revoked'

export type NotificationStatus = 'unread' | 'read' | 'archived'

export type DemoAccountScenario =
  'established' | 'new-account' | 'invited-account'

export type OrganizationRadius = 'sharp' | 'soft' | 'rounded'

export interface DemoAccount {
  id: string
  name: string
  email: string
  phone: string
  initials: string
}
export type OrganizationFontFamily = 'inter' | 'system' | 'mono'

export type OrganizationDomainChangeStatus = 'pending' | 'confirmed'

export interface DemoOrganizationDomainChange {
  domain: string
  requestedAt: string
  status: OrganizationDomainChangeStatus
}

export interface DemoOrganizationBranding {
  logoUrl: string | null
  primaryColor: string
  radius: OrganizationRadius
  fontFamily: OrganizationFontFamily
}

export interface DemoOrganizationRecord {
  id: string
  name: string
  slug: string
  domain: string | null
  pendingDomainChange: DemoOrganizationDomainChange | null
  country: string
  phone: string
  taxId: string
  plan: OrganizationPlan
  billingCycle: BillingCycle
  paymentMethod: DemoPaymentMethod
  paymentStatus: DemoPaymentStatus
  onboardingStatus: OrganizationOnboardingStatus
  branding: DemoOrganizationBranding
}

export interface DemoMembership {
  id: string
  accountId: string
  organizationId: string
  role: MembershipRole
  roleTemplateId?: MembershipRole
  grantedModuleIds?: OrganizationModuleId[]
  grantedPermissionKeys?: OrganizationPermissionKey[]
  grantedNavigationIds?: OrganizationWorkspaceNavigationId[]
  joinedAt: string
  customRoleId?: CustomOrganizationRoleId | null
}

export interface DemoInvitation {
  id: string
  token: string
  organizationId: string
  recipientAccountId: string | null
  recipientEmail: string
  inviterName: string
  role: Exclude<MembershipRole, 'owner'>
  status: InvitationStatus
  expiresAt: string
  requiresApproval: boolean
  customRoleId?: CustomOrganizationRoleId | null
  grantedPermissionKeys?: OrganizationPermissionKey[]
  grantedNavigationIds?: OrganizationWorkspaceNavigationId[]
}

export interface DemoNotification {
  id: string
  accountId: string
  invitationId: string
  status: NotificationStatus
  createdAt: string
}

export interface DemoAccountState {
  account: DemoAccount
  organizations: DemoOrganizationRecord[]
  memberships: DemoMembership[]
  invitations: DemoInvitation[]
  customRoles?: CustomOrganizationRole[]
  notifications: DemoNotification[]
}

const marlexAccount: DemoAccount = {
  id: 'user-marlex-demo',
  name: 'Marlex',
  email: 'marlex@example.com',
  phone: '+51 999 123 999',
  initials: 'MA',
}

const newAccount: DemoAccount = {
  id: 'user-new-demo',
  name: 'Nuevo usuario',
  email: 'nuevo@example.com',
  phone: '+51 999 456 999',
  initials: 'NU',
}

const invitedAccount: DemoAccount = {
  id: 'user-invited-demo',
  name: 'Usuario invitado',
  email: 'invitado@example.com',
  phone: '+51 999 789 999',
  initials: 'UI',
}

const organizations: DemoOrganizationRecord[] = [
  {
    id: 'org-wispzyron',
    name: 'WispZyron Telecom',
    slug: 'wispzyron',
    country: 'Perú',
    domain: null,
    pendingDomainChange: null,
    phone: '+51 956 800 120',
    taxId: '20612345671',
    plan: 'ENTERPRISE',
    billingCycle: 'monthly',
    onboardingStatus: 'completed',
    paymentMethod: 'card',
    paymentStatus: 'confirmed',
    branding: {
      logoUrl: null,
      primaryColor: '#202020',
      radius: 'soft',
      fontFamily: 'inter',
    },
  },
  {
    id: 'org-novaspeed',
    name: 'NovaSpeed Telecom',
    slug: 'novaspeed',
    country: 'Perú',
    domain: null,
    pendingDomainChange: null,
    phone: '+51 944 318 570',
    taxId: '20598765432',
    plan: 'PRO',
    billingCycle: 'monthly',
    onboardingStatus: 'completed',
    paymentMethod: 'yape',
    paymentStatus: 'confirmed',
    branding: {
      logoUrl: null,
      primaryColor: '#202020',
      radius: 'soft',
      fontFamily: 'inter',
    },
  },
  {
    id: 'org-fiberway',
    name: 'FiberWay Perú',
    slug: 'fiberway',
    country: 'Perú',
    domain: null,
    pendingDomainChange: null,
    phone: '+51 965 240 118',
    taxId: '20645678913',
    plan: 'BASIC',
    billingCycle: 'monthly',
    onboardingStatus: 'in-progress',
    paymentMethod: 'agent-transfer',
    paymentStatus: 'pending',
    branding: {
      logoUrl: null,
      primaryColor: '#202020',
      radius: 'soft',
      fontFamily: 'inter',
    },
  },
  {
    id: 'org-conectanet',
    name: 'ConectaNet Ica',
    slug: 'conectanet-ica',
    country: 'Perú',
    domain: null,
    pendingDomainChange: null,
    phone: '+51 972 630 441',
    taxId: '20574185296',
    plan: 'BASIC',
    billingCycle: 'annual',
    onboardingStatus: 'not-started',
    paymentMethod: 'card',
    paymentStatus: 'confirmed',
    branding: {
      logoUrl: null,
      primaryColor: '#202020',
      radius: 'soft',
      fontFamily: 'inter',
    },
  },
]

export const demoEstablishedAccountState: DemoAccountState = {
  account: marlexAccount,

  organizations,

  memberships: [
    {
      id: 'membership-marlex-wispzyron',
      accountId: marlexAccount.id,
      organizationId: 'org-wispzyron',
      role: 'owner',
      joinedAt: '2026-08-12T10:00:00-05:00',
    },
    {
      id: 'membership-marlex-novaspeed',
      accountId: marlexAccount.id,
      organizationId: 'org-novaspeed',
      role: 'employee',
      joinedAt: '2026-08-20T09:30:00-05:00',
    },
  ],

  invitations: [
    {
      id: 'invitation-fiberway-marlex',
      token: 'demo-fiberway-invite',
      organizationId: 'org-fiberway',
      recipientAccountId: marlexAccount.id,
      recipientEmail: marlexAccount.email,
      inviterName: 'Andrea Ramos',
      role: 'employee',
      status: 'pending',
      expiresAt: '2026-09-07T23:59:59-05:00',
      requiresApproval: false,
    },
    {
      id: 'invitation-conectanet-marlex',
      token: 'demo-conectanet-expired',
      organizationId: 'org-conectanet',
      recipientAccountId: marlexAccount.id,
      recipientEmail: marlexAccount.email,
      inviterName: 'Carlos Medina',
      role: 'employee',
      status: 'expired',
      expiresAt: '2026-08-22T23:59:59-05:00',
      requiresApproval: false,
    },
  ],

  notifications: [
    {
      id: 'notification-fiberway-invitation',
      accountId: marlexAccount.id,
      invitationId: 'invitation-fiberway-marlex',
      status: 'unread',
      createdAt: '2026-09-03T09:00:00-05:00',
    },
    {
      id: 'notification-conectanet-invitation',
      accountId: marlexAccount.id,
      invitationId: 'invitation-conectanet-marlex',
      status: 'read',
      createdAt: '2026-08-20T14:30:00-05:00',
    },
  ],
}

export const demoNewAccountState: DemoAccountState = {
  account: newAccount,
  organizations: [],
  memberships: [],
  invitations: [],
  notifications: [],
}

export const demoInvitedAccountState: DemoAccountState = {
  account: invitedAccount,

  organizations,

  memberships: [],

  invitations: [
    {
      id: 'invitation-fiberway-invited',
      token: 'demo-fiberway-invite',
      organizationId: 'org-fiberway',
      recipientAccountId: invitedAccount.id,
      recipientEmail: invitedAccount.email,
      inviterName: 'Andrea Ramos',
      role: 'employee',
      status: 'pending',
      expiresAt: '2026-09-07T23:59:59-05:00',
      requiresApproval: false,
    },
  ],

  notifications: [
    {
      id: 'notification-fiberway-invited',
      accountId: invitedAccount.id,
      invitationId: 'invitation-fiberway-invited',
      status: 'unread',
      createdAt: '2026-09-03T09:00:00-05:00',
    },
  ],
}

export const demoAccountStates: Record<DemoAccountScenario, DemoAccountState> =
  {
    established: demoEstablishedAccountState,
    'new-account': demoNewAccountState,
    'invited-account': demoInvitedAccountState,
  }

export function getOrganizationById(
  state: DemoAccountState,
  organizationId: string,
): DemoOrganizationRecord | undefined {
  return state.organizations.find(
    (organization) => organization.id === organizationId,
  )
}

export function getInvitationByToken(
  state: DemoAccountState,
  token: string,
): DemoInvitation | undefined {
  const normalizedToken = token.trim().toLowerCase()

  return state.invitations.find(
    (invitation) => invitation.token.trim().toLowerCase() === normalizedToken,
  )
}

export function getMembershipDestination(
  organization: DemoOrganizationRecord,
  membership: DemoMembership,
): string {
  if (membership.role === 'employee') {
    return `/${organization.slug}/employee`
  }

  return `/${organization.slug}/manager`
}
