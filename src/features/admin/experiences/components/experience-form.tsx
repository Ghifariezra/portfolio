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
import { EMPLOYMENT_LABEL } from "@/features/portfolio/lib/portfolio-helpers";
import { EMPLOYMENT_TYPES } from "@/features/portfolio/schemas/experience.schema";
import { experienceResource } from "../api/experience-admin-api";
import { type EmploymentType, type ExperienceFormState, toExperiencePayload } from "../lib/experience-form-state";

interface ExperienceFormProps {
    initial: ExperienceFormState;
    /** null = experience baru. */
    experienceId: string | null;
}

export function ExperienceForm({ initial, experienceId }: ExperienceFormProps) {
    const navigate = useNavigate();
    const { form, set, submit, savedId, partial, errors, mutation } = useResourceForm({
        initial,
        id: experienceId,
        onSaved: () => navigate({ to: "/admin/experiences" }),
        save: ({ form: values, id, onCreated }) =>
            saveResource(experienceResource, {
                id,
                payload: toExperiencePayload(values),
                bullets: parseLines(values.bullets),
                skillIds: values.skill_ids,
                onCreated,
            }),
    });

    return (
        <form onSubmit={submit} className="flex max-w-2xl flex-col gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Position *" htmlFor="position" error={errors.position}>
                    <input
                        id="position"
                        required
                        value={form.position}
                        onChange={(e) => set("position", e.target.value)}
                        aria-invalid={!!errors.position}
                        className={inputClass}
                    />
                </FormField>
                <FormField label="Company *" htmlFor="company" error={errors.company}>
                    <input
                        id="company"
                        required
                        value={form.company}
                        onChange={(e) => set("company", e.target.value)}
                        aria-invalid={!!errors.company}
                        className={inputClass}
                    />
                </FormField>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Type" htmlFor="employment_type" error={errors.employment_type}>
                    <select
                        id="employment_type"
                        value={form.employment_type}
                        onChange={(e) => set("employment_type", e.target.value as EmploymentType)}
                        className={inputClass}
                    >
                        {EMPLOYMENT_TYPES.map((t) => (
                            <option key={t} value={t}>
                                {EMPLOYMENT_LABEL[t]}
                            </option>
                        ))}
                    </select>
                </FormField>
                <FormField label="Location" htmlFor="location" error={errors.location}>
                    <input
                        id="location"
                        value={form.location}
                        onChange={(e) => set("location", e.target.value)}
                        aria-invalid={!!errors.location}
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
                <FormField
                    label="End"
                    htmlFor="end_date"
                    hint="Kosong = masih berjalan (Present)."
                    error={errors.end_date}
                >
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

            <FormField
                label="Highlights"
                htmlFor="bullets"
                hint="Satu poin per baris. Dicetak sebagai bullet di CV."
                error={errors.bullets}
            >
                <textarea
                    id="bullets"
                    rows={5}
                    value={form.bullets}
                    onChange={(e) => set("bullets", e.target.value)}
                    aria-invalid={!!errors.bullets}
                    className={inputClass}
                />
            </FormField>

            <SkillPicker value={form.skill_ids} onChange={(ids) => set("skill_ids", ids)} error={errors.skill_ids} />

            <FormFooter
                error={mutation.error}
                partial={partial}
                pending={mutation.isPending}
                submitLabel={savedId ? "Save changes" : "Create experience"}
                cancel={
                    <Link to="/admin/experiences" className={brutalButtonClass("card")}>
                        Cancel
                    </Link>
                }
            />
        </form>
    );
}
