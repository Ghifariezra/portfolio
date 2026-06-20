import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import dengan struktur foldermu
import { publicService, PublicService } from "../../src/lib/services/public.service";
import type {
    HomeContentResponse,
    AppItem
} from "../../src/lib/services/public.service";
import type { ProjectListItem } from "../../src/lib/schemas/project.schema";
import type { BlogListItem } from "../../src/lib/schemas/blog.schema";

describe("PublicService Specification", () => {
    describe("Singleton Pattern", () => {
        it("harus mengembalikan instance yang sama setiap kali getInstance dipanggil", () => {
            const instance1 = PublicService.getInstance();
            const instance2 = PublicService.getInstance();

            expect(instance1).toBe(instance2);
        });

        it("variabel yang di-export (publicService) harus merujuk ke instance tunggal", () => {
            const instance = PublicService.getInstance();
            expect(publicService).toBe(instance);
        });
    });

    describe("API Endpoint Invocations", () => {
        let getSpy: any;

        beforeEach(() => {
            // Karena ini public read-only, kita hanya butuh spy pada method GET
            getSpy = vi.spyOn(publicService["api"], "get");
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        // --- SECTION: HOME ---
        describe("getHomeContent", () => {
            it("harus memanggil endpoint '/public/home' dengan method GET", async () => {
                const mockHomeData: HomeContentResponse = {
                    hero: {
                        image: null,
                        fullname: "Ghifari Ezra Ramadhan",
                        role: "Software Developer",
                        about_me: "Hello world!",
                        cv_url: "https://ezdev.xyz/cv",
                        github: null,
                        linkedin: null,
                    },
                    skills: { languages: ["TypeScript"], frameworks: ["React"], tools: ["Git"] },
                    certificates: [],
                    featured_projects: [],
                    recent_blogs: [],
                };

                const mockResponse = { success: true, data: mockHomeData };
                getSpy.mockResolvedValue(mockResponse);

                const result = await publicService.getHomeContent();

                expect(getSpy).toHaveBeenCalledTimes(1);
                expect(getSpy).toHaveBeenCalledWith("/public/home");
                expect(result).toEqual(mockResponse);
            });
        });

        // --- SECTION: PROJECTS ---
        describe("Projects Operations", () => {
            it("getProjects: harus memanggil endpoint '/public/projects' dengan method GET", async () => {
                const mockResponse = {
                    success: true,
                    data: [{ id: "proj-1", title: "Penyet Compressor" }] as unknown as ProjectListItem[]
                };
                getSpy.mockResolvedValue(mockResponse);

                const result = await publicService.getProjects();

                expect(getSpy).toHaveBeenCalledTimes(1);
                expect(getSpy).toHaveBeenCalledWith("/public/projects");
                expect(result).toEqual(mockResponse);
            });

            it("getProjectBySlug: harus memanggil endpoint '/public/projects/:slug' dengan method GET", async () => {
                const targetSlug = "flokas-mobile-app";
                const mockResponse = { success: true, data: { id: "proj-2", slug: targetSlug } as unknown as ProjectListItem };
                getSpy.mockResolvedValue(mockResponse);

                const result = await publicService.getProjectBySlug(targetSlug);

                expect(getSpy).toHaveBeenCalledTimes(1);
                expect(getSpy).toHaveBeenCalledWith(`/public/projects/${targetSlug}`);
                expect(result).toEqual(mockResponse);
            });
        });

        // --- SECTION: NOTES (BLOGS) ---
        describe("Notes Operations", () => {
            it("getNotes: harus memanggil endpoint '/public/notes' dengan method GET", async () => {
                const mockResponse = {
                    success: true,
                    data: [{ id: "blog-1", title: "Understanding React" }] as unknown as BlogListItem[]
                };
                getSpy.mockResolvedValue(mockResponse);

                const result = await publicService.getNotes();

                expect(getSpy).toHaveBeenCalledTimes(1);
                expect(getSpy).toHaveBeenCalledWith("/public/notes");
                expect(result).toEqual(mockResponse);
            });

            it("getNoteBySlug: harus memanggil endpoint '/public/notes/:slug' dengan method GET", async () => {
                const targetSlug = "mastering-typescript";
                const mockResponse = { success: true, data: { id: "blog-2", slug: targetSlug } as unknown as BlogListItem };
                getSpy.mockResolvedValue(mockResponse);

                const result = await publicService.getNoteBySlug(targetSlug);

                expect(getSpy).toHaveBeenCalledTimes(1);
                expect(getSpy).toHaveBeenCalledWith(`/public/notes/${targetSlug}`);
                expect(result).toEqual(mockResponse);
            });
        });

        // --- SECTION: APPS & ANALYTICS ---
        describe("getApps", () => {
            it("harus memanggil endpoint '/public/apps' dengan method GET", async () => {
                const mockAppData: AppItem[] = [
                    {
                        id: "app-1",
                        name: "DanaKu",
                        description: "Financial management app",
                        image: "danaku.png",
                        status: "published",
                        microsoft_store_id: "MS-123",
                        url_store: "https://store.microsoft.com/...",
                        created_at: "2026-03-14T00:00:00Z",
                        updated_at: "2026-03-14T00:00:00Z",
                        tags: ["finance", "tools"],
                        analytics: {
                            TotalInstalls: 1500,
                            DataFreshnessTimestamp: "2026-06-20T10:00:00Z",
                            Timeline: [],
                            TopRegions: []
                        }
                    }
                ];

                const mockResponse = { success: true, data: mockAppData };
                getSpy.mockResolvedValue(mockResponse);

                const result = await publicService.getApps();

                expect(getSpy).toHaveBeenCalledTimes(1);
                expect(getSpy).toHaveBeenCalledWith("/public/apps");
                expect(result).toEqual(mockResponse);
            });
        });
    });
});