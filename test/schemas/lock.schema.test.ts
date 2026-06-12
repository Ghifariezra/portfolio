import { describe, expect, it } from "vitest";
import { lockContentSchema, unlockContentSchema } from "../../src/lib/schemas/lock.schema";

const VALID_UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("Lock Schema Specification", () => {
	describe("lockContentSchema", () => {
		it("harus lolos jika semua data wajib (locked_by) valid", () => {
			const data = { locked_by: VALID_UUID };
			expect(lockContentSchema.safeParse(data).success).toBe(true);
		});

		it("harus gagal jika locked_by bukan UUID", () => {
			const data = { locked_by: "invalid-id" };
			const result = lockContentSchema.safeParse(data);
			expect(result.success).toBe(false);
			expect(result.error?.issues[0].message).toBe("Invalid user ID");
		});
	});

	describe("unlockContentSchema", () => {
		it("harus lolos jika dikirim kosong (semua field optional)", () => {
			expect(unlockContentSchema.safeParse({}).success).toBe(true);
		});

		it("harus lolos jika blog_id diberikan", () => {
			expect(unlockContentSchema.safeParse({ blog_id: VALID_UUID }).success).toBe(true);
		});
	});
});