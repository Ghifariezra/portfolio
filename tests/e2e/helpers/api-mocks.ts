import type { Page, Route } from "@playwright/test";

// Backend bisa beda origin dari app (production), jadi response mock harus ikut mengizinkan CORS
const CORS_HEADERS = { "access-control-allow-origin": "*" };

// Segmen ini selalu ada di endpoint portfolio, apa pun isi VITE_API_URL
// (mis. "/api/api/v1/public/..." lewat proxy dev, atau "/api/v1/public/..." di URL Worker)
const PUBLIC = "/api/v1/public";

// Request dokumen halaman (/projects/<slug>) jangan ikut dicegat, hanya fetch/xhr
const isApiCall = (route: Route) => ["fetch", "xhr"].includes(route.request().resourceType());

/** GET .../api/v1/public/projects */
export const isProjectsList = (url: URL) => url.pathname.replace(/\/+$/, "").endsWith(`${PUBLIC}/projects`);

/** GET .../api/v1/public/projects/<slug> */
export const isProjectDetail = (url: URL) => url.pathname.includes(`${PUBLIC}/projects/`);

/** GET <API_BASE_URL>/projects/<repo>: data live GitHub, tanpa prefix /api/v1/public */
export const isGithubRepo = (url: URL) =>
    !url.pathname.includes(`${PUBLIC}/`) && /\/projects\/[^/]+/.test(url.pathname);

/** GET .../api/v1/public/apps */
export const isAppsList = (url: URL) => url.pathname.replace(/\/+$/, "").endsWith(`${PUBLIC}/apps`);

/** GET <API_BASE_URL>/azure/apps/<storeId>/analytics: data Microsoft Partner Center, tanpa prefix /api/v1/public */
export const isStoreAnalytics = (url: URL) => /\/azure\/apps\/[^/]+\/analytics\/?$/.test(url.pathname);

/** Ganti response endpoint yang cocok dengan status dan body tertentu. */
export async function mockResponse(page: Page, match: (url: URL) => boolean, status: number, body: unknown) {
    await page.route(match, (route) => {
        if (!isApiCall(route)) return route.fallback();
        return route.fulfill({ status, headers: CORS_HEADERS, json: body });
    });
}

/**
 * Ambil response detail project yang asli, lalu paksa `github_repo` terisi supaya
 * GithubSection pasti dirender (tanpa ini, section-nya tidak ada kalau project tidak punya repo).
 */
export async function forceGithubRepo(page: Page, repo = "octocat/hello-world") {
    await page.route(isProjectDetail, async (route) => {
        if (!isApiCall(route)) return route.fallback();

        const response = await route.fetch();
        if (!response.ok()) return route.fulfill({ response });

        const body = (await response.json()) as { data: Record<string, unknown> };
        return route.fulfill({ response, json: { ...body, data: { ...body.data, github_repo: repo } } });
    });
}

/**
 * Ambil response list app yang asli, lalu timpa field app PERTAMA (mis. status dan store ID),
 * supaya kartu pertama pasti berada di kondisi yang mau diuji, apa pun isi data aslinya.
 */
export async function patchFirstApp(page: Page, overrides: Record<string, unknown>) {
    await page.route(isAppsList, async (route) => {
        if (!isApiCall(route)) return route.fallback();

        const response = await route.fetch();
        if (!response.ok()) return route.fulfill({ response });

        const body = (await response.json()) as { data: Record<string, unknown>[] };
        const [first, ...rest] = body.data;
        if (!first) return route.fulfill({ response });

        return route.fulfill({ response, json: { ...body, data: [{ ...first, ...overrides }, ...rest] } });
    });
}