import { describe, expect, it } from "vitest";
import type { ZodIssue } from "zod";
// Path import sudah disesuaikan ke folder lib dan diurutkan sesuai abjad (Biome)
import {
	upsertCategorySchema,
	upsertTagSchema,
} from "../../src/lib/schemas/taxonomy.schema";

describe("Taxonomy Schema Specification", () => {
	// ==========================================
	// TESTING UNTUK UPSERT TAG SCHEMA
	// ==========================================
	describe("upsertTagSchema", () => {
		it("harus lolos jika semua data lengkap dan valid", () => {
			const validData = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				name: "React",
				slug: "react",
			};

			const result = upsertTagSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("harus lolos meskipun 'id' tidak disertakan (karena statusnya optional)", () => {
			const validDataWithoutId = {
				name: "TypeScript",
				slug: "typescript",
			};

			const result = upsertTagSchema.safeParse(validDataWithoutId);
			expect(result.success).toBe(true);
		});

		it("harus gagal jika 'name' dikosongkan", () => {
			const invalidData = {
				name: "",
				slug: "javascript",
			};

			const result = upsertTagSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				// Menambahkan tipe data eksplisit ZodIssue untuk memuaskan TypeScript
				const nameIssue = result.error.issues.find((i: ZodIssue) => i.path.includes("name"));
				expect(nameIssue?.message).toBe("Name is required");
			}
		});

		it("harus gagal jika 'slug' dikosongkan", () => {
			const invalidData = {
				name: "JavaScript",
				slug: "",
			};

			const result = upsertTagSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				// Menambahkan tipe data eksplisit ZodIssue
				const slugIssue = result.error.issues.find((i: ZodIssue) => i.path.includes("slug"));
				expect(slugIssue?.message).toBe("Slug is required");
			}
		});

		it("harus gagal jika 'id' disertakan namun bukan dalam format UUID yang valid", () => {
			const invalidData = {
				id: "bukan-sebuah-uuid-yang-benar",
				name: "Node.js",
				slug: "node-js",
			};

			const result = upsertTagSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				// Menambahkan tipe data eksplisit ZodIssue
				const idIssue = result.error.issues.find((i: ZodIssue) => i.path.includes("id"));
				expect(idIssue).toBeDefined();
				expect(idIssue?.message.toLowerCase()).toContain("uuid");
			}
		});
	});

	// ==========================================
	// TESTING UNTUK UPSERT CATEGORY SCHEMA
	// ==========================================
	describe("upsertCategorySchema", () => {
		it("harus lolos jika data kategori valid tanpa id", () => {
			const validData = {
				name: "Web Development",
				slug: "web-development",
			};

			const result = upsertCategorySchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("harus gagal dan memberikan pesan error yang tepat jika 'name' kategori kosong", () => {
			const invalidData = {
				name: "",
				slug: "web-dev",
			};

			const result = upsertCategorySchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Name is required");
			}
		});
	});
});