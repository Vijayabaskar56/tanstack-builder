import {
	createCollection,
	localStorageCollectionOptions,
	localOnlyCollectionOptions,
} from "@tanstack/react-db";
import * as v from "valibot";
import { settingsCollection } from "./settings.collections";

const TableBuilderSchema = v.object({
	id: v.number(),
	settings: v.object({
		isGlobalSearch: v.boolean(),
		enableHiding: v.boolean(),
		enableSorting: v.boolean(),
		enableResizing: v.boolean(),
		enablePinning: v.boolean(),
		enableColumnFilter: v.boolean(),
		enableGlobalFilter: v.boolean(),
	}),
	table: v.object({
		columns: v.array(
			v.object({
				id: v.string(),
				accessor: v.string(),
				label: v.string(),
				type: v.union([
					v.literal("string"),
					v.literal("number"),
					v.literal("boolean"),
					v.literal("date"),
					v.literal("object"),
				]),
				order: v.number(),
				hasDateFilter: v.boolean(),
				hasSliderFilter: v.boolean(),
			}),
		),
		data: v.array(v.record(v.string(), v.any())),
	}),
});

export type TableBuilder = v.InferOutput<typeof TableBuilderSchema>;

export const tableBuilderCollection = createCollection(
	!settingsCollection.get("user-settings")?.autoSave
		? localStorageCollectionOptions({
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
