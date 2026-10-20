import { GitFork, GithubLogo, Globe, Star } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { IconLink } from "@/components/ui/icon-link";
import { Skeleton } from "@/components/ui/skeleton";
import { TagList } from "@/components/ui/tag-list";
import type { RepoState } from "@/features/projects/hooks/use-github-repos";
import { resolveProjectDisplay } from "@/features/projects/lib/project-helpers";
import type { GithubRepo } from "@/features/projects/schemas/github.schema";
import type { ProjectItem } from "@/features/projects/schemas/project.schema";
import { formatMonth, formatNumber, formatRange } from "@/lib/utils";
import { FeaturedBadge, StatusBadge } from "./project-badges";

/** Footer live dari GitHub. Project tanpa repo atau yang gagal dimuat tidak punya footer. */
function GithubFooter({ gh, language }: { gh: GithubRepo; language: string | null }) {
    return (
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t-2 border-border pt-3 font-mono text-xs text-muted-foreground">
            {language && <span className="text-foreground">{language}</span>}
            <span className="inline-flex items-center gap-1">
                <Star size={14} /> {formatNumber(gh.stars)}
            </span>
            <span className="inline-flex items-center gap-1">
                <GitFork size={14} /> {formatNumber(gh.forks)}
            </span>
            <span className="ml-auto">{formatMonth(gh.pushedAt)}</span>
        </div>
    );
}

interface ProjectCardProps {
    project: ProjectItem;
    github?: RepoState;
}

export function ProjectCard({ project, github }: ProjectCardProps) {
    const gh = github?.data;
    const range = formatRange(project.start_date, project.end_date);
    const { description, repoUrl, liveUrl, tags, language } = resolveProjectDisplay(project, gh);

    return (
        <article className="relative flex flex-col border-2 border-border bg-card transition-transform hover:-translate-y-0.5 hover:shadow-brutal dark:hover:shadow-none">
            {project.image_url && (
                <img
                    src={project.image_url}
                    alt=""
                    loading="lazy"
                    className="h-36 w-full border-b-2 border-border object-cover"
                />
            )}

            <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                    <h2 className="font-heading text-lg font-semibold leading-snug">
                        <Link
                            to="/projects/$slug"
                            params={{ slug: project.slug }}
                            className="outline-none after:absolute after:inset-0 hover:text-primary focus-visible:text-primary"
                        >
                            {project.title}
                        </Link>
                    </h2>
                    <div className="relative z-10 flex shrink-0 gap-2">
                        {liveUrl && (
                            <IconLink href={liveUrl} label={`${project.title} live site`}>
                                <Globe size={16} weight="bold" />
                            </IconLink>
                        )}
                        {repoUrl && (
                            <IconLink href={repoUrl} label={`${project.title} on GitHub`}>
                                <GithubLogo size={16} weight="bold" />
                            </IconLink>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                    <StatusBadge status={project.status} />
                    {project.featured && <FeaturedBadge />}
                    {range && <span className="font-mono text-[11px] text-muted-foreground">{range}</span>}
                </div>

                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {description ?? "No description."}
                </p>

                {tags.length > 0 && <TagList tags={tags} size="sm" max={5} />}

                {github?.isPending ? (
                    <div className="mt-auto border-t-2 border-border pt-3">
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                ) : (
                    gh && <GithubFooter gh={gh} language={language} />
                )}
            </div>
        </article>
    );
}
