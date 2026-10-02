import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { BellIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type NotificationTone = 'danger' | 'success' | 'warning' | 'info'

type WorkspaceArea = 'employee' | 'manager'

interface Notification {
  description: string
  id: string
  time: string
  title: string
  tone: NotificationTone
  unread: boolean
}

interface NotificationsPopoverProps {
  orgSlug: string
  workspace?: WorkspaceArea
}

const initialNotifications: Notification[] = [
  {
    id: 'client-offline',
    title: 'Cliente sin conexión',
    description: 'El cliente C-1284 reportó pérdida total del servicio.',
    time: 'Hace 5 min',
    tone: 'danger',
    unread: true,
  },
  {
    id: 'payment-registered',
    title: 'Pago registrado',
    description: 'Se registró un pago de S/ 89.00.',
    time: 'Hace 12 min',
    tone: 'success',
    unread: true,
  },
  {
    id: 'router-load',
    title: 'Router con alta carga',
    description: 'MikroTik RB5009 superó el 85% de CPU.',
    time: 'Hace 24 min',
    tone: 'warning',
    unread: true,
  },
  {
    id: 'new-client',
    title: 'Nuevo cliente registrado',
    description: 'Se creó una nueva cuenta en el sector norte.',
    time: 'Hace 43 min',
    tone: 'info',
    unread: false,
  },
  {
    id: 'ticket-assigned',
    title: 'Ticket asignado',
    description: 'El ticket #TK-0427 fue asignado a tu equipo.',
    time: 'Hace 1 h',
    tone: 'info',
    unread: false,
  },
]

const toneClasses: Record<NotificationTone, string> = {
  danger: 'bg-danger',
  success: 'bg-success',
  warning: 'bg-warning',
  info: 'bg-info',
}

export function NotificationsPopover({
  orgSlug,
  workspace = 'employee',
}: NotificationsPopoverProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications)

  const unreadNotifications = notifications.filter(
    (notification) => notification.unread,
  )

  const unreadCount = unreadNotifications.length
  const unreadCountLabel = unreadCount > 99 ? '99+' : unreadCount

  const markAllAsRead = () => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        unread: false,
      })),
    )
  }

  return (
    <Popover>
      <PopoverTrigger
        className="relative inline-flex size-8 items-center justify-center rounded-control border border-transparent text-muted transition-[background-color,color,border-color,opacity] duration-150 hover:bg-hover hover:text-foreground data-[state=open]:bg-hover"
        aria-label={
          unreadCount > 0
            ? `Ver notificaciones: ${unreadCount} pendientes`
            : 'Ver notificaciones'
        }
      >
        <BellIcon className="size-4" aria-hidden="true" />

        {unreadCount > 0 ? (
          <span
            className="absolute right-1 top-1 flex min-w-3.5 items-center justify-center rounded-full bg-danger px-1 text-[9px] leading-3 text-white"
            aria-hidden="true"
          >
            {unreadCountLabel}
          </span>
        ) : null}
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 overflow-hidden p-0">
        <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2.5">
          <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
            Notificaciones
            {unreadCount > 0 ? (
              <span className="rounded-full bg-hover px-1.5 py-0.5 text-xs text-muted">
                {unreadCount}
              </span>
            ) : null}
          </h2>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={unreadCount === 0}
            onClick={markAllAsRead}
          >
            Marcar como leídas
          </Button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className="flex gap-3 border-b border-border px-3 py-3 last:border-b-0"
            >
              <span
                className={cn(
                  'mt-1.5 size-1.5 shrink-0 rounded-full',
                  toneClasses[notification.tone],
                )}
                aria-hidden="true"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-medium text-foreground">
                    {notification.title}

                    {notification.unread ? (
                      <span
                        className="ml-1.5 inline-block size-1.5 rounded-full bg-info align-middle"
                        aria-label="No leída"
                      />
                    ) : null}
                  </h3>

                  <time className="shrink-0 text-xs text-muted">
                    {notification.time}
                  </time>
                </div>

                <p className="mt-0.5 text-xs leading-5 text-muted">
                  {notification.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {workspace === 'manager' ? (
          <Link
            to="/$orgSlug/manager/$"
            params={{
              orgSlug,
              _splat: 'notifications',
            }}
            className="flex h-10 items-center justify-center border-t border-border text-sm font-medium text-foreground hover:bg-hover"
          >
            Ver todas las notificaciones
          </Link>
        ) : (
          <Link
            to="/$orgSlug/employee/$"
            params={{
              orgSlug,
              _splat: 'notifications',
            }}
            className="flex h-10 items-center justify-center border-t border-border text-sm font-medium text-foreground hover:bg-hover"
          >
            Ver todas las notificaciones
          </Link>
        )}
      </PopoverContent>
    </Popover>
  )
}
