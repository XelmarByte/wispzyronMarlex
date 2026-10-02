import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import type {
  CreateCustomOrganizationRoleInput,
  CustomOrganizationRole,
} from '@/data/custom-organization-roles'
import type { OrganizationWorkspace } from '@/data/organization-roles'
import {
  getOrganizationWorkspaceNavigationItems,
  getSelectableOrganizationWorkspaceNavigationItems,
  organizationWorkspaceNavigation,
  type OrganizationWorkspaceNavigationId,
  type OrganizationWorkspaceNavigationItem,
} from '@/data/organization-workspace-navigation'
import { getErrorMessage } from '@/lib/error'

interface CreateOrganizationRolePageProps {
  organizationId: string
  organizationName: string
  onCancel: () => void
  onCreated: () => void
  onCreate: (
    input: CreateCustomOrganizationRoleInput,
  ) => CustomOrganizationRole | null
}

interface NavigationAccessTreeProps {
  activeNavigationId: OrganizationWorkspaceNavigationId | undefined
  navigationIds: OrganizationWorkspaceNavigationId[]
  items: readonly OrganizationWorkspaceNavigationItem[]
  onActiveChange: (navigationId: OrganizationWorkspaceNavigationId) => void
  onToggle: (navigationId: OrganizationWorkspaceNavigationId) => void
}

function getWorkspaceLabel(workspace: OrganizationWorkspace): string {
  return workspace === 'manager'
    ? 'Panel de administración y gestión'
    : 'Espacio de empleado'
}

