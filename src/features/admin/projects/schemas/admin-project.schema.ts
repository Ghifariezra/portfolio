import { z } from "zod";
import { projectItemSchema } from "@/features/projects/schemas/project.schema";

/** Bentuk publik + field yang hanya terlihat di admin (project tersembunyi ikut muncul). */
export const adminProjectSchema = projectItemSchema.extend({
    is_visible: z.boolean(),
});
export type AdminProject = z.infer<typeof adminProjectSchema>;
