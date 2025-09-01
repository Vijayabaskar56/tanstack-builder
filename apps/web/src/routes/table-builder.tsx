import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/table-builder')({
  component: TableBuilderComponent,
})

function TableBuilderComponent() {
  return (
    <main className="flex-1 overflow-hidden w-full h-full bg-gradient-to-br from-background via-background to-muted/20">
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Table Builder</h1>
          <p className="text-muted-foreground">Will Start the Work as soon as the Form Builder Becomes Stable</p>
        </div>
      </div>
    </main>
  )
}
