import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type {
  OrganizationDraft,
  PrimaryAdministratorMode,
} from '@/data/demo-organization'

interface OrganizationAdministratorPageProps {
  draft: OrganizationDraft
  onChange: (nextDraft: OrganizationDraft) => void
  onBack: () => void
  onContinue: () => void
}

export function OrganizationAdministratorPage({
  draft,
  onChange,
  onBack,
  onContinue,
}: OrganizationAdministratorPageProps) {
  const isSelfAdministrator = draft.primaryAdministratorMode === 'self'

  const isComplete =
    isSelfAdministrator ||
    (draft.administratorName.trim().length > 0 &&
      draft.administratorEmail.trim().length > 0)

  const selectAdministratorMode = (mode: PrimaryAdministratorMode) => {
    onChange({
      ...draft,
      primaryAdministratorMode: mode,
      administratorName: mode === 'self' ? '' : draft.administratorName,
      administratorEmail: mode === 'self' ? '' : draft.administratorEmail,
    })
  }

  const updateDraft = (changes: Partial<OrganizationDraft>) => {
    onChange({
      ...draft,
      ...changes,
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
            <p className="text-xs text-muted">Paso 3 de 5</p>

            <div className="mt-2 flex items-center gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-primary" />
              <span className="h-1.5 w-8 rounded-full bg-primary" />
              <span className="h-1.5 w-8 rounded-full bg-primary" />
              <span className="h-1.5 w-8 rounded-full bg-hover" />
              <span className="h-1.5 w-8 rounded-full bg-hover" />
            </div>
          </div>
        </header>

        <section className="mx-auto w-full max-w-2xl flex-1">
          <div className="mb-9">
            <p className="mb-3 text-sm font-medium text-muted">
              Administración inicial
            </p>

            <h1 className="text-3xl font-semibold tracking-tight">
              Define quién administrará la operación
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
              Como propietario conservarás el control de facturación y de la
              organización. Puedes administrar el día a día o asignar esa
              responsabilidad a otra persona.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => selectAdministratorMode('self')}
              className={[
                'relative min-h-44 rounded-control border p-5 text-left transition-colors',
                'focus-visible:outline-2 focus-visible:outline-ring',
                isSelfAdministrator
                  ? 'border-primary bg-surface'
                  : 'border-border bg-surface hover:bg-hover',
              ].join(' ')}
              aria-pressed={isSelfAdministrator}
            >
              <span
                className={[
                  'absolute right-4 top-4 flex size-5 items-center justify-center rounded-full border',
                  isSelfAdministrator
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background',
                ].join(' ')}
                aria-hidden="true"
              >
                {isSelfAdministrator ? '✓' : null}
              </span>

              <span className="flex size-9 items-center justify-center rounded-control border border-border bg-hover text-sm font-semibold">
                {draft.ownerName.slice(0, 2).toUpperCase() || 'YO'}
              </span>

              <h2 className="mt-5 text-sm font-semibold">
                Yo administraré la organización
              </h2>

              <p className="mt-2 text-sm leading-5 text-muted">
                Tendrás acceso total al panel de gerente desde el primer
                ingreso.
              </p>
            </button>

            <button
              type="button"
              onClick={() => selectAdministratorMode('invite')}
              className={[
                'relative min-h-44 rounded-control border p-5 text-left transition-colors',
                'focus-visible:outline-2 focus-visible:outline-ring',
                !isSelfAdministrator
                  ? 'border-primary bg-surface'
                  : 'border-border bg-surface hover:bg-hover',
              ].join(' ')}
              aria-pressed={!isSelfAdministrator}
            >
              <span
                className={[
                  'absolute right-4 top-4 flex size-5 items-center justify-center rounded-full border',
                  !isSelfAdministrator
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background',
                ].join(' ')}
                aria-hidden="true"
              >
                {!isSelfAdministrator ? '✓' : null}
              </span>

              <span className="flex size-9 items-center justify-center rounded-control border border-border bg-hover text-lg">
                +
              </span>

              <h2 className="mt-5 text-sm font-semibold">
                Invitar a un administrador
              </h2>

              <p className="mt-2 text-sm leading-5 text-muted">
                Recibirá una invitación para acceder como gerente cuando la
                organización esté lista.
              </p>
            </button>
          </div>

          {!isSelfAdministrator ? (
            <form
              className="mt-6 border-t border-border pt-6"
              onSubmit={(event) => {
                event.preventDefault()

                if (isComplete) {
                  onContinue()
                }
              }}
            >
              <h2 className="text-sm font-semibold">Datos del administrador</h2>

              <p className="mt-1 text-sm text-muted">
                La invitación estará vinculada a este correo electrónico.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Input
                  id="administrator-name"
                  label="Nombre completo"
                  placeholder="Andrea Ramos"
                  autoComplete="name"
                  required
                  value={draft.administratorName}
                  onChange={(event) =>
                    updateDraft({
                      administratorName: event.target.value,
                    })
                  }
                />

                <Input
                  id="administrator-email"
                  label="Correo electrónico"
                  type="email"
                  inputMode="email"
                  placeholder="andrea@empresa.com"
                  autoComplete="email"
                  required
                  value={draft.administratorEmail}
                  onChange={(event) =>
                    updateDraft({
                      administratorEmail: event.target.value,
                    })
                  }
                />
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Button type="button" variant="ghost" onClick={onBack}>
                  Atrás
                </Button>

                <Button type="submit" disabled={!isComplete}>
                  Continuar
                </Button>
              </div>
            </form>
          ) : (
            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="ghost" onClick={onBack}>
                Atrás
              </Button>

              <Button disabled={!isComplete} onClick={onContinue}>
                Continuar
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
