import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useSearchStore } from '@/hooks/use-search-store'
import { FormStateSearchParamsSchemaSingle } from '@/lib/search-schema'
import type { FormElement, FormStep, FormArray } from '@/types/form-types'

// Mock TanStack Router hooks
const mockNavigate = vi.fn()
const mockUseSearch = vi.fn()
const mockUseDebouncedValue = vi.fn()
const mockUseThrottledCallback = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => mockUseSearch(),
}))

vi.mock('@tanstack/react-pacer', () => ({
  useDebouncedValue: (value: any, options: any) => mockUseDebouncedValue(value, options),
  useThrottledCallback: (callback: any, options: any) => mockUseThrottledCallback(callback, options),
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}))

// Mock dependencies
vi.mock('@/constants/default-form-element', () => ({
  defaultFormElements: {
    Input: {
      id: 'input-id',
      fieldType: 'Input',
      name: 'input',
      label: 'Input',
      type: 'text',
      required: true,
    },
    Textarea: {
      id: 'textarea-id',
      fieldType: 'Textarea',
      name: 'textarea',
      label: 'Textarea',
      required: true,
    },
  },
}))

vi.mock('@/constants/templates', () => ({
  templates: {
    contactUs: {
      template: [
        {
          id: 'contact-input',
          fieldType: 'Input',
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
        },
      ],
    },
  },
}))

vi.mock('@/lib/form-elements-helpers', () => ({
  dropAtIndex: vi.fn((arr, index) => arr.filter((_, i) => i !== index)),
  insertAtIndex: vi.fn((arr, item, index) => [
    ...arr.slice(0, index),
    item,
    ...arr.slice(index),
  ]),
  transformToStepFormList: vi.fn((elements) => [
    {
      id: 'step-1',
      stepFields: elements,
    },
  ]),
  flattenFormSteps: vi.fn((steps) => steps.flatMap(step => step.stepFields)),
}))

