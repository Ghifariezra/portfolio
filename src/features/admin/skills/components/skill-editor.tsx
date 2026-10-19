import { useId } from "react";
import { brutalButtonClass } from "@/components/ui/button-styles";
import { FormField } from "@/components/ui/form-field";
import { inputClass } from "@/components/ui/form-styles";
import { saveResource } from "@/features/admin/lib/admin-resource";
import { parseSortOrder } from "@/features/admin/lib/form-utils";
import { useResourceForm } from "@/features/admin/lib/use-resource-form";
import { getSkillCategoryMeta } from "@/features/portfolio/lib/skill-categories";
import { ApiError } from "@/lib/api";
import { skillResource } from "../api/skill-admin-queries";
import { SKILL_CATEGORY_OPTIONS, type SkillCategory, type SkillFormState } from "../lib/skill-options";

interface SkillEditorProps {
    /** null = skill baru. */
    id: string | null;
    initial: SkillFormState;
    submitLabel: string;
    onDone: () => void;
    onCancel?: () => void;
}

/** Form satu baris untuk menambah / mengubah skill. */
export function SkillEditor({ id, initial, submitLabel, onDone, onCancel }: SkillEditorProps) {
    const uid = useId();
    const { form, set, submit, errors, mutation } = useResourceForm({
        initial,
        id,
        onSaved: onDone,
        save: ({ form: values, id: savedId, onCreated }) =>
            saveResource(skillResource, {
                id: savedId,
                payload: {
                    name: values.name.trim(),
                    category: values.category,
                    sort_order: parseSortOrder(values.sort_order),
                },
                onCreated,
            }),
    });

    const duplicate = mutation.error instanceof ApiError && mutation.error.status === 409;
    const generalError =
        mutation.isError && Object.keys(errors).length === 0
            ? duplicate
                ? "Skill dengan nama itu sudah ada (huruf besar/kecil dianggap sama)."
                : mutation.error.message
            : null;

    return (
        <form onSubmit={submit}>
            <div className="flex flex-wrap items-end gap-3">
                <FormField label="Name" htmlFor={`${uid}-name`} error={errors.name} className="min-w-40 flex-1">
                    <input
                        id={`${uid}-name`}
                        required
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Apache JMeter"
                        aria-invalid={!!errors.name}
                        className={inputClass}
                    />
                </FormField>
                <FormField label="Category" htmlFor={`${uid}-category`} error={errors.category}>
                    <select
                        id={`${uid}-category`}
                        value={form.category}
                        onChange={(e) => set("category", e.target.value as SkillCategory)}
                        className={inputClass}
                    >
                        {SKILL_CATEGORY_OPTIONS.map((c) => (
                            <option key={c} value={c}>
                                {getSkillCategoryMeta(c).label}
                            </option>
                        ))}
                    </select>
                </FormField>
                <FormField label="Order" htmlFor={`${uid}-order`} error={errors.sort_order} className="w-24">
                    <input
                        id={`${uid}-order`}
                        type="number"
                        value={form.sort_order}
                        onChange={(e) => set("sort_order", e.target.value)}
                        aria-invalid={!!errors.sort_order}
                        className={inputClass}
                    />
                </FormField>
                <button type="submit" disabled={mutation.isPending} className={brutalButtonClass("primary")}>
                    {mutation.isPending ? "Saving..." : submitLabel}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel} className={brutalButtonClass("card")}>
                        Cancel
                    </button>
                )}
            </div>
            {generalError && (
                <p role="alert" className="mt-2 text-xs text-destructive">
                    {generalError}
                </p>
            )}
        </form>
    );
}
