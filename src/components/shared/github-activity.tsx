import { ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import {
    ActivityRow,
    ContributionGraph,
} from "@/components/shared/github-parts";
import { Skeleton } from "@/components/ui/skeleton";
import { publicActions } from "@/lib/actions/public.action";

export function GithubActivity() {
    const contrib = publicActions.useGetGithubContributions();
    const activity = publicActions.useGetGithubActivity(5);

    // GitHub down: section hilang, halaman lain tetap jalan.
    if (contrib.isError && activity.isError) return null;

    const stats = contrib.data?.data;
    const events = activity.data?.data ?? [];

    return (
        <section className="mb-20" id="github">
            <div className="flex justify-between items-end mb-8">
                <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground flex items-center gap-4">
                    <span className="w-8 h-0.5 bg-border block"></span>
                    GitHub Activity
                </h2>
                <Link
                    to="/github"
                    className="font-sans text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-1 shrink-0 ml-4"
                >
                    View All <ArrowUpRight weight="bold" className="w-4 h-4" />
                </Link>
            </div>

            <div className="bg-card border-2 border-border rounded-lg p-6 space-y-6">
                {stats && (
                    <p className="font-mono text-xs text-muted-foreground">
                        {stats.total} contributions in the last year
                    </p>
                )}

                {contrib.isLoading ? (
                    <Skeleton className="h-28 w-full" />
                ) : (
                    stats && <ContributionGraph weeks={stats.weeks} />
                )}

                <ul className="space-y-2 border-t-2 border-border pt-4">
                    {activity.isLoading && <Skeleton className="h-24 w-full" />}
                    {events.map((e) => (
                        <ActivityRow key={e.id} e={e} />
                    ))}
                </ul>
            </div>
        </section>
    );
}