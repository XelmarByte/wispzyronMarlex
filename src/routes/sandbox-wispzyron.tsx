import { ComponentSandbox } from '@/components/sandbox/component-sandbox'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sandbox-wispzyron')({
  component: ComponentSandbox,
})
