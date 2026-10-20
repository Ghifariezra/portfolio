import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Tag, TagList } from "@/components/ui/tag-list";
import { selectCurrentExperience } from "@/features/home/lib/home-helpers";
import { useExperiences } from "@/features/portfolio/hooks/use-portfolio";
import { EMPLOYMENT_LABEL } from "@/features/portfolio/lib/portfolio-helpers";
import { formatRange } from "@/lib/utils";
import { HOME_LINK_CLASS, HomeSection } from "./home-section";

const MAX_SKILL_TAGS = 6;

export function CurrentRoleSection() {
    const { data, isPending, isError, refetch } = useExperiences();
    const current = useMemo(() => selectCurrentExperience(data ?? []), [data]);

    return (
        <HomeSection
            title="Currently"
            action={
                <Link
                    to="/about"
                    hash="experience"
                    hashScrollIntoView={{ behavior: "smooth" }}
                    className={HOME_LINK_CLASS}
                >
                    Full background →
                </Link>
            }
            isPending={isPending}
            isError={isError}
            onRetry={() => refetch()}
            isEmpty={!current}
        >
            {current && (
                <article className="flex flex-col gap-3 border-2 border-border bg-card p-5">
                    <div>
                        <h3 className="font-heading text-lg font-semibold leading-snug">{current.position}</h3>
                        <p className="text-sm font-semibold">{current.company}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                        <Tag label={EMPLOYMENT_LABEL[current.employment_type]} size="sm" />
                        <span className="font-mono text-[11px] text-muted-foreground">
                            {formatRange(current.start_date, current.end_date)}
                        </span>
                    </div>

                    {current.summary && (
                        <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">{current.summary}</p>
                    )}

                    {current.skills.length > 0 && (
                        <TagList
                            tags={current.skills.map((s) => ({ key: s.id, label: s.name }))}
                            size="sm"
                            max={MAX_SKILL_TAGS}
                        />
                    )}
                </article>
            )}
        </HomeSection>
    );
}
