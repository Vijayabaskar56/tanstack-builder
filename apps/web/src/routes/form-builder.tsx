import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/form-builder')({
  component: FormBuilderLayout,
})

function FormBuilderLayout() {
  return <Outlet />
}