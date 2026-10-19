import { useQuery } from "@tanstack/react-query";
import { ErrorState } from "@/components/ui/error-state";
import { FilterChip } from "@/components/ui/filter-chip";
import { groupSkillsByCategory } from "@/features/portfolio/lib/portfolio-helpers";
import { getSkillCategoryMeta } from "@/features/portfolio/lib/skill-categories";
import { adminSkillsQuery } from "../skills/api/skill-admin-queries";

interface SkillPickerProps {
    value: string[];
    onChange: (ids: string[]) => void;
    error?: string;
    legend?: string;
}

/** Pilih skill (multi) per kategori. Dipakai form experience, education, dan app. */
export function SkillPicker({ value, onChange, error, legend = "Tech stack" }: SkillPickerProps) {
    const skills = useQuery(adminSkillsQuery());
    const groups = groupSkillsByCategory(skills.data ?? []);

    const toggle = (id: string) => onChange(value.includes(id) ? value.filter((s) => s !== id) : [...value, id]);

    return (
        <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 font-mono text-xs font-semibold">{legend}</legend>
            {skills.isPending && <p className="text-sm text-muted-foreground">Loading skills...</p>}
            {skills.isError && <ErrorState message="Could not load skills." onRetry={() => skills.refetch()} />}
            {skills.data?.length === 0 && (
                <p className="text-sm text-muted-foreground">Belum ada skill. Tambahkan dulu di halaman Skills.</p>
            )}
            {groups.map((group) => (
                <div key={group.category} className="flex flex-wrap items-center gap-2">
                    <span className="w-20 font-mono text-[11px] text-muted-foreground">
                        {getSkillCategoryMeta(group.category).label}
                    </span>
                    {group.skills.map((skill) => (
                        <FilterChip key={skill.id} active={value.includes(skill.id)} onClick={() => toggle(skill.id)}>
                            {skill.name}
                        </FilterChip>
                    ))}
                </div>
            ))}
            {error && (
                <p role="alert" className="text-xs text-destructive">
                    {error}
                </p>
            )}
        </fieldset>
    );
}
