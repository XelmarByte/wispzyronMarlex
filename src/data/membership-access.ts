import type { DemoMembership } from '@/data/demo-account'
import { getNavigationIdsForPermissionKeys } from '@/data/custom-organization-roles'
import type { OrganizationModuleId } from '@/data/organization-modules'
import {
  getOrganizationPermission,
  type OrganizationPermissionKey,
} from '@/data/organization-permissions'
import { getSystemOrganizationRoleTemplate } from '@/data/organization-role-templates'
import type { OrganizationWorkspace } from '@/data/organization-roles'
import {
  getOrganizationWorkspaceNavigationItems,
  type OrganizationWorkspaceNavigationId,
} from '@/data/organization-workspace-navigation'

export function getMembershipRoleTemplateId(
  membership: DemoMembership,
): DemoMembership['role'] {
  return membership.roleTemplateId ?? membership.role
}

export function getMembershipWorkspace(
  membership: DemoMembership,
): OrganizationWorkspace {
  return membership.role === 'employee' ? 'employee' : 'manager'
}

export function getMembershipPermissionKeys(
  membership: DemoMembership,
): readonly OrganizationPermissionKey[] {
  if (membership.grantedPermissionKeys) {
    return membership.grantedPermissionKeys
  }

  return getSystemOrganizationRoleTemplate(
    getMembershipRoleTemplateId(membership),
  ).permissionKeys
}

export function getMembershipModuleIds(
  membership: DemoMembership,
): readonly OrganizationModuleId[] {
  if (membership.grantedPermissionKeys) {
    return [
      ...new Set(
        membership.grantedPermissionKeys.map(
          (permissionKey) => getOrganizationPermission(permissionKey).moduleId,
        ),
      ),
    ]
  }

  if (membership.grantedModuleIds) {
    return membership.grantedModuleIds
  }

  return getSystemOrganizationRoleTemplate(
    getMembershipRoleTemplateId(membership),
  ).moduleIds
}

export function getMembershipNavigationIds(
  membership: DemoMembership,
): readonly OrganizationWorkspaceNavigationId[] {
  if (membership.grantedNavigationIds !== undefined) {
    return membership.grantedNavigationIds
  }

  return getNavigationIdsForPermissionKeys(
    getMembershipWorkspace(membership),
    getMembershipPermissionKeys(membership),
  )
}

const dashboardNavigationIdByWorkspace: Record<
  OrganizationWorkspace,
  OrganizationWorkspaceNavigationId
> = {
  manager: 'manager.dashboard',
  employee: 'employee.dashboard',
}

export function getMembershipWorkspaceEntryPath(
  membership: DemoMembership,
): string {
  const workspace = getMembershipWorkspace(membership)
  const navigationIds = getMembershipNavigationIds(membership)

  const navigationItems = getOrganizationWorkspaceNavigationItems(workspace)

  const dashboardNavigationId = dashboardNavigationIdByWorkspace[workspace]

  const dashboardItem = navigationIds.includes(dashboardNavigationId)
    ? navigationItems.find((item) => item.id === dashboardNavigationId)
    : undefined

  const firstAllowedItem = navigationItems.find((item) =>
    navigationIds.includes(item.id),
  )

  return (dashboardItem ?? firstAllowedItem)?.path ?? ''
}

export function hasMembershipModuleAccess(
  membership: DemoMembership,
  moduleId: OrganizationModuleId,
): boolean {
  return getMembershipModuleIds(membership).includes(moduleId)
}

export function hasMembershipNavigationAccess(
  membership: DemoMembership,
  navigationId: OrganizationWorkspaceNavigationId,
): boolean {
  return getMembershipNavigationIds(membership).includes(navigationId)
}

export function hasMembershipPermission(
  membership: DemoMembership,
  permissionKey: OrganizationPermissionKey,
): boolean {
  return getMembershipPermissionKeys(membership).includes(permissionKey)
}
