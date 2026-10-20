import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { PageContainer, PageHeader } from "@/components/ui/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard } from "@/features/projects/components/project-card";
import { ProjectFilters } from "@/features/projects/components/project-filters";
import { useProjectFilters } from "@/features/projects/hooks/use-project-filters";
import { useProjects } from "@/features/projects/hooks/use-projects";

export function ProjectsPage() {
    const { data, isPending, isError, refetch } = useProjects();
    const filters = useProjectFilters(data);

    return (
        <PageContainer>
            <PageHeader
                className="mb-8"
                title="Projects"
                description="Things I have built. Stars, languages, and activity come live from GitHub; open a project for the full README."
            />

            {isPending && (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }, (_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: placeholder statis
                        <Skeleton key={i} className="h-48 border-2 border-border" />
                    ))}
                </div>
            )}

            {isError && <ErrorState message="Could not load projects right now." onRetry={() => refetch()} />}

            {data && (
                <>
                    {filters.showFilters && (
                        <ProjectFilters
                            total={data.length}
                            status={filters.status}
                            onStatusChange={filters.setStatus}
                            statusCounts={filters.statusCounts}
                            language={filters.language}
                            onLanguageChange={filters.setLanguage}
                            languageCounts={filters.languageCounts}
                        />
                    )}

                    {filters.filtered.length > 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {filters.filtered.map((project) => (
                                <ProjectCard key={project.id} project={project} github={filters.githubOf(project)} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState>{data.length === 0 ? "No projects yet." : "No projects match."}</EmptyState>
                    )}
                </>
            )}
        </PageContainer>
    );
}
