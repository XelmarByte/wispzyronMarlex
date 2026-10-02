import type {
  DemoAccountState,
  DemoMembership,
  DemoOrganizationRecord,
} from '@/data/demo-account'
import {
  organizationModules,
  type OrganizationModuleId,
} from '@/data/organization-modules'
import {
  getSelectableOrganizationWorkspaceNavigationItems,
  type OrganizationWorkspaceNavigationId,
} from '@/data/organization-workspace-navigation'

export type OrganizationWorkspaceRoute = 'manager' | 'employee'

export interface WorkspaceAccess {
  organization: DemoOrganizationRecord
  membership: DemoMembership
}

const routeModuleAliases: Record<string, OrganizationModuleId> = {
  clients: 'customers',
  customers: 'customers',
  billing: 'billing',
  network: 'network',
  inventory: 'inventory',
  support: 'support',
  'field-operations': 'field-operations',
  employees: 'employees',
  analytics: 'analytics',
  projects: 'projects',
}

export function getWorkspaceAccess(
  state: DemoAccountState,
  orgSlug: string,
): WorkspaceAccess | null {
  const organization = state.organizations.find((item) => item.slug === orgSlug)

  if (!organization) {
    return null
  }

  const membership = state.memberships.find(
    (item) =>
      item.accountId === state.account.id &&
      item.organizationId === organization.id,
  )

  return membership ? { organization, membership } : null
}

export function getWorkspaceNavigationFallbackPath(
  workspace: OrganizationWorkspaceRoute,
  orgSlug: string,
  pathname: string,
  navigationIds: readonly OrganizationWorkspaceNavigationId[],
): string | null {
  const basePath = `/${orgSlug}/${workspace}`

  if (pathname !== basePath && !pathname.startsWith(`${basePath}/`)) {
    return null
  }

  const attemptedPath = pathname.slice(basePath.length).replace(/\/+$/, '')

  const allowedItems = getSelectableOrganizationWorkspaceNavigationItems(
    workspace,
  ).filter((item) => navigationIds.includes(item.id))

  if (allowedItems.length === 0) {
    return null
  }

  const attemptedSegments = attemptedPath.split('/').filter(Boolean)

  let closestItem: (typeof allowedItems)[number] | undefined

  let closestSharedSegments = 0

  for (const item of allowedItems) {
    const itemSegments = item.path.split('/').filter(Boolean)

    let sharedSegments = 0

    while (
      sharedSegments < attemptedSegments.length &&
      sharedSegments < itemSegments.length &&
      attemptedSegments[sharedSegments] === itemSegments[sharedSegments]
    ) {
      sharedSegments += 1
    }

    if (sharedSegments > closestSharedSegments) {
      closestItem = item
      closestSharedSegments = sharedSegments
    }
  }

  if (closestItem && closestSharedSegments > 0) {
    return closestItem.path
  }

  const dashboardItem = allowedItems.find((item) => item.path === '')

  return (dashboardItem ?? allowedItems[0]).path
}

export function getWorkspaceNavigationIdFromPath(
  workspace: OrganizationWorkspaceRoute,
  orgSlug: string,
  pathname: string,
): OrganizationWorkspaceNavigationId | null {
  const basePath = `/${orgSlug}/${workspace}`

  if (pathname !== basePath && !pathname.startsWith(`${basePath}/`)) {
    return null
  }

  const relativePath = pathname.slice(basePath.length).replace(/\/+$/, '')

  const navigationItem = getSelectableOrganizationWorkspaceNavigationItems(
    workspace,
  ).find((item) => item.path === relativePath)

  return navigationItem?.id ?? null
}

export function getWorkspaceModuleFromPath(
  workspace: OrganizationWorkspaceRoute,
  orgSlug: string,
  pathname: string,
): OrganizationModuleId | null {
  const basePath = `/${orgSlug}/${workspace}`

  if (!pathname.startsWith(basePath)) {
    return null
  }

  const firstSegment = pathname.slice(basePath.length).split('/').find(Boolean)

  if (!firstSegment) {
    return 'dashboard'
  }

  const aliasModule = routeModuleAliases[firstSegment]

  if (aliasModule) {
    return aliasModule
  }

  const module = organizationModules.find((item) => item.id === firstSegment)

  return module?.id ?? null
}
