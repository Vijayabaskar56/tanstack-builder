import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import alchemy from "alchemy/cloudflare/tanstack-start";

export default defineConfig({
	plugins: [
		tsconfigPaths(),
		tailwindcss(),
		tanstackStart({ customViteReactPlugin: true,
      target: "cloudflare-module"
    }),
		viteReact(),
    alchemy()
  ],
  build: {
        target: "esnext",
        rollupOptions: {
          external: ["node:async_hooks", "cloudflare:workers"],
        },
      }
});
