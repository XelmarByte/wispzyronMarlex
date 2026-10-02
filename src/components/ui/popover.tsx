import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

type PopoverAlign = 'start' | 'center' | 'end'

interface PopoverContextValue {
  contentId: string
  isOpen: boolean
  setIsOpen: (nextOpen: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

interface PopoverProps {
  children: ReactNode
  className?: string
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type PopoverTriggerProps = ComponentPropsWithoutRef<'button'>

type PopoverContentProps = ComponentPropsWithoutRef<'div'> & {
  align?: PopoverAlign
  autoFocus?: boolean
  sideOffset?: number
}

const PopoverContext = createContext<PopoverContextValue | null>(null)

const alignClasses: Record<PopoverAlign, string> = {
  start: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
}

function usePopoverContext() {
  const context = useContext(PopoverContext)

  if (context === null) {
    throw new Error(
      'PopoverTrigger y PopoverContent deben estar dentro de Popover.',
    )
  }

  return context
}

export function Popover({
  children,
  className,
  defaultOpen = false,
  onOpenChange,
  open,
}: PopoverProps) {
  const contentId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)

  const isOpen = open ?? uncontrolledOpen

  const setIsOpen = useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) {
        setUncontrolledOpen(nextOpen)
      }

      onOpenChange?.(nextOpen)
    },
    [onOpenChange, open],
  )

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      event.preventDefault()
      setIsOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, setIsOpen])

  return (
    <PopoverContext.Provider
      value={{
        contentId,
        isOpen,
        setIsOpen,
        triggerRef,
      }}
    >
      <div ref={rootRef} className={cn('relative inline-flex', className)}>
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

export function PopoverTrigger({
  children,
  onClick,
  type = 'button',
  ...props
}: PopoverTriggerProps) {
  const { contentId, isOpen, setIsOpen, triggerRef } = usePopoverContext()

  return (
    <button
      ref={triggerRef}
      {...props}
      type={type}
      aria-controls={contentId}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      data-state={isOpen ? 'open' : 'closed'}
      onClick={(event) => {
        onClick?.(event)

        if (!event.defaultPrevented) {
          setIsOpen(!isOpen)
        }
      }}
    >
      {children}
    </button>
  )
}

export function PopoverContent({
  align = 'start',
  autoFocus = true,
  children,
  className,
  sideOffset = 8,
  style,
  ...props
}: PopoverContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const { contentId, isOpen } = usePopoverContext()

  useEffect(() => {
    if (!isOpen || !autoFocus) return

    const firstFocusableElement =
      contentRef.current?.querySelector<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )

    firstFocusableElement?.focus()
  }, [autoFocus, isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={contentRef}
      {...props}
      id={contentId}
      role="dialog"
      aria-modal="false"
      tabIndex={-1}
      className={cn(
        'absolute top-full z-50 w-72 rounded-popover border border-border bg-surface text-foreground shadow-overlay outline-none',
        alignClasses[align],
        className,
      )}
      style={{
        marginTop: sideOffset,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
