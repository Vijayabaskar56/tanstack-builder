import { tableBuilderCollection } from "@/db-collections/table-builder.collections";
import { useLiveQuery } from "@tanstack/react-db";

const useTableStore = () => {
	const { data } = useLiveQuery((q) =>
		q.from({ tableBuilder: tableBuilderCollection }).select(({ tableBuilder }) => ({
			tableData: tableBuilder.tableData,
		})),
	);

	return data?.[0] || null;
};

export default useTableStore;