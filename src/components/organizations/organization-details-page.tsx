import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  createOrganizationSlug,
  type OrganizationDraft,
} from '@/data/demo-organization'

interface OrganizationDetailsPageProps {
  draft: OrganizationDraft
  onChange: (nextDraft: OrganizationDraft) => void
  onBack: () => void
  onContinue: () => void
}

export function OrganizationDetailsPage({
  draft,
  onChange,
  onBack,
  onContinue,
}: OrganizationDetailsPageProps) {
  const updateDraft = (changes: Partial<OrganizationDraft>) => {
    onChange({
      ...draft,
      ...changes,
    })
  }

  const handleCompanyNameChange = (companyName: string) => {
    const currentGeneratedSlug = createOrganizationSlug(draft.companyName)
    const shouldUpdateSlug =
      draft.slug.length === 0 || draft.slug === currentGeneratedSlug

    updateDraft({
      companyName,
      slug: shouldUpdateSlug ? createOrganizationSlug(companyName) : draft.slug,
    })
  }

  const isComplete =
    draft.companyName.trim().length > 0 &&
    draft.slug.trim().length > 0 &&
    draft.country.trim().length > 0 &&
    draft.ownerName.trim().length > 0 &&
    draft.ownerEmail.trim().length > 0

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
            <p className="text-xs text-muted">Paso 2 de 5</p>

            <div className="mt-2 flex items-center gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-primary" />
              <span className="h-1.5 w-8 rounded-full bg-primary" />
              <span className="h-1.5 w-8 rounded-full bg-hover" />
              <span className="h-1.5 w-8 rounded-full bg-hover" />
              <span className="h-1.5 w-8 rounded-full bg-hover" />
            </div>
          </div>
        </header>

        <section className="mx-auto w-full max-w-2xl flex-1">
          <div className="mb-9">
            <p className="mb-3 text-sm font-medium text-muted">
              Datos iniciales
            </p>

            <h1 className="text-3xl font-semibold tracking-tight">
              Cuéntanos sobre tu empresa
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
              Esta información identifica tu espacio de trabajo y a la persona
              propietaria de la organización.
            </p>
          </div>

          <form
            className="space-y-8"
            onSubmit={(event) => {
              event.preventDefault()

              if (isComplete) {
                onContinue()
              }
            }}
          >
            <fieldset>
              <legend className="text-sm font-semibold">Organización</legend>

              <p className="mt-1 text-sm text-muted">
                Podrás actualizar estos datos desde la configuración del espacio
                de trabajo.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    id="organization-name"
                    label="Nombre de la empresa"
                    placeholder="Ej. NovaSpeed Telecom"
                    autoComplete="organization"
                    required
                    value={draft.companyName}
                    onChange={(event) =>
                      handleCompanyNameChange(event.target.value)
                    }
                  />
                </div>

                <Input
                  id="organization-slug"
                  label="Identificador de organización"
                  description={`Tu panel estará disponible en /${
                    draft.slug || 'tu-organizacion'
                  }/manager`}
                  placeholder="novaspeed"
                  autoComplete="off"
                  required
                  value={draft.slug}
                  onChange={(event) =>
                    updateDraft({
                      slug: createOrganizationSlug(event.target.value),
                    })
                  }
                />

                <Input
                  id="organization-country"
                  label="País"
                  placeholder="Perú"
                  autoComplete="country-name"
                  required
                  value={draft.country}
                  onChange={(event) =>
                    updateDraft({
                      country: event.target.value,
                    })
                  }
                />

                <Input
                  id="organization-phone"
                  label="Teléfono principal"
                  description="Lo usaremos para comunicaciones de la cuenta."
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+51 999 999 999"
                  value={draft.phone}
                  onChange={(event) =>
                    updateDraft({
                      phone: event.target.value,
                    })
                  }
                />

                <Input
                  id="organization-tax-id"
                  label="RUC o identificador fiscal"
                  description="Opcional por ahora."
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="20123456789"
                  value={draft.taxId}
                  onChange={(event) =>
                    updateDraft({
                      taxId: event.target.value,
                    })
                  }
                />
              </div>
            </fieldset>

            <fieldset className="border-t border-border pt-8">
              <legend className="text-sm font-semibold">
                Propietario de la cuenta
              </legend>

              <p className="mt-1 text-sm text-muted">
                Tendrá control total de la organización. En el siguiente paso
                podrás decidir si tú u otra persona será el administrador
                operativo.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Input
                  id="owner-name"
                  label="Nombre completo"
                  placeholder="Marlex Saravia"
                  autoComplete="name"
                  required
                  value={draft.ownerName}
                  onChange={(event) =>
                    updateDraft({
                      ownerName: event.target.value,
                    })
                  }
                />

                <Input
                  id="owner-email"
                  label="Correo electrónico"
                  type="email"
                  inputMode="email"
                  placeholder="nombre@empresa.com"
                  autoComplete="email"
                  required
                  value={draft.ownerEmail}
                  onChange={(event) =>
                    updateDraft({
                      ownerEmail: event.target.value,
                    })
                  }
                />
              </div>
            </fieldset>

            <div className="rounded-control border border-border bg-surface px-4 py-3">
              <p className="text-sm font-medium">Tu información está segura</p>

              <p className="mt-1 text-xs leading-5 text-muted">
                La confirmación de pago posterior será una simulación visual.
                Esta demo no solicitará ni almacenará información financiera
                real.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="ghost" onClick={onBack}>
                Atrás
              </Button>

              <Button type="submit" disabled={!isComplete}>
                Continuar
              </Button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
