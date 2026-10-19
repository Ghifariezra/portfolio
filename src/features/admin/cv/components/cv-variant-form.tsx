import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { brutalButtonClass } from "@/components/ui/button-styles";
import { FormField } from "@/components/ui/form-field";
import { inputClass } from "@/components/ui/form-styles";
import { adminCertificationsQuery } from "@/features/admin/certifications/api/certification-admin-api";
import { FormFooter } from "@/features/admin/components/form-footer";
import { OrderedPicker, type PickerOption } from "@/features/admin/components/ordered-picker";
import { adminEducationListQuery } from "@/features/admin/education/api/education-admin-api";
import { adminExperiencesQuery } from "@/features/admin/experiences/api/experience-admin-api";
import { useResourceForm } from "@/features/admin/lib/use-resource-form";
import { adminProjectsQuery } from "@/features/admin/projects/api/project-admin-api";
import { adminSkillsQuery } from "@/features/admin/skills/api/skill-admin-queries";
import { saveCvVariant } from "../api/cv-variant-admin-api";
import { type CvFormState, toCvItems, toCvPayload } from "../lib/cv-form-state";
import { CV_LOCALES, type CvLocale } from "../schemas/admin-cv-variant.schema";

const LOCALE_LABEL: Record<CvLocale, string> = { en: "English", id: "Bahasa Indonesia" };

interface CvVariantFormProps {
    initial: CvFormState;
    /** null = varian baru. */
    variantId: string | null;
}

export function CvVariantForm({ initial, variantId }: CvVariantFormProps) {
    const navigate = useNavigate();
    const experiences = useQuery(adminExperiencesQuery());
    const education = useQuery(adminEducationListQuery());
    const certifications = useQuery(adminCertificationsQuery());
    const projects = useQuery(adminProjectsQuery());
    const skills = useQuery(adminSkillsQuery());

    const { form, set, submit, savedId, partial, errors, mutation } = useResourceForm({
        initial,
        id: variantId,
        onSaved: () => navigate({ to: "/admin/cv" }),
        save: ({ form: values, id, onCreated }) =>
            saveCvVariant({ id, payload: toCvPayload(values), items: toCvItems(values), onCreated }),
    });

    const options = <T,>(items: T[] | undefined, toOption: (item: T) => PickerOption): PickerOption[] =>
        (items ?? []).map(toOption);

    return (
        <form onSubmit={submit} className="flex max-w-2xl flex-col gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Name *" htmlFor="name" hint='Unik, mis. "QA Engineer Intern".' error={errors.name}>
                    <input
                        id="name"
                        required
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        aria-invalid={!!errors.name}
                        className={inputClass}
                    />
                </FormField>
                <FormField label="Locale" htmlFor="locale" error={errors.locale}>
                    <select
                        id="locale"
                        value={form.locale}
                        onChange={(e) => set("locale", e.target.value as CvLocale)}
                        className={inputClass}
                    >
                        {CV_LOCALES.map((l) => (
                            <option key={l} value={l}>
                                {LOCALE_LABEL[l]}
                            </option>
                        ))}
                    </select>
                </FormField>
            </div>

            <FormField
                label="Target role"
                htmlFor="target_role"
                hint="Menimpa headline profil di CV ini. Kosong = pakai headline profil."
                error={errors.target_role}
            >
                <input
                    id="target_role"
                    value={form.target_role}
                    onChange={(e) => set("target_role", e.target.value)}
                    aria-invalid={!!errors.target_role}
                    className={inputClass}
                />
            </FormField>

            <FormField
                label="Summary"
                htmlFor="summary"
                hint="Menimpa ringkasan profil di CV ini. Kosong = pakai ringkasan profil."
                error={errors.summary}
            >
                <textarea
                    id="summary"
                    rows={4}
                    value={form.summary}
                    onChange={(e) => set("summary", e.target.value)}
                    aria-invalid={!!errors.summary}
                    className={inputClass}
                />
            </FormField>

            <OrderedPicker
                legend="Experience"
                hint="Item di CV mengikuti urutan di bawah, bukan tanggal."
                options={options(experiences.data, (e) => ({ id: e.id, label: `${e.position} · ${e.company}` }))}
                value={form.experience_ids}
                onChange={(ids) => set("experience_ids", ids)}
                loading={experiences.isPending}
                error={errors.experience_ids}
            />
            <OrderedPicker
                legend="Education & training"
                options={options(education.data, (e) => ({ id: e.id, label: `${e.program} · ${e.institution}` }))}
                value={form.education_ids}
                onChange={(ids) => set("education_ids", ids)}
                loading={education.isPending}
                error={errors.education_ids}
            />
            <OrderedPicker
                legend="Certifications"
                options={options(certifications.data, (c) => ({ id: c.id, label: `${c.name} · ${c.issuer}` }))}
                value={form.certification_ids}
                onChange={(ids) => set("certification_ids", ids)}
                loading={certifications.isPending}
                error={errors.certification_ids}
            />
            <OrderedPicker
                legend="Projects"
                options={options(projects.data, (p) => ({ id: p.id, label: p.title }))}
                value={form.project_ids}
                onChange={(ids) => set("project_ids", ids)}
                loading={projects.isPending}
                error={errors.project_ids}
            />
            <OrderedPicker
                legend="Skills"
                hint="Dikelompokkan per kategori di CV; urutan di sini menentukan urutan dalam kategori."
                options={options(skills.data, (s) => ({ id: s.id, label: s.name }))}
                value={form.skill_ids}
                onChange={(ids) => set("skill_ids", ids)}
                loading={skills.isPending}
                error={errors.skill_ids}
            />

            <FormFooter
                error={mutation.error}
                partial={partial}
                pending={mutation.isPending}
                submitLabel={savedId ? "Save changes" : "Create CV variant"}
                cancel={
                    <Link to="/admin/cv" className={brutalButtonClass("card")}>
                        Cancel
                    </Link>
                }
            />
        </form>
    );
}
