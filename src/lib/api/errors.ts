export interface ApiErrorDetail {
    path: string;
    message: string;
}

export class ApiError extends Error {
    readonly status: number;
    readonly details: ApiErrorDetail[];

    constructor(
        status: number,
        message: string,
        /** Rincian validasi per field dari 422 ({ path, message }); kosong untuk error lain. */
        details: ApiErrorDetail[] = [],
    ) {
        super(message);
        this.status = status;
        this.details = details;
        this.name = "ApiError";
    }
}

/** 404 dari API (mis. repo tidak ada / tidak publik). */
export const isNotFound = (error: unknown): boolean => error instanceof ApiError && error.status === 404;

/** 4xx tidak akan berubah kalau diulang, jadi tidak perlu retry. */
export const isClientError = (error: unknown): boolean => error instanceof ApiError && error.status < 500;

/**
 * API punya dua bentuk error:
 *   { error: "string" }                    -> controller github/azure, 502, 500
 *   { error: { message, details? } }       -> AppError (modul portfolio)
 */
export function extractErrorMessage(body: unknown, fallback: string): string {
    if (body && typeof body === "object" && "error" in body) {
        const err = (body as { error: unknown }).error;
        if (typeof err === "string") return err;
        if (err && typeof err === "object" && "message" in err && typeof err.message === "string") {
            return err.message;
        }
    }
    return fallback;
}

/** details hanya dipakai kalau berupa array { path, message } (422 validasi); error Postgres mengirim string. */
export function extractErrorDetails(body: unknown): ApiErrorDetail[] {
    if (!body || typeof body !== "object" || !("error" in body)) return [];
    const err = (body as { error: unknown }).error;
    if (!err || typeof err !== "object" || !("details" in err) || !Array.isArray(err.details)) return [];

    return err.details.filter(
        (d): d is ApiErrorDetail =>
            !!d && typeof d === "object" && typeof d.path === "string" && typeof d.message === "string",
    );
}

export async function errorFromResponse(res: Response): Promise<ApiError> {
    const fallback = `Request failed (${res.status})`;
    try {
        const body: unknown = await res.json();
        return new ApiError(res.status, extractErrorMessage(body, fallback), extractErrorDetails(body));
    } catch {
        return new ApiError(res.status, fallback);
    }
}

/** Pesan pertama per field. Path "bullets.3" dipetakan ke "bullets". */
export function fieldErrors(error: unknown): Record<string, string> {
    const out: Record<string, string> = {};
    if (error instanceof ApiError) {
        for (const d of error.details) {
            const key = d.path.split(".")[0] || "_";
            out[key] ??= d.message;
        }
    }
    return out;
}
