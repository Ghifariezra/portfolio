import { cn } from "@/lib/utils";

/** Placeholder loading. Tambahkan ukuran dan border lewat className. */
export function Skeleton({ className }: { className?: string }) {
    return <div aria-busy="true" className={cn("animate-pulse bg-muted", className)} />;
}
