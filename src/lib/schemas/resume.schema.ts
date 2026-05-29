import { z } from "zod";

export const upsertSkillSchema = z.object({
	id: z.string().uuid().optional(),
	user_id: z.string().uuid("Invalid User ID"),
	name: z.string().min(1, "Skill name is required"),
	type_skill: z.string().min(1, "Skill type is required"),
	image: z
		.string()
		.url("Invalid image URL")
		.optional()
		.nullable()
		.or(z.literal("")),
});

export type UpsertSkillForm = z.infer<typeof upsertSkillSchema>;

export const upsertCertificateSchema = z.object({
	id: z.string().uuid().optional(),
	user_id: z.string().uuid("Invalid User ID"),
	name: z.string().min(1, "Certificate name is required"),
	type_certified: z.string().min(1, "Certificate type is required"),
	image: z
		.string()
		.url("Invalid image URL")
		.optional()
		.nullable()
		.or(z.literal("")),
});

export type UpsertCertificateForm = z.infer<typeof upsertCertificateSchema>;
