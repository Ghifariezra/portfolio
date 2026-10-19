import { orNull, parseSortOrder, toMonthInput } from "@/features/admin/lib/form-utils";
import type { EMPLOYMENT_TYPES } from "@/features/portfolio/schemas/experience.schema";
import type { AdminExperience } from "../schemas/admin-experience.schema";

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

/** Field yang dikirim ke POST/PATCH. Server memakai strictObject, jadi jangan kirim field lain. */
export interface ExperiencePayload {
    company: string;
    position: string;
    employment_type: EmploymentType;
    location: string | null;
    start_date: string;
    end_date: string | null;
    summary: string | null;
    sort_order: number;
    is_visible: boolean;
}

/** Semua input berupa string supaya cocok dengan <input>; diubah ke tipe API di toExperiencePayload(). */
export interface ExperienceFormState {
    company: string;
    position: string;
    employment_type: EmploymentType;
    location: string;
    /** "YYYY-MM" (format <input type="month">). */
    start_date: string;
    /** Kosong = masih berjalan (Present). */
    end_date: string;
    summary: string;
    sort_order: string;
    is_visible: boolean;
    /** Satu bullet per baris. */
    bullets: string;
    skill_ids: string[];
}

export const emptyExperienceForm: ExperienceFormState = {
    company: "",
    position: "",
    employment_type: "full_time",
    location: "",
    start_date: "",
    end_date: "",
    summary: "",
    sort_order: "0",
    is_visible: true,
    bullets: "",
    skill_ids: [],
};

export function toExperienceForm(e: AdminExperience): ExperienceFormState {
    return {
        company: e.company,
        position: e.position,
        employment_type: e.employment_type,
        location: e.location ?? "",
        start_date: toMonthInput(e.start_date),
        end_date: toMonthInput(e.end_date),
        summary: e.summary ?? "",
        sort_order: String(e.sort_order),
        is_visible: e.is_visible,
        bullets: e.bullets.join("\n"),
        skill_ids: e.skills.map((s) => s.id),
    };
}

export function toExperiencePayload(form: ExperienceFormState): ExperiencePayload {
    return {
        company: form.company.trim(),
        position: form.position.trim(),
        employment_type: form.employment_type,
        location: orNull(form.location),
        start_date: form.start_date,
        end_date: orNull(form.end_date),
        summary: orNull(form.summary),
        sort_order: parseSortOrder(form.sort_order),
        is_visible: form.is_visible,
    };
}
