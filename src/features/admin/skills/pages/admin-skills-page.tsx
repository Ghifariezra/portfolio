import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { ErrorState } from "@/components/ui/error-state";
import { FilterChip } from "@/components/ui/filter-chip";
import { groupSkillsByCategory } from "@/features/portfolio/lib/portfolio-helpers";
import { getSkillCategoryMeta } from "@/features/portfolio/lib/skill-categories";
import { AdminList, AdminListRow, AdminQueryState } from "../../components/admin-list";
import { AdminPageHeader } from "../../components/admin-page-header";
import { useDeleteResource, useToggleResource } from "../../lib/admin-resource";
import { adminSkillsQuery, skillResource } from "../api/skill-admin-queries";
import { SkillEditor } from "../components/skill-editor";
import { emptySkillForm, type SkillCategory } from "../lib/skill-options";

export function AdminSkillsPage() {
    const query = useQuery(adminSkillsQuery());
    const toggle = useToggleResource(skillResource);
    const remove = useDeleteResource(skillResource);
    const writeError = toggle.error ?? remove.error;

    const [editingId, setEditingId] = useState<string | null>(null);
    // Mengganti key mengosongkan form "tambah" setelah berhasil menyimpan.
    const [createKey, setCreateKey] = useState(0);

    return (
        <section>
            <AdminPageHeader
                title="Skills"
                description="Skill dikelola sekali di sini, lalu dipilih di project, app, experience, education, dan CV. Menghapus skill otomatis melepasnya dari semua item. Pakai nama kanonik (mis. Apache JMeter) karena ATS mencocokkan kata kunci."
            />

            <div className="mb-8 border-2 border-border bg-card p-4">
                <SkillEditor
                    key={createKey}
                    id={null}
                    initial={emptySkillForm}
                    submitLabel="Add skill"
                    onDone={() => setCreateKey((k) => k + 1)}
                />
            </div>

            {writeError && <ErrorState message={writeError.message} />}

            <AdminQueryState
                query={query}
                emptyText="No skills yet. Add the first one above."
                errorText="Could not load skills."
            >
                {(items) => (
                    <div className="flex flex-col gap-8">
                        {groupSkillsByCategory(items).map((group) => (
                            <div key={group.category}>
                                <h2 className="mb-2 font-mono text-xs font-semibold">
                                    {getSkillCategoryMeta(group.category).label} ({group.skills.length})
                                </h2>
                                <AdminList>
                                    {group.skills.map((skill) => {
                                        const full = items.find((s) => s.id === skill.id);
                                        const visible = full?.is_visible ?? true;

                                        if (editingId === skill.id) {
                                            return (
                                                <li key={skill.id} className="p-4">
                                                    <SkillEditor
                                                        id={skill.id}
                                                        initial={{
                                                            name: skill.name,
                                                            category: skill.category as SkillCategory,
                                                            sort_order: String(skill.sort_order),
                                                        }}
                                                        submitLabel="Save"
                                                        onDone={() => setEditingId(null)}
                                                        onCancel={() => setEditingId(null)}
                                                    />
                                                </li>
                                            );
                                        }

                                        return (
                                            <AdminListRow
                                                key={skill.id}
                                                dimmed={!visible}
                                                title={<span className="font-heading font-semibold">{skill.name}</span>}
                                                subtitle={`order ${skill.sort_order}`}
                                            >
                                                <FilterChip
                                                    active={visible}
                                                    onClick={() =>
                                                        toggle.mutate({ id: skill.id, patch: { is_visible: !visible } })
                                                    }
                                                >
                                                    {visible ? "Visible" : "Hidden"}
                                                </FilterChip>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingId(skill.id)}
                                                    className="cursor-pointer border-2 border-border px-3 py-1 font-mono text-xs font-semibold hover:bg-muted"
                                                >
                                                    Edit
                                                </button>
                                                <ConfirmButton
                                                    onConfirm={() => remove.mutate(skill.id)}
                                                    disabled={remove.isPending}
                                                />
                                            </AdminListRow>
                                        );
                                    })}
                                </AdminList>
                            </div>
                        ))}
                    </div>
                )}
            </AdminQueryState>
        </section>
    );
}
