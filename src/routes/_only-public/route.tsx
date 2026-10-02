import { Outlet, redirect, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_only-public')({
  beforeLoad: ({ context }) => {
    if (context.isSignedIn === true) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: () => <Outlet />,
})
