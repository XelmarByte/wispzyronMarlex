import { BellIcon } from '@/components/icons'
import { Link } from '@tanstack/react-router'

interface NotificationButtonProps {
  unreadCount: number
}

export function NotificationButton({ unreadCount }: NotificationButtonProps) {
  const hasUnreadNotifications = unreadCount > 0

  return (
    <Link
      to="/notifications"
      className="relative inline-flex size-8 items-center justify-center rounded-control border border-transparent text-muted transition-[background-color,color,border-color] hover:bg-hover hover:text-foreground"
      aria-label={
        hasUnreadNotifications
          ? `Ir a notificaciones: ${unreadCount} sin leer`
          : 'Ir a notificaciones'
      }
    >
      <BellIcon className="size-4" aria-hidden="true" />

      {hasUnreadNotifications ? (
        <span
          className="absolute right-1 top-1 size-1.5 rounded-full bg-danger"
          aria-hidden="true"
        />
      ) : null}
    </Link>
  )
}
