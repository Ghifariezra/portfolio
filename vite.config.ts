import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type UserConfig } from "vite";
import Sitemap from "vite-plugin-sitemap";

const isProd = process.env.NODE_ENV === "production";

// 1. Terima parameter apiUrl untuk dinamisasi endpoint
async function getDynamicRoutes(apiUrl: string) {
	try {
		const API_URL = apiUrl || "https://api.ezdev.xyz/api/v1";

		const [projectsRes, blogsRes] = await Promise.all([
			fetch(`${API_URL}/projects`),
			fetch(`${API_URL}/blogs`),
		]);

		type ApiResponse = { data?: { slug: string }[] };

		const projects = (await projectsRes.json()) as ApiResponse;
		const blogs = (await blogsRes.json()) as ApiResponse;

		const staticRoutes = ["/projects", "/notes", "/contact", "/apps"];
		const projectRoutes = projects.data?.map((p) => `/projects/${p.slug}`) || [];
		const noteRoutes = blogs.data?.map((b) => `/notes/${b.slug}`) || [];

		return [...staticRoutes, ...projectRoutes, ...noteRoutes];
	} catch (error) {
		console.error("Gagal mengambil dynamic routes untuk sitemap:", error);
		return ["/projects", "/notes", "/contact", "/apps"];
	}
}

// FUNGSI dropConsolePlugin DIHAPUS - Kita gunakan esbuild native yang jauh lebih cepat

export default defineConfig(async ({ command, mode }): Promise<UserConfig> => {
	const env = loadEnv(mode, process.cwd(), "");
	const apiUrl = env.VITE_API_URL || process.env.VITE_API_URL || "";

	const dynamicRoutes = command === "build" ? await getDynamicRoutes(apiUrl) : [];

	return {
		base: "/",

		// OPTIMASI 1: Gunakan esbuild untuk menghapus console & logger (Blazing Fast)
		esbuild: {
			pure: isProd
				? ['console.log', 'console.info', 'console.debug', 'console.warn', 'logger.info', 'logger.debug', 'logger.warn']
				: [],
		},

		plugins: [
			TanStackRouterVite({ autoCodeSplitting: true }),
			react(),
			tailwindcss(),
			Sitemap({
				hostname: "https://ezdev.xyz",
				dynamicRoutes: dynamicRoutes,
				exclude: ["/auth/admin", "/dashboard"],
				generateRobotsTxt: true,
				robots: [{ userAgent: "*", allow: "/" }],
			}),
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

						// OPTIMASI 3: Amankan module yang hanya berisi efek samping global
						if (id.includes("@fontsource-variable")) return true;
						if (id.includes("@xyflow")) return true;

						return false;
					},
				},
				output: {
					chunkFileNames: "assets/js/[name]-[hash].js",
					entryFileNames: "assets/js/[name]-[hash].js",
					assetFileNames: "assets/[ext]/[name]-[hash].[ext]",

					manualChunks(id) {
						if (!id.includes("node_modules")) return;

						// Editor
						if (
							id.includes("@blocknote") ||
							id.includes("shiki") ||
							id.includes("@shikijs") ||
							id.includes("prosemirror")
						) return "editor-vendor";

						// OPTIMASI 2A: Pisahkan Ekosistem Markdown (Sangat Berat)
						if (
							id.includes("react-markdown") ||
							id.includes("remark") ||
							id.includes("rehype") ||
							id.includes("micromark") ||
							id.includes("mdast")
						) return "markdown-vendor";

						// OPTIMASI 2B: Pisahkan Ekosistem React Flow & Dagre
						if (
							id.includes("@xyflow") ||
							id.includes("dagre")
						) return "flow-vendor";

						// Framework & Routing
						if (id.includes("@tanstack/react-router")) return "router";
						if (id.includes("@tanstack/react-query")) return "query";
						if (id.includes("react-dom") || id.includes("/react/") || id.includes("/react@")) return "react-vendor";

						// Tambahan: Gabungkan lucide-react bersama phosphor
						if (id.includes("@phosphor-icons") || id.includes("lucide-react")) return "icons";

						// UI & State
						if (
							id.includes("radix-ui") ||
							id.includes("tailwind-merge") ||
							id.includes("clsx") ||
							id.includes("class-variance-authority") ||
							id.includes("next-themes") ||
							id.includes("sonner")
						) return "ui-vendor";

						if (id.includes("zustand") || id.includes("zod")) return "state-vendor";
						if (id.includes("motion")) return "motion";

						return "vendor";
					},
				},
			},
		},
	};
});