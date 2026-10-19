import { z } from "zod";
import { skillRefSchema } from "@/lib/schemas/skill-ref.schema";

export const APP_STATUSES = ["coming_soon", "published", "archived"] as const;
export type AppStatus = (typeof APP_STATUSES)[number];

export const appItemSchema = z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    status: z.enum(APP_STATUSES),
    /** Product ID Microsoft Store (12 karakter). Kunci ke /azure/apps/:storeId/analytics. */
    microsoft_store_id: z.string().nullable(),
    store_url: z.string().nullable(),
    website_url: z.string().nullable(),
    icon_url: z.string().nullable(),
    released_at: z.string().nullable(),
    sort_order: z.number(),
    project: z
        .object({
            slug: z.string(),
            github_repo: z.string().nullable(),
            title: z.string(),
        })
        .nullable(),
    skills: z.array(skillRefSchema),
});
export type AppItem = z.infer<typeof appItemSchema>;
