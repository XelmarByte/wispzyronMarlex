import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/$orgSlug/employee/$')({
  component: EmployeeModulePlaceholder,
})

function EmployeeModulePlaceholder() {
  const { _splat } = Route.useParams()

  return (
    <main className="p-6">
      <h1 className="text-base font-medium text-foreground">
        Módulo en construcción
      </h1>

      <p className="mt-1 text-sm text-muted">{`/${_splat}`}</p>
    </main>
  )
}
