import { ArrowUpRight, CheckCircle, GitMerge, GitPullRequest } from "@/components/ui/icons";
import { TagList } from "@/components/ui/tag-list";
import type { ClosedIssue, ContributionPullRequest } from "@/features/contributions/schemas/contribution.schema";
import { cn, formatDate } from "@/lib/utils";

const LINK_CLASS = "underline-offset-4 hover:text-primary hover:underline";

function PullRequestItem({ pr }: { pr: ContributionPullRequest }) {
    const Icon = pr.merged ? GitMerge : GitPullRequest;
    const meta = [`#${pr.number}`, pr.author && `by ${pr.author}`, pr.merged && pr.mergedAt && formatDate(pr.mergedAt)]
        .filter(Boolean)
        .join(" · ");

    return (
        <li>
            <a
                href={pr.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-3 border-2 border-border p-3 transition-colors hover:bg-muted"
            >
                <Icon size={18} weight="bold" className={cn("mt-0.5 shrink-0", pr.merged && "text-primary")} />
                <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm font-semibold leading-snug">{pr.title}</p>
                    <p className="font-mono text-xs text-muted-foreground">{meta}</p>
                </div>
                <span
                    className={cn(
                        "shrink-0 border border-border px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase",
                        pr.merged ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                    )}
                >
                    {pr.merged ? "Merged" : "Not merged"}
                </span>
            </a>
        </li>
    );
}

export function IssueCard({ issue }: { issue: ClosedIssue }) {
    const labels = issue.labels.map((label) => ({ key: label, label }));

    return (
        <article className="flex w-full flex-col border-2 border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0] hover:shadow-border">
            <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-primary">
                        <CheckCircle size={14} weight="fill" />
                        Resolved · #{issue.number}
                    </span>
                    <time dateTime={issue.closedAt}>{formatDate(issue.closedAt)}</time>
                </div>

                <h3 className="font-heading text-base font-semibold leading-snug sm:text-lg">
                    <a href={issue.url} target="_blank" rel="noreferrer" className={cn("group inline", LINK_CLASS)}>
                        {issue.title}
                        <ArrowUpRight size={14} weight="bold" className="ml-1 inline align-baseline" />
                    </a>
                </h3>

                {issue.author && <p className="font-mono text-xs text-muted-foreground">opened by {issue.author}</p>}
                {labels.length > 0 && <TagList tags={labels} size="sm" max={4} />}
            </div>

            <div className="border-t-2 border-border bg-muted/30 p-4 sm:p-5">
                <h4 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Evidence
                </h4>
                {issue.pullRequests.length > 0 ? (
                    <ul className="space-y-2">
                        {issue.pullRequests.map((pr) => (
                            <PullRequestItem key={pr.url} pr={pr} />
                        ))}
                    </ul>
                ) : (
                    <p className="font-mono text-xs text-muted-foreground">No linked pull request.</p>
                )}
            </div>
        </article>
    );
}
