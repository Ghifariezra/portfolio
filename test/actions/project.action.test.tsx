import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import dengan struktur foldermu
import { projectService } from "@/lib/services/project.service";
import { projectActions, projectKeys } from "@/lib/actions/project.action";

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

describe("Project Hooks Specification", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("projectKeys", () => {
		it("harus menghasilkan struktur key yang terurut dan konsisten", () => {
			expect(projectKeys.all).toEqual(["projects"]);
			expect(projectKeys.lists()).toEqual(["projects", "list"]);
			expect(projectKeys.details()).toEqual(["projects", "detail"]);
			expect(projectKeys.detail("123")).toEqual(["projects", "detail", "123"]);
		});
	});

	describe("Queries", () => {
		it("useGetProjects: harus memanggil getProjects service", async () => {
			const { wrapper } = createWrapper();
			const spy = vi.spyOn(projectService, "getProjects").mockResolvedValue({ success: true, data: [] } as any);

			const { result } = renderHook(() => projectActions.useGetProjects(), { wrapper });

			await waitFor(() => expect(result.current.isSuccess).toBe(true));
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it("useGetProjectById: harus memanggil getProjectById HANYA jika id tersedia (enabled)", async () => {
			const { wrapper } = createWrapper();
			const spy = vi.spyOn(projectService, "getProjectById").mockResolvedValue({ success: true, data: {} } as any);

			// Cek saat ID kosong (fetchStatus harus idle)
			const { result: emptyResult } = renderHook(() => projectActions.useGetProjectById(""), { wrapper });
			expect(emptyResult.current.fetchStatus).toBe("idle");
			expect(spy).not.toHaveBeenCalled();

			// Cek saat ID valid
			const { result: validResult } = renderHook(() => projectActions.useGetProjectById("proj-1"), { wrapper });
			await waitFor(() => expect(validResult.current.isSuccess).toBe(true));
			expect(spy).toHaveBeenCalledWith("proj-1");
		});
	});

	describe("Mutations (Side Effects & Invalidations)", () => {
		it("useUploadImage: harus memanggil uploadProjectImage tanpa invalidasi cache", async () => {
			const { wrapper } = createWrapper();
			const serviceSpy = vi.spyOn(projectService, "uploadProjectImage").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => projectActions.useUploadImage(), { wrapper });
			const mockFile = new File(["dummy"], "image.png", { type: "image/png" });

			await result.current.mutateAsync(mockFile);
			expect(serviceSpy).toHaveBeenCalledWith(mockFile);
		});

		it("useDeleteImage: harus memanggil deleteProjectImage tanpa invalidasi cache", async () => {
			const { wrapper } = createWrapper();
			const serviceSpy = vi.spyOn(projectService, "deleteProjectImage").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => projectActions.useDeleteImage(), { wrapper });

			await result.current.mutateAsync("http://url.com/img.png");
			expect(serviceSpy).toHaveBeenCalledWith("http://url.com/img.png");
		});

		it("useUpsertProject: harus memanggil upsertProject dan me-reset cache lists", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(projectService, "upsertProject").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => projectActions.useUpsertProject(), { wrapper });
			const mockPayload = { title: "Test Project" } as any;

			await result.current.mutateAsync(mockPayload);

			expect(serviceSpy).toHaveBeenCalledWith(mockPayload);
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: projectKeys.lists() });
		});

		it("useDeleteProject: harus memanggil deleteProject dan me-reset cache lists", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(projectService, "deleteProject").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => projectActions.useDeleteProject(), { wrapper });

			await result.current.mutateAsync("proj-123");

			expect(serviceSpy).toHaveBeenCalledWith("proj-123");
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: projectKeys.lists() });
		});

		it("useAssignTags: harus memanggil assignTags dan me-reset cache lists", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(projectService, "assignTags").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => projectActions.useAssignTags(), { wrapper });
			const mockPayload = { project_id: "1", tag_ids: ["2"] } as any;

			await result.current.mutateAsync(mockPayload);

			expect(serviceSpy).toHaveBeenCalledWith(mockPayload);
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: projectKeys.lists() });
		});

		it("useAssignCollaborators: harus memanggil assignCollaborators dan me-reset cache lists", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(projectService, "assignCollaborators").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => projectActions.useAssignCollaborators(), { wrapper });
			const mockPayload = { project_id: "1", collaborators: [] } as any;

			await result.current.mutateAsync(mockPayload);

			expect(serviceSpy).toHaveBeenCalledWith(mockPayload);
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: projectKeys.lists() });
		});
	});
});