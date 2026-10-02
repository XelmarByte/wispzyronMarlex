import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  CommandPalette,
  type WorkspaceArea,
} from '@/components/command-palette'
import { MagnifyingGlassIcon } from '@/components/icons'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/react'

interface DashboardTopbarProps {
  actions: ReactNode
  isCommandPaletteOpen: boolean
  onOpenCommandPalette: () => void
  onCommandPaletteOpenChange: (isOpen: boolean) => void
  orgSlug: string
  userName: string
  workspace?: WorkspaceArea
}

export function DashboardTopbar({
  actions,
  isCommandPaletteOpen,
  onOpenCommandPalette,
  onCommandPaletteOpenChange,
  orgSlug,
  userName,
  workspace = 'employee',
}: DashboardTopbarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')

  const { isLoaded, user } = useUser()

  const clerkEmail = user?.primaryEmailAddress?.emailAddress

  const displayName =
    isLoaded && user
      ? (user.fullName ??
        user.firstName ??
        clerkEmail?.split('@')[0] ??
        userName)
      : userName

  useEffect(() => {
    if (isCommandPaletteOpen) {
      inputRef.current?.focus()
    }
  }, [isCommandPaletteOpen])

  const openSearch = () => {
    onOpenCommandPalette()
    inputRef.current?.focus()
  }

  return (
    <header className="flex min-h-14 items-center justify-between gap-3 border-b border-border bg-surface px-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="hidden min-w-36 sm:block">
          <p className="truncate text-sm font-medium text-foreground">
            Hey, {displayName}
          </p>

          <p className="truncate text-xs text-muted">Bienvenido de nuevo</p>
        </div>

        <div
          ref={searchContainerRef}
          className="relative min-w-0 flex-1 sm:max-w-72"
        >
          <div
            className={cn(
              'flex h-8 w-full min-w-0 items-center gap-2 rounded-control border border-border bg-input px-2.5 text-muted transition-colors',
              query === '' && 'focus-within:border-foreground',
            )}
            onClick={openSearch}
          >
            <MagnifyingGlassIcon
              className="size-4 shrink-0"
              aria-hidden="true"
            />

            <label htmlFor="dashboard-search" className="sr-only">
              Buscar en WispZyron
            </label>

            <input
              ref={inputRef}
              id="dashboard-search"
              type="search"
              value={query}
              placeholder="Buscar"
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted focus-visible:!outline-none"
              aria-controls="command-palette"
              aria-expanded={isCommandPaletteOpen}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              onFocus={onOpenCommandPalette}
              onChange={(event) => {
                setQuery(event.target.value)
                onOpenCommandPalette()
              }}
            />

            <span className="ml-auto hidden items-center gap-1 md:flex">
              <kbd className="rounded border border-border bg-surface px-1 py-0.5 text-[10px] leading-none text-muted">
                Ctrl
              </kbd>

              <kbd className="rounded border border-border bg-surface px-1 py-0.5 text-[10px] leading-none text-muted">
                K
              </kbd>
            </span>
          </div>

          <CommandPalette
            containerRef={searchContainerRef}
            open={isCommandPaletteOpen}
            orgSlug={orgSlug}
            query={query}
            workspace={workspace}
            onOpenChange={onCommandPaletteOpenChange}
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">{actions}</div>
    </header>
  )
}
