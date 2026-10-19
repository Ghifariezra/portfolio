import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { brutalButtonClass } from "@/components/ui/button-styles";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { FormField } from "@/components/ui/form-field";
import { inputClass } from "@/components/ui/form-styles";
import { FormFooter } from "@/features/admin/components/form-footer";
import { SkillPicker } from "@/features/admin/components/skill-picker";
import { saveResource } from "@/features/admin/lib/admin-resource";
import { useResourceForm } from "@/features/admin/lib/use-resource-form";
import { adminProjectsQuery } from "@/features/admin/projects/api/project-admin-api";
import { APP_STATUS_LABEL } from "@/features/apps/lib/app-helpers";
import { APP_STATUSES, type AppStatus } from "@/features/apps/schemas/app.schema";
import { appResource } from "../api/app-admin-api";
import { type AppFormState, toAppPayload } from "../lib/app-form-state";

interface AppFormProps {
    initial: AppFormState;
    /** null = app baru. */
    appId: string | null;
}

export function AppForm({ initial, appId }: AppFormProps) {
    const navigate = useNavigate();
    const projects = useQuery(adminProjectsQuery());
    const { form, set, submit, savedId, partial, errors, mutation } = useResourceForm({
        initial,
        id: appId,
        onSaved: () => navigate({ to: "/admin/apps" }),
        // App hanya punya PUT /:id/skills (tanpa bullets).
        save: ({ form: values, id, onCreated }) =>
            saveResource(appResource, { id, payload: toAppPayload(values), skillIds: values.skill_ids, onCreated }),
    });

    const published = form.status === "published";

    return (
        <form onSubmit={submit} className="flex max-w-2xl flex-col gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
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
                <FormField
                    label="Slug"
                    htmlFor="slug"
                    hint="Kosong = diturunkan dari nama. Huruf kecil, angka, dan tanda hubung."
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

            <FormField label="Description" htmlFor="description" error={errors.description}>
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
                <FormField label="Status" htmlFor="status" error={errors.status}>
                    <select
                        id="status"
                        value={form.status}
                        onChange={(e) => set("status", e.target.value as AppStatus)}
                        className={inputClass}
                    >
                        {APP_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {APP_STATUS_LABEL[s]}
                            </option>
                        ))}
                    </select>
                </FormField>
                <FormField
                    label={published ? "Microsoft Store ID *" : "Microsoft Store ID"}
                    htmlFor="microsoft_store_id"
                    hint="12 karakter huruf besar/angka. Wajib untuk status Live; kunci metrics install."
                    error={errors.microsoft_store_id}
                >
                    <input
                        id="microsoft_store_id"
                        required={published}
                        maxLength={12}
                        value={form.microsoft_store_id}
                        onChange={(e) => set("microsoft_store_id", e.target.value.toUpperCase())}
                        placeholder="9NBLGGH4NNS1"
                        aria-invalid={!!errors.microsoft_store_id}
                        className={inputClass}
                    />
                </FormField>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Store URL" htmlFor="store_url" error={errors.store_url}>
                    <input
                        id="store_url"
                        type="url"
                        value={form.store_url}
                        onChange={(e) => set("store_url", e.target.value)}
                        aria-invalid={!!errors.store_url}
                        className={inputClass}
                    />
                </FormField>
                <FormField label="Website URL" htmlFor="website_url" error={errors.website_url}>
                    <input
                        id="website_url"
                        type="url"
                        value={form.website_url}
                        onChange={(e) => set("website_url", e.target.value)}
                        aria-invalid={!!errors.website_url}
                        className={inputClass}
                    />
                </FormField>
            </div>

            <FormField label="Icon URL" htmlFor="icon_url" error={errors.icon_url}>
                <input
                    id="icon_url"
                    type="url"
                    value={form.icon_url}
                    onChange={(e) => set("icon_url", e.target.value)}
                    aria-invalid={!!errors.icon_url}
                    className={inputClass}
                />
            </FormField>

            <div className="grid gap-6 sm:grid-cols-3">
                <FormField label="Released" htmlFor="released_at" error={errors.released_at}>
                    <input
                        id="released_at"
                        type="date"
                        value={form.released_at}
                        onChange={(e) => set("released_at", e.target.value)}
                        aria-invalid={!!errors.released_at}
                        className={inputClass}
                    />
                </FormField>
                <FormField
                    label="Source project"
                    htmlFor="project_id"
                    hint="Repo sumber app (opsional)."
                    error={errors.project_id}
                >
                    <select
                        id="project_id"
                        value={form.project_id}
                        onChange={(e) => set("project_id", e.target.value)}
                        disabled={projects.isPending}
                        className={inputClass}
                    >
                        <option value="">None</option>
                        {projects.data?.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.title}
                            </option>
                        ))}
                    </select>
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

            <CheckboxField
                id="is_visible"
                label="Visible on the site"
                checked={form.is_visible}
                onChange={(v) => set("is_visible", v)}
            />

            <SkillPicker value={form.skill_ids} onChange={(ids) => set("skill_ids", ids)} error={errors.skill_ids} />

            <FormFooter
                error={mutation.error}
                partial={partial}
                pending={mutation.isPending}
                submitLabel={savedId ? "Save changes" : "Create app"}
                cancel={
                    <Link to="/admin/apps" className={brutalButtonClass("card")}>
                        Cancel
                    </Link>
                }
            />
        </form>
    );
}
