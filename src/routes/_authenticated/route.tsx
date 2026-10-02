import { Outlet, redirect, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (context.isSignedIn === false) {
      throw redirect({
        to: '/login',
        search: {
          redirect_url: location.pathname,
        },
      })
    }
  },
  component: () => <Outlet />,
})
