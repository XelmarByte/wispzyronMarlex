import { AccountMenu } from '@/components/account-menu'
import { NotificationButton } from '@/components/notifications/notification-button'
import {
  ArrowUpRightIcon,
  BuildingsIcon,
  PlusIcon,
  WifiHighIcon,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  getOrganizationById,
  type DemoAccountState,
  type DemoMembership,
  type DemoOrganizationRecord,
} from '@/data/demo-account'
import { useDemoAccount } from '@/providers/demo-account-context'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { getToken } from '@clerk/react'
import { useEffect } from 'react'
import { getOrganizationRoleAssignmentLabel } from '@/data/organization-role-assignment'
import { getMembershipWorkspaceEntryPath } from '@/data/membership-access'

export const Route = createFileRoute('/_authenticated/organizations/')({
  component: OrganizationsPage,
})

interface Workspace {
  membership: DemoMembership
  organization: DemoOrganizationRecord
}

function getWorkspaces(state: DemoAccountState): Workspace[] {
  return state.memberships.flatMap((membership) => {
    const organization = getOrganizationById(state, membership.organizationId)

    if (!organization) {
      return []
    }

    return [{ membership, organization }]
  })
}

function formatMembershipDate(date: string) {
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

function OrganizationsPage() {
  const navigate = useNavigate()

  const { state: accountState, unreadNotificationCount } = useDemoAccount()

  const workspaces = getWorkspaces(accountState)

  const customRoles = accountState.customRoles ?? []

  useEffect(() => {
    const getContext = async () => {
      const token = await getToken()
      const res = await fetch('http://localhost:3000/api/v1/account/context', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = (await res.json()) as string
      console.log(data)
    }

    void getContext()
  }, [])

  const handleOpenWorkspace = (workspace: Workspace) => {
    const { membership, organization } = workspace
    const entryPath = getMembershipWorkspaceEntryPath(membership)

    if (membership.role === 'employee') {
      if (!entryPath) {
        void navigate({
          to: '/$orgSlug/employee',
          params: { orgSlug: organization.slug },
        })

        return
      }

      void navigate({
        to: '/$orgSlug/employee/$',
        params: {
          orgSlug: organization.slug,
          _splat: entryPath.slice(1),
        },
      })

      return
    }

    if (!entryPath) {
      void navigate({
        to: '/$orgSlug/manager',
        params: { orgSlug: organization.slug },
      })

      return
    }

    void navigate({
      to: '/$orgSlug/manager/$',
      params: {
        orgSlug: organization.slug,
        _splat: entryPath.slice(1),
      },
    })
  }

  return (
    <main className="flex min-h-svh flex-col bg-background">
      <header className="flex h-13 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
        <Link
          to="/organizations"
          className="flex items-center gap-2 rounded-control"
        >
          <span className="flex size-6 items-center justify-center rounded-control bg-primary text-primary-foreground">
            <WifiHighIcon className="size-3.5" aria-hidden="true" />
          </span>

          <span className="text-base font-semibold tracking-tight">
            WispZyron
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <NotificationButton unreadCount={unreadNotificationCount} />

          <AccountMenu
            initials={accountState.account.initials}
            name={accountState.account.name}
            email={accountState.account.email}
            workspaceCount={workspaces.length}
            onSettingsClick={() => void navigate({ to: '/settings' })}
          />
        </div>
      </header>

      <section className="flex flex-1 justify-center px-6 py-16 sm:py-20">
        <div className="w-full max-w-2xl">
          <div className="text-center">
            <span className="mx-auto flex size-9 items-center justify-center">
              <BuildingsIcon className="size-6" aria-hidden="true" />
            </span>

            <h1 className="mt-4 text-2xl font-semibold tracking-tight">
              Espacios de trabajo
            </h1>

            <p className="mt-2 text-sm text-muted">
              Selecciona la organización con la que deseas trabajar.
            </p>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((workspace) => {
              const isEmployee = workspace.membership.role === 'employee'

              const roleLabel = getOrganizationRoleAssignmentLabel(
                workspace.membership,
                customRoles,
              )

              return (
                <button
                  key={workspace.membership.id}
                  type="button"
                  onClick={() => handleOpenWorkspace(workspace)}
                  className="group min-h-44 rounded-lg border border-border bg-surface p-4 text-left transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
                  aria-label={`Abrir ${workspace.organization.name} como ${roleLabel}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
                      {workspace.organization.name.slice(0, 2).toUpperCase()}
                    </span>

                    <span className="flex size-6 items-center justify-center rounded-md border border-border text-muted transition-colors group-hover:text-foreground">
                      <ArrowUpRightIcon className="size-3" aria-hidden="true" />
                    </span>
                  </div>

                  <h2 className="mt-4 text-sm font-semibold text-foreground">
                    {workspace.organization.name}
                  </h2>

                  <p className="mt-0.5 text-xs text-muted">
                    {workspace.organization.slug}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5">
                    <Badge variant="success" dot>
                      Activo
                    </Badge>

                    <Badge variant={isEmployee ? 'info' : 'warning'}>
                      {roleLabel}
                    </Badge>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                    <span className="text-muted">Miembro desde</span>

                    <span className="font-medium text-foreground">
                      {formatMembershipDate(workspace.membership.joinedAt)}
                    </span>
                  </div>
                </button>
              )
            })}

            <button
              type="button"
              onClick={() => void navigate({ to: '/organizations/new' })}
              className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed border-border p-4 text-center transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span className="flex size-8 items-center justify-center rounded-md border border-border text-muted">
                <PlusIcon className="size-3.5" aria-hidden="true" />
              </span>

              <span className="mt-4 text-sm font-semibold text-foreground">
                Crear organización
              </span>

              <span className="mt-1 max-w-40 text-xs leading-4 text-muted">
                Configura un nuevo espacio de trabajo para tu empresa.
              </span>
            </button>
          </div>

          <div className="mt-7 flex items-center justify-center gap-2 border-t border-border pt-5">
            <span className="text-sm text-muted">¿Tienes una invitación?</span>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-0.5 text-sm font-semibold"
              onClick={() => void navigate({ to: '/organizations/join' })}
            >
              Unirse a una organización
            </Button>
          </div>
        </div>
      </section>

      <footer className="flex h-9 items-center border-t border-border px-4 text-xs text-muted">
        © 2026 WispZyron
      </footer>
    </main>
  )
}
