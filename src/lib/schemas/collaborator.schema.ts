import { z } from "zod";
import { sanitizeText } from "@/utils/xss";

export const upsertCollaboratorSchema = z.object({
	id: z.string().uuid().optional(),
	// Data akan otomatis dicuci dari tag/script berbahaya sebelum dikirim
	name: z.string().min(1, "Name is required").transform(sanitizeText),
	role: z
		.string()
		.optional()
		.nullable()
		.transform((val) => (val ? sanitizeText(val) : val)),
});

export type UpsertCollaboratorForm = z.infer<typeof upsertCollaboratorSchema>;

export const upsertCollaboratorLinkSchema = z.object({
	id: z.string().uuid().optional(),
	collaborator_id: z.string().uuid("Collaborator ID is required"),
	platform: z.string().min(1, "Platform is required").transform(sanitizeText),

	url: z
		.string()
		.url("Invalid URL format")
		.min(1, "URL is required")
		.refine((val) => val.startsWith("http://") || val.startsWith("https://"), {
			message: "URL must start with http:// or https://",
		})
		.transform(sanitizeText),
});

export type UpsertCollaboratorLinkForm = z.infer<
	typeof upsertCollaboratorLinkSchema
>;
