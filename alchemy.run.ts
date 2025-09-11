import alchemy from "alchemy";
import { D1Database, TanStackStart, Worker } from "alchemy/cloudflare";
import { Exec } from "alchemy/os";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "./apps/web/.env" });
config({ path: "./apps/server/.env" });

const app = await alchemy("tanstack-builder");

// await Exec("db-generate", {
//   cwd: "apps/server",
//   command: "bun run db:generate",
// });

// const db = await D1Database("database", {
//   migrationsDir: "apps/server/src/db/migrations",
// });

export const web = await TanStackStart("web", {
  cwd: "apps/web",
  bindings: {
    VITE_SERVER_URL: process.env.VITE_SERVER_URL || "",
  },
  dev: {
    command: "bun run dev",
  },
});

// export const server = await Worker("server", {
//   cwd: "apps/server",
//   entrypoint: "src/index.ts",
//   compatibility: "node",
//   bindings: {
//     DB: db,
//     CORS_ORIGIN: process.env.CORS_ORIGIN || "",
//   },
//   dev: {
//     port: 3000,
//   },
// });

console.log(`Web    -> ${web.url}`);
// console.log(`Server -> ${server.url}`);

await app.finalize();
