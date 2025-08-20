import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/table-builder')({
  component: TableBuilderComponent,
})

function TableBuilderComponent() {
  return (
    <main className="flex-1 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Table Builder</h1>
          <p className="text-muted-foreground">Create and manage data tables with advanced features.</p>
          <p className="text-muted-foreground">This feature is coming soon!</p>
        </div>
      </div>
    </main>
  )
}