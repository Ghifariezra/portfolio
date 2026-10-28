import type { Plugin } from "vite";

type Origin = { href: string; crossorigin?: boolean };

export function preconnect(origins: Origin[]): Plugin {
    return {
        name: "preconnect-origins",
        apply: "build",
        transformIndexHtml: {
            order: "pre",
            handler() {
                return origins.map(({ href, crossorigin }) => ({
                    tag: "link",
                    attrs: { rel: "preconnect", href, ...(crossorigin ? { crossorigin: true } : {}) },
                    injectTo: "head-prepend" as const,
                }));
            },
        },
    };
}

export function preloadFonts(): Plugin {
    const WANTED = [/inter-latin-wght-normal/, /space-grotesk-latin-wght-normal/];
    let base = "/";

    return {
        name: "preload-fonts",
        apply: "build",
        configResolved(config) {
            base = config.base;
        },
        transformIndexHtml: {
            order: "post",
            handler(_html, ctx) {
                const files = Object.keys(ctx.bundle ?? {}).filter(
                    (file) => file.endsWith(".woff2") && WANTED.some((re) => re.test(file)),
                );
                return files.map((file) => ({
                    tag: "link",
                    attrs: { rel: "preload", as: "font", type: "font/woff2", href: `${base}${file}`, crossorigin: "" },
                    injectTo: "head" as const,
                }));
            },
        },
    };
}

export function seedHome(apiBase: string | undefined): Plugin {
    return {
        name: "seed-home",
        apply: "build",
        async transformIndexHtml() {
            if (!apiBase || !/^https?:\/\//.test(apiBase)) {
                console.warn(
                    `[seed-home] dilewati: VITE_API_URL harus URL absolut saat build (sekarang: ${apiBase || "kosong"})`,
                );
                return [];
            }

            const get = async (path: string) => {
                const res = await fetch(`${apiBase.replace(/\/+$/, "")}/api/v1/public${path}`, {
                    headers: { Accept: "application/json" },
                    signal: AbortSignal.timeout(8000),
                });
                if (!res.ok) throw new Error(`${path} -> ${res.status}`);
                return ((await res.json()) as { data: unknown }).data;
            };

            try {
                const [profile, projects] = await Promise.all([get("/profile"), get("/projects")]);
                const json = JSON.stringify({ builtAt: Date.now(), profile, projects }).replace(/</g, "\\u003c");
                return [
                    {
                        tag: "script",
                        attrs: { id: "__SEED__", type: "application/json" },
                        children: json,
                        injectTo: "head" as const,
                    },
                ];
            } catch (error) {
                console.warn("[seed-home] dilewati:", error);
                return [];
            }
        },
    };
}
