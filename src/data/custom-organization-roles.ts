import {
  getOrganizationModule,
  type OrganizationModuleId,
} from '@/data/organization-modules'
import {
  getOrganizationPermission,
  type OrganizationPermissionKey,
} from '@/data/organization-permissions'
import type { OrganizationWorkspace } from '@/data/organization-roles'
import {
  getOrganizationWorkspaceNavigationItems,
  getSelectableOrganizationWorkspaceNavigationItems,
  type OrganizationWorkspaceNavigationId,
} from '@/data/organization-workspace-navigation'

export type CustomOrganizationRoleId = `custom-role-${string}`

export interface CustomOrganizationRole {
  id: CustomOrganizationRoleId
  organizationId: string
  source: 'custom'
  name: string
  description: string
  workspace: OrganizationWorkspace

  /*
   * Accesos visuales y de ruta del rol.
   * Es opcional para mantener compatibles los roles creados antes de esta
   * migración, que solo tenían permissionKeys.
   */
  navigationIds?: OrganizationWorkspaceNavigationId[]

  /*
   * Permisos internos temporales. Más adelante pasarán al backend,
   * donde podrán representar acciones específicas por módulo.
   */
  permissionKeys: OrganizationPermissionKey[]

  createdAt: string
  updatedAt: string
}

export interface CreateCustomOrganizationRoleInput {
  organizationId: string
  name: string
  description: string
  workspace: OrganizationWorkspace
  navigationIds?: OrganizationWorkspaceNavigationId[]

  /*
   * Se conserva mientras migramos el editor actual.
   * El siguiente paso dejará de enviarlo manualmente.
   */
  permissionKeys?: OrganizationPermissionKey[]
}

const basePermissionByModule: Record<
  OrganizationModuleId,
  OrganizationPermissionKey
> = {
  dashboard: 'dashboard.view',
  customers: 'customers.read',
  billing: 'billing.read',
  network: 'network.monitor',
  inventory: 'inventory.read',
  support: 'support.read',
  'field-operations': 'field-operations.read',
  employees: 'employees.read',
  analytics: 'analytics.view',
  projects: 'projects.read',
  settings: 'settings.manage',
}

function getPermissionKeysForNavigationItem(
  navigationId: OrganizationWorkspaceNavigationId,
  moduleId: OrganizationModuleId,
): OrganizationPermissionKey[] {
  if (navigationId === 'employee.customers.new') {
    return ['customers.read', 'customers.create']
  }

  if (navigationId === 'manager.employees.invitations') {
    return ['employees.read', 'employees.invite']
  }

  if (navigationId === 'manager.employees.roles') {
    return ['employees.read', 'roles.manage']
  }

  return [basePermissionByModule[moduleId]]
}

export function getPermissionKeysForNavigationIds(
  workspace: OrganizationWorkspace,
  navigationIds: readonly OrganizationWorkspaceNavigationId[],
): OrganizationPermissionKey[] {
  const selectableItems =
    getSelectableOrganizationWorkspaceNavigationItems(workspace)

  return [
    ...new Set(
      navigationIds.flatMap((navigationId) => {
        const item = selectableItems.find(
          (candidate) => candidate.id === navigationId,
        )

        return item
          ? getPermissionKeysForNavigationItem(item.id, item.moduleId)
          : []
      }),
    ),
  ]
}

export function getNavigationIdsForPermissionKeys(
  workspace: OrganizationWorkspace,
  permissionKeys: readonly OrganizationPermissionKey[],
): OrganizationWorkspaceNavigationId[] {
  const moduleIds = new Set(
    permissionKeys.map(
      (permissionKey) => getOrganizationPermission(permissionKey).moduleId,
    ),
  )

  return getSelectableOrganizationWorkspaceNavigationItems(workspace)
    .filter((item) => moduleIds.has(item.moduleId))
    .map((item) => item.id)
}

export function getCustomOrganizationRoleNavigationIds(
  role: Pick<
    CustomOrganizationRole,
    'workspace' | 'navigationIds' | 'permissionKeys'
  >,
): OrganizationWorkspaceNavigationId[] {
  if (role.navigationIds && role.navigationIds.length > 0) {
    return [...role.navigationIds]
  }

  /*
   * Compatibilidad con los roles anteriores: un permiso antiguo de módulo
   * habilita sus subrutas actuales hasta que el rol sea editado.
   */
  return getNavigationIdsForPermissionKeys(role.workspace, role.permissionKeys)
}

export function getCustomOrganizationRoleModuleIds(
  role: Pick<
    CustomOrganizationRole,
    'workspace' | 'navigationIds' | 'permissionKeys'
  >,
): OrganizationModuleId[] {
  const navigationIds = getCustomOrganizationRoleNavigationIds(role)

  if (navigationIds.length > 0) {
    const items = getOrganizationWorkspaceNavigationItems(role.workspace)

    return [
      ...new Set(
        navigationIds.flatMap((navigationId) => {
          const item = items.find((candidate) => candidate.id === navigationId)

          return item ? [item.moduleId] : []
        }),
      ),
    ]
  }

  return [
    ...new Set(
      role.permissionKeys.map(
        (permissionKey) => getOrganizationPermission(permissionKey).moduleId,
      ),
    ),
  ]
}

export function createCustomOrganizationRole(
  input: CreateCustomOrganizationRoleInput,
): CustomOrganizationRole {
  const name = input.name.trim()
  const description = input.description.trim()

  const navigationIds = [...new Set(input.navigationIds ?? [])]

  const selectableNavigationIds = new Set(
    getSelectableOrganizationWorkspaceNavigationItems(input.workspace).map(
      (item) => item.id,
    ),
  )

  const invalidNavigationId = navigationIds.find(
    (navigationId) => !selectableNavigationIds.has(navigationId),
  )

  if (invalidNavigationId) {
    throw new Error(
      'El rol contiene un acceso que no corresponde a su espacio de trabajo.',
    )
  }

  const legacyPermissionKeys = [...new Set(input.permissionKeys ?? [])]

  const permissionKeys =
    navigationIds.length > 0
      ? getPermissionKeysForNavigationIds(input.workspace, navigationIds)
      : legacyPermissionKeys

  const invalidPermissionKey = permissionKeys.find((permissionKey) => {
    const permission = getOrganizationPermission(permissionKey)

    const module = getOrganizationModule(permission.moduleId)

    return module.workspace !== 'both' && module.workspace !== input.workspace
  })

  if (invalidPermissionKey) {
    throw new Error(
      'El rol contiene un permiso que no corresponde a su espacio de trabajo.',
    )
  }

  if (!input.organizationId.trim()) {
    throw new Error('La organización es obligatoria.')
  }

  if (!name) {
    throw new Error('El nombre del rol es obligatorio.')
  }

  if (name.length > 64) {
    throw new Error('El nombre del rol no puede superar los 64 caracteres.')
  }

  if (permissionKeys.length === 0) {
    throw new Error('Selecciona al menos un acceso para el rol.')
  }

  const timestamp = new Date().toISOString()

  return {
    id: `custom-role-${crypto.randomUUID()}`,
    organizationId: input.organizationId,
    source: 'custom',
    name,
    description,
    workspace: input.workspace,
    navigationIds: navigationIds.length > 0 ? navigationIds : undefined,
    permissionKeys,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}
