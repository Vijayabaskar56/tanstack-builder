import { createFileRoute } from '@tanstack/react-router'
import { Builder } from '../components/builder/Builder'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <h1 className="text-lg font-semibold">TanStack Form Builder</h1>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-2">
              {/* Add export/import buttons here later */}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Builder */}
      <main className="flex-1 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <Builder />
      </main>
    </div>
  )
}
