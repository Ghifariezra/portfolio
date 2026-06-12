import { describe, expect, it, vi } from "vitest";
import type { ZodIssue } from "zod";
import {
	upsertCollaboratorLinkSchema,
	upsertCollaboratorSchema,
} from "../../src/lib/schemas/collaborator.schema";

// Mock fungsi xss agar kita fokus menguji validasi Zod
vi.mock("../../src/utils/xss", () => ({
	sanitizeText: vi.fn((val) => (val ? `SANITIZED_${val}` : val)),
}));

const VALID_UUID_1 = "123e4567-e89b-12d3-a456-426614174000";

describe("Collaborator Schema Specification", () => {

	// ==========================================
	// 1. PENGUJIAN UPSERT COLLABORATOR
	// ==========================================
	describe("upsertCollaboratorSchema", () => {
		it("harus lolos jika 'name' diisi dengan benar", () => {
			const validData = { name: "Budi Santoso" };
			const result = upsertCollaboratorSchema.safeParse(validData);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("SANITIZED_Budi Santoso");
			}
		});

		it("harus gagal jika 'name' dikosongkan", () => {
			const invalidData = { name: "" };
			const result = upsertCollaboratorSchema.safeParse(invalidData);

			expect(result.success).toBe(false);
			if (!result.success) {
				const nameIssue = result.error.issues.find((i: ZodIssue) => i.path.includes("name"));
				expect(nameIssue?.message).toBe("Name is required");
			}
		});
	});

	// ==========================================
	// 2. PENGUJIAN UPSERT COLLABORATOR LINK
	// ==========================================
	describe("upsertCollaboratorLinkSchema", () => {
		it("harus lolos jika semua field valid dan URL menggunakan http/https", () => {
			const validData = {
				collaborator_id: VALID_UUID_1,
				platform: "LinkedIn",
				url: "https://linkedin.com/in/budi",
			};

			const result = upsertCollaboratorLinkSchema.safeParse(validData);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.url).toBe("SANITIZED_https://linkedin.com/in/budi");
			}
		});

		it("harus gagal jika URL tidak diawali http/https", () => {
			const invalidData = {
				collaborator_id: VALID_UUID_1,
				platform: "Website",
				url: "ftp://budi.com", // Gagal di .refine()
			};

			const result = upsertCollaboratorLinkSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				const urlIssue = result.error.issues.find((i: ZodIssue) => i.path.includes("url"));
				expect(urlIssue?.message).toBe("URL must start with http:// or https://");
			}
		});

		it("harus gagal jika collaborator_id bukan format UUID", () => {
			const invalidData = {
				collaborator_id: "id-bukan-uuid",
				platform: "Twitter",
				url: "https://twitter.com/budi",
			};

			const result = upsertCollaboratorLinkSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				const idIssue = result.error.issues.find((i: ZodIssue) => i.path.includes("collaborator_id"));

				// Ubah ekspektasi sesuai dengan string kustom yang kamu tulis di skema
				expect(idIssue?.message).toBe("Collaborator ID is required");
			}
		});
	});
});