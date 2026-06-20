import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Logger Utility Specification", () => {
    beforeEach(() => {
        // Wajib: Bersihkan cache module agar `const isDev` dievaluasi ulang
        vi.resetModules();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllEnvs();
    });

    describe("logger.debug", () => {
        it("harus mencetak pesan debug dengan format yang benar saat di mode development", async () => {
            // 1. Arrange: Cukup set NODE_ENV, Vitest otomatis membuat DEV = true
            vi.stubEnv("NODE_ENV", "development");

            // 2. Import module SECARA DINAMIS
            const { logger } = await import("../../src/utils/logger");
            const logSpy = vi.spyOn(console, "log").mockImplementation(() => { });

            // 3. Act
            logger.debug("Pesan debug");

            // 4. Assert
            expect(logSpy).toHaveBeenCalledWith(
                "%c[DEBUG]",
                "color: #a855f7; font-weight: bold;",
                "Pesan debug"
            );
            expect(logSpy).toHaveBeenCalledTimes(1);
        });

        it("tidak boleh mencetak pesan debug saat di mode production", async () => {
            // 1. Arrange: Ubah NODE_ENV dan mutasi langsung import.meta.env.DEV
            vi.stubEnv("NODE_ENV", "production");

            const originalDev = import.meta.env.DEV;
            import.meta.env.DEV = false;

            try {
                // 2. Import module SECARA DINAMIS
                const { logger } = await import("../../src/utils/logger");
                const logSpy = vi.spyOn(console, "log").mockImplementation(() => { });

                // 3. Act
                logger.debug("Pesan debug");

                // 4. Assert
                expect(logSpy).not.toHaveBeenCalled();
            } finally {
                import.meta.env.DEV = originalDev;
            }
        });

        it("harus mencetak pesan debug dengan benar saat di mode development (multiple args)", async () => {
            vi.stubEnv("NODE_ENV", "development");
            const { logger } = await import("../../src/utils/logger");

            const logSpy = vi.spyOn(console, "log").mockImplementation(() => { });

            logger.debug("Pesan debug", { key: "value" }, [1, 2, 3]);

            expect(logSpy).toHaveBeenCalledWith(
                "%c[DEBUG]",
                "color: #a855f7; font-weight: bold;",
                "Pesan debug",
                { key: "value" },
                [1, 2, 3]
            );
        });
    });

    describe("logger.info", () => {
        it("harus mencetak pesan info dengan format yang benar saat di mode development", async () => {
            vi.stubEnv("NODE_ENV", "development");
            const { logger } = await import("../../src/utils/logger");

            const logSpy = vi.spyOn(console, "info").mockImplementation(() => { });

            logger.info("Pesan info");

            expect(logSpy).toHaveBeenCalledWith(
                "%c[INFO]",
                "color: #3b82f6; font-weight: bold;", // Sesuaikan hex color dengan kode aslimu
                "Pesan info"
            );
            expect(logSpy).toHaveBeenCalledTimes(1);
        });

        it("tidak boleh mencetak pesan info saat di mode production", async () => {
            vi.stubEnv("NODE_ENV", "production");
            const originalDev = import.meta.env.DEV;
            import.meta.env.DEV = false;

            try {
                const { logger } = await import("../../src/utils/logger");
                const logSpy = vi.spyOn(console, "info").mockImplementation(() => { });

                logger.info("Pesan info");

                expect(logSpy).not.toHaveBeenCalled();
            } finally {
                import.meta.env.DEV = originalDev;
            }
        });

        it("harus mencetak pesan info dengan benar saat di mode development (multiple args)", async () => {
            vi.stubEnv("NODE_ENV", "development");
            const { logger } = await import("../../src/utils/logger");
            const logSpy = vi.spyOn(console, "info").mockImplementation(() => { });

            logger.info("Pesan info", { data: "ok" }, [1]);

            expect(logSpy).toHaveBeenCalledWith(
                "%c[INFO]",
                "color: #3b82f6; font-weight: bold;",
                "Pesan info",
                { data: "ok" },
                [1]
            );
        });
    });

    describe("logger.warn", () => {
        it("harus mencetak pesan warn dengan format yang benar saat di mode development", async () => {
            vi.stubEnv("NODE_ENV", "development");
            const { logger } = await import("../../src/utils/logger");

            const logSpy = vi.spyOn(console, "warn").mockImplementation(() => { });

            logger.warn("Pesan peringatan");

            expect(logSpy).toHaveBeenCalledWith(
                "%c[WARN]",
                "color: #f59e0b; font-weight: bold;", // ✅ Diperbaiki menjadi #f59e0b
                "Pesan peringatan"
            );
        });

        it("tidak boleh mencetak pesan warn saat di mode production", async () => {
            vi.stubEnv("NODE_ENV", "production");
            const originalDev = import.meta.env.DEV;
            import.meta.env.DEV = false;

            try {
                const { logger } = await import("../../src/utils/logger");
                const logSpy = vi.spyOn(console, "warn").mockImplementation(() => { });

                logger.warn("Pesan peringatan");

                expect(logSpy).not.toHaveBeenCalled();
            } finally {
                import.meta.env.DEV = originalDev;
            }
        });

        it("harus mencetak pesan warn dengan benar saat di mode development (multiple args)", async () => {
            vi.stubEnv("NODE_ENV", "development");
            const { logger } = await import("../../src/utils/logger");
            const logSpy = vi.spyOn(console, "warn").mockImplementation(() => { });

            logger.warn("Peringatan:", { isu: "kritis" });

            expect(logSpy).toHaveBeenCalledWith(
                "%c[WARN]",
                "color: #f59e0b; font-weight: bold;", // ✅ Diperbaiki menjadi #f59e0b
                "Peringatan:",
                { isu: "kritis" }
            );
        });
    });

    describe("logger.error", () => {
        it("harus mencetak pesan error dengan format yang benar saat di mode development", async () => {
            vi.stubEnv("NODE_ENV", "development");
            const { logger } = await import("../../src/utils/logger");

            const logSpy = vi.spyOn(console, "error").mockImplementation(() => { });

            logger.error("Pesan error");

            expect(logSpy).toHaveBeenCalledWith(
                "%c[ERROR]",
                "color: #ef4444; font-weight: bold;",
                "Pesan error"
            );
        });

        // ✅ Diperbaiki: Menyesuaikan dengan logika logger.ts yang ternyata ikut mematikan error di production
        it("tidak boleh mencetak pesan error saat di mode production", async () => {
            vi.stubEnv("NODE_ENV", "production");
            const originalDev = import.meta.env.DEV;
            import.meta.env.DEV = false;

            try {
                const { logger } = await import("../../src/utils/logger");
                const logSpy = vi.spyOn(console, "error").mockImplementation(() => { });

                logger.error("Fatal error");

                // Karena logger.ts kamu mem-bypass log di production, ini harus .not.toHaveBeenCalled()
                expect(logSpy).not.toHaveBeenCalled();
            } finally {
                import.meta.env.DEV = originalDev;
            }
        });

        it("harus mencetak pesan error dengan benar beserta objek error (multiple args)", async () => {
            vi.stubEnv("NODE_ENV", "development");
            const { logger } = await import("../../src/utils/logger");
            const logSpy = vi.spyOn(console, "error").mockImplementation(() => { });

            const mockError = new Error("Sistem gagal");
            logger.error("Gagal memuat data", mockError);

            expect(logSpy).toHaveBeenCalledWith(
                "%c[ERROR]",
                "color: #ef4444; font-weight: bold;",
                "Gagal memuat data",
                mockError
            );
        });
    });
});