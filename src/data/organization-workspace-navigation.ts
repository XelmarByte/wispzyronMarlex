import type { OrganizationModuleId } from '@/data/organization-modules'
import type { OrganizationWorkspace } from '@/data/organization-roles'

export type OrganizationWorkspaceNavigationId =
  | 'manager.dashboard'
  | 'manager.customers'
  | 'manager.billing'
  | 'manager.network'
  | 'manager.network.summary'
  | 'manager.network.infrastructure'
  | 'manager.network.routers'
  | 'manager.network.hardware'
  | 'manager.network.sites'
  | 'manager.support'
  | 'manager.support.scheduling'
  | 'manager.support.tasks'
  | 'manager.support.projects'
  | 'manager.support.map'
  | 'manager.inventory'
  | 'manager.employees'
  | 'manager.employees.team'
  | 'manager.employees.invitations'
  | 'manager.employees.roles'
  | 'manager.projects'
  | 'manager.analytics'
  | 'employee.dashboard'
  | 'employee.customers'
  | 'employee.customers.summary'
  | 'employee.customers.list'
  | 'employee.customers.new'
  | 'employee.customers.map'
  | 'employee.customers.analytics'
  | 'employee.support'
  | 'employee.support.scheduling'
  | 'employee.support.tasks'
  | 'employee.support.projects'
  | 'employee.support.map'
  | 'employee.network'
  | 'employee.network.summary'
  | 'employee.network.infrastructure'
  | 'employee.network.routers'
  | 'employee.network.hardware'
  | 'employee.network.sites'
  | 'employee.inventory'

export interface OrganizationWorkspaceNavigationItem {
  id: OrganizationWorkspaceNavigationId
  label: string
  description: string
  path: string
  moduleId: OrganizationModuleId
  selectable: boolean
  children?: readonly OrganizationWorkspaceNavigationItem[]
}

export interface OrganizationWorkspaceNavigationGroup {
  label: string
  items: readonly OrganizationWorkspaceNavigationItem[]
}

export const organizationWorkspaceNavigation: Record<
  OrganizationWorkspace,
  readonly OrganizationWorkspaceNavigationGroup[]
