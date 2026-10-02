import { useState, type FormEvent } from 'react'
import type {
  DemoOrganizationBranding,
  DemoOrganizationRecord,
  OrganizationFontFamily,
  OrganizationRadius,
} from '@/data/demo-account'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface OrganizationBrandingPageProps {
  organization: DemoOrganizationRecord
  onSave: (branding: DemoOrganizationBranding) => void
}

interface BrandingPreset {
  color: string
  label: string
}

interface RadiusOption {
  description: string
  label: string
  value: OrganizationRadius
}

interface FontFamilyOption {
  description: string
  label: string
  previewClassName: string
  value: OrganizationFontFamily
}

const brandingPresets: BrandingPreset[] = [
  { color: '#202020', label: 'Carbono' },
  { color: '#2563eb', label: 'Azul' },
  { color: '#0891b2', label: 'Cian' },
  { color: '#059669', label: 'Verde' },
  { color: '#7c3aed', label: 'Violeta' },
  { color: '#dc2626', label: 'Rojo' },
]

const radiusOptions: RadiusOption[] = [
  {
    value: 'sharp',
    label: 'Recto',
    description: 'Bordes discretos y casi rectos.',
  },
  {
    value: 'soft',
    label: 'Suave',
    description: 'Equilibrado para una interfaz profesional.',
  },
  {
    value: 'rounded',
    label: 'Redondeado',
    description: 'Bordes más amigables y expresivos.',
  },
]

const fontFamilyOptions: FontFamilyOption[] = [
  {
    value: 'inter',
    label: 'Inter',
    description: 'Moderna y equilibrada para operaciones diarias.',
    previewClassName: 'font-sans',
  },
  {
    value: 'system',
    label: 'Sistema',
    description: 'Rápida, familiar y adaptada al dispositivo.',
    previewClassName: 'font-sans',
  },
  {
    value: 'mono',
    label: 'Monoespaciada',
    description: 'Útil para entornos técnicos y de infraestructura.',
    previewClassName: 'font-mono',
  },
]