vi.mock('uuid', () => ({
  v4: () => 'mock-uuid',
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Test wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  )
}

describe('useSearchStore', () => {
  let mockSearchParams: any
  let mockDebouncedParams: any
  let mockThrottledNavigate: any

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Setup default mock values
    mockSearchParams = {
      isMS: false,
      formElements: [],
      formName: 'Test Form',
      schemaName: 'testSchema',
      validationSchema: 'zod',
      framework: 'react',
      lastAddedStepIndex: undefined,
    }

    mockDebouncedParams = mockSearchParams
    mockThrottledNavigate = vi.fn()

    // Setup mock implementations
    mockUseSearch.mockReturnValue(mockSearchParams)
    mockUseDebouncedValue.mockReturnValue([mockDebouncedParams])
    mockUseThrottledCallback.mockReturnValue(mockThrottledNavigate)

    // Mock useQuery
    const mockUseQuery = vi.fn().mockReturnValue({
      data: { isValid: true, data: mockSearchParams, error: null },
      isLoading: false,
      error: null,
    })
    vi.mocked(require('@tanstack/react-query').useQuery).mockImplementation(mockUseQuery)

    // Mock localStorage
    localStorageMock.getItem.mockReturnValue('[]')
    localStorageMock.setItem.mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('Basic Hook Functionality', () => {
    it('should return correct initial state', () => {
      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isMS).toBe(false)
      expect(result.current.formElements).toEqual([])
      expect(result.current.formName).toBe('Test Form')
      expect(result.current.validationSchema).toBe('zod')
      expect(result.current.framework).toBe('react')
    })

    it('should handle undefined search params gracefully', () => {
      mockUseSearch.mockReturnValue({})
      mockUseDebouncedValue.mockReturnValue([{}])

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isMS).toBe(false)
      expect(result.current.formName).toBe('Form')
      expect(result.current.validationSchema).toBe('zod')
      expect(result.current.framework).toBe('react')
    })
  })

  describe('Core Actions', () => {
    it('should set validation schema', () => {
      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.setValidationSchema('valibot')
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        validationSchema: 'valibot',
      })
    })

    it('should set framework', () => {
      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.setFramework('vue')
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        framework: 'vue',
      })
    })

    it('should toggle multi-step mode', () => {
      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.setIsMS(true)
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        isMS: true,
        formElements: [{ id: 'step-1', stepFields: [] }],
      })
    })

    it('should reset form elements', () => {
      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.resetFormElements()
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        formElements: [],
      })
    })
  })

  describe('Element Management', () => {
    it('should append element to single-step form', () => {
      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.appendElement({ fieldType: 'Input' })
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        formElements: [
          expect.objectContaining({
            id: 'mock-uuid',
            fieldType: 'Input',
            name: expect.stringContaining('Input'),
            required: true,
          }),
        ],
      })
    })

    it('should append element to multi-step form', () => {
      mockSearchParams.isMS = true
      mockSearchParams.formElements = [{ id: 'step-1', stepFields: [] }]

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.appendElement({ fieldType: 'Input', stepIndex: 0 })
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        formElements: [
          {
            id: 'step-1',
            stepFields: [
              expect.objectContaining({
                id: 'mock-uuid',
                fieldType: 'Input',
                required: true,
              }),
            ],
          },
        ],
      })
    })

    it('should drop element from single-step form', () => {
      mockSearchParams.formElements = [
        { id: 'element-1', fieldType: 'Input', name: 'input1' },
        { id: 'element-2', fieldType: 'Textarea', name: 'textarea1' },
      ]

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.dropElement({ fieldIndex: 0 })
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        formElements: [
          { id: 'element-2', fieldType: 'Textarea', name: 'textarea1' },
        ],
      })
    })

    it('should edit element', () => {
      mockSearchParams.formElements = [
        { id: 'element-1', fieldType: 'Input', name: 'input1', label: 'Old Label' },
      ]

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.editElement({
          fieldIndex: 0,
          modifiedFormElement: { label: 'New Label' },
        })
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        formElements: [
          expect.objectContaining({
            id: 'element-1',
            fieldType: 'Input',
            name: 'input1',
            label: 'New Label',
          }),
        ],
      })
    })

    it('should reorder elements', () => {
      mockSearchParams.formElements = [
        { id: 'element-1', fieldType: 'Input', name: 'input1' },
        { id: 'element-2', fieldType: 'Textarea', name: 'textarea1' },
      ]

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      const newOrder = [
        { id: 'element-2', fieldType: 'Textarea', name: 'textarea1' },
        { id: 'element-1', fieldType: 'Input', name: 'input1' },
      ]

      act(() => {
        result.current.reorder({ newOrder })
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        formElements: newOrder,
      })
    })
  })

  describe('Multi-Step Form Operations', () => {
    it('should add form step', () => {
      mockSearchParams.isMS = true
      mockSearchParams.formElements = [{ id: 'step-1', stepFields: [] }]

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.addFormStep()
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        formElements: [
          { id: 'step-1', stepFields: [] },
          { id: 'mock-uuid', stepFields: [] },
        ],
        lastAddedStepIndex: 1,
      })
    })

    it('should remove form step', () => {
      mockSearchParams.isMS = true
      mockSearchParams.formElements = [
        { id: 'step-1', stepFields: [] },
        { id: 'step-2', stepFields: [] },
        { id: 'step-3', stepFields: [] },
      ]

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.removeFormStep(1)
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        formElements: [
          { id: 'step-1', stepFields: [] },
          { id: 'step-3', stepFields: [] },
        ],
      })
    })

    it('should reorder steps', () => {
      mockSearchParams.isMS = true
      mockSearchParams.formElements = [
        { id: 'step-1', stepFields: [] },
        { id: 'step-2', stepFields: [] },
      ]

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      const newOrder = [
        { id: 'step-2', stepFields: [] },
        { id: 'step-1', stepFields: [] },
      ]

      act(() => {
        result.current.reorderSteps(newOrder)
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        formElements: newOrder,
      })
    })
  })

  describe('Template Operations', () => {
    it('should set template', () => {
      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.setTemplate('contactUs')
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        formElements: [
          {
            id: 'contact-input',
            fieldType: 'Input',
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
          },
        ],
        isMS: false,
      })
    })

    it('should throw error for invalid template', () => {
      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      expect(() => {
        act(() => {
          result.current.setTemplate('nonexistent' as any)
        })
      }).toThrow('Template \'nonexistent\' not found')
    })
  })

  describe('Form Array Operations', () => {
    it('should add form array', () => {
      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      const arrayField = [
        { id: 'field-1', fieldType: 'Input', name: 'name', required: true },
      ]

      act(() => {
        result.current.addFormArray(arrayField)
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        formElements: [
          expect.objectContaining({
            id: 'mock-uuid',
            fieldType: 'FormArray',
            name: expect.stringContaining('formArray'),
            arrayField,
            entries: [expect.any(Array)],
          }),
        ],
      })
    })

    it('should remove form array', () => {
      mockSearchParams.formElements = [
        {
          id: 'array-1',
          fieldType: 'FormArray',
          name: 'testArray',
          arrayField: [],
          entries: [],
        },
      ]

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.removeFormArray('array-1')
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        formElements: [],
      })
    })

    it('should update form array', () => {
      mockSearchParams.formElements = [
        {
          id: 'array-1',
          fieldType: 'FormArray',
          name: 'testArray',
          arrayField: [{ id: 'old-field', fieldType: 'Input', name: 'old' }],
          entries: [],
        },
      ]

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      const newArrayField = [
        { id: 'new-field', fieldType: 'Textarea', name: 'new' },
      ]

      act(() => {
        result.current.updateFormArray('array-1', newArrayField)
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        formElements: [
          expect.objectContaining({
            id: 'array-1',
            arrayField: newArrayField,
          }),
        ],
      })
    })
  })

  describe('Save/Load Operations', () => {
    it('should save form', () => {
      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.saveForm('My Form')
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'savedForms',
        expect.stringContaining('"name":"My Form"')
      )
    })

    it('should load form', () => {
      const savedFormData = {
        name: 'My Form',
        data: {
          isMS: true,
          formElements: [{ id: 'step-1', stepFields: [] }],
          formName: 'Loaded Form',
          validationSchema: 'valibot',
          framework: 'vue',
        },
        createdAt: new Date().toISOString(),
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify([savedFormData]))

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.loadForm('My Form')
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        isMS: true,
        formElements: [{ id: 'step-1', stepFields: [] }],
        formName: 'Loaded Form',
        validationSchema: 'valibot',
        framework: 'vue',
      })
    })

    it('should get saved forms', () => {
      const savedForms = [
        {
          name: 'Form 1',
          data: { isMS: false },
          createdAt: new Date().toISOString(),
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedForms))

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      const forms = result.current.getSavedForms()
      expect(forms).toEqual(savedForms)
    })

    it('should delete saved form', () => {
      const savedForms = [
        { name: 'Form 1', data: {}, createdAt: new Date().toISOString() },
        { name: 'Form 2', data: {}, createdAt: new Date().toISOString() },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedForms))

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.deleteSavedForm('Form 1')
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'savedForms',
        JSON.stringify([
          { name: 'Form 2', data: {}, createdAt: expect.any(String) },
        ])
      )
    })
  })

  describe('Error Handling', () => {
    it('should throw error for invalid field type', () => {
      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      expect(() => {
        act(() => {
          result.current.appendElement({ fieldType: 'InvalidType' as any })
        })
      }).toThrow('Unknown field type: InvalidType')
    })

    it('should throw error for invalid step index', () => {
      mockSearchParams.isMS = true
      mockSearchParams.formElements = [{ id: 'step-1', stepFields: [] }]

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      expect(() => {
        act(() => {
          result.current.appendElement({ fieldType: 'Input', stepIndex: 5 })
        })
      }).toThrow('Invalid step index: 5. Must be between 0 and 0')
    })

    it('should throw error for invalid field index', () => {
      mockSearchParams.formElements = [
        { id: 'element-1', fieldType: 'Input', name: 'input1' },
      ]

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      expect(() => {
        act(() => {
          result.current.dropElement({ fieldIndex: 5 })
        })
      }).toThrow('Invalid field index: 5. Must be between 0 and 0')
    })

    it('should throw error when adding step to single-step form', () => {
      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      expect(() => {
        act(() => {
          result.current.addFormStep()
        })
      }).toThrow('Cannot add form step to single-step form')
    })

    it('should throw error when removing last step', () => {
      mockSearchParams.isMS = true
      mockSearchParams.formElements = [{ id: 'step-1', stepFields: [] }]

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      expect(() => {
        act(() => {
          result.current.removeFormStep(0)
        })
      }).toThrow('Cannot remove the last step from a multi-step form')
    })

    it('should throw error for non-existent form array', () => {
      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      expect(() => {
        act(() => {
          result.current.removeFormArray('non-existent-id')
        })
      }).toThrow('FormArray not found')
    })
  })

  describe('Validation and Performance', () => {
    it('should provide validation status', () => {
      const mockValidationQuery = {
        data: { isValid: true, data: mockSearchParams, error: null },
        isLoading: false,
        error: null,
      }

      vi.mocked(require('@tanstack/react-query').useQuery).mockReturnValue(mockValidationQuery)

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      expect(result.current.validation).toEqual(mockValidationQuery.data)
      expect(result.current.isValidating).toBe(false)
      expect(result.current.validationError).toBe(null)
    })

    it('should handle validation errors', () => {
      const mockValidationQuery = {
        data: { isValid: false, data: null, error: new Error('Validation failed') },
        isLoading: false,
        error: new Error('Validation failed'),
      }

      vi.mocked(require('@tanstack/react-query').useQuery).mockReturnValue(mockValidationQuery)

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      expect(result.current.validation?.isValid).toBe(false)
      expect(result.current.validationError).toBeInstanceOf(Error)
    })

    it('should provide debounced params', () => {
      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      expect(result.current.debouncedParams).toEqual(mockDebouncedParams)
    })

    it('should use throttled navigation for updates', () => {
      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.setValidationSchema('arktype')
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        validationSchema: 'arktype',
      })
    })
  })

  describe('Nested Element Operations', () => {
    it('should append nested element to form array', () => {
      mockSearchParams.formElements = [
        {
          id: 'array-1',
          fieldType: 'FormArray',
          name: 'testArray',
          arrayField: [
            { id: 'field-1', fieldType: 'Input', name: 'name' },
            { id: 'field-2', fieldType: 'Textarea', name: 'description' },
          ],
          entries: [
            {
              id: 'entry-1',
              fields: [
                { id: 'entry-field-1', fieldType: 'Input', name: 'name_0' },
                { id: 'entry-field-2', fieldType: 'Textarea', name: 'description_0' },
              ],
            },
          ],
        },
      ]

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.appendElement({
          fieldType: 'Input',
          fieldIndex: 0,
          j: 0,
        })
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        formElements: [
          expect.objectContaining({
            id: 'array-1',
            arrayField: [
              [
                { id: 'field-1', fieldType: 'Input', name: 'name' },
                expect.objectContaining({
                  id: 'mock-uuid',
                  fieldType: 'Input',
                  required: true,
                }),
              ],
              { id: 'field-2', fieldType: 'Textarea', name: 'description' },
            ],
          }),
        ],
      })
    })

    it('should drop nested element from form array', () => {
      mockSearchParams.formElements = [
        {
          id: 'array-1',
          fieldType: 'FormArray',
          name: 'testArray',
          arrayField: [
            [
              { id: 'nested-1', fieldType: 'Input', name: 'input1' },
              { id: 'nested-2', fieldType: 'Textarea', name: 'textarea1' },
            ],
          ],
          entries: [],
        },
      ]

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.dropElement({
          fieldIndex: 0,
          j: 1,
        })
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        formElements: [
          expect.objectContaining({
            arrayField: [
              [{ id: 'nested-1', fieldType: 'Input', name: 'input1' }],
            ],
          }),
        ],
      })
    })

    it('should edit nested element', () => {
      mockSearchParams.formElements = [
        {
          id: 'array-1',
          fieldType: 'FormArray',
          name: 'testArray',
          arrayField: [
            [
              { id: 'nested-1', fieldType: 'Input', name: 'input1', label: 'Old Label' },
            ],
          ],
          entries: [],
        },
      ]

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.editElement({
          fieldIndex: 0,
          j: 0,
          modifiedFormElement: { label: 'New Label' },
        })
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        formElements: [
          expect.objectContaining({
            arrayField: [
              [
                expect.objectContaining({
                  id: 'nested-1',
                  fieldType: 'Input',
                  name: 'input1',
                  label: 'New Label',
                }),
              ],
            ],
          }),
        ],
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty form elements', () => {
      mockSearchParams.formElements = []

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.setIsMS(true)
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        isMS: true,
        formElements: [{ id: 'mock-uuid', stepFields: [] }],
      })
    })

    it('should handle form array sync operations', () => {
      mockSearchParams.formElements = [
        {
          id: 'array-1',
          fieldType: 'FormArray',
          name: 'testArray',
          arrayField: [{ id: 'field-1', fieldType: 'Input', name: 'input' }],
          entries: [
            {
              id: 'entry-1',
              fields: [{ id: 'entry-field-1', fieldType: 'Input', name: 'input_0' }],
            },
          ],
        },
      ]

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.syncFormArrayEntries('array-1')
      })

      expect(mockThrottledNavigate).toHaveBeenCalledWith({
        formElements: [
          expect.objectContaining({
            id: 'array-1',
            entries: expect.any(Array),
          }),
        ],
      })
    })

    it('should handle server-side rendering (no window)', () => {
      const originalWindow = global.window
      delete (global as any).window

      const { result } = renderHook(() => useSearchStore(), {
        wrapper: createWrapper(),
      })

      // Should not throw errors
      act(() => {
        result.current.saveForm('Test Form')
        result.current.loadForm('Test Form')
        const forms = result.current.getSavedForms()
        result.current.deleteSavedForm('Test Form')
      })

      expect(result.current.getSavedForms()).toEqual([])

      // Restore window
      global.window = originalWindow
    })
  })
})
