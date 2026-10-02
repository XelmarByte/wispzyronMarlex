import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/$orgSlug/manager/')({
  component: ManagerEntryPage,
})

function ManagerEntryPage() {
  const { orgSlug } = Route.useParams()

  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      <section className="w-full max-w-md rounded-popover border border-border bg-surface p-6 shadow-overlay">
        <p className="text-sm font-medium text-muted">WispZyron Manager</p>

        <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
          Panel de gestión
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted">
          El espacio de administración de{' '}
          <strong className="font-medium text-foreground">{orgSlug}</strong> se
          construirá sobre esta ruta.
        </p>
      </section>
    </main>
  )
}
