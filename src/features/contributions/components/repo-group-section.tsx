import { Star } from "@phosphor-icons/react";
import type { RepoGroup } from "@/features/contributions/lib/contribution-helpers";
import { formatNumber } from "@/lib/utils";
import { IssueCard } from "./issue-card";

export function RepoGroupSection({ group }: { group: RepoGroup }) {
    const { repo, issues } = group;

    return (
        <section aria-label={repo.name} className="space-y-5">
            <div className="space-y-3 border-l-4 border-primary py-1 pl-4 sm:pl-5">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <h2 className="wrap-break-word font-heading text-xl font-bold sm:text-2xl">
                        <a
                            href={repo.url}
                            target="_blank"
                            rel="noreferrer"
                            className="underline-offset-4 hover:text-primary hover:underline"
                        >
                            {repo.name}
                        </a>
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                        {repo.language && (
                            <span className="border border-border px-2 py-0.5 text-foreground">{repo.language}</span>
                        )}
                        <span className="inline-flex items-center gap-1 border border-border px-2 py-0.5 text-muted-foreground">
                            <Star size={12} weight="fill" /> {formatNumber(repo.stars)}
                        </span>
                        <span className="border border-border bg-primary px-2 py-0.5 font-semibold text-primary-foreground">
                            {issues.length} {issues.length === 1 ? "issue" : "issues"}
                        </span>
                    </div>
                </div>
                {repo.about && (
                    <p className="line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{repo.about}</p>
                )}
            </div>

            <ul className="grid gap-5 md:grid-cols-2">
                {issues.map((issue) => (
                    <li key={issue.url} className="flex">
                        <IssueCard issue={issue} />
                    </li>
                ))}
            </ul>
        </section>
    );
}
