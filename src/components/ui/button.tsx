import type { ComponentPropsWithRef } from 'react'
import { LoaderIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-primary bg-primary text-primary-foreground hover:not-data-disabled:opacity-90 active:not-data-disabled:opacity-80 data-disabled:border-border data-disabled:bg-surface data-disabled:text-muted',

  secondary:
    'border-border bg-surface text-foreground hover:not-data-disabled:bg-hover active:not-data-disabled:bg-hover data-disabled:text-muted',

  ghost:
    'border-transparent bg-transparent text-foreground hover:not-data-disabled:bg-hover active:not-data-disabled:bg-hover data-disabled:text-muted',

  danger:
    'border-danger/30 bg-danger/10 text-danger hover:not-data-disabled:bg-danger/15 active:not-data-disabled:bg-danger/20 data-disabled:border-border data-disabled:bg-surface data-disabled:text-muted',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-7 gap-1 px-2 text-xs',
  md: 'h-8 gap-1.5 px-3 text-sm',
  lg: 'h-9 gap-1.5 px-3.5 text-base',
}

export function Button({
  children,
  className,
  disabled,
  loading = false,
  ref,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const isDisabled = disabled === true || loading

  return (
    <button
      ref={ref}
      {...props}
      type={type}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-control border font-normal leading-none whitespace-nowrap select-none transition-[background-color,color,border-color,opacity] duration-150 outline-none focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-foreground data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={isDisabled}
      data-disabled={isDisabled ? '' : undefined}
      aria-busy={loading ? true : undefined}
    >
      {loading ? (
        <LoaderIcon className="animate-spin" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  )
}
