import { describe, expect, it } from "vitest";
import type { ZodIssue } from "zod";
import {
	upsertCertificateSchema,
	upsertSkillSchema,
} from "../../src/lib/schemas/resume.schema";

const VALID_UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("Resume Schema Specification", () => {

	// ==========================================
	// 1. PENGUJIAN UPSERT SKILL
	// ==========================================
	describe("upsertSkillSchema", () => {
		it("harus lolos jika semua field wajib diisi dengan benar", () => {
			const validData = {
				user_id: VALID_UUID,
				name: "TypeScript",
				type_skill: "Language",
			};
			const result = upsertSkillSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("harus gagal jika user_id bukan format UUID", () => {
			const invalidData = {
				user_id: "bukan-uuid",
				name: "React",
				type_skill: "Frontend",
			};
			const result = upsertSkillSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				const issue = result.error.issues.find((i: ZodIssue) => i.path.includes("user_id"));
				expect(issue?.message).toBe("Invalid User ID");
			}
		});

		it("harus lolos dengan image URL valid atau string kosong", () => {
			const data = {
				user_id: VALID_UUID,
				name: "Tailwind",
				type_skill: "CSS",
				image: "https://example.com/tailwind.png",
			};
			const dataEmpty = { ...data, image: "" };

			expect(upsertSkillSchema.safeParse(data).success).toBe(true);
			expect(upsertSkillSchema.safeParse(dataEmpty).success).toBe(true);
		});
	});

	// ==========================================
	// 2. PENGUJIAN UPSERT CERTIFICATE
	// ==========================================
	describe("upsertCertificateSchema", () => {
		it("harus lolos jika data sertifikat valid", () => {
			const validData = {
				user_id: VALID_UUID,
				name: "AWS Certified Developer",
				type_certified: "Cloud",
			};
			const result = upsertCertificateSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("harus gagal jika name atau type_certified dikosongkan", () => {
			const invalidData = {
				user_id: VALID_UUID,
				name: "",
				type_certified: "",
			};
			const result = upsertCertificateSchema.safeParse(invalidData);
			expect(result.success).toBe(false);

			const issues = result.error?.issues.map(i => i.message);
			expect(issues).toContain("Certificate name is required");
			expect(issues).toContain("Certificate type is required");
		});

		it("harus gagal jika image URL tidak valid", () => {
			const invalidData = {
				user_id: VALID_UUID,
				name: "GCP Associate",
				type_certified: "Cloud",
				image: "not-a-url",
			};
			const result = upsertCertificateSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				const issue = result.error.issues.find((i: ZodIssue) => i.path.includes("image"));
				expect(issue?.message).toBe("Invalid image URL");
			}
		});
	});
});