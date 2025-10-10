export type JsonData = Record<
	string,
	string | number | boolean | null | undefined | object
>;

export interface ColumnConfig {
	id: string;
	accessor: string;
	label: string;
	type: "string" | "number" | "boolean" | "date" | "object";
	order: number;
	hasFacetedFilter?: boolean;
	hasDateFilter: boolean;
	hasSliderFilter: boolean;
	options?: { label: string; value: string }[];
	optionsMode?: "auto" | "custom";
}

export interface DataRow {
	[key: string]: string | number | boolean | null | undefined | object;
}
