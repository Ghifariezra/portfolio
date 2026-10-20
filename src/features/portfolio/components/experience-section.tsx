import { useExperiences } from "@/features/portfolio/hooks/use-portfolio";
import { EMPLOYMENT_LABEL } from "@/features/portfolio/lib/portfolio-helpers";
import { formatRange } from "@/lib/utils";
import { AboutSection } from "./about-section";
import { TimelineEntry, TimelineList } from "./timeline-entry";

export function ExperienceSection() {
    const { data, isPending, isError, refetch } = useExperiences();
    return (
        <AboutSection
            title="Experience"
            id="experience"
            isPending={isPending}
            isError={isError}
            onRetry={() => refetch()}
            isEmpty={!data?.length}
        >
            <TimelineList>
                {data?.map((exp) => (
                    <TimelineEntry
                        key={exp.id}
                        title={exp.position}
                        subtitle={exp.company}
                        badges={[EMPLOYMENT_LABEL[exp.employment_type]]}
                        range={formatRange(exp.start_date, exp.end_date)}
                        meta={[exp.location]}
                        summary={exp.summary}
                        bullets={exp.bullets}
                        skills={exp.skills}
                    />
                ))}
            </TimelineList>
        </AboutSection>
    );
}
