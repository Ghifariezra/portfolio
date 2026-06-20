import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import dengan struktur foldermu
import { userService } from "@/lib/services/user.service";
import { userActions, userKeys } from "@/lib/actions/user.action";

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

describe("User Hooks Specification", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("userKeys", () => {
		it("harus menghasilkan struktur key yang konsisten", () => {
			expect(userKeys.all).toEqual(["user"]);
			expect(userKeys.profile()).toEqual(["user", "profile"]);
			expect(userKeys.me()).toEqual(["user", "me"]);
		});
	});

	describe("Queries", () => {
		it("useGetMe: harus memanggil getMe service dengan retry false", async () => {
			const { wrapper } = createWrapper();
			const spy = vi.spyOn(userService, "getMe").mockResolvedValue({ success: true, data: {} } as any);

			const { result } = renderHook(() => userActions.useGetMe(), { wrapper });

			await waitFor(() => expect(result.current.isSuccess).toBe(true));
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe("Mutations", () => {
		it("useLogin: harus memanggil login service dengan payload yang benar", async () => {
			const { wrapper } = createWrapper();
			const serviceSpy = vi.spyOn(userService, "login").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => userActions.useLogin(), { wrapper });
			const mockPayload = { username: "admin", password: "password" } as any;

			await result.current.mutateAsync(mockPayload);

			expect(serviceSpy).toHaveBeenCalledWith(mockPayload);
		});

		it("useLogout: harus memanggil logout service", async () => {
			const { wrapper } = createWrapper();
			const serviceSpy = vi.spyOn(userService, "logout").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => userActions.useLogout(), { wrapper });

			await result.current.mutateAsync();

			expect(serviceSpy).toHaveBeenCalledTimes(1);
		});

		it("useUpsertProfile: harus memanggil upsertProfile service dengan payload form", async () => {
			const { wrapper } = createWrapper();
			const serviceSpy = vi.spyOn(userService, "upsertProfile").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => userActions.useUpsertProfile(), { wrapper });
			const mockPayload = { username: "updated_admin" } as any;

			await result.current.mutateAsync(mockPayload);

			expect(serviceSpy).toHaveBeenCalledWith(mockPayload);
		});
	});
});