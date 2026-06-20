import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import dengan foldermu
import { lockService } from "@/lib/services/lock.service";
import { lockActions } from "@/lib/actions/lock.action";
import type { LockContentForm, UnlockContentForm } from "@/lib/schemas/lock.schema";

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

describe("Lock Hooks Specification", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("Mutations", () => {
		it("useLock: harus memanggil lock service dengan payload yang benar", async () => {
			const { wrapper } = createWrapper();
			const serviceSpy = vi.spyOn(lockService, "lock").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => lockActions.useLock(), { wrapper });

			// ✅ Diperbarui: Menggunakan struktur data yang sesuai dengan lockContentSchema
			const mockPayload: LockContentForm = {
				locked_by: "123e4567-e89b-12d3-a456-426614174000", // Contoh UUID valid
				blog_id: "123e4567-e89b-12d3-a456-426614174001",
			};

			await result.current.mutateAsync(mockPayload);

			expect(serviceSpy).toHaveBeenCalledTimes(1);
			expect(serviceSpy).toHaveBeenCalledWith(mockPayload);
		});

		it("useUnlock: harus memanggil unlock service dengan payload yang benar", async () => {
			const { wrapper } = createWrapper();
			const serviceSpy = vi.spyOn(lockService, "unlock").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => lockActions.useUnlock(), { wrapper });

			// ✅ Diperbarui: Menggunakan struktur data yang sesuai dengan unlockContentSchema
			const mockPayload: UnlockContentForm = {
				project_id: "123e4567-e89b-12d3-a456-426614174002",
			};

			await result.current.mutateAsync(mockPayload);

			expect(serviceSpy).toHaveBeenCalledTimes(1);
			expect(serviceSpy).toHaveBeenCalledWith(mockPayload);
		});
	});
});