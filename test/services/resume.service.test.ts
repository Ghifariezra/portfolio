import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import dengan struktur foldermu
import { resumeService, ResumeService, type ResumeData } from "../../src/lib/services/resume.service";
import type { UpsertCertificateForm, UpsertSkillForm } from "@/lib/schemas/resume.schema";

describe("ResumeService Specification", () => {
    describe("Singleton Pattern", () => {
        it("harus mengembalikan instance yang sama setiap kali getInstance dipanggil", () => {
            const instance1 = ResumeService.getInstance();
            const instance2 = ResumeService.getInstance();

            expect(instance1).toBe(instance2);
        });

        it("variabel yang di-export (resumeService) harus merujuk ke instance tunggal", () => {
            const instance = ResumeService.getInstance();
            expect(resumeService).toBe(instance);
        });
    });

    describe("API Endpoint Invocations", () => {
        let getSpy: any;
        let putSpy: any;
        let deleteSpy: any;

        beforeEach(() => {
            // Pasang spy untuk masing-masing HTTP method pada apiClient
            getSpy = vi.spyOn(resumeService["api"], "get");
            putSpy = vi.spyOn(resumeService["api"], "put");
            deleteSpy = vi.spyOn(resumeService["api"], "delete");
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        // --- SECTION: RESUME DATA ---
        describe("getResume", () => {
            it("harus memanggil endpoint '/resume/:id' dengan method GET", async () => {
                const targetId = "user-123";
                const mockResumeData: ResumeData = {
                    user_id: targetId,
                    username: "ghifari",
                    fullname: "Ghifari Ezra Ramadhan",
                    email: "ghifari@ezdev.xyz",
                    certificates: [],
                    skills: []
                };
                const mockResponse = { success: true, data: mockResumeData };

                getSpy.mockResolvedValue(mockResponse);

                const result = await resumeService.getResume(targetId);

                expect(getSpy).toHaveBeenCalledTimes(1);
                expect(getSpy).toHaveBeenCalledWith(`/resume/${targetId}`);
                expect(result).toEqual(mockResponse);
            });
        });

        // --- SECTION: SKILLS ---
        describe("Skills Operations", () => {
            describe("upsertSkill", () => {
                it("harus memanggil PUT satu kali jika hanya ada satu skill (tanpa koma)", async () => {
                    const mockPayload = { name: "ReactJS", level: "Expert" } as unknown as UpsertSkillForm;
                    const mockResponse = { success: true };
                    putSpy.mockResolvedValue(mockResponse);

                    const result = await resumeService.upsertSkill(mockPayload);

                    expect(putSpy).toHaveBeenCalledTimes(1);
                    expect(putSpy).toHaveBeenCalledWith("/resume/skills", { name: "ReactJS", level: "Expert" });
                    expect(result).toEqual(mockResponse);
                });

                it("harus memecah string dengan koma dan memanggil PUT berkali-kali secara paralel", async () => {
                    const mockPayload = { name: "React, Next.js, Node.js", level: "Intermediate" } as unknown as UpsertSkillForm;
                    const mockResponse = { success: true };
                    putSpy.mockResolvedValue(mockResponse);

                    await resumeService.upsertSkill(mockPayload);

                    // Pastikan dipecah menjadi 3 request
                    expect(putSpy).toHaveBeenCalledTimes(3);

                    // Cek masing-masing panggilan apakah sudah di-trim spasi-nya
                    expect(putSpy).toHaveBeenNthCalledWith(1, "/resume/skills", { name: "React", level: "Intermediate" });
                    expect(putSpy).toHaveBeenNthCalledWith(2, "/resume/skills", { name: "Next.js", level: "Intermediate" });
                    expect(putSpy).toHaveBeenNthCalledWith(3, "/resume/skills", { name: "Node.js", level: "Intermediate" });
                });

                it("harus mengabaikan string kosong jika terdapat koma berlebih (filter kosong)", async () => {
                    // String dengan koma di akhir dan spasi kosong di tengah
                    const mockPayload = { name: "TypeScript, , Tailwind, ", level: "Beginner" } as unknown as UpsertSkillForm;
                    putSpy.mockResolvedValue({ success: true });

                    await resumeService.upsertSkill(mockPayload);

                    // Seharusnya hanya memanggil 2 kali (TypeScript dan Tailwind)
                    expect(putSpy).toHaveBeenCalledTimes(2);
                    expect(putSpy).toHaveBeenNthCalledWith(1, "/resume/skills", { name: "TypeScript", level: "Beginner" });
                    expect(putSpy).toHaveBeenNthCalledWith(2, "/resume/skills", { name: "Tailwind", level: "Beginner" });
                });
            });

            describe("deleteSkill", () => {
                it("harus memanggil endpoint '/resume/skills/:id' dengan method DELETE", async () => {
                    const targetId = "skill-99";
                    const mockResponse = { success: true };
                    deleteSpy.mockResolvedValue(mockResponse);

                    const result = await resumeService.deleteSkill(targetId);

                    expect(deleteSpy).toHaveBeenCalledTimes(1);
                    expect(deleteSpy).toHaveBeenCalledWith(`/resume/skills/${targetId}`);
                    expect(result).toEqual(mockResponse);
                });
            });
        });

        // --- SECTION: CERTIFICATES ---
        describe("Certificates Operations", () => {
            describe("upsertCertificate", () => {
                it("harus memanggil endpoint '/resume/certificates' dengan method PUT beserta payload", async () => {
                    const mockPayload = {
                        title: "AWS Certified Developer",
                        issuer: "Amazon Web Services",
                    } as unknown as UpsertCertificateForm;

                    const mockResponse = { success: true };
                    putSpy.mockResolvedValue(mockResponse);

                    const result = await resumeService.upsertCertificate(mockPayload);

                    expect(putSpy).toHaveBeenCalledTimes(1);
                    expect(putSpy).toHaveBeenCalledWith("/resume/certificates", mockPayload);
                    expect(result).toEqual(mockResponse);
                });
            });

            describe("deleteCertificate", () => {
                it("harus memanggil endpoint '/resume/certificates/:id' dengan method DELETE", async () => {
                    const targetId = "cert-777";
                    const mockResponse = { success: true };
                    deleteSpy.mockResolvedValue(mockResponse);

                    const result = await resumeService.deleteCertificate(targetId);

                    expect(deleteSpy).toHaveBeenCalledTimes(1);
                    expect(deleteSpy).toHaveBeenCalledWith(`/resume/certificates/${targetId}`);
                    expect(result).toEqual(mockResponse);
                });
            });
        });
    });
});