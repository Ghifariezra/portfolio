import { Link, useNavigate } from "@tanstack/react-router";
import { brutalButtonClass } from "@/components/ui/button-styles";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { FormField } from "@/components/ui/form-field";
import { inputClass } from "@/components/ui/form-styles";
import { FormFooter } from "@/features/admin/components/form-footer";
import { SkillPicker } from "@/features/admin/components/skill-picker";
import { saveResource } from "@/features/admin/lib/admin-resource";
import { parseLines } from "@/features/admin/lib/form-utils";
import { useResourceForm } from "@/features/admin/lib/use-resource-form";
import { EDUCATION_KIND_LABEL } from "@/features/portfolio/lib/portfolio-helpers";
import { EDUCATION_KINDS } from "@/features/portfolio/schemas/education.schema";
import { educationResource } from "../api/education-admin-api";
import { type EducationFormState, type EducationKind, toEducationPayload } from "../lib/education-form-state";

interface EducationFormProps {
    initial: EducationFormState;
    /** null = education baru. */
    educationId: string | null;
}

export function EducationForm({ initial, educationId }: EducationFormProps) {
    const navigate = useNavigate();
    const { form, set, submit, savedId, partial, errors, mutation } = useResourceForm({
        initial,
        id: educationId,
        onSaved: () => navigate({ to: "/admin/education" }),
        save: ({ form: values, id, onCreated }) =>
            saveResource(educationResource, {
                id,
                payload: toEducationPayload(values),
                bullets: parseLines(values.bullets),
                skillIds: values.skill_ids,
                onCreated,
            }),
    });

    return (
        <form onSubmit={submit} className="flex max-w-2xl flex-col gap-6">
            <FormField
                label="Program *"
                htmlFor="program"
                hint='Mis. "S1 - Informatics Engineering".'
                error={errors.program}
            >
                <input
                    id="program"
                    required
                    value={form.program}
                    onChange={(e) => set("program", e.target.value)}
                    aria-invalid={!!errors.program}
                    className={inputClass}
                />
            </FormField>

            <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Institution *" htmlFor="institution" error={errors.institution}>
                    <input
                        id="institution"
                        required
                        value={form.institution}
                        onChange={(e) => set("institution", e.target.value)}
                        aria-invalid={!!errors.institution}
                        className={inputClass}
                    />
                </FormField>
                <FormField label="Kind" htmlFor="kind" hint="Formal dan Training dipisah di CV." error={errors.kind}>
                    <select
                        id="kind"
                        value={form.kind}
                        onChange={(e) => set("kind", e.target.value as EducationKind)}
                        className={inputClass}
                    >
                        {EDUCATION_KINDS.map((k) => (
                            <option key={k} value={k}>
                                {EDUCATION_KIND_LABEL[k]}
                            </option>
                        ))}
                    </select>
                </FormField>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Location" htmlFor="location" error={errors.location}>
                    <input
                        id="location"
                        value={form.location}
                        onChange={(e) => set("location", e.target.value)}
                        aria-invalid={!!errors.location}
                        className={inputClass}
                    />
                </FormField>
                <FormField label="Grade" htmlFor="grade" hint='Mis. "3.38 / 4.00" atau "96.8".' error={errors.grade}>
                    <input
                        id="grade"
                        value={form.grade}
                        onChange={(e) => set("grade", e.target.value)}
                        aria-invalid={!!errors.grade}
                        className={inputClass}
                    />
                </FormField>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
                <FormField label="Start *" htmlFor="start_date" error={errors.start_date}>
                    <input
                        id="start_date"
                        type="month"
                        required
                        value={form.start_date}
                        onChange={(e) => set("start_date", e.target.value)}
                        aria-invalid={!!errors.start_date}
                        className={inputClass}
                    />
                </FormField>
                <FormField label="End" htmlFor="end_date" hint="Kosong = masih berjalan." error={errors.end_date}>
                    <input
                        id="end_date"
                        type="month"
                        value={form.end_date}
                        onChange={(e) => set("end_date", e.target.value)}
                        aria-invalid={!!errors.end_date}
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

            <FormField label="Highlights" htmlFor="bullets" hint="Satu poin per baris." error={errors.bullets}>
                <textarea
                    id="bullets"
                    rows={5}
                    value={form.bullets}
                    onChange={(e) => set("bullets", e.target.value)}
                    aria-invalid={!!errors.bullets}
                    className={inputClass}
                />
            </FormField>

            <SkillPicker
                legend="Skills learned"
                value={form.skill_ids}
                onChange={(ids) => set("skill_ids", ids)}
                error={errors.skill_ids}
            />

            <FormFooter
                error={mutation.error}
                partial={partial}
                pending={mutation.isPending}
                submitLabel={savedId ? "Save changes" : "Create education"}
                cancel={
                    <Link to="/admin/education" className={brutalButtonClass("card")}>
                        Cancel
                    </Link>
                }
            />
        </form>
    );
}
