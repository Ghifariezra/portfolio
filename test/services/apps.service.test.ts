import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import dengan struktur foldermu
import { appsService, AppsService } from "../../src/lib/services/apps.service";
import type { UpsertAppForm } from "@/lib/schemas/apps.schema";
import type { AssignTagsForm } from "@/lib/schemas/project.schema";

describe("AppsService Specification", () => {
    describe("Singleton Pattern", () => {
        it("harus mengembalikan instance yang sama setiap kali getInstance dipanggil", () => {
            const instance1 = AppsService.getInstance();
            const instance2 = AppsService.getInstance();

            expect(instance1).toBe(instance2);
        });

        it("variabel yang di-export (appsService) harus merujuk ke instance tunggal", () => {
            const instance = AppsService.getInstance();
            expect(appsService).toBe(instance);
        });
    });

    describe("API Endpoint Invocations", () => {
        let getSpy: any;
        let postSpy: any;
        let putSpy: any;
        let deleteSpy: any;

        beforeEach(() => {
            getSpy = vi.spyOn(appsService["api"], "get");
            postSpy = vi.spyOn(appsService["api"], "post");
            putSpy = vi.spyOn(appsService["api"], "put");
            deleteSpy = vi.spyOn(appsService["api"], "delete");
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        // --- SECTION: MEDIA / IMAGES ---
        describe("Image Management", () => {
            it("uploadAppImage: harus memanggil POST dengan FormData dan header multipart/form-data", async () => {
                const mockResponse = { success: true, data: { url: "https://ezdev.xyz/app-icon.png" } };
                postSpy.mockResolvedValue(mockResponse);

                const dummyFile = new File(["dummy"], "icon.png", { type: "image/png" });

                const result = await appsService.uploadAppImage(dummyFile);

                expect(postSpy).toHaveBeenCalledTimes(1);
                expect(postSpy).toHaveBeenCalledWith(
                    "/apps/upload-image",
                    expect.any(FormData),
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                expect(result).toEqual(mockResponse);
            });

            it("deleteAppImage: harus memanggil POST ke '/apps/remove-image' dengan payload url", async () => {
                const targetUrl = "https://ezdev.xyz/app-icon.png";
                const mockResponse = { success: true };
                postSpy.mockResolvedValue(mockResponse);

                const result = await appsService.deleteAppImage(targetUrl);

                expect(postSpy).toHaveBeenCalledTimes(1);
                expect(postSpy).toHaveBeenCalledWith("/apps/remove-image", { url: targetUrl });
                expect(result).toEqual(mockResponse);
            });
        });

        // --- SECTION: CRUD APPS ---
        describe("App CRUD Operations", () => {
            it("getApps: harus memanggil GET '/apps'", async () => {
                const mockResponse = { success: true, data: [] };
                getSpy.mockResolvedValue(mockResponse);

                const result = await appsService.getApps();

                expect(getSpy).toHaveBeenCalledTimes(1);
                expect(getSpy).toHaveBeenCalledWith("/apps");
                expect(result).toEqual(mockResponse);
            });

            it("getAppById: harus memanggil GET '/apps/:id'", async () => {
                const targetId = "app-123";
                const mockResponse = { success: true, data: { id: targetId } };
                getSpy.mockResolvedValue(mockResponse);

                const result = await appsService.getAppById(targetId);

                expect(getSpy).toHaveBeenCalledTimes(1);
                expect(getSpy).toHaveBeenCalledWith(`/apps/${targetId}`);
                expect(result).toEqual(mockResponse);
            });

            it("upsertApp: harus memanggil PUT '/apps' dengan payload form", async () => {
                const mockPayload = {
                    name: "DanaKu",
                    status: "published",
                    microsoft_store_id: "MS-123",
                } as unknown as UpsertAppForm;

                const mockResponse = { success: true };
                putSpy.mockResolvedValue(mockResponse);

                const result = await appsService.upsertApp(mockPayload);

                expect(putSpy).toHaveBeenCalledTimes(1);
                expect(putSpy).toHaveBeenCalledWith("/apps", mockPayload);
                expect(result).toEqual(mockResponse);
            });

            it("deleteApp: harus memanggil DELETE '/apps/:id'", async () => {
                const targetId = "app-999";
                const mockResponse = { success: true };
                deleteSpy.mockResolvedValue(mockResponse);

                const result = await appsService.deleteApp(targetId);

                expect(deleteSpy).toHaveBeenCalledTimes(1);
                expect(deleteSpy).toHaveBeenCalledWith(`/apps/${targetId}`);
                expect(result).toEqual(mockResponse);
            });
        });

        // --- SECTION: RELATIONS (TAGS) ---
        describe("App Relations", () => {
            it("assignTags: harus memanggil POST '/apps/assign-tags' dengan payload assign tags", async () => {
                // Di kode asli, AppsService memakai tipe AssignTagsForm dari project.schema
                const mockPayload = {
                    project_id: "app-1", // Nama field tergantung dari schema, pastikan sesuai
                    tag_ids: ["tag-1", "tag-2"],
                } as unknown as AssignTagsForm;

                const mockResponse = { success: true };
                postSpy.mockResolvedValue(mockResponse);

                const result = await appsService.assignTags(mockPayload);

                expect(postSpy).toHaveBeenCalledTimes(1);
                expect(postSpy).toHaveBeenCalledWith("/apps/assign-tags", mockPayload);
                expect(result).toEqual(mockResponse);
            });
        });
    });
});