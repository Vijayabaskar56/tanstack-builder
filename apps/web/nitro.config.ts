import { defineNitroConfig } from "nitropack/config";

export default defineNitroConfig({
    preset: "cloudflare-module",
    cloudflare: {
        nodeCompat: true,
    },
});
