import { useUser } from '@clerk/react'
import { useEffect, useState, type ReactNode } from 'react'
import {
  demoAccountStates,
  type DemoAccount,
  type DemoAccountScenario,
  type DemoAccountState,
  type DemoInvitation,
  type DemoNotification,
  type DemoOrganizationBranding,
  type DemoOrganizationRecord,
} from '@/data/demo-account'
import type { DemoOrganization } from '@/data/demo-organization'
import {
  clearDemoWorkspaceDirectory,
  readDemoWorkspaceDirectory,
  type DemoWorkspaceDirectory,
  writeDemoWorkspaceDirectory,
} from '@/data/demo-workspace-directory'
import {
  DemoAccountContext,
  type AccountProfileUpdate,
  type CreateDemoInvitationInput,
  type DemoAccountContextValue,
  type OrganizationSettingsUpdate,
} from '@/providers/demo-account-context'
import { isManagementRole } from '@/data/organization-roles'
import { invitationLifetimeMs, isInvitationAvailable } from '@/lib/invitations'
import { getSystemOrganizationRoleTemplate } from '@/data/organization-role-templates'
import { hasMembershipPermission } from '@/data/membership-access'
import {
  createCustomOrganizationRole as createCustomOrganizationRoleRecord,
  getCustomOrganizationRoleNavigationIds,
  getNavigationIdsForPermissionKeys,
  type CreateCustomOrganizationRoleInput,
  type CustomOrganizationRole,
} from '@/data/custom-organization-roles'
import { getOrganizationPermission } from '@/data/organization-permissions'
import type { OrganizationModuleId } from '@/data/organization-modules'
import type { OrganizationPermissionKey } from '@/data/organization-permissions'
import type { OrganizationWorkspaceNavigationId } from '@/data/organization-workspace-navigation'

interface DemoAccountProviderProps {
  children: ReactNode
}

interface ClerkDemoIdentity {
  id: string
  name: string
  email: string
}

interface DemoAccountSession {
  account: DemoAccount
  notifications: DemoNotification[]
}

interface StoredDemoAccountSession {
  session: DemoAccountSession
  legacyDirectory: DemoWorkspaceDirectory | null
}

interface DemoAccountStore {
  directory: DemoWorkspaceDirectory
  session: DemoAccountSession
}

interface DemoAccountStoreProps extends DemoAccountProviderProps {
  clerkIdentity: ClerkDemoIdentity | null
}

type DemoStateUpdater = (currentState: DemoAccountState) => DemoAccountState

const demoScenarioStorageKey = 'wispzyron-demo-account-scenario'

const demoAccountStateStoragePrefix = 'wispzyron-demo-account-state'

