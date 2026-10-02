import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
} from 'react'
import { createPortal } from 'react-dom'

type TooltipSide = 'top' | 'right' | 'bottom' | 'left'

interface TooltipTriggerProps {
  'aria-describedby'?: string
}

interface TooltipProps {
  children: ReactElement<TooltipTriggerProps>
  content: string
  side?: TooltipSide
}

interface TooltipPosition {
  left: number
  top: number
  transform: CSSProperties['transform']
}

function getTooltipPosition(rect: DOMRect, side: TooltipSide): TooltipPosition {
  const gap = 8

  if (side === 'right') {
    return {
      left: rect.right + gap,
      top: rect.top + rect.height / 2,
      transform: 'translateY(-50%)',
    }
  }

  if (side === 'bottom') {
    return {
      left: rect.left + rect.width / 2,
      top: rect.bottom + gap,
      transform: 'translateX(-50%)',
    }
  }

  if (side === 'left') {
    return {
      left: rect.left - gap,
      top: rect.top + rect.height / 2,
      transform: 'translate(-100%, -50%)',
    }
  }

  return {
    left: rect.left + rect.width / 2,
    top: rect.top - gap,
    transform: 'translate(-50%, -100%)',
  }
}

export function Tooltip({ children, content, side = 'top' }: TooltipProps) {
  const tooltipId = useId()
  const triggerRef = useRef<HTMLSpanElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<TooltipPosition>()

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current

    if (trigger === null) {
      return
    }

    setPosition(getTooltipPosition(trigger.getBoundingClientRect(), side))
  }, [side])

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition()
    }
  }, [isOpen, updatePosition])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, updatePosition])

  const describedBy = children.props['aria-describedby']
  const describedByValue = describedBy
    ? `${describedBy} ${tooltipId}`
    : tooltipId

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-flex"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocusCapture={() => setIsOpen(true)}
        onBlurCapture={() => setIsOpen(false)}
      >
        {cloneElement(children, {
          'aria-describedby': describedByValue,
        })}
      </span>

      {isOpen && position
        ? createPortal(
            <span
              id={tooltipId}
              role="tooltip"
              className="pointer-events-none fixed z-50 rounded-control bg-foreground px-2 py-1 text-xs text-background shadow-overlay"
              style={position}
            >
              {content}
            </span>,
            document.body,
          )
        : null}
    </>
  )
}
