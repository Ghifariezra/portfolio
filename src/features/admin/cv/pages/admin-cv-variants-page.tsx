import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { brutalButtonClass } from "@/components/ui/button-styles";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { ErrorState } from "@/components/ui/error-state";
import { Tag } from "@/components/ui/tag-list";
import { joinParts } from "@/features/portfolio/lib/portfolio-helpers";
import { ADMIN_ACTION_CLASS, AdminList, AdminListRow, AdminQueryState } from "../../components/admin-list";
import { AdminPageHeader } from "../../components/admin-page-header";
import { useDeleteResource, useRefreshAfterWrite } from "../../lib/admin-resource";
import { adminCvVariantsQuery, cvResource } from "../api/cv-variant-admin-api";

export function AdminCvVariantsPage() {
    const query = useQuery(adminCvVariantsQuery());
    const refresh = useRefreshAfterWrite();
    const remove = useDeleteResource(cvResource);
    const makeDefault = useMutation({ mutationFn: (id: string) => cvResource.setDefault(id), onSettled: refresh });
    const writeError = makeDefault.error ?? remove.error;

    return (
        <section>
            <AdminPageHeader
                title="CV"
                description="Satu varian per target lowongan. Varian memilih item mana yang ikut dan urutannya; data lengkapnya dipakai generator CV/ATS lewat endpoint resolved."
                actions={
                    <Link to="/admin/cv/new" className={brutalButtonClass("primary")}>
                        New CV variant
                    </Link>
                }
            />

            {writeError && <ErrorState message={writeError.message} />}

            <AdminQueryState
                query={query}
                emptyText="No CV variants yet. Create the first one."
                errorText="Could not load CV variants."
            >
                {(items) => (
                    <AdminList>
                        {items.map((v) => (
                            <AdminListRow
                                key={v.id}
                                title={
                                    <Link
                                        to="/admin/cv/$id"
                                        params={{ id: v.id }}
                                        className="font-heading font-semibold hover:text-primary"
                                    >
                                        {v.name}
                                    </Link>
                                }
                                subtitle={joinParts(
                                    [
                                        v.target_role,
                                        `${v.experience_ids.length} exp`,
                                        `${v.education_ids.length} edu`,
                                        `${v.certification_ids.length} cert`,
                                        `${v.project_ids.length} proj`,
                                        `${v.skill_ids.length} skills`,
                                    ],
                                    " · ",
                                )}
                            >
                                <Tag label={v.locale.toUpperCase()} size="sm" />
                                {v.is_default ? (
                                    <Tag label="Default" size="sm" />
                                ) : (
                                    <button
                                        type="button"
                                        disabled={makeDefault.isPending}
                                        onClick={() => makeDefault.mutate(v.id)}
                                        className="cursor-pointer border-2 border-border px-3 py-1 font-mono text-xs font-semibold hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Set default
                                    </button>
                                )}
                                <Link to="/admin/cv/$id" params={{ id: v.id }} className={ADMIN_ACTION_CLASS}>
                                    Edit
                                </Link>
                                <ConfirmButton onConfirm={() => remove.mutate(v.id)} disabled={remove.isPending} />
                            </AdminListRow>
                        ))}
                    </AdminList>
                )}
            </AdminQueryState>
        </section>
    );
}
