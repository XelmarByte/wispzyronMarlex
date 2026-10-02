import { useEffect, useMemo, useState } from 'react'
import type { OrganizationDraft } from '@/data/demo-organization'

interface OrganizationProvisioningProps {
  draft: OrganizationDraft
  onComplete: () => void
}

interface ProvisioningTask {
  title: string
  description: string
}

function getProvisioningTasks(draft: OrganizationDraft): ProvisioningTask[] {
  const administratorTask =
    draft.primaryAdministratorMode === 'invite'
      ? {
          title: 'Preparando invitación de administrador',
          description: `Se enviará una invitación a ${draft.administratorEmail}.`,
        }
      : {
          title: 'Configurando acceso de administrador',
          description:
            'El propietario tendrá acceso inicial al panel de gerente.',
        }

  return [
    {
      title: 'Validando la confirmación de pago',
      description: 'Registrando la activación simulada de tu plan.',
    },
    {
      title: 'Preparando el espacio de trabajo',
      description: `Creando ${draft.companyName} en WispZyron.`,
    },
    {
      title: 'Configurando permisos iniciales',
      description: 'Aplicando los permisos base del propietario.',
    },
    administratorTask,
    {
      title: 'Preparando módulos de tu plan',
      description: 'El panel estará listo para su configuración inicial.',
    },
  ]
}

export function OrganizationProvisioning({
  draft,
  onComplete,
}: OrganizationProvisioningProps) {
  // 1. Memorizamos `tasks` para mantener la referencia estable
  const tasks = useMemo(() => getProvisioningTasks(draft), [draft])
  const [completedTaskCount, setCompletedTaskCount] = useState(0)

  useEffect(() => {
    const timers = tasks.map((_, index) =>
      window.setTimeout(
        () => {
          setCompletedTaskCount(index + 1)
        },
        (index + 1) * 700,
      ),
    )

    const completionTimer = window.setTimeout(
      () => {
        onComplete()
      },
      (tasks.length + 1) * 700,
    )

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      window.clearTimeout(completionTimer)
    }
  }, [onComplete, tasks]) // 2. Incluimos `tasks` en el arreglo de dependencias

  return (
    <main className="flex min-h-svh items-center bg-background px-6 py-10 text-foreground">
      <section className="mx-auto w-full max-w-xl">
        <div className="rounded-popover border border-border bg-surface p-6 shadow-overlay sm:p-8">
          <div className="flex size-10 items-center justify-center rounded-control border border-border bg-hover">
            <span
              className="size-4 animate-spin rounded-full border-2 border-muted border-t-foreground"
              aria-hidden="true"
            />
          </div>

          <p className="mt-7 text-sm font-medium text-muted">Provisioning</p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Creando tu organización
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            Estamos preparando <strong>{draft.companyName}</strong>. Esto solo
            tomará unos segundos.
          </p>

          <ol
            className="mt-8 space-y-1"
            aria-live="polite"
            aria-label="Progreso de creación de organización"
          >
            {tasks.map((task, index) => {
              const isCompleted = index < completedTaskCount
              const isActive = index === completedTaskCount

              return (
                <li
                  key={task.title}
                  className={[
                    'flex gap-3 rounded-control px-3 py-3 transition-colors',
                    isActive ? 'bg-hover' : '',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs',
                      isCompleted
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isActive
                          ? 'border-foreground text-foreground'
                          : 'border-border text-muted',
                    ].join(' ')}
                    aria-hidden="true"
                  >
                    {isCompleted ? '✓' : isActive ? '…' : null}
                  </span>

                  <span>
                    <span
                      className={[
                        'block text-sm',
                        isCompleted || isActive
                          ? 'font-medium text-foreground'
                          : 'text-muted',
                      ].join(' ')}
                    >
                      {task.title}
                    </span>

                    {isActive || isCompleted ? (
                      <span className="mt-1 block text-xs leading-5 text-muted">
                        {task.description}
                      </span>
                    ) : null}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </section>
    </main>
  )
}
