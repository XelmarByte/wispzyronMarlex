import { useId, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'type'
> {
  description?: string
  label: string
}

export function Checkbox({
  className,
  description,
  id,
  label,
  ...props
}: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId

  return (
    <label
      htmlFor={checkboxId}
      className="flex cursor-pointer items-start gap-3 rounded-control border border-border bg-surface p-3 transition-colors hover:bg-hover has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-foreground"
    >
      <input
        {...props}
        id={checkboxId}
        type="checkbox"
        className={cn(
          'mt-0.5 size-4 shrink-0 rounded-sm border-border bg-input accent-primary',
          className,
        )}
      />

      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">
          {label}
        </span>

        {description ? (
          <span className="mt-1 block text-xs leading-5 text-muted">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  )
}
