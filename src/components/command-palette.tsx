import { useNavigate } from '@tanstack/react-router'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  type RefObject,
} from 'react'
import { commandItems, type CommandItem } from '@/data/command-items'
import { cn } from '@/lib/utils'

export type WorkspaceArea = 'employee' | 'manager'

interface CommandPaletteProps {
  containerRef: RefObject<HTMLDivElement | null>
  onOpenChange: (isOpen: boolean) => void
  open: boolean
  orgSlug: string
  query: string
  workspace?: WorkspaceArea
}

export function CommandPalette({
  containerRef,
  onOpenChange,
  open,
  orgSlug,
  query,
  workspace = 'employee',
}: CommandPaletteProps) {
  const navigate = useNavigate()
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()

    if (normalizedQuery === '') {
      return commandItems
    }

    return commandItems.filter((item) => {
      const searchableText = [item.label, item.description, ...item.keywords]
        .join(' ')
        .toLocaleLowerCase()

      return searchableText.includes(normalizedQuery)
    })
  }, [query])

  const recentCommands = filteredCommands.filter(
    (item) => item.group === 'Recientes',
  )

  const quickCommands = filteredCommands.filter(
    (item) => item.group === 'Accesos rápidos',
  )

  const maxIndex = Math.max(filteredCommands.length - 1, 0)
  const selectedIndex = Math.min(activeIndex, maxIndex)

  const navigateTo = useCallback(
    (item: CommandItem) => {
      onOpenChange(false)

      if (workspace === 'manager') {
        if (item.path === '') {
          void navigate({
            to: '/$orgSlug/manager',
            params: { orgSlug },
          })

          return
        }

        void navigate({
          to: '/$orgSlug/manager/$',
          params: {
            orgSlug,
            _splat: item.path.slice(1),
          },
        })

        return
      }

      if (item.path === '') {
        void navigate({
          to: '/$orgSlug/employee',
          params: { orgSlug },
        })

        return
      }

      void navigate({
        to: '/$orgSlug/employee/$',
        params: {
          orgSlug,
          _splat: item.path.slice(1),
        },
      })
    },
    [navigate, onOpenChange, orgSlug, workspace],
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isShortcut =
        (event.ctrlKey || event.metaKey) &&
        event.key.toLocaleLowerCase() === 'k'

      if (isShortcut) {
        event.preventDefault()
        onOpenChange(!open)

        return
      }

      if (!open) {
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        onOpenChange(false)

        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((current) => Math.min(current + 1, maxIndex))

        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((current) => Math.max(current - 1, 0))

        return
      }

      const activeCommand = filteredCommands[selectedIndex]

      if (event.key === 'Enter' && activeCommand !== undefined) {
        event.preventDefault()
        navigateTo(activeCommand)
      }
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        open &&
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        onOpenChange(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('pointerdown', handlePointerDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [
    containerRef,
    filteredCommands,
    maxIndex,
    navigateTo,
    onOpenChange,
    open,
    selectedIndex,
  ])
  useEffect(() => {
    if (!open) {
      return
    }

    resultRefs.current[selectedIndex]?.scrollIntoView({
      block: 'nearest',
    })
  }, [open, selectedIndex])

  const renderCommands = (items: CommandItem[], startIndex: number) =>
    items.map((item, index) => {
      const commandIndex = startIndex + index
      const Icon = item.icon
      const isActive = commandIndex === selectedIndex

      return (
        <button
          ref={(element) => {
            resultRefs.current[commandIndex] = element
          }}
          key={item.id}
          type="button"
          className={cn(
            'flex w-full items-center gap-3 px-3 py-2 text-left transition-colors focus-visible:!outline-none focus-visible:!outline-offset-0',
            isActive ? 'bg-hover' : 'hover:bg-hover',
          )}
          onMouseMove={() => setActiveIndex(commandIndex)}
          onClick={() => navigateTo(item)}
        >
          <Icon className="size-4 shrink-0 text-muted" aria-hidden="true" />

          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm text-foreground">
              {item.label}
            </span>

            <span className="block truncate text-xs text-muted">
              {item.description}
            </span>
          </span>

          <span className="text-sm text-muted" aria-hidden="true">
            →
          </span>
        </button>
      )
    })

  if (!open) {
    return null
  }

  return (
    <section
      id="command-palette"
      role="dialog"
      aria-label="Resultados de búsqueda en WispZyron"
      className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-[min(28rem,calc(100vw-2rem))] overflow-hidden rounded-popover border border-border bg-surface shadow-overlay"
    >
      <div className="max-h-[min(24rem,calc(100dvh-7rem))] overflow-y-auto py-2">
        {recentCommands.length > 0 ? (
          <section>
            <h2 className="px-3 py-1 text-xs font-medium text-muted">
              Recientes
            </h2>

            {renderCommands(recentCommands, 0)}
          </section>
        ) : null}

        {quickCommands.length > 0 ? (
          <section className={recentCommands.length > 0 ? 'mt-2' : ''}>
            <h2 className="px-3 py-1 text-xs font-medium text-muted">
              Accesos rápidos
            </h2>

            {renderCommands(quickCommands, recentCommands.length)}
          </section>
        ) : null}

        {filteredCommands.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-muted">
            No encontramos resultados para “{query}”.
          </p>
        ) : null}
      </div>

      <footer className="flex items-center justify-between border-t border-border px-3 py-2 text-xs text-muted">
        <span>Buscar en WispZyron</span>

        <span className="hidden items-center gap-2 sm:flex">
          <span>↑ ↓ navegar</span>
          <span>↵ abrir</span>
        </span>
      </footer>
    </section>
  )
}
