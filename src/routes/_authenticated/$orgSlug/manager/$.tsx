import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/$orgSlug/manager/$')({
  component: ManagerModulePlaceholder,
})

function formatModuleName(modulePath: string) {
  return modulePath
    .split('/')
    .filter(Boolean)
    .map((segment) =>
      segment
        .split('-')
        .map(
          (word) =>
            `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`,
        )
        .join(' '),
    )
    .join(' · ')
}

function ManagerModulePlaceholder() {
  const { _splat } = Route.useParams()

  const modulePath = typeof _splat === 'string' ? _splat : ''

  return (
    <main className="flex min-h-full items-center justify-center bg-background p-6">
      <section className="w-full max-w-md rounded-popover border border-border bg-surface p-6 shadow-overlay">
        <p className="text-sm font-medium text-muted">WispZyron Manager</p>

        <h1 className="mt-2 text-xl font-semibold tracking-tight">
          Módulo en construcción
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted">
          <strong className="font-medium text-foreground">
            {formatModuleName(modulePath)}
          </strong>{' '}
          estará disponible próximamente.
        </p>
      </section>
    </main>
  )
}
