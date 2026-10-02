import { createContext, useContext } from 'react'
import type {
  DemoAccountScenario,
  DemoAccountState,
  DemoInvitation,
  DemoOrganizationBranding,
  MembershipRole,
} from '@/data/demo-account'
import type { DemoOrganization } from '@/data/demo-organization'
import type {
  CreateCustomOrganizationRoleInput,
  CustomOrganizationRole,
} from '@/data/custom-organization-roles'
import type { CustomOrganizationRoleId } from '@/data/custom-organization-roles'

export interface OrganizationSettingsUpdate {
  country: string
  name: string
  phone: string
  taxId: string
}

export interface AccountProfileUpdate {
  name: string
  phone: string
}

export interface CreateDemoInvitationInput {
  organizationId: string
  recipientEmail: string
  inviterName: string
  role: Exclude<MembershipRole, 'owner'>
  customRoleId?: CustomOrganizationRoleId | null
}

export interface DemoAccountContextValue {
  state: DemoAccountState
  scenario: DemoAccountScenario
  isSandboxPreview: boolean
  unreadNotificationCount: number
  selectScenario: (scenario: DemoAccountScenario) => void
  markNotificationAsRead: (notificationId: string) => void
  archiveNotification: (notificationId: string) => void
  acceptInvitation: (invitationId: string) => void
  declineInvitation: (invitationId: string) => void
  createInvitation: (input: CreateDemoInvitationInput) => DemoInvitation | null
  createOrganization: (organization: DemoOrganization) => void
  updateOrganizationSettings: (
    organizationId: string,
    updates: OrganizationSettingsUpdate,
  ) => void
  updateOrganizationBranding: (
    organizationId: string,
    branding: DemoOrganizationBranding,
  ) => void
  requestOrganizationDomainChange: (
    organizationId: string,
    domain: string,
  ) => void
  confirmOrganizationDomainChange: (organizationId: string) => void
  updateAccountProfile: (updates: AccountProfileUpdate) => void
  resetDemoState: () => void

  clearDemoWorkspaceData: () => void

  createCustomOrganizationRole: (
    input: CreateCustomOrganizationRoleInput,
  ) => CustomOrganizationRole | null

  deleteCustomOrganizationRole: (
    organizationId: string,
    roleId: CustomOrganizationRole['id'],
  ) => boolean
}

export const DemoAccountContext = createContext<DemoAccountContextValue | null>(
  null,
)

export function useDemoAccount() {
  const context = useContext(DemoAccountContext)

  if (context === null) {
    throw new Error('useDemoAccount debe usarse dentro de DemoAccountProvider.')
  }

  return context
}
