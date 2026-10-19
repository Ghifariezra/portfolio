import { z } from "zod";
import { appItemSchema } from "@/features/apps/schemas/app.schema";

/**
 * Bentuk publik + field khusus admin. `project` di admin memuat `id` (bukan `github_repo`),
 * jadi di-override; `project_id` dipakai untuk mengisi form.
 */
export const adminAppSchema = appItemSchema.extend({
    is_visible: z.boolean(),
    project_id: z.string().nullable(),
    project: z.object({ id: z.string(), slug: z.string(), title: z.string() }).nullable(),
});
export type AdminApp = z.infer<typeof adminAppSchema>;
