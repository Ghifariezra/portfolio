import { useMemo } from "react";
import { useEducation } from "@/features/portfolio/hooks/use-portfolio";
import { splitEducationByKind } from "@/features/portfolio/lib/portfolio-helpers";
import type { Education } from "@/features/portfolio/schemas/education.schema";
import { formatRange } from "@/lib/utils";
import { AboutSection } from "./about-section";
import { TimelineEntry, TimelineList } from "./timeline-entry";

function EducationTimeline({ items }: { items: readonly Education[] }) {
    return (
        <TimelineList>
            {items.map((edu) => (
                <TimelineEntry
                    key={edu.id}
                    title={edu.program}
                    subtitle={edu.institution}
                    range={formatRange(edu.start_date, edu.end_date)}
                    meta={[edu.location, edu.grade ? `Grade ${edu.grade}` : null]}
                    summary={edu.summary}
                    bullets={edu.bullets}
                    skills={edu.skills}
                />
            ))}
        </TimelineList>
    );
}

/**
 * Satu query, dua section: pendidikan formal dan training/bootcamp.
 * Section Training sengaja tidak menampilkan skeleton atau error sendiri; keduanya cukup muncul sekali
 * di section Education, dan Training baru muncul setelah datanya ada (tersembunyi kalau tidak ada training).
 */
export function EducationSection() {
    const { data, isPending, isError, refetch } = useEducation();
    const { formal, training } = useMemo(() => splitEducationByKind(data ?? []), [data]);

    return (
        <>
            <AboutSection
                title="Education"
                isPending={isPending}
                isError={isError}
                onRetry={() => refetch()}
                isEmpty={formal.length === 0}
            >
                <EducationTimeline items={formal} />
            </AboutSection>

            <AboutSection
                title="Training"
                isPending={false}
                isError={false}
                onRetry={() => refetch()}
                isEmpty={training.length === 0}
            >
                <EducationTimeline items={training} />
            </AboutSection>
        </>
    );
}
