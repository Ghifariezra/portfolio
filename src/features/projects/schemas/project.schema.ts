import { z } from "zod";
import { skillRefSchema } from "@/lib/schemas/skill-ref.schema";

export const PROJECT_STATUSES = ["in_progress", "completed", "archived"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/** Data portfolio dari DB (/api/v1/public/projects). Tanggal datang sebagai "YYYY-MM-DD". */
export const projectItemSchema = z.object({
    id: z.string(),
    slug: z.string(),
    /** Kunci ke endpoint live GitHub (/projects/:repo). null = project manual tanpa repo. */
    github_repo: z.string().nullable(),
    title: z.string(),
    description: z.string().nullable(),
    repo_url: z.string().nullable(),
    live_url: z.string().nullable(),
    image_url: z.string().nullable(),
    status: z.enum(PROJECT_STATUSES),
    featured: z.boolean(),
    sort_order: z.number(),
    start_date: z.string().nullable(),
    end_date: z.string().nullable(),
    bullets: z.array(z.string()),
    skills: z.array(skillRefSchema),
});
export type ProjectItem = z.infer<typeof projectItemSchema>;
