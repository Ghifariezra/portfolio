import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { brutalButtonClass } from "@/components/ui/button-styles";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { ErrorState } from "@/components/ui/error-state";
import { FilterChip } from "@/components/ui/filter-chip";
import { Tag } from "@/components/ui/tag-list";
import { ADMIN_ACTION_CLASS, AdminList, AdminListRow, AdminQueryState } from "@/features/admin/components/admin-list";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminEducationListQuery, educationResource } from "@/features/admin/education/api/education-admin-api";
import { useDeleteResource, useToggleResource } from "@/features/admin/lib/admin-resource";
import { EDUCATION_KIND_LABEL, joinParts } from "@/features/portfolio/lib/portfolio-helpers";
import { formatRange } from "@/lib/utils";

export function AdminEducationPage() {
    const query = useQuery(adminEducationListQuery());
    const toggle = useToggleResource(educationResource);
    const remove = useDeleteResource(educationResource);
    const writeError = toggle.error ?? remove.error;

    return (
        <section>
            <AdminPageHeader
                title="Education"
                description="Pendidikan formal dan training/bootcamp. Sertifikat bisa ditautkan ke salah satu entri di sini."
                actions={
                    <Link to="/admin/education/new" className={brutalButtonClass("primary")}>
                        New education
                    </Link>
                }
            />

            {writeError && <ErrorState message={writeError.message} />}

            <AdminQueryState
                query={query}
                emptyText="No education yet. Create the first one."
                errorText="Could not load education."
            >
                {(items) => (
                    <AdminList>
                        {items.map((e) => (
                            <AdminListRow
                                key={e.id}
                                dimmed={!e.is_visible}
                                title={
                                    <Link
                                        to="/admin/education/$id"
                                        params={{ id: e.id }}
                                        className="font-heading font-semibold hover:text-primary"
                                    >
                                        {e.program}
                                    </Link>
                                }
                                subtitle={joinParts([e.institution, formatRange(e.start_date, e.end_date)], " · ")}
                            >
                                <Tag label={EDUCATION_KIND_LABEL[e.kind]} size="sm" />
                                <FilterChip
                                    active={e.is_visible}
                                    onClick={() => toggle.mutate({ id: e.id, patch: { is_visible: !e.is_visible } })}
                                >
                                    {e.is_visible ? "Visible" : "Hidden"}
                                </FilterChip>
                                <Link to="/admin/education/$id" params={{ id: e.id }} className={ADMIN_ACTION_CLASS}>
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
