import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import dengan struktur foldermu
import { resumeService } from "@/lib/services/resume.service";
import { resumeActions, resumeKeys } from "@/lib/actions/resume.action";

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

describe("Resume Hooks Specification", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("resumeKeys", () => {
		it("harus menghasilkan struktur key detail yang konsisten", () => {
			expect(resumeKeys.all).toEqual(["resume"]);
			expect(resumeKeys.detail("user-123")).toEqual(["resume", "user-123"]);
		});
	});

	describe("Queries", () => {
		it("useGetResume: harus memanggil getResume HANYA jika id tersedia (enabled)", async () => {
			const { wrapper } = createWrapper();
			const spy = vi.spyOn(resumeService, "getResume").mockResolvedValue({ success: true, data: {} } as any);

			// Cek saat ID kosong
			const { result: emptyResult } = renderHook(() => resumeActions.useGetResume(""), { wrapper });
			expect(emptyResult.current.fetchStatus).toBe("idle");
			expect(spy).not.toHaveBeenCalled();

			// Cek saat ID valid
			const { result: validResult } = renderHook(() => resumeActions.useGetResume("user-123"), { wrapper });
			await waitFor(() => expect(validResult.current.isSuccess).toBe(true));
			expect(spy).toHaveBeenCalledWith("user-123");
		});
	});

	describe("Mutations (Side Effects & Invalidations)", () => {
		it("useUpsertSkill: harus memanggil upsertSkill dan me-reset cache resume.all", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(resumeService, "upsertSkill").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => resumeActions.useUpsertSkill(), { wrapper });
			const mockPayload = { name: "React" } as any;

			await result.current.mutateAsync(mockPayload);

			expect(serviceSpy).toHaveBeenCalledWith(mockPayload);
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: resumeKeys.all });
		});

		it("useDeleteSkill: harus memanggil deleteSkill dan me-reset cache resume.all", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(resumeService, "deleteSkill").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => resumeActions.useDeleteSkill(), { wrapper });

			await result.current.mutateAsync("skill-111");

			expect(serviceSpy).toHaveBeenCalledWith("skill-111");
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: resumeKeys.all });
		});

		it("useUpsertCertificate: harus memanggil upsertCertificate dan me-reset cache resume.all", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(resumeService, "upsertCertificate").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => resumeActions.useUpsertCertificate(), { wrapper });
			const mockPayload = { title: "Cert" } as any;

			await result.current.mutateAsync(mockPayload);

			expect(serviceSpy).toHaveBeenCalledWith(mockPayload);
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: resumeKeys.all });
		});

		it("useDeleteCertificate: harus memanggil deleteCertificate dan me-reset cache resume.all", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(resumeService, "deleteCertificate").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => resumeActions.useDeleteCertificate(), { wrapper });

			await result.current.mutateAsync("cert-222");

			expect(serviceSpy).toHaveBeenCalledWith("cert-222");
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: resumeKeys.all });
		});
	});
});