import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import dengan struktur foldermu
import { taxonomyService, TaxonomyService } from "../../src/lib/services/taxonomy.service";
import type { UpsertCategoryForm, UpsertTagForm } from "@/lib/schemas/taxonomy.schema";

describe("TaxonomyService Specification", () => {
    describe("Singleton Pattern", () => {
        it("harus mengembalikan instance yang sama setiap kali getInstance dipanggil", () => {
            const instance1 = TaxonomyService.getInstance();
            const instance2 = TaxonomyService.getInstance();

            expect(instance1).toBe(instance2);
        });

        it("variabel yang di-export (taxonomyService) harus merujuk ke instance tunggal", () => {
            const instance = TaxonomyService.getInstance();
            expect(taxonomyService).toBe(instance);
        });
    });

    describe("API Endpoint Invocations", () => {
        let getSpy: any;
        let putSpy: any;
        let deleteSpy: any;

        beforeEach(() => {
            // Pasang spy untuk masing-masing HTTP method pada apiClient
            getSpy = vi.spyOn(taxonomyService["api"], "get");
            putSpy = vi.spyOn(taxonomyService["api"], "put");
            deleteSpy = vi.spyOn(taxonomyService["api"], "delete");
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        // --- SECTION: CATEGORIES ---
        describe("Categories Operations", () => {
            it("getCategories: harus memanggil endpoint '/taxonomies/categories' dengan method GET", async () => {
                const mockResponse = { success: true, data: [{ id: "cat-1", name: "Tech" }] };
                getSpy.mockResolvedValue(mockResponse);

                const result = await taxonomyService.getCategories();

                expect(getSpy).toHaveBeenCalledTimes(1);
                expect(getSpy).toHaveBeenCalledWith("/taxonomies/categories");
                expect(result).toEqual(mockResponse);
            });

            it("upsertCategory: harus memanggil endpoint '/taxonomies/categories' dengan method PUT beserta payload", async () => {
                const mockPayload = {
                    name: "Technology",
                    slug: "technology",
                } as unknown as UpsertCategoryForm;

                const mockResponse = { success: true };
                putSpy.mockResolvedValue(mockResponse);

                const result = await taxonomyService.upsertCategory(mockPayload);

                expect(putSpy).toHaveBeenCalledTimes(1);
                expect(putSpy).toHaveBeenCalledWith("/taxonomies/categories", mockPayload);
                expect(result).toEqual(mockResponse);
            });

            it("deleteCategory: harus memanggil endpoint '/taxonomies/categories/:id' dengan method DELETE", async () => {
                const targetId = "cat-123";
                const mockResponse = { success: true };
                deleteSpy.mockResolvedValue(mockResponse);

                const result = await taxonomyService.deleteCategory(targetId);

                expect(deleteSpy).toHaveBeenCalledTimes(1);
                expect(deleteSpy).toHaveBeenCalledWith(`/taxonomies/categories/${targetId}`);
                expect(result).toEqual(mockResponse);
            });
        });

        // --- SECTION: TAGS ---
        describe("Tags Operations", () => {
            it("getTags: harus memanggil endpoint '/taxonomies/tags' dengan method GET", async () => {
                const mockResponse = { success: true, data: [{ id: "tag-1", name: "React" }] };
                getSpy.mockResolvedValue(mockResponse);

                const result = await taxonomyService.getTags();

                expect(getSpy).toHaveBeenCalledTimes(1);
                expect(getSpy).toHaveBeenCalledWith("/taxonomies/tags");
                expect(result).toEqual(mockResponse);
            });

            it("upsertTag: harus memanggil endpoint '/taxonomies/tags' dengan method PUT beserta payload", async () => {
                const mockPayload = {
                    name: "ReactJS",
                    slug: "reactjs",
                } as unknown as UpsertTagForm;

                const mockResponse = { success: true };
                putSpy.mockResolvedValue(mockResponse);

                const result = await taxonomyService.upsertTag(mockPayload);

                expect(putSpy).toHaveBeenCalledTimes(1);
                expect(putSpy).toHaveBeenCalledWith("/taxonomies/tags", mockPayload);
                expect(result).toEqual(mockResponse);
            });

            it("deleteTag: harus memanggil endpoint '/taxonomies/tags/:id' dengan method DELETE", async () => {
                const targetId = "tag-456";
                const mockResponse = { success: true };
                deleteSpy.mockResolvedValue(mockResponse);

                const result = await taxonomyService.deleteTag(targetId);

                expect(deleteSpy).toHaveBeenCalledTimes(1);
                // Pastikan ID tersisip dengan benar di dalam URL (Template Literal)
                expect(deleteSpy).toHaveBeenCalledWith(`/taxonomies/tags/${targetId}`);
                expect(result).toEqual(mockResponse);
            });
        });
    });
});