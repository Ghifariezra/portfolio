import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
// Tambahkan loadEnv di sini
import { defineConfig, loadEnv, type UserConfig } from "vite";
import Sitemap from "vite-plugin-sitemap";

const isProd = process.env.NODE_ENV === "production";

// 1. Terima parameter apiUrl untuk dinamisasi endpoint
async function getDynamicRoutes(apiUrl: string) {
	try {
		// Gunakan API URL dari env, dengan fallback jika ternyata kosong
		const API_URL = apiUrl || "https://api.ezdev.xyz/api/v1";

		const [projectsRes, notesRes] = await Promise.all([
			fetch(`${API_URL}/projects`),
			fetch(`${API_URL}/notes`)
		]);

		// 2. Fix TS Error: Tentukan tipe kembalian (Type Casting) agar tidak 'unknown'
		type ApiResponse = { data?: { slug: string }[] };

		const projects = (await projectsRes.json()) as ApiResponse;
		const notes = (await notesRes.json()) as ApiResponse;

		// TypeScript sekarang tahu bahwa 'projects' dan 'notes' memiliki properti 'data'
		const projectRoutes = projects.data?.map((p) => `/projects/${p.slug}`) || [];
		const noteRoutes = notes.data?.map((n) => `/notes/${n.slug}`) || [];

		return [...projectRoutes, ...noteRoutes];
	} catch (error) {
		console.error("Gagal mengambil dynamic routes untuk sitemap:", error);
		return [];
	}
}

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

// 3. Destructure 'mode' selain 'command'
export default defineConfig(async ({ command, mode }): Promise<UserConfig> => {
	// 4. Load semua environment variables (baik dari file .env lokal maupun dari GitHub Actions)
	const env = loadEnv(mode, process.cwd(), "");
	const apiUrl = env.VITE_API_URL || process.env.VITE_API_URL || "";

	// 5. Lempar apiUrl ke fungsi getDynamicRoutes
	const dynamicRoutes = command === "build" ? await getDynamicRoutes(apiUrl) : [];

	return {
		base: "/",

		plugins: [
			dropConsolePlugin(),
			TanStackRouterVite({ autoCodeSplitting: true }),
			react(),
			tailwindcss(),
			Sitemap({
				hostname: "https://ezdev.xyz",
				dynamicRoutes: dynamicRoutes,
				exclude: ["/auth/admin", "/dashboard"],
				generateRobotsTxt: true,
				robots: [{ userAgent: '*', allow: '/' }]
			})
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
				"@blocknote/code-block",
				"shiki",
				"shiki/core",
				"@shikijs/core",
				"@shikijs/engine-javascript",
			],
			exclude: [],
		},

		build: {
			target: "esnext",
			minify: "esbuild",
			cssMinify: "esbuild",
			sourcemap: false,
			reportCompressedSize: false,
			chunkSizeWarningLimit: 1000,

			rollupOptions: {
				treeshake: {
					moduleSideEffects: (id) => {
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

						if (
							id.includes("@blocknote") ||
							id.includes("shiki") ||
							id.includes("@shikijs") ||
							id.includes("prosemirror")
						)
							return "editor-vendor";

						if (id.includes("@tanstack/react-router")) return "router";
						if (id.includes("@tanstack/react-query")) return "query";
						if (id.includes("react-dom")) return "react-vendor";
						if (id.includes("/react/") || id.includes("/react@"))
							return "react-vendor";
						if (id.includes("@phosphor-icons")) return "icons";

						if (
							id.includes("radix-ui") ||
							id.includes("tailwind-merge") ||
							id.includes("clsx") ||
							id.includes("class-variance-authority") ||
							id.includes("next-themes") ||
							id.includes("sonner")
						)
							return "ui-vendor";

						if (id.includes("zustand") || id.includes("zod"))
							return "state-vendor";

						if (id.includes("motion")) return "motion";

						return "vendor";
					},
				},
			},
		},
	};
});