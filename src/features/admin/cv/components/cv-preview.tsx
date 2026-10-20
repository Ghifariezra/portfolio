import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cvResource } from "@/features/admin/cv/api/cv-variant-admin-api";

/** Data siap render (apa adanya yang akan dipakai generator CV/ATS). Baru dimuat setelah dibuka. */
export function CvPreview({ id }: { id: string }) {
    const [open, setOpen] = useState(false);
    const query = useQuery({ ...cvResource.resolvedQuery(id), enabled: open });

    return (
        <div className="mt-10 max-w-2xl border-t-2 border-border pt-6">
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className="cursor-pointer border-2 border-border px-3 py-1 font-mono text-xs font-semibold hover:bg-muted"
            >
                {open ? "Hide resolved data" : "Show resolved data"}
            </button>

            {open && query.isPending && <Skeleton className="mt-4 h-48 border-2 border-border" />}
            {open && query.isError && (
                <div className="mt-4">
                    <ErrorState message="Could not load the resolved CV data." onRetry={() => query.refetch()} />
                </div>
            )}
            {open && query.isSuccess && (
                <pre className="mt-4 max-h-[32rem] overflow-auto border-2 border-border bg-card p-4 font-mono text-xs">
                    {JSON.stringify(query.data, null, 2)}
                </pre>
            )}
            {open && (
                <p className="mt-2 text-xs text-muted-foreground">
                    Menampilkan data tersimpan. Simpan dulu perubahan di form di atas agar ikut terlihat di sini.
                </p>
            )}
        </div>
    );
}
