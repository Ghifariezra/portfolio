import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type UserConfig } from "vite";

const isProd = process.env.NODE_ENV === "production";

function dropConsolePlugin() {
	return {
		name: "drop-console",
		transform(code: string, id: string) {
			if (!isProd) return;
			if (!id.match(/\.[jt]sx?$/)) return;
			if (id.includes("node_modules")) return;
			return {
				// Ganti dengan cara yang lebih aman: replace ke void 0
				code: code
					.replace(/\bconsole\.(log|debug|info|warn)\s*\(.*?\);?/gs, "")
					.replace(/\blogger\.(debug|info|warn)\s*\(.*?\);?/gs, ""),
			};
		},
	};
}

export default defineConfig({
  base: "/portfolio/",
	plugins: [
		dropConsolePlugin(),
		TanStackRouterVite({ autoCodeSplitting: true }),
		react(),
		tailwindcss(),
	],

	resolve: {
		alias: { "@": path.resolve(__dirname, "./src") },
	},

	server: {
		proxy: {
			"/api/v1": {
				target: process.env.VITE_API_URL ?? "localhost:8080",
				changeOrigin: true,
				secure: true,
			},
		},
	},

	// Biarkan Vite 8 pakai Oxc default (lebih cepat dari Rollup untuk dev)
	// optimizeDeps tidak perlu dioverride

	build: {
		target: "esnext",
		minify: "esbuild", // eksplisit, lebih cepat dari terser
		cssMinify: true,
		sourcemap: false,
		// Pisah CSS per chunk agar tidak semua CSS dimuat sekaligus
		cssCodeSplit: true,

		rollupOptions: {
			output: {
				// Nama file yang lebih predictable untuk caching
				chunkFileNames: "assets/js/[name]-[hash].js",
				entryFileNames: "assets/js/[entry]-[hash].js",
				assetFileNames: "assets/[ext]/[name]-[hash].[ext]",

				manualChunks(id) {
					if (!id.includes("node_modules")) return;

					// React core — paling jarang berubah, cache paling lama
					if (id.includes("react-dom")) return "react-dom";
					if (id.includes("/react/") || id.includes("/react@"))
						return "react-core";

					// Routing
					if (id.includes("@tanstack/react-router")) return "router";

					// Data fetching
					if (id.includes("@tanstack/react-query")) return "query";
					if (id.includes("axios")) return "axios";

					// State & forms
					if (id.includes("@tanstack/react-form")) return "form";
					if (id.includes("zustand")) return "zustand";
					if (id.includes("zod")) return "zod";

					// Icons — besar, pisah sendiri
					if (id.includes("@phosphor-icons")) return "icons";

					// Fonts — sudah di-handle CSS, tidak perlu di sini
					if (id.includes("@fontsource")) return "fonts";

					// UI primitives
					if (id.includes("radix-ui")) return "radix";
					if (
						id.includes("class-variance-authority") ||
						id.includes("clsx") ||
						id.includes("tailwind-merge")
					)
						return "ui-utils";

					// Theming
					if (id.includes("next-themes")) return "themes";

					// Fallback
					return "vendor";
				},
			},
		},

		// Portfolio realistis: warn di 500kb, bukan 1MB
		chunkSizeWarningLimit: 500,
	},
} satisfies UserConfig);
