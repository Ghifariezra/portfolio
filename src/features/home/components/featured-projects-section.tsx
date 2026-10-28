import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { selectFeaturedProjects } from "@/features/home/lib/home-helpers";
import { ProjectCard } from "@/features/projects/components/project-card";
import { ProjectCardSkeleton } from "@/features/projects/components/project-card-skeleton";
import { useGithubRepos } from "@/features/projects/hooks/use-github-repos";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { HOME_LINK_CLASS, HomeSection } from "./home-section";

const PLACEHOLDER_KEYS = ["first", "second", "third"] as const;

export function FeaturedProjectsSection() {
    const { data, isPending, isError, refetch } = useProjects();
    const projects = useMemo(() => selectFeaturedProjects(data ?? []), [data]);
    // Query GitHub yang sama dengan halaman Projects, jadi cache-nya dibagi.
    const github = useGithubRepos(projects);

    return (
        <HomeSection
            title="Featured projects"
            action={
                <Link to="/projects" className={HOME_LINK_CLASS}>
                    All projects →
                </Link>
            }
            isPending={isPending}
            isError={isError && !data}
            onRetry={() => refetch()}
            isEmpty={projects.length === 0}
            skeleton={
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {PLACEHOLDER_KEYS.map((key) => (
                        <ProjectCardSkeleton key={key} />
                    ))}
                </div>
            }
        >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        github={project.github_repo ? github.get(project.github_repo) : undefined}
                    />
                ))}
            </div>
        </HomeSection>
    );
}
