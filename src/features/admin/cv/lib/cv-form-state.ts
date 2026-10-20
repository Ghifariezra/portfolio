import type { CvItems } from "@/features/admin/cv/api/cv-variant-admin-api";
import type { AdminCvVariant, CvLocale } from "@/features/admin/cv/schemas/admin-cv-variant.schema";
import { orNull } from "@/features/admin/lib/form-utils";

/** Field yang dikirim ke POST/PATCH. is_default sengaja tidak ada: diubah lewat POST /:id/default. */
export interface CvVariantPayload {
    name: string;
    target_role: string | null;
    summary: string | null;
    locale: CvLocale;
}

export interface CvFormState extends CvItems {
    name: string;
    target_role: string;
    summary: string;
    locale: CvLocale;
}

export const emptyCvForm: CvFormState = {
    name: "",
    target_role: "",
    summary: "",
    locale: "en",
    experience_ids: [],
    education_ids: [],
    certification_ids: [],
    project_ids: [],
    skill_ids: [],
};

export function toCvForm(v: AdminCvVariant): CvFormState {
    return {
        name: v.name,
        target_role: v.target_role ?? "",
        summary: v.summary ?? "",
        locale: v.locale,
        experience_ids: v.experience_ids,
        education_ids: v.education_ids,
        certification_ids: v.certification_ids,
        project_ids: v.project_ids,
        skill_ids: v.skill_ids,
    };
}

export function toCvPayload(form: CvFormState): CvVariantPayload {
    return {
        name: form.name.trim(),
        target_role: orNull(form.target_role),
        summary: orNull(form.summary),
        locale: form.locale,
    };
}

export const toCvItems = (form: CvFormState): CvItems => ({
    experience_ids: form.experience_ids,
    education_ids: form.education_ids,
    certification_ids: form.certification_ids,
    project_ids: form.project_ids,
    skill_ids: form.skill_ids,
});
