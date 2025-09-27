import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { devtools } from "@tanstack/devtools-vite";
import { nitro } from "nitro/vite";

const config = defineConfig({
	plugins: [
		viteTsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
		tailwindcss(),
		tanstackStart({
			spa: {
				enabled: true,
			},
		}),
		nitro(),
		viteReact(),
		devtools({
			enhancedLogs: {
				enabled: true,
			},
			editor: {
				name: "VSCode",
				open: async (path, lineNumber, columnNumber) => {
					const { exec } = await import("node:child_process");
					exec(
						// or windsurf/cursor/webstorm
						`code -g "${(path).replaceAll("$", "\\$")}${lineNumber ? `:${lineNumber}` : ""}${columnNumber ? `:${columnNumber}` : ""}"`,
					);
				},
			},
		}),
	],
});

export default config;
