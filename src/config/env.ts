// Dev: VITE_API_URL=/api (lewat proxy Vite, tanpa CORS). Production: URL Worker, lihat .env.production.
// Semua path request diawali "/" dan sudah menyertakan prefix API-nya sendiri
// (mis. "/projects/:repo", "/azure/apps/:id/analytics"), kecuali data portfolio yang memakai PUBLIC_API_PREFIX.
export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/+$/, "");

/** Prefix endpoint data portfolio (DB). Respons dibungkus { data }. */
export const PUBLIC_API_PREFIX = "/api/v1/public";
