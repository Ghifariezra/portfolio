import { z } from "zod";
import type { UpsertCollaboratorForm } from "./collaborator.schema";
import type { UpsertTagForm } from "./taxonomy.schema";

// Tambahkan 2 baris ini di dalam upsertProjectSchema
export const upsertProjectSchema = z.object({
	id: z.string().uuid().optional(),
	user_id: z.string().uuid(),
	title: z.string().min(1, "Title is required"),
	slug: z.string().min(1, "Slug is required"),
	category_id: z.string().uuid().optional().nullable(),
	description: z.string().optional().nullable(),
	content: z.string().optional().nullable(),
	image: z
		.string()
		.url("Invalid image URL")
		.optional()
		.nullable()
		.or(z.literal("")),
	status: z.string().default("Individual"),
	progress: z.number().min(0).max(100).default(0),
	embed_url: z
		.string()
		.url("Invalid embed URL")
		.optional()
		.nullable()
		.or(z.literal("")),
	embed_type: z.string().optional().nullable(),

	// TAMBAHAN UNTUK FORM STATE
	tag_ids: z.array(z.string().uuid()).default([]),
	collaborator_ids: z.array(z.string().uuid()).default([]),
});

export type UpsertProjectForm = z.infer<typeof upsertProjectSchema>;

export const assignTagsSchema = z.object({
	resource_id: z.string().uuid(),
	tag_ids: z.array(z.string().uuid()),
});

export type AssignTagsForm = z.infer<typeof assignTagsSchema>;

export const assignCollaboratorsSchema = z.object({
	project_id: z.string().uuid(),
	collaborator_ids: z.array(z.string().uuid()),
});

export type AssignCollaboratorsForm = z.infer<typeof assignCollaboratorsSchema>;

export interface ProjectListItem {
	id: string;
	title: string;
	scheduled_at: string | null;
	slug: string;
	description: string | null;
	content: string | null;
	image: string | null;
	development_status: string;
	progress: number;
	embed_url: string | null;
	embed_type: string | null;
	created_at: string;
	updated_at: string;

	// Category Data
	category_id: string | null;
	category_name: string | null;
	category_slug: string | null;

	// Schedule Data
	publish_status: "draft" | "published" | "scheduled" | "archived";
	publish_date: string | null;

	// Lock Data
	is_locked: boolean;
	locked_by: string | null;

	// JSON Aggregations
	tags: UpsertTagForm[];
	collaborators: UpsertCollaboratorForm[];
}
