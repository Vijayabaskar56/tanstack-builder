import { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import type { FieldType } from './types'
import { Search, Type, Mail, Hash, Calendar, ToggleLeft, Sliders, FileText, CheckSquare, CircleDot, List, FileUp } from 'lucide-react'

type FieldGroup = {
  name: string
  fields: Array<{
    type: FieldType
    label: string
    description: string
    icon: React.ComponentType<{ className?: string }>
  }>
}

const fieldGroups: FieldGroup[] = [
  {
    name: 'Basic Inputs',
    fields: [
      {
        type: 'text',
        label: 'Text Input',
        description: 'Single line text input',
        icon: Type,
      },
      {
        type: 'email',
        label: 'Email Input',
        description: 'Email address input with validation',
        icon: Mail,
      },
      {
        type: 'number',
        label: 'Number Input',
        description: 'Numeric input with validation',
        icon: Hash,
      },
      {
        type: 'password',
        label: 'Password Input',
        description: 'Secure password input',
        icon: Hash,
      },
      {
        type: 'textarea',
        label: 'Text Area',
        description: 'Multi-line text input',
        icon: FileText,
      },
    ],
  },
  {
    name: 'Choices',
    fields: [
      {
        type: 'checkbox',
        label: 'Checkbox',
        description: 'Single checkbox option',
        icon: CheckSquare,
      },
      {
        type: 'radio',
        label: 'Radio Group',
        description: 'Multiple choice radio buttons',
        icon: CircleDot,
      },
      {
        type: 'select',
        label: 'Select Dropdown',
        description: 'Dropdown selection menu',
        icon: List,
      },
      {
        type: 'switch',
        label: 'Switch Toggle',
        description: 'On/off toggle switch',
        icon: ToggleLeft,
      },
    ],
  },
  {
    name: 'Advanced',
    fields: [
      {
        type: 'date',
        label: 'Date Picker',
        description: 'Date selection input',
        icon: Calendar,
      },
      {
        type: 'otp',
        label: 'OTP Input',
        description: 'One-time password input',
        icon: Hash,
      },
      {
        type: 'slider',
        label: 'Slider',
        description: 'Range slider input',
        icon: Sliders,
      },
      {
        type: 'file',
        label: 'File Upload',
        description: 'File upload input',
        icon: FileUp,
      },
    ],
  },
]

interface FieldLibraryProps {
  onAddField: (type: FieldType) => void
}

export function FieldLibrary({ onAddField }: FieldLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredGroups = fieldGroups.map(group => ({
    ...group,
    fields: group.fields.filter(field =>
      field.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(group => group.fields.length > 0)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">Field Library</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Field Groups */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {filteredGroups.map((group) => (
          <div key={group.name}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              {group.name}
            </h3>
            <div className="space-y-2">
              {group.fields.map((field) => {
                const Icon = field.icon
                return (
                  <Card
                    key={field.type}
                    className="cursor-pointer hover:shadow-md transition-shadow border-dashed hover:border-solid"
                    onClick={() => onAddField(field.type)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium">{field.label}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {field.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}

        {filteredGroups.length === 0 && (
          <div className="text-center py-8">
            <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No fields match your search
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
