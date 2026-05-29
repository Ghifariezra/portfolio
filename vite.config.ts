import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type UserConfig } from "vite";

const isProd = process.env.NODE_ENV === "production";

// Lebih robust: pakai regex multiline yang tidak bisa di-trick oleh
// string yang mengandung "console.log" sebagai bagian dari konten lain
function dropConsolePlugin() {
	return {
		name: "drop-console",
		transform(code: string, id: string) {
			if (!isProd) return;
			if (!id.match(/\.[jt]sx?$/)) return;
			if (id.includes("node_modules")) return;
			return {
				code: code
					.replace(/\bconsole\.(log|debug|info|warn)\s*\([^)]*\);?/g, "")
					.replace(/\blogger\.(debug|info|warn)\s*\([^)]*\);?/g, ""),
			};
		},
	};
}

export default defineConfig({
	base: "/",

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
				target: "http://127.0.0.1:8787",
				changeOrigin: true,
				secure: false,
			},
		},
	},

	optimizeDeps: {
		include: [
			"@blocknote/core",
			"@blocknote/react",
			"@blocknote/mantine",
			"@blocknote/code-block", // tambah — dipakai langsung
			"shiki",
			"shiki/core", // tambah — Shiki v4 split entry point
			"@shikijs/core",
			"@shikijs/engine-javascript",
		],
		exclude: [],
	},

	build: {
		target: "esnext",
		minify: "esbuild",
		cssMinify: "esbuild", // lebih eksplisit dari `true`
		sourcemap: false,
		reportCompressedSize: false, // skip kalkulasi gzip saat build → lebih cepat
		chunkSizeWarningLimit: 1000,

		rollupOptions: {
			// Aggressive tree-shaking — aman untuk ESM-only deps seperti Shiki
			treeshake: {
				moduleSideEffects: (id) => {
					// Jangan tree-shake CSS imports dan BlockNote (ada side effects)
					if (id.endsWith(".css")) return true;
					if (id.includes("@blocknote")) return true;
					if (id.includes("prosemirror")) return true;
					return false;
				},
			},
			output: {
				chunkFileNames: "assets/js/[name]-[hash].js",
				entryFileNames: "assets/js/[name]-[hash].js",
				assetFileNames: "assets/[ext]/[name]-[hash].[ext]",

				manualChunks(id) {
					if (!id.includes("node_modules")) return;

					// Editor chunk duluan — paling besar, harus dipisah sendiri
					// @shikijs juga masuk sini agar resolve dengan BlockNote
					if (
						id.includes("@blocknote") ||
						id.includes("shiki") ||
						id.includes("@shikijs") ||
						id.includes("prosemirror")
					)
						return "editor-vendor";

					// Router — pisah karena sering update
					if (id.includes("@tanstack/react-router")) return "router";

					// TanStack Query — pisah dari router
					if (id.includes("@tanstack/react-query")) return "query";

					// React core — paling stabil, cache lama
					// react-dom dicek dulu sebelum react/ agar tidak overlap
					if (id.includes("react-dom")) return "react-vendor";
					if (id.includes("/react/") || id.includes("/react@"))
						return "react-vendor";

					// Icons — besar tapi jarang berubah
					if (id.includes("@phosphor-icons")) return "icons";

					// UI utils
					if (
						id.includes("radix-ui") ||
						id.includes("tailwind-merge") ||
						id.includes("clsx") ||
						id.includes("class-variance-authority") ||
						id.includes("next-themes") ||
						id.includes("sonner")
					)
						return "ui-vendor";

					// State & validation
					if (id.includes("zustand") || id.includes("zod"))
						return "state-vendor";

					// Motion
					if (id.includes("motion")) return "motion";

					return "vendor";
				},
			},
		},
	},
} satisfies UserConfig);
