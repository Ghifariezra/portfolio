import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { brutalButtonClass } from "@/components/ui/button-styles";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { ErrorState } from "@/components/ui/error-state";
import { FilterChip } from "@/components/ui/filter-chip";
import { joinParts } from "@/features/portfolio/lib/portfolio-helpers";
import { formatMonth } from "@/lib/utils";
import { ADMIN_ACTION_CLASS, AdminList, AdminListRow, AdminQueryState } from "../../components/admin-list";
import { AdminPageHeader } from "../../components/admin-page-header";
import { useDeleteResource, useToggleResource } from "../../lib/admin-resource";
import { adminCertificationsQuery, certificationResource } from "../api/certification-admin-api";

export function AdminCertificationsPage() {
    const query = useQuery(adminCertificationsQuery());
    const toggle = useToggleResource(certificationResource);
    const remove = useDeleteResource(certificationResource);
    const writeError = toggle.error ?? remove.error;

    return (
        <section>
            <AdminPageHeader
                title="Certifications"
                description="Sertifikasi dan kelulusan bootcamp. Tanggal disimpan per bulan."
                actions={
                    <Link to="/admin/certifications/new" className={brutalButtonClass("primary")}>
                        New certification
                    </Link>
                }
            />

            {writeError && <ErrorState message={writeError.message} />}

            <AdminQueryState
                query={query}
                emptyText="No certifications yet. Create the first one."
                errorText="Could not load certifications."
            >
                {(items) => (
                    <AdminList>
                        {items.map((c) => (
                            <AdminListRow
                                key={c.id}
                                dimmed={!c.is_visible}
                                title={
                                    <Link
                                        to="/admin/certifications/$id"
                                        params={{ id: c.id }}
                                        className="font-heading font-semibold hover:text-primary"
                                    >
                                        {c.name}
                                    </Link>
                                }
                                subtitle={joinParts(
                                    [
                                        c.issuer,
                                        c.issued_date ? `Issued ${formatMonth(c.issued_date)}` : null,
                                        c.expires_date ? `Expires ${formatMonth(c.expires_date)}` : null,
                                    ],
                                    " · ",
                                )}
                            >
                                <FilterChip
                                    active={c.is_visible}
                                    onClick={() => toggle.mutate({ id: c.id, patch: { is_visible: !c.is_visible } })}
                                >
                                    {c.is_visible ? "Visible" : "Hidden"}
                                </FilterChip>
                                <Link
                                    to="/admin/certifications/$id"
                                    params={{ id: c.id }}
                                    className={ADMIN_ACTION_CLASS}
                                >
                                    Edit
                                </Link>
                                <ConfirmButton onConfirm={() => remove.mutate(c.id)} disabled={remove.isPending} />
                            </AdminListRow>
                        ))}
                    </AdminList>
                )}
            </AdminQueryState>
        </section>
    );
}
