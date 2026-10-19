import { z } from "zod";
import { ADMIN_API_PREFIX, API_BASE_URL } from "@/config/env";
import { adminToken } from "@/lib/auth/admin-token";
import { ApiError, errorFromResponse } from "./errors";

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

function send(method: Method, path: string, token: string, body?: unknown, signal?: AbortSignal): Promise<Response> {
    const hasBody = body !== undefined;
    return fetch(`${API_BASE_URL}${ADMIN_API_PREFIX}${path}`, {
        method,
        signal,
        cache: "no-store", // data tersembunyi, jangan pernah dari cache browser
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            ...(hasBody ? { "Content-Type": "application/json" } : {}),
        },
        body: hasBody ? JSON.stringify(body) : undefined,
    });
}

/**
 * Request ke /api/v1/admin/*. Respons dibungkus { data } lalu divalidasi dengan zod.
 * 401 = token ditolak server: token dihapus, dan AdminShell otomatis mengarahkan ke halaman login.
 */
export async function adminRequest<T>(
    method: Method,
    path: string,
    schema: z.ZodType<T>,
    body?: unknown,
    signal?: AbortSignal,
): Promise<T> {
    const token = adminToken.get();
    if (!token) throw new ApiError(401, "Not signed in");

    const res = await send(method, path, token, body, signal);
    if (res.status === 401) adminToken.clear();
    if (!res.ok) throw await errorFromResponse(res);

    const parsed = z.object({ data: schema }).safeParse(await res.json());
    if (!parsed.success) {
        console.error(`[api] unexpected response shape for ${method} ${path}`, parsed.error.issues);
        throw new ApiError(502, "Unexpected response from the server");
    }
    return parsed.data.data;
}

export const adminGet = <T>(path: string, schema: z.ZodType<T>, signal?: AbortSignal): Promise<T> =>
    adminRequest("GET", path, schema, undefined, signal);

/** Cek token ke endpoint admin yang paling ringan. Throw ApiError kalau ditolak (401) atau API belum siap (503). */
export async function verifyAdminToken(token: string): Promise<void> {
    const res = await send("GET", "/profile", token);
    if (!res.ok) throw await errorFromResponse(res);
}
