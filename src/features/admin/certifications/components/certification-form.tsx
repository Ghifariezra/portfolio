import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { brutalButtonClass } from "@/components/ui/button-styles";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { FormField } from "@/components/ui/form-field";
import { inputClass } from "@/components/ui/form-styles";
import { FormFooter } from "@/features/admin/components/form-footer";
import { adminEducationListQuery } from "@/features/admin/education/api/education-admin-api";
import { saveResource } from "@/features/admin/lib/admin-resource";
import { useResourceForm } from "@/features/admin/lib/use-resource-form";
import { certificationResource } from "../api/certification-admin-api";
import { type CertificationFormState, toCertificationPayload } from "../lib/certification-form-state";

interface CertificationFormProps {
    initial: CertificationFormState;
    /** null = sertifikasi baru. */
    certificationId: string | null;
}

export function CertificationForm({ initial, certificationId }: CertificationFormProps) {
    const navigate = useNavigate();
    const education = useQuery(adminEducationListQuery());
    const { form, set, submit, savedId, partial, errors, mutation } = useResourceForm({
        initial,
        id: certificationId,
        onSaved: () => navigate({ to: "/admin/certifications" }),
        save: ({ form: values, id, onCreated }) =>
            saveResource(certificationResource, { id, payload: toCertificationPayload(values), onCreated }),
    });

    return (
        <form onSubmit={submit} className="flex max-w-2xl flex-col gap-6">
            <FormField label="Name *" htmlFor="name" error={errors.name}>
                <input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    aria-invalid={!!errors.name}
                    className={inputClass}
                />
            </FormField>

            <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Issuer *" htmlFor="issuer" error={errors.issuer}>
                    <input
                        id="issuer"
                        required
                        value={form.issuer}
                        onChange={(e) => set("issuer", e.target.value)}
                        aria-invalid={!!errors.issuer}
                        className={inputClass}
                    />
                </FormField>
                <FormField
                    label="From education / bootcamp"
                    htmlFor="education_id"
                    hint="Opsional. Mis. sertifikat ISTQB yang lahir dari bootcamp."
                    error={errors.education_id}
                >
                    <select
                        id="education_id"
                        value={form.education_id}
                        onChange={(e) => set("education_id", e.target.value)}
                        disabled={education.isPending}
                        className={inputClass}
                    >
                        <option value="">None</option>
                        {education.data?.map((e) => (
                            <option key={e.id} value={e.id}>
                                {e.program} · {e.institution}
                            </option>
                        ))}
                    </select>
                </FormField>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
                <FormField label="Issued" htmlFor="issued_date" error={errors.issued_date}>
                    <input
                        id="issued_date"
                        type="month"
                        value={form.issued_date}
                        onChange={(e) => set("issued_date", e.target.value)}
                        aria-invalid={!!errors.issued_date}
                        className={inputClass}
                    />
                </FormField>
                <FormField label="Expires" htmlFor="expires_date" error={errors.expires_date}>
                    <input
                        id="expires_date"
                        type="month"
                        value={form.expires_date}
                        onChange={(e) => set("expires_date", e.target.value)}
                        aria-invalid={!!errors.expires_date}
                        className={inputClass}
                    />
                </FormField>
                <FormField label="Sort order" htmlFor="sort_order" error={errors.sort_order}>
                    <input
                        id="sort_order"
                        type="number"
                        value={form.sort_order}
                        onChange={(e) => set("sort_order", e.target.value)}
                        aria-invalid={!!errors.sort_order}
                        className={inputClass}
                    />
                </FormField>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Credential ID" htmlFor="credential_id" error={errors.credential_id}>
                    <input
                        id="credential_id"
                        value={form.credential_id}
                        onChange={(e) => set("credential_id", e.target.value)}
                        aria-invalid={!!errors.credential_id}
                        className={inputClass}
                    />
                </FormField>
                <FormField label="Credential URL" htmlFor="credential_url" error={errors.credential_url}>
                    <input
                        id="credential_url"
                        type="url"
                        value={form.credential_url}
                        onChange={(e) => set("credential_url", e.target.value)}
                        aria-invalid={!!errors.credential_url}
                        className={inputClass}
                    />
                </FormField>
                <FormField
                    label="Learning report URL"
                    htmlFor="report_url"
                    hint="Opsional. Link PDF final report yang kamu host sendiri (mis. Supabase Storage atau R2)."
                    error={errors.report_url}
                >
                    <input
                        id="report_url"
                        type="url"
                        value={form.report_url}
                        onChange={(e) => set("report_url", e.target.value)}
                        aria-invalid={!!errors.report_url}
                        className={inputClass}
                    />
                </FormField>
            </div>

            <FormField label="Summary" htmlFor="summary" error={errors.summary}>
                <textarea
                    id="summary"
                    rows={3}
                    value={form.summary}
                    onChange={(e) => set("summary", e.target.value)}
                    aria-invalid={!!errors.summary}
                    className={inputClass}
                />
            </FormField>

            <CheckboxField
                id="is_visible"
                label="Visible on the site"
                checked={form.is_visible}
                onChange={(v) => set("is_visible", v)}
            />

            <FormFooter
                error={mutation.error}
                partial={partial}
                pending={mutation.isPending}
                submitLabel={savedId ? "Save changes" : "Create certification"}
                cancel={
                    <Link to="/admin/certifications" className={brutalButtonClass("card")}>
                        Cancel
                    </Link>
                }
            />
        </form>
    );
}
