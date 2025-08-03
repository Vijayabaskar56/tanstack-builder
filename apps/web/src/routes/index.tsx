import { createFileRoute } from '@tanstack/react-router'
import { Builder } from '../components/builder/Builder'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <main className="flex-1 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <Builder />
    </main>
  )
}
