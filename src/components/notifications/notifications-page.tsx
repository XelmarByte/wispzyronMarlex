import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { AccountMenu } from '@/components/account-menu'
import { BellIcon, WifiHighIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  getOrganizationById,
  type DemoAccountState,
  type DemoInvitation,
  type DemoNotification,
  type DemoOrganizationRecord,
  type InvitationStatus,
} from '@/data/demo-account'
import { useDemoAccount } from '@/providers/demo-account-context'
import { getOrganizationRoleAssignmentLabel } from '@/data/organization-role-assignment'
import { getInvitationStatus } from '@/lib/invitations'

type NotificationFilter = 'all' | 'unread'

type NotificationSort = 'newest' | 'oldest'

interface InvitationNotificationItem {
  notification: DemoNotification
  invitation: DemoInvitation
  organization: DemoOrganizationRecord
}

function getInvitationNotifications(
  state: DemoAccountState,
): InvitationNotificationItem[] {
  return state.notifications.flatMap((notification) => {
    if (notification.status === 'archived') {
      return []
    }

    const invitation = state.invitations.find(
      (item) => item.id === notification.invitationId,
    )

    if (!invitation) {
      return []
    }

    const organization = getOrganizationById(state, invitation.organizationId)

    if (!organization) {
      return []
    }

    return [{ notification, invitation, organization }]
  })
}

function formatNotificationDate(date: string) {
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

function InvitationStatusBadge({ status }: { status: InvitationStatus }) {
  if (status === 'pending') {
    return <Badge variant="info">Pendiente</Badge>
  }

  if (status === 'accepted') {
    return <Badge variant="success">Aceptada</Badge>
  }

  if (status === 'expired') {
    return <Badge variant="outline">Expirada</Badge>
  }

  return <Badge variant="error">Revocada</Badge>
}

export function NotificationsPage() {
  const navigate = useNavigate()

  const { state, archiveNotification, markNotificationAsRead } =
    useDemoAccount()

  const [filter, setFilter] = useState<NotificationFilter>('all')
  const [sortOrder, setSortOrder] = useState<NotificationSort>('newest')

  const notificationItems = getInvitationNotifications(state)

  const sortedNotificationItems = [...notificationItems].sort(
    (first, second) => {
      const firstDate = new Date(first.notification.createdAt).getTime()
      const secondDate = new Date(second.notification.createdAt).getTime()

      return sortOrder === 'newest'
        ? secondDate - firstDate
        : firstDate - secondDate
    },
  )

  const unreadNotificationItems = sortedNotificationItems.filter(
    (item) => item.notification.status === 'unread',
  )

  const handleReviewInvitation = (item: InvitationNotificationItem) => {
    markNotificationAsRead(item.notification.id)

    void navigate({
      to: '/invitations/verify',
      search: {
        token: item.invitation.token,
      },
    })
  }

  const renderNotificationList = (
    items: InvitationNotificationItem[],
    emptyMessage: string,
  ) => {
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-hover">
            <BellIcon className="size-6 text-muted" aria-hidden="true" />
          </div>

          <h2 className="text-base font-semibold text-foreground">
            Estás al día
          </h2>

          <p className="mt-1 max-w-sm text-sm text-muted">{emptyMessage}</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col">
        {items.map((item) => {
          const invitationStatus = getInvitationStatus(item.invitation)

          const canReview = invitationStatus === 'pending'

          return (
            <article
              key={item.notification.id}
              className="group flex flex-col gap-4 border-b border-border p-4 last:border-b-0 hover:bg-hover sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="flex min-w-0 gap-3">
                <div className="mt-1.5 flex size-2 shrink-0 items-center justify-center">
                  {item.notification.status === 'unread' ? (
                    <span
                      className="size-2 rounded-full bg-info"
                      aria-label="No leída"
                    />
                  ) : null}
                </div>

                <span className="flex size-8 shrink-0 items-center justify-center rounded-control bg-primary text-xs font-semibold text-primary-foreground">
                  {item.organization.name.slice(0, 2).toUpperCase()}
                </span>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-medium text-foreground">
                      Invitación a {item.organization.name}
                    </h2>

                    <InvitationStatusBadge status={invitationStatus} />

                    <Badge variant="secondary">
                      {getOrganizationRoleAssignmentLabel(
                        item.invitation,
                        state.customRoles ?? [],
                      )}
                    </Badge>
                  </div>

                  <p className="mt-1 text-sm text-muted">
                    <span className="font-medium text-foreground">
                      {item.invitation.inviterName}
                    </span>{' '}
                    te invitó a unirte a{' '}
                    <span className="font-medium text-foreground">
                      {item.organization.name}
                    </span>
                    .
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    Enviada el{' '}
                    {formatNotificationDate(item.notification.createdAt)}
                    {invitationStatus === 'pending'
                      ? ` · Vence el ${formatNotificationDate(
                          item.invitation.expiresAt,
                        )}`
                      : ''}
                  </p>
                </div>
              </div>

              {canReview ? (
                <div className="flex shrink-0 items-center gap-2 self-end sm:self-start">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => archiveNotification(item.notification.id)}
                  >
                    Archivar
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleReviewInvitation(item)}
                  >
                    Revisar
                  </Button>
                </div>
              ) : null}
            </article>
          )
        })}
      </div>
    )
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

        <AccountMenu
          initials={state.account.initials}
          name={state.account.name}
          email={state.account.email}
          workspaceCount={state.memberships.length}
          onSettingsClick={() => void navigate({ to: '/settings' })}
        />
      </header>

      <section className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BellIcon className="size-5 text-foreground" aria-hidden="true" />

            <h1 className="text-xl font-semibold text-foreground">
              Bandeja de notificaciones
            </h1>
          </div>

          <Link
            to="/organizations"
            className="rounded-control text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Volver
          </Link>
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="w-full">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList aria-label="Filtrar notificaciones">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="unread">No leídas</TabsTrigger>
            </TabsList>

            <label className="flex items-center gap-2 text-sm text-muted">
              Ordenar por:
              <select
                value={sortOrder}
                onChange={(event) => {
                  const nextSortOrder = event.target.value

                  if (
                    nextSortOrder === 'newest' ||
                    nextSortOrder === 'oldest'
                  ) {
                    setSortOrder(nextSortOrder)
                  }
                }}
                className="h-8 cursor-pointer rounded-control border border-border bg-surface px-2 text-sm text-foreground transition-colors hover:bg-hover"
                aria-label="Ordenar notificaciones por tiempo"
              >
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguas</option>
              </select>
            </label>
          </div>

          <div className="overflow-hidden rounded-popover border border-border bg-surface shadow-sm">
            <TabsContent value="all">
              {renderNotificationList(
                sortedNotificationItems,
                'No tienes invitaciones ni mensajes pendientes.',
              )}
            </TabsContent>

            <TabsContent value="unread">
              {renderNotificationList(
                unreadNotificationItems,
                'No tienes notificaciones sin leer.',
              )}
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </main>
  )
}
