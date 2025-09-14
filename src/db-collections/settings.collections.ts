"use client";
import {
  createCollection,
  localOnlyCollectionOptions,
  localStorageCollectionOptions,
} from "@tanstack/react-db";
import { z } from "zod";

export const SettingsSchema = z.object({
  id: z.string().default("user-settings"),
  defaultRequiredValidation: z.boolean().default(true),
  numericInput: z.boolean().default(false),
  focusOnError: z.boolean().default(true),
  validationMethod: z
    .enum(["onChange", "onBlue", "onDynamic"])
    .default("onDynamic"),
  asyncValidation: z.number().min(0).max(10000).default(500),
  activeTab: z.enum(["builder", "template", "settings"]).default("builder"),
  preferredSchema: z.enum(["zod", "valibot", "arktype"]).default("zod"),
  preferredFramework: z
    .enum(["react", "vue", "angular", "solid"])
    .default("react"),
  preferredPackageManager: z
    .enum(["pnpm", "npm", "yarn", "bun"])
    .default("pnpm"),
  isCodeSidebarOpen: z.boolean().default(false),
});

export type SettingsCollection = z.input<typeof SettingsSchema>;

export const settingsCollection =
  typeof window !== "undefined"
    ? createCollection(
        localStorageCollectionOptions({
          storageKey: "settings",
          getKey: (settings) => settings.id,
          schema: SettingsSchema,
          storage: window.localStorage,
        }),
      )
    : createCollection(
        localOnlyCollectionOptions({
          schema: SettingsSchema,
          getKey: (settings) => settings.id,
        }),
      );

// {
// 	insert: () => {},
// 	update: () => {},
// 	from: () => ({ select: () => ({}) }),
// };
