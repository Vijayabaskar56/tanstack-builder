import { useState } from 'react'
import { Canvas } from './Canvas'
import { FieldSettings } from './FieldSettings'
import { type BuilderState, type Field, type FieldType, createDefaultField } from './types'
import { FieldLibrary } from '@/components/builder/FieldLibrary';
import { ExportPanel } from '@/components/builder/ExportPanel';

export function Builder() {
  const [state, setState] = useState<BuilderState>({
    fields: [],
    selectedId: undefined,
  })

  const handleAddField = (type: FieldType) => {
    const id = `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newField = createDefaultField(type, id)
    setState(prev => ({
      ...prev,
      fields: [...prev.fields, newField],
      selectedId: id, // Auto-select the new field
    }))
  }

  const handleSelectField = (id: string) => {
    setState(prev => ({ ...prev, selectedId: id }))
  }

  const handleUpdateField = (id: string, updates: Partial<Field>) => {
    setState(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === id ? { ...field, ...updates } : field
      ),
    }))
  }

  const handleDeleteField = (id: string) => {
    setState(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== id),
      selectedId: prev.selectedId === id ? undefined : prev.selectedId,
    }))
  }

  const handleMoveField = (id: string, direction: 'up' | 'down') => {
    setState(prev => {
      const index = prev.fields.findIndex(field => field.id === id)
      if (index === -1) return prev

      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.fields.length) return prev

      const newFields = [...prev.fields]
      const [movedField] = newFields.splice(index, 1)
      newFields.splice(newIndex, 0, movedField)

      return { ...prev, fields: newFields }
    })
  }

  const handleDuplicateField = (id: string) => {
    const field = state.fields.find(f => f.id === id)
    if (!field) return

    const newId = `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const duplicatedField = {
      ...field,
      id: newId,
      name: `${field.name}-copy`,
      label: `${field.label} (Copy)`,
    }

    setState(prev => ({
      ...prev,
      fields: [...prev.fields, duplicatedField],
      selectedId: newId,
    }))
  }

  const _handleImportFields = (importedFields: Field[]) => {
    setState(prev => ({
      ...prev,
      fields: importedFields,
      selectedId: undefined,
    }))
  }

  const selectedField = state.fields.find(field => field.id === state.selectedId)

  return (
    <div className="h-full flex">
      {/* Left Sidebar - Field Library */}
      <div className="w-80 border-r bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <FieldLibrary onAddField={handleAddField} />
      </div>

      {/* Center Canvas */}
      <div className="flex-1 bg-gradient-to-br from-background via-background to-muted/10">
        <Canvas
          fields={state.fields}
          selectedId={state.selectedId}
          onSelectField={handleSelectField}
          onDeleteField={handleDeleteField}
          onMoveField={handleMoveField}
          onDuplicateField={handleDuplicateField}
        />
      </div>

      {/* Right Sidebar - Field Settings or Export Panel */}
      <div className="w-80 border-l bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {selectedField ? (
          <FieldSettings
            field={selectedField}
            onUpdateField={handleUpdateField}
          />
        ) : (
          <div className="h-full overflow-y-auto p-4">
            <ExportPanel
              fields={state.fields}
              onImport={_handleImportFields}
            />
          </div>
        )}
      </div>
    </div>
  )
}
