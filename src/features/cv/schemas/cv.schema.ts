import { z } from "zod";

const nullableString = z.string().nullable();

// Cermin keluaran CvDocumentBuilder.build() di API (lib/modules/cv-variants/cv-document.builder.ts).
// phone opsional: endpoint publik membuangnya secara default.
export const cvDocumentSchema = z.object({
    variant: z.object({
        id: z.string(),
        name: z.string(),
        locale: z.string(),
        is_default: z.boolean(),
    }),
    basics: z.object({
        full_name: z.string(),
        headline: nullableString,
        summary: nullableString,
        email: z.string(),
        phone: nullableString.optional(),
        location: z.string(),
        linkedin_url: nullableString,
        github_url: nullableString,
        website_url: nullableString,
    }),
    experiences: z.array(
        z.object({
            id: z.string(),
            company: z.string(),
            position: z.string(),
            employment_type: z.string(),
            location: nullableString,
            start_date: z.string(),
            end_date: nullableString,
            summary: nullableString,
            bullets: z.array(z.string()),
            skills: z.array(z.string()),
        }),
    ),
    education: z.array(
        z.object({
            id: z.string(),
            institution: z.string(),
            program: z.string(),
            kind: z.string(),
            location: nullableString,
            start_date: z.string(),
            end_date: nullableString,
            grade: nullableString,
            summary: nullableString,
            bullets: z.array(z.string()),
            skills: z.array(z.string()),
        }),
    ),
    certifications: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            issuer: z.string(),
            issued_date: nullableString,
            expires_date: nullableString,
            credential_id: nullableString,
            credential_url: nullableString,
            summary: nullableString,
        }),
    ),
    projects: z.array(
        z.object({
            id: z.string(),
            slug: z.string(),
            title: z.string(),
            github_repo: nullableString,
            description: nullableString,
            repo_url: nullableString,
            live_url: nullableString,
            start_date: nullableString,
            end_date: nullableString,
            bullets: z.array(z.string()),
            skills: z.array(z.string()),
        }),
    ),
    /** kategori -> nama skill, mis. { testing: ["Selenium", "Postman"] } */
    skills: z.record(z.string(), z.array(z.string())),
});
export type CvDocument = z.infer<typeof cvDocumentSchema>;