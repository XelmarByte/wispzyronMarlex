import { useId, type ComponentPropsWithRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends Omit<ComponentPropsWithRef<'select'>, 'size'> {
  children: ReactNode
  description?: ReactNode
  error?: ReactNode
  label?: ReactNode
}

export function Select({
  children,
  className,
  description,
  disabled,
  error,
  id,
  label,
  required,
  ...props
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const descriptionId = `${selectId}-description`
  const errorId = `${selectId}-error`
  const hasError = error !== undefined && error !== null
  const hasDescription = description !== undefined && description !== null

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? (
        <label
          htmlFor={selectId}
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

      <select
        {...props}
        id={selectId}
        required={required}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        aria-describedby={
          hasError ? errorId : hasDescription ? descriptionId : undefined
        }
        className={cn(
          'h-8 w-full rounded-control border border-border bg-input px-3 text-sm text-foreground outline-none transition-colors focus:border-foreground focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger',
          className,
        )}
      >
        {children}
      </select>

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
