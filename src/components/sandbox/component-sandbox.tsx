import { useState } from 'react'
import { BellIcon, GearIcon, PlusIcon } from '@/components/icons'
import { ThemeSelector } from '@/components/theme-selector'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import { OtpInput } from '@/components/ui/otp-input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip } from '@/components/ui/tooltip'
import { useDemoAccount } from '@/providers/demo-account-context'

interface SandboxSectionProps {
  title: string
  description: string
  children: React.ReactNode
}

function SandboxSection({ children, description, title }: SandboxSectionProps) {
  return (
    <section className="rounded-popover border border-border bg-surface p-5">
      <div className="mb-5 border-b border-border pb-4">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>

        <p className="mt-1 text-xs text-muted">{description}</p>
      </div>

      {children}
    </section>
  )
}

export function ComponentSandbox() {
  const [otpValue, setOtpValue] = useState('')
  const [tab, setTab] = useState<'account' | 'organization'>('account')
  const { clearDemoWorkspaceData, resetDemoState, scenario, selectScenario } =
    useDemoAccount()
  const [isClearConfirmationVisible, setIsClearConfirmationVisible] =
    useState(false)

  return (
    <main className="min-h-svh bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-medium text-muted">
            WispZyron · Desarrollo interno
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Sandbox de componentes
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Biblioteca visual interna para revisar componentes, estados,
            accesibilidad y comportamiento antes de usarlos en los módulos.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          <SandboxSection
            title="Botones"
            description="Variantes, tamaños y estados de carga."
          >
            <div className="flex flex-wrap items-center gap-2">
              <Button>Principal</Button>
              <Button variant="secondary">Secundario</Button>
              <Button variant="ghost">Fantasma</Button>
              <Button variant="danger">Peligro</Button>
              <Button disabled>No disponible</Button>
              <Button loading>Cargando</Button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button size="sm">Pequeño</Button>
              <Button size="md">Mediano</Button>
              <Button size="lg">Grande</Button>
            </div>
          </SandboxSection>

          <SandboxSection
            title="Botones de icono"
            description="Acciones compactas con etiqueta accesible."
          >
            <div className="flex items-center gap-2">
              <Tooltip content="Crear elemento">
                <IconButton aria-label="Crear elemento" variant="secondary">
                  <PlusIcon className="size-4" aria-hidden="true" />
                </IconButton>
              </Tooltip>

              <Tooltip content="Ver notificaciones">
                <IconButton aria-label="Ver notificaciones">
                  <BellIcon className="size-4" aria-hidden="true" />
                </IconButton>
              </Tooltip>

              <Tooltip content="Abrir configuración">
                <IconButton aria-label="Abrir configuración">
                  <GearIcon className="size-4" aria-hidden="true" />
                </IconButton>
              </Tooltip>

              <IconButton aria-label="Acción en progreso" loading>
                <BellIcon className="size-4" aria-hidden="true" />
              </IconButton>
            </div>
          </SandboxSection>

          <SandboxSection
            title="Badges"
            description="Estados, roles, etiquetas y variantes de producto."
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="beta">Beta</Badge>
              <Badge variant="success" dot>
                Activo
              </Badge>
            </div>
          </SandboxSection>
          <SandboxSection
            title="Escenarios de cuenta"
            description="Estados temporales para revisar Organizations, invitaciones y roles."
          >
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={scenario === 'established' ? 'primary' : 'secondary'}
                onClick={() => selectScenario('established')}
              >
                Cuenta con organizaciones
              </Button>

              <Button
                variant={scenario === 'new-account' ? 'primary' : 'secondary'}
                onClick={() => selectScenario('new-account')}
              >
                Cuenta nueva
              </Button>
              <Button
                variant={
                  scenario === 'invited-account' ? 'primary' : 'secondary'
                }
                onClick={() => selectScenario('invited-account')}
              >
                Cuenta invitada
              </Button>
              <Button variant="ghost" onClick={resetDemoState}>
                Restablecer escenario
              </Button>
            </div>

            <p className="mt-4 text-xs leading-5 text-muted">
              La cuenta con organizaciones tiene un panel Manager, un empleo y
              una invitación pendiente. La cuenta nueva no tiene organizaciones
              ni notificaciones. La cuenta invitada aún no tiene empleos, pero
              recibió una invitación pendiente.
            </p>

            <div className="mt-4 border-t border-border pt-4">
              {isClearConfirmationVisible ? (
                <div
                  role="alert"
                  className="rounded-control border border-danger/30 bg-danger/10 p-3"
                >
                  <p className="text-sm font-medium text-foreground">
                    ¿Restablecer todos los datos demo?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted">
                    Se eliminarán organizaciones creadas, invitaciones,
                    memberships, roles personalizados y sesiones demo guardadas
                    en este navegador.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        clearDemoWorkspaceData()
                        setIsClearConfirmationVisible(false)
                      }}
                    >
                      Sí, restablecer demo
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsClearConfirmationVisible(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setIsClearConfirmationVisible(true)}
                >
                  Restablecer datos demo persistentes
                </Button>
              )}
            </div>
          </SandboxSection>
          <SandboxSection
            title="Tema"
            description="La selección usa las variables globales de la aplicación."
          >
            <ThemeSelector ariaLabel="Seleccionar tema en el sandbox" />
          </SandboxSection>

          <SandboxSection
            title="Inputs"
            description="Etiquetas, descripción, error y estado de foco."
          >
            <div className="grid gap-4">
              <Input
                label="Correo electrónico"
                type="email"
                inputMode="email"
                placeholder="usuario@empresa.com"
                description="Usa el correo con el que accederás a WispZyron."
              />

              <Input
                label="Nombre de organización"
                placeholder="NovaSpeed Telecom"
                error="Este nombre ya está en uso."
              />
            </div>
          </SandboxSection>

          <SandboxSection
            title="Código OTP"
            description="Entrada numérica, pegado completo y navegación por teclado."
          >
            <OtpInput value={otpValue} onValueChange={setOtpValue} />

            <p className="mt-4 text-xs text-muted">
              Valor actual: {otpValue || 'Sin código'}
            </p>
          </SandboxSection>

          <SandboxSection
            title="Tabs"
            description="Navegación con teclado mediante flechas izquierda y derecha."
          >
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList aria-label="Ejemplo de tabs">
                <TabsTrigger value="account">Cuenta</TabsTrigger>
                <TabsTrigger value="organization">Organización</TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="pt-4">
                <p className="text-sm text-muted">
                  Preferencias y datos personales de la cuenta.
                </p>
              </TabsContent>

              <TabsContent value="organization" className="pt-4">
                <p className="text-sm text-muted">
                  Configuración disponible para la organización seleccionada.
                </p>
              </TabsContent>
            </Tabs>
          </SandboxSection>

          <SandboxSection
            title="Popover"
            description="Contenido contextual, cierre con Escape y clic externo."
          >
            <Popover>
              <PopoverTrigger className="inline-flex h-8 items-center rounded-control border border-border bg-surface px-3 text-sm text-foreground transition-colors hover:bg-hover">
                Abrir ejemplo
              </PopoverTrigger>

              <PopoverContent className="p-4">
                <p className="text-sm font-medium text-foreground">
                  Información contextual
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  Este componente servirá para menús, filtros y acciones
                  secundarias.
                </p>
              </PopoverContent>
            </Popover>
          </SandboxSection>
        </div>
      </div>
    </main>
  )
}
