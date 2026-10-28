import { CheckCircle, FolderSimple, GitMerge } from "@/components/ui/icons";
import type { ContributionSummary } from "@/features/contributions/lib/contribution-helpers";
import { cn, formatNumber } from "@/lib/utils";

export function ContributionStats({ summary, className }: { summary: ContributionSummary; className?: string }) {
    const items = [
        { short: "Issues", long: "Issues resolved", value: summary.issues, Icon: CheckCircle },
        { short: "Merged PRs", long: "Merged PRs", value: summary.mergedPullRequests, Icon: GitMerge },
        { short: "Repos", long: "Repositories", value: summary.repos, Icon: FolderSimple },
    ];

    return (
        <dl className={cn("grid grid-cols-3 border-2 border-border bg-card", className)}>
            {items.map(({ short, long, value, Icon }, i) => (
                <div
                    key={short}
                    className={cn("flex flex-col gap-1 p-3 sm:gap-2 sm:p-5", i > 0 && "border-l-2 border-border")}
                >
                    <dt className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground sm:text-xs">
                        <Icon size={14} weight="bold" className="hidden shrink-0 text-primary sm:block" />
                        <span className="sm:hidden">{short}</span>
                        <span className="hidden sm:inline">{long}</span>
                    </dt>
                    <dd className="font-heading text-3xl font-bold leading-none sm:text-4xl">{formatNumber(value)}</dd>
                </div>
            ))}
        </dl>
    );
}
