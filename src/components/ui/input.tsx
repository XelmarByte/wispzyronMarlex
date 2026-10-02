import { useId, type ComponentPropsWithRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type InputSize = 'sm' | 'md' | 'lg'

interface InputProps extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  label?: ReactNode
  description?: ReactNode
  error?: ReactNode
  size?: InputSize
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-7 px-2 text-xs',
  md: 'h-8 px-3 text-sm',
  lg: 'h-9 px-3.5 text-base',
}

export function Input({
  'aria-describedby': ariaDescribedBy,
  'aria-errormessage': ariaErrorMessage,
  'aria-invalid': ariaInvalid,
  className,
  description,
  disabled,
  error,
  id,
  label,
  ref,
  required,
  size = 'md',
  type = 'text',
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId = `${inputId}-description`
  const errorId = `${inputId}-error`

  const hasDescription = description !== undefined && description !== null
  const hasError = error !== undefined && error !== null
  const isInvalid = hasError || ariaInvalid === true || ariaInvalid === 'true'

  const describedBy = [
    ariaDescribedBy,
    hasDescription ? descriptionId : undefined,
    hasError ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground"
        >
          {label}

          {required ? (
            <span className="text-danger" aria-hidden="true">
              {' '}
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <input
        ref={ref}
        {...props}
        id={inputId}
        type={type}
        required={required}
        disabled={disabled}
        aria-invalid={isInvalid || undefined}
        aria-describedby={describedBy.length > 0 ? describedBy : undefined}
        aria-errormessage={hasError && isInvalid ? errorId : ariaErrorMessage}
        data-disabled={disabled ? '' : undefined}
        className={cn(
          'flex w-full rounded-control border border-border bg-input font-normal text-foreground outline-none transition-[background-color,border-color,opacity] duration-150 placeholder:text-muted focus:border-foreground focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:focus:border-danger aria-invalid:focus-visible:outline-danger',
          sizeClasses[size],
          className,
        )}
      />

      {hasError ? (
        <p id={errorId} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : hasDescription ? (
        <p id={descriptionId} className="text-xs text-muted">
          {description}
        </p>
      ) : null}
    </div>
  )
}
