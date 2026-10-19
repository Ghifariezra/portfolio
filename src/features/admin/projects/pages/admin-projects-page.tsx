import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { brutalButtonClass } from "@/components/ui/button-styles";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { FilterChip } from "@/components/ui/filter-chip";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/features/projects/components/project-badges";
import { cn } from "@/lib/utils";
import { AdminPageHeader } from "../../components/admin-page-header";
import { adminProjectsQuery } from "../api/project-admin-api";
import { useDeleteProject, useToggleProject } from "../api/use-project-mutations";

export function AdminProjectsPage() {
    const { data, isPending, isError, refetch } = useQuery(adminProjectsQuery());
    const toggle = useToggleProject();
    const remove = useDeleteProject();
    const writeError = toggle.error ?? remove.error;

    return (
        <section>
            <AdminPageHeader
                title="Projects"
                description="Project yang tersembunyi tetap muncul di sini. Data live dari GitHub tidak disimpan, hanya kurasinya."
                actions={
                    <Link to="/admin/projects/new" className={brutalButtonClass("primary")}>
                        New project
                    </Link>
                }
            />

            {isPending && (
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 4 }, (_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: placeholder statis
                        <Skeleton key={i} className="h-16 border-2 border-border" />
                    ))}
                </div>
            )}

            {isError && <ErrorState message="Could not load projects." onRetry={() => refetch()} />}
            {writeError && <ErrorState message={writeError.message} />}

            {data &&
                (data.length === 0 ? (
                    <EmptyState>No projects yet. Create the first one.</EmptyState>
                ) : (
                    <ul className="divide-y-2 divide-border border-2 border-border bg-card">
                        {data.map((p) => (
                            <li
                                key={p.id}
                                className={cn("flex flex-wrap items-center gap-3 p-4", !p.is_visible && "opacity-60")}
                            >
                                <div className="min-w-0 flex-1">
                                    <Link
                                        to="/admin/projects/$id"
                                        params={{ id: p.id }}
                                        className="font-heading font-semibold hover:text-primary"
                                    >
                                        {p.title}
                                    </Link>
                                    <p className="truncate font-mono text-xs text-muted-foreground">
                                        {p.github_repo ?? "manual"} / {p.slug}
                                    </p>
                                </div>

                                <StatusBadge status={p.status} />
                                <FilterChip
                                    active={p.is_visible}
                                    onClick={() => toggle.mutate({ id: p.id, patch: { is_visible: !p.is_visible } })}
                                >
                                    {p.is_visible ? "Visible" : "Hidden"}
                                </FilterChip>
                                <FilterChip
                                    active={p.featured}
                                    onClick={() => toggle.mutate({ id: p.id, patch: { featured: !p.featured } })}
                                >
                                    Featured
                                </FilterChip>
                                <Link
                                    to="/admin/projects/$id"
                                    params={{ id: p.id }}
                                    className="border-2 border-border px-3 py-1 font-mono text-xs font-semibold hover:bg-muted"
                                >
                                    Edit
                                </Link>
                                <ConfirmButton onConfirm={() => remove.mutate(p.id)} disabled={remove.isPending} />
                            </li>
                        ))}
                    </ul>
                ))}
        </section>
    );
}