function NavigationAccessTree({
  activeNavigationId,
  navigationIds,
  items,
  onActiveChange,
  onToggle,
}: NavigationAccessTreeProps) {
  return (
    <ul className="space-y-2">
      {items.map((item) => {
        const isActive = item.id === activeNavigationId
        const isSelected = navigationIds.includes(item.id)

        return (
          <li key={item.id}>
            {item.selectable ? (
              <div
                className={
                  isActive
                    ? 'rounded-control outline-2 -outline-offset-1 outline-foreground'
                    : undefined
                }
              >
                <Checkbox
                  id={item.id}
                  checked={isSelected}
                  label={item.label}
                  onChange={() => onToggle(item.id)}
                  onFocus={() => onActiveChange(item.id)}
                />
              </div>
            ) : (
              <button
                type="button"
                className={
                  isActive
                    ? 'flex w-full items-center justify-between rounded-control border border-foreground bg-hover px-3 py-2 text-left outline-none'
                    : 'flex w-full items-center justify-between rounded-control border border-border bg-hover/50 px-3 py-2 text-left outline-none transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-foreground'
                }
                onClick={() => onActiveChange(item.id)}
              >
                <span className="text-sm font-semibold text-foreground">
                  {item.label}
                </span>

                <span className="text-xs text-muted">Grupo</span>
              </button>
            )}

            {item.children && item.children.length > 0 ? (
              <div className="mt-2 ml-4 border-l border-border pl-3">
                <NavigationAccessTree
                  activeNavigationId={activeNavigationId}
                  navigationIds={navigationIds}
                  items={item.children}
                  onActiveChange={onActiveChange}
                  onToggle={onToggle}
                />
              </div>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

export function CreateOrganizationRolePage({
  organizationId,
  organizationName,
  onCancel,
  onCreated,
  onCreate,
}: CreateOrganizationRolePageProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [workspace, setWorkspace] = useState<OrganizationWorkspace>('employee')

  const [navigationIds, setNavigationIds] = useState<
    OrganizationWorkspaceNavigationId[]
  >([])

  const [activeNavigationId, setActiveNavigationId] = useState<
    OrganizationWorkspaceNavigationId | undefined
  >(() => getSelectableOrganizationWorkspaceNavigationItems('employee')[0]?.id)

  const [formError, setFormError] = useState<string>()

  const activeNavigationItem = getOrganizationWorkspaceNavigationItems(
    workspace,
  ).find((item) => item.id === activeNavigationId)

  const changeWorkspace = (nextWorkspace: OrganizationWorkspace) => {
    setWorkspace(nextWorkspace)
    setNavigationIds([])
    setActiveNavigationId(
      getSelectableOrganizationWorkspaceNavigationItems(nextWorkspace)[0]?.id,
    )
    setFormError(undefined)
  }

  const toggleNavigation = (
    navigationId: OrganizationWorkspaceNavigationId,
  ) => {
    setNavigationIds((currentIds) =>
      currentIds.includes(navigationId)
        ? currentIds.filter((item) => item !== navigationId)
        : [...currentIds, navigationId],
    )

    setActiveNavigationId(navigationId)
    setFormError(undefined)
  }

  const handleSubmit = () => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      setFormError('Ingresa un nombre para el rol.')
      return
    }

    if (navigationIds.length === 0) {
      setFormError('Selecciona al menos un acceso para el rol.')
      return
    }

    try {
      const role = onCreate({
        organizationId,
        name: trimmedName,
        description: description.trim(),
        workspace,
        navigationIds,
      })

      if (role === null) {
        setFormError(
          'No fue posible crear el rol. Puede que ya exista uno con ese nombre.',
        )
        return
      }

      onCreated()
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-6 sm:p-8">
      <header className="border-b border-border pb-6">
        <p className="text-sm font-medium text-muted">Equipo</p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          Crear rol personalizado
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Define el espacio de trabajo y los accesos disponibles para este rol
          en {organizationName}.
        </p>
      </header>

      <form
        className="mt-8 space-y-8"
        onSubmit={(event) => {
          event.preventDefault()
          handleSubmit()
        }}
      >
        <section className="rounded-popover border border-border bg-surface p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Información del rol
          </h2>

          <div className="mt-5 grid gap-4">
            <Input
              id="custom-role-name"
              label="Nombre del rol"
              description="Por ejemplo: Técnico supervisor, Soporte N1 o Ventas."
              value={name}
              maxLength={64}
              required
              onChange={(event) => {
                setName(event.target.value)
                setFormError(undefined)
              }}
            />

            <Input
              id="custom-role-description"
              label="Descripción"
              description="Opcional. Máximo 160 caracteres."
              value={description}
              maxLength={160}
              onChange={(event) => {
                setDescription(event.target.value)
                setFormError(undefined)
              }}
            />
          </div>
        </section>

        <section className="rounded-popover border border-border bg-surface p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Tipo de espacio de trabajo
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted">
            Un rol pertenece a un solo espacio. No se combinan módulos de
            empleado con módulos de administración.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant={workspace === 'employee' ? 'primary' : 'secondary'}
              className="h-auto justify-start px-4 py-4 text-left"
              aria-pressed={workspace === 'employee'}
              onClick={() => changeWorkspace('employee')}
            >
              <span>
                <span className="block font-medium">Espacio de empleado</span>

                <span className="mt-1 block text-xs leading-5 opacity-75">
                  Clientes, soporte, red e inventario para el trabajo operativo.
                </span>
              </span>
            </Button>

            <Button
              type="button"
              variant={workspace === 'manager' ? 'primary' : 'secondary'}
              className="h-auto justify-start px-4 py-4 text-left"
              aria-pressed={workspace === 'manager'}
              onClick={() => changeWorkspace('manager')}
            >
              <span>
                <span className="block font-medium">
                  Administración y gestión
                </span>

                <span className="mt-1 block text-xs leading-5 opacity-75">
                  Clientes, facturación, equipo, operación y análisis de la
                  empresa.
                </span>
              </span>
            </Button>
          </div>
        </section>

        <section className="rounded-popover border border-border bg-surface p-5 sm:p-6">
          <div className="flex flex-col gap-2 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Accesos del rol
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted">
                Selecciona las pantallas que aparecerán en{' '}
                {getWorkspaceLabel(workspace)}.
              </p>
            </div>

            <p className="text-sm text-muted">
              {navigationIds.length} acceso
              {navigationIds.length === 1 ? '' : 's'} seleccionado
              {navigationIds.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {organizationWorkspaceNavigation[workspace].map((group) => (
                  <section key={group.label}>
                    <h3 className="mb-3 text-xs font-semibold tracking-wide text-muted uppercase">
                      {group.label}
                    </h3>

                    <NavigationAccessTree
                      activeNavigationId={activeNavigationId}
                      navigationIds={navigationIds}
                      items={group.items}
                      onActiveChange={setActiveNavigationId}
                      onToggle={toggleNavigation}
                    />
                  </section>
                ))}
              </div>
            </div>

            <aside className="h-fit rounded-popover border border-border bg-hover/50 p-5">
              {activeNavigationItem ? (
                <>
                  <p className="text-xs font-medium tracking-wide text-muted uppercase">
                    Acceso seleccionado
                  </p>

                  <h3 className="mt-2 text-base font-semibold text-foreground">
                    {activeNavigationItem.label}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted">
                    {activeNavigationItem.description}
                  </p>

                  <dl className="mt-5 space-y-3 border-t border-border pt-4">
                    <div>
                      <dt className="text-xs text-muted">Espacio</dt>

                      <dd className="mt-1 text-sm font-medium text-foreground">
                        {getWorkspaceLabel(workspace)}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs text-muted">Estado</dt>

                      <dd className="mt-1 text-sm font-medium text-foreground">
                        {activeNavigationItem.selectable
                          ? navigationIds.includes(activeNavigationItem.id)
                            ? 'Incluido en el rol'
                            : 'Disponible para asignar'
                          : 'Grupo de navegación'}
                      </dd>
                    </div>
                  </dl>
                </>
              ) : (
                <p className="text-sm leading-6 text-muted">
                  Selecciona un acceso del árbol para ver su descripción.
                </p>
              )}
            </aside>
          </div>
        </section>

        <footer className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-h-5 text-sm text-danger" aria-live="polite">
            {formError}
          </p>

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>

            <Button type="submit">Crear rol</Button>
          </div>
        </footer>
      </form>
    </div>
  )
}
