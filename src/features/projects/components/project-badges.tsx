import { Star } from "@phosphor-icons/react";
import { STATUS_LABEL } from "../lib/project-helpers";
import type { ProjectStatus } from "../schemas/project.schema";

export function StatusBadge({ status }: { status: ProjectStatus }) {
    return (
        <span className="border-2 border-border px-2 py-0.5 font-mono text-[11px] font-semibold">
            {STATUS_LABEL[status]}
        </span>
    );
}

export function FeaturedBadge() {
    return (
        <span className="inline-flex items-center gap-1 border-2 border-border bg-accent px-2 py-0.5 font-mono text-[11px] font-semibold text-accent-foreground">
            <Star size={11} weight="fill" /> Featured
        </span>
    );
}
