import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { PageContainer, PageHeader } from "@/components/ui/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { AppCard } from "../components/app-card";
import { useApps } from "../hooks/use-apps";

export function AppsPage() {
    const { data: apps, isPending, isError, refetch } = useApps();

    return (
        <PageContainer>
            <PageHeader
                title="Apps"
                description="Windows software I build and ship. Install numbers come straight from Microsoft Partner Center."
            />

            {isPending && (
                <div className="grid gap-5 md:grid-cols-2">
                    {Array.from({ length: 2 }, (_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: placeholder statis
                        <Skeleton key={i} className="h-64 border-2 border-border" />
                    ))}
                </div>
            )}

            {isError && <ErrorState message="Could not load apps right now." onRetry={() => refetch()} />}

            {apps &&
                (apps.length > 0 ? (
                    <div className="grid gap-5 md:grid-cols-2">
                        {apps.map((app) => (
                            <AppCard key={app.id} app={app} />
                        ))}
                    </div>
                ) : (
                    <EmptyState>No apps yet.</EmptyState>
                ))}
        </PageContainer>
    );
}
