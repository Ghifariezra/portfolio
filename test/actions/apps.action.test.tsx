import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import
import { appsService } from "@/lib/services/apps.service";
import { appActions, appKeys } from "@/lib/actions/apps.action";

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

describe("Apps Hooks Specification", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("appKeys", () => {
        it("harus menghasilkan struktur key yang terurut dan konsisten", () => {
            expect(appKeys.all).toEqual(["apps"]);
            expect(appKeys.lists()).toEqual(["apps", "list"]);
            expect(appKeys.details()).toEqual(["apps", "detail"]);
            expect(appKeys.detail("123")).toEqual(["apps", "detail", "123"]);
        });
    });

    describe("Queries", () => {
        it("useGetApps: harus memanggil getApps service", async () => {
            const { wrapper } = createWrapper();
            const spy = vi.spyOn(appsService, "getApps").mockResolvedValue({ success: true, data: [] } as any);

            const { result } = renderHook(() => appActions.useGetApps(), { wrapper });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it("useGetAppById: harus memanggil getAppById service HANYA jika id tersedia (enabled)", async () => {
            const { wrapper } = createWrapper();
            const spy = vi.spyOn(appsService, "getAppById").mockResolvedValue({ success: true, data: {} } as any);

            // Test render dengan ID kosong
            const { result: emptyResult } = renderHook(() => appActions.useGetAppById(""), { wrapper });
            expect(emptyResult.current.fetchStatus).toBe("idle"); // Tidak melakukan fetch
            expect(spy).not.toHaveBeenCalled();

            // Test render dengan ID valid
            const { result: validResult } = renderHook(() => appActions.useGetAppById("app-123"), { wrapper });
            await waitFor(() => expect(validResult.current.isSuccess).toBe(true));
            expect(spy).toHaveBeenCalledWith("app-123");
        });
    });

    describe("Mutations (Side Effects & Invalidations)", () => {
        it("useUpsertApp: harus memanggil upsertApp dan me-reset cache list saat sukses", async () => {
            const { wrapper, queryClient } = createWrapper();
            const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
            const serviceSpy = vi.spyOn(appsService, "upsertApp").mockResolvedValue({ success: true } as any);

            const { result } = renderHook(() => appActions.useUpsertApp(), { wrapper });

            const mockPayload = { name: "Test App" } as any;

            // Eksekusi mutasi
            await result.current.mutateAsync(mockPayload);

            // Assertions
            expect(serviceSpy).toHaveBeenCalledWith(mockPayload);
            // Pastikan cache query 'list' dihapus agar UI fetch data terbaru
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: appKeys.lists() });
        });

        it("useDeleteApp: harus memanggil deleteApp dan me-reset cache list saat sukses", async () => {
            const { wrapper, queryClient } = createWrapper();
            const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
            const serviceSpy = vi.spyOn(appsService, "deleteApp").mockResolvedValue({ success: true } as any);

            const { result } = renderHook(() => appActions.useDeleteApp(), { wrapper });

            await result.current.mutateAsync("app-999");

            expect(serviceSpy).toHaveBeenCalledWith("app-999");
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: appKeys.lists() });
        });

        it("useAssignTags: harus memanggil assignTags dan me-reset cache list saat sukses", async () => {
            const { wrapper, queryClient } = createWrapper();
            const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
            const serviceSpy = vi.spyOn(appsService, "assignTags").mockResolvedValue({ success: true } as any);

            const { result } = renderHook(() => appActions.useAssignTags(), { wrapper });

            const mockPayload = { project_id: "1", tag_ids: ["2"] } as any;
            await result.current.mutateAsync(mockPayload);

            expect(serviceSpy).toHaveBeenCalledWith(mockPayload);
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: appKeys.lists() });
        });
    });
});