> = {
  manager: [
    {
      label: 'Principal',
      items: [
        {
          id: 'manager.dashboard',
          label: 'Dashboard',
          description: 'Resumen general de la organización.',
          path: '',
          moduleId: 'dashboard',
          selectable: true,
        },
      ],
    },
    {
      label: 'Gestión comercial',
      items: [
        {
          id: 'manager.customers',
          label: 'Clientes',
          description: 'Consulta y gestión comercial de clientes.',
          path: '/customers',
          moduleId: 'customers',
          selectable: true,
        },
        {
          id: 'manager.billing',
          label: 'Facturación',
          description: 'Cobros, comprobantes, pagos y cuentas por cobrar.',
          path: '/billing',
          moduleId: 'billing',
          selectable: true,
        },
      ],
    },
    {
      label: 'Operaciones',
      items: [
        {
          id: 'manager.network',
          label: 'Red',
          description: 'Monitoreo e infraestructura de la red.',
          path: '/network',
          moduleId: 'network',
          selectable: false,
          children: [
            {
              id: 'manager.network.summary',
              label: 'Resumen de red',
              description: 'Disponibilidad, alertas y estado general de red.',
              path: '/network',
              moduleId: 'network',
              selectable: true,
            },
            {
              id: 'manager.network.infrastructure',
              label: 'Infraestructura',
              description: 'Agrupa los recursos físicos y lógicos de red.',
              path: '/network/infrastructure',
              moduleId: 'network',
              selectable: false,
              children: [
                {
                  id: 'manager.network.routers',
                  label: 'Routers',
                  description: 'Routers y equipos de enrutamiento.',
                  path: '/network/routers',
                  moduleId: 'network',
                  selectable: true,
                },
                {
                  id: 'manager.network.hardware',
                  label: 'Hardware de red',
                  description: 'Equipos, antenas y hardware asociado.',
                  path: '/network/hardware',
                  moduleId: 'network',
                  selectable: true,
                },
                {
                  id: 'manager.network.sites',
                  label: 'Sitios y nodos',
                  description: 'Sedes, torres, nodos y puntos de presencia.',
                  path: '/network/sites',
                  moduleId: 'network',
                  selectable: true,
                },
              ],
            },
          ],
        },
        {
          id: 'manager.support',
          label: 'Soporte',
          description: 'Programación y seguimiento del trabajo de soporte.',
          path: '/support',
          moduleId: 'support',
          selectable: false,
          children: [
            {
              id: 'manager.support.scheduling',
              label: 'Programación',
              description: 'Agenda y programación de atención.',
              path: '/support/scheduling',
              moduleId: 'support',
              selectable: true,
            },
            {
              id: 'manager.support.tasks',
              label: 'Tareas',
              description: 'Tareas e incidencias asignadas al equipo.',
              path: '/support/tasks',
              moduleId: 'support',
              selectable: true,
            },
            {
              id: 'manager.support.projects',
              label: 'Proyectos',
              description: 'Proyectos relacionados con soporte y operación.',
              path: '/support/projects',
              moduleId: 'support',
              selectable: true,
            },
            {
              id: 'manager.support.map',
              label: 'Mapa de soporte',
              description: 'Ubicación geográfica de incidencias y atenciones.',
              path: '/support/map',
              moduleId: 'support',
              selectable: true,
            },
          ],
        },
        {
          id: 'manager.inventory',
          label: 'Inventario',
          description: 'Consulta de equipos, materiales y existencias.',
          path: '/inventory',
          moduleId: 'inventory',
          selectable: true,
        },
      ],
    },
    {
      label: 'Equipo',
      items: [
        {
          id: 'manager.employees',
          label: 'Empleados',
          description: 'Administración de miembros y accesos.',
          path: '/employees',
          moduleId: 'employees',
          selectable: false,
          children: [
            {
              id: 'manager.employees.team',
              label: 'Equipo',
              description: 'Miembros activos de la organización.',
              path: '/employees',
              moduleId: 'employees',
              selectable: true,
            },
            {
              id: 'manager.employees.invitations',
              label: 'Invitaciones',
              description: 'Invitaciones pendientes y enviadas.',
              path: '/employees/invitations',
              moduleId: 'employees',
              selectable: true,
            },
            {
              id: 'manager.employees.roles',
              label: 'Roles y permisos',
              description: 'Plantillas, roles personalizados y permisos.',
              path: '/employees/roles',
              moduleId: 'employees',
              selectable: true,
            },
          ],
        },
      ],
    },
    {
      label: 'Planificación y análisis',
      items: [
        {
          id: 'manager.projects',
          label: 'Proyectos',
          description: 'Planificación y seguimiento de iniciativas.',
          path: '/projects',
          moduleId: 'projects',
          selectable: true,
        },
        {
          id: 'manager.analytics',
          label: 'Analytics',
          description: 'Indicadores, reportes y análisis de negocio.',
          path: '/analytics',
          moduleId: 'analytics',
          selectable: true,
        },
      ],
    },
  ],

  employee: [
    {
      label: 'Principal',
      items: [
        {
          id: 'employee.dashboard',
          label: 'Dashboard',
          description: 'Resumen de las tareas y actividad asignada.',
          path: '',
          moduleId: 'dashboard',
          selectable: true,
        },
      ],
    },
    {
      label: 'Clientes y servicio',
      items: [
        {
          id: 'employee.customers',
          label: 'Clientes',
          description: 'Consulta y gestión operativa de clientes.',
          path: '/customers',
          moduleId: 'customers',
          selectable: false,
          children: [
            {
              id: 'employee.customers.summary',
              label: 'Resumen',
              description: 'Vista general de clientes y servicios.',
              path: '/customers',
              moduleId: 'customers',
              selectable: true,
            },
            {
              id: 'employee.customers.list',
              label: 'Lista de clientes',
              description: 'Listado operativo de clientes.',
              path: '/customers/list',
              moduleId: 'customers',
              selectable: true,
            },
            {
              id: 'employee.customers.new',
              label: 'Nuevo cliente',
              description: 'Registro de un nuevo cliente.',
              path: '/customers/new',
              moduleId: 'customers',
              selectable: true,
            },
            {
              id: 'employee.customers.map',
              label: 'Mapa de clientes',
              description: 'Ubicación y cobertura de clientes.',
              path: '/customers/map',
              moduleId: 'customers',
              selectable: true,
            },
            {
              id: 'employee.customers.analytics',
              label: 'Analítica',
              description: 'Indicadores operativos de clientes.',
              path: '/customers/analytics',
              moduleId: 'customers',
              selectable: true,
            },
          ],
        },
        {
          id: 'employee.support',
          label: 'Soporte',
          description: 'Atención y seguimiento del soporte asignado.',
          path: '/support',
          moduleId: 'support',
          selectable: false,
          children: [
            {
              id: 'employee.support.scheduling',
              label: 'Programación',
              description: 'Agenda de visitas y atenciones.',
              path: '/support/scheduling',
              moduleId: 'support',
              selectable: true,
            },
            {
              id: 'employee.support.tasks',
              label: 'Tareas',
              description: 'Tareas e incidencias asignadas.',
              path: '/support/tasks',
              moduleId: 'support',
              selectable: true,
            },
            {
              id: 'employee.support.projects',
              label: 'Proyectos',
              description: 'Proyectos operativos vinculados al soporte.',
              path: '/support/projects',
              moduleId: 'support',
              selectable: true,
            },
            {
              id: 'employee.support.map',
              label: 'Mapa de soporte',
              description: 'Ubicación de incidencias y atenciones.',
              path: '/support/map',
              moduleId: 'support',
              selectable: true,
            },
          ],
        },
      ],
    },
    {
      label: 'Operaciones',
      items: [
        {
          id: 'employee.network',
          label: 'Red',
          description: 'Monitoreo e infraestructura autorizada.',
          path: '/network',
          moduleId: 'network',
          selectable: false,
          children: [
            {
              id: 'employee.network.summary',
              label: 'Resumen de red',
              description: 'Estado y alertas de red.',
              path: '/network',
              moduleId: 'network',
              selectable: true,
            },
            {
              id: 'employee.network.infrastructure',
              label: 'Infraestructura',
              description: 'Recursos físicos y lógicos de la red.',
              path: '/network/infrastructure',
              moduleId: 'network',
              selectable: false,
              children: [
                {
                  id: 'employee.network.routers',
                  label: 'Routers',
                  description: 'Routers y equipos de enrutamiento.',
                  path: '/network/routers',
                  moduleId: 'network',
                  selectable: true,
                },
                {
                  id: 'employee.network.hardware',
                  label: 'Hardware de red',
                  description: 'Equipos, antenas y hardware asociado.',
                  path: '/network/hardware',
                  moduleId: 'network',
                  selectable: true,
                },
                {
                  id: 'employee.network.sites',
                  label: 'Sitios y nodos',
                  description: 'Sedes, torres y nodos de red.',
                  path: '/network/sites',
                  moduleId: 'network',
                  selectable: true,
                },
              ],
            },
          ],
        },
        {
          id: 'employee.inventory',
          label: 'Inventario',
          description: 'Consulta de equipos y materiales asignados.',
          path: '/inventory',
          moduleId: 'inventory',
          selectable: true,
        },
      ],
    },
  ],
}

function flattenNavigationItems(
  items: readonly OrganizationWorkspaceNavigationItem[],
): OrganizationWorkspaceNavigationItem[] {
  return items.flatMap((item) => [
    item,
    ...(item.children ? flattenNavigationItems(item.children) : []),
  ])
}

export function getOrganizationWorkspaceNavigationItems(
  workspace: OrganizationWorkspace,
): OrganizationWorkspaceNavigationItem[] {
  return organizationWorkspaceNavigation[workspace].flatMap((group) =>
    flattenNavigationItems(group.items),
  )
}

export function getSelectableOrganizationWorkspaceNavigationItems(
  workspace: OrganizationWorkspace,
): OrganizationWorkspaceNavigationItem[] {
  return getOrganizationWorkspaceNavigationItems(workspace).filter(
    (item) => item.selectable,
  )
}
