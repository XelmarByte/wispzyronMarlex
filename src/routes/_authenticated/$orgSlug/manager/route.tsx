import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { useState } from 'react'
import { AccountMenu } from '@/components/account-menu'
import { DashboardTopbar } from '@/components/layout/dashboard-topbar'
import { ManagerSidebar } from '@/components/layout/manager-sidebar'
import { NotificationsPopover } from '@/components/notifications-popover'
import { useDemoAccount } from '@/providers/demo-account-context'
import { OrganizationThemeScope } from '@/components/organization-theme-scope'
import { isManagementRole } from '@/data/organization-roles'
import { getOrganizationRoleAssignmentLabel } from '@/data/organization-role-assignment'
import {
  getMembershipNavigationIds,
  hasMembershipNavigationAccess,
  getMembershipPermissionKeys,
} from '@/data/membership-access'
import {
  getWorkspaceAccess,
  getWorkspaceNavigationIdFromPath,
  getWorkspaceNavigationFallbackPath,
} from '@/data/workspace-route-access'

export const Route = createFileRoute('/_authenticated/$orgSlug/manager')({
  beforeLoad: ({ context, location, params }) => {
    const access = getWorkspaceAccess(context.accountState, params.orgSlug)

    if (access === null || !isManagementRole(access.membership.role)) {
      throw redirect({
        to: '/organizations',
      })
    }

    const activeNavigationId = getWorkspaceNavigationIdFromPath(
      'manager',
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
      'manager',
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
        to: '/$orgSlug/manager',
        params: { orgSlug: params.orgSlug },
      })
    }

    throw redirect({
      to: '/$orgSlug/manager/$',
      params: {
        orgSlug: params.orgSlug,
        _splat: fallbackPath.slice(1),
      },
    })
  },
  component: ManagerLayout,
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

function ManagerLayout() {
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

  if (
    organization === undefined ||
    membership === undefined ||
    !isManagementRole(membership.role)
  ) {
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
      <ManagerSidebar
        orgSlug={orgSlug}
        organizationName={organization.name}
        role={role}
        navigationIds={getMembershipNavigationIds(membership)}
        permissionKeys={getMembershipPermissionKeys(membership)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar
          userName={state.account.name}
          orgSlug={orgSlug}
          workspace="manager"
          isCommandPaletteOpen={isCommandPaletteOpen}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onCommandPaletteOpenChange={setIsCommandPaletteOpen}
          actions={
            <>
              <NotificationsPopover orgSlug={orgSlug} workspace="manager" />

              <AccountMenu
                initials={state.account.initials}
                name={state.account.name}
                email={state.account.email}
                workspaceCount={workspaceCount}
                onSettingsClick={() => void navigate({ to: '/settings' })}
                organizationName={organization.name}
                onOrganizationSettingsClick={() =>
                  void navigate({
                    to: '/$orgSlug/settings',
                    params: { orgSlug },
                  })
                }
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
