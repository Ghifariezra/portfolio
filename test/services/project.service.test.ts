import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import dengan struktur foldermu
import { projectService, ProjectService } from "../../src/lib/services/project.service";
import type {
    AssignCollaboratorsForm,
    AssignTagsForm,
    UpsertProjectForm
} from "@/lib/schemas/project.schema";

describe("ProjectService Specification", () => {
    describe("Singleton Pattern", () => {
        it("harus mengembalikan instance yang sama setiap kali getInstance dipanggil", () => {
            const instance1 = ProjectService.getInstance();
            const instance2 = ProjectService.getInstance();

            expect(instance1).toBe(instance2);
        });

        it("variabel yang di-export (projectService) harus merujuk ke instance tunggal", () => {
            const instance = ProjectService.getInstance();
            expect(projectService).toBe(instance);
        });
    });

    describe("API Endpoint Invocations", () => {
        let getSpy: any;
        let postSpy: any;
        let putSpy: any;
        let deleteSpy: any;

        beforeEach(() => {
            // Pasang spy untuk semua metode HTTP yang digunakan
            getSpy = vi.spyOn(projectService["api"], "get");
            postSpy = vi.spyOn(projectService["api"], "post");
            putSpy = vi.spyOn(projectService["api"], "put");
            deleteSpy = vi.spyOn(projectService["api"], "delete");
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        // --- SECTION: MEDIA / IMAGES ---
        describe("Image Management", () => {
            it("uploadProjectImage: harus memanggil POST dengan FormData dan header multipart/form-data", async () => {
                const mockResponse = { success: true, data: { url: "https://ezdev.xyz/img.jpg" } };
                postSpy.mockResolvedValue(mockResponse);

                // Buat file dummy menggunakan DOM API (didukung oleh jsdom di Vitest)
                const dummyFile = new File(["dummy content"], "thumbnail.png", { type: "image/png" });

                const result = await projectService.uploadProjectImage(dummyFile);

                expect(postSpy).toHaveBeenCalledTimes(1);

                // Pastikan endpoint benar, payload adalah instance dari FormData, dan header-nya sesuai
                expect(postSpy).toHaveBeenCalledWith(
                    "/projects/upload-image",
                    expect.any(FormData), // Kita tidak perlu mengecek isi FormData byte-per-byte, cukup tipenya saja
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );
                expect(result).toEqual(mockResponse);
            });

            it("deleteProjectImage: harus memanggil POST ke '/projects/remove-image' dengan payload url", async () => {
                const targetUrl = "https://ezdev.xyz/img.jpg";
                const mockResponse = { success: true };
                postSpy.mockResolvedValue(mockResponse);

                const result = await projectService.deleteProjectImage(targetUrl);

                expect(postSpy).toHaveBeenCalledTimes(1);
                expect(postSpy).toHaveBeenCalledWith("/projects/remove-image", { url: targetUrl });
                expect(result).toEqual(mockResponse);
            });
        });

        // --- SECTION: CRUD PROJECTS ---
        describe("Project CRUD Operations", () => {
            it("getProjects: harus memanggil GET '/projects'", async () => {
                const mockResponse = { success: true, data: [] };
                getSpy.mockResolvedValue(mockResponse);

                const result = await projectService.getProjects();

                expect(getSpy).toHaveBeenCalledTimes(1);
                expect(getSpy).toHaveBeenCalledWith("/projects");
                expect(result).toEqual(mockResponse);
            });

            it("getProjectById: harus memanggil GET '/projects/:id'", async () => {
                const targetId = "proj-123";
                const mockResponse = { success: true, data: { id: targetId } };
                getSpy.mockResolvedValue(mockResponse);

                const result = await projectService.getProjectById(targetId);

                expect(getSpy).toHaveBeenCalledTimes(1);
                expect(getSpy).toHaveBeenCalledWith(`/projects/${targetId}`);
                expect(result).toEqual(mockResponse);
            });

            it("upsertProject: harus memanggil PUT '/projects' dengan payload form", async () => {
                const mockPayload = {
                    title: "Aplikasi Baru",
                    slug: "aplikasi-baru",
                    description: "Deskripsi singkat",
                } as unknown as UpsertProjectForm;

                const mockResponse = { success: true };
                putSpy.mockResolvedValue(mockResponse);

                const result = await projectService.upsertProject(mockPayload);

                expect(putSpy).toHaveBeenCalledTimes(1);
                expect(putSpy).toHaveBeenCalledWith("/projects", mockPayload);
                expect(result).toEqual(mockResponse);
            });

            it("deleteProject: harus memanggil DELETE '/projects/:id'", async () => {
                const targetId = "proj-999";
                const mockResponse = { success: true };
                deleteSpy.mockResolvedValue(mockResponse);

                const result = await projectService.deleteProject(targetId);

                expect(deleteSpy).toHaveBeenCalledTimes(1);
                expect(deleteSpy).toHaveBeenCalledWith(`/projects/${targetId}`);
                expect(result).toEqual(mockResponse);
            });
        });

        // --- SECTION: RELATIONS (TAGS & COLLABORATORS) ---
        describe("Project Relations", () => {
            it("assignTags: harus memanggil POST '/projects/assign-tags' dengan payload array tags", async () => {
                const mockPayload = {
                    project_id: "proj-1",
                    tag_ids: ["tag-1", "tag-2"],
                } as unknown as AssignTagsForm;

                const mockResponse = { success: true };
                postSpy.mockResolvedValue(mockResponse);

                const result = await projectService.assignTags(mockPayload);

                expect(postSpy).toHaveBeenCalledTimes(1);
                expect(postSpy).toHaveBeenCalledWith("/projects/assign-tags", mockPayload);
                expect(result).toEqual(mockResponse);
            });

            it("assignCollaborators: harus memanggil POST '/projects/assign-collaborators' dengan payload array collaborators", async () => {
                const mockPayload = {
                    project_id: "proj-1",
                    collaborators: [
                        { name: "John Doe", role: "Developer", linkedin: "url" }
                    ],
                } as unknown as AssignCollaboratorsForm;

                const mockResponse = { success: true };
                postSpy.mockResolvedValue(mockResponse);

                const result = await projectService.assignCollaborators(mockPayload);

                expect(postSpy).toHaveBeenCalledTimes(1);
                expect(postSpy).toHaveBeenCalledWith("/projects/assign-collaborators", mockPayload);
                expect(result).toEqual(mockResponse);
            });
        });
    });
});