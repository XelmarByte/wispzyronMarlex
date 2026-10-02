import { useAuth } from '@clerk/react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { getInvitationByToken, getOrganizationById } from '@/data/demo-account'
import { useDemoAccount } from '@/providers/demo-account-context'
import { getOrganizationRoleAssignmentLabel } from '@/data/organization-role-assignment'
import { isInvitationAvailable } from '@/lib/invitations'

function formatExpirationDate(date: string) {
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function createInvitationRedirect(token: string) {
  return `/invitations/verify?token=${encodeURIComponent(token)}`
}

export function VerifyInvitationPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/invitations/verify' })

  const { isLoaded, isSignedIn } = useAuth()
  const { acceptInvitation, declineInvitation, state } = useDemoAccount()

  const token = typeof search.token === 'string' ? search.token : ''

  const invitation = getInvitationByToken(state, token)

  const organization = invitation
    ? getOrganizationById(state, invitation.organizationId)
    : undefined

  const roleLabel = invitation
    ? getOrganizationRoleAssignmentLabel(invitation, state.customRoles ?? [])
    : ''

  const [isAccepting, setIsAccepting] = useState(false)

  const isCorrectRecipient =
    invitation !== undefined &&
    normalizeEmail(state.account.email) ===
      normalizeEmail(invitation.recipientEmail)

  const handleEnterOrganization = () => {
    if (!invitation || !organization) {
      return
    }

    if (invitation.role === 'employee') {
      void navigate({
        to: '/$orgSlug/employee',
        params: {
          orgSlug: organization.slug,
        },
      })

      return
    }

    void navigate({
      to: '/$orgSlug/manager',
      params: {
        orgSlug: organization.slug,
      },
    })
  }

  const handleAccept = () => {
    if (!invitation) {
      return
    }

    setIsAccepting(true)

    window.setTimeout(() => {
      acceptInvitation(invitation.id)
      handleEnterOrganization()
    }, 900)
  }

  const handleDecline = () => {
    if (!invitation) {
      return
    }

    declineInvitation(invitation.id)

    void navigate({
      to: '/organizations',
    })
  }

  if (!invitation || !organization || !isInvitationAvailable(invitation)) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-4">
        <section className="w-full max-w-sm rounded-popover border border-border bg-surface p-6 shadow-overlay">
          <h1 className="text-lg font-semibold text-foreground">
            Invitación no disponible
          </h1>

          <p className="mt-2 text-sm leading-5 text-muted">
            El enlace es inválido, venció, fue utilizado o ya no está
            disponible.
          </p>

          <Link
            to="/organizations"
            className="mt-6 flex h-8 w-full items-center justify-center rounded-control border border-primary bg-primary px-3 text-sm text-primary-foreground transition-opacity hover:opacity-90"
          >
            Ir a espacios de trabajo
          </Link>
        </section>
      </main>
    )
  }

  if (!isLoaded) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-4">
        <p className="text-sm text-muted">Comprobando sesión…</p>
      </main>
    )
  }

  if (!isSignedIn) {
    const redirectUrl = createInvitationRedirect(token)

    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-4">
        <section className="w-full max-w-sm rounded-popover border border-border bg-surface p-6 shadow-overlay">
          <h1 className="text-xl font-semibold text-foreground">
            Inicia sesión para revisar la invitación
          </h1>

          <p className="mt-3 text-sm leading-5 text-muted">
            Accede con la cuenta a la que fue enviada esta invitación para
            continuar.
          </p>

          <Button
            className="mt-6 w-full"
            onClick={() =>
              void navigate({
                to: '/login',
                search: {
                  redirect_url: redirectUrl,
                },
              })
            }
          >
            Iniciar sesión
          </Button>
        </section>
      </main>
    )
  }

  if (!isCorrectRecipient) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-4">
        <section className="w-full max-w-sm rounded-popover border border-border bg-surface p-6 shadow-overlay">
          <h1 className="text-lg font-semibold text-foreground">
            Invitación no disponible
          </h1>

          <p className="mt-2 text-sm leading-5 text-muted">
            El enlace es inválido, venció, fue utilizado o no está disponible
            para esta cuenta.
          </p>

          <Link
            to="/organizations"
            className="mt-6 flex h-8 w-full items-center justify-center rounded-control border border-border bg-surface px-3 text-sm text-foreground transition-colors hover:bg-hover"
          >
            Volver a espacios de trabajo
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-8">
      <section className="w-full max-w-sm rounded-popover border border-border bg-surface p-6 shadow-overlay">
        <div className="flex size-11 items-center justify-center rounded-control bg-primary text-sm font-semibold text-primary-foreground">
          {organization.name.slice(0, 2).toUpperCase()}
        </div>

        <p className="mt-5 text-sm text-muted">
          Invitación de {invitation.inviterName}
        </p>

        <h1 className="mt-1 text-xl font-semibold text-foreground">
          Únete a {organization.name}
        </h1>

        <p className="mt-3 text-sm leading-5 text-muted">
          Recibiste una invitación para acceder como{' '}
          <strong className="font-medium text-foreground">{roleLabel}</strong>.
        </p>

        <dl className="mt-5 divide-y divide-border rounded-control border border-border text-sm">
          <div className="flex items-center justify-between gap-4 px-3 py-2.5">
            <dt className="text-muted">Organización</dt>

            <dd className="font-medium text-foreground">{organization.name}</dd>
          </div>

          <div className="flex items-center justify-between gap-4 px-3 py-2.5">
            <dt className="text-muted">Rol inicial</dt>

            <dd className="font-medium text-foreground">{roleLabel}</dd>
          </div>

          <div className="flex items-center justify-between gap-4 px-3 py-2.5">
            <dt className="text-muted">Vence el</dt>

            <dd className="font-medium text-foreground">
              {formatExpirationDate(invitation.expiresAt)}
            </dd>
          </div>
        </dl>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            disabled={isAccepting}
            onClick={handleDecline}
          >
            Rechazar
          </Button>

          <Button loading={isAccepting} onClick={handleAccept}>
            Aceptar invitación
          </Button>
        </div>
      </section>
    </main>
  )
}
