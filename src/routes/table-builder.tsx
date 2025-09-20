import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/table-builder')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/table-builder"!</div>
}
