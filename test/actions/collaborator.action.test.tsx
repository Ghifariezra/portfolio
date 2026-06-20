import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { collaboratorService } from "@/lib/services/collaborator.service";
import { collaboratorActions, collaboratorKeys } from "@/lib/actions/collaborator.action";

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

describe("Collaborator Hooks Specification", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("collaboratorKeys", () => {
		it("harus menghasilkan struktur key yang terurut dan konsisten", () => {
			expect(collaboratorKeys.all).toEqual(["collaborators"]);
			expect(collaboratorKeys.lists()).toEqual(["collaborators", "list"]);
		});
	});

	describe("Queries", () => {
		it("useGetCollaborators: harus memanggil getCollaborators service", async () => {
			const { wrapper } = createWrapper();
			const spy = vi.spyOn(collaboratorService, "getCollaborators").mockResolvedValue({ success: true, data: [] } as any);

			const { result } = renderHook(() => collaboratorActions.useGetCollaborators(), { wrapper });

			await waitFor(() => expect(result.current.isSuccess).toBe(true));
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe("Mutations (Side Effects & Invalidations)", () => {
		it("useUpsertCollaborator: harus memanggil upsertCollaborator dan me-reset cache lists", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(collaboratorService, "upsertCollaborator").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => collaboratorActions.useUpsertCollaborator(), { wrapper });
			const mockPayload = { name: "John Doe" } as any;

			await result.current.mutateAsync(mockPayload);

			expect(serviceSpy).toHaveBeenCalledWith(mockPayload);
			// Memastikan data di-fetch ulang dari server agar UI terbaru
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: collaboratorKeys.lists() });
		});

		it("useDeleteCollaborator: harus memanggil deleteCollaborator dan me-reset cache lists", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(collaboratorService, "deleteCollaborator").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => collaboratorActions.useDeleteCollaborator(), { wrapper });

			await result.current.mutateAsync("collab-123");

			expect(serviceSpy).toHaveBeenCalledWith("collab-123");
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: collaboratorKeys.lists() });
		});

		it("useUpsertCollaboratorLink: harus memanggil upsertCollaboratorLink dan me-reset cache lists", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(collaboratorService, "upsertCollaboratorLink").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => collaboratorActions.useUpsertCollaboratorLink(), { wrapper });
			const mockPayload = { url: "https://github.com" } as any;

			await result.current.mutateAsync(mockPayload);

			expect(serviceSpy).toHaveBeenCalledWith(mockPayload);
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: collaboratorKeys.lists() });
		});

		it("useDeleteCollaboratorLink: harus memanggil deleteCollaboratorLink dan me-reset cache lists", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(collaboratorService, "deleteCollaboratorLink").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => collaboratorActions.useDeleteCollaboratorLink(), { wrapper });

			await result.current.mutateAsync("link-999");

			expect(serviceSpy).toHaveBeenCalledWith("link-999");
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: collaboratorKeys.lists() });
		});
	});
});