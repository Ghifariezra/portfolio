import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import dengan struktur foldermu
import { contactService, ContactService } from "../../src/lib/services/contact.service";
import type { ContactForm } from "@/lib/schemas/contact.schema";

describe("ContactService Specification", () => {
	describe("Singleton Pattern", () => {
		it("harus mengembalikan instance yang sama setiap kali getInstance dipanggil", () => {
			const instance1 = ContactService.getInstance();
			const instance2 = ContactService.getInstance();

			expect(instance1).toBe(instance2);
		});

		it("variabel yang di-export (contactService) harus merujuk ke instance tunggal", () => {
			const instance = ContactService.getInstance();
			expect(contactService).toBe(instance);
		});
	});

	describe("API Endpoint Invocations", () => {
		let putSpy: any;

		beforeEach(() => {
			// Sesuai spesifikasi, service ini menggunakan method PUT
			putSpy = vi.spyOn(contactService["api"], "put");
		});

		afterEach(() => {
			vi.restoreAllMocks();
		});

		describe("sendMessage", () => {
			it("harus memanggil endpoint '/messages' dengan method PUT dan mapping 'phone' menjadi 'phone_number'", async () => {
				// Arrange: Payload awal dari form FE
				const mockPayload: ContactForm = {
					name: "John Doe",
					email: "john@example.com",
					message: "Halo, saya tertarik dengan layanan Anda.",
					phone: "081234567890",
				};

				// Ekspektasi data yang dikirim ke BE (sesuai mapping di service)
				const expectedData = {
					name: "John Doe",
					email: "john@example.com",
					message: "Halo, saya tertarik dengan layanan Anda.",
					phone_number: "081234567890", // <--- Poin penting yang diuji
				};

				const mockResponse = { success: true };
				putSpy.mockResolvedValue(mockResponse);

				// Act
				const result = await contactService.sendMessage(mockPayload);

				// Assert
				expect(putSpy).toHaveBeenCalledTimes(1);

				// Pastikan yang dipanggil adalah expectedData hasil mapping, BUKAN mockPayload mentah
				expect(putSpy).toHaveBeenCalledWith("/messages", expectedData);
				expect(result).toEqual(mockResponse);
			});
		});
	});
});