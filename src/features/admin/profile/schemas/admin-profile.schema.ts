import { z } from "zod";

/** GET /admin/profile: satu baris profil lengkap, termasuk email dan phone (tidak ada di endpoint publik). */
export const adminProfileSchema = z.object({
    id: z.string(),
    full_name: z.string(),
    headline: z.string().nullable(),
    summary: z.string().nullable(),
    email: z.string(),
    phone: z.string().nullable(),
    city: z.string().nullable(),
    region: z.string().nullable(),
    country: z.string(),
    linkedin_url: z.string().nullable(),
    github_url: z.string().nullable(),
    website_url: z.string().nullable(),
    avatar_url: z.string().nullable(),
});
export type AdminProfile = z.infer<typeof adminProfileSchema>;
