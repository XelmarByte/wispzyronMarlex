import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { DemoOrganizationRecord } from '@/data/demo-account'
import { getOrganizationPlan } from '@/data/demo-organization'

interface OrganizationSettingsFormValues {
  country: string
  name: string
  phone: string
  taxId: string
}

interface OrganizationSettingsPageProps {
  organization: DemoOrganizationRecord
  onSave: (updates: OrganizationSettingsFormValues) => void
}

function getOnboardingLabel(
  status: DemoOrganizationRecord['onboardingStatus'],
) {
  if (status === 'completed') {
    return 'Completado'
  }

  if (status === 'in-progress') {
    return 'En progreso'
  }

  return 'Por empezar'
}

function getOnboardingVariant(
  status: DemoOrganizationRecord['onboardingStatus'],
) {
  if (status === 'completed') {
    return 'success' as const
  }

  if (status === 'in-progress') {
    return 'warning' as const
  }

  return 'secondary' as const
}

export function OrganizationSettingsPage({
  organization,
  onSave,
}: OrganizationSettingsPageProps) {
  const plan = getOrganizationPlan(organization.plan)

  const [formValues, setFormValues] = useState<OrganizationSettingsFormValues>(
    () => ({
      name: organization.name,
      country: organization.country,
      phone: organization.phone,
      taxId: organization.taxId,
    }),
  )

  const [hasSaved, setHasSaved] = useState(false)

  const isComplete =
    formValues.name.trim().length > 0 && formValues.country.trim().length > 0

  const updateFormValues = (
    changes: Partial<OrganizationSettingsFormValues>,
  ) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      ...changes,
    }))

    setHasSaved(false)
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          General
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Administra los datos principales y de contacto de la empresa.
        </p>
      </header>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault()

          if (!isComplete) {
            return
          }

          onSave({
            name: formValues.name.trim(),
            country: formValues.country.trim(),
            phone: formValues.phone.trim(),
            taxId: formValues.taxId.trim(),
          })

          setHasSaved(true)
        }}
      >
        <section className="rounded-popover border border-border bg-surface p-5 sm:p-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Datos de empresa
            </h3>

            <p className="mt-1 text-sm text-muted">
              Esta información aparecerá en el selector de espacios y en las
              comunicaciones administrativas.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                id="organization-name"
                label="Nombre de la empresa"
                autoComplete="organization"
                required
                value={formValues.name}
                onChange={(event) =>
                  updateFormValues({
                    name: event.target.value,
                  })
                }
              />
            </div>

            <Input
              id="organization-country"
              label="País"
              autoComplete="country-name"
              required
              value={formValues.country}
              onChange={(event) =>
                updateFormValues({
                  country: event.target.value,
                })
              }
            />

            <Input
              id="organization-phone"
              label="Teléfono principal"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={formValues.phone}
              onChange={(event) =>
                updateFormValues({
                  phone: event.target.value,
                })
              }
            />

            <Input
              id="organization-tax-id"
              label="RUC o identificador fiscal"
              description="Opcional por ahora."
              inputMode="numeric"
              value={formValues.taxId}
              onChange={(event) =>
                updateFormValues({
                  taxId: event.target.value,
                })
              }
            />

            <div className="flex w-full flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">
                Identificador de organización
              </span>

              <div className="flex h-8 items-center rounded-control border border-border bg-hover px-3 text-sm text-muted">
                /{organization.slug}
              </div>

              <p className="text-xs text-muted">
                No se puede modificar después de crear la organización.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-popover border border-border bg-surface p-5 sm:p-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Plan y activación
            </h3>

            <p className="mt-1 text-sm text-muted">
              Resumen de la suscripción y del estado inicial del espacio de
              trabajo.
            </p>
          </div>

          <dl className="mt-6 divide-y divide-border rounded-control border border-border">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-sm text-muted">Plan actual</dt>

              <dd className="flex items-center gap-2 text-sm font-medium">
                {plan.name}

                {plan.aiEnabled ? <Badge variant="beta">AI</Badge> : null}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-sm text-muted">Ciclo de facturación</dt>

              <dd className="text-sm font-medium">
                {organization.billingCycle === 'annual' ? 'Anual' : 'Mensual'}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-sm text-muted">Configuración inicial</dt>

              <dd>
                <Badge
                  variant={getOnboardingVariant(organization.onboardingStatus)}
                >
                  {getOnboardingLabel(organization.onboardingStatus)}
                </Badge>
              </dd>
            </div>
          </dl>

          <p className="mt-4 text-xs leading-5 text-muted">
            Los cambios de plan, facturación y métodos de pago se gestionarán en
            un módulo administrativo independiente.
          </p>
        </section>

        <footer className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-h-5 text-sm text-muted" aria-live="polite">
            {hasSaved ? 'Cambios guardados en la demo.' : null}
          </p>

          <Button type="submit" disabled={!isComplete}>
            Guardar cambios
          </Button>
        </footer>
      </form>
    </div>
  )
}
