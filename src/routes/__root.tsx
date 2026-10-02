import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { DemoAccountState } from '@/data/demo-account'

interface RouterContext {
  isSignedIn: boolean | undefined
  signInIdentifier: string | null
  signInStrategy: string | null
  accountState: DemoAccountState
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  return <Outlet />
}
