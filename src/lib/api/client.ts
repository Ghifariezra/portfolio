import { z } from "zod";
import { API_BASE_URL, PUBLIC_API_PREFIX } from "@/config/env";
import { ApiError, extractErrorMessage } from "./errors";

/** GET JSON, lalu validasi bentuknya dengan zod supaya perubahan kontrak API ketahuan di sini, bukan di UI. */
export async function apiGet<T>(path: string, schema: z.ZodType<T>, signal?: AbortSignal): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, { signal, headers: { Accept: "application/json" } });

    if (!res.ok) {
        let message = `Request failed (${res.status})`;
        try {
            message = extractErrorMessage(await res.json(), message);
        } catch {
            // body bukan JSON, pakai pesan default
        }
        throw new ApiError(res.status, message);
    }

    const parsed = schema.safeParse(await res.json());
    if (!parsed.success) {
        console.error(`[api] unexpected response shape for ${path}`, parsed.error.issues);
        throw new ApiError(502, "Unexpected response from the server");
    }
    return parsed.data;
}

/** Untuk endpoint /api/v1/*, yang membungkus hasilnya dalam { data }. */
export async function apiData<T>(path: string, schema: z.ZodType<T>, signal?: AbortSignal): Promise<T> {
    const body = await apiGet(path, z.object({ data: schema }), signal);
    return body.data;
}

/** Shortcut untuk data portfolio: fetchPublic("/projects", schema) -> GET /api/v1/public/projects. */
export const fetchPublic = <T>(path: string, schema: z.ZodType<T>, signal?: AbortSignal): Promise<T> =>
    apiData(`${PUBLIC_API_PREFIX}${path}`, schema, signal);
