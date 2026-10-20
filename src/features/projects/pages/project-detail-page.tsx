import { ArrowLeft } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { ErrorState } from "@/components/ui/error-state";
import { PageContainer } from "@/components/ui/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectDetail } from "@/features/projects/components/project-detail";
import { useProject } from "@/features/projects/hooks/use-projects";
import { isNotFound } from "@/lib/api";

/** Menerima slug lewat props (bukan membaca route sendiri), jadi halaman ini tidak terikat ke file route. */
export function ProjectDetailPage({ slug }: { slug: string }) {
    const { data, isPending, error } = useProject(slug);

    return (
        <PageContainer>
            <Link
                to="/projects"
                className="mb-8 inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-muted-foreground hover:text-primary"
            >
                <ArrowLeft size={14} /> All projects
            </Link>

            {isPending && <Skeleton className="h-64 border-2 border-border" />}

            {error && (
                <ErrorState
                    message={
                        isNotFound(error)
                            ? "This project doesn't exist or isn't public."
                            : "Could not load this project right now."
                    }
                />
            )}

            {data && <ProjectDetail project={data} />}
        </PageContainer>
    );
}
