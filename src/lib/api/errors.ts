export class ApiError extends Error {
    constructor(
        readonly status: number,
        message: string,
    ) {
        super(message);
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
