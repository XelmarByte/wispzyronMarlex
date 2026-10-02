import { useState, type SubmitEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import type { DemoInvitation, MembershipRole } from '@/data/demo-account'
import type { CustomOrganizationRole } from '@/data/custom-organization-roles'
import { getSystemOrganizationRoleLabel } from '@/data/organization-roles'
import type { CreateDemoInvitationInput } from '@/providers/demo-account-context'

interface InviteEmployeePageProps {
  canManageRoles: boolean
  customRoles: CustomOrganizationRole[]
  inviterName: string
  onCreateInvitation: (
    input: CreateDemoInvitationInput,
  ) => DemoInvitation | null
  organizationId: string
  organizationName: string
}

type InvitationRoleSelection =
  `system:${Exclude<MembershipRole, 'owner'>}` | `custom:${string}`

function isInvitationRole(
  value: string,
): value is Exclude<MembershipRole, 'owner'> {
  return (
    value === 'employee' || value === 'manager' || value === 'administrator'
  )
}

function getInvitationRoleInput(
  selection: InvitationRoleSelection,
  customRoles: CustomOrganizationRole[],
): Pick<CreateDemoInvitationInput, 'customRoleId' | 'role'> | null {
  if (selection.startsWith('system:')) {
    const role = selection.slice('system:'.length)

    if (!isInvitationRole(role)) {
      return null
    }

    return {
      role,
      customRoleId: null,
    }
  }

  const customRoleId = selection.slice('custom:'.length)

  const customRole = customRoles.find((role) => role.id === customRoleId)

  if (customRole === undefined) {
    return null
  }

  return {
    role: customRole.workspace === 'employee' ? 'employee' : 'manager',
    customRoleId: customRole.id,
  }
}

function getInvitationRoleLabel(
  invitation: DemoInvitation,
  customRoles: CustomOrganizationRole[],
): string {
  if (invitation.customRoleId) {
    const customRole = customRoles.find(
      (role) => role.id === invitation.customRoleId,
    )

    return customRole?.name ?? 'Rol personalizado'
  }

  return getSystemOrganizationRoleLabel(invitation.role)
}

export function InviteEmployeePage({
  canManageRoles,
  customRoles,
  inviterName,
  onCreateInvitation,
  organizationId,
  organizationName,
}: InviteEmployeePageProps) {
  const [email, setEmail] = useState('')
  const [roleSelection, setRoleSelection] =
    useState<InvitationRoleSelection>('system:employee')
  const [formError, setFormError] = useState<string>()
  const [createdInvitation, setCreatedInvitation] = useState<DemoInvitation>()
  const [copyMessage, setCopyMessage] = useState<string>()

  const availableCustomRoles = canManageRoles ? customRoles : []

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const recipientEmail = email.trim().toLowerCase()

    if (!recipientEmail) {
      setFormError('Ingresa el correo de la persona invitada.')
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(recipientEmail)) {
      setFormError('Ingresa un correo electrónico válido.')
      return
    }

    const roleInput = getInvitationRoleInput(
      roleSelection,
      availableCustomRoles,
    )

    if (roleInput === null) {
      setFormError('Selecciona un rol disponible.')
      return
    }

    const invitation = onCreateInvitation({
      organizationId,
      recipientEmail,
      inviterName,
      ...roleInput,
    })

    if (invitation === null) {
      setFormError(
        'No pudimos crear la invitación. Revisa el rol seleccionado o si ya existe una invitación pendiente.',
      )
      return
    }

    setEmail('')
    setRoleSelection('system:employee')
    setFormError(undefined)
    setCopyMessage(undefined)
    setCreatedInvitation(invitation)
  }

  const handleCopyToken = async () => {
    if (!createdInvitation) {
      return
    }

    try {
      await navigator.clipboard.writeText(createdInvitation.token)
      setCopyMessage('Código copiado.')
    } catch {
      setCopyMessage('No se pudo copiar el código. Cópialo manualmente.')
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-6 sm:p-8">
      <header>
        <p className="text-sm font-medium text-muted">Equipo</p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          Invitar a una persona
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Envía una invitación para que una persona se una a {organizationName}.
        </p>
      </header>

      <form
        className="mt-8 rounded-popover border border-border bg-surface p-5 sm:p-6"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-5">
          <Input
            id="employee-invitation-email"
            label="Correo electrónico"
            description="La invitación estará vinculada a este correo."
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="persona@empresa.com"
            value={email}
            error={formError}
            onChange={(event) => {
              setEmail(event.target.value)
              setFormError(undefined)
            }}
          />

          <Select
            id="employee-invitation-role"
            label="Rol inicial"
            description={
              canManageRoles
                ? 'Puedes elegir un rol del sistema o una plantilla personalizada.'
                : 'Solo puedes invitar personas con el rol operativo de empleado.'
            }
            value={roleSelection}
            onChange={(event) => {
              setRoleSelection(event.target.value as InvitationRoleSelection)
              setFormError(undefined)
            }}
          >
            <optgroup label="Roles del sistema">
              <option value="system:employee">Empleado</option>

              {canManageRoles ? (
                <>
                  <option value="system:manager">Gerente</option>
                  <option value="system:administrator">Administrador</option>
                </>
              ) : null}
            </optgroup>

            {availableCustomRoles.length > 0 ? (
              <optgroup label="Plantillas personalizadas">
                {availableCustomRoles.map((role) => (
                  <option key={role.id} value={`custom:${role.id}`}>
                    {role.name}
                  </option>
                ))}
              </optgroup>
            ) : null}
          </Select>
        </div>

        <footer className="mt-6 flex justify-end border-t border-border pt-5">
          <Button type="submit">Crear invitación</Button>
        </footer>
      </form>

      {createdInvitation ? (
        <section className="mt-6 rounded-popover border border-border bg-surface p-5 sm:p-6">
          <p className="text-sm font-medium text-foreground">
            Invitación creada
          </p>

          <p className="mt-2 text-sm leading-6 text-muted">
            {createdInvitation.recipientEmail} fue invitado como{' '}
            <span className="font-medium text-foreground">
              {getInvitationRoleLabel(createdInvitation, customRoles)}
            </span>
            .
          </p>

          <div className="mt-5 rounded-control border border-border bg-hover p-3">
            <p className="text-xs font-medium text-muted">
              Código temporal de demostración
            </p>

            <code className="mt-2 block break-all font-mono text-sm font-semibold tracking-wider text-foreground">
              {createdInvitation.token}
            </code>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => void handleCopyToken()}
            >
              Copiar código
            </Button>

            <p className="text-xs text-muted" aria-live="polite">
              {copyMessage ??
                'La persona podrá ingresar este código desde “Unirse a una organización”.'}
            </p>
          </div>
        </section>
      ) : null}
    </div>
  )
}
