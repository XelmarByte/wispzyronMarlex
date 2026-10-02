import { DesktopIcon, MoonIcon, SunIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/providers/theme-context'
import { cn } from '@/lib/utils'

interface ThemeSelectorProps {
  ariaLabel?: string
  className?: string
}

export function ThemeSelector({
  ariaLabel = 'Seleccionar tema',
  className,
}: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'flex rounded-control border border-border p-0.5',
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-pressed={theme === 'light'}
        className={cn(
          'h-7 flex-1 gap-1 px-1 text-xs text-muted',
          theme === 'light' &&
            '!border-border !bg-surface !text-foreground shadow-sm hover:!bg-surface',
        )}
        onClick={() => setTheme('light')}
      >
        <SunIcon className="size-3" aria-hidden="true" />
        Claro
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-pressed={theme === 'dark'}
        className={cn(
          'h-7 flex-1 gap-1 px-1 text-xs text-muted',
          theme === 'dark' &&
            '!border-border !bg-surface !text-foreground shadow-sm hover:!bg-surface',
        )}
        onClick={() => setTheme('dark')}
      >
        <MoonIcon className="size-3" aria-hidden="true" />
        Oscuro
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-pressed={theme === 'system'}
        className={cn(
          'h-7 flex-1 gap-1 px-1 text-xs text-muted',
          theme === 'system' &&
            '!border-border !bg-surface !text-foreground shadow-sm hover:!bg-surface',
        )}
        onClick={() => setTheme('system')}
      >
        <DesktopIcon className="size-3" aria-hidden="true" />
        Sistema
      </Button>
    </div>
  )
}
