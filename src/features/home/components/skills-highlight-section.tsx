import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { TagList } from "@/components/ui/tag-list";
import { useSkills } from "@/features/portfolio/hooks/use-portfolio";
import { groupSkillsByCategory, type SkillGroup } from "@/features/portfolio/lib/portfolio-helpers";
import { getSkillCategoryMeta } from "@/features/portfolio/lib/skill-categories";
import { pickSkillGroups } from "../lib/home-helpers";
import { HOME_LINK_CLASS, HomeSection } from "./home-section";

const MAX_TAGS_PER_GROUP = 8;

function SkillHighlightCard({ group }: { group: SkillGroup }) {
    const { label, icon: CategoryIcon } = getSkillCategoryMeta(group.category);

    return (
        <article className="border-2 border-border bg-card">
            <header className="flex items-center gap-3 border-b-2 border-border p-3">
                <span
                    aria-hidden="true"
                    className="grid size-8 shrink-0 place-items-center border-2 border-border bg-primary text-primary-foreground"
                >
                    <CategoryIcon size={18} weight="bold" />
                </span>
                <h3 className="font-heading text-base font-semibold leading-none">{label}</h3>
            </header>
            <div className="p-4">
                <TagList tags={group.skills.map((s) => ({ key: s.id, label: s.name }))} max={MAX_TAGS_PER_GROUP} />
            </div>
        </article>
    );
}

export function SkillsHighlightSection() {
    const { data, isPending, isError, refetch } = useSkills();
    const groups = useMemo(() => pickSkillGroups(groupSkillsByCategory(data ?? [])), [data]);

    return (
        <HomeSection
            title="What I work with"
            action={
                <Link to="/about" className={HOME_LINK_CLASS}>
                    All skills →
                </Link>
            }
            isPending={isPending}
            isError={isError}
            onRetry={() => refetch()}
            isEmpty={groups.length === 0}
        >
            <div className="grid gap-5 md:grid-cols-3">
                {groups.map((group) => (
                    <SkillHighlightCard key={group.category} group={group} />
                ))}
            </div>
        </HomeSection>
    );
}