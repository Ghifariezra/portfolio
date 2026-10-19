import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { brutalButtonClass } from "@/components/ui/button-styles";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { ErrorState } from "@/components/ui/error-state";
import { FilterChip } from "@/components/ui/filter-chip";
import { Tag } from "@/components/ui/tag-list";
import { APP_STATUS_LABEL } from "@/features/apps/lib/app-helpers";
import { joinParts } from "@/features/portfolio/lib/portfolio-helpers";
import { ADMIN_ACTION_CLASS, AdminList, AdminListRow, AdminQueryState } from "../../components/admin-list";
import { AdminPageHeader } from "../../components/admin-page-header";
import { useDeleteResource, useToggleResource } from "../../lib/admin-resource";
import { adminAppsQuery, appResource } from "../api/app-admin-api";

export function AdminAppsPage() {
    const query = useQuery(adminAppsQuery());
    const toggle = useToggleResource(appResource);
    const remove = useDeleteResource(appResource);
    const writeError = toggle.error ?? remove.error;

    return (
        <section>
            <AdminPageHeader
                title="Apps"
                description="Aplikasi Microsoft Store. Angka install tetap live dari Microsoft lewat Store ID, hanya kurasinya yang disimpan di sini."
                actions={
                    <Link to="/admin/apps/new" className={brutalButtonClass("primary")}>
                        New app
                    </Link>
                }
            />

            {writeError && <ErrorState message={writeError.message} />}

            <AdminQueryState
                query={query}
                emptyText="No apps yet. Create the first one."
                errorText="Could not load apps."
            >
                {(items) => (
                    <AdminList>
                        {items.map((a) => (
                            <AdminListRow
                                key={a.id}
                                dimmed={!a.is_visible}
                                title={
                                    <Link
                                        to="/admin/apps/$id"
                                        params={{ id: a.id }}
                                        className="font-heading font-semibold hover:text-primary"
                                    >
                                        {a.name}
                                    </Link>
                                }
                                subtitle={joinParts([a.slug, a.microsoft_store_id, a.project?.title], " · ")}
                            >
                                <Tag label={APP_STATUS_LABEL[a.status]} size="sm" />
                                <FilterChip
                                    active={a.is_visible}
                                    onClick={() => toggle.mutate({ id: a.id, patch: { is_visible: !a.is_visible } })}
                                >
                                    {a.is_visible ? "Visible" : "Hidden"}
                                </FilterChip>
                                <Link to="/admin/apps/$id" params={{ id: a.id }} className={ADMIN_ACTION_CLASS}>
                                    Edit
                                </Link>
                                <ConfirmButton onConfirm={() => remove.mutate(a.id)} disabled={remove.isPending} />
                            </AdminListRow>
                        ))}
                    </AdminList>
                )}
            </AdminQueryState>
        </section>
    );
}
