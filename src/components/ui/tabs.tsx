import {
  createContext,
  useContext,
  useId,
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

interface TabsContextValue {
  id: string
  onValueChange: (value: string) => void
  value: string
}

interface TabsProps<T extends string> extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode
  onValueChange: (value: T) => void
  value: T
}

interface TabsListProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode
}

interface TabsTriggerProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'type'
> {
  value: string
}

interface TabsContentProps extends ComponentPropsWithoutRef<'div'> {
  value: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = useContext(TabsContext)

  if (context === null) {
    throw new Error('TabsTrigger y TabsContent deben estar dentro de Tabs.')
  }

  return context
}

export function Tabs<T extends string>({
  children,
  className,
  onValueChange,
  value,
  ...props
}: TabsProps<T>) {
  const id = useId()

  const handleValueChange = (nextValue: string) => {
    onValueChange(nextValue as T)
  }

  return (
    <TabsContext.Provider
      value={{
        id,
        onValueChange: handleValueChange,
        value,
      }}
    >
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className, ...props }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center rounded-control border border-border bg-hover p-0.5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({
  children,
  className,
  disabled,
  onClick,
  onKeyDown,
  ref,
  value,
  ...props
}: TabsTriggerProps) {
  const { id, onValueChange, value: selectedValue } = useTabsContext()

  const isActive = value === selectedValue

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event)

    if (event.defaultPrevented) {
      return
    }

    const tabList = event.currentTarget.closest<HTMLElement>('[role="tablist"]')

    if (tabList === null) {
      return
    }

    const tabs = [
      ...tabList.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not(:disabled)',
      ),
    ]

    const currentIndex = tabs.indexOf(event.currentTarget)

    if (currentIndex === -1) {
      return
    }

    let nextIndex = currentIndex

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length
    }

    if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    }

    if (event.key === 'Home') {
      nextIndex = 0
    }

    if (event.key === 'End') {
      nextIndex = tabs.length - 1
    }

    if (nextIndex === currentIndex) {
      return
    }

    event.preventDefault()

    const nextTab = tabs[nextIndex]

    if (nextTab !== undefined) {
      nextTab.focus()
      onValueChange(nextTab.dataset.value ?? '')
    }
  }

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={`${id}-tab-${value}`}
      aria-controls={`${id}-panel-${value}`}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      data-value={value}
      data-state={isActive ? 'active' : 'inactive'}
      className={cn(
        'inline-flex h-6 items-center justify-center rounded-control px-2 text-xs font-medium transition-[background-color,color,box-shadow] data-disabled:pointer-events-none data-disabled:opacity-50',
        isActive
          ? 'bg-surface text-foreground shadow-sm'
          : 'text-muted hover:text-foreground',
        className,
      )}
      onClick={(event) => {
        onClick?.(event)

        if (!event.defaultPrevented) {
          onValueChange(value)
        }
      }}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </button>
  )
}

export function TabsContent({
  children,
  className,
  value,
  ...props
}: TabsContentProps) {
  const { id, value: selectedValue } = useTabsContext()

  const isActive = value === selectedValue

  return (
    <div
      role="tabpanel"
      id={`${id}-panel-${value}`}
      aria-labelledby={`${id}-tab-${value}`}
      hidden={!isActive}
      className={className}
      {...props}
    >
      {children}
    </div>
  )
}
