import { useSignIn, useSignUp } from '@clerk/react'
import { isClerkAPIResponseError } from '@clerk/react/errors'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { OtpInput } from '@/components/ui/otp-input'
import { getSafeRedirect } from '@/lib/auth'
import { getErrorMessage } from '@/lib/error'
import { otpCodeSchema, type OtpCodeValues } from '@/lib/validations'

function getOptionalRedirect(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

export const Route = createFileRoute('/_only-public/login/verify')({
  beforeLoad: ({ context, search }) => {
    if (!context.signInIdentifier) {
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
  component: VerifyPage,
})

function VerifyPage() {
  const navigate = useNavigate()
  const { signIn } = useSignIn()
  const { signUp } = useSignUp()
  const { redirect_url } = Route.useSearch()

  const [authError, setAuthError] = useState<string>()
  const [cooldown, setCooldown] = useState(0)
  const [hasResentCode, setHasResentCode] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [code, setCode] = useState('')

  const {
    clearErrors,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OtpCodeValues>({
    resolver: zodResolver(otpCodeSchema),
    defaultValues: {
      code: '',
    },
  })

  const redirectTo = getSafeRedirect(redirect_url)

  useEffect(() => {
    if (cooldown <= 0) {
      return
    }

    const timer = window.setTimeout(() => {
      setCooldown((currentCooldown) => currentCooldown - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [cooldown])

  const finalizeSignIn = async () => {
    const { error } = await signIn.finalize({
      navigate: ({ decorateUrl }) => {
        window.location.assign(decorateUrl(redirectTo))
      },
    })

    if (error) {
      throw error
    }
  }

  const finalizeSignUp = async () => {
    const { error } = await signUp.finalize({
      navigate: ({ decorateUrl }) => {
        window.location.assign(decorateUrl(redirectTo))
      },
    })

    if (error) {
      throw error
    }
  }

  const transferToSignUp = async () => {
    const { error } = await signUp.create({
      transfer: true,
    })

    if (error) {
      throw error
    }

    if (signUp.status === 'complete') {
      await finalizeSignUp()
      return
    }

    setAuthError(
      'Tu correo fue verificado, pero faltan datos para completar la cuenta.',
    )
  }

  const handleVerify = handleSubmit(async (values) => {
    if (isResending || isVerifying) {
      return
    }

    setAuthError(undefined)
    setIsVerifying(true)

    try {
      const { error } = await signIn.emailCode.verifyCode({
        code: values.code,
      })

      if (error) {
        if (
          isClerkAPIResponseError(error) &&
          error.errors[0]?.code === 'sign_up_if_missing_transfer'
        ) {
          await transferToSignUp()
          return
        }

        throw error
      }

      if (signIn.status === 'complete') {
        await finalizeSignIn()
        return
      }

      setAuthError(
        'No fue posible completar la verificación. Inténtalo nuevamente.',
      )
    } catch (error) {
      setAuthError(getErrorMessage(error))
    } finally {
      setIsVerifying(false)
    }
  })

  const handleResendCode = async () => {
    if (cooldown > 0 || isVerifying || isResending) {
      return
    }

    setAuthError(undefined)
    setHasResentCode(false)
    setIsResending(true)

    try {
      const { error } = await signIn.emailCode.sendCode()

      if (error) {
        throw error
      }

      setCode('')
      setValue('code', '')
      clearErrors('code')
      setCooldown(30)
      setHasResentCode(true)
    } catch (error) {
      setAuthError(getErrorMessage(error))
    } finally {
      setIsResending(false)
    }
  }

  const codeError = errors.code?.message ?? authError

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-6 py-12">
      <section className="w-full max-w-sm">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-ml-2 h-auto px-2 py-1 text-sm font-medium text-muted transition-colors"
          onClick={() =>
            void navigate({
              to: '/login',
              search: {
                redirect_url,
              },
            })
          }
        >
          Volver
        </Button>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
          Verifica tu correo
        </h1>

        <p className="mt-2 text-base leading-relaxed text-muted">
          Enviamos un código de 6 dígitos a{' '}
          <span className="font-medium text-foreground">
            {signIn.identifier ?? 'tu correo'}
          </span>
          .
        </p>

        <div className="mt-8 w-fit">
          <form noValidate onSubmit={handleVerify}>
            <OtpInput
              value={code}
              error={codeError}
              disabled={isVerifying || isResending}
              autoFocus
              onValueChange={(nextCode) => {
                setCode(nextCode)
                setValue('code', nextCode, {
                  shouldDirty: true,
                })
                clearErrors('code')
                setAuthError(undefined)
              }}
            />

            <Button
              type="submit"
              size="lg"
              loading={isVerifying}
              disabled={isVerifying || isResending}
              className="mt-6 w-full text-sm font-semibold transition-all"
            >
              {isVerifying ? 'Verificando...' : 'Verificar código'}
            </Button>
          </form>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            loading={isResending}
            disabled={isVerifying || isResending || cooldown > 0}
            className="mx-auto mt-4 flex h-auto px-2 py-1 text-sm font-medium text-muted transition-colors"
            onClick={() => void handleResendCode()}
          >
            {isResending
              ? 'Reenviando...'
              : cooldown > 0
                ? `Reenviar en ${cooldown}s`
                : 'Reenviar código'}
          </Button>
        </div>

        {hasResentCode ? (
          <p role="status" className="mt-4 text-sm font-medium text-muted">
            Código reenviado. Revisa tu bandeja de correo.
          </p>
        ) : null}
      </section>
    </main>
  )
}
