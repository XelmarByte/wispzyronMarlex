import { useState, type SubmitEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getInvitationByToken } from '@/data/demo-account'
import { useDemoAccount } from '@/providers/demo-account-context'
import { isInvitationAvailable } from '@/lib/invitations'

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function normalizeInvitationToken(token: string): string {
  return token.trim().replace(/\s+/g, '').toUpperCase()
}

export function JoinOrganizationPage() {
  const navigate = useNavigate()
  const { state } = useDemoAccount()

  const [invitationToken, setInvitationToken] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const handleContinue = () => {
    if (loading) {
      return
    }

    const token = normalizeInvitationToken(invitationToken)

    if (!token) {
      setError('Ingresa el código de invitación que recibiste.')
      return
    }

    const invitation = getInvitationByToken(state, token)

    const isCorrectRecipient =
      invitation !== undefined &&
      normalizeEmail(invitation.recipientEmail) ===
        normalizeEmail(state.account.email)

    if (
      !invitation ||
      !isInvitationAvailable(invitation) ||
      !isCorrectRecipient
    ) {
      setError('No encontramos una invitación disponible con ese código.')
      return
    }

    setError(undefined)
    setLoading(true)

    window.setTimeout(() => {
      void navigate({
        to: '/invitations/verify',
        search: {
          token: invitation.token,
        },
      })
    }, 700)
  }

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    handleContinue()
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-6 py-12">
      <section className="w-full max-w-sm">
        <Button
          variant="ghost"
          onClick={() => void navigate({ to: '/organizations' })}
          className="-ml-2 h-auto px-2 py-1 text-sm font-medium text-muted transition-colors"
        >
          Volver a espacios de trabajo
        </Button>

        <div className="mt-4">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Unirse a una organización
          </h1>

          <p className="mt-2 text-base leading-relaxed text-muted">
            Ingresa el código de invitación que recibiste por correo.
          </p>
        </div>

        <form className="mt-4" onSubmit={handleSubmit}>
          <Input
            id="invitation-token"
            label="Código de invitación"
            description="El código comienza con WZ-."
            placeholder="WZ-XXXX-XXXX-XXXX-XXXX-XXXX"
            value={invitationToken}
            error={error}
            autoComplete="off"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            maxLength={27}
            className="font-mono text-sm uppercase transition-colors"
            onChange={(event) => {
              setInvitationToken(
                event.target.value.replace(/\s+/g, '').toUpperCase(),
              )
              setError(undefined)
            }}
          />

          <div className="mt-6 flex">
            <Button
              type="submit"
              size="lg"
              loading={loading}
              disabled={loading}
              className="transition-all"
            >
              Continuar
            </Button>
          </div>
        </form>

        <p className="mt-6 text-xs leading-relaxed text-muted">
          Las invitaciones están vinculadas al correo destinatario, solo pueden
          usarse una vez y deben estar pendientes para poder aceptarse.
        </p>
      </section>
    </main>
  )
}
