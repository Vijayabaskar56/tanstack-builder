import { describe, it, expect } from 'vitest'
import { getArkTypeSchemaString } from '@/lib/schema-generators/generate-arktype-schema'

describe('Arktype Schema Generator - FormArray Support', () => {
  it('should generate schema for a simple FormArray', () => {
    const formElements = [
      {
        fieldType: 'FormArray' as const,
        id: 'users-array',
        name: 'users',
        label: 'Users',
        arrayField: [
          {
            fieldType: 'Input' as const,
            id: 'name-field',
            name: 'name',
            label: 'Name',
            required: true,
            type: 'text'
          },
          {
            fieldType: 'Input' as const,
            id: 'email-field',
            name: 'email',
            label: 'Email',
            required: true,
            type: 'email'
          }
        ],
        entries: []
      }
    ]

    const schemaString = getArkTypeSchemaString(formElements as any)

    expect(schemaString).toContain('users')
    expect(schemaString).toContain('[]')
    expect(schemaString).toContain('"string"')
    expect(schemaString).toContain('"string.email"')
  })

  it('should handle multiple field types in FormArray', () => {
    const formElements = [
      {
        fieldType: 'FormArray' as const,
        id: 'complex-array',
        name: 'items',
        label: 'Items',
        arrayField: [
          {
            fieldType: 'Input' as const,
            id: 'name',
            name: 'name',
            label: 'Name',
            required: true,
            type: 'text'
          },
          {
            fieldType: 'Checkbox' as const,
            id: 'active',
            name: 'active',
            label: 'Active',
            required: false
          },
          {
            fieldType: 'Select' as const,
            id: 'role',
            name: 'role',
            label: 'Role',
            required: true,
            placeholder: 'Select role',
            options: [
              { value: 'admin', label: 'Admin' },
              { value: 'user', label: 'User' }
            ]
          }
        ],
        entries: []
      }
    ]

    const schemaString = getArkTypeSchemaString(formElements as any)

    expect(schemaString).toContain('items')
    expect(schemaString).toContain('[]')
    expect(schemaString).toContain('"boolean"')
    expect(schemaString).toContain('"string >= 1"')
  })

  it('should handle mixed form elements and FormArrays', () => {
    const formElements = [
      {
        fieldType: 'Input' as const,
        id: 'title',
        name: 'title',
        label: 'Title',
        required: true,
        type: 'text'
      },
      {
        fieldType: 'FormArray' as const,
        id: 'users',
        name: 'users',
        label: 'Users',
        arrayField: [
          {
            fieldType: 'Input' as const,
            id: 'user-name',
            name: 'name',
            label: 'Name',
            required: true,
            type: 'text'
          }
        ],
        entries: []
      }
    ]

    const schemaString = getArkTypeSchemaString(formElements as any)

    expect(schemaString).toContain('title')
    expect(schemaString).toContain('users')
    expect(schemaString).toContain('[]')
    expect(schemaString).toContain('"string"')
  })
})