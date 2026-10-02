import { useClerk, useSignIn, useSignUp } from '@clerk/react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { getSafeRedirect } from '@/lib/auth'
import { getErrorMessage } from '@/lib/error'

function getOptionalRedirect(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

export const Route = createFileRoute('/_only-public/auth/callback')({
  beforeLoad: ({ context, search }) => {
    if (!context.signInStrategy?.startsWith('oauth_')) {
      throw redirect({
        to: '/login',
        search: {
          redirect_url: getOptionalRedirect(search.redirect_url),
        },
      })
    }
  },
  validateSearch: (search: Record<string, unknown>) => ({
    redirect_url: getOptionalRedirect(search.redirect_url),
  }),
  component: OAuthCallbackPage,
})

function OAuthCallbackPage() {
  const navigate = useNavigate()
  const { loaded } = useClerk()
  const { signIn } = useSignIn()
  const { signUp } = useSignUp()
  const { redirect_url } = Route.useSearch()

  const redirectUrl =
    typeof redirect_url === 'string' ? redirect_url : undefined

  const redirectTo = getSafeRedirect(redirectUrl)

  const hasStarted = useRef(false)
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    if (!loaded || hasStarted.current) {
      return
    }

    hasStarted.current = true

    const completeOAuth = async () => {
      try {
        if (signIn.status === 'complete') {
          const { error } = await signIn.finalize({
            navigate: ({ decorateUrl }) => {
              window.location.assign(decorateUrl(redirectTo))
            },
          })

          if (error) {
            throw error
          }

          return
        }

        if (signIn.isTransferable) {
          const { error: transferError } = await signUp.create({
            transfer: true,
          })

          if (transferError) {
            throw transferError
          }

          if (signUp.status === 'complete') {
            const { error: finalizeError } = await signUp.finalize({
              navigate: ({ decorateUrl }) => {
                window.location.assign(decorateUrl(redirectTo))
              },
            })

            if (finalizeError) {
              throw finalizeError
            }

            return
          }
        }

        setErrorMessage(
          'No fue posible completar el inicio de sesión con esta cuenta.',
        )
      } catch (error) {
        setErrorMessage(getErrorMessage(error))
      }
    }

    void completeOAuth()
  }, [loaded, redirectTo, signIn, signUp])

  if (errorMessage) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background p-6">
        <section className="w-full max-w-sm rounded-popover border border-border bg-surface p-6 text-center shadow-overlay">
          <p className="text-sm font-medium text-danger">
            No se pudo iniciar sesión
          </p>

          <p className="mt-3 text-sm leading-6 text-muted">{errorMessage}</p>

          <Button
            type="button"
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
            Volver al inicio de sesión
          </Button>
        </section>
      </main>
    )
  }

  return (
    <main
      className="flex min-h-svh items-center justify-center bg-background p-6"
      role="status"
      aria-live="polite"
    >
      <section className="w-full max-w-sm text-center">
        <span
          className="mx-auto block size-8 animate-spin rounded-full border-2 border-border border-t-foreground"
          aria-hidden="true"
        />

        <h1 className="mt-5 text-lg font-semibold text-foreground">
          Verificando tu cuenta
        </h1>

        <p className="mt-2 text-sm text-muted">
          Estamos terminando el inicio de sesión de forma segura.
        </p>

        <div id="clerk-captcha" />
      </section>
    </main>
  )
}
