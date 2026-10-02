import {
  useEffect,
  useId,
  useRef,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react'
import { cn } from '@/lib/utils'

interface OtpInputProps {
  value: string
  onValueChange: (value: string) => void
  length?: number
  disabled?: boolean
  error?: string
  ariaLabel?: string
  autoFocus?: boolean
  className?: string
}

export function OtpInput({
  value,
  onValueChange,
  length = 6,
  disabled = false,
  error,
  ariaLabel = 'Código de verificación',
  autoFocus = true,
  className,
}: OtpInputProps) {
  const errorId = useId()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const hasAutoFocused = useRef(false)
  const hasError = error !== undefined

  const digits = Array.from({ length }, (_, index) => value[index] ?? '')

  useEffect(() => {
    if (!autoFocus || disabled || hasAutoFocused.current) return

    inputRefs.current[0]?.focus()
    hasAutoFocused.current = true
  }, [autoFocus, disabled])

  useEffect(() => {
    if (!hasError || disabled) return

    const focusIndex = Math.min(value.length, length - 1)
    inputRefs.current[focusIndex]?.focus()
  }, [disabled, hasError, length, value])

  const insertDigits = (index: number, rawValue: string) => {
    const newDigits = rawValue.replace(/\D/g, '').slice(0, length - index)

    if (newDigits.length === 0) return

    const nextValue = `${value.slice(0, index)}${newDigits}${value.slice(
      index + newDigits.length,
    )}`.slice(0, length)

    onValueChange(nextValue)

    const nextIndex = Math.min(index + newDigits.length, length - 1)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const nextDigit = event.target.value

    if (nextDigit.length === 0) {
      onValueChange(`${value.slice(0, index)}${value.slice(index + 1)}`)
      return
    }

    insertDigits(index, nextDigit)
  }

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Backspace') {
      event.preventDefault()

      if (digits[index]) {
        onValueChange(`${value.slice(0, index)}${value.slice(index + 1)}`)
        return
      }

      if (index > 0) {
        onValueChange(`${value.slice(0, index - 1)}${value.slice(index)}`)
        inputRefs.current[index - 1]?.focus()
      }

      return
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      inputRefs.current[index - 1]?.focus()
    }

    if (event.key === 'ArrowRight' && index < length - 1) {
      event.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (
    index: number,
    event: ClipboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault()
    insertDigits(index, event.clipboardData.getData('text'))
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <div
        role="group"
        aria-label={ariaLabel}
        aria-describedby={hasError ? errorId : undefined}
        aria-invalid={hasError || undefined}
        className="flex justify-center gap-3"
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            tabIndex={index === 0 ? 0 : -1}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint={index === length - 1 ? 'done' : 'next'}
            maxLength={index === 0 ? length : 1}
            value={digit}
            disabled={disabled}
            aria-label={`${ariaLabel}: dígito ${index + 1} de ${length}`}
            aria-invalid={hasError || undefined}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            onFocus={(event) => event.currentTarget.select()}
            className="size-12 rounded-control border border-border bg-input text-center text-xl font-medium text-foreground outline-none transition-[border-color,opacity] duration-150 focus:border-foreground focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:focus:border-danger aria-invalid:focus-visible:outline-danger"
          />
        ))}
      </div>

      {hasError ? (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-danger text-center"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}
