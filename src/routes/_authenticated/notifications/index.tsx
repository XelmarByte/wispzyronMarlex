import { NotificationsPage } from '@/components/notifications/notifications-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/notifications/')({
  component: NotificationsPage,
})
