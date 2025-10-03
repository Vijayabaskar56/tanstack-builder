import { TanStackDevtools } from "@tanstack/react-devtools";
import { FormDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

const DevTools = () => {
	return (
		<TanStackDevtools
			config={{
				position: "bottom-left",
			}}
			plugins={[
				FormDevtoolsPlugin(),
				// TODO: Check Once the Update Available
				// pacerDevtoolsPlugin(),
				{
					name: "Tanstack Router",
					render: <TanStackRouterDevtoolsPanel />,
				},
				{
					name: "Tanstack Query",
					render: <ReactQueryDevtoolsPanel />,
				},
			]}
		/>
	);
};

export default DevTools;
