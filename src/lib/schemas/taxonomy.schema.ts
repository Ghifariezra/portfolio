import { z } from "zod";

export const upsertTagSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(1, "Name is required"),
	slug: z.string().min(1, "Slug is required"),
});

export type UpsertTagForm = z.infer<typeof upsertTagSchema>;

export const upsertCategorySchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(1, "Name is required"),
	slug: z.string().min(1, "Slug is required"),
});

export type UpsertCategoryForm = z.infer<typeof upsertCategorySchema>;
