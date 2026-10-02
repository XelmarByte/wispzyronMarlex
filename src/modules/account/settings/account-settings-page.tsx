import { type SubmitEvent, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeSelector } from '@/components/theme-selector'
import type { DemoAccount } from '@/data/demo-account'
import { getErrorMessage } from '@/lib/error'

interface AccountProfileFormValues {
  name: string
  phone: string
}

interface AccountSettingsPageProps {
  account: DemoAccount
  workspaceCount: number
  onSave: (updates: AccountProfileFormValues) => Promise<void>
}

export function AccountSettingsPage({
  account,
  workspaceCount,
  onSave,
}: AccountSettingsPageProps) {
  const [formValues, setFormValues] = useState<AccountProfileFormValues>(
    () => ({
      name: account.name,
      phone: account.phone,
    }),
  )

  const [hasSaved, setHasSaved] = useState(false)

  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string>()

  const isComplete = formValues.name.trim().length > 0

  const updateFormValues = (changes: Partial<AccountProfileFormValues>) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      ...changes,
    }))

    setHasSaved(false)
  }

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isComplete || isSaving) {
      return
    }

    setHasSaved(false)
    setSaveError(undefined)
    setIsSaving(true)

    try {
      await onSave({
        name: formValues.name.trim(),
        phone: formValues.phone.trim(),
      })

      setHasSaved(true)
    } catch (error) {
      setSaveError(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto w-full max-w-4xl px-6 py-10 sm:px-8">
        <header>
          <p className="text-sm font-medium text-muted">
            Configuración de cuenta
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Perfil y preferencias
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Administra los datos personales y las preferencias globales de tu
            cuenta WispZyron.
          </p>
        </header>

        <form
          className="mt-8 space-y-6"
          onSubmit={(event) => void handleSubmit(event)}
        >
          <section className="rounded-popover border border-border bg-surface p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-border bg-hover text-sm font-semibold text-foreground">
                {account.initials}
              </span>

              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Información personal
                </h2>

                <p className="mt-1 text-sm leading-6 text-muted">
                  La foto de perfil se sincronizará con tu cuenta de Clerk
                  cuando conectemos autenticación real.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Input
                id="account-name"
                label="Nombre completo"
                autoComplete="name"
                required
                value={formValues.name}
                onChange={(event) =>
                  updateFormValues({
                    name: event.target.value,
                  })
                }
              />

              <Input
                id="account-phone"
                label="Teléfono"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+51 999 999 999"
                value={formValues.phone}
                onChange={(event) =>
                  updateFormValues({
                    phone: event.target.value,
                  })
                }
              />

              <div className="sm:col-span-2">
                <Input
                  id="account-email"
                  label="Correo electrónico"
                  description="El cambio de correo requerirá verificación mediante Clerk."
                  type="email"
                  value={account.email}
                  readOnly
                />
              </div>
            </div>
          </section>

          <section className="rounded-popover border border-border bg-surface p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-foreground">
              Preferencias
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted">
              Estas preferencias se aplican a toda tu cuenta, sin importar la
              organización que estés utilizando.
            </p>

            <div className="mt-5 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Tema</p>

                  <p className="mt-1 text-xs leading-5 text-muted">
                    Elige entre claro, oscuro o la configuración del sistema.
                  </p>
                </div>
              </div>

              <ThemeSelector className="mt-4 max-w-sm" />
            </div>
          </section>

          <section className="rounded-popover border border-border bg-surface p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-foreground">
              Resumen de cuenta
            </h2>

            <dl className="mt-5 divide-y divide-border rounded-control border border-border">
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <dt className="text-sm text-muted">Tipo de cuenta</dt>

                <dd className="text-sm font-medium text-foreground">
                  Cuenta personal
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <dt className="text-sm text-muted">Espacios de trabajo</dt>

                <dd className="text-sm font-medium text-foreground">
                  {workspaceCount}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <dt className="text-sm text-muted">Estado</dt>

                <dd>
                  <Badge variant="success" dot>
                    Activa
                  </Badge>
                </dd>
              </div>
            </dl>
          </section>

          <footer className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-h-5 text-sm text-muted" aria-live="polite">
              {saveError ?? (hasSaved ? 'Cambios guardados.' : null)}
            </p>

            <Button
              type="submit"
              loading={isSaving}
              disabled={!isComplete || isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </footer>
        </form>
      </div>
    </main>
  )
}
