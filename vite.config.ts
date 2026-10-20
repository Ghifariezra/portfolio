/// <reference types="vitest" />
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
    base: "/",

    // OPTIMASI 1: Gunakan esbuild untuk menghapus console & logger (Blazing Fast)
    esbuild: {
        pure: isProd
            ? [
                  "console.log",
                  "console.info",
                  "console.debug",
                  "console.warn",
                  "logger.info",
                  "logger.debug",
                  "logger.warn",
              ]
            : [],
    },

    plugins: [TanStackRouterVite({ autoCodeSplitting: true }), react(), tailwindcss()],

    resolve: {
        alias: { "@": path.resolve(__dirname, "./src") },
    },

    server: {
        proxy: {
            // Dev: panggil API lewat /api (set VITE_API_URL=/api).
            // Menghindari CORS, karena API belum punya middleware CORS.
            "/api": {
                target: "http://127.0.0.1:8787",
                changeOrigin: true,
                secure: false,
                rewrite: (p) => p.replace(/^\/api/, ""),
            },
        },
    },

    test: {
        globals: true,
        environment: "jsdom",
        // setupFiles: ["./test/setup.ts"],
        include: ["src/**/*.{test,spec}.{ts,tsx}", "test/**/*.{test,spec}.{ts,tsx}"],
        exclude: ["node_modules", "dist"],
        passWithNoTests: true,
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            exclude: ["node_modules", "src/routeTree.gen.ts", "src/main.tsx", "**/*.d.ts"],
        },
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

                    // OPTIMASI 3: Amankan module yang hanya berisi efek samping global
                    if (id.includes("@fontsource-variable")) return true;

                    return false;
                },
            },
            output: {
                chunkFileNames: "assets/js/[name]-[hash].js",
                entryFileNames: "assets/js/[name]-[hash].js",
                assetFileNames: "assets/[ext]/[name]-[hash].[ext]",

                manualChunks(id) {
                    if (!id.includes("node_modules")) return;

                    // OPTIMASI 2A: Pisahkan Ekosistem Markdown (Sangat Berat)
                    if (
                        id.includes("react-markdown") ||
                        id.includes("remark") ||
                        id.includes("rehype") ||
                        id.includes("micromark") ||
                        id.includes("mdast")
                    )
                        return "markdown-vendor";

                    // Framework & Routing
                    if (id.includes("@tanstack/react-router")) return "router";
                    if (id.includes("@tanstack/react-query")) return "query";
                    if (id.includes("react-dom") || id.includes("/react/") || id.includes("/react@"))
                        return "react-vendor";

                    if (id.includes("@phosphor-icons")) return "icons";

                    // UI & Validation
                    if (
                        id.includes("radix-ui") ||
                        id.includes("tailwind-merge") ||
                        id.includes("clsx") ||
                        id.includes("class-variance-authority") ||
                        id.includes("next-themes")
                    )
                        return "ui-vendor";

                    if (id.includes("zod")) return "validation-vendor";

                    return "vendor";
                },
            },
        },
    },
});
