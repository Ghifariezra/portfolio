import { describe, expect, it, vi } from "vitest";
import type { ZodIssue } from "zod";
import { upsertScheduleSchema } from "../../src/lib/schemas/schedule.schema";

// Mock agar fungsi sanitizeText tidak perlu memanggil implementasi aslinya
vi.mock("../../src/utils/xss", () => ({
	sanitizeText: vi.fn((val) => (val ? `SANITIZED_${val}` : val)),
}));

const VALID_UUID_1 = "123e4567-e89b-12d3-a456-426614174000";
const VALID_UUID_2 = "987f6543-e21b-34c5-b678-537725285111";

describe("Schedule Schema Specification", () => {

	// ==========================================
	// 1. PENGUJIAN LOGIKA XOR (BLOG vs PROJECT)
	// ==========================================
	describe("Validasi XOR (Blog ID vs Project ID)", () => {
		it("harus lolos jika HANYA blog_id yang diisi", () => {
			const validData = {
				publish_status: "published",
				blog_id: VALID_UUID_1,
				project_id: null,
			};

			const result = upsertScheduleSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("harus lolos jika HANYA project_id yang diisi", () => {
			const validData = {
				publish_status: "draft",
				blog_id: null,
				project_id: VALID_UUID_2,
			};

			const result = upsertScheduleSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("harus gagal jika KEDUANYA (blog_id & project_id) diisi bersamaan", () => {
			const invalidData = {
				publish_status: "scheduled",
				blog_id: VALID_UUID_1,
				project_id: VALID_UUID_2,
			};

			const result = upsertScheduleSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				const xorIssue = result.error.issues.find((i: ZodIssue) => i.path.includes("project_id"));
				expect(xorIssue?.message).toBe("You must provide either a Blog ID or a Project ID, but not both.");
			}
		});

		it("harus gagal jika KEDUANYA dikosongkan (null/undefined)", () => {
			const invalidData = {
				publish_status: "draft",
				blog_id: null,
				project_id: null,
			};

			const result = upsertScheduleSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				const xorIssue = result.error.issues.find((i: ZodIssue) => i.path.includes("project_id"));
				expect(xorIssue?.message).toBe("You must provide either a Blog ID or a Project ID, but not both.");
			}
		});
	});

	// ==========================================
	// 2. PENGUJIAN VALIDASI FIELD DASAR
	// ==========================================
	describe("Validasi Field Dasar", () => {
		it("harus gagal jika publish_status tidak sesuai dengan daftar Enum", () => {
			const invalidData = {
				publish_status: "pending", // Tidak ada di enum
				blog_id: VALID_UUID_1,
				project_id: null,
			};

			const result = upsertScheduleSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				const statusIssue = result.error.issues.find((i: ZodIssue) =>
					i.path.includes("publish_status")
				);

				// Pastikan issue ditemukan
				expect(statusIssue).toBeDefined();

				// Cukup pastikan kodenya benar, yaitu invalid_enum_value ATAU invalid_type
				// Zod versi terbaru terkadang menggunakan 'invalid_type' untuk enum
				const validCodes = ['invalid_enum_value', 'invalid_type', 'invalid_value'];
				expect(validCodes).toContain(statusIssue?.code);
			}
		});

		it("harus gagal jika blog_id bukan format UUID", () => {
			const invalidData = {
				publish_status: "draft",
				blog_id: "invalid-uuid",
				project_id: null,
			};

			const result = upsertScheduleSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				const issue = result.error.issues.find((i: ZodIssue) => i.path.includes("blog_id"));
				expect(issue?.message).toBe("Invalid Blog ID");
			}
		});
	});

	// ==========================================
	// 3. PENGUJIAN TRANSFORM & SANITIZATION
	// ==========================================
	describe("Transformasi Data (Sanitize Text)", () => {
		it("harus membersihkan input publish_date dan scheduled_at jika diisi", () => {
			const data = {
				publish_status: "scheduled",
				project_id: VALID_UUID_2,
				publish_date: "2026-06-12",
				scheduled_at: "2026-06-13",
			};

			const result = upsertScheduleSchema.safeParse(data);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.publish_date).toBe("SANITIZED_2026-06-12");
				expect(result.data.scheduled_at).toBe("SANITIZED_2026-06-13");
			}
		});
	});
});