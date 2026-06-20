import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import dengan struktur foldermu
import { scheduleService } from "@/lib/services/schedule.service";
import { scheduleActions, scheduleKeys } from "@/lib/actions/schedule.action";

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

describe("Schedule Hooks Specification", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("scheduleKeys", () => {
		it("harus menghasilkan struktur key lists yang konsisten", () => {
			expect(scheduleKeys.all).toEqual(["schedules"]);
			expect(scheduleKeys.lists()).toEqual(["schedules", "list"]);
		});
	});

	describe("Queries", () => {
		it("useGetSchedules: harus memanggil getSchedules service", async () => {
			const { wrapper } = createWrapper();
			const spy = vi.spyOn(scheduleService, "getSchedules").mockResolvedValue({ success: true, data: [] } as any);

			const { result } = renderHook(() => scheduleActions.useGetSchedules(), { wrapper });

			await waitFor(() => expect(result.current.isSuccess).toBe(true));
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe("Mutations (Side Effects & Invalidations)", () => {
		it("useUpsertSchedule: harus memanggil upsertSchedule dan me-reset cache lists", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(scheduleService, "upsertSchedule").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => scheduleActions.useUpsertSchedule(), { wrapper });
			const mockPayload = { title: "Meeting" } as any;

			await result.current.mutateAsync(mockPayload);

			expect(serviceSpy).toHaveBeenCalledWith(mockPayload);
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: scheduleKeys.lists() });
		});

		it("useDeleteSchedule: harus memanggil deleteSchedule dan me-reset cache lists", async () => {
			const { wrapper, queryClient } = createWrapper();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
			const serviceSpy = vi.spyOn(scheduleService, "deleteSchedule").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => scheduleActions.useDeleteSchedule(), { wrapper });

			await result.current.mutateAsync("sched-123");

			expect(serviceSpy).toHaveBeenCalledWith("sched-123");
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: scheduleKeys.lists() });
		});
	});
});