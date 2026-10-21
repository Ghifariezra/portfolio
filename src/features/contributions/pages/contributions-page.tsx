import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { PageContainer, PageHeader } from "@/components/ui/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { ContributionStats } from "@/features/contributions/components/contribution-stats";
import { RepoGroupSection } from "@/features/contributions/components/repo-group-section";
import { useContributions } from "@/features/contributions/hooks/use-contributions";

export function ContributionsPage() {
    const { data, isPending, isError, refetch } = useContributions();

    return (
        <PageContainer>
            <PageHeader
                title="Contributions"
                description="Open-source issues I resolved, each with the merged pull request as proof. Pulled live from GitHub."
            />

            {isPending && (
                <div className="space-y-6">
                    <Skeleton className="h-24 border-2 border-border" />
                    <Skeleton className="h-64 border-2 border-border" />
                </div>
            )}

            {isError && <ErrorState message="Could not load contributions right now." onRetry={() => refetch()} />}

            {data &&
                (data.groups.length > 0 ? (
                    <div className="space-y-10 sm:space-y-12">
                        <ContributionStats summary={data.summary} />
                        <div className="space-y-12 sm:space-y-16">
                            {data.groups.map((group) => (
                                <RepoGroupSection key={group.repo.name} group={group} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <EmptyState>No contributions yet.</EmptyState>
                ))}
        </PageContainer>
    );
}
