import { TagList } from "@/components/ui/tag-list";
import { getSkillCategoryMeta } from "../lib/skill-categories";
import type { SkillGroup } from "../lib/portfolio-helpers";

export function SkillGroupCard({ group }: { group: SkillGroup }) {
    const { label, icon: CategoryIcon } = getSkillCategoryMeta(group.category);

    return (
        <article className="border-2 border-border bg-card transition-transform hover:-translate-y-0.5 hover:shadow-brutal dark:hover:shadow-none">
            <header className="flex items-center gap-3 border-b-2 border-border p-3">
                <span
                    aria-hidden="true"
                    className="grid size-8 shrink-0 place-items-center border-2 border-border bg-primary text-primary-foreground"
                >
                    <CategoryIcon size={18} weight="bold" />
                </span>
                <h3 className="font-heading text-base font-semibold leading-none">{label}</h3>
                <span className="ml-auto border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {group.skills.length}
                </span>
            </header>

            <div className="p-4">
                <TagList tags={group.skills.map((s) => ({ key: s.id, label: s.name }))} />
            </div>
        </article>
    );
}
