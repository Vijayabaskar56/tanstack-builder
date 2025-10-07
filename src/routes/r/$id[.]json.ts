// src/routes/r/$id[.]json.ts

import { env } from "cloudflare:workers";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createFileRoute } from "@tanstack/react-router";
import { v4 as uuid } from "uuid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In-memory store for dev
const devRegistry = new Map<string, string>();

const responseHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Content-Type": "application/json",
};

export const Route = createFileRoute("/r/$id.json")({
	server: {
		handlers: {
			GET: async ({ request, params }) => {
				const id = params["id.json"];
				console.log("🚀 ~ file: $id[.]json.ts:24 ~ id:", id);
				// Strip .json extension if present
				const registryId = id?.endsWith(".json") ? id?.slice(0, -5) : id;
				try {
					let registryItem = await env.CACHE.get(registryId);
					console.log(
						"🚀 ~ file: $id[.]json.ts:41 ~ registryItem:",
						registryItem,
					);
					if (!registryItem) {
						return new Response("Registry item not found", {
							status: 404,
							headers: responseHeaders,
						});
					}
					return new Response(registryItem, {
						status: 200,
						headers: responseHeaders,
					});
				} catch (error) {
					console.error(error);
					return new Response("Something went wrong", {
						status: 500,
						headers: responseHeaders,
					});
				}
			},
			POST: async ({ request, params }) => {
				try {
					const body = await request.json();
					console.log("🚀 ~ file: $id[.]json.ts:62 ~ body:", body);
					const { registryDependencies, dependencies, files, name } = body;
					const id = `${name}-${uuid()}`;
					const registry = {
						$schema: "https://ui.shadcn.com/schema/registry.json",
						homepage: "https://tanstack-form-builder.dev",
						author: "tanstack-form-builder (https://tanstack-form-builder.dev)",
						name,
						dependencies,
						registryDependencies,
						type: "registry:block",
						files,
					};
					console.log("🚀 ~ file: $id[.]json.ts:74 ~ registry:", registry);
					const res = await env.CACHE.put(id, JSON.stringify(registry), {
						expirationTtl: 60 * 60 * 24, // 1 day
					});
					console.log("🚀 ~ res :", res);
					return new Response(
						JSON.stringify({
							data: {
								id: `@tan-builder/${id}`,
							},
							error: null,
						}),
						{
							status: 200,
							headers: responseHeaders,
						},
					);
				} catch (error) {
					console.log(error);
					return new Response(JSON.stringify({ data: null, error }), {
						status: 500,
						headers: responseHeaders,
					});
				}
			},
		},
	},
});
