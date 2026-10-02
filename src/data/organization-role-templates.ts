import {
  getSystemOrganizationRole,
  type OrganizationWorkspace,
  type SystemOrganizationRoleKey,
} from '@/data/organization-roles'
import type { OrganizationModuleId } from '@/data/organization-modules'
import {
  getOrganizationPermission,
  organizationPermissions,
  type OrganizationPermissionKey,
} from '@/data/organization-permissions'

export interface OrganizationRoleTemplate {
  id: SystemOrganizationRoleKey
  source: 'system'
  label: string
  description: string
  workspace: OrganizationWorkspace
  canBeAssigned: boolean
  moduleIds: readonly OrganizationModuleId[]
  permissionKeys: readonly OrganizationPermissionKey[]
}

const allPermissionKeys = organizationPermissions.map(
  (permission) => permission.key,
)

const managerPermissionKeys: readonly OrganizationPermissionKey[] = [
  'dashboard.view',
  'customers.read',
  'customers.create',
  'customers.update',
  'billing.read',
  'billing.manage',
  'network.monitor',
  'network.manage',
  'inventory.read',
  'inventory.adjust',
  'support.read',
  'support.create',
  'support.manage',
  'employees.read',
  'employees.invite',
  'employees.manage',
  'analytics.view',
  'projects.read',
  'projects.manage',
  'settings.manage',
]

const employeePermissionKeys: readonly OrganizationPermissionKey[] = [
  'dashboard.view',
  'customers.read',
  'network.monitor',
  'inventory.read',
  'support.read',
  'support.create',
  'field-operations.read',
  'field-operations.manage',
  'projects.read',
]

function getModuleIdsForPermissions(
  permissionKeys: readonly OrganizationPermissionKey[],
): readonly OrganizationModuleId[] {
  return [
    ...new Set(
      permissionKeys.map(
        (permissionKey) => getOrganizationPermission(permissionKey).moduleId,
      ),
    ),
  ]
}

function createSystemRoleTemplate(
  roleId: SystemOrganizationRoleKey,
  permissionKeys: readonly OrganizationPermissionKey[],
): OrganizationRoleTemplate {
  const role = getSystemOrganizationRole(roleId)

  return {
    id: role.id,
    source: 'system',
    label: role.label,
    description: role.description,
    workspace: role.workspace,
    canBeAssigned: role.canBeAssigned,
    moduleIds: getModuleIdsForPermissions(permissionKeys),
    permissionKeys,
  }
}

export const systemOrganizationRoleTemplates: readonly OrganizationRoleTemplate[] =
  [
    createSystemRoleTemplate('owner', allPermissionKeys),

    createSystemRoleTemplate('administrator', allPermissionKeys),

    createSystemRoleTemplate('manager', managerPermissionKeys),

    createSystemRoleTemplate('employee', employeePermissionKeys),
  ]

export function getSystemOrganizationRoleTemplate(
  roleId: SystemOrganizationRoleKey,
): OrganizationRoleTemplate {
  const template = systemOrganizationRoleTemplates.find(
    (item) => item.id === roleId,
  )

  if (!template) {
    throw new Error(`Plantilla de rol no encontrada: ${roleId}`)
  }

  return template
}
