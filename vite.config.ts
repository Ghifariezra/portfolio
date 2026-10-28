/// <reference types="vitest" />

import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import { preconnect, preloadFonts, seedHome } from "./vite-perf-plugins.ts";

const isProd = process.env.NODE_ENV === "production";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const apiOrigin = /^https?:\/\//.test(env.VITE_API_URL ?? "") ? new URL(env.VITE_API_URL).origin : null;

    return {
        base: "/",
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
        plugins: [
            TanStackRouterVite({ autoCodeSplitting: true }),
            react(),
            tailwindcss(),
            preconnect([
                ...(apiOrigin ? [{ href: apiOrigin, crossorigin: true }] : []),
                { href: "https://fegnkzxvhxnbvqkhuzfo.supabase.co" }, // gambar project: tanpa crossorigin
            ]),
            preloadFonts(),
            seedHome(env.VITE_API_URL),
            process.env.ANALYZE
                ? visualizer({ filename: "stats.html", gzipSize: true, brotliSize: true, template: "treemap" })
                : null,
        ],
        resolve: {
            alias: { "@": path.resolve(import.meta.dirname, "./src") },
        },
        server: {
            proxy: {
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
            include: ["src/**/*.{test,spec}.{ts,tsx}", "tests/unit/**/*.{test,spec}.{ts,tsx}"],
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
                        const pkg = id.split("node_modules/").pop() ?? "";

                        if (pkg.startsWith("@tanstack/react-router")) return "router";
                        if (pkg.startsWith("@tanstack/react-query")) return "query";
                        if (/^(react-dom|react|scheduler)\//.test(pkg)) return "react-vendor";
                        if (pkg.startsWith("zod/")) return "validation-vendor";
                    },
                },
            },
        },
    };
});
