import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { GitMerge, GitPullRequest } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { ContributionStats } from "@/features/contributions/components/contribution-stats";
import { useContributions } from "@/features/contributions/hooks/use-contributions";
import { cn, formatDate } from "@/lib/utils";
import { HOME_LINK_CLASS, HomeSection } from "./home-section";

const MAX_LATEST = 3;

export function ContributionsHighlightSection() {
    const { data, isPending, isError, refetch } = useContributions();

    // Issue terbaru dari semua repo, diurutkan berdasarkan tanggal ditutup.
    const latest = useMemo(
        () =>
            (data?.groups ?? [])
                .flatMap((group) => group.issues.map((issue) => ({ issue, repo: group.repo })))
                .sort((a, b) => b.issue.closedAt.localeCompare(a.issue.closedAt))
                .slice(0, MAX_LATEST),
        [data],
    );

    return (
        <HomeSection
            title="Open source"
            action={
                <Link to="/contribute" className={HOME_LINK_CLASS}>
                    All contributions →
                </Link>
            }
            isPending={isPending}
            isError={isError}
            onRetry={() => refetch()}
            isEmpty={latest.length === 0}
            skeleton={
                <div className="space-y-5">
                    <Skeleton className="h-20 border-2 border-border" />
                    <Skeleton className="h-48 border-2 border-border" />
                </div>
            }
        >
            <div className="space-y-5">
                {data && <ContributionStats summary={data.summary} />}

                <ul className="flex flex-col gap-3">
                    {latest.map(({ issue, repo }) => {
                        const pr = issue.pullRequests[0];
                        const merged = pr?.merged ?? false;
                        const Icon = merged ? GitMerge : GitPullRequest;

                        return (
                            <li key={issue.url}>
                                <a
                                    href={pr?.url ?? issue.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex items-start gap-3 border-2 border-border bg-card p-4 transition-colors hover:bg-muted"
                                >
                                    <Icon
                                        size={18}
                                        weight="bold"
                                        className={cn("mt-0.5 shrink-0", merged && "text-primary")}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-heading text-base font-semibold leading-snug group-hover:underline group-hover:underline-offset-4">
                                            {issue.title}
                                        </h3>
                                        <p className="mt-0.5 wrap-break-word font-mono text-xs text-muted-foreground">
                                            {repo.name} · #{issue.number} · {formatDate(issue.closedAt)}
                                        </p>
                                    </div>
                                    {merged && (
                                        <span className="hidden shrink-0 border border-border bg-primary px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-primary-foreground sm:inline">
                                            Merged
                                        </span>
                                    )}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </HomeSection>
    );
}
