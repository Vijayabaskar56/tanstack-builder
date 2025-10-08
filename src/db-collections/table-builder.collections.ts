import {
	createCollection,
	localStorageCollectionOptions,
	localOnlyCollectionOptions,
} from "@tanstack/react-db";
import { z } from "zod";
import { settingsCollection } from "./settings.collections";

const TableBuilderSchema = z.object({
	id: z.number(),
	tableData: z.array(z.object({
		id: z.number(),
		name: z.string(),
		columns: z.array(z.object({
			id: z.number(),
			name: z.string(),
		})),
	})),
});

export type TableBuilder = z.infer<typeof TableBuilderSchema>;

export const tableBuilderCollection = createCollection(
    !settingsCollection.get("user-settings")?.autoSave ? localStorageCollectionOptions({
				storageKey: "table-builder",
				getKey: (tableBuilder) => tableBuilder.id,
				schema: TableBuilderSchema,
				storage: window.localStorage,
			})
		: localOnlyCollectionOptions({
				getKey: (tableBuilder) => tableBuilder.id,
				schema: TableBuilderSchema,
			}),
);
