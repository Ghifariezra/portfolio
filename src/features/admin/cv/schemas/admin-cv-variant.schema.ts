import { z } from "zod";

export const CV_LOCALES = ["en", "id"] as const;
export type CvLocale = (typeof CV_LOCALES)[number];

const ids = z.array(z.string());

/** Varian CV + id item terpilih (urutan array = urutan tampil di CV). */
export const adminCvVariantSchema = z.object({
    id: z.string(),
    name: z.string(),
    target_role: z.string().nullable(),
    summary: z.string().nullable(),
    locale: z.enum(CV_LOCALES),
    is_default: z.boolean(),
    experience_ids: ids,
    education_ids: ids,
    certification_ids: ids,
    project_ids: ids,
    skill_ids: ids,
});
export type AdminCvVariant = z.infer<typeof adminCvVariantSchema>;

/** Hasil GET /:id/resolved: data siap render untuk generator CV/ATS. Bentuknya lebar, jadi hanya ditampilkan. */
export const cvResolvedSchema = z.record(z.string(), z.unknown());
