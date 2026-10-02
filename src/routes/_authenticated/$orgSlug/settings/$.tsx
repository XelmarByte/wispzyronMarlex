import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/$orgSlug/settings/$')({
  component: OrganizationSettingsPlaceholder,
})

function getSectionPath(routeParams: unknown): string {
  if (
    typeof routeParams === 'object' &&
    routeParams !== null &&
    '_splat' in routeParams &&
    typeof routeParams._splat === 'string'
  ) {
    return routeParams._splat
  }

  return ''
}

function getSectionTitle(sectionPath: string): string {
  const titles: Record<string, string> = {
    branding: 'Marca y apariencia',
    domain: 'Dominio de correo',
    billing: 'Plan y facturación',
  }

  return titles[sectionPath] ?? 'Configuración'
}

function OrganizationSettingsPlaceholder() {
  const routeParams: unknown = Route.useParams()
  const sectionPath = getSectionPath(routeParams)

  return (
    <section className="rounded-popover border border-border bg-surface p-6 shadow-overlay">
      <p className="text-sm font-medium text-muted-foreground">
        Configuración de empresa
      </p>

      <h2 className="mt-2 text-xl font-semibold tracking-tight">
        {getSectionTitle(sectionPath)}
      </h2>

      <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
        Esta sección se está trasladando a la nueva ventana privada de
        configuración.
      </p>
    </section>
  )
}
