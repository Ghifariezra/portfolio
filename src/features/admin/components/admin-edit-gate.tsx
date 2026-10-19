import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { isNotFound } from "@/lib/api";
import { AdminPageHeader } from "./admin-page-header";

interface AdminEditGateProps<T> {
    query: UseQueryResult<T>;
    /** Nama entitas untuk pesan error, mis. "experience". */
    entity: string;
    title: (data: T) => string;
    children: (data: T) => ReactNode;
}

/** Halaman edit: header, skeleton saat memuat, error (404 / gagal muat), lalu form begitu data siap. */
export function AdminEditGate<T>({ query, entity, title, children }: AdminEditGateProps<T>) {
    const notFound = query.isError && isNotFound(query.error);

    return (
        <section>
            <AdminPageHeader title={query.isSuccess ? title(query.data) : `Edit ${entity}`} />

            {query.isPending && <Skeleton className="h-96 max-w-2xl border-2 border-border" />}
            {query.isError && (
                <ErrorState
                    message={notFound ? `This ${entity} was not found.` : `Could not load this ${entity}.`}
                    onRetry={notFound ? undefined : () => query.refetch()}
                />
            )}
            {query.isSuccess && children(query.data)}
        </section>
    );
}
