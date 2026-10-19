import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Class untuk link "Edit" di baris daftar (Link router bertipe, jadi dipasang di tiap halaman). */
export const ADMIN_ACTION_CLASS = "border-2 border-border px-3 py-1 font-mono text-xs font-semibold hover:bg-muted";

interface AdminQueryStateProps<T> {
    query: UseQueryResult<T[]>;
    emptyText: string;
    errorText: string;
    children: (items: T[]) => ReactNode;
}

/** Loading / error / kosong / daftar untuk halaman list admin. */
export function AdminQueryState<T>({ query, emptyText, errorText, children }: AdminQueryStateProps<T>) {
    if (query.isPending) {
        return (
            <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }, (_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: placeholder statis
                    <Skeleton key={i} className="h-16 border-2 border-border" />
                ))}
            </div>
        );
    }
    if (query.isError) return <ErrorState message={errorText} onRetry={() => query.refetch()} />;
    if (query.data.length === 0) return <EmptyState>{emptyText}</EmptyState>;
    return <>{children(query.data)}</>;
}

export function AdminList({ children }: { children: ReactNode }) {
    return <ul className="divide-y-2 divide-border border-2 border-border bg-card">{children}</ul>;
}

interface AdminListRowProps {
    /** Item tersembunyi ditampilkan redup. */
    dimmed?: boolean;
    title: ReactNode;
    subtitle?: ReactNode;
    /** Badge dan tombol aksi di kanan. */
    children?: ReactNode;
}

export function AdminListRow({ dimmed, title, subtitle, children }: AdminListRowProps) {
    return (
        <li className={cn("flex flex-wrap items-center gap-3 p-4", dimmed && "opacity-60")}>
            <div className="min-w-0 flex-1">
                {title}
                {subtitle && <p className="truncate font-mono text-xs text-muted-foreground">{subtitle}</p>}
            </div>
            {children}
        </li>
    );
}
