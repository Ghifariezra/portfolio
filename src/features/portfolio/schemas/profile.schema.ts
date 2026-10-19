import { z } from "zod";

export const profileSchema = z.object({
    id: z.string(),
    full_name: z.string(),
    headline: z.string().nullable(),
    summary: z.string().nullable(),
    city: z.string().nullable(),
    region: z.string().nullable(),
    country: z.string(),
    linkedin_url: z.string().nullable(),
    github_url: z.string().nullable(),
    website_url: z.string().nullable(),
    avatar_url: z.string().nullable(),
});
export type Profile = z.infer<typeof profileSchema>;
