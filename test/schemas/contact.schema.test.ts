import { describe, expect, it, vi } from "vitest";
import { contactSchema } from "../../src/lib/schemas/contact.schema";

vi.mock("../../src/utils/xss", () => ({
	sanitizeText: vi.fn((val) => (val ? `SANITIZED_${val}` : val)),
}));

describe("Contact Schema Specification", () => {
	it("harus lolos jika semua field diisi dengan benar", () => {
		const validData = {
			name: "Ghifari Ezra",
			email: "ghifari@ezdev.xyz",
			phone: "08123456789",
			message: "Halo, saya ingin bertanya tentang proyek Anda.",
		};

		const result = contactSchema.safeParse(validData);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.name).toBe("SANITIZED_Ghifari Ezra");
		}
	});

	it("harus gagal jika nama kurang dari 2 karakter", () => {
		const data = { name: "A", email: "test@test.com", message: "Pesan minimal 10 karakter" };
		const result = contactSchema.safeParse(data);
		expect(result.success).toBe(false);
		expect(result.error?.issues[0].message).toBe("Name must be at least 2 characters");
	});

	it("harus gagal jika pesan kurang dari 10 karakter", () => {
		const data = { name: "Budi", email: "test@test.com", message: "Singkat" };
		const result = contactSchema.safeParse(data);
		expect(result.success).toBe(false);
		expect(result.error?.issues[0].message).toBe("Message must be at least 10 characters");
	});
});