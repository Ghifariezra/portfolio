import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react";
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

            <div className="space-y-4">
                {/* Graph card */}
                <div className="bg-card border-2 border-border rounded-lg p-6 relative overflow-hidden group hover:border-foreground transition-all hover:shadow-brutal dark:hover:shadow-none dark:hover:border-primary/50">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                        <GithubLogo weight="duotone" className="w-24 h-24 text-foreground" />
                    </div>

                    <div className="relative z-10 mb-6">
                        {contrib.isLoading ? (
                            <Skeleton className="h-10 w-40" />
                        ) : (
                            stats && (
                                <>
                                    <p className="font-heading text-4xl font-bold text-foreground leading-none">
                                        {stats.total.toLocaleString("en-US")}
                                    </p>
                                    <p className="font-mono text-xs text-muted-foreground mt-2 uppercase tracking-widest">
                                        contributions in the last year
                                    </p>
                                </>
                            )
                        )}
                    </div>

                    <div className="relative z-10">
                        {contrib.isLoading ? (
                            <Skeleton className="h-28 w-full" />
                        ) : (
                            stats && (
                                <ContributionGraph weeks={stats.weeks} showMonths showLegend />
                            )
                        )}
                    </div>
                </div>

                {/* Recent activity card */}
                <div className="bg-card border-2 border-border rounded-lg p-6 hover:border-foreground transition-all hover:shadow-brutal dark:hover:shadow-none dark:hover:border-primary/50">
                    <div className="flex items-center gap-2 mb-5">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                            Recent Activity
                        </h3>
                    </div>

                    <ul>
                        {activity.isLoading &&
                            Array.from({ length: 4 }).map((_, i) => (
                                <li key={i as unknown as string} className="py-2">
                                    <Skeleton className="h-10 w-full" />
                                </li>
                            ))}

                        {!activity.isLoading && events.length === 0 && (
                            <li className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                                No recent activity.
                            </li>
                        )}

                        {events.map((e) => (
                            <ActivityRow key={e.id} e={e} />
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}