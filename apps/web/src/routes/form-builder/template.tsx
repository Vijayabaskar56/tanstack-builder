import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/form-builder/template')({
  component: TemplateComponent,
})

function TemplateComponent() {
  return (
    <main className="flex-1 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Template Library</h1>
          <p className="text-muted-foreground">Browse and use pre-built form templates.</p>
          <p className="text-muted-foreground">This feature is coming soon!</p>
        </div>
      </div>
    </main>
  )
}
