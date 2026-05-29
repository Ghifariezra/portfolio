import { z } from "zod";
import { sanitizeText } from "@/utils/xss";

export const upsertScheduleSchema = z
	.object({
		id: z.string().uuid().optional(),
		publish_status: z.enum(["draft", "published", "scheduled", "archived"]),
		blog_id: z.string().uuid("Invalid Blog ID").optional().nullable(),
		project_id: z.string().uuid("Invalid Project ID").optional().nullable(),

		// Karena berupa string bebas, kita cuci agar tidak dimasukkan malicious tag
		publish_date: z
			.string()
			.optional()
			.nullable()
			.transform((val) => (val ? sanitizeText(val) : val)),

		scheduled_at: z
			.string()
			.optional()
			.nullable()
			.transform((val) => (val ? sanitizeText(val) : val)),
	})
	.refine(
		(data) => {
			// Validasi XOR: Hanya boleh salah satu yang terisi
			const hasBlog = !!data.blog_id;
			const hasProject = !!data.project_id;
			return (hasBlog && !hasProject) || (!hasBlog && hasProject);
		},
		{
			message:
				"You must provide either a Blog ID or a Project ID, but not both.",
			path: ["project_id"], // Pesan error akan diikat ke field project_id
		}
	);

export type UpsertScheduleForm = z.infer<typeof upsertScheduleSchema>;
