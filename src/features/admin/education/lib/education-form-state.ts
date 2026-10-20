import type { AdminEducation } from "@/features/admin/education/schemas/admin-education.schema";
import { orNull, parseSortOrder, toMonthInput } from "@/features/admin/lib/form-utils";
import type { EDUCATION_KINDS } from "@/features/portfolio/schemas/education.schema";

export type EducationKind = (typeof EDUCATION_KINDS)[number];

/** Field yang dikirim ke POST/PATCH. Server memakai strictObject, jadi jangan kirim field lain. */
export interface EducationPayload {
    institution: string;
    program: string;
    kind: EducationKind;
    location: string | null;
    start_date: string;
    end_date: string | null;
    grade: string | null;
    summary: string | null;
    sort_order: number;
    is_visible: boolean;
}

export interface EducationFormState {
    institution: string;
    program: string;
    kind: EducationKind;
    location: string;
    /** "YYYY-MM" (format <input type="month">). */
    start_date: string;
    /** Kosong = masih berjalan. */
    end_date: string;
    grade: string;
    summary: string;
    sort_order: string;
    is_visible: boolean;
    /** Satu bullet per baris. */
    bullets: string;
    skill_ids: string[];
}

export const emptyEducationForm: EducationFormState = {
    institution: "",
    program: "",
    kind: "formal",
    location: "",
    start_date: "",
    end_date: "",
    grade: "",
    summary: "",
    sort_order: "0",
    is_visible: true,
    bullets: "",
    skill_ids: [],
};

export function toEducationForm(e: AdminEducation): EducationFormState {
    return {
        institution: e.institution,
        program: e.program,
        kind: e.kind,
        location: e.location ?? "",
        start_date: toMonthInput(e.start_date),
        end_date: toMonthInput(e.end_date),
        grade: e.grade ?? "",
        summary: e.summary ?? "",
        sort_order: String(e.sort_order),
        is_visible: e.is_visible,
        bullets: e.bullets.join("\n"),
        skill_ids: e.skills.map((s) => s.id),
    };
}

export function toEducationPayload(form: EducationFormState): EducationPayload {
    return {
        institution: form.institution.trim(),
        program: form.program.trim(),
        kind: form.kind,
        location: orNull(form.location),
        start_date: form.start_date,
        end_date: orNull(form.end_date),
        grade: orNull(form.grade),
        summary: orNull(form.summary),
        sort_order: parseSortOrder(form.sort_order),
        is_visible: form.is_visible,
    };
}
