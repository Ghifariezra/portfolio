import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import dengan struktur foldermu
import {
    AnalyticsService,
    analyticsService,
    type AnalyticsOverviewResponse
} from "../../src/lib/services/analytics.service";

describe("AnalyticsService Specification", () => {
    describe("Singleton Pattern", () => {
        it("harus mengembalikan instance yang sama setiap kali getInstance dipanggil", () => {
            const instance1 = AnalyticsService.getInstance();
            const instance2 = AnalyticsService.getInstance();

            // Menggunakan .toBe() untuk memastikan object reference di memori sama persis
            expect(instance1).toBe(instance2);
        });

        it("variabel yang di-export (analyticsService) harus merujuk ke instance tunggal", () => {
            const instance = AnalyticsService.getInstance();
            expect(analyticsService).toBe(instance);
        });
    });

    describe("getOverviewAnalytics", () => {
        let getSpy: any;

        beforeEach(() => {
            // Karena 'api' bersifat protected, kita gunakan ["api"] untuk mem-bypass TypeScript
            // Kita memata-matai fungsi 'get' dari apiClient (this.api)
            getSpy = vi.spyOn(analyticsService["api"], "get");
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        it("harus memanggil endpoint '/analytics/overview' dengan method GET", async () => {
            // Arrange: Pura-pura API me-return success kosong
            getSpy.mockResolvedValue({ success: true, data: {} });

            // Act
            await analyticsService.getOverviewAnalytics();

            // Assert: Pastikan api.get dipanggil persis 1x dengan URL yang benar
            expect(getSpy).toHaveBeenCalledTimes(1);
            expect(getSpy).toHaveBeenCalledWith("/analytics/overview");
        });

        it("harus mengembalikan data AnalyticsOverviewResponse saat API sukses", async () => {
            // Arrange: Buat data dummy atau mock yang sesuai dengan interface
            const mockOverviewData: AnalyticsOverviewResponse = {
                metrics: {
                    total_projects: 10,
                    new_projects_this_week: 2,
                    published_blogs: 5,
                    unread_messages: 1,
                    pending_jobs: 0,
                    publish_status_summary: { draft: 1, scheduled: 0, published: 5, archived: 0, total: 6 },
                    batch_jobs_summary: { success: 10, pending: 0, failed: 0, total: 10 }
                },
                recentActivities: [
                    {
                        activity_id: "act-1",
                        type: "message",
                        status: "unread",
                        title: "Pesan Baru",
                        description: "Ada pesan baru dari klien",
                        created_at: "2026-06-20T10:00:00Z"
                    }
                ]
            };

            const mockResponse = { success: true, data: mockOverviewData };
            getSpy.mockResolvedValue(mockResponse);

            // Act
            const result = await analyticsService.getOverviewAnalytics();

            // Assert: Pastikan data yang dikembalikan sama persis dengan kembalian server
            expect(result).toEqual(mockResponse);
        });

        it("harus meneruskan pelemparan error (reject) saat API gagal", async () => {
            // Arrange: Pura-pura backend menolak request atau koneksi putus
            const mockError = { success: false, error: "Unauthorized access" };
            getSpy.mockRejectedValue(mockError);

            // Act & Assert: Expect function tersebut untuk melempar error yang sama
            await expect(analyticsService.getOverviewAnalytics()).rejects.toEqual(mockError);
        });
    });
});