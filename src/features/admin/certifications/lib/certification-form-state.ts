import { orNull, parseSortOrder, toMonthInput } from "@/features/admin/lib/form-utils";
import type { AdminCertification } from "../schemas/admin-certification.schema";

/** Field yang dikirim ke POST/PATCH. Server memakai strictObject, jadi jangan kirim field lain. */
export interface CertificationPayload {
    name: string;
    issuer: string;
    education_id: string | null;
    issued_date: string | null;
    expires_date: string | null;
    credential_id: string | null;
    credential_url: string | null;
    report_url: string | null;
    summary: string | null;
    sort_order: number;
    is_visible: boolean;
}

export interface CertificationFormState {
    name: string;
    issuer: string;
    /** "" = tidak ditautkan ke pendidikan/bootcamp mana pun. */
    education_id: string;
    /** "YYYY-MM" (format <input type="month">). */
    issued_date: string;
    expires_date: string;
    credential_id: string;
    credential_url: string;
    report_url: string;
    summary: string;
    sort_order: string;
    is_visible: boolean;
}

export const emptyCertificationForm: CertificationFormState = {
    name: "",
    issuer: "",
    education_id: "",
    issued_date: "",
    expires_date: "",
    credential_id: "",
    credential_url: "",
    report_url: "",
    summary: "",
    sort_order: "0",
    is_visible: true,
};

export function toCertificationForm(c: AdminCertification): CertificationFormState {
    return {
        name: c.name,
        issuer: c.issuer,
        education_id: c.education_id ?? "",
        issued_date: toMonthInput(c.issued_date),
        expires_date: toMonthInput(c.expires_date),
        credential_id: c.credential_id ?? "",
        credential_url: c.credential_url ?? "",
        report_url: c.report_url ?? "",
        summary: c.summary ?? "",
        sort_order: String(c.sort_order),
        is_visible: c.is_visible,
    };
}

export function toCertificationPayload(form: CertificationFormState): CertificationPayload {
    return {
        name: form.name.trim(),
        issuer: form.issuer.trim(),
        education_id: orNull(form.education_id),
        issued_date: orNull(form.issued_date),
        expires_date: orNull(form.expires_date),
        credential_id: orNull(form.credential_id),
        credential_url: orNull(form.credential_url),
        report_url: orNull(form.report_url),
        summary: orNull(form.summary),
        sort_order: parseSortOrder(form.sort_order),
        is_visible: form.is_visible,
    };
}
