import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/form-builder/')({
  beforeLoad: () => {
    throw redirect({
      to: '/form-builder/builder',
      replace: true,
    })
  },
})