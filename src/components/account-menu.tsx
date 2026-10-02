import { useClerk } from '@clerk/react'
import { useState } from 'react'
import {
  BuildingIcon,
  CaretDownIcon,
  CaretRightIcon,
  GearIcon,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ThemeSelector } from '@/components/theme-selector'
import { useUser } from '@clerk/react'

interface AccountMenuProps {
  initials: string
  name: string
  email: string
  accountType?: string
  workspaceCount?: number
  organizationName?: string
  onSettingsClick?: () => void
  onOrganizationSettingsClick?: () => void
}

export function AccountMenu({
  initials,
  name,
  email,
  accountType = 'Cuenta personal',
  workspaceCount = 0,
  organizationName,
  onSettingsClick,
  onOrganizationSettingsClick,
}: AccountMenuProps) {
  const { signOut } = useClerk()
  const { isLoaded, user } = useUser()

  const clerkEmail = user?.primaryEmailAddress?.emailAddress

  const displayName =
    isLoaded && user
      ? (user.fullName ?? user.firstName ?? clerkEmail?.split('@')[0] ?? name)
      : name

  const displayEmail = isLoaded ? (clerkEmail ?? email) : email

  const displayInitials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')

  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)

    try {
      await signOut({
        redirectUrl: '/login',
      })
    } catch {
      setIsSigningOut(false)
    }
  }

  const settingsContent = (
    <>
      <span className="flex size-7 shrink-0 items-center justify-center rounded-sm border border-border bg-hover">
        <GearIcon className="size-3.5" aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-tight text-foreground">
          Configuración de cuenta
        </span>

        <span className="block text-xs leading-tight text-muted">
          Perfil y preferencias
        </span>
      </span>

      <CaretRightIcon className="size-3 text-muted" aria-hidden="true" />
    </>
  )

  const organizationSettingsContent = (
    <>
      <span className="flex size-7 shrink-0 items-center justify-center rounded-sm border border-border bg-hover">
        <BuildingIcon className="size-3.5" aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold leading-tight text-foreground">
          Configuración de empresa
        </span>

        <span className="block truncate text-xs leading-tight text-muted">
          {organizationName}
        </span>
      </span>

      <CaretRightIcon className="size-3 text-muted" aria-hidden="true" />
    </>
  )

  return (
    <Popover>
      <PopoverTrigger
        aria-label={`Abrir cuenta de ${displayName}`}
        className="group flex items-center gap-2 rounded-md border border-transparent px-2 py-1 text-left outline-none transition-colors hover:bg-hover data-[state=open]:border-border data-[state=open]:bg-hover"
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-border bg-hover text-xs font-semibold text-foreground">
          {displayInitials || initials}
        </span>

        <span className="hidden min-w-0 sm:grid">
          <span className="truncate text-xs font-semibold leading-tight text-foreground">
            {displayName}
          </span>

          <span className="truncate text-xs leading-tight text-muted">
            {displayEmail}
          </span>
        </span>

        <CaretDownIcon
          className="ml-1 size-3 shrink-0 text-muted transition-transform group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        aria-label={`Abrir cuenta de ${displayName}`}
        className="w-popover rounded-md p-4"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-hover text-sm font-semibold text-foreground">
            {displayInitials || initials}
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {displayName}
            </p>

            <p className="truncate text-xs text-muted">{displayEmail}</p>
          </div>
        </div>

        <dl className="mt-4 overflow-hidden rounded-md border border-border bg-hover/60 px-3">
          <div className="flex items-center justify-between gap-4 border-b border-border py-2">
            <dt className="text-xs text-muted">Tipo de cuenta</dt>

            <dd className="text-xs font-semibold text-foreground">
              {accountType}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 border-b border-border py-2">
            <dt className="text-xs text-muted">Espacios de trabajo</dt>

            <dd className="text-xs font-semibold text-foreground">
              {workspaceCount}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 py-2">
            <dt className="text-xs text-muted">Estado</dt>

            <dd>
              <Badge variant="success" dot>
                Activo
              </Badge>
            </dd>
          </div>
        </dl>

        {onSettingsClick ? (
          <>
            <div className="my-3 h-px bg-border" />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 px-4 py-4 text-left"
              onClick={onSettingsClick}
            >
              {settingsContent}
            </Button>
          </>
        ) : null}

        {organizationName && onOrganizationSettingsClick ? (
          <>
            <div className="my-3 h-px bg-border" />

            <section>
              <p className="px-2 text-xs font-medium text-muted">
                Espacio actual
              </p>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-1 w-full justify-start gap-2 px-4 py-4 text-left"
                onClick={onOrganizationSettingsClick}
              >
                {organizationSettingsContent}
              </Button>
            </section>
          </>
        ) : null}

        <div className="my-3 h-px bg-border" />

        <section>
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-semibold text-foreground">Tema</span>

            <span className="text-xs text-muted">Apariencia</span>
          </div>

          <ThemeSelector className="mt-3" />
        </section>

        <div className="my-3 h-px bg-border" />

        <Button
          type="button"
          variant="danger"
          size="sm"
          loading={isSigningOut}
          className="w-full justify-center"
          onClick={() => void handleSignOut()}
        >
          Cerrar sesión
        </Button>
      </PopoverContent>
    </Popover>
  )
}
