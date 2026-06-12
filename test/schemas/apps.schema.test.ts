import { describe, expect, it } from "vitest";
import type { ZodIssue } from "zod";
import { upsertAppSchema } from "../../src/lib/schemas/apps.schema";

const VALID_UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("Apps Schema Specification", () => {
	describe("upsertAppSchema", () => {
		it("harus lolos jika field wajib (user_id, title) diisi", () => {
			const validData = {
				user_id: VALID_UUID,
				title: "Penyet Compressor",
			};

			const result = upsertAppSchema.safeParse(validData);
			expect(result.success).toBe(true);
			if (result.success) {
				// Verifikasi default values
				expect(result.data.status).toBe("coming_soon");
				expect(result.data.tag_ids).toEqual([]);
			}
		});

		it("harus gagal jika title dikosongkan", () => {
			const invalidData = {
				user_id: VALID_UUID,
				title: "",
			};

			const result = upsertAppSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				const issue = result.error.issues.find((i: ZodIssue) => i.path.includes("title"));
				expect(issue?.message).toBe("Title is required");
			}
		});

		it("harus menerima URL yang valid atau string kosong ('') pada field store_url", () => {
			const validUrlData = {
				user_id: VALID_UUID,
				title: "App Test",
				store_url: "https://apps.microsoft.com/store/detail/app-test",
			};
			const emptyUrlData = {
				...validUrlData,
				store_url: "",
			};

			expect(upsertAppSchema.safeParse(validUrlData).success).toBe(true);
			expect(upsertAppSchema.safeParse(emptyUrlData).success).toBe(true);
		});

		it("harus gagal jika store_url berisi string bukan URL", () => {
			const invalidUrlData = {
				user_id: VALID_UUID,
				title: "App Test",
				store_url: "bukan-url-yang-valid",
			};

			const result = upsertAppSchema.safeParse(invalidUrlData);
			expect(result.success).toBe(false);
			if (!result.success) {
				const issue = result.error.issues.find((i: ZodIssue) => i.path.includes("store_url"));
				expect(issue?.message).toBe("Invalid store URL");
			}
		});

		it("harus gagal jika tag_ids berisi ID yang bukan UUID", () => {
			const invalidData = {
				user_id: VALID_UUID,
				title: "App Test",
				tag_ids: ["bukan-uuid-123"],
			};

			const result = upsertAppSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				// Pastikan error-nya berada di dalam array tag_ids
				const issue = result.error.issues.find((i: ZodIssue) => i.path.includes("tag_ids"));
				expect(issue).toBeDefined();
			}
		});
	});
});