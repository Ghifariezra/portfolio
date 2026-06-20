import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import dengan struktur foldermu
import { publicService } from "@/lib/services/public.service";
import { publicActions, publicKeys } from "@/lib/actions/public.action";

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

describe("Public Hooks Specification", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("publicKeys", () => {
		it("harus menghasilkan struktur key yang konsisten", () => {
			expect(publicKeys.all).toEqual(["public"]);
			expect(publicKeys.home()).toEqual(["public", "home"]);

			expect(publicKeys.projects()).toEqual(["public", "projects"]);
			expect(publicKeys.project("my-slug")).toEqual(["public", "projects", "my-slug"]);

			expect(publicKeys.notes()).toEqual(["public", "notes"]);
			expect(publicKeys.note("my-note")).toEqual(["public", "notes", "my-note"]);

			expect(publicKeys.apps()).toEqual(["public", "apps"]);
		});
	});

	describe("Queries", () => {
		it("useGetHomeContent: harus memanggil getHomeContent", async () => {
			const { wrapper } = createWrapper();
			const spy = vi.spyOn(publicService, "getHomeContent").mockResolvedValue({ success: true, data: {} } as any);

			const { result } = renderHook(() => publicActions.useGetHomeContent(), { wrapper });

			await waitFor(() => expect(result.current.isSuccess).toBe(true));
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it("useGetProjects: harus memanggil getProjects", async () => {
			const { wrapper } = createWrapper();
			const spy = vi.spyOn(publicService, "getProjects").mockResolvedValue({ success: true, data: [] } as any);

			const { result } = renderHook(() => publicActions.useGetProjects(), { wrapper });

			await waitFor(() => expect(result.current.isSuccess).toBe(true));
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it("useGetProjectBySlug: harus memanggil getProjectBySlug HANYA jika slug tersedia (enabled)", async () => {
			const { wrapper } = createWrapper();
			const spy = vi.spyOn(publicService, "getProjectBySlug").mockResolvedValue({ success: true, data: {} } as any);

			// Cek saat slug kosong
			const { result: emptyResult } = renderHook(() => publicActions.useGetProjectBySlug(""), { wrapper });
			expect(emptyResult.current.fetchStatus).toBe("idle");
			expect(spy).not.toHaveBeenCalled();

			// Cek saat slug valid
			const { result: validResult } = renderHook(() => publicActions.useGetProjectBySlug("app-keren"), { wrapper });
			await waitFor(() => expect(validResult.current.isSuccess).toBe(true));
			expect(spy).toHaveBeenCalledWith("app-keren");
		});

		it("useGetNotes: harus memanggil getNotes", async () => {
			const { wrapper } = createWrapper();
			const spy = vi.spyOn(publicService, "getNotes").mockResolvedValue({ success: true, data: [] } as any);

			const { result } = renderHook(() => publicActions.useGetNotes(), { wrapper });

			await waitFor(() => expect(result.current.isSuccess).toBe(true));
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it("useGetNoteBySlug: harus memanggil getNoteBySlug HANYA jika slug tersedia (enabled)", async () => {
			const { wrapper } = createWrapper();
			const spy = vi.spyOn(publicService, "getNoteBySlug").mockResolvedValue({ success: true, data: {} } as any);

			const { result: emptyResult } = renderHook(() => publicActions.useGetNoteBySlug(""), { wrapper });
			expect(emptyResult.current.fetchStatus).toBe("idle");
			expect(spy).not.toHaveBeenCalled();

			const { result: validResult } = renderHook(() => publicActions.useGetNoteBySlug("belajar-react"), { wrapper });
			await waitFor(() => expect(validResult.current.isSuccess).toBe(true));
			expect(spy).toHaveBeenCalledWith("belajar-react");
		});

		it("useGetApps: harus memanggil getApps", async () => {
			const { wrapper } = createWrapper();
			const spy = vi.spyOn(publicService, "getApps").mockResolvedValue({ success: true, data: [] } as any);

			const { result } = renderHook(() => publicActions.useGetApps(), { wrapper });

			await waitFor(() => expect(result.current.isSuccess).toBe(true));
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});
});