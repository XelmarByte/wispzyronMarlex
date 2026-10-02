import { useState, type FormEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import type { DemoOrganizationRecord } from '@/data/demo-account'

interface OrganizationDomainPageProps {
  confirmationEmail: string
  organization: DemoOrganizationRecord
  onConfirmChange: () => void
  onRequestChange: (domain: string) => void
}

function normalizeDomain(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
}

function isValidDomain(domain: string): boolean {
  return /^(?!-)(?:[a-z0-9-]{1,63}\.)+[a-z]{2,63}$/.test(domain)
}

function formatRequestDate(value: string): string {
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function OrganizationDomainPage({
  confirmationEmail,
  organization,
  onConfirmChange,
  onRequestChange,
}: OrganizationDomainPageProps) {
  const [domainValue, setDomainValue] = useState(
    organization.pendingDomainChange?.domain ?? organization.domain ?? '',
  )
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const normalizedDomain = normalizeDomain(domainValue)
  const isPending = organization.pendingDomainChange?.status === 'pending'
  const hasValidDomain = isValidDomain(normalizedDomain)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setHasSubmitted(true)

    if (!hasValidDomain || isPending) {
      return
    }

    onRequestChange(normalizedDomain)
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-muted-foreground">
          Configuración de empresa
        </p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight">Dominio</h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Administra la dirección corporativa que usarán tus usuarios para
          acceder a los servicios de{' '}
          <span className="font-medium text-foreground">
            {organization.name}
          </span>
          .
        </p>
      </header>

      <section className="rounded-popover border border-border bg-surface p-5 shadow-overlay sm:p-6">
        <h3 className="text-sm font-semibold">Dirección de WispZyron</h3>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Este identificador se crea una sola vez y no puede modificarse desde
          la configuración de la empresa.
        </p>

        <div className="mt-5 flex min-h-9 items-center rounded-control border border-border bg-hover px-3 text-sm text-foreground">
          /{organization.slug}/manager
        </div>
      </section>

      <form
        className="overflow-hidden rounded-popover border border-border bg-surface shadow-overlay"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="organization-email-domain"
          className="text-sm font-medium text-foreground"
        >
          Dominio de correo corporativo
        </label>

        <div
          className={[
            'mt-2 flex h-9 items-center overflow-hidden rounded-control border bg-input transition-colors',
            hasSubmitted && !hasValidDomain
              ? 'border-danger'
              : 'border-border focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30',
          ].join(' ')}
        >
          <span
            className="flex h-full items-center border-r border-border bg-hover px-3 text-sm font-medium text-muted-foreground"
            aria-hidden="true"
          >
            @
          </span>

          <input
            id="organization-email-domain"
            type="text"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            autoComplete="off"
            placeholder="empresa.com"
            value={domainValue}
            disabled={isPending}
            aria-invalid={hasSubmitted && !hasValidDomain ? 'true' : undefined}
            aria-describedby="organization-email-domain-help"
            onChange={(event) => {
              setHasSubmitted(false)
              setDomainValue(event.target.value)
            }}
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <p
          id="organization-email-domain-help"
          className="mt-2 text-xs leading-5 text-muted-foreground"
        >
          Los correos que terminen en{' '}
          <span className="font-medium text-foreground">
            @{normalizedDomain || 'empresa.com'}
          </span>{' '}
          podrán usar las políticas corporativas que configures en el futuro.
        </p>

        {hasSubmitted && !hasValidDomain ? (
          <p className="mt-2 text-xs text-danger">
            Ingresa solo el dominio, por ejemplo: empresa.com.
          </p>
        ) : null}

        {isPending && organization.pendingDomainChange ? (
          <section className="border-t border-border bg-warning/5 p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">
                    Confirmación pendiente
                  </h3>

                  <Badge variant="warning">Pendiente</Badge>
                </div>

                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  Solicitaste asociar{' '}
                  <span className="font-medium text-foreground">
                    {organization.pendingDomainChange.domain}
                  </span>
                  . En un entorno real enviaremos un enlace o código de
                  confirmación a{' '}
                  <span className="font-medium text-foreground">
                    {confirmationEmail}
                  </span>
                  .
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  Solicitud creada el{' '}
                  {formatRequestDate(
                    organization.pendingDomainChange.requestedAt,
                  )}
                  .
                </p>
              </div>

              <Button
                type="button"
                onClick={onConfirmChange}
                className="shrink-0"
              >
                Confirmar cambio
              </Button>
            </div>

            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Este botón representa la confirmación desde el correo únicamente
              para la demo. El backend será responsable de generar enlaces
              únicos, temporales y auditables.
            </p>
          </section>
        ) : (
          <footer className="flex items-center justify-between border-t border-border bg-background/40 px-5 py-4 sm:px-6">
            <p className="max-w-md text-xs leading-5 text-muted-foreground">
              El dominio no se aplicará hasta que se confirme mediante el correo
              de un propietario o gerente autorizado.
            </p>

            <Button type="submit" disabled={!hasValidDomain}>
              Solicitar confirmación
            </Button>
          </footer>
        )}
      </form>
    </div>
  )
}
