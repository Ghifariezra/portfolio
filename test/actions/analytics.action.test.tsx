import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import
import { analyticsService } from "@/lib/services/analytics.service";
import { analyticsActions, analyticsKeys } from "@/lib/actions/analytics.action";

// Bantuan untuk membuat environment React Query yang bersih setiap test
const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } }, // Matikan retry agar test lebih cepat
	});
	return {
		queryClient,
		wrapper: ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client= { queryClient } >
			{ children }
			</QueryClientProvider>
        ),
    };
};

describe("Analytics Hooks Specification", () => {
	beforeEach(() => {
		vi.spyOn(analyticsService, "getOverviewAnalytics");
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("analyticsKeys", () => {
		it("harus menghasilkan struktur key yang konsisten", () => {
			expect(analyticsKeys.all).toEqual(["analytics"]);
			expect(analyticsKeys.overview()).toEqual(["analytics", "overview"]);
		});
	});

	describe("useGetOverview", () => {
		it("harus memanggil analyticsService.getOverviewAnalytics dan me-return data", async () => {
			const { wrapper } = createWrapper();
			const mockResponse = { success: true, data: { metrics: {}, recentActivities: [] } } as any;

			vi.mocked(analyticsService.getOverviewAnalytics).mockResolvedValue(mockResponse);

			const { result } = renderHook(() => analyticsActions.useGetOverview(), { wrapper });

			// Tunggu sampai query selesai (isSuccess = true)
			await waitFor(() => expect(result.current.isSuccess).toBe(true));

			expect(analyticsService.getOverviewAnalytics).toHaveBeenCalledTimes(1);
			expect(result.current.data).toEqual(mockResponse);
		});
	});
});