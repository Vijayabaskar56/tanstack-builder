
import { useLiveQuery } from "@tanstack/react-db";
import { settingsCollection } from "@/db-collections";

const useSettings = () => {
	const { data } = useLiveQuery((q) =>
		q.from({ settings: settingsCollection }).select(({ settings }) => ({
			activeTab: settings.activeTab,
			defaultRequiredValidation: settings.defaultRequiredValidation,
			numericInput: settings.numericInput,
			focusOnError: settings.focusOnError,
			validationMethod: settings.validationMethod,
			asyncValidation: settings.asyncValidation,
			id: settings.id,
			preferredSchema: settings.preferredSchema,
			preferredFramework: settings.preferredFramework,
   preferredPackageManager : settings.preferredPackageManager,
   isCodeSidebarOpen : settings.isCodeSidebarOpen
		})),
	);

	// Return the first (and only) settings object, or null if no settings exist
	return data?.[0] || null;
};

export default useSettings;
