import type { ComponentProps, ComponentType } from 'react'
import {
  CreditCardIcon,
  CubeIcon,
  HeadsetIcon,
  NetworkIcon,
  UsersIcon,
} from '@/components/icons'

type CommandIcon = ComponentType<ComponentProps<'svg'>>

export type CommandGroup = 'Recientes' | 'Accesos rápidos'

export interface CommandItem {
  description: string
  group: CommandGroup
  icon: CommandIcon
  id: string
  keywords: string[]
  label: string
  path: string
}

export const commandItems: CommandItem[] = [
  {
    id: 'customers',
    label: 'Clientes',
    description: 'Clientes y servicio',
    path: '/customers',
    group: 'Recientes',
    icon: UsersIcon,
    keywords: ['clientes', 'usuarios', 'abonados'],
  },
  {
    id: 'billing',
    label: 'Facturación',
    description: 'Administración',
    path: '/billing',
    group: 'Recientes',
    icon: CreditCardIcon,
    keywords: ['facturas', 'pagos', 'cobros'],
  },
  {
    id: 'routers',
    label: 'Routers',
    description: 'Red · Infraestructura',
    path: '/network/routers',
    group: 'Recientes',
    icon: NetworkIcon,
    keywords: ['router', 'red', 'mikrotik'],
  },
  {
    id: 'support',
    label: 'Soporte',
    description: 'Clientes y servicio',
    path: '/support',
    group: 'Recientes',
    icon: HeadsetIcon,
    keywords: ['tickets', 'incidencias', 'ayuda'],
  },
  {
    id: 'inventory',
    label: 'Inventario',
    description: 'Operaciones',
    path: '/inventory',
    group: 'Recientes',
    icon: CubeIcon,
    keywords: ['stock', 'equipos', 'almacén'],
  },
  {
    id: 'search-customers',
    label: 'cliente:',
    description: 'Buscar clientes',
    path: '/customers',
    group: 'Accesos rápidos',
    icon: UsersIcon,
    keywords: ['cliente', 'buscar cliente'],
  },
  {
    id: 'search-routers',
    label: 'router:',
    description: 'Buscar infraestructura',
    path: '/network/routers',
    group: 'Accesos rápidos',
    icon: NetworkIcon,
    keywords: ['router', 'buscar router'],
  },
  {
    id: 'search-tickets',
    label: 'ticket:',
    description: 'Buscar soporte',
    path: '/support',
    group: 'Accesos rápidos',
    icon: HeadsetIcon,
    keywords: ['ticket', 'buscar ticket'],
  },
]
