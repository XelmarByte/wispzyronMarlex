import { useState } from 'react'
import {
  organizationPlans,
  type OrganizationPlan,
} from '@/data/demo-organization'

interface CreateOrganizationPageProps {
  onContinue?: (plan: OrganizationPlan) => void
}

export function CreateOrganizationPage({
  onContinue,
}: CreateOrganizationPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<OrganizationPlan | null>(
    null,
  )

  const handleContinue = () => {
    if (!selectedPlan) return

    onContinue?.(selectedPlan)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 sm:px-8 lg:px-10">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card">
              <div className="h-4 w-4 rounded-[4px] bg-foreground" />
            </div>

            <div>
              <p className="text-sm font-medium leading-none">WispZyron</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Crear organización
              </p>
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-xs text-muted-foreground">Paso 1 de 3</p>

            <div className="mt-2 flex items-center gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-foreground" />
              <span className="h-1.5 w-8 rounded-full bg-muted" />
              <span className="h-1.5 w-8 rounded-full bg-muted" />
            </div>
          </div>
        </header>

        {/* Main content */}
        <section className="mx-auto w-full max-w-4xl flex-1">
          <div className="mb-9 max-w-2xl">
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              Nueva organización
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Crea tu organización
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Configura el espacio de trabajo de tu empresa y comienza a
              administrar tu operación ISP desde un solo lugar.
            </p>
          </div>

          {/* Plan selection */}
          <div>
            <div className="mb-4">
              <h2 className="text-sm font-medium">Elige tu plan</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Podrás configurar el resto de tu organización en los siguientes
                pasos.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {organizationPlans.map((plan) => {
                const isSelected = selectedPlan === plan.id

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={[
                      'group relative flex min-h-[230px] flex-col rounded-xl border p-5 text-left transition-all',
                      'focus:outline-none',
                      isSelected
                        ? 'border-foreground bg-card shadow-sm'
                        : 'border-border bg-card hover:border-foreground/40 hover:bg-muted/20',
                    ].join(' ')}
                  >
                    {/* Selection indicator */}
                    <div
                      className={[
                        'absolute right-5 top-5 flex h-5 w-5 items-center justify-center rounded-full border transition-colors',
                        isSelected
                          ? 'border-foreground bg-foreground'
                          : 'border-border bg-background',
                      ].join(' ')}
                    >
                      {isSelected && (
                        <svg
                          viewBox="0 0 12 12"
                          className="h-3 w-3 text-background"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="m2.5 6 2.2 2.2L9.5 3.5" />
                        </svg>
                      )}
                    </div>

                    {/* Plan icon */}
                    <div
                      className={[
                        'mb-7 flex h-9 w-9 items-center justify-center rounded-lg border',
                        isSelected
                          ? 'border-foreground/20 bg-muted'
                          : 'border-border bg-muted/40',
                      ].join(' ')}
                    >
                      {plan.id === 'BASIC' && (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          aria-hidden="true"
                        >
                          <rect x="4" y="4" width="16" height="16" rx="3" />
                        </svg>
                      )}

                      {plan.id === 'PRO' && (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          aria-hidden="true"
                        >
                          <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" />
                          <path d="m4.5 7.5 7.5 4 7.5-4" />
                          <path d="M12 11.5V21" />
                        </svg>
                      )}

                      {plan.id === 'ENTERPRISE' && (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          aria-hidden="true"
                        >
                          <path d="M12 3 14.2 8.8 20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3Z" />
                        </svg>
                      )}
                    </div>

                    {/* Plan information */}
                    <div className="pr-8">
                      <h3 className="text-base font-medium">{plan.name}</h3>

                      <p className="mt-2 text-sm leading-5 text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>

                    {/* Plan footer */}
                    <div className="mt-auto pt-7">
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className={[
                            'inline-flex rounded-full border px-2 py-0.5',
                            isSelected
                              ? 'border-foreground/20 bg-muted'
                              : 'border-border',
                          ].join(' ')}
                        >
                          {plan.shortName}
                        </span>

                        {plan.aiEnabled && (
                          <span className="inline-flex rounded-full border border-border px-2 py-0.5 text-muted-foreground">
                            AI incluido
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Information note */}
          <div className="mt-6 rounded-lg border border-border bg-muted/20 px-4 py-3">
            <div className="flex gap-3">
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 10v6" />
                <path d="M12 7h.01" />
              </svg>

              <p className="text-xs leading-5 text-muted-foreground">
                Esta selección es parte de la configuración inicial. Los
                detalles comerciales y de facturación se configurarán
                posteriormente.
              </p>
            </div>
          </div>
        </section>

        {/* Footer actions */}
        <footer className="mt-10 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={!selectedPlan}
            onClick={handleContinue}
            className={[
              'inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-all',
              selectedPlan
                ? 'bg-foreground text-background hover:opacity-90'
                : 'cursor-not-allowed bg-muted text-muted-foreground',
            ].join(' ')}
          >
            Continuar
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path d="M4 10h11" strokeLinecap="round" />

              <path
                d="m11 6 4 4-4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </footer>
      </div>
    </main>
  )
}
