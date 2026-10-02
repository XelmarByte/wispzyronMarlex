import type { OAuthStrategy } from '@clerk/react/types'
import { useSignIn } from '@clerk/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Controller, useForm } from 'react-hook-form'
import { useState } from 'react'
import { GoogleIcon } from '@/components/icons'
import Threads from '@/components/ui/bg-threads'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getSafeRedirect } from '@/lib/auth'
import { getErrorMessage } from '@/lib/error'
import { emailFormSchema, type EmailFormValues } from '@/lib/validations'

export const Route = createFileRoute('/_only-public/login/')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect_url:
      typeof search.redirect_url === 'string' ? search.redirect_url : undefined,
  }),
  component: LoginPage,
})

function MicrosoftMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden="true">
      <path fill="#f35325" d="M2 2h9v9H2z" />
      <path fill="#81bc06" d="M13 2h9v9h-9z" />
      <path fill="#05a6f0" d="M2 13h9v9H2z" />
      <path fill="#ffba08" d="M13 13h9v9h-9z" />
    </svg>
  )
}

function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useSignIn()
  const { redirect_url } = Route.useSearch()

  const [authError, setAuthError] = useState<string>()
  const [authStrategy, setAuthStrategy] = useState<OAuthStrategy>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: '',
    },
  })

  const handleEmailSubmit = handleSubmit(async (values) => {
    const email = values.email.trim().toLowerCase()
    const redirectTo = getSafeRedirect(redirect_url)

    setAuthError(undefined)
    setIsSubmitting(true)

    try {
      const { error: createError } = await signIn.create({
        identifier: email,
        signUpIfMissing: true,
      })

      if (createError) {
        throw createError
      }

      const { error: sendError } = await signIn.emailCode.sendCode()

      if (sendError) {
        throw sendError
      }

      await navigate({
        to: '/login/verify',
        search: {
          redirect_url: redirectTo,
        },
        replace: true,
      })
    } catch (error) {
      setAuthError(getErrorMessage(error))
      setIsSubmitting(false)
    }
  })

  const handleSocialSignIn = async (strategy: OAuthStrategy) => {
    const redirectTo = getSafeRedirect(redirect_url)

    setAuthError(undefined)
    setAuthStrategy(strategy)

    try {
      const { error } = await signIn.sso({
        strategy,
        redirectCallbackUrl: `/auth/callback?redirect_url=${encodeURIComponent(
          redirectTo,
        )}`,
        redirectUrl: redirectTo,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      setAuthError(getErrorMessage(error))
      setAuthStrategy(undefined)
    }
  }

  const isSocialLoginActive = authStrategy !== undefined

  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-2">
      <section className="flex min-h-svh items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Iniciar sesión o regístrate
          </h1>

          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            Elige un método para acceder a tu espacio de trabajo.
          </p>

          <form
            noValidate
            onSubmit={handleEmailSubmit}
            className="mt-8 grid gap-5"
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  ref={field.ref}
                  label="Correo electrónico"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="next"
                  placeholder="user@email.com"
                  value={field.value}
                  error={errors.email?.message}
                  size="lg"
                  className="h-12 text-base transition-colors"
                  autoFocus
                  required
                  disabled={isSubmitting || isSocialLoginActive}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                />
              )}
            />

            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSocialLoginActive}
              className="h-12 w-full text-base font-medium transition-all"
            >
              {isSubmitting ? 'Enviando código...' : 'Continuar con correo'}
            </Button>

            <div id="clerk-captcha" />
          </form>

          {authError ? (
            <p role="alert" className="mt-4 text-sm text-danger">
              {authError}
            </p>
          ) : null}

          <div className="my-8 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
            <span className="font-medium">o continúa con</span>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="secondary"
              loading={authStrategy === 'oauth_google'}
              disabled={
                isSubmitting ||
                (isSocialLoginActive && authStrategy !== 'oauth_google')
              }
              className="h-12 w-full gap-2 text-base font-medium transition-all"
              onClick={() => void handleSocialSignIn('oauth_google')}
            >
              <GoogleIcon className="size-5" aria-hidden="true" />
              Google
            </Button>

            <Button
              type="button"
              variant="secondary"
              loading={authStrategy === 'oauth_microsoft'}
              disabled={
                isSubmitting ||
                (isSocialLoginActive && authStrategy !== 'oauth_microsoft')
              }
              className="h-12 w-full gap-2 text-base font-medium transition-all"
              onClick={() => void handleSocialSignIn('oauth_microsoft')}
            >
              <MicrosoftMark />
              Microsoft
            </Button>
          </div>

          <p className="mt-8 text-center text-sm leading-relaxed text-muted-foreground">
            Al continuar, aceptas los{' '}
            <a
              href="#terms"
              className="rounded-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary outline-none"
            >
              Términos de Servicio
            </a>{' '}
            y la{' '}
            <a
              href="#privacy"
              className="rounded-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary outline-none"
            >
              Política de Privacidad
            </a>
            .
          </p>
        </div>
      </section>

      <aside className="relative hidden overflow-hidden bg-zinc-950 text-white lg:block">
        <div className="absolute top-1/4 left-12 z-10 max-w-lg">
          <p className="text-sm font-semibold tracking-wide text-zinc-400 uppercase">
            Acceso seguro
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Todo tu trabajo, en un solo lugar.
          </h2>

          <p className="mt-4 font-mono text-sm text-zinc-500">WispZyron 2026</p>
        </div>

        <Threads />
      </aside>
    </main>
  )
}
