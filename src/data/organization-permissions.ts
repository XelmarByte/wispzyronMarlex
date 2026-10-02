import type { OrganizationModuleId } from '@/data/organization-modules'

export type OrganizationPermissionKey =
  | 'dashboard.view'
  | 'customers.read'
  | 'customers.create'
  | 'customers.update'
  | 'billing.read'
  | 'billing.manage'
  | 'network.monitor'
  | 'network.manage'
  | 'inventory.read'
  | 'inventory.adjust'
  | 'support.read'
  | 'support.create'
  | 'support.manage'
  | 'field-operations.read'
  | 'field-operations.manage'
  | 'employees.read'
  | 'employees.invite'
  | 'employees.manage'
  | 'roles.manage'
  | 'analytics.view'
  | 'projects.read'
  | 'projects.manage'
  | 'settings.manage'

export interface OrganizationPermission {
  key: OrganizationPermissionKey
  moduleId: OrganizationModuleId
  label: string
  description: string
}

export const organizationPermissions: readonly OrganizationPermission[] = [
  {
    key: 'dashboard.view',
    moduleId: 'dashboard',
    label: 'Ver panel principal',
    description: 'Consulta el resumen de la organización.',
  },
  {
    key: 'customers.read',
    moduleId: 'customers',
    label: 'Ver clientes',
    description: 'Consulta información de clientes y servicios.',
  },
  {
    key: 'customers.create',
    moduleId: 'customers',
    label: 'Crear clientes',
    description: 'Registra nuevos clientes y servicios.',
  },
  {
    key: 'customers.update',
    moduleId: 'customers',
    label: 'Editar clientes',
    description: 'Actualiza información comercial y de servicio.',
  },
  {
    key: 'billing.read',
    moduleId: 'billing',
    label: 'Ver facturación',
    description: 'Consulta comprobantes, pagos y cuentas por cobrar.',
  },
  {
    key: 'billing.manage',
    moduleId: 'billing',
    label: 'Gestionar facturación',
    description: 'Registra pagos y administra documentos de cobro.',
  },
  {
    key: 'network.monitor',
    moduleId: 'network',
    label: 'Monitorear red',
    description: 'Consulta infraestructura, equipos y estado de red.',
  },
  {
    key: 'network.manage',
    moduleId: 'network',
    label: 'Gestionar red',
    description: 'Administra infraestructura y configuraciones autorizadas.',
  },
  {
    key: 'inventory.read',
    moduleId: 'inventory',
    label: 'Ver inventario',
    description: 'Consulta existencias, equipos y movimientos.',
  },
  {
    key: 'inventory.adjust',
    moduleId: 'inventory',
    label: 'Ajustar inventario',
    description: 'Registra ingresos, salidas y ajustes de stock.',
  },
  {
    key: 'support.read',
    moduleId: 'support',
    label: 'Ver soporte',
    description: 'Consulta tickets e incidencias.',
  },
  {
    key: 'support.create',
    moduleId: 'support',
    label: 'Crear tickets',
    description: 'Registra solicitudes, incidencias y tareas.',
  },
  {
    key: 'support.manage',
    moduleId: 'support',
    label: 'Gestionar soporte',
    description: 'Asigna, actualiza y cierra tickets.',
  },
  {
    key: 'field-operations.read',
    moduleId: 'field-operations',
    label: 'Ver operaciones de campo',
    description: 'Consulta visitas, órdenes y cuadrillas.',
  },
  {
    key: 'field-operations.manage',
    moduleId: 'field-operations',
    label: 'Gestionar operaciones de campo',
    description: 'Programa y administra órdenes de trabajo.',
  },
  {
    key: 'employees.read',
    moduleId: 'employees',
    label: 'Ver equipo',
    description: 'Consulta miembros, invitaciones y equipos.',
  },
  {
    key: 'employees.invite',
    moduleId: 'employees',
    label: 'Invitar personas',
    description: 'Envía invitaciones a nuevos miembros.',
  },
  {
    key: 'employees.manage',
    moduleId: 'employees',
    label: 'Gestionar equipo',
    description: 'Actualiza miembros y sus datos laborales.',
  },
  {
    key: 'roles.manage',
    moduleId: 'employees',
    label: 'Gestionar roles y permisos',
    description: 'Crea roles y asigna permisos a los miembros.',
  },
  {
    key: 'analytics.view',
    moduleId: 'analytics',
    label: 'Ver analítica',
    description: 'Consulta indicadores, reportes y análisis.',
  },
  {
    key: 'projects.read',
    moduleId: 'projects',
    label: 'Ver proyectos',
    description: 'Consulta proyectos e iniciativas internas.',
  },
  {
    key: 'projects.manage',
    moduleId: 'projects',
    label: 'Gestionar proyectos',
    description: 'Crea, edita y organiza proyectos.',
  },
  {
    key: 'settings.manage',
    moduleId: 'settings',
    label: 'Gestionar configuración',
    description: 'Administra datos y apariencia de la organización.',
  },
]

export function getOrganizationPermission(
  permissionKey: OrganizationPermissionKey,
): OrganizationPermission {
  const permission = organizationPermissions.find(
    (item) => item.key === permissionKey,
  )

  if (!permission) {
    throw new Error(`Permiso de organización no encontrado: ${permissionKey}`)
  }

  return permission
}
