import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import EnvironmentPlugin from "vite-plugin-environment";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		EnvironmentPlugin(["VITE_GITHUB_TOKEN", "VITE_GITHUB_URL"]),
	],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./vitest.setup.ts",
	},
});
