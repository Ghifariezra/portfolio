import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import dengan struktur foldermu
import { taxonomyService } from "@/lib/services/taxonomy.service";
import { taxonomyActions, taxonomyKeys } from "@/lib/actions/taxonomy.action";

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

describe("Taxonomy Hooks Specification", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("taxonomyKeys", () => {
		it("harus menghasilkan struktur key yang konsisten", () => {
			expect(taxonomyKeys.all).toEqual(["taxonomies"]);
			expect(taxonomyKeys.categories()).toEqual(["taxonomies", "categories"]);
			expect(taxonomyKeys.tags()).toEqual(["taxonomies", "tags"]);
		});
	});

	describe("Queries", () => {
		it("useGetCategories: harus memanggil getCategories service", async () => {
			const { wrapper } = createWrapper();
			const spy = vi.spyOn(taxonomyService, "getCategories").mockResolvedValue({ success: true, data: [] } as any);

			const { result } = renderHook(() => taxonomyActions.useGetCategories(), { wrapper });

			await waitFor(() => expect(result.current.isSuccess).toBe(true));
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it("useGetTags: harus memanggil getTags service", async () => {
			const { wrapper } = createWrapper();
			const spy = vi.spyOn(taxonomyService, "getTags").mockResolvedValue({ success: true, data: [] } as any);

			const { result } = renderHook(() => taxonomyActions.useGetTags(), { wrapper });

			await waitFor(() => expect(result.current.isSuccess).toBe(true));
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe("Mutations (Side Effects & Invalidations)", () => {
		it("useUpsertCategory: harus memanggil upsertCategory dan me-reset cache categories", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(taxonomyService, "upsertCategory").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => taxonomyActions.useUpsertCategory(), { wrapper });
			const mockPayload = { name: "Tech" } as any;

			await result.current.mutateAsync(mockPayload);

			expect(serviceSpy).toHaveBeenCalledWith(mockPayload);
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: taxonomyKeys.categories() });
		});

		it("useDeleteCategory: harus memanggil deleteCategory dan me-reset cache categories", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(taxonomyService, "deleteCategory").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => taxonomyActions.useDeleteCategory(), { wrapper });

			await result.current.mutateAsync("cat-123");

			expect(serviceSpy).toHaveBeenCalledWith("cat-123");
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: taxonomyKeys.categories() });
		});

		it("useUpsertTag: harus memanggil upsertTag dan me-reset cache tags", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(taxonomyService, "upsertTag").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => taxonomyActions.useUpsertTag(), { wrapper });
			const mockPayload = { name: "React" } as any;

			await result.current.mutateAsync(mockPayload);

			expect(serviceSpy).toHaveBeenCalledWith(mockPayload);
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: taxonomyKeys.tags() });
		});

		it("useDeleteTag: harus memanggil deleteTag dan me-reset cache tags", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(taxonomyService, "deleteTag").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => taxonomyActions.useDeleteTag(), { wrapper });

			await result.current.mutateAsync("tag-456");

			expect(serviceSpy).toHaveBeenCalledWith("tag-456");
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: taxonomyKeys.tags() });
		});
	});
});