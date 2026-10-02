import type { ComponentProps, ComponentType } from 'react'
import {
  CirclesFourIcon,
  CubeIcon,
  HeadsetIcon,
  NetworkIcon,
  UsersIcon,
} from '@/components/icons'
import type { OrganizationModuleId } from '@/data/organization-modules'
import {
  organizationWorkspaceNavigation,
  type OrganizationWorkspaceNavigationId,
  type OrganizationWorkspaceNavigationItem,
} from '@/data/organization-workspace-navigation'

type NavigationIcon = ComponentType<ComponentProps<'svg'>>

export interface EmployeeNavigationItem {
  id: OrganizationWorkspaceNavigationId
  label: string
  path: string
  icon?: NavigationIcon
  children?: EmployeeNavigationItem[]
  moduleId: OrganizationModuleId
}

export interface EmployeeNavigationGroup {
  label: string
  items: EmployeeNavigationItem[]
}

const iconByNavigationId: Partial<
  Record<OrganizationWorkspaceNavigationId, NavigationIcon>
> = {
  'employee.dashboard': CirclesFourIcon,
  'employee.customers': UsersIcon,
  'employee.support': HeadsetIcon,
  'employee.network': NetworkIcon,
  'employee.inventory': CubeIcon,
}

function createNavigationItem(
  item: OrganizationWorkspaceNavigationItem,
): EmployeeNavigationItem {
  return {
    id: item.id,
    label: item.label,
    path: item.path,
    icon: iconByNavigationId[item.id],
    moduleId: item.moduleId,
    children: item.children?.map(createNavigationItem),
  }
}

export const employeeNavigation: EmployeeNavigationGroup[] =
  organizationWorkspaceNavigation.employee.map((group) => ({
    label: group.label,
    items: group.items.map(createNavigationItem),
  }))

function getVisibleNavigationItems(
  items: readonly EmployeeNavigationItem[],
  navigationIds: readonly OrganizationWorkspaceNavigationId[],
): EmployeeNavigationItem[] {
  return items.flatMap((item) => {
    const children = item.children
      ? getVisibleNavigationItems(item.children, navigationIds)
      : undefined

    if (item.children) {
      return children && children.length > 0 ? [{ ...item, children }] : []
    }

    return navigationIds.includes(item.id) ? [item] : []
  })
}

export function getEmployeeNavigation(
  navigationIds: readonly OrganizationWorkspaceNavigationId[],
): EmployeeNavigationGroup[] {
  return employeeNavigation
    .map((group) => ({
      ...group,
      items: getVisibleNavigationItems(group.items, navigationIds),
    }))
    .filter((group) => group.items.length > 0)
}

export function getEmployeeHref(orgSlug: string, path: string): string {
  return `/${orgSlug}/employee${path}`
}
