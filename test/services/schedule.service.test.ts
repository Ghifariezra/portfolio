import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import dengan struktur foldermu
import { scheduleService, ScheduleService } from "../../src/lib/services/schedule.service";
import type { UpsertScheduleForm } from "@/lib/schemas/schedule.schema";

describe("ScheduleService Specification", () => {
    describe("Singleton Pattern", () => {
        it("harus mengembalikan instance yang sama setiap kali getInstance dipanggil", () => {
            const instance1 = ScheduleService.getInstance();
            const instance2 = ScheduleService.getInstance();

            expect(instance1).toBe(instance2);
        });

        it("variabel yang di-export (scheduleService) harus merujuk ke instance tunggal", () => {
            const instance = ScheduleService.getInstance();
            expect(scheduleService).toBe(instance);
        });
    });

    describe("API Endpoint Invocations", () => {
        let getSpy: any;
        let putSpy: any;
        let deleteSpy: any;

        beforeEach(() => {
            // Pasang spy untuk masing-masing HTTP method pada apiClient
            getSpy = vi.spyOn(scheduleService["api"], "get");
            putSpy = vi.spyOn(scheduleService["api"], "put");
            deleteSpy = vi.spyOn(scheduleService["api"], "delete");
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        describe("getSchedules", () => {
            it("harus memanggil endpoint '/schedules' dengan method GET", async () => {
                const mockResponse = { success: true, data: [{ id: "sched-1", title: "Meeting" }] };
                getSpy.mockResolvedValue(mockResponse);

                const result = await scheduleService.getSchedules();

                expect(getSpy).toHaveBeenCalledTimes(1);
                expect(getSpy).toHaveBeenCalledWith("/schedules");
                expect(result).toEqual(mockResponse);
            });
        });

        describe("upsertSchedule", () => {
            it("harus memanggil endpoint '/schedules' dengan method PUT beserta payload form", async () => {
                const mockPayload = {
                    title: "Rilis Fitur Baru",
                    scheduled_at: "2026-07-01T10:00:00Z",
                } as unknown as UpsertScheduleForm;

                const mockResponse = { success: true };
                putSpy.mockResolvedValue(mockResponse);

                const result = await scheduleService.upsertSchedule(mockPayload);

                expect(putSpy).toHaveBeenCalledTimes(1);
                expect(putSpy).toHaveBeenCalledWith("/schedules", mockPayload);
                expect(result).toEqual(mockResponse);
            });

            it("harus meneruskan error (reject) jika proses upsert gagal", async () => {
                const mockPayload = {} as UpsertScheduleForm;
                const mockError = { success: false, error: "Jadwal bertabrakan" };

                putSpy.mockRejectedValue(mockError);

                await expect(scheduleService.upsertSchedule(mockPayload)).rejects.toEqual(mockError);
            });
        });

        describe("deleteSchedule", () => {
            it("harus memanggil endpoint '/schedules/:id' dengan method DELETE", async () => {
                const targetId = "sched-999";
                const mockResponse = { success: true };
                deleteSpy.mockResolvedValue(mockResponse);

                const result = await scheduleService.deleteSchedule(targetId);

                expect(deleteSpy).toHaveBeenCalledTimes(1);
                // Pastikan ID disisipkan dengan benar menggunakan template literal
                expect(deleteSpy).toHaveBeenCalledWith(`/schedules/${targetId}`);
                expect(result).toEqual(mockResponse);
            });
        });
    });
});