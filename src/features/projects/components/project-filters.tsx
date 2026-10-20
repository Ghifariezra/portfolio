import { FilterChip } from "@/components/ui/filter-chip";
import { STATUS_LABEL } from "@/features/projects/lib/project-helpers";
import type { ProjectStatus } from "@/features/projects/schemas/project.schema";

interface ProjectFiltersProps {
    /** Jumlah seluruh project (untuk chip "All"). */
    total: number;
    status: ProjectStatus | null;
    onStatusChange: (status: ProjectStatus | null) => void;
    statusCounts: readonly (readonly [ProjectStatus, number])[];
    language: string | null;
    onLanguageChange: (language: string | null) => void;
    languageCounts: readonly (readonly [string, number])[];
}

export function ProjectFilters({
    total,
    status,
    onStatusChange,
    statusCounts,
    language,
    onLanguageChange,
    languageCounts,
}: ProjectFiltersProps) {
    return (
        <div className="mb-6 flex flex-col gap-3 border-b-2 border-border pb-5">
            {statusCounts.length > 1 && (
                <div className="flex flex-wrap items-center gap-2">
                    <FilterChip active={status === null} onClick={() => onStatusChange(null)}>
                        All ({total})
                    </FilterChip>
                    {statusCounts.map(([s, count]) => (
                        <FilterChip key={s} active={status === s} onClick={() => onStatusChange(s)}>
                            {STATUS_LABEL[s]} ({count})
                        </FilterChip>
                    ))}
                </div>
            )}
            {languageCounts.length > 1 && (
                <div className="flex flex-wrap items-center gap-2">
                    <FilterChip active={language === null} onClick={() => onLanguageChange(null)}>
                        Any language
                    </FilterChip>
                    {languageCounts.map(([name, count]) => (
                        <FilterChip key={name} active={language === name} onClick={() => onLanguageChange(name)}>
                            {name} ({count})
                        </FilterChip>
                    ))}
                </div>
            )}
        </div>
    );
}
