import { describe, expect, it, vi } from "vitest";
import {
	loginSchema,
	upsertUserSchema,
} from "../../src/lib/schemas/user.schema";

// Import fungsi sanitizeText agar kita bisa meniru (mock) atau mengecek pemanggilannya
// import { sanitizeText } from '../../src/utils/xss';

// Mock modul xss untuk memastikan kita tidak bergantung penuh pada library eksternal saat mengetes skema
vi.mock("../../src/utils/xss", () => ({
	sanitizeText: vi.fn((val: string) => `SANITIZED_${val}`),
}));

describe("User Schemas Specification", () => {
	describe("loginSchema", () => {
		it("harus lolos jika email valid dan password diisi", () => {
			const validData = {
				email: "ghifari@ezdev.xyz",
				password: "password123",
			};

			const result = loginSchema.safeParse(validData);

			expect(result.success).toBe(true);
			if (result.success) {
				// Pastikan transform(sanitizeText) dipanggil
				expect(result.data.email).toBe("SANITIZED_ghifari@ezdev.xyz");
				expect(result.data.password).toBe("password123");
			}
		});

		it("harus gagal jika email tidak sesuai format standar", () => {
			const invalidData = {
				email: "bukan-email-yang-benar",
				password: "password123",
			};

			const result = loginSchema.safeParse(invalidData);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Invalid email address");
			}
		});

		it("harus gagal jika password kosong", () => {
			const emptyPasswordData = {
				email: "test@ezdev.xyz",
				password: "", // Minimal 1 karakter
			};

			const result = loginSchema.safeParse(emptyPasswordData);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Password is required");
			}
		});
	});

	describe("upsertUserSchema", () => {
		it("harus lolos jika semua data esensial valid", () => {
			const validData = {
				id: "123e4567-e89b-12d3-a456-426614174000", // Format UUID valid
				username: "ghifari_ezra",
				email: "ghifari@ezdev.xyz",
				role: "admin",
				// Field opsional sengaja tidak diisi untuk melihat reaksi default() dan optional()
			};

			const result = upsertUserSchema.safeParse(validData);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.id).toBe(validData.id);
				expect(result.data.username).toBe("SANITIZED_ghifari_ezra");
				expect(result.data.email).toBe("SANITIZED_ghifari@ezdev.xyz");
				expect(result.data.role).toBe("admin"); // Role tidak diubah karena bukan optional yg terkena default() jika sudah diisi
			}
		});

		it('harus memberikan nilai default "user" pada role jika tidak disediakan', () => {
			const dataWithoutRole = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				username: "user_baru",
				email: "user@example.com",
			};

			const result = upsertUserSchema.safeParse(dataWithoutRole);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.role).toBe("user"); // Default Zod bekerja
			}
		});

		it("harus gagal jika id bukan format UUID", () => {
			const invalidIdData = {
				id: "id-sembarangan-123",
				username: "tester",
				email: "test@ezdev.xyz",
			};

			const result = upsertUserSchema.safeParse(invalidIdData);

			expect(result.success).toBe(false);
			if (!result.success) {
				// Pengecekkan field id
				const idIssue = result.error.issues.find(issue => issue.path.includes('id'));
				expect(idIssue).toBeDefined();

				// Ubah ke lowercase terlebih dahulu agar aman dari benturan huruf besar/kecil (UUID vs uuid)
				expect(idIssue?.message.toLowerCase()).toContain('uuid');
			}
		});

		it('harus berhasil memproses URL opsional atau URL kosong ("")', () => {
			const urlData = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				username: "dev_user",
				email: "dev@ezdev.xyz",
				github: "https://github.com/ghifari", // URL Valid
				linkedin: "", // String kosong diizinkan oleh .or(z.literal(""))
			};

			const result = upsertUserSchema.safeParse(urlData);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.github).toBe("SANITIZED_https://github.com/ghifari");
				expect(result.data.linkedin).toBe(""); // Tidak disanitize karena transform() kamu mensyaratkan `val ? sanitize(val) : val`
			}
		});

		it("harus gagal jika URL diisi dengan format yang salah", () => {
			const invalidUrlData = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				username: "dev_user",
				email: "dev@ezdev.xyz",
				image: "bukan-sebuah-url",
			};

			const result = upsertUserSchema.safeParse(invalidUrlData);

			expect(result.success).toBe(false);
			if (!result.success) {
				const imageError = result.error.issues.find((i) =>
					i.path.includes("image")
				);
				expect(imageError?.message).toBe("Invalid URL");
			}
		});
	});
});
