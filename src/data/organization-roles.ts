export type SystemOrganizationRoleKey =
  'owner' | 'administrator' | 'manager' | 'employee'

export type OrganizationWorkspace = 'manager' | 'employee'

export interface SystemOrganizationRole {
  id: SystemOrganizationRoleKey
  label: string
  description: string
  workspace: OrganizationWorkspace
  canBeAssigned: boolean
}

export const systemOrganizationRoles: readonly SystemOrganizationRole[] = [
  {
    id: 'owner',
    label: 'Propietario',
    description:
      'Responsable principal de la organización y de su configuración.',
    workspace: 'manager',
    canBeAssigned: false,
  },
  {
    id: 'administrator',
    label: 'Administrador',
    description:
      'Gestiona la organización, las personas y la configuración autorizada.',
    workspace: 'manager',
    canBeAssigned: true,
  },
  {
    id: 'manager',
    label: 'Gerente',
    description:
      'Supervisa la operación y administra los equipos bajo su responsabilidad.',
    workspace: 'manager',
    canBeAssigned: true,
  },
  {
    id: 'employee',
    label: 'Empleado',
    description:
      'Accede a los módulos operativos que le asigne la organización.',
    workspace: 'employee',
    canBeAssigned: true,
  },
]

export function getSystemOrganizationRole(
  roleId: SystemOrganizationRoleKey,
): SystemOrganizationRole {
  const role = systemOrganizationRoles.find((item) => item.id === roleId)

  if (!role) {
    throw new Error(`Rol de organización no encontrado: ${roleId}`)
  }

  return role
}

export function getSystemOrganizationRoleLabel(
  roleId: SystemOrganizationRoleKey,
): string {
  return getSystemOrganizationRole(roleId).label
}

export function isManagementRole(
  roleId: SystemOrganizationRoleKey,
): roleId is Exclude<SystemOrganizationRoleKey, 'employee'> {
  return roleId !== 'employee'
}
