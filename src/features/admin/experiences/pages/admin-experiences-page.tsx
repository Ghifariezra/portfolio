import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { brutalButtonClass } from "@/components/ui/button-styles";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { ErrorState } from "@/components/ui/error-state";
import { FilterChip } from "@/components/ui/filter-chip";
import { ADMIN_ACTION_CLASS, AdminList, AdminListRow, AdminQueryState } from "@/features/admin/components/admin-list";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminExperiencesQuery, experienceResource } from "@/features/admin/experiences/api/experience-admin-api";
import { useDeleteResource, useToggleResource } from "@/features/admin/lib/admin-resource";
import { EMPLOYMENT_LABEL, joinParts } from "@/features/portfolio/lib/portfolio-helpers";
import { formatRange } from "@/lib/utils";

export function AdminExperiencesPage() {
    const query = useQuery(adminExperiencesQuery());
    const toggle = useToggleResource(experienceResource);
    const remove = useDeleteResource(experienceResource);
    const writeError = toggle.error ?? remove.error;

    return (
        <section>
            <AdminPageHeader
                title="Experience"
                description="Pengalaman kerja. Item yang tersembunyi tetap muncul di sini dan tetap bisa dipakai di varian CV."
                actions={
                    <Link to="/admin/experiences/new" className={brutalButtonClass("primary")}>
                        New experience
                    </Link>
                }
            />

            {writeError && <ErrorState message={writeError.message} />}

            <AdminQueryState
                query={query}
                emptyText="No experience yet. Create the first one."
                errorText="Could not load experiences."
            >
                {(items) => (
                    <AdminList>
                        {items.map((e) => (
                            <AdminListRow
                                key={e.id}
                                dimmed={!e.is_visible}
                                title={
                                    <Link
                                        to="/admin/experiences/$id"
                                        params={{ id: e.id }}
                                        className="font-heading font-semibold hover:text-primary"
                                    >
                                        {e.position}
                                    </Link>
                                }
                                subtitle={joinParts(
                                    [
                                        e.company,
                                        EMPLOYMENT_LABEL[e.employment_type],
                                        formatRange(e.start_date, e.end_date),
                                    ],
                                    " · ",
                                )}
                            >
                                <FilterChip
                                    active={e.is_visible}
                                    onClick={() => toggle.mutate({ id: e.id, patch: { is_visible: !e.is_visible } })}
                                >
                                    {e.is_visible ? "Visible" : "Hidden"}
                                </FilterChip>
                                <Link to="/admin/experiences/$id" params={{ id: e.id }} className={ADMIN_ACTION_CLASS}>
                                    Edit
                                </Link>
                                <ConfirmButton onConfirm={() => remove.mutate(e.id)} disabled={remove.isPending} />
                            </AdminListRow>
                        ))}
                    </AdminList>
                )}
            </AdminQueryState>
        </section>
    );
}
