import { Link, useLocation } from '@tanstack/react-router'
import { useMemo, useState, type ReactNode } from 'react'
import { BuildingsIcon, CaretRightIcon, GearIcon } from '@/components/icons'
import { IconButton } from '@/components/ui/icon-button'
import { Tooltip } from '@/components/ui/tooltip'
import {
  getEmployeeNavigation,
  getEmployeeHref,
  type EmployeeNavigationItem,
} from '@/data/employee-navigation'
import { cn } from '@/lib/utils'
import type { OrganizationWorkspaceNavigationId } from '@/data/organization-workspace-navigation'

interface EmployeeSidebarProps {
  orgSlug: string
  organizationName: string
  role: string
  navigationIds: readonly OrganizationWorkspaceNavigationId[]
}

interface NavigationLinkProps {
  children: ReactNode
  className: string
  item: EmployeeNavigationItem
  orgSlug: string
  ariaCurrent?: 'page'
}

interface NavigationItemProps {
  depth: number
  expandedIds: string[]
  isCollapsed: boolean
  item: EmployeeNavigationItem
  onToggle: (itemId: string) => void
  orgSlug: string
  pathname: string
}

function isItemActive(
  item: EmployeeNavigationItem,
  pathname: string,
  orgSlug: string,
) {
  const href = getEmployeeHref(orgSlug, item.path)

  if (item.path === '') {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function getActiveParentIds(
  items: EmployeeNavigationItem[],
  pathname: string,
  orgSlug: string,
) {
  const parentIds: string[] = []

  for (const item of items) {
    if (item.children === undefined) {
      continue
    }

    const childIds = getActiveParentIds(item.children, pathname, orgSlug)

    if (isItemActive(item, pathname, orgSlug) || childIds.length > 0) {
      parentIds.push(item.id, ...childIds)
    }
  }

  return parentIds
}

function NavigationLink({
  ariaCurrent,
  children,
  className,
  item,
  orgSlug,
}: NavigationLinkProps) {
  if (item.path === '') {
    return (
      <Link
        to="/$orgSlug/employee"
        params={{ orgSlug }}
        className={className}
        aria-current={ariaCurrent}
      >
        {children}
      </Link>
    )
  }

  return (
    <Link
      to="/$orgSlug/employee/$"
      params={{
        orgSlug,
        _splat: item.path.slice(1),
      }}
      className={className}
      aria-current={ariaCurrent}
    >
      {children}
    </Link>
  )
}

function NavigationItem({
  depth,
  expandedIds,
  isCollapsed,
  item,
  onToggle,
  orgSlug,
  pathname,
}: NavigationItemProps) {
  const Icon = item.icon
  const children = item.children ?? []
  const hasChildren = children.length > 0
  const isActive = isItemActive(item, pathname, orgSlug)
  const isExpanded = expandedIds.includes(item.id)

  const itemClassName = cn(
    'group flex w-full min-w-0 items-center gap-2 rounded-control px-2 text-sm transition-colors',
    depth === 0 ? 'h-8' : 'h-7',
    depth === 0 ? 'font-medium' : 'font-normal',
    isActive ? 'bg-hover text-foreground' : 'text-foreground hover:bg-hover',
  )

  if (isCollapsed) {
    if (Icon === undefined) {
      return null
    }

    return (
      <Tooltip content={item.label} side="right">
        <NavigationLink
          item={item}
          orgSlug={orgSlug}
          className={cn(
            'flex size-8 items-center justify-center rounded-control transition-colors',
            isActive
              ? 'bg-hover text-foreground'
              : 'text-foreground hover:bg-hover',
          )}
          ariaCurrent={isActive ? 'page' : undefined}
        >
          <Icon className="size-4" aria-hidden="true" />
        </NavigationLink>
      </Tooltip>
    )
  }

  return (
    <li>
      {hasChildren ? (
        <button
          type="button"
          className={itemClassName}
          aria-expanded={isExpanded}
          onClick={() => onToggle(item.id)}
        >
          {Icon ? (
            <Icon className="size-4 shrink-0" aria-hidden="true" />
          ) : null}

          <span className="truncate">{item.label}</span>

          <CaretRightIcon
            className={cn(
              'ml-auto size-3.5 shrink-0 transition-transform duration-150',
              isExpanded && 'rotate-90',
            )}
            aria-hidden="true"
          />
        </button>
      ) : (
        <NavigationLink
          item={item}
          orgSlug={orgSlug}
          className={itemClassName}
          ariaCurrent={isActive ? 'page' : undefined}
        >
          {Icon ? (
            <Icon className="size-4 shrink-0" aria-hidden="true" />
          ) : null}

          <span className="truncate">{item.label}</span>
        </NavigationLink>
      )}

      {hasChildren && isExpanded ? (
        <ul
          className={cn(
            'mt-0.5 space-y-0.5 border-l border-border pl-2',
            depth === 0 ? 'ml-4' : 'ml-3',
          )}
        >
          {children.map((child) => (
            <NavigationItem
              key={child.id}
              item={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              isCollapsed={isCollapsed}
              onToggle={onToggle}
              orgSlug={orgSlug}
              pathname={pathname}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

export function EmployeeSidebar({
  orgSlug,
  organizationName,
  role,
  navigationIds,
}: EmployeeSidebarProps) {
  const { pathname } = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [userExpanded, setUserExpanded] = useState<string[]>([])
  const [userCollapsed, setUserCollapsed] = useState<string[]>([])

  const navigation = useMemo(
    () => getEmployeeNavigation(navigationIds),
    [navigationIds],
  )

  const activeParentIds = useMemo(
    () =>
      getActiveParentIds(
        navigation.flatMap((group) => group.items),
        pathname,
        orgSlug,
      ),
    [pathname, orgSlug, navigation],
  )

  const expandedIds = useMemo(() => {
    const combined = new Set([...activeParentIds, ...userExpanded])
    for (const id of userCollapsed) {
      combined.delete(id)
    }
    return Array.from(combined)
  }, [activeParentIds, userExpanded, userCollapsed])

  const toggleItem = (itemId: string) => {
    const isCurrentlyExpanded = expandedIds.includes(itemId)

    if (isCurrentlyExpanded) {
      setUserExpanded((prev) => prev.filter((id) => id !== itemId))
      setUserCollapsed((prev) =>
        prev.includes(itemId) ? prev : [...prev, itemId],
      )
    } else {
      setUserCollapsed((prev) => prev.filter((id) => id !== itemId))
      setUserExpanded((prev) =>
        prev.includes(itemId) ? prev : [...prev, itemId],
      )
    }
  }

  return (
    <aside
      className={cn(
        'flex h-dvh shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200',
        isCollapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="border-b border-border p-2">
        <div
          className={cn(
            'flex items-center gap-2 rounded-control px-2 py-1.5',
            isCollapsed && 'justify-center px-0',
          )}
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-control bg-primary text-primary-foreground">
            <BuildingsIcon className="size-4" aria-hidden="true" />
          </span>

          {!isCollapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-foreground">
                {organizationName}
              </span>
              <span className="block truncate text-xs text-muted">{role}</span>
            </span>
          ) : null}
        </div>
      </div>

      <nav
        className={cn(
          'min-h-0 flex-1 overflow-y-auto py-3',
          isCollapsed ? 'px-4' : 'px-2',
        )}
        aria-label="Navegación principal"
      >
        {navigation.map((group) => (
          <section key={group.label ?? 'main'} className="mb-5">
            {!isCollapsed && group.label ? (
              <h2 className="mb-1 px-2 text-xs font-medium text-muted">
                {group.label}
              </h2>
            ) : null}

            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <NavigationItem
                  key={item.id}
                  item={item}
                  depth={0}
                  expandedIds={expandedIds}
                  isCollapsed={isCollapsed}
                  onToggle={toggleItem}
                  orgSlug={orgSlug}
                  pathname={pathname}
                />
              ))}
            </ul>
          </section>
        ))}
      </nav>

      <div
        className={cn(
          'space-y-1 border-t border-border p-2',
          isCollapsed && 'flex flex-col items-center',
        )}
      >
        {isCollapsed ? (
          <Tooltip content="Configuración" side="right">
            <Link
              to="/settings"
              className="flex size-8 items-center justify-center rounded-control text-foreground hover:bg-hover"
              aria-label="Ir a configuración"
            >
              <GearIcon className="size-4" aria-hidden="true" />
            </Link>
          </Tooltip>
        ) : (
          <Link
            to="/settings"
            className="flex h-8 items-center gap-2 rounded-control px-2 text-sm text-foreground hover:bg-hover"
          >
            <GearIcon className="size-4" aria-hidden="true" />
            Configuración
          </Link>
        )}

        <Tooltip
          content={isCollapsed ? 'Expandir barra' : 'Colapsar barra'}
          side="right"
        >
          <IconButton
            aria-label={
              isCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'
            }
            className={cn(
              'text-muted hover:text-foreground',
              !isCollapsed && 'w-full justify-start gap-2 px-2',
            )}
            onClick={() => setIsCollapsed((current) => !current)}
          >
            <CaretRightIcon
              className={cn(
                'size-4 transition-transform',
                !isCollapsed && 'rotate-180',
              )}
              aria-hidden="true"
            />

            {!isCollapsed ? <span>Colapsar barra</span> : null}
          </IconButton>
        </Tooltip>
      </div>
    </aside>
  )
}
