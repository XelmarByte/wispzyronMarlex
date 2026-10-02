import { Link, useLocation } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { GearIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

interface OrganizationSettingsLayoutProps {
  children: ReactNode
  organizationName: string
  orgSlug: string
}

interface SettingsNavigationItem {
  description: string
  id: string
  label: string
  path: string
}

interface SettingsNavigationLinkProps {
  children: ReactNode
  className: string
  isActive: boolean
  item: SettingsNavigationItem
  orgSlug: string
}

const settingsNavigation: SettingsNavigationItem[] = [
  {
    id: 'general',
    label: 'General',
    description: 'Datos de empresa y contacto',
    path: '',
  },
  {
    id: 'branding',
    label: 'Marca y apariencia',
    description: 'Logo, tema y estilo visual',
    path: 'branding',
  },
  {
    id: 'domain',
    label: 'Dominio de correo',
    description: 'Políticas de acceso corporativo',
    path: 'domain',
  },
  {
    id: 'billing',
    label: 'Plan y facturación',
    description: 'Plan, ciclo y métodos de pago',
    path: 'billing',
  },
]

function SettingsNavigationLink({
  children,
  className,
  isActive,
  item,
  orgSlug,
}: SettingsNavigationLinkProps) {
  if (item.path === '') {
    return (
      <Link
        to="/$orgSlug/settings"
        params={{ orgSlug }}
        className={className}
        aria-current={isActive ? 'page' : undefined}
      >
        {children}
      </Link>
    )
  }

  return (
    <Link
      to="/$orgSlug/settings/$"
      params={{
        orgSlug,
        _splat: item.path,
      }}
      className={className}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  )
}

export function OrganizationSettingsLayout({
  children,
  organizationName,
  orgSlug,
}: OrganizationSettingsLayoutProps) {
  const { pathname } = useLocation()

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-8">
      <header className="mb-8">
        <p className="text-sm font-medium text-muted-foreground">
          Configuración de empresa
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          {organizationName}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Administra los datos y preferencias que pertenecen exclusivamente a
          esta organización.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <nav aria-label="Secciones de configuración de empresa">
            <ul className="space-y-1">
              {settingsNavigation.map((item) => {
                const href = item.path
                  ? `/${orgSlug}/settings/${item.path}`
                  : `/${orgSlug}/settings`

                const isActive = pathname === href

                return (
                  <li key={item.id}>
                    <SettingsNavigationLink
                      item={item}
                      orgSlug={orgSlug}
                      isActive={isActive}
                      className={cn(
                        'block rounded-control px-3 py-2.5 transition-colors',
                        isActive
                          ? 'bg-hover text-foreground'
                          : 'text-foreground hover:bg-hover',
                      )}
                    >
                      <span className="block text-sm font-medium">
                        {item.label}
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        {item.description}
                      </span>
                    </SettingsNavigationLink>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="mt-6 hidden rounded-control border border-border bg-surface p-3 lg:block">
            <GearIcon
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />

            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Los cambios sensibles de empresa requerirán confirmación por
              correo cuando conectemos el backend.
            </p>
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}
