import { TagList } from "@/components/ui/tag-list";
import { joinParts } from "@/features/portfolio/lib/portfolio-helpers";
import type { SkillRef } from "@/lib/schemas/skill-ref.schema";

interface TimelineEntryProps {
    title: string;
    subtitle: string;
    badges?: readonly string[];
    range: string | null;
    /** Info tambahan di baris yang sama dengan range (lokasi, nilai, dst). */
    meta?: readonly (string | null | undefined)[];
    summary: string | null;
    bullets: readonly string[];
    skills: readonly SkillRef[];
}

/** Satu entri di timeline vertikal; dipakai Experience dan Education. Harus berada di dalam <TimelineList>. */
export function TimelineEntry({
    title,
    subtitle,
    badges = [],
    range,
    meta = [],
    summary,
    bullets,
    skills,
}: TimelineEntryProps) {
    const details = joinParts([range, ...meta], " · ");

    return (
        <li className="relative">
            <span
                aria-hidden="true"
                className="absolute top-2 -left-[30px] size-2.5 border-2 border-border bg-primary"
            />

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="font-heading text-lg font-semibold leading-snug">{title}</h3>
                {badges.map((badge) => (
                    <span
                        key={badge}
                        className="border-2 border-border px-2 py-0.5 font-mono text-[11px] font-semibold"
                    >
                        {badge}
                    </span>
                ))}
            </div>
            <p className="mt-0.5 text-sm font-semibold">{subtitle}</p>
            {details && <p className="mt-1 font-mono text-xs text-muted-foreground">{details}</p>}

            {summary && (
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{summary}</p>
            )}

            {bullets.length > 0 && (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                    {bullets.map((b) => (
                        <li key={b}>{b}</li>
                    ))}
                </ul>
            )}

            {skills.length > 0 && (
                <TagList className="mt-3" size="sm" tags={skills.map((s) => ({ key: s.id, label: s.name }))} />
            )}
        </li>
    );
}

export function TimelineList({ children }: { children: React.ReactNode }) {
    return <ol className="space-y-8 border-l-2 border-border pl-6">{children}</ol>;
}
