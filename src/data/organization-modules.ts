export type OrganizationModuleId =
  | 'dashboard'
  | 'customers'
  | 'billing'
  | 'network'
  | 'inventory'
  | 'support'
  | 'field-operations'
  | 'employees'
  | 'analytics'
  | 'projects'
  | 'settings'

export type OrganizationModuleArea =
  | 'commercial'
  | 'finance'
  | 'network'
  | 'operations'
  | 'people'
  | 'insights'
  | 'administration'

export type OrganizationModuleWorkspace = 'manager' | 'employee' | 'both'

export interface OrganizationModule {
  id: OrganizationModuleId
  label: string
  description: string
  area: OrganizationModuleArea
  workspace: OrganizationModuleWorkspace
}

export const organizationModules: readonly OrganizationModule[] = [
  {
    id: 'dashboard',
    label: 'Panel principal',
    description: 'Resumen de la operación y métricas relevantes.',
    area: 'operations',
    workspace: 'both',
  },
  {
    id: 'customers',
    label: 'Clientes',
    description: 'Gestión comercial, contratos y datos de clientes.',
    area: 'commercial',
    workspace: 'both',
  },
  {
    id: 'billing',
    label: 'Facturación',
    description: 'Cobros, comprobantes, pagos y cuentas por cobrar.',
    area: 'finance',
    workspace: 'manager',
  },
  {
    id: 'network',
    label: 'Red',
    description: 'Infraestructura, equipos, monitoreo y conectividad.',
    area: 'network',
    workspace: 'both',
  },
  {
    id: 'inventory',
    label: 'Inventario',
    description: 'Equipos, materiales, stock y movimientos.',
    area: 'operations',
    workspace: 'both',
  },
  {
    id: 'support',
    label: 'Soporte',
    description: 'Tickets, incidencias y atención técnica.',
    area: 'operations',
    workspace: 'both',
  },
  {
    id: 'field-operations',
    label: 'Operaciones de campo',
    description: 'Instalaciones, visitas, cuadrillas y órdenes de trabajo.',
    area: 'operations',
    workspace: 'employee',
  },
  {
    id: 'employees',
    label: 'Personas y accesos',
    description: 'Empleados, invitaciones, roles y equipos.',
    area: 'people',
    workspace: 'manager',
  },
  {
    id: 'analytics',
    label: 'Analítica',
    description: 'Indicadores, reportes y análisis asistido.',
    area: 'insights',
    workspace: 'manager',
  },
  {
    id: 'projects',
    label: 'Proyectos',
    description: 'Planificación y seguimiento de iniciativas internas.',
    area: 'operations',
    workspace: 'both',
  },
  {
    id: 'settings',
    label: 'Configuración',
    description: 'Datos, apariencia y preferencias de la organización.',
    area: 'administration',
    workspace: 'manager',
  },
]

export function getOrganizationModule(
  moduleId: OrganizationModuleId,
): OrganizationModule {
  const module = organizationModules.find((item) => item.id === moduleId)

  if (!module) {
    throw new Error(`Módulo de organización no encontrado: ${moduleId}`)
  }

  return module
}
