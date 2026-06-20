import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Axios apiClient Specification", () => {
    beforeEach(() => {
        // Bersihkan module cache agar config baseURL dievaluasi ulang setiap test
        vi.resetModules();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllEnvs();
    });

    describe("Environment & Configuration Setup", () => {
        it("harus menggunakan baseURL '/api/v1' saat di mode development", async () => {
            const originalDev = import.meta.env.DEV;
            import.meta.env.DEV = true;

            try {
                // Import dinamis agar nilai DEV yang baru langsung terbaca
                const { apiClient } = await import("../../src/utils/middleware");

                expect(apiClient.defaults.baseURL).toBe("/api/v1");
                expect(apiClient.defaults.withCredentials).toBe(true);
            } finally {
                import.meta.env.DEV = originalDev;
            }
        });

        it("harus menggunakan VITE_API_URL sebagai baseURL saat di mode production", async () => {
            const originalDev = import.meta.env.DEV;
            const originalUrl = (import.meta.env as any).VITE_API_URL;

            // Manipulasi environment ke mode production dengan dummy URL
            import.meta.env.DEV = false;
            (import.meta.env as any).VITE_API_URL = "https://api.ezdev.xyz/api/v1";

            try {
                const { apiClient } = await import("../../src/utils/middleware");

                expect(apiClient.defaults.baseURL).toBe("https://api.ezdev.xyz/api/v1");
            } finally {
                // Kembalikan ke state awal
                import.meta.env.DEV = originalDev;
                (import.meta.env as any).VITE_API_URL = originalUrl;
            }
        });
    });

    describe("Interceptors Behavior", () => {
        it("Response Success: Harus mengekstrak 'response.data' saja", async () => {
            const { apiClient } = await import("../../src/utils/middleware");

            // MOCK ADAPTER: Cegat request internet dan pura-pura mengembalikan sukses 200 OK
            apiClient.defaults.adapter = async (config) => {
                return {
                    data: { success: true, data: "Ini payload asli dari server" },
                    status: 200,
                    statusText: "OK",
                    headers: {},
                    config,
                    request: {},
                };
            };

            // Act: Coba panggil endpoint sembarang
            const response = await apiClient.get("/users");

            // Assert: Interceptor seharusnya membuang status, headers, dll, dan HANYA me-return data
            expect(response).toEqual({ success: true, data: "Ini payload asli dari server" });
        });

        it("Response Error (API Rejects): Harus melempar error response.data dari backend", async () => {
            const { apiClient } = await import("../../src/utils/middleware");

            // MOCK ADAPTER: Pura-pura server merespons dengan HTTP Error (misal 400 Bad Request)
            apiClient.defaults.adapter = async (config) => {
                const error: any = new Error("Request failed with status code 400");
                error.isAxiosError = true;
                // error.response.data adalah struktur standar jika backend berhasil menolak request
                error.response = {
                    data: { success: false, error: "Invalid credentials" },
                    status: 400,
                    statusText: "Bad Request",
                    headers: {},
                    config,
                };
                throw error;
            };

            // Assert: Expect Promise-nya di-reject dengan payload data aslinya
            await expect(apiClient.get("/login")).rejects.toEqual({
                success: false,
                error: "Invalid credentials",
            });
        });

        it("Response Error (Network Crash): Harus melakukan fallback ke pesan error default", async () => {
            const { apiClient } = await import("../../src/utils/middleware");

            // MOCK ADAPTER: Pura-pura koneksi internet putus / server mati (error.response = undefined)
            apiClient.defaults.adapter = async () => {
                const error: any = new Error("Network Error");
                error.isAxiosError = true;
                throw error;
            };

            // Assert: Karena error.response tidak ada, interceptor harus menggunakan custom format fallback
            await expect(apiClient.get("/ping")).rejects.toEqual({
                success: false,
                error: "Network Error", // Sesuai dengan error.message || "An unexpected error occurred"
            });
        });
    });
});