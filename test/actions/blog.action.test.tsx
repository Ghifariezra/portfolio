import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { blogService } from "@/lib/services/blog.service";
import { blogActions, blogKeys } from "@/lib/actions/blog.action";

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return {
		queryClient,
		wrapper: ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		),
	};
};

describe("Blog Hooks Specification", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("blogKeys", () => {
		it("harus menghasilkan struktur key yang terurut dan konsisten", () => {
			expect(blogKeys.all).toEqual(["blogs"]);
			expect(blogKeys.lists()).toEqual(["blogs", "list"]);
			expect(blogKeys.details()).toEqual(["blogs", "detail"]);
			expect(blogKeys.detail("123")).toEqual(["blogs", "detail", "123"]);
		});
	});

	describe("Queries", () => {
		it("useGetBlogs: harus memanggil getBlogs service", async () => {
			const { wrapper } = createWrapper();
			const spy = vi.spyOn(blogService, "getBlogs").mockResolvedValue({ success: true, data: [] } as any);

			const { result } = renderHook(() => blogActions.useGetBlogs(), { wrapper });

			await waitFor(() => expect(result.current.isSuccess).toBe(true));
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it("useGetBlogById: harus memanggil getBlogById HANYA jika id tersedia (enabled)", async () => {
			const { wrapper } = createWrapper();
			const spy = vi.spyOn(blogService, "getBlogById").mockResolvedValue({ success: true, data: {} } as any);

			// Cek saat ID kosong (fetchStatus harus idle)
			const { result: emptyResult } = renderHook(() => blogActions.useGetBlogById(""), { wrapper });
			expect(emptyResult.current.fetchStatus).toBe("idle");
			expect(spy).not.toHaveBeenCalled();

			// Cek saat ID valid
			const { result: validResult } = renderHook(() => blogActions.useGetBlogById("blog-1"), { wrapper });
			await waitFor(() => expect(validResult.current.isSuccess).toBe(true));
			expect(spy).toHaveBeenCalledWith("blog-1");
		});
	});

	describe("Mutations (Side Effects & Invalidations)", () => {
		it("useUploadImage: harus memanggil uploadBlogImage tanpa invalidasi cache", async () => {
			const { wrapper } = createWrapper();
			const serviceSpy = vi.spyOn(blogService, "uploadBlogImage").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => blogActions.useUploadImage(), { wrapper });
			const mockFile = new File(["dummy"], "image.png", { type: "image/png" });

			await result.current.mutateAsync(mockFile);
			expect(serviceSpy).toHaveBeenCalledWith(mockFile);
		});

		it("useDeleteImage: harus memanggil deleteBlogImage tanpa invalidasi cache", async () => {
			const { wrapper } = createWrapper();
			const serviceSpy = vi.spyOn(blogService, "deleteBlogImage").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => blogActions.useDeleteImage(), { wrapper });

			await result.current.mutateAsync("http://url.com/img.png");
			expect(serviceSpy).toHaveBeenCalledWith("http://url.com/img.png");
		});

		it("useUpsertBlog: harus memanggil upsertBlog dan me-reset cache lists", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(blogService, "upsertBlog").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => blogActions.useUpsertBlog(), { wrapper });
			const mockPayload = { title: "Test Blog" } as any;

			await result.current.mutateAsync(mockPayload);

			expect(serviceSpy).toHaveBeenCalledWith(mockPayload);
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: blogKeys.lists() });
		});

		it("useDeleteBlog: harus memanggil deleteBlog dan me-reset cache lists", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(blogService, "deleteBlog").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => blogActions.useDeleteBlog(), { wrapper });

			await result.current.mutateAsync("blog-123");

			expect(serviceSpy).toHaveBeenCalledWith("blog-123");
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: blogKeys.lists() });
		});

		it("useAssignTags: harus memanggil assignTags dan me-reset cache lists", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(blogService, "assignTags").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => blogActions.useAssignTags(), { wrapper });
			const mockPayload = { blog_id: "1", tag_ids: ["2"] } as any;

			await result.current.mutateAsync(mockPayload);

			expect(serviceSpy).toHaveBeenCalledWith(mockPayload);
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: blogKeys.lists() });
		});
	});
});