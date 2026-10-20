import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { brutalButtonClass } from "@/components/ui/button-styles";
import { ErrorState } from "@/components/ui/error-state";
import { FilterChip } from "@/components/ui/filter-chip";
import { FormField } from "@/components/ui/form-field";
import { inputClass } from "@/components/ui/form-styles";
import { useSaveProject } from "@/features/admin/projects/api/use-project-mutations";
import { type ProjectFormState, parseBullets, toPayload } from "@/features/admin/projects/lib/project-form-state";
import { adminSkillsQuery } from "@/features/admin/skills/api/skill-admin-queries";
import { PROJECT_STATUSES, type ProjectStatus } from "@/features/projects/schemas/project.schema";
import { fieldErrors } from "@/lib/api";

interface ProjectFormProps {
    initial: ProjectFormState;
    /** null = project baru. */
    projectId: string | null;
}

function Checkbox({
    id,
    label,
    checked,
    onChange,
}: {
    id: string;
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-sm">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="size-4 accent-primary"
            />
            {label}
        </label>
    );
}

export function ProjectForm({ initial, projectId }: ProjectFormProps) {
    const navigate = useNavigate();
    const save = useSaveProject();
    const skills = useQuery(adminSkillsQuery());

    const [form, setForm] = useState(initial);
    // Setelah POST berhasil tapi langkah berikutnya gagal, simpan id-nya supaya submit ulang memakai PATCH.
    const [savedId, setSavedId] = useState(projectId);

    const set = <K extends keyof ProjectFormState>(key: K, value: ProjectFormState[K]) =>
        setForm((f) => ({ ...f, [key]: value }));

    const toggleSkill = (id: string) =>
        set(
            "skill_ids",
            form.skill_ids.includes(id) ? form.skill_ids.filter((s) => s !== id) : [...form.skill_ids, id],
        );

    const errors = fieldErrors(save.error);
    const half = savedId !== null && projectId === null && save.isError;

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        save.mutate(
            {
                id: savedId,
                payload: toPayload(form),
                bullets: parseBullets(form.bullets),
                skillIds: form.skill_ids,
                onCreated: setSavedId,
            },
            { onSuccess: () => navigate({ to: "/admin/projects" }) },
        );
    }

    const grouped = new Map<string, NonNullable<typeof skills.data>>();
    for (const skill of skills.data ?? []) grouped.set(skill.category, [...(grouped.get(skill.category) ?? []), skill]);

    return (
        <form onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-6">
            <FormField label="Title *" htmlFor="title" error={errors.title}>
                <input
                    id="title"
                    required
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    aria-invalid={!!errors.title}
                    className={inputClass}
                />
            </FormField>

            <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                    label="GitHub repo"
                    htmlFor="github_repo"
                    hint="Nama repo saja. Isi ini supaya stars, bahasa, dan README tampil live dari GitHub."
                    error={errors.github_repo}
                >
                    <input
                        id="github_repo"
                        value={form.github_repo}
                        onChange={(e) => set("github_repo", e.target.value)}
                        placeholder="gramedia-bva-e2e"
                        aria-invalid={!!errors.github_repo}
                        className={inputClass}
                    />
                </FormField>

                <FormField
                    label="Slug"
                    htmlFor="slug"
                    hint="Kosong = sama dengan GitHub repo. Dipakai di URL /projects/slug."
                    error={errors.slug}
                >
                    <input
                        id="slug"
                        value={form.slug}
                        onChange={(e) => set("slug", e.target.value)}
                        aria-invalid={!!errors.slug}
                        className={inputClass}
                    />
                </FormField>
            </div>

            <FormField
                label="Description"
                htmlFor="description"
                hint="Kosong = pakai deskripsi dari GitHub."
                error={errors.description}
            >
                <textarea
                    id="description"
                    rows={3}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    aria-invalid={!!errors.description}
                    className={inputClass}
                />
            </FormField>

            <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Live URL" htmlFor="live_url" error={errors.live_url}>
                    <input
                        id="live_url"
                        type="url"
                        value={form.live_url}
                        onChange={(e) => set("live_url", e.target.value)}
                        aria-invalid={!!errors.live_url}
                        className={inputClass}
                    />
                </FormField>
                <FormField
                    label="Repo URL"
                    htmlFor="repo_url"
                    hint="Hanya untuk project non-GitHub."
                    error={errors.repo_url}
                >
                    <input
                        id="repo_url"
                        type="url"
                        value={form.repo_url}
                        onChange={(e) => set("repo_url", e.target.value)}
                        aria-invalid={!!errors.repo_url}
                        className={inputClass}
                    />
                </FormField>
            </div>

            <FormField label="Image URL" htmlFor="image_url" error={errors.image_url}>
                <input
                    id="image_url"
                    type="url"
                    value={form.image_url}
                    onChange={(e) => set("image_url", e.target.value)}
                    aria-invalid={!!errors.image_url}
                    className={inputClass}
                />
            </FormField>

            <div className="grid gap-6 sm:grid-cols-4">
                <FormField label="Status" htmlFor="status" error={errors.status}>
                    <select
                        id="status"
                        value={form.status}
                        onChange={(e) => set("status", e.target.value as ProjectStatus)}
                        className={inputClass}
                    >
                        {PROJECT_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </FormField>
                <FormField label="Start" htmlFor="start_date" error={errors.start_date}>
                    <input
                        id="start_date"
                        type="month"
                        value={form.start_date}
                        onChange={(e) => set("start_date", e.target.value)}
                        aria-invalid={!!errors.start_date}
                        className={inputClass}
                    />
                </FormField>
                <FormField label="End" htmlFor="end_date" error={errors.end_date}>
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

            <div className="flex flex-wrap gap-6">
                <Checkbox
                    id="is_visible"
                    label="Visible on the site"
                    checked={form.is_visible}
                    onChange={(v) => set("is_visible", v)}
                />
                <Checkbox id="featured" label="Featured" checked={form.featured} onChange={(v) => set("featured", v)} />
            </div>

            <FormField
                label="Highlights"
                htmlFor="bullets"
                hint="Satu poin per baris. Dipakai di bagian Projects pada CV."
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

            <fieldset className="flex flex-col gap-3">
                <legend className="mb-1 font-mono text-xs font-semibold">Tech stack</legend>
                {skills.isPending && <p className="text-sm text-muted-foreground">Loading skills...</p>}
                {skills.isError && <ErrorState message="Could not load skills." onRetry={() => skills.refetch()} />}
                {skills.data?.length === 0 && (
                    <p className="text-sm text-muted-foreground">Belum ada skill. Tambahkan dulu di data skills.</p>
                )}
                {[...grouped].map(([category, items]) => (
                    <div key={category} className="flex flex-wrap items-center gap-2">
                        <span className="w-20 font-mono text-[11px] text-muted-foreground">{category}</span>
                        {items.map((skill) => (
                            <FilterChip
                                key={skill.id}
                                active={form.skill_ids.includes(skill.id)}
                                onClick={() => toggleSkill(skill.id)}
                            >
                                {skill.name}
                            </FilterChip>
                        ))}
                    </div>
                ))}
                {errors.skill_ids && (
                    <p role="alert" className="text-xs text-destructive">
                        {errors.skill_ids}
                    </p>
                )}
            </fieldset>

            {save.isError && (
                <ErrorState
                    message={
                        half
                            ? `Project sudah dibuat, tapi langkah berikutnya gagal: ${save.error.message}. Perbaiki lalu simpan lagi.`
                            : save.error.message
                    }
                />
            )}

            <div className="flex gap-3">
                <button type="submit" disabled={save.isPending} className={brutalButtonClass("primary")}>
                    {save.isPending ? "Saving..." : savedId ? "Save changes" : "Create project"}
                </button>
                <Link to="/admin/projects" className={brutalButtonClass("card")}>
                    Cancel
                </Link>
            </div>
        </form>
    );
}
