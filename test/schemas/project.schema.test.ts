import { describe, expect, it } from "vitest";
import type { ZodIssue } from "zod";
import {
	assignCollaboratorsSchema,
	assignTagsSchema,
	upsertProjectSchema,
} from "../../src/lib/schemas/project.schema";

describe("Project Schema Specification", () => {
	// ==========================================
	// 1. PENGUJIAN SKEMA UPSERT PROJECT
	// ==========================================
	describe("upsertProjectSchema", () => {
		it("harus lolos jika semua field yang wajib (required) diisi dengan benar", () => {
			const validData = {
				user_id: "123e4567-e89b-12d3-a456-426614174000",
				title: "Aplikasi Kasir",
				slug: "aplikasi-kasir",
				// Field lainnya menggunakan nilai default atau bersifat optional
			};

			const result = upsertProjectSchema.safeParse(validData);
			expect(result.success).toBe(true);
			if (result.success) {
				// Memastikan nilai default disetel dengan benar oleh Zod
				expect(result.data.status).toBe("Individual");
				expect(result.data.progress).toBe(0);
				expect(result.data.tag_ids).toEqual([]);
				expect(result.data.collaborator_ids).toEqual([]);
			}
		});

		it("harus gagal jika title atau slug dibiarkan kosong", () => {
			const invalidData = {
				user_id: "123e4567-e89b-12d3-a456-426614174000",
				title: "", // Tidak valid, minimal 1 karakter
				slug: "",  // Tidak valid
			};

			const result = upsertProjectSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				const titleIssue = result.error.issues.find((i: ZodIssue) => i.path.includes("title"));
				const slugIssue = result.error.issues.find((i: ZodIssue) => i.path.includes("slug"));

				expect(titleIssue?.message).toBe("Title is required");
				expect(slugIssue?.message).toBe("Slug is required");
			}
		});

		it("harus gagal jika progress berada di luar batas 0-100", () => {
			const dataOver = {
				user_id: "123e4567-e89b-12d3-a456-426614174000",
				title: "Valid Title",
				slug: "valid-slug",
				progress: 105, // Melebihi max(100)
			};

			const dataUnder = {
				...dataOver,
				progress: -10, // Kurang dari min(0)
			};

			const resultOver = upsertProjectSchema.safeParse(dataOver);
			const resultUnder = upsertProjectSchema.safeParse(dataUnder);

			expect(resultOver.success).toBe(false);
			expect(resultUnder.success).toBe(false);

			if (!resultOver.success) {
				const progressIssue = resultOver.error.issues.find((i: ZodIssue) => i.path.includes("progress"));
				expect(progressIssue?.code).toBe("too_big");
			}
		});

		it("harus menerima URL yang valid atau string kosong ('') pada field image dan embed_url", () => {
			const validUrlData = {
				user_id: "123e4567-e89b-12d3-a456-426614174000",
				title: "Test",
				slug: "test",
				image: "https://example.com/image.png",
				embed_url: "", // Diizinkan oleh .or(z.literal(""))
			};

			const result = upsertProjectSchema.safeParse(validUrlData);
			expect(result.success).toBe(true);
		});

		it("harus gagal jika image atau embed_url bukan URL valid (dan bukan string kosong)", () => {
			const invalidUrlData = {
				user_id: "123e4567-e89b-12d3-a456-426614174000",
				title: "Test",
				slug: "test",
				image: "bukan-sebuah-url", // Tidak lolos z.string().url()
			};

			const result = upsertProjectSchema.safeParse(invalidUrlData);
			expect(result.success).toBe(false);
			if (!result.success) {
				const imageIssue = result.error.issues.find((i: ZodIssue) => i.path.includes("image"));
				expect(imageIssue?.message).toBe("Invalid image URL");
			}
		});
	});

	// ==========================================
	// 2. PENGUJIAN SKEMA ASSIGN TAGS
	// ==========================================
	describe("assignTagsSchema", () => {
		it("harus lolos saat diberikan ID resource dan array berisi UUID tag", () => {
			const validData = {
				resource_id: "123e4567-e89b-12d3-a456-426614174000",
				tag_ids: [
					"987f6543-e21b-34c5-b678-537725285111",
					"550e8400-e29b-41d4-a716-446655440000",
				],
			};

			const result = assignTagsSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("harus gagal jika elemen dalam array tag_ids bukan UUID", () => {
			const invalidData = {
				resource_id: "123e4567-e89b-12d3-a456-426614174000",
				tag_ids: ["bukan-uuid"],
			};

			const result = assignTagsSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});

	// ==========================================
	// 3. PENGUJIAN SKEMA ASSIGN COLLABORATORS
	// ==========================================
	describe("assignCollaboratorsSchema", () => {
		it("harus lolos saat diberikan ID project dan array berisi UUID collaborator", () => {
			const validData = {
				project_id: "123e4567-e89b-12d3-a456-426614174000",
				collaborator_ids: [
					"987f6543-e21b-34c5-b678-537725285111",
				],
			};

			const result = assignCollaboratorsSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("harus gagal jika project_id bukan UUID", () => {
			const invalidData = {
				project_id: "invalid-id",
				collaborator_ids: [],
			};

			const result = assignCollaboratorsSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				const projectIssue = result.error.issues.find((i: ZodIssue) => i.path.includes("project_id"));
				expect(projectIssue?.message.toLowerCase()).toContain("uuid");
			}
		});
	});
});