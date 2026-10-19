import { formatRange } from "@/lib/utils";
import { useEducation } from "../hooks/use-portfolio";
import { EDUCATION_KIND_LABEL } from "../lib/portfolio-helpers";
import { AboutSection } from "./about-section";
import { TimelineEntry, TimelineList } from "./timeline-entry";

export function EducationSection() {
    const { data, isPending, isError, refetch } = useEducation();

    return (
        <AboutSection
            title="Education"
            isPending={isPending}
            isError={isError}
            onRetry={() => refetch()}
            isEmpty={!data?.length}
        >
            <TimelineList>
                {data?.map((edu) => (
                    <TimelineEntry
                        key={edu.id}
                        title={edu.program}
                        subtitle={edu.institution}
                        badges={[EDUCATION_KIND_LABEL[edu.kind]]}
                        range={formatRange(edu.start_date, edu.end_date)}
                        meta={[edu.location, edu.grade ? `Grade ${edu.grade}` : null]}
                        summary={edu.summary}
                        bullets={edu.bullets}
                        skills={edu.skills}
                    />
                ))}
            </TimelineList>
        </AboutSection>
    );
}
