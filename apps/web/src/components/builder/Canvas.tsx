import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import type { Field } from './types'
import { ChevronUp, ChevronDown, Copy, Trash2, Settings } from 'lucide-react'

interface CanvasProps {
  fields: Field[]
  selectedId?: string
  onSelectField: (id: string) => void
  onDeleteField: (id: string) => void
  onMoveField: (id: string, direction: 'up' | 'down') => void
  onDuplicateField: (id: string) => void
}

export function Canvas({
  fields,
  selectedId,
  onSelectField,
  onDeleteField,
  onMoveField,
  onDuplicateField,
}: CanvasProps) {
  const renderFieldPreview = (field: Field) => {
    const isSelected = field.id === selectedId
    const baseClasses = `w-full transition-all duration-200 ${
      isSelected
        ? 'ring-2 ring-primary ring-offset-2'
        : 'hover:ring-1 hover:ring-muted-foreground/20'
    }`

    const actionButtons = (
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onMoveField(field.id, 'up')
          }}
          disabled={fields.indexOf(field) === 0}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onMoveField(field.id, 'down')
          }}
          disabled={fields.indexOf(field) === fields.length - 1}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onDuplicateField(field.id)
          }}
        >
          <Copy className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onDeleteField(field.id)
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    )

    // Handle different field types
    if (field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'password' || field.type === 'date' || field.type === 'otp' || field.type === 'file') {
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          <Input
            id={field.id}
            type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
            placeholder={field.appearance?.placeholder}
            className={baseClasses}
            disabled
          />
          {field.appearance?.helpText && (
            <p className="text-xs text-muted-foreground">{field.appearance.helpText}</p>
          )}
          {actionButtons}
        </div>
      )
    }

    if (field.type === 'textarea') {
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          <textarea
            id={field.id}
            placeholder={field.appearance?.placeholder}
            className={`min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${baseClasses}`}
            disabled
          />
          {field.appearance?.helpText && (
            <p className="text-xs text-muted-foreground">{field.appearance.helpText}</p>
          )}
          {actionButtons}
        </div>
      )
    }

    if (field.type === 'checkbox') {
      return (
        <div className="flex items-center space-x-2">
          <Checkbox id={field.id} disabled />
          <Label htmlFor={field.id} className="text-sm font-normal">
            {field.label}
          </Label>
          {actionButtons}
        </div>
      )
    }

    if (field.type === 'switch') {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-11 h-6 bg-muted rounded-full relative">
            <div className="w-5 h-5 bg-background rounded-full absolute top-0.5 left-0.5 shadow-sm" />
          </div>
          <Label htmlFor={field.id} className="text-sm font-normal">
            {field.label}
          </Label>
          {actionButtons}
        </div>
      )
    }

    if (field.type === 'radio' && 'options' in field) {
      return (
        <div className="space-y-2">
          <Label>{field.label}</Label>
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-muted-foreground rounded-full" />
                <Label className="text-sm font-normal">{option.label}</Label>
              </div>
            ))}
          </div>
          {actionButtons}
        </div>
      )
    }

    if (field.type === 'select' && 'options' in field) {
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          <select
            id={field.id}
            className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${baseClasses}`}
            disabled
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {actionButtons}
        </div>
      )
    }

    if (field.type === 'slider') {
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          <div className="relative">
            <input
              type="range"
              id={field.id}
              className={`w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer ${baseClasses}`}
              disabled
            />
          </div>
          {actionButtons}
        </div>
      )
    }

    // Default fallback
    return (
      <div className="space-y-2">
        <Label htmlFor={field.id}>{field.label}</Label>
        <Input
          id={field.id}
          placeholder={field.appearance?.placeholder}
          className={baseClasses}
          disabled
        />
        {actionButtons}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Form Preview</h2>
        <p className="text-sm text-muted-foreground">
          Click on any field to customize its properties
        </p>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] bg-[length:20px_20px]">
        {fields.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No fields yet</h3>
              <p className="text-sm text-muted-foreground">
                Add fields from the library to start building your form
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            {fields.map((field) => (
              <Card
                key={field.id}
                className={`relative group cursor-pointer transition-all duration-200 ${
                  selectedId === field.id ? 'bg-muted/50' : 'hover:bg-muted/30'
                }`}
                onClick={() => onSelectField(field.id)}
              >
                <CardContent className="p-4">
                  {renderFieldPreview(field)}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