function getAccountStateStorageKey(clerkUserId: string): string {
  return `${demoAccountStateStoragePrefix}:${clerkUserId}`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isDemoAccountSession(value: unknown): value is DemoAccountSession {
  return (
    isRecord(value) &&
    isRecord(value.account) &&
    typeof value.account.id === 'string' &&
    typeof value.account.name === 'string' &&
    typeof value.account.email === 'string' &&
    typeof value.account.phone === 'string' &&
    typeof value.account.initials === 'string' &&
    Array.isArray(value.notifications)
  )
}

function isDemoAccountState(value: unknown): value is DemoAccountState {
  return (
    isDemoAccountSession(value) &&
    isRecord(value) &&
    Array.isArray(value.organizations) &&
    Array.isArray(value.memberships) &&
    Array.isArray(value.invitations)
  )
}

function getStoredAccountSession(
  clerkUserId: string,
): StoredDemoAccountSession | null {
  try {
    const storedValue = sessionStorage.getItem(
      getAccountStateStorageKey(clerkUserId),
    )

    if (!storedValue) {
      return null
    }

    const parsedValue: unknown = JSON.parse(storedValue)

    if (isDemoAccountState(parsedValue)) {
      return {
        session: {
          account: parsedValue.account,
          notifications: parsedValue.notifications,
        },
        legacyDirectory: {
          organizations: parsedValue.organizations,
          memberships: parsedValue.memberships,
          invitations: parsedValue.invitations,
          customRoles: parsedValue.customRoles ?? [],
        },
      }
    }

    if (isDemoAccountSession(parsedValue)) {
      return {
        session: parsedValue,
        legacyDirectory: null,
      }
    }

    return null
  } catch {
    return null
  }
}

function storeAccountSession(clerkUserId: string, session: DemoAccountSession) {
  try {
    sessionStorage.setItem(
      getAccountStateStorageKey(clerkUserId),
      JSON.stringify(session),
    )
  } catch {
    // La demo funciona aunque sessionStorage no esté disponible.
  }
}

function getStoredScenario(): DemoAccountScenario {
  try {
    const storedScenario = sessionStorage.getItem(demoScenarioStorageKey)

    if (
      storedScenario === 'established' ||
      storedScenario === 'new-account' ||
      storedScenario === 'invited-account'
    ) {
      return storedScenario
    }
  } catch {
    // Usamos el escenario inicial si sessionStorage no está disponible.
  }

  return 'established'
}

function storeScenario(scenario: DemoAccountScenario) {
  try {
    sessionStorage.setItem(demoScenarioStorageKey, scenario)
  } catch {
    // El sandbox sigue funcionando aunque no pueda persistirse el escenario.
  }
}

function clearStoredDemoAccountSessions(): void {
  try {
    const keysToRemove: string[] = []

    for (let index = 0; index < sessionStorage.length; index += 1) {
      const key = sessionStorage.key(index)

      if (
        key?.startsWith(demoAccountStateStoragePrefix) ||
        key === demoScenarioStorageKey
      ) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach((key) => sessionStorage.removeItem(key))
  } catch {
    // La demo sigue funcionando aunque sessionStorage no esté disponible.
  }
}

function createDemoState(scenario: DemoAccountScenario): DemoAccountState {
  return structuredClone(demoAccountStates[scenario])
}

function createInitials(name: string, fallback: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')

  return initials || fallback
}

function createSessionFromState(state: DemoAccountState): DemoAccountSession {
  return structuredClone({
    account: state.account,
    notifications: state.notifications,
  })
}

function createDirectoryFromState(
  state: DemoAccountState,
): DemoWorkspaceDirectory {
  return structuredClone({
    organizations: state.organizations,
    memberships: state.memberships,
    invitations: state.invitations,
    customRoles: state.customRoles ?? [],
  })
}

function createSessionForClerkUser(
  identity: ClerkDemoIdentity,
): DemoAccountSession {
  const defaultState = createDemoState('new-account')

  return {
    account: {
      ...defaultState.account,
      id: identity.id,
      name: identity.name,
      email: identity.email,
      phone: '',
      initials: createInitials(identity.name, defaultState.account.initials),
    },
    notifications: [],
  }
}

function mergeDirectory(
  primaryDirectory: DemoWorkspaceDirectory,
  legacyDirectory: DemoWorkspaceDirectory,
): DemoWorkspaceDirectory {
  const organizationIds = new Set(
    primaryDirectory.organizations.map((organization) => organization.id),
  )

  const membershipIds = new Set(
    primaryDirectory.memberships.map((membership) => membership.id),
  )

  const invitationIds = new Set(
    primaryDirectory.invitations.map((invitation) => invitation.id),
  )

  const primaryCustomRoles = primaryDirectory.customRoles ?? []
  const legacyCustomRoles = legacyDirectory.customRoles ?? []

  const customRoleIds = new Set(primaryCustomRoles.map((role) => role.id))

  return {
    organizations: [
      ...primaryDirectory.organizations,
      ...legacyDirectory.organizations.filter(
        (organization) => !organizationIds.has(organization.id),
      ),
    ],
    memberships: [
      ...primaryDirectory.memberships,
      ...legacyDirectory.memberships.filter(
        (membership) => !membershipIds.has(membership.id),
      ),
    ],
    invitations: [
      ...primaryDirectory.invitations,
      ...legacyDirectory.invitations.filter(
        (invitation) => !invitationIds.has(invitation.id),
      ),
    ],
    customRoles: [
      ...primaryCustomRoles,
      ...legacyCustomRoles.filter((role) => !customRoleIds.has(role.id)),
    ],
  }
}

function createInitialStore(
  clerkIdentity: ClerkDemoIdentity | null,
  scenario: DemoAccountScenario,
): DemoAccountStore {
  const sharedDirectory = readDemoWorkspaceDirectory()

  if (clerkIdentity === null) {
    const scenarioState = createDemoState(scenario)

    return {
      directory: sharedDirectory,
      session: createSessionFromState(scenarioState),
    }
  }

  const storedAccount = getStoredAccountSession(clerkIdentity.id)

  return {
    directory: storedAccount?.legacyDirectory
      ? mergeDirectory(sharedDirectory, storedAccount.legacyDirectory)
      : sharedDirectory,
    session: storedAccount?.session ?? createSessionForClerkUser(clerkIdentity),
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function createInvitationToken(): string {
  const characters = crypto
    .randomUUID()
    .replace(/-/g, '')
    .slice(0, 20)
    .toUpperCase()

  const groups = characters.match(/.{1,4}/g)

  return `WZ-${groups?.join('-') ?? characters}`
}

function getModuleIdsFromPermissions(
  permissionKeys: OrganizationPermissionKey[],
): OrganizationModuleId[] {
  return [
    ...new Set(
      permissionKeys.map(
        (permissionKey) => getOrganizationPermission(permissionKey).moduleId,
      ),
    ),
  ]
}

function getInvitationPermissionKeys(
  directory: DemoWorkspaceDirectory,
  input: CreateDemoInvitationInput,
): OrganizationPermissionKey[] | null {
  if (input.customRoleId === null || input.customRoleId === undefined) {
    return [...getSystemOrganizationRoleTemplate(input.role).permissionKeys]
  }

  const customRole = (directory.customRoles ?? []).find(
    (role) =>
      role.id === input.customRoleId &&
      role.organizationId === input.organizationId,
  )

  if (customRole === undefined) {
    return null
  }

  const expectedWorkspace = input.role === 'employee' ? 'employee' : 'manager'

  if (input.role !== 'employee' && input.role !== 'manager') {
    return null
  }

  if (customRole.workspace !== expectedWorkspace) {
    return null
  }

  return [...customRole.permissionKeys]
}

function getInvitationNavigationIds(
  directory: DemoWorkspaceDirectory,
  input: CreateDemoInvitationInput,
  permissionKeys: OrganizationPermissionKey[],
): OrganizationWorkspaceNavigationId[] | null {
  const workspace = input.role === 'employee' ? 'employee' : 'manager'

  if (input.customRoleId === null || input.customRoleId === undefined) {
    return getNavigationIdsForPermissionKeys(workspace, permissionKeys)
  }

  const customRole = (directory.customRoles ?? []).find(
    (role) =>
      role.id === input.customRoleId &&
      role.organizationId === input.organizationId,
  )

  if (customRole?.workspace !== workspace) {
    return null
  }

  return getCustomOrganizationRoleNavigationIds(customRole)
}

function getAccountNotifications(
  session: DemoAccountSession,
  directory: DemoWorkspaceDirectory,
): DemoNotification[] {
  const accountEmail = normalizeEmail(session.account.email)

  const invitations = directory.invitations.filter(
    (invitation) => normalizeEmail(invitation.recipientEmail) === accountEmail,
  )

  const invitationIds = new Set(invitations.map((invitation) => invitation.id))

  const notificationsByInvitation = new Map(
    session.notifications.map((notification) => [
      notification.invitationId,
      notification,
    ]),
  )

  const unrelatedNotifications = session.notifications.filter(
    (notification) => !invitationIds.has(notification.invitationId),
  )

  const invitationNotifications: DemoNotification[] = invitations.map(
    (invitation) => {
      const existingNotification = notificationsByInvitation.get(invitation.id)

      if (existingNotification) {
        return existingNotification
      }

      return {
        id: `notification-${invitation.id}`,
        accountId: session.account.id,
        invitationId: invitation.id,
        status: invitation.status === 'pending' ? 'unread' : 'read',
        createdAt: new Date().toISOString(),
      }
    },
  )

  return [...unrelatedNotifications, ...invitationNotifications]
}

function createAccountState(
  session: DemoAccountSession,
  directory: DemoWorkspaceDirectory,
): DemoAccountState {
  return {
    account: session.account,
    organizations: directory.organizations,
    memberships: directory.memberships,
    invitations: directory.invitations,
    customRoles: directory.customRoles ?? [],
    notifications: getAccountNotifications(session, directory),
  }
}

function hasOrganizationManagementAccess(
  directory: DemoWorkspaceDirectory,
  accountId: string,
  organizationId: string,
): boolean {
  return directory.memberships.some(
    (membership) =>
      membership.accountId === accountId &&
      membership.organizationId === organizationId &&
      isManagementRole(membership.role),
  )
}

function hasOrganizationRoleManagementAccess(
  directory: DemoWorkspaceDirectory,
  accountId: string,
  organizationId: string,
): boolean {
  const membership = directory.memberships.find(
    (item) =>
      item.accountId === accountId && item.organizationId === organizationId,
  )

  return (
    membership !== undefined &&
    hasMembershipPermission(membership, 'roles.manage')
  )
}

function canAssignInvitationRole(
  directory: DemoWorkspaceDirectory,
  accountId: string,
  input: CreateDemoInvitationInput,
): boolean {
  const membership = directory.memberships.find(
    (item) =>
      item.accountId === accountId &&
      item.organizationId === input.organizationId,
  )

  if (
    membership === undefined ||
    !hasMembershipPermission(membership, 'employees.invite')
  ) {
    return false
  }

  const isPlainEmployeeInvitation =
    input.role === 'employee' &&
    (input.customRoleId === null || input.customRoleId === undefined)

  return (
    isPlainEmployeeInvitation ||
    hasMembershipPermission(membership, 'roles.manage')
  )
}

export function DemoAccountProvider({ children }: DemoAccountProviderProps) {
  const { isLoaded, user } = useUser()

  const email = user?.primaryEmailAddress?.emailAddress

  const clerkIdentity =
    isLoaded && user !== null && email
      ? {
          id: user.id,
          name:
            user.fullName ??
            user.firstName ??
            email.split('@')[0] ??
            'Nuevo usuario',
          email,
        }
      : null

  return (
    <DemoAccountStoreProvider
      key={clerkIdentity?.id ?? 'demo-account-public'}
      clerkIdentity={clerkIdentity}
    >
      {children}
    </DemoAccountStoreProvider>
  )
}

function DemoAccountStoreProvider({
  children,
  clerkIdentity,
}: DemoAccountStoreProps) {
  const initialScenario = clerkIdentity ? 'new-account' : getStoredScenario()

  const [realStore, setRealStore] = useState<DemoAccountStore>(() =>
    createInitialStore(clerkIdentity, initialScenario),
  )

  const [scenario, setScenario] = useState<DemoAccountScenario>(initialScenario)

  const [sandboxState, setSandboxState] = useState<DemoAccountState | null>(
    null,
  )

  const clerkUserId = clerkIdentity?.id

  const realState = createAccountState(realStore.session, realStore.directory)

  const state = sandboxState ?? realState

  const isSandboxPreview = sandboxState !== null

  useEffect(() => {
    if (!clerkUserId) {
      return
    }

    writeDemoWorkspaceDirectory(realStore.directory)
  }, [clerkUserId, realStore.directory])

  useEffect(() => {
    if (!clerkUserId) {
      return
    }

    storeAccountSession(clerkUserId, realStore.session)
  }, [clerkUserId, realStore.session])

  const updateActiveState = (update: DemoStateUpdater) => {
    if (isSandboxPreview) {
      setSandboxState((currentState) =>
        currentState ? update(currentState) : currentState,
      )

      return
    }

    setRealStore((currentStore) => {
      const currentState = createAccountState(
        currentStore.session,
        currentStore.directory,
      )

      const nextState = update(currentState)

      return {
        directory: createDirectoryFromState(nextState),
        session: createSessionFromState(nextState),
      }
    })
  }

  const selectScenario = (nextScenario: DemoAccountScenario) => {
    storeScenario(nextScenario)
    setScenario(nextScenario)
    setSandboxState(createDemoState(nextScenario))
  }

  const updateAccountProfile = (updates: AccountProfileUpdate) => {
    updateActiveState((currentState) => {
      const name = updates.name.trim()

      return {
        ...currentState,
        account: {
          ...currentState.account,
          name,
          phone: updates.phone.trim(),
          initials: createInitials(name, currentState.account.initials),
        },
      }
    })
  }

  const markNotificationAsRead = (notificationId: string) => {
    updateActiveState((currentState) => ({
      ...currentState,
      notifications: currentState.notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, status: 'read' }
          : notification,
      ),
    }))
  }

  const archiveNotification = (notificationId: string) => {
    updateActiveState((currentState) => ({
      ...currentState,
      notifications: currentState.notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, status: 'archived' }
          : notification,
      ),
    }))
  }

  const createCustomOrganizationRole = (
    input: CreateCustomOrganizationRoleInput,
  ): CustomOrganizationRole | null => {
    const activeDirectory = createDirectoryFromState(state)

    const canManageRoles = hasOrganizationRoleManagementAccess(
      activeDirectory,
      state.account.id,
      input.organizationId,
    )

    const roleName = input.name.trim().toLocaleLowerCase()

    const roleNameAlreadyExists = (state.customRoles ?? []).some(
      (role) =>
        role.organizationId === input.organizationId &&
        role.name.trim().toLocaleLowerCase() === roleName,
    )

    if (!canManageRoles || roleNameAlreadyExists) {
      return null
    }

    const role = createCustomOrganizationRoleRecord(input)

    updateActiveState((currentState) => ({
      ...currentState,
      customRoles: [...(currentState.customRoles ?? []), role],
    }))

    return role
  }

  const deleteCustomOrganizationRole = (
    organizationId: string,
    roleId: CustomOrganizationRole['id'],
  ): boolean => {
    const activeDirectory = createDirectoryFromState(state)

    const canManageRoles = hasOrganizationRoleManagementAccess(
      activeDirectory,
      state.account.id,
      organizationId,
    )

    const roleExists = (activeDirectory.customRoles ?? []).some(
      (role) => role.id === roleId && role.organizationId === organizationId,
    )

    const isAssignedToMember = activeDirectory.memberships.some(
      (membership) =>
        membership.organizationId === organizationId &&
        membership.customRoleId === roleId,
    )

    const hasActiveInvitation = activeDirectory.invitations.some(
      (invitation) =>
        invitation.organizationId === organizationId &&
        invitation.customRoleId === roleId &&
        isInvitationAvailable(invitation),
    )

    if (
      !canManageRoles ||
      !roleExists ||
      isAssignedToMember ||
      hasActiveInvitation
    ) {
      return false
    }

    updateActiveState((currentState) => ({
      ...currentState,
      customRoles: (currentState.customRoles ?? []).filter(
        (role) => role.id !== roleId,
      ),
    }))

    return true
  }

  const createInvitation = (
    input: CreateDemoInvitationInput,
  ): DemoInvitation | null => {
    const recipientEmail = normalizeEmail(input.recipientEmail)

    const activeDirectory = createDirectoryFromState(state)

    const permissionKeys = getInvitationPermissionKeys(activeDirectory, input)

    const navigationIds =
      permissionKeys === null
        ? null
        : getInvitationNavigationIds(activeDirectory, input, permissionKeys)

    const organizationExists = activeDirectory.organizations.some(
      (organization) => organization.id === input.organizationId,
    )

    const hasPendingInvitation = activeDirectory.invitations.some(
      (invitation) =>
        invitation.organizationId === input.organizationId &&
        normalizeEmail(invitation.recipientEmail) === recipientEmail &&
        isInvitationAvailable(invitation),
    )

    if (
      !recipientEmail ||
      permissionKeys === null ||
      navigationIds === null ||
      !organizationExists ||
      hasPendingInvitation ||
      !canAssignInvitationRole(activeDirectory, state.account.id, input)
    ) {
      return null
    }

    const invitation: DemoInvitation = {
      id: `invitation-${crypto.randomUUID()}`,
      token: createInvitationToken(),
      organizationId: input.organizationId,
      recipientAccountId: null,
      recipientEmail,
      inviterName: input.inviterName,
      role: input.role,
      status: 'pending',
      expiresAt: new Date(Date.now() + invitationLifetimeMs).toISOString(),
      requiresApproval: false,
      customRoleId: input.customRoleId ?? null,
      grantedPermissionKeys: permissionKeys,
      grantedNavigationIds: navigationIds,
    }

    updateActiveState((currentState) => ({
      ...currentState,
      invitations: [...currentState.invitations, invitation],
    }))

    return invitation
  }

  const acceptInvitation = (invitationId: string) => {
    updateActiveState((currentState) => {
      const invitation = currentState.invitations.find(
        (item) => item.id === invitationId,
      )

      if (
        !invitation ||
        !isInvitationAvailable(invitation) ||
        normalizeEmail(invitation.recipientEmail) !==
          normalizeEmail(currentState.account.email)
      ) {
        return currentState
      }
      const alreadyMember = currentState.memberships.some(
        (membership) =>
          membership.accountId === currentState.account.id &&
          membership.organizationId === invitation.organizationId,
      )

      const permissionKeys = invitation.grantedPermissionKeys ?? [
        ...getSystemOrganizationRoleTemplate(invitation.role).permissionKeys,
      ]

      const navigationIds =
        invitation.grantedNavigationIds ??
        getNavigationIdsForPermissionKeys(
          invitation.role === 'employee' ? 'employee' : 'manager',
          permissionKeys,
        )

      const nextState: DemoAccountState = {
        ...currentState,
        invitations: currentState.invitations.map((item) =>
          item.id === invitationId
            ? {
                ...item,
                recipientAccountId: currentState.account.id,
                status: 'accepted',
              }
            : item,
        ),
        memberships: alreadyMember
          ? currentState.memberships
          : [
              ...currentState.memberships,
              {
                id: `membership-${currentState.account.id}-${invitation.organizationId}`,
                accountId: currentState.account.id,
                organizationId: invitation.organizationId,
                role: invitation.role,
                roleTemplateId: invitation.role,
                customRoleId: invitation.customRoleId ?? null,
                grantedModuleIds: getModuleIdsFromPermissions(permissionKeys),
                grantedPermissionKeys: permissionKeys,
                grantedNavigationIds: navigationIds,
                joinedAt: new Date().toISOString(),
              },
            ],
      }

      return {
        ...nextState,
        notifications: nextState.notifications.map((notification) =>
          notification.invitationId === invitationId
            ? { ...notification, status: 'read' }
            : notification,
        ),
      }
    })
  }

  const declineInvitation = (invitationId: string) => {
    updateActiveState((currentState) => {
      const invitation = currentState.invitations.find(
        (item) => item.id === invitationId,
      )

      if (
        invitation?.status !== 'pending' ||
        normalizeEmail(invitation.recipientEmail) !==
          normalizeEmail(currentState.account.email)
      ) {
        return currentState
      }

      const nextState: DemoAccountState = {
        ...currentState,
        invitations: currentState.invitations.map((item) =>
          item.id === invitationId ? { ...item, status: 'declined' } : item,
        ),
      }

      return {
        ...nextState,
        notifications: nextState.notifications.map((notification) =>
          notification.invitationId === invitationId
            ? { ...notification, status: 'archived' }
            : notification,
        ),
      }
    })
  }

  const createOrganization = (organization: DemoOrganization) => {
    const ownerTemplate = getSystemOrganizationRoleTemplate('owner')

    const organizationRecord: DemoOrganizationRecord = {
      id: organization.tenantId,
      name: organization.organizationName,
      slug: organization.subdomain,
      domain: null,
      pendingDomainChange: null,
      country: organization.country,
      phone: organization.phone,
      taxId: organization.taxId,
      plan: organization.plan,
      billingCycle: organization.billingCycle,
      paymentMethod: organization.payment.method,
      paymentStatus: organization.payment.status,
      onboardingStatus: organization.onboardingStatus,
      branding: {
        logoUrl: null,
        primaryColor: '#202020',
        radius: 'soft',
        fontFamily: 'inter',
      },
    }

    updateActiveState((currentState) => {
      const alreadyExists = currentState.organizations.some(
        (item) =>
          item.id === organizationRecord.id ||
          item.slug === organizationRecord.slug,
      )

      if (alreadyExists) {
        return currentState
      }

      return {
        ...currentState,
        organizations: [...currentState.organizations, organizationRecord],
        memberships: [
          ...currentState.memberships,
          {
            id: `membership-${currentState.account.id}-${organization.tenantId}`,
            accountId: currentState.account.id,
            organizationId: organization.tenantId,
            role: 'owner',
            roleTemplateId: 'owner',
            grantedModuleIds: [...ownerTemplate.moduleIds],
            grantedPermissionKeys: [...ownerTemplate.permissionKeys],
            grantedNavigationIds: getNavigationIdsForPermissionKeys(
              'manager',
              ownerTemplate.permissionKeys,
            ),
            joinedAt: organization.createdAt,
          },
        ],
      }
    })
  }

  const updateOrganizationSettings = (
    organizationId: string,
    updates: OrganizationSettingsUpdate,
  ) => {
    updateActiveState((currentState) => {
      const directory = createDirectoryFromState(currentState)

      if (
        !hasOrganizationManagementAccess(
          directory,
          currentState.account.id,
          organizationId,
        )
      ) {
        return currentState
      }

      return {
        ...currentState,
        organizations: currentState.organizations.map(
          (organization): DemoOrganizationRecord =>
            organization.id === organizationId
              ? {
                  ...organization,
                  ...updates,
                }
              : organization,
        ),
      }
    })
  }

  const updateOrganizationBranding = (
    organizationId: string,
    branding: DemoOrganizationBranding,
  ) => {
    updateActiveState((currentState) => {
      const directory = createDirectoryFromState(currentState)

      if (
        !hasOrganizationManagementAccess(
          directory,
          currentState.account.id,
          organizationId,
        )
      ) {
        return currentState
      }

      return {
        ...currentState,
        organizations: currentState.organizations.map(
          (organization): DemoOrganizationRecord =>
            organization.id === organizationId
              ? {
                  ...organization,
                  branding: {
                    ...branding,
                  },
                }
              : organization,
        ),
      }
    })
  }

  const requestOrganizationDomainChange = (
    organizationId: string,
    requestedDomain: string,
  ) => {
    const domain = requestedDomain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')

    if (!domain) {
      return
    }

    updateActiveState((currentState) => {
      const directory = createDirectoryFromState(currentState)

      if (
        !hasOrganizationManagementAccess(
          directory,
          currentState.account.id,
          organizationId,
        )
      ) {
        return currentState
      }

      return {
        ...currentState,
        organizations: currentState.organizations.map(
          (organization): DemoOrganizationRecord =>
            organization.id === organizationId
              ? {
                  ...organization,
                  pendingDomainChange: {
                    domain,
                    requestedAt: new Date().toISOString(),
                    status: 'pending',
                  },
                }
              : organization,
        ),
      }
    })
  }

  const confirmOrganizationDomainChange = (organizationId: string) => {
    updateActiveState((currentState) => {
      const directory = createDirectoryFromState(currentState)

      if (
        !hasOrganizationManagementAccess(
          directory,
          currentState.account.id,
          organizationId,
        )
      ) {
        return currentState
      }

      const organization = currentState.organizations.find(
        (item) => item.id === organizationId,
      )

      if (organization?.pendingDomainChange?.status !== 'pending') {
        return currentState
      }

      return {
        ...currentState,
        organizations: currentState.organizations.map(
          (item): DemoOrganizationRecord =>
            item.id === organizationId
              ? {
                  ...item,
                  domain: item.pendingDomainChange?.domain ?? item.domain,
                  pendingDomainChange: null,
                }
              : item,
        ),
      }
    })
  }

  const resetDemoState = () => {
    if (sandboxState !== null) {
      setSandboxState(null)
      return
    }

    if (clerkIdentity === null) {
      const scenarioState = createDemoState(getStoredScenario())

      setRealStore({
        directory: readDemoWorkspaceDirectory(),
        session: createSessionFromState(scenarioState),
      })
    }
  }

  const clearDemoWorkspaceData = () => {
    clearDemoWorkspaceDirectory()
    clearStoredDemoAccountSessions()

    const nextScenario: DemoAccountScenario = clerkIdentity
      ? 'new-account'
      : 'established'

    const nextSession = clerkIdentity
      ? createSessionForClerkUser(clerkIdentity)
      : createSessionFromState(createDemoState(nextScenario))

    if (clerkIdentity === null) {
      storeScenario(nextScenario)
    }

    setScenario(nextScenario)
    setSandboxState(null)

    setRealStore({
      directory: readDemoWorkspaceDirectory(),
      session: nextSession,
    })
  }

  const unreadNotificationCount = state.notifications.filter(
    (notification) => notification.status === 'unread',
  ).length

  const value: DemoAccountContextValue = {
    state,
    scenario,
    isSandboxPreview,
    unreadNotificationCount,
    selectScenario,
    markNotificationAsRead,
    archiveNotification,
    acceptInvitation,
    declineInvitation,
    createInvitation,
    createCustomOrganizationRole,
    deleteCustomOrganizationRole,
    createOrganization,
    updateOrganizationSettings,
    updateOrganizationBranding,
    requestOrganizationDomainChange,
    confirmOrganizationDomainChange,
    updateAccountProfile,
    resetDemoState,
    clearDemoWorkspaceData,
  }

  return (
    <DemoAccountContext.Provider value={value}>
      {children}
    </DemoAccountContext.Provider>
  )
}
