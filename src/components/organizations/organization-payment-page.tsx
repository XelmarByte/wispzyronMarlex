import { Button } from '@/components/ui/button'
import {
  getOrganizationPlan,
  type DemoPaymentMethod,
  type OrganizationDraft,
} from '@/data/demo-organization'

interface OrganizationPaymentPageProps {
  draft: OrganizationDraft
  onChange: (nextDraft: OrganizationDraft) => void
  onBack: () => void
  onContinue: () => void
}

interface PaymentOption {
  id: DemoPaymentMethod
  title: string
  description: string
  badge?: string
}

const paymentOptions: PaymentOption[] = [
  {
    id: 'card',
    title: 'Tarjeta',
    description: 'Débito o crédito mediante una pasarela de pago segura.',
  },
  {
    id: 'yape',
    title: 'Yape',
    description: 'Confirma el pago desde Yape usando un QR o código dinámico.',
    badge: 'Popular en Perú',
  },
  {
    id: 'agent-transfer',
    title: 'Transferencia o agente',
    description:
      'Paga desde tu banco, agente autorizado o ventanilla usando una referencia.',
  },
]

function formatPrice(amount: number, currency: 'PEN') {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function OrganizationPaymentPage({
  draft,
  onChange,
  onBack,
  onContinue,
}: OrganizationPaymentPageProps) {
  if (!draft.plan) {
    return null
  }

  const plan = getOrganizationPlan(draft.plan)

  const selectMethod = (paymentMethod: DemoPaymentMethod) => {
    onChange({
      ...draft,
      paymentMethod,
    })
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col px-6 py-10 sm:px-8">
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-control border border-border bg-surface">
              <span className="size-4 rounded-[4px] bg-primary" />
            </span>

            <div>
              <p className="text-sm font-medium leading-none">WispZyron</p>

              <p className="mt-1 text-xs text-muted">Crear organización</p>
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-xs text-muted">Paso 5 de 5</p>

            <div className="mt-2 flex items-center gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-primary" />
              <span className="h-1.5 w-8 rounded-full bg-primary" />
              <span className="h-1.5 w-8 rounded-full bg-primary" />
              <span className="h-1.5 w-8 rounded-full bg-primary" />
              <span className="h-1.5 w-8 rounded-full bg-primary" />
            </div>
          </div>
        </header>

        <section className="mx-auto w-full max-w-2xl flex-1">
          <div className="mb-9">
            <p className="mb-3 text-sm font-medium text-muted">
              Confirmación de pago
            </p>

            <h1 className="text-3xl font-semibold tracking-tight">
              Elige cómo deseas pagar
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
              Estás configurando el plan {plan.name} para {draft.companyName}.
            </p>
          </div>

          <section className="rounded-popover border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm font-semibold">{plan.name}</p>

                <p className="mt-1 text-sm text-muted">
                  Facturación{' '}
                  {draft.billingCycle === 'annual' ? 'anual' : 'mensual'}
                </p>
              </div>

              <p className="shrink-0 text-lg font-semibold">
                {formatPrice(plan.monthlyPrice, plan.currency)}
                <span className="text-sm font-normal text-muted"> / mes</span>
              </p>
            </div>
          </section>

          <div className="mt-6">
            <h2 className="text-sm font-semibold">Método de pago</h2>

            <div className="mt-4 grid gap-3">
              {paymentOptions.map((option) => {
                const isSelected = draft.paymentMethod === option.id

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => selectMethod(option.id)}
                    className={[
                      'flex items-center justify-between gap-4 rounded-control border p-4 text-left transition-colors',
                      'focus-visible:outline-2 focus-visible:outline-ring',
                      isSelected
                        ? 'border-primary bg-surface'
                        : 'border-border bg-surface hover:bg-hover',
                    ].join(' ')}
                    aria-pressed={isSelected}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={[
                          'flex size-5 shrink-0 items-center justify-center rounded-full border',
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background',
                        ].join(' ')}
                        aria-hidden="true"
                      >
                        {isSelected ? '✓' : null}
                      </span>

                      <span>
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {option.title}
                          </span>

                          {option.badge ? (
                            <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted">
                              {option.badge}
                            </span>
                          ) : null}
                        </span>

                        <span className="mt-1 block text-xs leading-5 text-muted">
                          {option.description}
                        </span>
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {draft.paymentMethod === 'yape' ? (
            <div className="mt-5 rounded-control border border-border bg-surface px-4 py-3">
              <p className="text-sm font-medium">Confirmación con Yape</p>

              <p className="mt-1 text-xs leading-5 text-muted">
                En producción, aquí mostraremos un QR o deep link de pago
                generado para esta operación. En esta demo, el siguiente botón
                simulará su aprobación.
              </p>
            </div>
          ) : null}

          {draft.paymentMethod === 'agent-transfer' ? (
            <div className="mt-5 rounded-control border border-border bg-surface px-4 py-3">
              <p className="text-sm font-medium">
                Pago por transferencia o agente
              </p>

              <p className="mt-1 text-xs leading-5 text-muted">
                En producción se generará una referencia única y se mostrará la
                cuenta bancaria o agente habilitado para el pago.
              </p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="ghost" onClick={onBack}>
              Atrás
            </Button>

            <Button
              disabled={draft.paymentMethod === null}
              onClick={onContinue}
            >
              Confirmar pago demo
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}
