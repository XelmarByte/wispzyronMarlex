import type { ComponentProps, ComponentType } from 'react'
import {
  AddressBookIcon,
  CirclesFourIcon,
  CreditCardIcon,
  CubeIcon,
  HeadsetIcon,
  NetworkIcon,
  NoteIcon,
  UsersIcon,
} from '@/components/icons'
import type { OrganizationModuleId } from '@/data/organization-modules'
import type { OrganizationPermissionKey } from '@/data/organization-permissions'
import {
  organizationWorkspaceNavigation,
  type OrganizationWorkspaceNavigationId,
  type OrganizationWorkspaceNavigationItem,
} from '@/data/organization-workspace-navigation'

type NavigationIcon = ComponentType<ComponentProps<'svg'>>

export interface ManagerNavigationItem {
  id: OrganizationWorkspaceNavigationId
  label: string
  path: string
  icon?: NavigationIcon
  children?: ManagerNavigationItem[]
  moduleId: OrganizationModuleId
  requiredPermission?: OrganizationPermissionKey
}

export interface ManagerNavigationGroup {
  label: string
  items: ManagerNavigationItem[]
}

const iconByNavigationId: Partial<
  Record<OrganizationWorkspaceNavigationId, NavigationIcon>
> = {
  'manager.dashboard': CirclesFourIcon,
  'manager.customers': UsersIcon,
  'manager.billing': CreditCardIcon,
  'manager.network': NetworkIcon,
  'manager.support': HeadsetIcon,
  'manager.inventory': CubeIcon,
  'manager.employees': AddressBookIcon,
  'manager.projects': NoteIcon,
  'manager.analytics': CirclesFourIcon,
}

const requiredPermissionByNavigationId: Partial<
  Record<OrganizationWorkspaceNavigationId, OrganizationPermissionKey>
> = {
  'manager.employees.invitations': 'employees.invite',
  'manager.employees.roles': 'roles.manage',
}

function createNavigationItem(
  item: OrganizationWorkspaceNavigationItem,
): ManagerNavigationItem {
  return {
    id: item.id,
    label: item.label,
    path: item.path,
    icon: iconByNavigationId[item.id],
    moduleId: item.moduleId,
    requiredPermission: requiredPermissionByNavigationId[item.id],
    children: item.children?.map(createNavigationItem),
  }
}

export const managerNavigation: ManagerNavigationGroup[] =
  organizationWorkspaceNavigation.manager.map((group) => ({
    label: group.label,
    items: group.items.map(createNavigationItem),
  }))

function getVisibleNavigationItems(
  items: readonly ManagerNavigationItem[],
  navigationIds: readonly OrganizationWorkspaceNavigationId[],
  permissionKeys: readonly OrganizationPermissionKey[],
): ManagerNavigationItem[] {
  return items.flatMap((item) => {
    const hasRequiredPermission =
      item.requiredPermission === undefined ||
      permissionKeys.includes(item.requiredPermission)

    if (!hasRequiredPermission) {
      return []
    }

    const children = item.children
      ? getVisibleNavigationItems(item.children, navigationIds, permissionKeys)
      : undefined

    if (item.children) {
      return children && children.length > 0 ? [{ ...item, children }] : []
    }

    return navigationIds.includes(item.id) ? [item] : []
  })
}

export function getManagerNavigation(
  navigationIds: readonly OrganizationWorkspaceNavigationId[],
  permissionKeys: readonly OrganizationPermissionKey[],
): ManagerNavigationGroup[] {
  return managerNavigation
    .map((group) => ({
      ...group,
      items: getVisibleNavigationItems(
        group.items,
        navigationIds,
        permissionKeys,
      ),
    }))
    .filter((group) => group.items.length > 0)
}

export function getManagerHref(orgSlug: string, path: string): string {
  return `/${orgSlug}/manager${path}`
}
