import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { contactService } from "@/lib/services/contact.service";
import { contactActions, contactKeys } from "@/lib/actions/contact.action";

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

describe("Contact Hooks Specification", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("contactKeys", () => {
		it("harus menghasilkan struktur key yang konsisten", () => {
			expect(contactKeys.all).toEqual(["contact"]);
			expect(contactKeys.messages()).toEqual(["contact", "messages"]);
		});
	});

	describe("Mutations", () => {
		it("useSendMessage: harus memanggil sendMessage service dengan payload yang benar", async () => {
			const { wrapper } = createWrapper();
			const serviceSpy = vi.spyOn(contactService, "sendMessage").mockResolvedValue({ success: true } as any);

			const { result } = renderHook(() => contactActions.useSendMessage(), { wrapper });

			const mockPayload = {
				name: "John Doe",
				email: "john@example.com",
				message: "Hello there!",
				phone: "08123456789",
			};

			// Eksekusi mutasi
			await result.current.mutateAsync(mockPayload);

			// Verifikasi pemanggilan service
			expect(serviceSpy).toHaveBeenCalledTimes(1);
			expect(serviceSpy).toHaveBeenCalledWith(mockPayload);
		});
	});
});