import { z } from "zod";

export const lockContentSchema = z.object({
	locked_by: z.string().uuid("Invalid user ID"),
	blog_id: z.string().uuid().optional().nullable(),
	project_id: z.string().uuid().optional().nullable(),
});

export const unlockContentSchema = z.object({
	blog_id: z.string().uuid().optional().nullable(),
	project_id: z.string().uuid().optional().nullable(),
});

export type LockContentForm = z.infer<typeof lockContentSchema>;
export type UnlockContentForm = z.infer<typeof unlockContentSchema>;
