import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { useState } from 'react'
import { AccountMenu } from '@/components/account-menu'
import { DashboardTopbar } from '@/components/layout/dashboard-topbar'
import { EmployeeSidebar } from '@/components/layout/employee-sidebar'
import { NotificationsPopover } from '@/components/notifications-popover'
import { OrganizationThemeScope } from '@/components/organization-theme-scope'
import { useDemoAccount } from '@/providers/demo-account-context'
import {
  getMembershipNavigationIds,
  hasMembershipNavigationAccess,
} from '@/data/membership-access'
import {
  getWorkspaceAccess,
  getWorkspaceNavigationIdFromPath,
  getWorkspaceNavigationFallbackPath,
} from '@/data/workspace-route-access'
import { getOrganizationRoleAssignmentLabel } from '@/data/organization-role-assignment'

export const Route = createFileRoute('/_authenticated/$orgSlug/employee')({
  beforeLoad: ({ context, location, params }) => {
    const access = getWorkspaceAccess(context.accountState, params.orgSlug)

    if (access?.membership.role !== 'employee') {
      throw redirect({
        to: '/organizations',
      })
    }

    const activeNavigationId = getWorkspaceNavigationIdFromPath(
      'employee',
      params.orgSlug,
      location.pathname,
    )

    if (
      activeNavigationId !== null &&
      hasMembershipNavigationAccess(access.membership, activeNavigationId)
    ) {
      return
    }

    const fallbackPath = getWorkspaceNavigationFallbackPath(
      'employee',
      params.orgSlug,
      location.pathname,
      getMembershipNavigationIds(access.membership),
    )

    if (fallbackPath === null) {
      throw redirect({
        to: '/organizations',
      })
    }

    if (!fallbackPath) {
      throw redirect({
        to: '/$orgSlug/employee',
        params: { orgSlug: params.orgSlug },
      })
    }

    throw redirect({
      to: '/$orgSlug/employee/$',
      params: {
        orgSlug: params.orgSlug,
        _splat: fallbackPath.slice(1),
      },
    })
  },
  component: EmployeeLayout,
})

function getOrgSlug(routeParams: unknown): string {
  if (
    typeof routeParams === 'object' &&
    routeParams !== null &&
    'orgSlug' in routeParams &&
    typeof routeParams.orgSlug === 'string'
  ) {
    return routeParams.orgSlug
  }

  return ''
}

function EmployeeLayout() {
  const routeParams: unknown = Route.useParams()
  const orgSlug = getOrgSlug(routeParams)
  const navigate = useNavigate()

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  const { state } = useDemoAccount()

  const organization = state.organizations.find((item) => item.slug === orgSlug)

  const membership = organization
    ? state.memberships.find(
        (item) =>
          item.accountId === state.account.id &&
          item.organizationId === organization.id,
      )
    : undefined

  if (organization === undefined || membership?.role !== 'employee') {
    return null
  }

  const role = getOrganizationRoleAssignmentLabel(
    membership,
    state.customRoles ?? [],
  )

  const workspaceCount = state.memberships.filter(
    (item) => item.accountId === state.account.id,
  ).length

  return (
    <OrganizationThemeScope
      branding={organization.branding}
      className="flex h-dvh overflow-hidden bg-background"
    >
      <EmployeeSidebar
        orgSlug={orgSlug}
        organizationName={organization.name}
        role={role}
        navigationIds={getMembershipNavigationIds(membership)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar
          userName={state.account.name}
          orgSlug={orgSlug}
          isCommandPaletteOpen={isCommandPaletteOpen}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onCommandPaletteOpenChange={setIsCommandPaletteOpen}
          actions={
            <>
              <NotificationsPopover orgSlug={orgSlug} />

              <AccountMenu
                initials={state.account.initials}
                name={state.account.name}
                email={state.account.email}
                workspaceCount={workspaceCount}
                onSettingsClick={() => void navigate({ to: '/settings' })}
              />
            </>
          }
        />

        <main className="min-h-0 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </OrganizationThemeScope>
  )
}
