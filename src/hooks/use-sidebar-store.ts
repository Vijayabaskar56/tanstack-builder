/**
 * Sidebar Store using TanStack Store
 * Manages active tab and sidebar content state for the form builder application.
 */

import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";

// Core state type
type SidebarCoreState = {
	activeTab: "builder" | "template" | "settings";
};

// Actions type
type SidebarActions = {
	setActiveTab: (tab: "builder" | "template" | "settings") => void;
};

// Complete state type
type SidebarState = SidebarCoreState & SidebarActions;

// Initial state
const initialCoreState: SidebarCoreState = {
	activeTab: "builder",
};

// Create the core store
const sidebarCoreStore = new Store<SidebarCoreState>(initialCoreState, {
	updateFn: (prevState) => (updater) => {
		const newState =
			typeof updater === "function" ? updater(prevState) : updater;
		return newState;
	},
	onUpdate: () => {
		console.debug("Sidebar state updated:", sidebarCoreStore.state);
	},
});

// Create actions
const createActions = (store: Store<SidebarCoreState>): SidebarActions => {
	const setActiveTab = (tab: "builder" | "template" | "settings") => {
		store.setState((state) => ({ ...state, activeTab: tab }));
	};

	return { setActiveTab };
};

// Create actions instance
const sidebarActions = createActions(sidebarCoreStore);

// Enhanced React hook
export const useSidebarStore = () => {
	const coreState = useStore(sidebarCoreStore);

	return {
		// Core state (read-only)
		activeTab: coreState.activeTab,
		// Actions (write operations)
		actions: sidebarActions,
		// Direct store access for advanced usage
		stores: {
			core: sidebarCoreStore,
		},
	};
};

// Export store for direct access if needed
export const sidebarCoreStoreInstance = sidebarCoreStore;
