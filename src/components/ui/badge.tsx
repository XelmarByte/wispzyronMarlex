import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'success'
  | 'warning'
  | 'info'
  | 'outline'
  | 'beta'

type BadgeProps = ComponentProps<'span'> & {
  variant?: BadgeVariant
  dot?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'border-primary bg-primary text-primary-foreground',
  secondary: 'border-border bg-hover text-foreground',
  error: 'border-danger/20 bg-danger/10 text-danger',
  success: 'border-success/20 bg-success/10 text-success',
  warning: 'border-warning/20 bg-warning/10 text-warning',
  info: 'border-info/20 bg-info/10 text-info',
  outline: 'border-border bg-transparent text-foreground',
  beta: 'border-dashed border-info bg-transparent text-info',
}

export function Badge({
  children,
  className,
  dot = false,
  variant = 'secondary',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-4 items-center gap-1 rounded-full border px-1.5 text-xs font-medium leading-none whitespace-nowrap',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {dot ? (
        <span className="size-1 rounded-full bg-current" aria-hidden="true" />
      ) : null}

      {children}
    </span>
  )
}