export function OrganizationBrandingPage({
  organization,
  onSave,
}: OrganizationBrandingPageProps) {
  const [branding, setBranding] = useState<DemoOrganizationBranding>(
    organization.branding,
  )
  const [isSaved, setIsSaved] = useState(false)

  const updateBranding = (updates: Partial<DemoOrganizationBranding>) => {
    setIsSaved(false)

    setBranding((currentBranding) => ({
      ...currentBranding,
      ...updates,
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    onSave({
      ...branding,
      logoUrl: branding.logoUrl?.trim() ?? null,
    })

    setIsSaved(true)
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-muted-foreground">
          Configuración de empresa
        </p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight">
          Marca y apariencia
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Define una identidad visual inicial para{' '}
          <span className="font-medium text-foreground">
            {organization.name}
          </span>
          .
        </p>
      </header>

      <form
        className="overflow-hidden rounded-popover border border-border bg-surface shadow-overlay"
        onSubmit={handleSubmit}
      >
        <section className="p-6">
          <div className="max-w-xl">
            <h3 className="text-sm font-semibold">Identidad visual</h3>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              El logo se usará progresivamente en selectores, paneles y
              comunicaciones de la organización.
            </p>

            <div className="mt-5 flex items-center gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-control border border-border text-lg font-semibold text-primary-foreground"
                style={{ backgroundColor: branding.primaryColor }}
                aria-label={`Vista previa de ${organization.name}`}
              >
                {branding.logoUrl ? (
                  <img
                    src={branding.logoUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  organization.name.charAt(0).toUpperCase()
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium">{organization.name}</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Vista previa temporal del espacio de trabajo.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="organization-logo-url"
                className="text-sm font-medium"
              >
                URL del logo
              </label>

              <Input
                id="organization-logo-url"
                className="mt-2"
                value={branding.logoUrl ?? ''}
                onChange={(event) =>
                  updateBranding({
                    logoUrl: event.target.value,
                  })
                }
                placeholder="https://empresa.com/logo.svg"
                type="url"
              />

              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                La carga segura de archivos se incorporará posteriormente con
                almacenamiento y backend.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-border p-6">
          <h3 className="text-sm font-semibold">Color principal</h3>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Se aplica a acciones principales e indicadores de la organización.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {brandingPresets.map((preset) => {
              const isSelected = branding.primaryColor === preset.color

              return (
                <button
                  key={preset.color}
                  type="button"
                  onClick={() =>
                    updateBranding({
                      primaryColor: preset.color,
                    })
                  }
                  className={[
                    'flex items-center gap-2 rounded-control border px-3 py-2 text-sm transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                    isSelected
                      ? 'border-foreground bg-hover'
                      : 'border-border bg-surface hover:bg-hover',
                  ].join(' ')}
                  aria-pressed={isSelected}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-black/10"
                    style={{ backgroundColor: preset.color }}
                    aria-hidden="true"
                  />

                  {preset.label}
                </button>
              )
            })}

            <label className="flex h-9 cursor-pointer items-center gap-2 rounded-control border border-border px-3 text-sm hover:bg-hover">
              <span
                className="h-4 w-4 rounded-full border border-black/10"
                style={{ backgroundColor: branding.primaryColor }}
                aria-hidden="true"
              />
              Personalizado
              <input
                type="color"
                value={branding.primaryColor}
                onChange={(event) =>
                  updateBranding({
                    primaryColor: event.target.value,
                  })
                }
                className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
                aria-label="Elegir color personalizado"
              />
            </label>
          </div>
        </section>

        <section className="border-t border-border p-6">
          <h3 className="text-sm font-semibold">Tipografía</h3>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Define la fuente base visible dentro del espacio de trabajo.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {fontFamilyOptions.map((option) => {
              const isSelected = branding.fontFamily === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    updateBranding({
                      fontFamily: option.value,
                    })
                  }
                  className={[
                    'rounded-popover border p-4 text-left transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                    isSelected
                      ? 'border-foreground bg-hover'
                      : 'border-border hover:bg-hover',
                  ].join(' ')}
                  aria-pressed={isSelected}
                >
                  <p
                    className={`text-base font-medium ${option.previewClassName}`}
                  >
                    Aa WispZyron
                  </p>

                  <p className="mt-3 text-sm font-medium">{option.label}</p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {option.description}
                  </p>
                </button>
              )
            })}
          </div>
        </section>

        <section className="border-t border-border p-6">
          <h3 className="text-sm font-semibold">Estilo de bordes</h3>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Define el nivel de redondeo para controles y superficies.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {radiusOptions.map((option) => {
              const isSelected = branding.radius === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    updateBranding({
                      radius: option.value,
                    })
                  }
                  className={[
                    'rounded-popover border p-4 text-left transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                    isSelected
                      ? 'border-foreground bg-hover'
                      : 'border-border hover:bg-hover',
                  ].join(' ')}
                  aria-pressed={isSelected}
                >
                  <div
                    className={[
                      'mb-4 h-8 w-full border border-foreground/30 bg-surface',
                      option.value === 'sharp'
                        ? 'rounded-none'
                        : option.value === 'soft'
                          ? 'rounded-[0.375rem]'
                          : 'rounded-[0.75rem]',
                    ].join(' ')}
                    aria-hidden="true"
                  />

                  <p className="text-sm font-medium">{option.label}</p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {option.description}
                  </p>
                </button>
              )
            })}
          </div>
        </section>

        <footer className="flex items-center justify-between border-t border-border bg-background/40 px-6 py-4">
          <p
            className="text-xs text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            {isSaved
              ? 'Cambios guardados temporalmente en esta demo.'
              : 'Los cambios se aplicarán a esta organización.'}
          </p>

          <Button type="submit">Guardar cambios</Button>
        </footer>
      </form>
    </div>
  )
}
