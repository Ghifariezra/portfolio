import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FilterChipProps {
    active: boolean;
    onClick: () => void;
    children: ReactNode;
}

export function FilterChip({ active, onClick, children }: FilterChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                "cursor-pointer border-2 px-3 py-1 font-mono text-xs font-semibold",
                active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground",
            )}
        >
            {children}
        </button>
    );
}
