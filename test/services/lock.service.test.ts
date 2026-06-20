import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import dengan struktur foldermu
import { lockService, LockService } from "../../src/lib/services/lock.service";
import type { LockContentForm, UnlockContentForm } from "@/lib/schemas/lock.schema";

describe("LockService Specification", () => {
	describe("Singleton Pattern", () => {
		it("harus mengembalikan instance yang sama setiap kali getInstance dipanggil", () => {
			const instance1 = LockService.getInstance();
			const instance2 = LockService.getInstance();

			expect(instance1).toBe(instance2);
		});

		it("variabel yang di-export (lockService) harus merujuk ke instance tunggal", () => {
			const instance = LockService.getInstance();
			expect(lockService).toBe(instance);
		});
	});

	describe("API Endpoint Invocations", () => {
		let postSpy: any;

		beforeEach(() => {
			postSpy = vi.spyOn(lockService["api"], "post");
		});

		afterEach(() => {
			vi.restoreAllMocks();
		});

		describe("lock", () => {
			it("harus memanggil endpoint '/locks/lock' dengan method POST beserta payload", async () => {
				const mockPayload = {
					content_id: "doc-123",
					password: "securepassword",
				} as unknown as LockContentForm;

				const mockResponse = { success: true };
				postSpy.mockResolvedValue(mockResponse);

				const result = await lockService.lock(mockPayload);

				expect(postSpy).toHaveBeenCalledTimes(1);
				expect(postSpy).toHaveBeenCalledWith("/locks/lock", mockPayload);
				expect(result).toEqual(mockResponse);
			});
		});

		describe("unlock", () => {
			it("harus memanggil endpoint '/locks/unlock' dengan method POST beserta payload", async () => {
				const mockPayload = {
					content_id: "doc-123",
					password: "securepassword",
				} as unknown as UnlockContentForm;

				const mockResponse = { success: true, data: { unlocked: true } };
				postSpy.mockResolvedValue(mockResponse);

				const result = await lockService.unlock(mockPayload);

				expect(postSpy).toHaveBeenCalledTimes(1);
				expect(postSpy).toHaveBeenCalledWith("/locks/unlock", mockPayload);
				expect(result).toEqual(mockResponse);
			});
		});
	});
});