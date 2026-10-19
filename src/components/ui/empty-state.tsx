import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Kotak putus-putus untuk "tidak ada data" atau catatan ringan. */
export function EmptyState({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <p className={cn("border-2 border-dashed border-border p-10 text-center text-muted-foreground", className)}>
            {children}
        </p>
    );
}
