import { useMemo } from "react";
import { useSkills } from "../hooks/use-portfolio";
import { groupSkillsByCategory } from "../lib/portfolio-helpers";
import { AboutSection } from "./about-section";
import { SkillGroupCard } from "./skill-group-card";

export function SkillsSection() {
    const { data, isPending, isError, refetch } = useSkills();
    const groups = useMemo(() => groupSkillsByCategory(data ?? []), [data]);

    return (
        <AboutSection
            title="Skills"
            id="skills"
            isPending={isPending}
            isError={isError}
            onRetry={() => refetch()}
            isEmpty={groups.length === 0}
        >
            {/* Kolom CSS (masonry): kartu pendek dan panjang saling mengisi, tanpa celah kosong antar baris. */}
            <div className="columns-1 gap-5 sm:columns-2">
                {groups.map((group) => (
                    <div key={group.category} className="mb-5 break-inside-avoid">
                        <SkillGroupCard group={group} />
                    </div>
                ))}
            </div>
        </AboutSection>
    );
}
