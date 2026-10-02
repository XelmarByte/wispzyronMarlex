import type {
  CustomOrganizationRole,
  CustomOrganizationRoleId,
} from '@/data/custom-organization-roles'
import {
  getSystemOrganizationRoleLabel,
  type SystemOrganizationRoleKey,
} from '@/data/organization-roles'

interface OrganizationRoleAssignment {
  customRoleId?: CustomOrganizationRoleId | null
  role: SystemOrganizationRoleKey
}

export function getOrganizationRoleAssignmentLabel(
  assignment: OrganizationRoleAssignment,
  customRoles: readonly CustomOrganizationRole[],
): string {
  if (assignment.customRoleId) {
    const customRole = customRoles.find(
      (role) => role.id === assignment.customRoleId,
    )

    if (customRole) {
      return customRole.name
    }
  }

  return getSystemOrganizationRoleLabel(assignment.role)
}
