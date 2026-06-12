import { describe, expect, it } from "vitest";
import type { ZodIssue } from "zod";
// Sesuaikan path import dengan struktur foldermu
import {
	AssignBlogTagsSchema,
	UpsertBlogSchema,
} from "../../src/lib/schemas/blog.schema";

// UUID valid untuk keperluan testing agar lolos validasi Zod
const VALID_UUID_1 = "123e4567-e89b-12d3-a456-426614174000";
const VALID_UUID_2 = "987f6543-e21b-34c5-b678-537725285111";
const VALID_UUID_3 = "550e8400-e29b-41d4-a716-446655440000";

describe("Blog Schema Specification", () => {
	// ==========================================
	// 1. PENGUJIAN SKEMA UPSERT BLOG
	// ==========================================
	describe("UpsertBlogSchema", () => {
		it("harus lolos jika field minimal (wajib) diisi dengan benar", () => {
			const validData = {
				user_id: VALID_UUID_1,
				title: "Belajar TypeScript",
				slug: "belajar-typescript",
			};

			const result = UpsertBlogSchema.safeParse(validData);
			expect(result.success).toBe(true);
			if (result.success) {
				// Memastikan nilai default bawaan Zod terpasang
				expect(result.data.progress).toBe(0);
				expect(result.data.tag_ids).toEqual([]);
				// Field optional yang tidak diisi akan menjadi undefined (bukan null, sesuai sifat safeParse jika key tidak ada)
				expect(result.data.description).toBeUndefined();
			}
		});

		it("harus gagal jika title atau slug dikosongkan", () => {
			const invalidData = {
				user_id: VALID_UUID_1,
				title: "",
				slug: "",
			};

			const result = UpsertBlogSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				// Zod string().min(1) secara default akan memberikan error "too_small" jika string kosong
				const titleIssue = result.error.issues.find((i: ZodIssue) => i.path.includes("title"));
				const slugIssue = result.error.issues.find((i: ZodIssue) => i.path.includes("slug"));

				expect(titleIssue?.code).toBe("too_small");
				expect(slugIssue?.code).toBe("too_small");
			}
		});

		it("harus gagal jika user_id bukan format UUID yang valid", () => {
			const invalidData = {
				user_id: "id-palsu",
				title: "Test Blog",
				slug: "test-blog",
			};

			const result = UpsertBlogSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				const userIssue = result.error.issues.find((i: ZodIssue) => i.path.includes("user_id"));
				expect(userIssue?.message.toLowerCase()).toContain("uuid");
			}
		});

		it("harus memvalidasi field progress (harus integer, min 0, max 100)", () => {
			const baseData = {
				user_id: VALID_UUID_1,
				title: "Test Blog",
				slug: "test-blog",
			};

			// Test 1: Kurang dari 0
			const underResult = UpsertBlogSchema.safeParse({ ...baseData, progress: -5 });
			expect(underResult.success).toBe(false);

			// Test 2: Lebih dari 100
			const overResult = UpsertBlogSchema.safeParse({ ...baseData, progress: 105 });
			expect(overResult.success).toBe(false);

			// Test 3: Bukan Integer
			const floatResult = UpsertBlogSchema.safeParse({ ...baseData, progress: 50.5 });
			expect(floatResult.success).toBe(false);
			if (!floatResult.success) {
				// Gunakan .toContain agar tidak sensitif dengan perbedaan "int" vs "integer"
				expect(floatResult.error.issues[0].message.toLowerCase()).toContain("int");
			}
		});

		it("harus gagal jika image atau embed_url diisi dengan string tapi BUKAN format URL", () => {
			const invalidUrlData = {
				user_id: VALID_UUID_1,
				title: "Test Blog",
				slug: "test-blog",
				image: "gambar-tanpa-url",
				embed_url: "youtube-tanpa-url",
			};

			const result = UpsertBlogSchema.safeParse(invalidUrlData);
			expect(result.success).toBe(false);
			if (!result.success) {
				// Perbaikan: Zod sering mengembalikan "invalid_string" atau "invalid_format" 
				// tergantung pada internal chain. Gunakan pengecekan yang lebih fleksibel:
				const codes = result.error.issues.map(i => i.code);
				expect(codes).toContain("invalid_format");
			}
		});
	});

	// ==========================================
	// 2. PENGUJIAN SKEMA ASSIGN BLOG TAGS
	// ==========================================
	describe("AssignBlogTagsSchema", () => {
		it("harus lolos saat diberikan ID resource dan array berisi UUID tag", () => {
			const validData = {
				resource_id: VALID_UUID_1,
				tag_ids: [VALID_UUID_2, VALID_UUID_3],
			};

			const result = AssignBlogTagsSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("harus gagal jika array tag_ids berisi string yang bukan UUID", () => {
			const invalidData = {
				resource_id: VALID_UUID_1,
				tag_ids: ["bukan-uuid"],
			};

			const result = AssignBlogTagsSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				const tagIssue = result.error.issues.find((i: ZodIssue) => i.path.includes("tag_ids"));
				expect(tagIssue?.message.toLowerCase()).toContain("uuid");
			}
		});
	});
});