import { z } from "zod";
import type { UpsertTagForm } from "./taxonomy.schema";

export const UpsertBlogSchema = z.object({
	id: z.string().uuid().optional(),
	user_id: z.string().uuid(),
	title: z.string().min(1),
	slug: z.string().min(1),
	description: z.string().optional().nullable(),
	content: z.string().optional().nullable(),
	image: z.string().url().optional().nullable(),
	type_language: z.string().optional().nullable(),
	progress: z.number().int().min(0).max(100).default(0),
	embed_url: z.string().url().optional().nullable(),
	embed_type: z.string().optional().nullable(),
	tag_ids: z.array(z.string().uuid()).default([]),
});

export type UpsertBlogForm = z.infer<typeof UpsertBlogSchema>;

export const AssignBlogTagsSchema = z.object({
	resource_id: z.string().uuid(),
	tag_ids: z.array(z.string().uuid()),
});

export type AssignBlogTagsForm = z.infer<typeof AssignBlogTagsSchema>;

export interface BlogListItem {
	id: string;
	title: string;
	slug: string;
	description: string | null;
	content: string | null;
	image: string | null;
	type_language: string | null;
	progress: number;
	embed_url: string | null;
	embed_type: string | null;
	created_at: string;
	updated_at: string;

	// Schedule
	publish_status: "draft" | "published" | "scheduled" | "archived";
	publish_date: string | null;
	scheduled_at: string | null;
	published_at: string | null;

	// Lock
	is_locked: boolean;
	locked_by: string | null;

	// Aggregations
	tags: UpsertTagForm[];
}
