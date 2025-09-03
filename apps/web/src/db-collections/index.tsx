import {
  createCollection,
  localStorageCollectionOptions,
} from '@tanstack/react-db'
import { z } from 'zod'

export const SettingsSchema = z.object({
	id: z.string().default("user-settings"),
	defaultRequiredValidation: z.boolean().default(true),
	numericInput: z.boolean().default(false),
	focusOnError: z.boolean().default(true),
	validationMethod: z.enum(["onChange","onBlue","onDynamic"]).default("onDynamic"),
	asyncValidation: z.number().min(0).max(10000).default(500),
  activeTab: z.enum(["builder","template","settings"]).default("builder"),
  preferredSchema: z.enum(["zod","valibot","arktype"]).default("zod"),
  preferredFramework: z.enum(["react","vue","angular","solid"]).default("react"),
});


export type SettingsCollection = z.infer<typeof SettingsSchema>

export const settingsCollection = createCollection(
  localStorageCollectionOptions({
    storageKey: "settings",
    getKey: (settings) => settings.id,
    schema: SettingsSchema,
  }),
)
