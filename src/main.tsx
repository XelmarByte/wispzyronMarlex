import '@fontsource-variable/inter'
import { ClerkProvider } from '@clerk/react'
import { createRoot } from 'react-dom/client'
import { InnerApp } from './app'
import { router } from './router'
import { DemoAccountProvider } from '@/providers/demo-account-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import './index.css'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <ClerkProvider>
    <ThemeProvider>
      <DemoAccountProvider>
        <InnerApp />
      </DemoAccountProvider>
    </ThemeProvider>
  </ClerkProvider>,
)
