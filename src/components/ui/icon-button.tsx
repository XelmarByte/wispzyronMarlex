import type { ComponentPropsWithRef, ReactNode } from 'react'
import { LoaderIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

type IconButtonVariant = 'ghost' | 'secondary' | 'danger'
type IconButtonSize = 'sm' | 'md' | 'lg'

interface IconButtonProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'children'
> {
  children: ReactNode
  'aria-label': string
  variant?: IconButtonVariant
  size?: IconButtonSize
  loading?: boolean
}

const variantClasses: Record<IconButtonVariant, string> = {
  ghost:
    'border-transparent bg-transparent text-muted hover:not-data-disabled:bg-hover hover:not-data-disabled:text-foreground active:not-data-disabled:bg-hover',

  secondary:
    'border-border bg-surface text-foreground hover:not-data-disabled:bg-hover active:not-data-disabled:bg-hover',

  danger:
    'border-transparent bg-transparent text-danger hover:not-data-disabled:bg-danger/10 active:not-data-disabled:bg-danger/15',
}

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'size-7',
  md: 'size-8',
  lg: 'size-9',
}

export function IconButton({
  children,
  className,
  disabled,
  loading = false,
  size = 'md',
  type = 'button',
  variant = 'ghost',
  ...props
}: IconButtonProps) {
  const isDisabled = disabled === true || loading

  return (
    <button
      {...props}
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-control border transition-[background-color,color,border-color,opacity] duration-150 data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={isDisabled}
      data-disabled={isDisabled ? '' : undefined}
      aria-busy={loading ? true : undefined}
    >
      {loading ? (
        <LoaderIcon className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        children
      )}
    </button>
  )
}
