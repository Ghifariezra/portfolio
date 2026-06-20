import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import dengan struktur foldermu
import { blogService, BlogService } from "../../src/lib/services/blog.service";
import type { AssignBlogTagsForm, UpsertBlogForm } from "@/lib/schemas/blog.schema";

describe("BlogService Specification", () => {
    describe("Singleton Pattern", () => {
        it("harus mengembalikan instance yang sama setiap kali getInstance dipanggil", () => {
            const instance1 = BlogService.getInstance();
            const instance2 = BlogService.getInstance();

            expect(instance1).toBe(instance2);
        });

        it("variabel yang di-export (blogService) harus merujuk ke instance tunggal", () => {
            const instance = BlogService.getInstance();
            expect(blogService).toBe(instance);
        });
    });

    describe("API Endpoint Invocations", () => {
        let getSpy: any;
        let postSpy: any;
        let putSpy: any;
        let deleteSpy: any;

        beforeEach(() => {
            getSpy = vi.spyOn(blogService["api"], "get");
            postSpy = vi.spyOn(blogService["api"], "post");
            putSpy = vi.spyOn(blogService["api"], "put");
            deleteSpy = vi.spyOn(blogService["api"], "delete");
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        // --- SECTION: MEDIA / IMAGES ---
        describe("Image Management", () => {
            it("uploadBlogImage: harus memanggil POST dengan FormData dan header multipart/form-data", async () => {
                const mockResponse = { success: true, data: { url: "https://ezdev.xyz/blog-img.jpg" } };
                postSpy.mockResolvedValue(mockResponse);

                const dummyFile = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });

                const result = await blogService.uploadBlogImage(dummyFile);

                expect(postSpy).toHaveBeenCalledTimes(1);
                expect(postSpy).toHaveBeenCalledWith(
                    "/blogs/upload-image",
                    expect.any(FormData),
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                expect(result).toEqual(mockResponse);
            });

            it("deleteBlogImage: harus memanggil POST ke '/blogs/remove-image' dengan payload url", async () => {
                const targetUrl = "https://ezdev.xyz/blog-img.jpg";
                const mockResponse = { success: true };
                postSpy.mockResolvedValue(mockResponse);

                const result = await blogService.deleteBlogImage(targetUrl);

                expect(postSpy).toHaveBeenCalledTimes(1);
                expect(postSpy).toHaveBeenCalledWith("/blogs/remove-image", { url: targetUrl });
                expect(result).toEqual(mockResponse);
            });
        });

        // --- SECTION: CRUD BLOGS ---
        describe("Blog CRUD Operations", () => {
            it("getBlogs: harus memanggil GET '/blogs'", async () => {
                const mockResponse = { success: true, data: [] };
                getSpy.mockResolvedValue(mockResponse);

                const result = await blogService.getBlogs();

                expect(getSpy).toHaveBeenCalledTimes(1);
                expect(getSpy).toHaveBeenCalledWith("/blogs");
                expect(result).toEqual(mockResponse);
            });

            it("getBlogById: harus memanggil GET '/blogs/:id'", async () => {
                const targetId = "blog-123";
                const mockResponse = { success: true, data: { id: targetId } };
                getSpy.mockResolvedValue(mockResponse);

                const result = await blogService.getBlogById(targetId);

                expect(getSpy).toHaveBeenCalledTimes(1);
                expect(getSpy).toHaveBeenCalledWith(`/blogs/${targetId}`);
                expect(result).toEqual(mockResponse);
            });

            it("upsertBlog: harus memanggil PUT '/blogs' dengan payload form", async () => {
                const mockPayload = {
                    title: "Belajar TypeScript",
                    slug: "belajar-typescript",
                    content: "Isi artikel",
                } as unknown as UpsertBlogForm;

                const mockResponse = { success: true };
                putSpy.mockResolvedValue(mockResponse);

                const result = await blogService.upsertBlog(mockPayload);

                expect(putSpy).toHaveBeenCalledTimes(1);
                expect(putSpy).toHaveBeenCalledWith("/blogs", mockPayload);
                expect(result).toEqual(mockResponse);
            });

            it("deleteBlog: harus memanggil DELETE '/blogs/:id'", async () => {
                const targetId = "blog-999";
                const mockResponse = { success: true };
                deleteSpy.mockResolvedValue(mockResponse);

                const result = await blogService.deleteBlog(targetId);

                expect(deleteSpy).toHaveBeenCalledTimes(1);
                expect(deleteSpy).toHaveBeenCalledWith(`/blogs/${targetId}`);
                expect(result).toEqual(mockResponse);
            });
        });

        // --- SECTION: RELATIONS (TAGS) ---
        describe("Blog Relations", () => {
            it("assignTags: harus memanggil POST '/blogs/assign-tags' dengan payload assign tags", async () => {
                const mockPayload = {
                    blog_id: "blog-1",
                    tag_ids: ["tag-1", "tag-2"],
                } as unknown as AssignBlogTagsForm;

                const mockResponse = { success: true };
                postSpy.mockResolvedValue(mockResponse);

                const result = await blogService.assignTags(mockPayload);

                expect(postSpy).toHaveBeenCalledTimes(1);
                expect(postSpy).toHaveBeenCalledWith("/blogs/assign-tags", mockPayload);
                expect(result).toEqual(mockResponse);
            });
        });
    });
});