// Dev: VITE_API_URL=/api (lewat proxy Vite, tanpa CORS). Production: URL Worker, lihat .env.production.
// Semua path request diawali "/" dan sudah menyertakan prefix API-nya sendiri
// (mis. "/projects/:repo", "/azure/apps/:id/analytics"), kecuali data portfolio yang memakai
// PUBLIC_API_PREFIX (publik) dan ADMIN_API_PREFIX (CRUD, butuh bearer token).
export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/+$/, "");

/** Prefix endpoint data portfolio (DB). Respons dibungkus { data }. */
export const PUBLIC_API_PREFIX = "/api/v1/public";

/** CRUD penuh termasuk data tersembunyi. Header Authorization: Bearer <ADMIN_API_TOKEN>. */
export const ADMIN_API_PREFIX = "/api/v1/admin";
