import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import dengan struktur foldermu
import { collaboratorService, CollaboratorService } from "../../src/lib/services/collaborator.service";
import type { UpsertCollaboratorForm, UpsertCollaboratorLinkForm } from "@/lib/schemas/collaborator.schema";

describe("CollaboratorService Specification", () => {
    describe("Singleton Pattern", () => {
        it("harus mengembalikan instance yang sama setiap kali getInstance dipanggil", () => {
            const instance1 = CollaboratorService.getInstance();
            const instance2 = CollaboratorService.getInstance();

            expect(instance1).toBe(instance2);
        });

        it("variabel yang di-export (collaboratorService) harus merujuk ke instance tunggal", () => {
            const instance = CollaboratorService.getInstance();
            expect(collaboratorService).toBe(instance);
        });
    });

    describe("API Endpoint Invocations", () => {
        let getSpy: any;
        let putSpy: any;
        let deleteSpy: any;

        beforeEach(() => {
            getSpy = vi.spyOn(collaboratorService["api"], "get");
            putSpy = vi.spyOn(collaboratorService["api"], "put");
            deleteSpy = vi.spyOn(collaboratorService["api"], "delete");
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        // --- SECTION: COLLABORATORS ---
        describe("Collaborators Operations", () => {
            it("getCollaborators: harus memanggil endpoint '/collaborators' dengan method GET", async () => {
                const mockResponse = { success: true, data: [] };
                getSpy.mockResolvedValue(mockResponse);

                const result = await collaboratorService.getCollaborators();

                expect(getSpy).toHaveBeenCalledTimes(1);
                expect(getSpy).toHaveBeenCalledWith("/collaborators");
                expect(result).toEqual(mockResponse);
            });

            it("upsertCollaborator: harus memanggil endpoint '/collaborators' dengan method PUT beserta payload", async () => {
                const mockPayload = {
                    name: "John Doe",
                    role: "Frontend Developer",
                } as unknown as UpsertCollaboratorForm;

                const mockResponse = { success: true };
                putSpy.mockResolvedValue(mockResponse);

                const result = await collaboratorService.upsertCollaborator(mockPayload);

                expect(putSpy).toHaveBeenCalledTimes(1);
                expect(putSpy).toHaveBeenCalledWith("/collaborators", mockPayload);
                expect(result).toEqual(mockResponse);
            });

            it("deleteCollaborator: harus memanggil endpoint '/collaborators/:id' dengan method DELETE", async () => {
                const targetId = "collab-123";
                const mockResponse = { success: true };
                deleteSpy.mockResolvedValue(mockResponse);

                const result = await collaboratorService.deleteCollaborator(targetId);

                expect(deleteSpy).toHaveBeenCalledTimes(1);
                expect(deleteSpy).toHaveBeenCalledWith(`/collaborators/${targetId}`);
                expect(result).toEqual(mockResponse);
            });
        });

        // --- SECTION: COLLABORATOR LINKS ---
        describe("Collaborator Links Operations", () => {
            it("upsertCollaboratorLink: harus memanggil endpoint '/collaborators/links' dengan method PUT beserta payload", async () => {
                const mockPayload = {
                    collaborator_id: "collab-123",
                    url: "https://github.com/johndoe",
                    platform: "github",
                } as unknown as UpsertCollaboratorLinkForm;

                const mockResponse = { success: true };
                putSpy.mockResolvedValue(mockResponse);

                const result = await collaboratorService.upsertCollaboratorLink(mockPayload);

                expect(putSpy).toHaveBeenCalledTimes(1);
                expect(putSpy).toHaveBeenCalledWith("/collaborators/links", mockPayload);
                expect(result).toEqual(mockResponse);
            });

            it("deleteCollaboratorLink: harus memanggil endpoint '/collaborators/links/:id' dengan method DELETE", async () => {
                const targetId = "link-456";
                const mockResponse = { success: true };
                deleteSpy.mockResolvedValue(mockResponse);

                const result = await collaboratorService.deleteCollaboratorLink(targetId);

                expect(deleteSpy).toHaveBeenCalledTimes(1);
                expect(deleteSpy).toHaveBeenCalledWith(`/collaborators/links/${targetId}`);
                expect(result).toEqual(mockResponse);
            });
        });
    });
});