import { z } from "zod";

export const upsertAppSchema = z.object({
	id: z.string().uuid().optional(),
	user_id: z.string().uuid(),
	title: z.string().min(1, "Title is required"),
	description: z.string().optional().nullable(),
	image: z
		.string()
		.url("Invalid image URL")
		.optional()
		.nullable()
		.or(z.literal("")),
	status: z.string().default("coming_soon"), // 'published' | 'coming_soon'
	microsoft_store_id: z.string().optional().nullable(),
	store_url: z
		.string()
		.url("Invalid store URL")
		.optional()
		.nullable()
		.or(z.literal("")),
	tag_ids: z.array(z.string().uuid()).default([]),
});

export type UpsertAppForm = z.infer<typeof upsertAppSchema>;

export type UUID = string;
export interface AppListItem {
	id: UUID;
	name: string;
	description: string | null;
	image: string | null;
	status: string;
	microsoft_store_id: string | null;
	url_store: string | null;
	created_at: string;
	updated_at: string;

	// PERBAIKAN: Tags sekarang adalah array of object
	tags: { id: string; name: string }[];
}
