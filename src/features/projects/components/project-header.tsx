import { GithubLogo, Globe } from "@phosphor-icons/react";
import { brutalButtonClass } from "@/components/ui/button-styles";
import { formatRange } from "@/lib/utils";
import type { ProjectItem } from "../schemas/project.schema";
import { FeaturedBadge, StatusBadge } from "./project-badges";

export function ProjectHeader({ project }: { project: ProjectItem }) {
    const range = formatRange(project.start_date, project.end_date);
    const buttonClass = "inline-flex items-center gap-2";

    return (
        <header className="mb-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={project.status} />
                {project.featured && <FeaturedBadge />}
                {range && <span className="font-mono text-xs text-muted-foreground">{range}</span>}
            </div>

            <h1 className="font-heading text-4xl font-bold md:text-5xl">{project.title}</h1>
            {project.description && (
                <p className="mt-3 max-w-2xl whitespace-pre-line leading-relaxed text-muted-foreground">
                    {project.description}
                </p>
            )}

            {(project.repo_url || project.live_url) && (
                <div className="mt-5 flex flex-wrap gap-3">
                    {project.repo_url && (
                        <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noreferrer"
                            className={brutalButtonClass("primary", buttonClass)}
                        >
                            <GithubLogo size={16} weight="bold" /> Source
                        </a>
                    )}
                    {project.live_url && (
                        <a
                            href={project.live_url}
                            target="_blank"
                            rel="noreferrer"
                            className={brutalButtonClass("card", buttonClass)}
                        >
                            <Globe size={16} weight="bold" /> Live site
                        </a>
                    )}
                </div>
            )}
        </header>
    );
}
