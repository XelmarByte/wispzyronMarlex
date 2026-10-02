import { useAuth, useSignIn } from '@clerk/react'
import { RouterProvider } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useDemoAccount } from '@/providers/demo-account-context'
import { router } from './router'

export function InnerApp() {
  const { isLoaded, isSignedIn } = useAuth()
  const { signIn } = useSignIn()

  const { isSandboxPreview, resetDemoState, state } = useDemoAccount()

  if (!isLoaded) {
    return (
      <main
        className="flex min-h-svh items-center justify-center bg-background p-6 text-foreground"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3 text-sm text-muted">
          <span
            className="size-4 animate-spin rounded-full border-2 border-border border-t-foreground"
            aria-hidden="true"
          />
          Cargando sesión…
        </div>
      </main>
    )
  }

  return (
    <>
      {import.meta.env.DEV && isSandboxPreview ? (
        <aside className="fixed inset-x-0 top-0 z-50 flex min-h-10 items-center justify-between gap-4 border-b border-warning/30 bg-warning/10 px-4 py-2 text-xs text-foreground sm:px-6">
          <p>
            Vista previa del sandbox activa. Los cambios realizados aquí no se
            guardarán en tu cuenta real.
          </p>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0"
            onClick={resetDemoState}
          >
            Volver a mi cuenta
          </Button>
        </aside>
      ) : null}

      <RouterProvider
        router={router}
        context={{
          isSignedIn,
          signInIdentifier: signIn.identifier,
          signInStrategy: signIn.firstFactorVerification.strategy,
          accountState: state,
        }}
      />
    </>
  )
}
