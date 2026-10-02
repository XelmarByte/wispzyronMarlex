import { useEffect, type CSSProperties, type ReactNode } from 'react'
import type {
  DemoOrganizationBranding,
  OrganizationFontFamily,
} from '@/data/demo-account'

interface OrganizationThemeScopeProps {
  branding: DemoOrganizationBranding
  children: ReactNode
  className?: string
}

interface OrganizationThemeVariables extends CSSProperties {
  '--font': string
  '--primary': string
  '--primary-foreground': string
  '--radius': string
  '--radius-popover': string
}

const fontFamilies: Record<OrganizationFontFamily, string> = {
  inter: 'Inter Variable, sans-serif',
  system:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
}

const radiusValues = {
  sharp: {
    control: '0px',
    popover: '0px',
  },
  soft: {
    control: '7px',
    popover: '10px',
  },
  rounded: {
    control: '12px',
    popover: '16px',
  },
}

function getPrimaryForeground(color: string): string {
  const hex = color.replace('#', '')

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    return '#ffffff'
  }

  const red = Number.parseInt(hex.slice(0, 2), 16)
  const green = Number.parseInt(hex.slice(2, 4), 16)
  const blue = Number.parseInt(hex.slice(4, 6), 16)

  const luminance = (red * 299 + green * 587 + blue * 114) / 1000

  return luminance > 160 ? '#202020' : '#ffffff'
}

export function OrganizationThemeScope({
  branding,
  children,
  className,
}: OrganizationThemeScopeProps) {
  const radius = radiusValues[branding.radius]
  const fontFamily = fontFamilies[branding.fontFamily]
  const primaryForeground = getPrimaryForeground(branding.primaryColor)

  useEffect(() => {
    const root = document.documentElement

    const variables = [
      ['--primary', branding.primaryColor],
      ['--primary-foreground', primaryForeground],
      ['--radius', radius.control],
      ['--radius-popover', radius.popover],
      ['--font', fontFamily],
    ] as const

    const previousVariables = variables.map(([property]) => ({
      property,
      value: root.style.getPropertyValue(property),
      priority: root.style.getPropertyPriority(property),
    }))

    variables.forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })

    return () => {
      previousVariables.forEach(({ property, value, priority }) => {
        if (value) {
          root.style.setProperty(property, value, priority)
          return
        }

        root.style.removeProperty(property)
      })
    }
  }, [
    branding.primaryColor,
    fontFamily,
    primaryForeground,
    radius.control,
    radius.popover,
  ])

  const themeVariables: OrganizationThemeVariables = {
    '--font': fontFamily,
    '--primary': branding.primaryColor,
    '--primary-foreground': primaryForeground,
    '--radius': radius.control,
    '--radius-popover': radius.popover,
    fontFamily,
  }

  return (
    <div className={className} style={themeVariables}>
      {children}
    </div>
  )
}
